const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')

async function autoLockSystem(client) {
    const horarioAtual = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
    })

    const config = client.db.General.get('ConfigGeral.autolock')
    if (!config || !config.status || !config.canais?.length) return

    const { abertura, fechamento, canais, tipo = 'nada', mensagemabertura = {}, mensagemfechamento = {}, apagarmensagens } = config

    const horariosIguais = (hora1, hora2) => hora1 === hora2

    const sendLog = async (descricao, outroHorario, isAbertura) => {
        try {
            const canalLogs = client.channels.cache.get(client.db.General.get('ConfigGeral.ChannelsConfig.ChangeChannelMod'))
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Sistema Auto-Lock', iconURL: 'https://cdn.discordapp.com/emojis/1230562921822683176.webp?size=44&quality=lossless' })
                .setColor('#adffc7')
                .setDescription(descricao)
                .addFields({ name: isAbertura ? 'Horário de Fechamento' : 'Horário de Abertura', value: `\`${outroHorario}\``, inline: true })
                .setFooter({ text: `Ações Automáticas - Equipe ${global.server == 'AlienSales' ? 'AlienSales Solutions' : `Apx Dev`}`, iconURL: 'https://media.discordapp.net/attachments/1182840954588237918/1209006988139175997/4a842bb6a3db17b1a82bf1f14fdc1081.gif' })

            if (!isAbertura && apagarmensagens) {
                embed.addFields({ name: 'Sistema de Limpeza', value: 'O sistema de limpeza está ativado, o BOT irá apagar todas as mensagens do canal antes de tranca-lo.', inline: true })
            }

            const botao = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('repostagemautomaticaaaaaaaaaaaaa')
                    .setLabel('Sistema Auto-lock')
                    .setStyle(2)
                    .setDisabled(true)
            )

            await canalLogs.send({ embeds: [embed], components: [botao] })
        } catch (e) { }
    }

    const montarEmbedMensagem = (mensagem) => {
        const {
            content = '',
            contentimage,
            title,
            description,
            color,
            banner,
            thumbnail,
        } = mensagem

        const embed = new EmbedBuilder()

        if (title) embed.setTitle(title)
        if (description) embed.setDescription(description)
        if (color) embed.setColor(color)
        if (banner) embed.setImage(banner)
        if (thumbnail) embed.setThumbnail(thumbnail)

        return {
            content,
            embeds: title ? [embed] : [],
            files: contentimage ? [contentimage] : []
        }
    }

    const limparMensagemAnterior = async () => {
        try {
            const { msgid, canalid } = client.db.General.get('ConfigGeral.autolock.ulitimamensagem') || {}
            if (!msgid || !canalid) return
            const canal = await client.channels.fetch(canalid)
            const mensagem = await canal.messages.fetch(msgid)
            await mensagem.delete()
        } catch (e) { }
    }

    const atualizarCanais = async (modo) => {
        const mensagem = modo === 'aberto' ? mensagemabertura : mensagemfechamento
        for (const canalID of canais) {
            try {
                const channel = await client.channels.fetch(canalID)
                await channel.permissionOverwrites.edit(channel.guild.id, {
                    SendMessages: modo === 'aberto'
                })

                await limparMensagemAnterior()

                if (modo === 'fechado' && apagarmensagens) {
                    const mensagens = await channel.messages.fetch()
                    let count = 0
                    for (const m of mensagens.values()) {
                        try {
                            await m.delete()
                            count++
                        } catch { }
                    }

                    mensagem.footer = { text: `Foram apagadas ${count} mensagens.`, iconURL: 'https://cdn.discordapp.com/emojis/1242904983343468574.webp?size=44&quality=lossless' }
                } else if (channel?.guild) {
                    mensagem.footer = { text: channel.guild.name, iconURL: channel.guild.iconURL({ dynamic: true }) || null }
                }

                const embedOptions = montarEmbedMensagem(mensagem)
                const sent = await channel.send(embedOptions)

                client.db.General.set('ConfigGeral.autolock.ulitimamensagem', {
                    msgid: sent.id,
                    canalid: sent.channel.id
                })
            } catch (e) { }
        }
    }

    if (horariosIguais(horarioAtual, abertura)) {
        if (tipo === 'aberto') return
        client.db.General.set('ConfigGeral.autolock.tipo', 'aberto')
        await sendLog('Seu Bot iniciou um processo de abertura automática de canais.', fechamento, true)
        await atualizarCanais('aberto')
    }

    if (horariosIguais(horarioAtual, fechamento)) {
        if (tipo === 'fechado') return
        client.db.General.set('ConfigGeral.autolock.tipo', 'fechado')
        await sendLog('Seu Bot iniciou um processo de fechamento automático de canais.', abertura, false)
        await atualizarCanais('fechado')
    }
}



module.exports = {
    autoLockSystem
}