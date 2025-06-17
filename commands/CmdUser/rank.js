const Discord = require("discord.js");
const { rank } = require("../../FunctionsAll/Criados");
module.exports = {
  name: "rank",
  description: '[🛠|💰 Vendas Moderação] Veja o rank das pessoas que mais compraram',
  type: Discord.ApplicationCommandType.ChatInput,
  

  run: async (client, interaction) => {
    rank(interaction, client)

  }
}