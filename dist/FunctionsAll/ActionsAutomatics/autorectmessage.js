const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { getSaudacao } = require("../PermissionAPI/PermissionGet");

function autoreact(interaction, client, c) {
    const status = client.db.General.get('ConfigGeral.AutoReact.status');
    const emoji = client.db.General.get('ConfigGeral.AutoReact.emoji');
    const uptimeTimestamp = Math.floor(client.readyAt.getTime() / 1000);

    let status4 = client.db.General.get('ConfigGeral.AutoReact.status') == true ? 'Ligado' : 'Desligado'

    let label = client.db.General.get('ConfigGeral.AutoReact.status') == true ? 'Desligar Auto-React' : 'Ligar Auto-React'
    let emoji2 = client.db.General.get('ConfigGeral.AutoReact.status') == true ? '1288852245571436546' : '1288852185689489523'
    let cor = client.db.General.get('ConfigGeral.AutoReact.status') == true ? 4 : 3

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Auto-React')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${uptimeTimestamp}:R>`, inline: true },
            { name: `Auto-React`, value: `-# - Status: ${status4}\n-# - Emoji: ${emoji}`, inline: true },
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("alterarstatusreact")
                .setLabel(label)
                .setEmoji(emoji2)
                .setStyle(cor),
            new ButtonBuilder()
                .setCustomId("alteraremojireact")
                .setLabel('Alterar Emoji')
                .setEmoji(`1286337071799210025`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("returnacoesautomaticas")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        );

    const responsePayload = {
        content: ``,
        embeds: [embed],
        components: [row2]
    };

    if (c === 2) {
        return interaction.editReply(responsePayload);
    }

    interaction.update(responsePayload);
}

module.exports = {
    autoreact
}
