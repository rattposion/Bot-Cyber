const Discord = require("discord.js");
const { rankprosdutos } = require("../../FunctionsAll/Criados");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "rankprodutos",
  description: "[🛠|Moderação] vejam os produtos que mais geraram lucros.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    rankprosdutos(interaction, client)

  }
}