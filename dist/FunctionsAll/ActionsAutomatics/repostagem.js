const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { SendAllMgs, SelectProduct } = require('../SendAllMgs')

async function repostagemAutomatica(client) {
    if (!client.db.General.get('ConfigGeral.repostagemautomatica.status')) return

    const horarios = [
        client.db.General.get('ConfigGeral.repostagemautomatica.horario1'),
        client.db.General.get('ConfigGeral.repostagemautomatica.horario2'),
        client.db.General.get('ConfigGeral.repostagemautomatica.horario3')
    ]
    
    const dataAtual = new Date()
    const horarioAtual = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' })
    const data = `${dataAtual.getDate()}/${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}`

    const notificados = [
        client.db.General.get('ConfigGeral.repostagemautomatica.ultimarepostagem_horario1.data') === data,
        client.db.General.get('ConfigGeral.repostagemautomatica.ultimarepostagem_horario2.data') === data,
        client.db.General.get('ConfigGeral.repostagemautomatica.ultimarepostagem_horario3.data') === data
    ]

    const horarioEncontrado = horarios.find((horario, index) => horario <= horarioAtual && !notificados[index])

    if (!horarioEncontrado) return

    const tipoHorario = `horario${horarios.indexOf(horarioEncontrado) + 1}`
    
    client.db.General.set(`ConfigGeral.repostagemautomatica.ultimarepostagem_${tipoHorario}`, {
        data: data,
        hora: Date.now()
    })

    try {
        const canallogs = client.channels.cache.get(client.db.General.get('ConfigGeral.ChannelsConfig.ChangeChannelMod'))
        
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Repostagem Automática', iconURL: 'https://cdn.discordapp.com/emojis/1230562921822683176.webp?size=44&quality=lossless' })
            .setColor('#adffc7')
            .setDescription('Seu Bot iniciou um processo para repostar todas as mensagens de venda no servidor.')
            .setFooter({ text: `Ações Automáticas - Equipe ${global.server == 'AlienSales' ? 'AlienSales Solutions' : `Apx Dev`}`, iconURL: 'https://media.discordapp.net/attachments/1182840954588237918/1209006988139175997/4a842bb6a3db17b1a82bf1f14fdc1081.gif?ex=66521e40&is=6650ccc0&hm=b31c1e66388e03f3330f9e9cb810a8dc20a5b736a7d6df3af2cd79a901b6c3e8&' })
        
        const botao = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('repostagemautomaticaaaaaaaaaaaaa')
                .setLabel('Notificação do Sistema')
                .setStyle(2)
                .setDisabled(true)
        )

        await canallogs.send({ embeds: [embed], components: [botao] })
    } catch (error) { }

    if (client.db.General.get('ConfigGeral.ConfigGeral.produtosrespostar')?.length > 0) {
        SelectProduct(client, 'automatica')
    } else {
        SendAllMgs(client, 'automatica')
    }
}

module.exports = {
    repostagemAutomatica
}