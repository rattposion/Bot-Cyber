const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");


module.exports = {
  name: "pegar",
  description: '[🧀|💰 Vendas Utilidades] Mostra o Produto que foi Entregue da compra que você colocou o ID',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "id",
      description: "ID da compra que deseja verificar",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })


    let valor = interaction.options.getString('id');

    var tt = client.db.StatusCompras.get(valor)

    if (tt == null) {
      return interaction.reply({
        content: `${global.emoji.errado} Compra não encontrada!`
      });
    }

    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)
      .setTitle(`${client.db.General.get(`emojis.info`)} | Mostrando a compra de Id: ${valor}`)
      .setDescription(`${client.db.General.get(`emojis.pessoafone`)} **| Compra Feita Por:**\n<@${tt.user}> **- ${tt.user}**\n\n${client.db.General.get(`emojis.caixa`)} **| Produto(s) Comprado(s):**\n\`${tt.messageinfoprodutos}\`\n\n${client.db.General.get(`emojis.sacola`)} **| Valor Pago:**\n\`${Number(tt.valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n\n**${client.db.General.get(`emojis.caixa`)} | Produto(s) Entregue(s):**\n\`${tt.produtosentregue}\``)

    interaction.user.send({ embeds: [embed] })

    interaction.reply({
      content: `${global.emoji.certo} Verifique seu privado.`,
      ephemeral: true
    });
  }
}