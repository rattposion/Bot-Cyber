const Discord = require("discord.js");
const { ActionRowBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "criardrop",
  description: "[💰| Vendas Moderação] Crie um drop",
  type: Discord.ApplicationCommandType.ChatInput,


  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    const modal = new Discord.ModalBuilder()
      .setCustomId('criar-drop-modal')
      .setTitle('Criar um Drop');

    const pergunta01 = new Discord.TextInputBuilder()
      .setCustomId('codigo-drop')
      .setLabel('Código:')
      .setStyle(Discord.TextInputStyle.Short)
      .setPlaceholder('Insira o código deste drop.')
      .setRequired(true);

    const pergunta02 = new Discord.TextInputBuilder()
      .setCustomId('premio-drop')
      .setLabel('O que será entregue?')
      .setPlaceholder('Descreva o que o usuário irá receber ao resgatar este drop.')
      .setMaxLength(500)
      .setStyle(Discord.TextInputStyle.Paragraph)
      .setRequired(true);

    const p1 = new ActionRowBuilder().addComponents(pergunta01)
    const p2 = new ActionRowBuilder().addComponents(pergunta02)

    modal.addComponents(p1, p2)

    await interaction.showModal(modal);
  }
}