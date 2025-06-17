const Discord = require("discord.js");
const { StartConfigCupom } = require("../../FunctionsAll/Cupom");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "configcupom",
  description: "[🛠|💰 Vendas Moderação] Configure um cupom",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja setar a mensagem!', type: 3, required: true, autocomplete: true },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })


    if (interaction.options._hoistedOptions[0].value === 'nada') {
      return interaction.reply({
        content: `${global.emoji.errado} Nenhum produto foi registrado em seu bot.`,
        ephemeral: true
      });
    }
    StartConfigCupom(interaction, client, interaction.user.id, interaction.options._hoistedOptions[0].value)

  }
}