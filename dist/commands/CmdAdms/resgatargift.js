const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "resgatargift",
  description: "[💰| Vendas Utilidades] Resgate um gift",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "codigo",
      description: "Coloque sua Key aqui!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let key = interaction.options.getString('codigo');
    var keyverify = await client.db.giftcards.get(key)
    if (keyverify == null) {
      return interaction.reply({
        content: `${global.emoji.errado} Você tentou resgatar um gift inexistente.`,
        ephemeral: true
      });
    }
    client.db.PagamentosSaldos.set(`${interaction.user.id}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)) + Number(keyverify.valor))
    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)
      .setTitle(`Gift resgatado com sucesso.`)
      .setDescription(`Você acabou de resgatar um gift no valor de: \`${Number(keyverify.valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\` , agora você está com \`${Number(client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``)
      .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
      .setTimestamp()


    interaction.reply({ embeds: [embed], ephemeral: true })
    client.db.giftcards.delete(key)

    const log = interaction.guild.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
    try {
      const embed01 = new Discord.EmbedBuilder()
        .setDescription(`O ${interaction.user} acabou de resgatar um gift.`)
        .addFields(
          { name: `${client.db.General.get(`emojis.chavefenda`)} | Gift:`, value: `${key}` },
          { name: `💸 | Valor do Gift:`, value: `\`${Number(keyverify.valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`` }
        )
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

      await log.send({ embeds: [embed01] })
    } catch (error) {

    }

  }
}
