const Discord = require("discord.js");
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "set",
  description: "[💰| Vendas Moderação] Cadastra um novo produto no bot",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { 
      name: 'id', 
      description: 'Coloque o id do produto que deseja configurar!', 
      type: 3, 
      required: true, 
      autocomplete: true 
    },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) {
      return interaction.reply({ 
        content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, 
        ephemeral: true 
      });
    }

    const id = interaction.options.getString('id');
    const produto = client.db.produtos.get(id);
    
    if (!produto || !produto.settings.estoque) {
      return interaction.reply({ content: `${global.emoji.errado} O produto selecionado não está configurado para este servidor.`, ephemeral: true });
    }

    const estoque = Object.keys(produto.settings.estoque).length;
    const precoFormatado = Number(produto.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois });

    const embedDescConfig = client.db.DefaultMessages.get(`ConfigGeral`);
    const embedDescription = embedDescConfig.embeddesc
      .replace('#{preco}', precoFormatado)
      .replace('#{estoque}', estoque)
      .replace('#{nome}', produto.settings.name)
      .replace('#{desc}', produto.settings.desc);

    const embedTitle = embedDescConfig.embedtitle
      .replace('#{nome}', produto.settings.name)
      .replace('#{preco}', precoFormatado)
      .replace('#{estoque}', estoque);

    const embedColor = produto.embedconfig.color || client.db.General.get(`ConfigGeral.ColorEmbed`) || `#ADD8E6`;

    const embed = new EmbedBuilder()
      .setTitle(embedTitle)
      .setDescription(embedDescription)
      .setColor(embedColor);

    if (produto.embedconfig.banner) embed.setImage(produto.embedconfig.banner);
    if (produto.embedconfig.miniatura) embed.setThumbnail(produto.embedconfig.miniatura);
    if (client.db.DefaultMessages.get(`ConfigGeral.embedrodape`)) {
      embed.setFooter({ text: client.db.DefaultMessages.get(`ConfigGeral.embedrodape`) });
    }

    const buttonColors = { 'Vermelho': 4, 'Azul': 1, 'Verde': 3, 'Cinza': 2 };
    const buttonColor = buttonColors[embedDescConfig.colorbutton] || 3;
    
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(id)
        .setLabel(client.db.DefaultMessages.get(`ConfigGeral.textbutton`) || 'Comprar')
        .setStyle(buttonColor)
        .setEmoji(client.db.DefaultMessages.get(`ConfigGeral.emojibutton`) || '1243275863827546224')
        .setDisabled(false)
    );

    if (client.db.General.get(`ConfigGeral.statusduvidas`)) {
      row.addComponents(
        new ButtonBuilder()
          .setURL(client.db.General.get(`ConfigGeral.channelredirectduvidas`) || `https://www.youtube.com/`)
          .setLabel(client.db.General.get(`ConfigGeral.textoduvidas`) || `Dúvida`)
          .setStyle(5)
          .setEmoji(client.db.General.get(`ConfigGeral.emojiduvidas`) || `🔗`)
          .setDisabled(false)
      );
    }

    const sendMessage = async (content, files = []) => {
      interaction.channel.send({ content, components: [row], files }).then(async msg => {
        try {
          const oldMessage = await client.channels.fetch(produto.ChannelID).then(channel => channel.messages.fetch(produto.MessageID));
          if (oldMessage) await oldMessage.delete();
        } catch (error) {}

        client.db.produtos.set(`${id}.MessageID`, msg.id);
        client.db.produtos.set(`${id}.ChannelID`, msg.channel.id);
      });
    };

    if (client.db.General.get(`ConfigGeral.EstiloMensagens`)) {
      const modifiedContent = produto.settings.desc
        .replace('#{nome}', produto.settings.name)
        .replace('#{preco}', precoFormatado)
        .replace('#{estoque}', estoque);

      produto.embedconfig.banner 
        ? sendMessage(modifiedContent, [new Discord.AttachmentBuilder(produto.embedconfig.banner, { name: 'banner.png' })])
        : sendMessage(modifiedContent);
    } else {
      interaction.channel.send({ embeds: [embed], components: [row] }).then(async msg => {
        try {
          const oldMessage = await client.channels.fetch(produto.ChannelID).then(channel => channel.messages.fetch(produto.MessageID));
          if (oldMessage) await oldMessage.delete();
        } catch (error) {}

        client.db.produtos.set(`${id}.MessageID`, msg.id);
        client.db.produtos.set(`${id}.ChannelID`, msg.channel.id);
      });
    }

    interaction.reply({ content: `${client.db.General.get(`emojis.certo`)} | Mensagem Atualizada!`, ephemeral: true });
  }
};
