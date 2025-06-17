const Discord = require("discord.js");
const { createpainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");


module.exports = {
  name: "criar_painel",
  description: "[🛠|💰 Vendas Moderação] Crie um Painel Select Menu Para Seus Produtos",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "nome_painel",
      description: "Coloque o nome do painel que deseja criar",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    { name: 'produto_id', description: 'Coloque o id de um produto para ser adicionado no painel', type: 3, required: true, autocomplete: true },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })


    let name = interaction.options.getString('nome_painel');

    let id;
    do {
      id = Math.random().toString(36).substring(2, 12);
    } while (client.db.PainelVendas.get(id) !== null);
    produto = id


    if (produto.includes('.') || produto.includes(',') || produto.includes('_')) {
      return interaction.reply({
        content: `${global.emoji.errado} Não é permitido utilizar os caracteres ".", "," ou "_" no nome do painel!`,
        ephemeral: true
      });
    }

    if (interaction.options._hoistedOptions[1].value === 'nada') {
      return interaction.reply({
        content: `${global.emoji.errado} Nenhum cupom registrado em seu bot.`,
        ephemeral: true
      });
    }
    createpainel(interaction, client, produto, interaction.options._hoistedOptions[1].value, name)

  }
}