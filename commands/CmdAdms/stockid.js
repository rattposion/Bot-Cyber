const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "stockid",
  description: '[🛠|💰 Vendas Moderação] Veja o stock de um determinado produto',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja setar a mensagem!', type: 3, required: true, autocomplete: true },
  ],

  run: async (client, interaction) => {

    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    if (interaction.options._hoistedOptions[0].value == 'nada') return interaction.reply({ content: `Nenhum produto registrado em seu BOT`, ephemeral: true })
    const u = client.db.produtos.get(`${interaction.options._hoistedOptions[0].value}.settings.estoque`)
    var result2 = '';
    for (const key in u) {
      result2 += `${key} - ${u[key]}\n`
    }


    if (result2 == '') return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Este produto está sem estoque!`, ephemeral: true }).then(msg => {
      setTimeout(async () => {
        try {
          await msg.delete()
        } catch (error) {
        }
      }, 3000);
    })

    const fileName = `stock_${interaction.options._hoistedOptions[0].value}.txt`;
    const fileBuffer2 = Buffer.from(result2, 'utf-8');

    interaction.reply({
      content: `${client.db.General.get(`emojis.certo`)} Você solicitou com sucesso o stock do produto: \`${interaction.options._hoistedOptions[0].value}\`\n-# Segue abaixo o estoque do produto:.`, ephemeral: true, files: [{
        attachment: fileBuffer2,
        name: fileName
      }]
    })

  }
}