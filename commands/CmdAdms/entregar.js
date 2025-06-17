const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { atualizarmessageprodutosone } = require("../../FunctionsAll/Createproduto");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");


module.exports = {
  name: "entregar",
  description: '[🛠|💰 Vendas Moderação] Entregue um produto a um usuário',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja setar a mensagem!', type: 3, required: true, autocomplete: true },
    {
      name: 'usuário',
      description: 'Mencione um usuário que irá receber o produto.',
      type: Discord.ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: 'quantidade',
      description: 'Selecione a quantidade que será entregue ao usuário.',
      type: Discord.ApplicationCommandOptionType.Number,
      required: true
    },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })


    if (interaction.options._hoistedOptions[0].value === 'nada') {
      return interaction.reply({
        content: `${global.emoji.errado} Nenhum produto registrado em seu bot.`,
        ephemeral: true
      });
    }
    const member = interaction.options.getUser('usuário')
    const qtd = interaction.options.getNumber('quantidade')
    const prod = interaction.options._hoistedOptions[0].value

    var tt222 = client.db.produtos.get(`${prod}`)
    var tt2222 = client.db.produtos.get(`${prod}.settings.estoque`)

    if (qtd > Object.keys(tt2222).length) {
      return interaction.reply({
        content: `${global.emoji.errado} O produto selecionado não possui a quantidade desejada!`,
        ephemeral: true
      });
    }

    var finalproduto = ''
    for (var j = 0; j < qtd; j++) {
      var tt = client.db.produtos.get(`${prod}`)
      var ooooaoo = tt.settings.estoque[0]

      client.db.produtos.pull(`${prod}.settings.estoque`, (element, index, array) => index == 0)




      if (tt.settings.estoque[0] == undefined) ooooaoo = '\`Estoque desse produto esgotou - Contate um STAFF\`'
      finalproduto += `📦 | Entrega do Produto: ${tt.settings.name} - ${j + 1}/${qtd}\n${ooooaoo}\n\n`

    }

    function encontrarProdutoPorNome(array, nomeProduto) {
      for (const item of array) {
        for (const produto of item.data.produtos) {
          if (produto === nomeProduto) {
            return item.ID;
          }
        }
      }
      return null;
    }
    var kkkkkkk = client.db.PainelVendas.fetchAll()
    const idEncontrado = encontrarProdutoPorNome(kkkkkkk, prod);
    if (idEncontrado !== null) {
      atualizarmensagempainel(interaction.guild.id, idEncontrado, client)
    }
    atualizarmessageprodutosone(null, client, prod)

    try {
      const embedppppp = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setDescription(`${client.db.General.get(`emojis.certo`)} | Olá ${interaction.user}, foi enviado \`${qtd}\` unidade(s) do produto \`${tt222.settings.name}\` para o ${member}\n✨ | Produto entregue:\n\`${finalproduto}\``)


      await interaction.reply({ embeds: [embedppppp], ephemeral: true })
    } catch (error) {
      const embedppppp = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setDescription(`${client.db.General.get(`emojis.certo`)} | Olá ${interaction.user}, foi enviado \`${qtd}\` unidade(s) do produto \`${tt222.settings.name}\` para o ${member}\n✨ | Produto entregue:\n\`${qtd} produtos\``)


      await interaction.reply({ embeds: [embedppppp], ephemeral: true })
    }



    try {
      const channela = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
      await channela.send({ content: `${client.db.General.get(`emojis.certo`)} | O usuário ${interaction.user} enviou ${qtd} unidade(s) do produto \`${tt222.settings.name}\` para o ${member}` })
      await channela.send({ content: `\`${finalproduto}\`` })
    } catch (error) {

    }


    const content = `${client.db.General.get(`emojis.certo`)} | Olá ${member}, chegou uma entrega para você!\n${client.db.General.get(`emojis.caixa`)} | Produto: ${tt222.settings.name} x${qtd}\n✨ | Aqui está:\n${finalproduto}`


    if (finalproduto.length <= 3000) {
      member.send({ content });
    } else {
      member.send({ files: [{ attachment: Buffer.from(finalproduto), name: 'entrega.txt' }], content: `${client.db.General.get(`emojis.certo`)} | Olá ${member}, chegou uma entrega para você!\n${client.db.General.get(`emojis.caixa`)} | Produto: ${tt222.settings.name} x${qtd}` });
    }
  }
}