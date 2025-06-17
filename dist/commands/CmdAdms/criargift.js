const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");


module.exports = {
  name: "criargift",
  description: "[💰| Vendas Moderação] Cria uma giftcard no valor escolhido",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor para ser Resgatado",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "qtd",
      description: "Quantidade de GIfts a serem criados",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    let cargo = interaction.options.getNumber('valor');
    let qtd = interaction.options.getNumber('qtd');

    const embed = new EmbedBuilder()
    .setColor(client.db.General.get('ConfigGeral.ColorEmbed') === '#008000' ? 'Random' : `${client.db.General.get('ConfigGeral.ColorEmbed')}`)
    .setThumbnail(`${client.user.displayAvatarURL()}`)
    .setTitle('Gift criado com sucesso.')
    .setDescription('Verifique sua DM para visualizar o código do gift.')
    .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
    .setTimestamp();

    let keys = []

    for (let iii = 0; iii < qtd; iii++) {

      var keya = key(23)

      client.db.giftcards.set(keya, { valor: cargo })

      keys.push(keya)
    }

    


    let txt = keys.join('\n')
    let buffer = Buffer.from(txt, 'utf-8')

    const embed2 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username} | Gerador de Gift`, iconURL: interaction.user.displayAvatarURL() })
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setDescription(`- Foram criado(s) \`${keys.length}\` gift(s) e enviados no arquivo TXT abaixo.`)

    interaction.user.send({ embeds: [embed2], files: [{ attachment: buffer, name: 'Gifts.txt' }] })
    interaction.reply({ embeds: [embed], ephemeral: true })
  }

}
function key(n) {
  const randomizar = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789'
  let text = ''
  for (var i = 0; i < n + 1; i++) text += randomizar.charAt(Math.floor(Math.random() * randomizar.length))
  return text;
}