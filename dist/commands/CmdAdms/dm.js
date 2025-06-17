const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "dm",
  description: '[🛠 | Moderação] Envie uma mensagem no privado de um usuário.',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'usuário',
      description: 'Mencione um usuário.',
      type: Discord.ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: 'mensagem',
      description: 'Envie algo para ser enviado.',
      type: Discord.ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })


    const member = interaction.options.getUser('usuário')
    const msg = interaction.options.getString('mensagem')

    const channela = client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));

    try {

      channela.send({
        content: `${global.emoji.certo} O usuário ${interaction.user} enviou uma mensagem para o membro ${member} através do comando /dm, com a seguinte mensagem:\n\n${msg}`
      });
    } catch (error) {

    }

    try {

      member.send({ content: `${msg}` })
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `Mensagem enviada para ${member.tag}`, iconURL: `https://cdn.discordapp.com/emojis/1249255825340502088.webp?size=96&quality=lossless` })
            .setColor('Green')
        ], ephemeral: true
      })
    } catch (error) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ name: `Erro ao enviar mensagem para ${member.tag}`, iconURL: `https://cdn.discordapp.com/emojis/1249255826602852372.webp?size=96&quality=lossless` })
            .setColor('Red')
        ], ephemeral: true
      })
    }
  }
}