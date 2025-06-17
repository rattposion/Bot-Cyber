const Discord = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "conectar",
  description: '[🛠 | Vendas Moderação] Faz o bot entrar em um canal de voz',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'canal',
      description: 'Coloque o canal de voz aqui!',
      type: Discord.ApplicationCommandOptionType.Channel,
      channelTypes: [2],
      required: true
    }
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    await interaction.reply({ content: `${obterEmoji(10)} Aguarde...`, ephemeral: true })

    const canal = interaction.options.getChannel('canal')

    const connection = joinVoiceChannel({
      channelId: canal.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    })

    if (connection) {
      client.db.General.set(`ConfigGeral.CanalVoz`, { guild: interaction.guild.id, channel: canal.id })
      const embed = new Discord.EmbedBuilder()
        .setAuthor({
          name: `${global.emoji.certo} O bot ${client.user.username} foi adicionado com sucesso à chamada selecionada!`
        })
        .setColor('Green');

      return interaction.editReply({ content: ``, embeds: [embed], ephemeral: true })
    } else {
      const embed = new Discord.EmbedBuilder()
        .setAuthor({
          name: `${global.emoji.errado} O bot ${client.user.username} não foi adicionado à chamada selecionada!`
        })
        .setColor('Red');

      return interaction.editReply({ content: ``, embeds: [embed], ephemeral: true })
    }
  }
}