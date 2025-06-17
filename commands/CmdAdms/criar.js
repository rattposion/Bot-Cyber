const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType } = require("discord.js");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "criar",
  description: "[💰| Vendas Moderação] Cadastra um novo produto no bot",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'nome',
      description: 'Coloque o NOME do produto!',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) {
      return interaction.reply({
        content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`,
        ephemeral: true
      });
    }

    const nome = interaction.options.getString('nome');

    if (String(nome).length > 35) {
      return interaction.reply({
        content: `${global.emoji.errado} O nome do produto não pode ter mais de 35 caracteres.`,
        ephemeral: true
      });
    }

    if (String(nome).length < 3) {
      return interaction.reply({
        content: `${global.emoji.errado} O nome do produto deve ter no mínimo 3 caracteres.`,
        ephemeral: true
      });
    }

    // Gerar ID único
    let id;
    do {
      id = Math.random().toString(36).substring(2, 12);
    } while (client.db.produtos.get(id) !== null);

    const embeddesc = client.db.DefaultMessages.get(`ConfigGeral`);
    const preco = Number(10).toLocaleString(global.lenguage.um, {
      style: 'currency',
      currency: global.lenguage.dois
    });

    const desc = 'Não configurado ainda...';

    const embed = new EmbedBuilder()
      .setTitle(embeddesc.embedtitle.replace('#{nome}', String(nome)))
      .setDescription(embeddesc.embeddesc
        .replace('#{nome}', String(nome))
        .replace('#{preco}', preco)
        .replace('#{estoque}', 0)
        .replace('#{desc}', desc)
      )
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) === '#008000' ? '#ADD8E6' : client.db.General.get(`ConfigGeral.ColorEmbed`));

    // Definir cor do botão
    const corBotoes = {
      Vermelho: ButtonStyle.Danger,
      Azul: ButtonStyle.Primary,
      Verde: ButtonStyle.Success,
      Cinza: ButtonStyle.Secondary
    };
    const color = corBotoes[embeddesc.colorbutton] || ButtonStyle.Success;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(id)
        .setLabel(client.db.DefaultMessages.get(`ConfigGeral.textbutton`) || 'Comprar')
        .setStyle(color)
        .setEmoji(embeddesc.emojibutton || '1155184226283561092')
    );

    // Adicionar botão extra se canal de tickets estiver ativo
    if (client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelTicket`)) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`irateduvida`)
          .setLabel(client.db.DefaultMessages.get(`ConfigGeral.textbutton`) || 'Comprar')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(client.db.DefaultMessages.get(`ConfigGeral.emojibutton`))
      );
    }

    // Botão de dúvidas com link
    if (client.db.General.get(`ConfigGeral.statusduvidas`)) {
      row.addComponents(
        new ButtonBuilder()
          .setURL(client.db.General.get(`ConfigGeral.channelredirectduvidas`) || 'https://www.youtube.com/')
          .setLabel(client.db.General.get(`ConfigGeral.textoduvidas`) || 'Dúvida')
          .setStyle(ButtonStyle.Link)
          .setEmoji(client.db.General.get(`ConfigGeral.emojiduvidas`) || '🔗')
      );
    }

    const rows = [row];

    const embedEnabled = client.db.General.get(`ConfigGeral.EstiloMensagens`) !== true;

    const mensagem = embedEnabled
      ? { embeds: [embed], components: rows }
      : { content: desc, components: rows };

    interaction.channel.send(mensagem).then((msg) => {
      client.db.produtos.set(id, {
        ID: id,
        MessageID: msg.id,
        ChannelID: msg.channel.id,
        embedconfig: {
          cupom: true
        },
        settings: {
          price: 10,
          name: embedEnabled ? String(nome) : 'Não configurado ainda...',
          desc: 'Não configurado ainda...',
          estoque: []
        }
      });
    });

    interaction.reply({
      content: `${global.emoji.certo} Produto criado com sucesso! Use /config \`${id}\` para configurá-lo.`,
      ephemeral: true
    });
  }
};
