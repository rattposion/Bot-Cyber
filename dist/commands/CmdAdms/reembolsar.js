const Discord = require("discord.js");
const axios = require('axios');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "reembolsar",
  description: '[🛠|💰 Vendas Moderação] Reembolsa de forma automática um pagamento',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "id",
      description: "ID da compra que deseja verificar",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    let valor = interaction.options.getNumber('id');

    var tt = client.db.StatusCompras.get(`${valor}`)

    if (tt == null) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Compra não encontrada!`, ephemeral: true })
    if (tt.Status == 'Entregue') {
      if (tt.Metodo == "Saldo") {

        interaction.reply({ content: `${client.db.General.get(`emojis.loading_promisse`)} | Reembolsando...`, ephemeral: true })
        setTimeout(async () => {
          const channel = await client.channels.fetch(tt.IDChannelLogs);
          const fetchedMessage = await channel.messages.fetch(tt.IDMessageLogs);
          if (fetchedMessage) {
            fetchedMessage.edit({
              content: `\n${client.db.General.get(`emojis.certo`)} | Reembolso aprovado\n🔍 | ID do Pagamento: ${tt.IdCompra}\n💸 | Valor Reembolsado: ${Number(tt.valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`, components: []
            });
          }

          interaction.editReply({
            content: `${client.db.General.get(`emojis.certo`)} | Reembolso aprovado\n🔍 | ID do Pagamento: ${tt.IdCompra}\n💸 | Valor Reembolsado: ${Number(tt.valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`, ephemeral: true
          });


          client.db.PagamentosSaldos.set(`${tt.user}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${tt.user}.SaldoAccount`)) + Number(tt.valortotal))
          client.db.StatusCompras.set(`${valor}.Status`, 'Reembolsado')
        }, 3000);
      } else if (tt.Metodo == "Pix" || tt.Metodo == "Site") {
        interaction.reply({ content: `${client.db.General.get(`emojis.loading_promisse`)} | Reembolsando...`, ephemeral: true })
        const urlReembolso = `https://api.mercadopago.com/v1/payments/${valor}/refunds`;
        const headers = {
          Authorization: `Bearer ${client.db.General.get(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`)}`,
        };
        const body = {
          metadata: {
            reason: 'Motivo do reembolso',
          },
        };
        axios.post(urlReembolso, body, { headers })
          .then(async response => {
            client.db.StatusCompras.set(`${valor}.Status`, 'Reembolsado')
            const channel = await client.channels.fetch(tt.IDChannelLogs);
            const fetchedMessage = await channel.messages.fetch(tt.IDMessageLogs);
            if (fetchedMessage) {
              fetchedMessage.edit({
                content: `\n${client.db.General.get(`emojis.certo`)} | Reembolso aprovado\n🔍 | ID do Pagamento: ${tt.IdCompra}\n💸 | Valor Reembolsado: ${Number(tt.valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`, components: []
              });



              interaction.editReply({
                content: `
${client.db.General.get(`emojis.certo`)} | Reembolso aprovado\n🔍 | ID do Pagamento: ${tt.IdCompra}\n💸 | Valor Reembolsado: ${Number(tt.valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`, ephemeral: true
              });
            }
          })
          .catch(error => {

            interaction.editReply({ content: `Erro ao emitir o reembolso: ${error.response.data.message}`, ephemeral: true });
          });
      } 

    } else {
      return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} O Status que está compra está não pode ser rembolsado!`, ephemeral: true })
    }
  }
}