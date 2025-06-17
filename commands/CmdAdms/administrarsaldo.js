const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "administrarsaldo",
  description: "[💰 | Vendas e Moderação] Gerenciar e monitorar o saldo de usuários.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "ação",
      description: "Qual ação deseja realizar?",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
      choices: [{
        name: 'Adicionar',
        value: 'adicionar'
      },
      {
        name: 'Remover',
        value: 'remover'
      },
      ]
    },
    {
      name: "user",
      description: "usuário que vai receber a ação?",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "valor",
      description: "Adicionar ou Remover Qual valor?",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    }
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    let acao = interaction.options.getString('ação');
    let user = interaction.options.getUser('user');
    let valor = interaction.options.getNumber('valor');

    if (acao == 'adicionar') {
      var u = client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)

      client.db.PagamentosSaldos.set(`${user.id}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)) + Number(valor))

      const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`Saldo adicionado para ${user.username}`)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`O <@${user.id}> tinha ${Number(u).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}, foi adicionado ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}, agora ele está com ${Number(client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`)
        .setFooter({ text: `Autor: ${interaction.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp()

      interaction.reply({
        embeds: [embed], components: [], ephemeral: true
      })
    } else {
      var u = client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)

      if (valor > u) {
        return interaction.reply({
          ephemeral: true,
          content: `${client.db.General.get(`emojis.errado`)} O usuário ${user} não possui a quantidade que você deseja remover. Ele atualmente possui (\`${Number(u).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`).`
        });
      }
      client.db.PagamentosSaldos.set(`${user.id}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)) - Number(valor))

      const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`Saldo retirado do ${user.username}`)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`O <@${user.id}> tinha \`${Number(u).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`, foi removido \`${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`, agora ele está com \`${Number(client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``)
        .setFooter({ text: `Autor: ${interaction.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp()

      interaction.reply({
        embeds: [embed], components: [], ephemeral: true
      })
    }
  }
}