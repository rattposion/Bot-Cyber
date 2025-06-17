const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "info",
  description: '[🧀|💰 Vendas Utilidades] Mostra informações da compra que você colocou o ID',
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
    const timestamp = Date.parse(tt.Data);
    let timestamp2 = Math.floor(timestamp / 1000)

    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)

      .setDescription(`${client.db.General.get(`emojis.info`)} | Pedido abaixo: \`${valor}\``)
      .addFields(
        { name: `${client.db.General.get(`emojis.pessoafone`)} | Compra Feita Por:`, value: `<@${tt.user}> (\`${tt.user}\`)` },
        { name: `${client.db.General.get(`emojis.caixa`)} | Produto(s) Comprado(s):`, value: `\`${tt.ProdutosComprados}\`` },
        { name: `${client.db.General.get(`emojis.sacola`)} | Valor Pago:`, value: `\`${Number(tt.valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`` },
        { name: `${client.db.General.get(`emojis.dev`)} | Método de Pagamento:`, value: `\`${tt.Metodo}\`` },
        { name: `${client.db.General.get(`emojis.chavefenda`)} | Cupom:`, value: `${tt.cupomaplicado == undefined ? '\`Nenhum cupom utilizado.\`' : `\`${tt.cupomaplicado}\` (\`${Number(tt.valordodesconto).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`)`}` },
         { name: `🕐 | Data da Compra:`, value: `<t:${timestamp2}> (<t:${timestamp2}:R>)` },
      )

    interaction.reply({ embeds: [embed], ephemeral: true })
  }
}