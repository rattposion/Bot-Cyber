const Discord = require("discord.js");
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "painelsugestao",
  description: "[🛠|Moderação] Envie a mensagem do painel de sugestão.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

    const embed = new Discord.EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setTitle(`${client.user.username} | Feedback usuários`)
      .setDescription(`👋 | Caso precise enviar uma sugestão / avaliação, selecione uma das opções abaixo:`)

    const style2row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('sugestaoprodutos')
          .setPlaceholder(`Selecione uma das opções`)
          .addOptions([
            {
              label: `Sugerir`,
              description: `Enviar uma sugestão`,
              emoji: `💡`,
              value: `SugerirEnviar`,
            }
          ])
      )

    interaction.channel.send({ embeds: [embed], components: [style2row] })
    interaction.reply({ ephemeral: true, content: `${global.emoji.certo} Enviado a mensagem de sugestao / avaliar` })
  }
}