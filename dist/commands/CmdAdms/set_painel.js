const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "set_painel",
  description: "[💰| Vendas Moderação] Sete o Painel",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'id',
      description: 'Coloque o id do produto que deseja setar a mensagem!',
      type: 3,
      required: true,
      autocomplete: true
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const productId = interaction.options._hoistedOptions[0].value;

    if (!permissionsInstance.get(interaction.user.id)) {
      return interaction.reply({
        content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`,
        ephemeral: true
      });
    }

    if (productId === 'nada') {
      return interaction.reply({
        content: `${global.emoji.errado} Nenhum produto registrado em seu BOT.`,
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `${client.db.General.get(`emojis.loading_promisse`)} | Definindo painel novamente...`,
      ephemeral: true
    });

    const painel = client.db.PainelVendas.get(productId);
    const produtos = painel.produtos;

    const embedColor = client.db.General.get(`ConfigGeral.ColorEmbed`) === '#008000' ? `#000000` : client.db.General.get(`ConfigGeral.ColorEmbed`);
    const embed = new EmbedBuilder()
      .setTitle(painel.settings.title)
      .setDescription(painel.settings.desc)
      .setColor(client.db.PainelVendas.get(`${productId}.settings.color`) || embedColor);

    if (painel.settings.banner) embed.setImage(painel.settings.banner);
    if (painel.settings.miniatura) embed.setThumbnail(painel.settings.miniatura);
    if (painel.settings.rodape) embed.setFooter({ text: painel.settings.rodape });


    await enviarPainel(interaction, client, painel, productId, embed, produtos);
  }
};

// Função separada para enviar o painel
async function enviarPainel(interaction, client, painel, productId, embed, produtos, isRetry = false) {

  const options = [];

  produtos.forEach(produtoId => {
    const produto = client.db.produtos.get(produtoId);
    options.push({
      label: produto.settings.name,
      description: `💸 | Valor: ${Number(produto.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })} - 📦 | Estoque: ${Object.keys(produto.settings.estoque).length}`,
      emoji: produto.painel ? produto.painel.emoji : '🛒',
      value: produto.ID
    });
  });

  if (options.length === 0) {
    options.push({
      label: "Nenhum Produto Cadastrado nesse Painel!",
      emoji: "1229787813046915092",
      value: "nada"
    });
  }



  const menu = new StringSelectMenuBuilder()
    .setCustomId('buyprodutoporselect')
    .setPlaceholder(client.db.PainelVendas.get(`${productId}.settings.placeholder`) || 'Selecione um Produto')
    .addOptions(options);

  const actionRow = new ActionRowBuilder().addComponents(menu);
  const rows = [actionRow];

  if (client.db.General.get(`ConfigGeral.statusduvidas`)) {
    const button = new ButtonBuilder()
      .setURL(client.db.General.get(`ConfigGeral.channelredirectduvidas`) || 'https://www.youtube.com/')
      .setLabel(client.db.General.get(`ConfigGeral.textoduvidas`) || 'Dúvida')
      .setStyle(5)
      .setEmoji(client.db.General.get(`ConfigGeral.emojiduvidas`) || '🔗');

    rows.push(new ActionRowBuilder().addComponents(button));
  }

  try {
    await interaction.channel.send({ embeds: [embed], components: rows }).then(async msg => {
      try {
        const channel = await client.channels.fetch(painel.ChannelID);
        const fetchedMessage = await channel.messages.fetch(painel.MessageID);
        await fetchedMessage.delete();
      } catch (error) { }

      client.db.PainelVendas.set(`${productId}.MessageID`, msg.id);
      client.db.PainelVendas.set(`${productId}.ChannelID`, msg.channel.id);

      interaction.editReply({
        content: `${client.db.General.get(`emojis.certo`)} | Mensagem Atualizada!`,
        ephemeral: true
      });
    });
  } catch (error) {

    if (error.code === 50035 && error.rawError?.errors?.components && !isRetry) {
      interaction.editReply({
        content: `${client.db.General.get(`emojis.loading_promisse`)} | Removendo emojis inválidos...`,
        ephemeral: true
      });

      const produtosComErro = new Set();

      const parseErrors = async (obj, path = '') => {
        if (Array.isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            await parseErrors(obj[i], `${path}.${i}`);
          }
        } else if (typeof obj === 'object' && obj !== null) {
          for (const key in obj) {
            if (key === '_errors') {
              for (const err of obj[key]) {
                if (err.code === 'BUTTON_COMPONENT_INVALID_EMOJI') {
                  const match = path.match(/components\.(\d+)\.components\.(\d+)\.options\.(\d+)/);
                  if (match) {
                    const optionIndex = Number(match[3]);
                    produtosComErro.add(optionIndex);
                  }
                }
              }
            } else {
              await parseErrors(obj[key], `${path}.${key}`);
            }
          }
        }
      };

      await parseErrors(error.rawError.errors.components, 'components');

      for (const index of produtosComErro) {
        const produtoComErro = options[index];
        await client.db.produtos.delete(`${produtoComErro.value}.painel`);
      }

      if (produtosComErro.size > 0) {
        const painel2 = client.db.PainelVendas.get(productId);
        const produtos2 = painel.produtos;
        await enviarPainel(interaction, client, painel2, productId, embed, produtos2, true); // <-- retry com flag
      }
    } else {
      interaction.editReply({
        content: `${client.db.General.get(`emojis.errado`)} Ocorreu um erro ao tentar criar o painel.`,
        ephemeral: true
      });
    }
  }
}
