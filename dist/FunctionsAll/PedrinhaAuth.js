const { default: axios } = require("axios")
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, TextDisplayBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, SectionBuilder, ComponentType } = require("discord.js")
const { SectionUser } = require("./Sections");

async function PainelPrincipal(client, interaction, s) {
                    return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

    let config = client.db.OAuth2.get('Config');
    let info;

    if (config?.LicenseID) {
        try {
          
        } catch (e) {
            console.error('Erro ao buscar dados da API:', e);
        }
    }



    const rowCadastro = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('gerarlicencaoauth2')
            .setLabel('Cadastrar OAuth2')
            .setEmoji('1306409478396182549')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('Cadastraroauth2')
            .setLabel('Vincular API Key')
            .setEmoji('1244875063933665331')
            .setStyle(1)
    );



    const rowVoltar = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('returnconfig')
            .setEmoji('1237055536885792889')
            .setStyle(2)
    );

    if (!config) {
        const content = `- Olá ${interaction.user}, você não tem um registro no **${global.server === 'aliensales' ? 'AlienSales' : 'Apx'} Security**, faça seu registro abaixo.`;

        const payload = {
            content,
            embeds: [],
            components: [rowCadastro, rowVoltar]
        };

        return s === 1
            ? interaction.editReply(payload)
            : interaction.update(payload);
    }

    let uptimeTimestamp = Math.floor(client.readyAt.getTime() / 1000);

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Autenticação')
        .setDescription(`Em 2024, surgiu o **CloudAssure** para garantir segurança e praticidade no armazenamento de informações de aplicativos na nuvem. Hoje, concentra-se no serviço OAuth2, permitindo que usuários se autentiquem em sua aplicação e sejam facilmente migrados para novos servidores. Bem-vindo ao futuro!`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${uptimeTimestamp}:R>`, inline: true },
            { name: `Autenticação`, value: `-# - Seu Bot OAuth2: \`${info?.name || 'Desconhecido'}\`\n-# - Membros OAuth2: \`${info?.users || 0} Usuários\`\n-# - Canal de Logs: ${client.db.OAuth2.get('LogChannel') ? `<#${client.db.OAuth2.get('LogChannel')}>` : '`Não definido.`'}`, inline: true },
        );

    const rowAtivacao = new ButtonBuilder()
        .setCustomId('ativaroauth2')
        .setLabel(config.status ? 'Desligar Sistema' : 'Ativar Sistema')
        .setStyle(config.status ? 4 : 3)
        .setEmoji(config.status ? '<:desligar:1238978047504547871>' : '<:Ligado:1238977621220655125>')


    const buttonRecoverMembers = new ButtonBuilder().setCustomId("recuperarmembrosoauth2").setLabel("Recuperar Membros").setEmoji("1230562783553261688").setDisabled(false).setStyle(3);

    const buttonOauthMessage = new ButtonBuilder().setCustomId("msgoauth2").setLabel("Mensagem OAuth2").setEmoji("1178079212700188692").setDisabled(false).setStyle(1);

    const buttonOauthLogs = new ButtonBuilder().setCustomId("definircanallogsoauth2").setLabel("Definir canal de logs").setEmoji("1224026199089746001").setDisabled(false).setStyle(2);

    const buttonAddApp = new ButtonBuilder().setURL(`https://discord.com/oauth2/authorize?client_id=${info.id}&scope=bot&permissions=8`).setLabel("Adicionar Aplicação").setEmoji("1281602725754437706").setDisabled(false).setStyle(5);

    const buttonBack2 = new ButtonBuilder()
        .setCustomId('Desvincularoauth2')
        .setLabel('Desvincular OAuth2')
        .setEmoji('1282806629116543068')
        .setStyle(4)
    const buttonBack = new ButtonBuilder().setCustomId("returnconfig").setEmoji(`1178068047202893869`).setStyle(2);

    const actionRow1 = new ActionRowBuilder().addComponents(rowAtivacao, buttonRecoverMembers, buttonOauthMessage);
    const actionRow2 = new ActionRowBuilder().addComponents(buttonOauthLogs, buttonAddApp);
    const actionRowBack = new ActionRowBuilder().addComponents(buttonBack2, buttonBack);

    const components = [actionRow1, actionRow2, actionRowBack];

    if (s === 1) {
        return interaction.update({
            embeds: [embed],
            components
        });
    } else {
        return interaction.update({
            embeds: [embed],
            components: [...components]
        });
    }
}

