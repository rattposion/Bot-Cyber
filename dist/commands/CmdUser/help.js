const Discord = require("discord.js");
const { ButtonBuilder, ComponentType, ActionRowBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('permissionsmesww2222sage2')
module.exports = {
  name: "help",
  description: '[🛠 | Informações] Exibe todos os meus comandos.',
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    const editEmbed = {
      content: `⚠️ | Use o Comando Novamente!`,
      components: [],
      embeds: []
    };

    const editMessage = async (message) => {
      try {
        await message.edit(editEmbed)
      } catch (error) {

      }

    };

    const createCollector = (message) => {
      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000
      });

      collector.on('collect', () => {
        collector.stop();
      });

      collector.on('end', (collected) => {
        if (collected.size === 0) {

          editMessage(message);

        }
      });
    };

    const embed = new Discord.EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setTitle(`${client.user.username} | Comandos Liberados Para todos os Usuários`)
      .addFields(
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /help`,
          value: `\`Exibe essa mensagem.\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /perfil`,
          value: `\`Mostra o perfil de quem enviou o comando.\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /rank`,
          value: `\`Mostra o rank de pessoas que mais compraram.\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /adicionarsaldo`,
          value: `\`Adiciona saldo via pix.\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /ativarkey`,
          value: `\`Resgata uma key.\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /resgatargift`,
          value: `\`Resgata um gift.\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /pegardrop \`CÓDIGO\``,
          value: `\`Pega um drop.\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /cleardm`,
          value: `\`Apagar as mensagens do bot da sua dm.\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /info \`ID DA COMPRA\``,
          value: `\`Mostra informações da compra que você colocou o ID.(Liberado apenas para quem comprou e para os Adm)\``
        },
        {
          name: `${client.db.General.get(`emojis.chavefenda`)} /pegar \`ID DA COMPRA\``,
          value: `\`Mostra o Produto que foi Entregue da compra que você colocou o ID.(Liberado apenas para quem comprou e para os Adm)\``
        }
      )
      .setFooter({ text: `Página 1/2`, iconURL: `${client.user.displayAvatarURL()}` })

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("wdgjujujcojujmandosuajujujudmhelp")
          .setLabel('Comandos Adm')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),
      )

    interaction.reply({ embeds: [embed], components: [row] }).then(async u => {
      const messages = await interaction.channel.messages.fetch({ limit: 1 });
      const lastMessage = messages.first();
      uu.set(lastMessage.id, interaction.user.id)
      createCollector(u)
    })
  }
}
