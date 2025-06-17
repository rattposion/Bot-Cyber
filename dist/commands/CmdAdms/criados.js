const Discord = require("discord.js");
const { CriadosStart } = require("../../FunctionsAll/Criados");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "criados",
  description: "[🛠| Vendas Moderação] Veja todos os ptodutos, cupons, keys, etc. cadastrados no bot.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    CriadosStart(interaction,client)
  }
}