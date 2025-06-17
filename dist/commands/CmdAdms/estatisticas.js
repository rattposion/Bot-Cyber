const Discord = require("discord.js");
const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");
module.exports = {
  name: "estatisticas",
  description: '[🛠|💰 Vendas Moderação] Veja as estatistica de venda do bot',
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("todayyyy")
          .setLabel('Hoje')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("7daysss")
          .setLabel('Últimos 7 dias')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("30dayss")
          .setLabel('Últimos 30 dias')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("totalrendimento")
          .setLabel('Rendimento Total')
          .setStyle(3)
          .setDisabled(false),
      )

    interaction.reply({ content: `Olá senhor ${interaction.user}, selecione algum filtro.`, components: [row], ephemeral: true })


  }
}

