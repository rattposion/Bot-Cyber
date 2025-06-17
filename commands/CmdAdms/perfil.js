const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "perfil",
  description: '[🧀 | 💰 Vendas Ultilidades] Veja o seu pergil ou o perfil de algum usuário',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Selecione o usuário abaixo:",
      type: Discord.ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    let valor = interaction.options.getUser('user');

    var usu = null
    if (valor == null) {
      usu = interaction.user.id
    } else {
      usu = valor.id
    }

    const member = await interaction.guild.members.fetch(usu);



    if (client.db.usuariosinfo.get(`${usu}.qtdprodutos`) == null) {
      client.db.usuariosinfo.set(`${usu}.qtdprodutos`, 0)
    }
    if (client.db.usuariosinfo.get(`${usu}.gastos`) == null) {
      client.db.usuariosinfo.set(`${usu}.gastos`, 0)
    }

    var hh = client.db.usuariosinfo.fetchAll()
    hh.sort((a, b) => b.data.gastos - a.data.gastos);
    const posicao = hh.findIndex(obj => obj.ID === usu);

    let ultimacompra = client.db.usuariosinfo.get(`${usu}.ultimacompra`) ? `<t:${Math.floor(client.db.usuariosinfo.get(`${usu}.ultimacompra`)/ 1000)}:R>` : 'Nenhuma compra realizada'

    let desc = interaction.user.id == usu ? `- Olá ${interaction.user}, veja o seu perfil abaixo:` : `- Olá ${interaction.user}, veja o perfil de **${member.user.username}** abaixo:`
    let thumb = interaction.user.id == usu ? `${interaction.user.displayAvatarURL()}` : `${member.user.displayAvatarURL()}`
    let lyric = interaction.user.id == usu ? `${interaction.user.username}` : `${member.user.username}`

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Perfil de ${lyric}`, iconURL: `${member.user.displayAvatarURL()}` })
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(thumb)
      .setDescription(desc)
      .setFields(
        { name: `${client.db.General.get(`emojis.caixa`)} | Produtos Comprados:`, value: `\`${client.db.usuariosinfo.get(`${usu}.qtdprodutos`)}\``, inline: false },
        { name: `💵 | Já gasto:`, value: `\`\`${client.db.usuariosinfo.get(`${usu}.gastos`) == null ? 'R$ 0.00' : `${Number(client.db.usuariosinfo.get(`${usu}.gastos`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`}\`\``, inline: false },
        { name: `${client.db.General.get(`emojis.sacola`)} | Saldo:`, value: `\`${client.db.PagamentosSaldos.get(`${usu}.SaldoAccount`) == null ? 'R$ 0.00' : `${Number(client.db.PagamentosSaldos.get(`${usu}.SaldoAccount`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`}\``, inline: false },
        { name: `📅 | Ultima Compra:`, value: `${ultimacompra}`, inline: false},
        { name: `🏆 | Rank:`, value: `\`${posicao + 1}° do rank\``, inline: false },
      )


    interaction.reply({ embeds: [embed], ephemeral: true})
  }
}