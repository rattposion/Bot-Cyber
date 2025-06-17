const { ActionRowBuilder, ButtonBuilder, MessageFlags, EmbedBuilder } = require("discord.js")
const { getSaudacao } = require('../PermissionAPI/PermissionGet');

function PainelNotify(client, interaction) {
    let status = client.db.General.get('ConfigGeral.Notificar.Wpp.status')
    let statuswzap = status == null ? '\`🔴\`' : status == true ? '\`🟢\`' : '\`🔴\`'

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Notificações')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Sistemas`, value: `-# - ${statuswzap} Notificações de WhatsApp\n-# -  \`🔴\` Notificações de Telegram\n-# - \`🔴\` Notificações de E-mail`, inline: true },
        );

    let buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('WhatsappNotify')
                .setLabel('Notificações de WhatsApp')
                .setDisabled(global.server == `aliensales` ? true : false)
                .setEmoji('<:whatsapp:1334634635078139975>')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('TelegramNotify')
                .setLabel('Notificações de Telegram')
                .setEmoji('<:Telegram:1334570738501287936>')
                .setDisabled(true)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('EmailNotify')
                .setLabel('Notificações de E-mail')
                .setDisabled(true)
                .setEmoji('<:1289360035184644147:1293949409658273896>')
                .setStyle(2),

        )

    let buttons2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configdefinicoes")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )

    return { components: [buttons, buttons2], embeds: [embed], flags: [MessageFlags.Ephemeral] }

}

function PainelWpp(interaction, client) {

    let label = client.db.General.get('ConfigGeral.Notificar.Wpp.status') == true ? 'Desligar Notificações' : 'Ligar Notificações'
    let emoji = client.db.General.get('ConfigGeral.Notificar.Wpp.status') == true ? '1288852245571436546' : '1288852185689489523'
    let cor = client.db.General.get('ConfigGeral.Notificar.Wpp.status') == true ? 4 : 3

    let status = client.db.General.get('ConfigGeral.Notificar.Wpp.status')
    let numeroRegistro = client.db.General.get('ConfigGeral.Notificar.Wpp.numero')

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Notificações WhatsApp')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `WhatsApp`, value: `-# - Status do Sistema: ${status == null ? '`Desativado`' : status == true ? '`Ativado`' : '`Desativado`'}\n-# - Número de Registro: ${numeroRegistro == null ? '`Não Registrado`' : `||${numeroRegistro}||`}`, inline: false }
        );

    let components1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('WppStatus')
                .setEmoji(emoji)
                .setLabel(label)
                .setStyle(cor),
            new ButtonBuilder()
                .setCustomId('WppNumero')
                .setEmoji(`1236318155056349224`)
                .setLabel('Definir Número de WhatsApp')
                .setStyle(2)
        )
    let components2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('VoltarNotifys')
                .setLabel('Voltar')
                .setEmoji('1237055536885792889')
                .setStyle(2)
        )

    return { embeds: [embed], components: [components1, components2], flags: [MessageFlags.Ephemeral] }


}

module.exports = {
    PainelNotify,
    PainelWpp
}