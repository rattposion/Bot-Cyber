const Discord = require("discord.js");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "nuke",
  description: "[🤖] Resetar um Canal e tirar marcações",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'canal',
      type: Discord.ApplicationCommandOptionType.Channel,
      channelTypes: [Discord.ChannelType.GuildText, Discord.ChannelType.GuildVoice],
      description: 'Canal que deseja resetar',
      required: false
    }
  ],
  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    const channel = interaction.options.getChannel('canal') || interaction.channel

    await interaction.reply({
      content: `${client.db.General.get('emojis.loading_promisse')} | Resetando o canal ${channel}...`,
      ephemeral: true
    });
    const newChannel = await channel.clone()
    await channel.delete()

    newChannel.send({
      content: `${global.emoji.certo} \`Nucked by ${interaction.user.username}\``
    });
  }
}