const Discord = require("discord.js");
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "del",
  description: '[🛠|💰 Vendas Moderação] Deleta o produto que você colocou o ID',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja configurar!', type: 3, required: true, autocomplete: true },
  ],


  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    const id = interaction.options._hoistedOptions[0].value

    var tttttt = client.db.PainelVendas.fetchAll()

    for (let iii = 0; iii < tttttt.length; iii++) {
      const element = tttttt[iii];
      var uu = element.data.produtos
      if (uu.includes(id)) {
        client.db.PainelVendas.pull(`${tttttt[iii].ID}.produtos`, (element, index, array) => element == id)
        atualizarmensagempainel(interaction.guild.id, element.ID, client)
      }
    }
    const channel = client.channels.cache.get(client.db.produtos.get(`${id}.ChannelID`));
    if (channel) {
      channel.messages
        .fetch(client.db.produtos.get(`${id}.MessageID`))
        .then((mensagem) => {
          mensagem.delete();

        })
        .catch((error) => {

        });
    } else {

    }
    interaction.reply({
      content: `${global.emoji.certo} O produto \`${id}\` foi deletado do servidor.`, ephemeral: true
    });
    client.db.produtos.delete(`${id}`)
  }
}