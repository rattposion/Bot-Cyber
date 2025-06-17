const Discord = require("discord.js");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "status",
  description: '[🛠|💰 Vendas Moderação] Veja o status de um pagamento',
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

    if (tt == null) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Compra não encontrada!`, ephemeral: true  })


    interaction.reply({ content: `🔍 | Status: ${tt.Status}\n💸 | Valor: ${Number(tt.valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`, ephemeral: true })
  }
}