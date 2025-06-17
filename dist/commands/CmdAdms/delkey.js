const Discord = require("discord.js");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "delkey",
  description: '[🛠|💰 Vendas Moderação] Deletar uma key',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "key",
      description: "Coloque a key aqui!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    let key = interaction.options.getString('key');

    var uu = client.db.Keys.get(key)

    if (uu == null) {
      return interaction.reply({
        content: `${global.emoji.certo} O produto \`${key}\` foi deletado do servidor.`,
        ephemeral: true
      });
    }

    interaction.reply({
      content: `${global.emoji.certo} O produto \`${key}\` foi deletado do servidor.`,
      ephemeral: true
    });
    client.db.Keys.delete(key)
  }
}