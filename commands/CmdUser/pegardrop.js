const Discord = require("discord.js");

module.exports = {
  name: "pegardrop",
  description: "[💰| Vendas Moderação] Pegar um Drop",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "codigo",
      description: "Coloque o codigo aqui!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const codigo = interaction.options.getString('codigo')
    var dropp = client.db.drops.get(codigo)
    if (dropp == null) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Esse código não existe!`, ephemeral: true })




    const embed = new Discord.EmbedBuilder()
      .setTitle('Drop resgatado com sucesso!')
      .addFields(
        { name: `${client.db.General.get(`emojis.chavefenda`)} | Código:`, value: `${codigo}` },
        { name: `${client.db.General.get(`emojis.caixa`)} | Item Resgatado:`, value: `${dropp.premio}` }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    interaction.reply({ embeds: [embed], ephemeral: true })
    try {
      await interaction.member.send({ embeds: [embed] })
    } catch (error) {
    }

    const log = interaction.guild.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
    try {
      const embed01 = new Discord.EmbedBuilder()
        .setDescription(`O ${interaction.user} acabou de pegar um drop.`)
        .addFields(
          { name: `${client.db.General.get(`emojis.chavefenda`)} | Código:`, value: `${codigo}` },
          { name: `${client.db.General.get(`emojis.caixa`)} | Item Resgatado:`, value: `${dropp.premio}` }
        )
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

      await log.send({embeds: [embed01]})
    } catch (error) {

    }
    client.db.drops.delete(codigo)
  }
}