const Discord = require("discord.js");
const { updateMessageConfig } = require("../../FunctionsAll/BotConfig");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "botconfig",
  description: "[💰 | Vendas e Moderação] Configurar as opções do bot.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })
    updateMessageConfig(interaction, client)
  }
}