async function ConfigurarMensagem(client, interaction, s) {

    const mensagem = client.db.General.get('ConfigGeral.MensagemOAuth2') || {};
    const {
        content = '',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
        labelbutton = 'Autenticar',
        emojibutton = '1237122935437656114',
        corbutton = 1
    } = mensagem;

    const embedexample = new EmbedBuilder()

    if (title !== 'Não definido') {
        embedexample.setTitle(title)
    }
    if (description !== 'Não definido') {
        embedexample.setDescription(description)
    }
    if (color !== 'Não definido') {
        embedexample.setColor(color)
    }
    if (banner !== 'Não definido') {
        embedexample.setImage(banner)
    }
    if (thumbnail !== 'Não definido') {
        embedexample.setThumbnail(thumbnail)
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarmensagemoauth2')
            .setLabel('Definir Mensagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparmensagemoauth2')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(content == '' ? true : false)
            .setStyle(4),
    )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarembedmensagemoauth2')
            .setLabel('Definir corpo do Embed')
            .setEmoji(`1366880498647040021`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparembedmensagemoauth2')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(title == 'Não definido' ? true : false)
            .setStyle(4),
    )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('definirimagemauth2')
            .setLabel('Definir Imagem')
            .setEmoji(`1366880503738794095`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparimagemauth2')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(contentimage != 'Não definido' || banner != 'Não definido' || thumbnail != 'Não definido' ? false : true)
            .setStyle(4),
    )

    const row5 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("alterarbotaoauth2")
            .setLabel(`${labelbutton} (clique para alterar)`)
            .setEmoji(emojibutton)
            .setStyle(corbutton),
        new ButtonBuilder()
            .setCustomId("postarauth2")
            .setLabel('Postar')
            .setEmoji(`1242906048994742393`)
            .setDisabled(title != 'Não definido' || content != '' || contentimage != 'Não definido' ? false : true)
            .setStyle(2),
    )

    const updateOptions = {
        content: content !== '' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample] : [],
        components: [row, row2, row3, row5],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    if (s == 1) {
        await interaction.reply(updateOptions);
    } else {
        await interaction.update(updateOptions);
    }
}

async function PostarMensagem(client, interaction, canal, local) {

    const mensagem = client.db.General.get('ConfigGeral.MensagemOAuth2') || {};

    const {
        content = '',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
        labelbutton = 'Autenticar',
        emojibutton = '1237122935437656114',
        corbutton = 1
    } = mensagem;

    const embedexample = new EmbedBuilder()

    if (title !== 'Não definido') {
        embedexample.setTitle(title)
    }
    if (description !== 'Não definido') {
        embedexample.setDescription(description)
    }
    if (color !== 'Não definido') {
        embedexample.setColor(color)
    }
    if (banner !== 'Não definido') {
        embedexample.setImage(banner)
    }
    if (thumbnail !== 'Não definido') {
        embedexample.setThumbnail(thumbnail)
    }


    let row5
    let channel

    if (local === 'nesse servidor') {
        row5 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("autenticarauth2") // com reply
                .setLabel(`${labelbutton}`)
                .setEmoji(emojibutton)
                .setStyle(corbutton),
        )

        channel = await client.channels.fetch(canal)

    }

    const updateOptions = {
        content: content !== 'Não definido' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample] : [],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        components: [row5]
    };



    try {
        await channel.send(updateOptions)

        const botao = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setURL(channel.url)
                .setLabel('Ir para o canal')
                .setEmoji(`1242906048994742393`)
                .setStyle(5),
        )

        interaction.update({ content: `Mensagem enviada com sucesso!`, components: [botao], ephemeral: true })
    } catch (error) {

        const botao = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
                .setLabel('Adicionar Bot')
                .setEmoji(`1233110125330563104`)
                .setStyle(5),
            new ButtonBuilder()
                .setCustomId('postarauth2')
                .setLabel('Tentar novamente')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
        )

        await interaction.update({ content: `Não foi possível enviar a mensagem em ${local}.`, components: [botao], ephemeral: true })
    }
}

module.exports = {
    PainelPrincipal,
    ConfigurarMensagem,
    PostarMensagem
}