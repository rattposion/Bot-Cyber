const { InteractionType, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder, CategoryChannel, ModalBuilder, TextInputBuilder, TextInputStyle, DiscordAPIError, Discord, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Faces } = require('discord.js');


async function TipoMensagem(interaction, client, tipo, teste) {

    if (tipo === 'mensagem') {
        const msg = client.db.Anuncio.get('Mensagem.msg') || 'Nenhuma mensagem definida!'
        const imagem = client.db.Anuncio.get('Mensagem.imagem') === null ? [] : [client.db.Anuncio.get('Mensagem.imagem')]

        const botao = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('definirmensagem')
                .setLabel('Definir Mensagem')
                .setEmoji('1233129471922540544')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('adicionarbotaomsg')
                .setLabel('Adicionar Botão')
                .setEmoji('1233110125330563104')
                .setStyle(2),
        )

        const botao2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('postarmensagem')
                .setLabel('⠀⠀Postar⠀⠀')
                .setDisabled(client.db.Anuncio.get('Mensagem') === null ? true : false)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId('previewmensagem')
                .setLabel('⠀Preview⠀')
                .setDisabled(client.db.Anuncio.get('Mensagem') === null ? true : false)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('resetartudomensagem')
                .setLabel('⠀Resetar⠀')
                .setDisabled(client.db.Anuncio.get('Mensagem') === null ? true : false)
                .setStyle(4),

        )

        if (teste === 'update') {
            const infomensagem = {
                content: msg,
                files: imagem,
                components: [botao, botao2]
            }

            interaction.update(infomensagem)
        } else if (teste === 'reply') {
            let botao
            if (client.db.Anuncio.get('Mensagem.botao')) {

                botao = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setURL(client.db.Anuncio.get('Mensagem.botao.url'))
                        .setLabel(client.db.Anuncio.get('Mensagem.botao.titulo'))
                        .setStyle(5)
                )

                if (client.db.Anuncio.get('Mensagem.botao.emoji')) {
                    botao.components[0].setEmoji(client.db.Anuncio.get('Mensagem.botao.emoji'))
                }

            }

            botao = botao == undefined ? [] : [botao]
            const infomensagem = {
                content: msg,
                files: imagem, 
                components: botao,
                ephemeral: true
            }

            interaction.reply(infomensagem)
        } else {
            try {
                const canal = client.channels.cache.get(teste)
                let botao

                if (client.db.Anuncio.get('Mensagem.botao')) {

                    botao = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setURL(client.db.Anuncio.get('Mensagem.botao.url'))
                            .setLabel(client.db.Anuncio.get('Mensagem.botao.titulo'))
                            .setStyle(5)
                    )

                    if (client.db.Anuncio.get('Mensagem.botao.emoji')) {
                        botao.components[0].setEmoji(client.db.Anuncio.get('Mensagem.botao.emoji'))
                    }

                }

                botao = botao == undefined ? [] : [botao]

                const infomensagem = {
                    content: msg,
                    files: imagem,
                    components: botao
                }

                const canalenviado = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setURL(`https://discord.com/channels/${canal.guild.id}/${canal.id}`)
                        .setLabel('Ver Mensagem')
                        .setStyle(5)
                )

                canal.send(infomensagem)
                interaction.update({ content: `Mensagem enviada com sucesso!`, components: [canalenviado] })
            } catch (error) {
                interaction.reply({ content: `Canal não encontrado!`, ephemeral: true })
                console.log(error)
            }
        }
    } else {

        const embedconfig = client.db.Anuncio.get('Embed') || {}

        const {
            titulo = 'Título não definido',
            descricao = 'Descrição não definida',
            imagem,
            miniatura,
            autor = 'Autor não definido',
            cor = '#ADD8E6',
            msg = 'Mensagem não definida'
        } = embedconfig;

        const embedenviar = new EmbedBuilder()
            .setTitle(titulo)
            .setDescription(descricao)
            .setColor(cor)



        if (imagem) {
            embedenviar.setImage(imagem)
        }
        if (miniatura) {
            embedenviar.setThumbnail(miniatura)
        }

        const base = new EmbedBuilder()
            .setDescription(`Configure a Embed do anúncio logo acima!`)
            .setColor('Purple')

        const botao = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('definirmensagemembed')
                .setLabel('Definir Mensagem')
                .setEmoji('1233129471922540544')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('adicionarbotao')
                .setLabel('Adicionar Botão')
                .setEmoji('1233110125330563104')
                .setStyle(2),
        )

        const botao3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('send')
                .setLabel('⠀⠀Postar⠀⠀')
                .setDisabled(client.db.Anuncio.get('Embed') === null ? true : false)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId('previewembed')
                .setLabel('⠀Preview⠀')
                .setDisabled(client.db.Anuncio.get('Embed') === null ? true : false)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('resetartudoembed')
                .setLabel('⠀Resetar⠀')
                .setDisabled(client.db.Anuncio.get('Embed') === null ? true : false)
                .setStyle(4),
        )


        if (teste == 'update') {
            const infomensagem = {
                content: ``,
                embeds: [embedenviar, base],
                components: [botao, botao3]
            }

            interaction.update(infomensagem)
        } else if (teste == 'reply') {
            let botao

            if (client.db.Anuncio.get('Embed.botao')) {

                botao = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setURL(client.db.Anuncio.get('Embed.botao.url'))
                        .setLabel(client.db.Anuncio.get('Embed.botao.titulo'))
                        .setStyle(5)
                )

                if (client.db.Anuncio.get('Mensagem.botao.emoji')) {
                    botao.components[0].setEmoji(client.db.Anuncio.get('Mensagem.botao.emoji'))
                }

            }

            botao = botao == undefined ? [] : [botao]

            const infomensagem = {
                content: ``,
                embeds: [embedenviar],
                components: botao,
                ephemeral: true
            }

            interaction.reply(infomensagem)
        } else {
            const canal = client.channels.cache.get(teste)
            let botao

            if (client.db.Anuncio.get('Embed.botao')) {

                botao = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setURL(client.db.Anuncio.get('Embed.botao.url'))
                        .setLabel(client.db.Anuncio.get('Embed.botao.titulo'))
                        .setStyle(5)
                )

                if (client.db.Anuncio.get('Mensagem.botao.emoji')) {
                    botao.components[0].setEmoji(client.db.Anuncio.get('Mensagem.botao.emoji'))
                }
            }

            botao = botao == undefined ? [] : [botao]

            const infomensagem = {
                content: ``,
                embeds: [embedenviar],
                components: botao
            }

            const canalenviado = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${canal.guild.id}/${canal.id}`)
                    .setLabel('Ver Mensagem')
                    .setStyle(5)
            )

            canal.send(infomensagem)
            interaction.update({ content: `Mensagem enviada com sucesso!`, components: [canalenviado] })
        }

    }
}

module.exports = {
    TipoMensagem
}