const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const permissionsInstance = require("../../FunctionsAll/permissionsInstance")

module.exports = {
    name: 'anunciar',
    description: "[🔧 | Moderação] Enviar um anúncio para todos os membros.",
    ContentAnnounce,

    run: async (client, interaction) => {
        if (!permissionsInstance.get(interaction.user.id)) {
            return interaction.reply({
                content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`,
                ephemeral: true
            })
        }

        ContentAnnounce(client, interaction)
    }
}

async function ContentAnnounce(client, interaction) {

    const anuncio = client.db.Anuncio.get(`Anuncio`) || {}

    const {
        content = ``,
        contentimagem = ``,
        imagem = ``,
        thumbnail = ``,
        author = ``,
        title = ``,
        description = ``,
        color = ``,
        footer = ``,
    } = anuncio;


    const embedexemple = new EmbedBuilder()

    if (imagem != ``) {
        embedexemple.setImage(imagem)
    }
    if (thumbnail != ``) {
        embedexemple.setThumbnail(thumbnail)
    }
    if (author != ``) {
        embedexemple.setAuthor({ name: author })
    }
    if (title != ``) {
        embedexemple.setTitle(title)
    }
    if (description != ``) {
        embedexemple.setDescription(description)
    }
    if (color != ``) {
        embedexemple.setColor(color)
    }
    if (footer != ``) {
        embedexemple.setFooter({ text: footer })
    }


    const botao = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("definirmsganuncio")
            .setLabel('Definir mensagem')
            .setEmoji(`1366880501767602339`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("limparmsganuncio")
            .setLabel('Limpar')
            .setEmoji(`1366880497682219140`)
            .setDisabled(!client.db.Anuncio.get(`Anuncio.content`))
            .setStyle(4),
    )

    const botao2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("definirembedanuncio")
            .setLabel('Definir corpo do Embed')
            .setEmoji(`1366880498647040021`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("limparembedanuncio")
            .setLabel('Limpar')
            .setEmoji(`1366880497682219140`)
            .setDisabled(!client.db.Anuncio.get(`Anuncio.title`))
            .setStyle(4),
    )

    const botao3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("definirimagemanuncio")
            .setLabel('Definir imagem')
            .setEmoji(`1366880503738794095`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("limparimagemanuncio")
            .setLabel('Limpar')
            .setEmoji(`1366880497682219140`)
            .setDisabled(!client.db.Anuncio.get(`Anuncio.contentimagem`) && !client.db.Anuncio.get(`Anuncio.imagem`) && !client.db.Anuncio.get(`Anuncio.thumbnail`))
            .setStyle(4),
    )

    const postar = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("postaranuncio")
            .setLabel('Postar mensagem')
            .setEmoji(`1366880505525571717`)
            .setDisabled(!client.db.Anuncio.get(`Anuncio.title`) && !client.db.Anuncio.get(`Anuncio.content`) && !client.db.Anuncio.get(`Anuncio.contentimagem`))
            .setStyle(1),
    )

    const updatemessage = {
        content: content != `` ? content : ``,
        embeds: embedexemple.length > 0 ? [embedexemple] : [],
        components: [botao, botao2, botao3, postar],
        files: contentimagem != `` ? [contentimagem] : [],
        ephemeral: true
    }

    if (!interaction.message) {
        await interaction.reply(updatemessage)
    } else {
        await interaction.update(updatemessage)
    }
}
