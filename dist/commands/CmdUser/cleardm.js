const Discord = require("discord.js");

module.exports = {
  name: "cleardm",
  description: "[🛠| Utilidades] Limpe todas as mensagens do bot na sua DM!",
  type: Discord.ApplicationCommandType.ChatInput,


  run: async (client, interaction) => {
    const dm = await interaction.member.createDM();
    const deleteMessages = await dm.messages.fetch({ limit: 100 });
    let deletedCount = 0;
    await interaction.reply({ephemeral: true, content: `${client.db.General.get(`emojis.loading_promisse`)} | Irei apagar todas as mensagens da nossa conversa privada!` });

    deleteMessages.forEach(async (msg) => {
      if (msg.author.bot) {
        await msg.delete();
        deletedCount++;
        await interaction.editReply({ephemeral: true, content: `${client.db.General.get(`emojis.certo`)} | Total de mensagens apagadas: ${deletedCount}` });
      }
    });
  }
}
