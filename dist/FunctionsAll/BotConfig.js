
const { ButtonBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ComponentType, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, StringSelectMenuBuilder, MessageFlags, StringSelectMenuOptionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, ContainerBuilder, SectionBuilder, MessageType } = require('discord.js');
const { obterEmoji } = require('../Handler/EmojiFunctions');

const { QuickDB } = require("quick.db");
const { getCache, getSaudacao } = require('./PermissionAPI/PermissionGet');
const { SectionUser } = require('./Sections');
const db = new QuickDB();
var uu = db.table('permissionsmessage')




async function PainelVendas(interaction, client) {
    let estilocart = client.db.General.get('ConfigGeral.Vendas.EstiloCarrinho') == true ? '\`Topic\`' : client.db.General.get('ConfigGeral.Vendas.EstiloCarrinho') == null ? '\`Canal\`' : '\`Canal\`'
    let EstiloMensagem = client.db.General.get(`ConfigGeral.EstiloMensagens`) == null ? '\`Embed\`' : client.db.General.get(`ConfigGeral.EstiloMensagens`) == true ? '\`Mensagem\`' : `\`Embed\``
    let uptimeTimestamp = Math.floor(client.readyAt.getTime() / 1000);



    let statusVendas = client.db.General.get('ConfigGeral.Status') == 'ON' ? 'Ligado' : `Desligado`

    let embedPrincipal = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Sistema de Vendas')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${uptimeTimestamp}:R>`, inline: true },
            { name: `Sistemas`, value: `-# - Status Vendas: \`${statusVendas}\`\n-# - Estilo de Carrinho: ${estilocart}\n-# - Estilo de Anuncio (Vendas): ${EstiloMensagem}`, inline: true },
        );

    let label = client.db.General.get('ConfigGeral.Status') == 'ON' ? 'Desligar Vendas' : 'Ligar Vendas'
    let emoji = client.db.General.get('ConfigGeral.Status') == 'ON' ? '1288852245571436546' : '1288852185689489523'
    let cor = client.db.General.get('ConfigGeral.Status') == 'ON' ? 4 : 3
    let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('vendastoggle')
                .setLabel(label)
                .setStyle(cor)
                .setEmoji(emoji),
            new ButtonBuilder()
                .setCustomId('estilocarrinho')
                .setLabel('Alterar Estilo Carrinho')
                .setDisabled(true)
                .setStyle(2)
                .setEmoji('1282809995229921341'),
            new ButtonBuilder()
                .setCustomId('EditEstiloMensagem')
                .setLabel('Alterar Estilo da Mensagem')
                .setStyle(2)
                .setEmoji('1329452804552654982')

        )

    let row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('ButtonDuvidasPainel')
                .setLabel('Botão Dúvidas')
                .setStyle(2)
                .setEmoji('1242899381330645095'),
            new ButtonBuilder()
                .setCustomId('changetermos')
                .setLabel('Termos de compra')
                .setStyle(2)
                .setEmoji('1234606184711979178'),
            new ButtonBuilder()
                .setCustomId('BlackListPainel')
                .setLabel('Gerenciar BlackList')
                .setStyle(2)
                .setEmoji('1237122937631408128'),

        )

    await interaction.update({
        embeds: [embedPrincipal], components: [row, row2,
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('returnconfig')
                        .setStyle(2)
                        .setEmoji('1237055536885792889'),
                )
        ]
    })
}


async function updateMessageConfig(interaction, client) {

    let statusVendas = client.db.General.get('ConfigGeral.Status') == 'ON' ? '\`🟢\`' : `\`🔴\``
    let statusAutenticacao = client.db.OAuth2.get('Config.status') == true ? '\`🟢\`' : `\`🔴\``

        let embedPrincipal = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Painel De Configuração')
            .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
            .addFields(
                { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
                { name: `Sistemas`, value: `-# - ${statusVendas} Sistema de Vendas\n-# -  \`${statusAutenticacao}\` Sistema de Autenticação\n-# - \`🔴\` Sistema de Proteção`, inline: true },
    )
    .setImage("https://i.imgur.com/LacuUU9.jpeg")  // Adicionando a imagem
    .setFooter(
      { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
    );




        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('PainelVendas')
                    .setLabel('Sistema de Vendas')
                    .setStyle(2)
                    .setEmoji('1304851531597746308'),
                new ButtonBuilder()
                    .setCustomId('PainelOauth2')
                    .setLabel('Sistema de Autenticação')
                    .setStyle(2)
                    .setDisabled(true)
                    .setEmoji('1282361068458479616'),
                new ButtonBuilder()
                    .setCustomId('systemprotect')
                    .setLabel('Sistema de Proteção')
                    .setDisabled(true)
                    .setStyle(2)
                    .setEmoji('1256797635117842472')

            )

        let row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('acoesautomaticas')
                    .setLabel('Ações Automáticas')
                    .setStyle(2)
                    .setEmoji('1237122940617883750'),
                new ButtonBuilder()
                    .setCustomId('configdefinicoes')
                    .setLabel('Definições')
                    .setStyle(2)
                    .setEmoji('1233103066975309984'),
            )

        if (interaction.message == undefined) {
            await interaction.reply({
                content: '',
                embeds: [embedPrincipal],
                components: [row, row2],
                flags: [MessageFlags.Ephemeral],
            })
        } else {
            await interaction.update({
                content: '',
                embeds: [embedPrincipal],
                components: [row, row2],
                flags: [MessageFlags.Ephemeral],
            })
        }
    }


async function definicoes(interaction, client) {

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Definições')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            // { name: `Sistemas`, value: `-# - ${statusVendas} Sistema de Vendas\n-# -  \`${statusAutenticacao}\` Sistema de Autenticação\n-# - \`🔴\` Sistema de Proteção`, inline: true },
        );

    const botao1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("configmoderacao")
            .setLabel('Moderação')
            .setEmoji('1232782650385629299')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("NotificaçãoPainel")
            .setLabel('Notificações')
            .setEmoji('1293949409658273896')
            .setDisabled(true)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("confirmpagament")
            .setLabel('Formas de Pagamento')
            .setEmoji('1233103068942569543')
            .setStyle(2)
    );

    const botao2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("configbot")
            .setLabel('Configurar Bot')
            .setEmoji('1233103066975309984')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("configchannels")
            .setLabel('Configurar Canais')
            .setEmoji('1233127513178247269')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("ConfigRoles")
            .setLabel('Configurar Cargos')
            .setEmoji('1233127513178247269')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("SaldoInvitePainel")
            .setLabel('Personalizar Invite')
            .setEmoji('1233129471922540544')
            .setStyle(2)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returnconfig")
            .setEmoji('1237055536885792889')
            .setStyle(2)
    );

    await interaction.update({
        embeds: [embed],
        components: [botao1, botao2, row3],
        ephemeral: true
    });
}

async function acoesautomaticas(interaction, client) {
    const rowVoltar = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('returnconfig')
            .setEmoji('1237055536885792889')
            .setStyle(2)
    );

    let statusAutoLock = client.db.General.get('ConfigGeral.autolock.status') == true ? '\`🟢\`' : `\`🔴\``
    let statusMsgAuto = client.db.General.get('ConfigGeral.autolock.status') == true ? '\`🟢\`' : `\`🔴\``
    let statusReactAuto = client.db.General.get('ConfigGeral.autolock.status') == true ? '\`🟢\`' : `\`🔴\``
    const uptimeTimestamp = Math.floor(client.readyAt.getTime() / 1000);

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Ações Automáticas')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${uptimeTimestamp}:R>`, inline: true },
            { name: `Sistemas`, value: `-# - ${statusAutoLock} Sistema de Auto-Lock\n-# - \`${statusMsgAuto}\` Sistema de Mensagem Automática\n-# - ${statusReactAuto} Sistema de Auto-React Message`, inline: true },
        );

    const autoRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("autolock").setLabel("Lock Automatico").setEmoji("1244438113368150061").setStyle(2),
        new ButtonBuilder().setCustomId("automsgggs").setLabel("Mensagem Automatica").setEmoji("1275224107457449984").setStyle(2),
        new ButtonBuilder().setCustomId("autorectmessage").setLabel("Auto-React").setEmoji("1286337071799210025").setStyle(2).setDisabled(false),
    );


    return interaction.update({
        embeds: [embed],
        components: [autoRow, rowVoltar]
    });
}

async function autolock(interaction, user, client, a) {
    const config = client.db.General.get('ConfigGeral.autolock') || {};
    const statusAtivo = config.status === true;
    const status = statusAtivo ? '`Ligado`' : '`Desligado`';

    const emoji = statusAtivo ? '<:desligar:1238978047504547871>' : '<:Ligado:1238977621220655125>';
    const label = statusAtivo ? 'Desativar Sistema' : 'Ativar Sistema';
    const buttonColor = statusAtivo ? 4 : 3;

    const abertura = config.abertura || 'Não definido';
    const fechamento = config.fechamento || 'Não definido';
    const canais = config.canais || [];
    const uptimeTimestamp = Math.floor(client.readyAt.getTime() / 1000);

    const options = [];
    if (canais.length > 0) {
        for (const canalId of canais) {
            let canalObj;
            try {
                canalObj = await client.channels.fetch(canalId);
            } catch {
                canalObj = { name: 'Canal não encontrado' };
            }
            options.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(canalObj.name)
                    .setValue(canalId)
                    .setDefault(false)
            );
        }
    } else {
        options.push(
            new StringSelectMenuOptionBuilder()
                .setLabel('Nenhum canal definido')
                .setValue('nenhum')
                .setDefault(false)
        );
    }

    const componentsSelectString = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('configautolock')
            .setPlaceholder('Canais Liberados (Clique para configurar)')
            .setDisabled(canais.length === 0)
            .addOptions(options)
    );

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel Auto-Lock')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${uptimeTimestamp}:R>`, inline: true },
            { name: `Auto-Lock`, value: `-# - Status do Sistema: ${status}\n-# - Quantidade de Canais: \`${canais.length}\`\n-# - Horários:\n-# - ┣ Abertura: \`${abertura}\`\n-# - ┗ Fechamento: \`${fechamento}\``, inline: true },
        );

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ativarautolock')
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor),
        new ButtonBuilder()
            .setCustomId('configurarautolock')
            .setLabel('Programar Auto-Lock')
            .setEmoji('1229787808936230975')
            .setStyle(2)
    );

    const botoa2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('mensagemabertura')
            .setLabel('Mensagem de Abertura')
            .setEmoji('1244437959915208775')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('mensagemfechamento')
            .setLabel('Mensagem de Fechamento')
            .setEmoji('1244438113368150061')
            .setStyle(2)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('adicionarcanalautolock')
            .setLabel('Adicionar Canal')
            .setEmoji('1233110125330563104')
            .setStyle(2)
            .setDisabled(canais.length >= 24),
        new ButtonBuilder()
            .setCustomId('removercanalautolock')
            .setLabel('Remover Canal')
            .setEmoji('1242907028079247410')
            .setStyle(2)
            .setDisabled(canais.length === 0)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('acoesautomaticas')
            .setEmoji('1237055536885792889')
            .setStyle(2)
    );

    await interaction.update({
        embeds: [embed],
        components: [row, botoa2, row2, componentsSelectString, row3],
        ephemeral: true,
    });
}

async function mensagemabertura(interaction, user, client) {

    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemabertura') || {};

    const {
        content = '',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
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


    const embedprincipal = new EmbedBuilder()
        .setAuthor({ name: `Configuração Mensagem Abertura` })
        .setColor('#ADD8E6')
        .setDescription(`- Aqui você pode configurar a mensagem de abertura!`)


    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarmensagemabertura')
            .setLabel('Definir Mensagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparmensagemabertura')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(content == '' ? true : false)
            .setStyle(4),
    )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarembedabertura')
            .setLabel('Definir Embed')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparembedabertura')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(title == 'Não definido' ? true : false)
            .setStyle(4),
    )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('definirimagemabertura')
            .setLabel('Definir Imagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparimagemabertura')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(contentimage != 'Não definido' || banner != 'Não definido' || thumbnail != 'Não definido' ? false : true)
            .setStyle(4),
    )

    const row5 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("testarbertura")
            .setLabel('Testar')
            .setEmoji(`1238978383845654619`)
            .setDisabled(title != 'Não definido' || content != '' || contentimage != 'Não definido' ? false : true)
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("returnautolock")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )



    const updateOptions = {
        content: content !== '' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample, embedprincipal] : [embedprincipal],
        components: [row, row2, row3, row5],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    interaction.update(updateOptions);
}

async function mensagemfechamento(interaction, user, client) {

    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemfechamento') || {};

    const {
        content = '',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
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


    const embedprincipal = new EmbedBuilder()
        .setAuthor({ name: `Configuração Mensagem Fechamento` })
        .setColor('#ADD8E6')
        .setDescription(`- Aqui você pode configurar a mensagem de fechamento!`)

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarmensagemfechamento')
            .setLabel('Definir Mensagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparmensagemfechamento')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(content == '' ? true : false)
            .setStyle(4),
    )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarembedfechamento')
            .setLabel('Definir Embed')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparembedfechamento')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(title == 'Não definido' ? true : false)
            .setStyle(4),
    )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('definirimagemfechamento')
            .setLabel('Definir Imagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparimagemfechamento')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(contentimage != 'Não definido' || banner != 'Não definido' || thumbnail != 'Não definido' ? false : true)
            .setStyle(4),
    )

    const row5 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("testarfechamento")
            .setLabel('Testar')
            .setEmoji(`1238978383845654619`)
            .setDisabled(title != 'Não definido' || content != '' || contentimage != 'Não definido' ? false : true)
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("returnautolock")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    const updateOptions = {
        content: content !== '' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample, embedprincipal] : [embedprincipal],
        components: [row, row2, row3, row5],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    interaction.update(updateOptions);
}

async function testarfechamento(interaction, user, client) {

    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemfechamento') || {};

    const {
        content = 'Não definido',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
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

    const updateOptions = {
        content: content !== 'Não definido' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample] : [],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    interaction.reply(updateOptions);
}

async function testarbertura(interaction, user, client) {

    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemabertura') || {};

    const {
        content = 'Não definido',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
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

    const updateOptions = {
        content: content !== 'Não definido' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample] : [],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    interaction.reply(updateOptions);
}

async function mensagemautogeral(interaction, user, client) {

    const repostagem = client.db.General.get(`ConfigGeral.repostagemautomatica.status`) == true ? `\`🟢 Ativado\`` : `\`🔴 Desativado\``
    const repostagemaoreiniciarStatus = client.db.General.get(`ConfigGeral.repostagemautomatica.reiniciar`);
    const repostagemaoreiniciar = repostagemaoreiniciarStatus === true || repostagemaoreiniciarStatus === null ? `\`🟢 Ativado\`` : `\`🔴 Desativado\``;
    let status = client.db.General.get('ConfigGeral.repostagemautomatica.status')
    let label
    let emoji
    let buttonColor

    if (status == true) {
        label = 'Desativar Repostagem'
        emoji = "<:desligar:1238978047504547871>"
        buttonColor = 4
    } else {
        label = 'Ativar Repostagem'
        emoji = "<:Ligado:1238977621220655125>"
        buttonColor = 3
    }


    let horario1formatado = client.db.General.get(`ConfigGeral.repostagemautomatica.horario1`) ? `\`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario1`)}\` - ${client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario1`) ? `<t:${Math.floor(client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario1.hora`) / 1000)}:R>` : `\`Não Enviado\``}` : `\`Horário não definido.\``
    let horario2formatado = client.db.General.get(`ConfigGeral.repostagemautomatica.horario2`) ? `\`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario2`)}\` - ${client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario2`) ? `<t:${Math.floor(client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario2.hora`) / 1000)}:R>` : `\`Não Enviado\``}` : `\`Horário não definido.\``
    let horario3formatado = client.db.General.get(`ConfigGeral.repostagemautomatica.horario3`) ? `\`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario3`)}\` - ${client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario3`) ? `<t:${Math.floor(client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario3.hora`) / 1000)}:R>` : `\`Não Enviado\``}` : `\`Horário não definido.\``


    const embed = new EmbedBuilder()
        .setColor('#ADD8E6')
        .setAuthor({ name: `${client.user.username} | Painel de Repostagem`, iconURL: `${client.user.displayAvatarURL()}` })
        .setDescription(`- Aqui você pode configurar a repostagem de mensagens!`)
        .setFields(
            { name: `Repostagem:`, value: `- Ao Ativar, a mensagem será respotada automaticamente no horário configurado.\n - **Sistema:** ${repostagem}`, inline: false },
            { name: `Repostagem Ao Reiniciar:`, value: `- Ao Ativar, a mensagem será repostada automaticamente ao reiniciar o bot.\n - **Sistema:** ${repostagemaoreiniciar}`, inline: false },
            { name: `Horários de Repostagem:`, value: `- ${horario1formatado}\n- ${horario2formatado}\n- ${horario3formatado} `, inline: false }
        )

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("ativarrepostagem")
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor),
        new ButtonBuilder()
            .setCustomId("reenviarmensagens")
            .setLabel('Reenviar Mensagens')
            .setEmoji(`1237122935437656114`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("configurarrepostagem")
            .setLabel('Repostagem')
            .setEmoji(`1229787808936230975`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("configprodutosrespotar")
            .setLabel('Produtos a Repostar')
            .setEmoji(`1242666444051976298`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("returnacoesautomaticas")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row] })
}
async function configprodutosrespotar(interaction, user, client) {

    let quantidade

    if (!client.db.General.get(`ConfigGeral.produtosrespostar`)) {
        quantidade = 0
    } else {
        quantidade = client.db.General.get(`ConfigGeral.produtosrespostar`).length
    }

    let produtosrespostar = quantidade == 0 ? `Todos os produtos serão repostados.` : `Produtos configurados: (\`${quantidade}\`)`

    const embed = new EmbedBuilder()
        .setColor('#ADD8E6')
        .setAuthor({ name: `${client.user.username} | Painel de Produtos`, iconURL: `${client.user.displayAvatarURL()}` })
        .setDescription(`- Aqui você pode configurar os produtos que serão repostados!`)
        .setFields(
            { name: `Produtos:`, value: `${produtosrespostar}`, inline: false }
        )

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("adicionarprodutos")
            .setLabel('Adicionar Produtos')
            .setEmoji(`1233110125330563104`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("removerprodutos")
            .setLabel('Remover Produtos')
            .setEmoji(`1242907028079247410`)
            .setDisabled(quantidade == 0 ? true : false)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("returnmensagemautogeral")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row] })
}
async function adicionarprodutosrepostar(interaction, user, client) {

    let produtoscadastrados = client.db.produtos.fetchAll();
    let selects = [];
    const produtosPorSelect = 25;

    while (produtoscadastrados.length > 0) {
        const opcoes = produtoscadastrados.splice(0, Math.min(produtosPorSelect, produtoscadastrados.length)).map(element => {
            const name = (element.data.settings.name.length > 15) ? `${element.data.settings.name.slice(0, 15)}...` : element.data.settings.name;
            return {
                label: `ID: ${element.ID.split('_')[0]} | NOME: ${name}`,
                value: `${element.ID}`,
                emoji: `1233110125330563104`
            };
        });

        const select = {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: `adicionarprodutosrepostar_${selects.length}`,
                    options: opcoes,
                    placeholder: 'Selecione os produtos',
                    min_values: 1,
                    max_values: opcoes.length
                }
            ]
        };

        selects.push(select);
    }

    const botao = {
        type: 1,
        components: [
            {
                type: 2,
                style: 2,
                custom_id: 'returnconfigprodutosrespotar',
                emoji: { id: '1237055536885792889', name: null, animated: false }
            }
        ]
    };

    selects.push(botao);


    interaction.update({ components: selects, ephemeral: true })
}
async function removerprodutosrepostar(interaction, user, client) {

    let produtoscadastrados = client.db.General.get(`ConfigGeral.produtosrespostar`);
    let selects = [];
    const produtosPorSelect = 25;

    while (produtoscadastrados.length > 0) {
        const opcoes = produtoscadastrados.splice(0, Math.min(produtosPorSelect, produtoscadastrados.length)).map(element => {
            const name = (element.name.length > 15) ? `${element.name.slice(0, 15)}...` : element.name;
            return {
                label: `ID: ${element.id.split('_')[0]} | NOME: ${name}`,
                value: `${element.id}`,
                emoji: `1242907028079247410`
            };
        });

        const select = {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: `removerprodutosrepostar_${selects.length}`,
                    options: opcoes,
                    placeholder: 'Selecione os produtos',
                    min_values: 1,
                    max_values: opcoes.length
                }
            ]
        };

        selects.push(select);
    }


    const botao = {
        type: 1,
        components: [
            {
                type: 2,
                style: 2,
                custom_id: 'returnconfigprodutosrespotar',
                emoji: { id: '1237055536885792889', name: null, animated: false }
            }
        ]
    };

    selects.push(botao);

    interaction.update({ components: selects, ephemeral: true })
}
async function configmoderacao(interaction, user, client) {

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Moderação')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            // { name: `Sistemas`, value: `-# - ${statusVendas} Sistema de Vendas\n-# -  \`${statusAutenticacao}\` Sistema de Autenticação\n-# - \`🔴\` Sistema de Proteção`, inline: true },
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("autorole")
                .setLabel('Sistema de AutoRole')
                .setEmoji(`1233127515141308416`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("boasveindas")
                .setLabel('Sistema de Boas Vindas')
                .setEmoji(`1242906307443560448`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("systemantifake")
                .setLabel('Sistema de Anti-Fake')
                .setEmoji(`1242906307443560448`)
                .setStyle(2),
        )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.update({
        embeds: [embed],
        components: [row, row3],
        ephemeral: true
    })
}
async function BlackListPainel(interaction, client) {
    const ss = client.db.blacklist.fetchAll();

    // Garante que existe a key users
    if (ss.length <= 0) {
        client.db.blacklist.set(`BlackList.users`, []);
    }

    let fff = ``;

    for (let i = 0; i < ss.length; i++) {
        const entry = ss[i];
        const users = entry.data.users;

        if (users.length > 0) {
            for (let j = 0; j < users.length; j++) {
                const userId = users[j];
                fff += `-# - \`ID: ${j + 1}\` - <@${userId}> \`(${userId})\`\n`;
            }
        }
    }

    const description = fff !== ``
        ? `${fff}`
        : `-# - Nenhum usuário cadastrado.`;

    const uptimeTimestamp = Math.floor(client.readyAt.getTime() / 1000);


    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Sistema de BlackList')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${uptimeTimestamp}:R>`, inline: true },
            { name: `BlackList`, value: description, inline: false },
        );



    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("AdicionarNaBlacklist")
            .setLabel('Adicionar Membro na Black-List')
            .setEmoji('1233110125330563104')
            .setStyle(3),
        new ButtonBuilder()
            .setCustomId("RemoverNaBlacklist")
            .setLabel('Remover Membro na Black-List')
            .setEmoji('1242907028079247410')
            .setStyle(4),
        new ButtonBuilder()
            .setCustomId("PainelVendas")
            .setEmoji('1237055536885792889')
            .setStyle(2)
    );

    await interaction.update({
        embeds: [embed],
        components: [row]
    });
}

async function SaldoInvitePainel(interaction, client, at) {

    let status = client.db.General.get('ConfigGeral.Convites.Status') ? 'ON' : 'OFF'
    let emoji
    let label
    let buttonColor

    if (status == 'ON') {
        status = `\`Ligado\``
        emoji = "<:desligar:1238978047504547871>"
        label = 'Desligar Convites'
        buttonColor = 4
    } else if (status == 'OFF') {
        status = `\`Desligado\``
        emoji = "<:Ligado:1238977621220655125>"
        label = 'Ligar Convites'
        buttonColor = 3
    }

    const valor = client.db.General.get('ConfigGeral.Convites.QuantoVaiGanharPorInvites') !== null ? Number(client.db.General.get('ConfigGeral.Convites.QuantoVaiGanharPorInvites')) : 0.10
    console.log(valor)
    let CargoExpecificoConvite = client.db.General.get(`ConfigGeral.Convites.Cargo`) == null ? `\`Todos\`` : `<@&${client.db.General.get(`ConfigGeral.Convites.Cargo`)}>`
    let qtdinvitesresgatarsaldo = Number(client.db.General.get('ConfigGeral.Convites.qtdinvitesresgatarsaldo') == null ? 2 : client.db.General.get('ConfigGeral.Convites.qtdinvitesresgatarsaldo'))
    let QuantoVaiGanharPorInvites = Number(valor).toFixed(2)
    qtdinvitesresgatarsaldo = Number(qtdinvitesresgatarsaldo)
    QuantoVaiGanharPorInvites = Number(QuantoVaiGanharPorInvites).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Invite')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Invite`, value: `-# - Sistema de Convites: ${status}\n-# - Cargo Expecifico: ${CargoExpecificoConvite}\n-# - Invites para Ganhar Saldo: \`${qtdinvitesresgatarsaldo}\`\n-# - Ganhar por Invite: \`${QuantoVaiGanharPorInvites}\``, inline: false },
        );


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("SaldoporInvite")
                .setLabel('Saldo por Invite')
                .setEmoji(`1242917506247692491`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("QuantosInvitesParaGanharSaldo")
                .setLabel('Quantos Invites')
                .setEmoji(`1243254225799217172`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("returndefinicoesconfig")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("StatusConvites")
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(buttonColor),
            new ButtonBuilder()
                .setCustomId("ResetarConvites")
                .setLabel('Resetar Configurações')
                .setEmoji(`1237122940617883750`)
                .setStyle(4),
            new ButtonBuilder()
                .setCustomId("CargoExpecificoConvite")
                .setLabel('Cargo Especifico')
                .setEmoji(`1233127515141308416`)
                .setStyle(2),
        )

    if (at == 1) {
        return interaction.editReply({ content: ``, embeds: [embed], components: [row2, row] })
    }

    await interaction.update({ content: ``, embeds: [embed], components: [row2, row] })

}

async function UpdateStatusVendas(interaction, user, client) {
    const currentStatus = client.db.General.get(`ConfigGeral.Status`);

    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON'
    client.db.General.set(`ConfigGeral.Status`, newStatus);

    PainelVendas(interaction, client)
}

async function UpdatePagamento(interaction, user, client) {

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Formas De Pagamento')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            // { name: `Sistemas`, value: `-# - ${statusVendas} Sistema de Vendas\n-# -  \`${statusAutenticacao}\` Sistema de Autenticação\n-# - \`🔴\` Sistema de Proteção`, inline: true },
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ConfigMP")
                .setLabel('Mercado Pago')
                .setEmoji(`<:1289361326203731968:1289647549409525760>`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ConfigSaldo")
                .setLabel('Saldo')
                .setEmoji(`1242917506247692491`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ConfigSemiAuto")
                .setLabel('Semi-Automático')
                .setEmoji(`<:1289381400801316966:1289647562520924241>`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ConfigCashBack")
                .setLabel('Cashback')
                .setEmoji(`<:1289360364634509454:1289647517390340167>`)
                .setStyle(2),

        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ConfigEfi")
                .setLabel('Efí Bank')
                .setEmoji(`1326905361596284990`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ConfigNuBankImap")
                .setLabel('Nubank ou PicPay')
                .setEmoji(`<:buy:1354209634939830372>`)
                .setStyle(2),
        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("blockbank")
                .setLabel('Bancos Bloqueados')
                .setEmoji(`<:1225477825285328979:1289647475765936321>`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("TimePagament")
                .setLabel('Tempo para Pagar')
                .setEmoji(`1229787808936230975`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ConfigMoedaPay")
                .setLabel('Selecionar Moeda')
                .setEmoji(`<:1289360472709009418:1301908096418975785>`)
                .setStyle(2),
        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("returndefinicoesconfig")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )

    await interaction.update({
        embeds: [embed],
        components: [row, row2, row4, row3]
    });
}


async function blockbank(interaction, user, client) {

    let bancosfraudulentos = {
        'Picpay Serviços S.A.': { quantidade: 144, valorTotal: 1940.4400000000003 },
        'Banco Inter S.A.': { quantidade: 446, valorTotal: 6733.349999999997 },
        'Nu Pagamentos S.A.': { quantidade: 116, valorTotal: 1353.6700000000005 },
        'Banco do Brasil S.A.': { quantidade: 5, valorTotal: 580.03 },
        'Ame Digital Brasil Ltda.': { quantidade: 3, valorTotal: 7.5 },
        'Cloud Walk Meios de Pagamentos e Serviços Ltda.': { quantidade: 6, valorTotal: 132.68 },
        'Banco Bradesco S.A.': { quantidade: 13, valorTotal: 196.14000000000004 },
        'Banco Itaucard S.A.': { quantidade: 7, valorTotal: 201.49 },
        'PagSeguro Internet S.A.': { quantidade: 3, valorTotal: 44.25 },
        'Banco BTG Pactual S.A.': { quantidade: 1, valorTotal: 11 },
        'Recargapay Pagamentos Ltda.': { quantidade: 1, valorTotal: 10 },
        'Banco Santander (Brasil) S.A.': { quantidade: 3, valorTotal: 3629.62 }
    }

    let opcoes = [];
    let banksblock = interaction.client.db.General.get('ConfigGeral.BankBlock') || [];

    for (let banco in bancosfraudulentos) {
        const { quantidade, valorTotal } = bancosfraudulentos[banco];

        opcoes.push(
            new StringSelectMenuOptionBuilder()
                .setLabel(banco)
                .setDescription(`${quantidade} Fraudes, total de ${Number(valorTotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`)
                .setValue(banco)
                .setDefault(banksblock.includes(banco))
        );
    }

    const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Bloquear Bancos')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            {
                name: `Informações`,
                value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`,
                inline: true
            }
        );

    const select = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("blockbank")
            .setPlaceholder('Selecione o Banco que deseja bloquear')
            .setMinValues(0)
            .setMaxValues(opcoes.length)
            .addOptions(opcoes)
    );

    const botao = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returnUpdatePagamento")
            .setEmoji(`1237055536885792889`)
            .setStyle(2)
    );

    await interaction.update({
        content: '',
        embeds: [embed],
        components: [select, botao]
    });
}


async function ConfigMP(interaction, user, client) {
    const status = client.db.General.get('ConfigGeral').MercadoPagoConfig.PixToggle


    let buttonColor
    let labelpix
    let emojipix

    if (status == 'ON') {
        buttonColor = 4
        labelpix = 'Desligar Mercado Pago'
        emojipix = "<:desligar:1238978047504547871>"
    } else if (status == 'OFF') {
        buttonColor = 3
        labelpix = 'Ativar Mercado Pago'
        emojipix = "<:Ligado:1238977621220655125>"
    }

    const status2 = client.db.General.get('ConfigGeral').MercadoPagoConfig.SiteToggle


    if (status2 == 'ON') {
        buttonColor2 = 4
        labelsite = 'Desligar Site'
        emojisite = "<:desligar:1238978047504547871>"

    } else if (status2 == 'OFF') {
        buttonColor2 = 3
        labelsite = 'Ativar Site'
        emojisite = "<:Ligado:1238977621220655125>"
    }

    let tokenmpformatado = client.db.General.get('ConfigGeral.MercadoPagoConfig.TokenAcessMP') != "" ? `${(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP).substring(0, 24)}********************************` : 'Não configurado.'
    let metodopagamento = status == 'ON' && status2 == 'ON' ? `\`Pix\` - Checkout transparente\n- \`Site\` - Checkout transparente` : status == 'ON' ? `\`Pix\` - Checkout transparente` : status2 == 'ON' ? `\`Site\` - Checkout transparente` : `\`Não configurado.\``

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Mercado Pago')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Mercado Pago`, value: `-# - Status: ${status == 'ON' || status2 == 'ON' ? `\`Ativado\`` : `\`Desativado\``}\n-# - Mercado Pago Access Token: ||${tokenmpformatado}||\n-# - Métodos De Pagamento: ${metodopagamento}`, inline: false },
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("PixMPToggle")
                .setLabel(labelpix)
                .setEmoji(emojipix)
                .setStyle(buttonColor),
            new ButtonBuilder()
                .setCustomId("+18porra")
                .setLabel('Autorizar')
                .setEmoji(`1237122935437656114`)
                .setStyle(2)
        )



    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )


    await interaction.update({
        embeds: [embed],
        components: [row, row2]
    })

}

async function ToggeMP(interaction, user, client) {

    if (interaction.customId == 'PixMPToggle') {
        const currentStatus = client.db.General.get(`ConfigGeral.MercadoPagoConfig.PixToggle`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        client.db.General.set(`ConfigGeral.MercadoPagoConfig.PixToggle`, newStatus);
        ConfigMP(interaction, user, client)
    }

    if (interaction.customId == 'TimePagament') {
        let tempo = client.db.General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) || 10
        const modalaAA = new ModalBuilder()
            .setCustomId('timeMP')
            .setTitle(`Alterar Tempo`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('timeMP')
            .setLabel("TEMPO ATUAL: " + tempo + " minutos")
            .setPlaceholder("10")
            .setValue(`${tempo}`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(256)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);
    }


}

async function TimeMP(interaction, user, client) {
    if (interaction.customId === 'timeMP') {
        const NewTime = interaction.fields.getTextInputValue('timeMP');

        if (/^\d+$/.test(NewTime)) {

            client.db.General.set(`ConfigGeral.MercadoPagoConfig.TimePagament`, NewTime)

            interaction.reply({ content: `${global.emoji.certo} Tempo de pagamento alterado para: \`${NewTime}\` minutos.`, ephemeral: true })
        } else {
            interaction.reply({ content: `${global.emoji.errado} O tempo de pagamento deve ser um número!`, ephemeral: true })
            return
        }
    }
    const { default: MercadoPagoConfig, Payment } = require("mercadopago");

    const configureMercadoPago = (accessToken) => {
        return new MercadoPagoConfig({
            accessToken: accessToken
        });
    };

    if (interaction.customId === 'tokenMP') {
        const tokenMP = interaction.fields.getTextInputValue('tokenMP');

        try {
            const payment_data = {
                transaction_amount: 10,
                description: 'Testando se o token é Válido',
                payment_method_id: 'pix',
                payer: {
                    email: 'aliensales@gmail.com',
                    first_name: 'Victor André',
                    last_name: 'Ricardo Almeida',
                    identification: {
                        type: 'CPF',
                        number: '15084299872',
                    },
                    address: {
                        zip_code: '86063190',
                        street_name: 'Rua Jácomo Piccinin',
                        street_number: '971',
                        neighborhood: 'Pinheiros',
                        city: 'Londrina',
                        federal_unit: 'PR',
                    },
                },
            };

            // Usa o token enviado pelo usuário!
            const mercadoPagoClient = configureMercadoPago(tokenMP);
            const payment = new Payment(mercadoPagoClient);
            await payment.create({ body: payment_data });
            client.db.General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`, tokenMP);
            await ConfigMP(interaction, user, client);

            interaction.followUp({
                content: `${global.emoji.certo} Configuração de pagamento atualizada com sucesso!`,
                ephemeral: true
            });

        } catch (error) {
            console.log('Erro ao criar pagamento:', error.response ? error.response : error);

            await interaction.reply({
                content: `⚠️ | Access Token inválido!\n${error.message}\n\n> Tutorial para pegar o Access Token: [CliqueAqui](https://www.youtube.com/watch?v=w7kyGZUrkVY&feature=youtu.be)\n> Lembre-se de cadastrar uma chave pix na sua conta mercado pago!`,
                ephemeral: true,
            });
            return;
        }
    }


}

async function ConfigSaldo(interaction, user, client) {
    const config = client.db.General.get('ConfigGeral').SaldoConfig;

    let statussaldo = config.SaldoStatus === 'ON' ? '`Ativado`' : '`Desativado`';
    let bonusSaldo = config.Bonus;
    let valorMinimo = Number(config.ValorMinimo).toLocaleString(global.lenguage.um, {
        style: 'currency',
        currency: global.lenguage.dois
    });

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Saldo')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Saldo`, value: `-# - Status: ${statussaldo}\n-# - Bônus por depósito: \`${bonusSaldo}%\`\n-# - Valor mínimo para depósito: \`${valorMinimo}\``, inline: false },
        );


    let buttonColor;
    let label;
    let emoji;
    if (config.SaldoStatus === 'ON') {
        buttonColor = 4;
        label = 'Desligar Saldo';
        emoji = "<:desligar:1238978047504547871>";
    } else {
        buttonColor = 3; // Success
        label = 'Ativar Saldo';
        emoji = "<:Ligado:1238977621220655125>";
    }

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('SaldoToggle')
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor),
        new ButtonBuilder()
            .setCustomId('BonusChange')
            .setLabel('Configurar Saldo')
            .setEmoji('1236318155056349224')
            .setStyle(2)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returnUpdatePagamento")
            .setEmoji(`1237055536885792889`)
            .setStyle(2)
    );

    await interaction.update({
        embeds: [embed],
        components: [row1, row3]
    });
}

async function ToggleSaldo(interaction, user, client) {
    var t = await uu.get(interaction.message.id)

    if (interaction.customId == 'SaldoToggle') {
        const currentStatus = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        client.db.General.set(`ConfigGeral.SaldoConfig.SaldoStatus`, newStatus);
        ConfigSaldo(interaction, user, client)

    }

    if (interaction.customId == 'BonusChange') {
        const modalaAA = new ModalBuilder()
            .setCustomId('bonusSaldo')
            .setTitle(`Bônus por depósito`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('bonusSaldo')
            .setLabel("PORCENTAGEM DO BÔNUS")
            .setPlaceholder("10")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(3)
        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('bonusPorcent')
            .setLabel("VALOR MÍNIMO DE DEPÓSITO")
            .setPlaceholder("5")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(3)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
        modalaAA.addComponents(firstActionRow3, firstActionRow2);
        await interaction.showModal(modalaAA);

    }
}

async function bonusSaldo(interaction, user, client) {
    if (interaction.customId === 'bonusSaldo') {

        const bonusSaldo = interaction.fields.getTextInputValue('bonusSaldo');
        const bonusPorcent = interaction.fields.getTextInputValue('bonusPorcent');
        const hasLetters1 = /[a-zA-Z]/.test(bonusSaldo);
        const hasLetters2 = /[a-zA-Z]/.test(bonusPorcent);

        if (hasLetters1 || hasLetters2) {
            interaction.reply({ content: `${global.emoji.errado} Você inseriu em seus VALORES alguma letra`, ephemeral: true });
            return;
        }

        if (bonusSaldo > 100) {
            interaction.reply({ content: `${global.emoji.errado} Você não pode inserir valor MAIOR que 100`, ephemeral: true });
            return;
        }

        client.db.General.set(`ConfigGeral.SaldoConfig.ValorMinimo`, bonusPorcent);
        client.db.General.set(`ConfigGeral.SaldoConfig.Bonus`, bonusSaldo);
        await ConfigSaldo(interaction, user, client);
        interaction.followUp({ content: `${global.emoji.certo} Bônus por depósito: ${bonusSaldo}%\n${global.emoji.certo} Valor mínimo de depósito: ${Number(bonusPorcent).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`, ephemeral: true });
    }
}

async function ConfigSemiAuto(interaction, user, client) {
    const config = client.db.General.get('ConfigGeral').SemiAutoConfig;

    let status2 = config.SemiAutoStatus;
    let buttonColor2;
    let label;
    let emoji;

    if (status2 === 'ON') {
        status2 = '`Ativado`';
        buttonColor2 = 4;
        label = 'Desligar Semi Automático';
        emoji = '<:desligar:1238978047504547871>';
    } else {
        status2 = '`Desativado`';
        buttonColor2 = 3;
        label = 'Ativar Semi Automático';
        emoji = '<:Ligado:1238977621220655125>';
    }

    let chavePix = config.pix || 'Não Configurado';

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Semi-Automático')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Semi-Automático`, value: `-# - Status: ${status2}\n-# - Chave Pix: \`${chavePix}\``, inline: false },
        );

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('SemiautoToggle')
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor2),
        new ButtonBuilder()
            .setCustomId('SemiautoPix')
            .setLabel('Configurar Pix')
            .setEmoji('1236318155056349224')
            .setStyle(2)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returnUpdatePagamento")
            .setEmoji(`1237055536885792889`)
            .setStyle(2)
    );

    await interaction.update({
        embeds: [embed],
        components: [row1, row3]
    });
}

async function ToggleSemiAuto(interaction, user, client) {

    if (interaction.customId == 'SemiautoToggle') {
        const currentStatus = client.db.General.get(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        client.db.General.set(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`, newStatus);
        await ConfigSemiAuto(interaction, user, client)

    }
    if (interaction.customId == 'SemiautoPix') {
        const modalaAA = new ModalBuilder()
            .setCustomId('SemiautoPix')
            .setTitle(`Alterar Chave Pix`);

        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('Pix')
            .setLabel("CHAVE:")
            .setPlaceholder("suachavepix@gmail.com")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
        modalaAA.addComponents(firstActionRow2);
        await interaction.showModal(modalaAA);

    }


}

async function PixChangeSemiAuto(interaction, user, client) {
    if (interaction.customId === 'SemiautoPix') {
        const Pix = interaction.fields.getTextInputValue('Pix');

        // if (Pix.includes('[') || Pix.includes(']') || Pix.includes('<') || Pix.includes('>') || Pix.includes('(') || Pix.includes(')') || Pix.includes('{') || Pix.includes('}')) {
        //     interaction.reply({ content: `ERROR: você inseriu em sua CHAVE PIX algum caractere inválido\n\nRecomendo Utilizar **CPF ou EMAIL sem pontos.`, ephemeral: true });
        //     return;
        // }

        // if (Pix.includes(' ')) {
        //     interaction.reply({ content: `ERROR: você inseriu em sua CHAVE PIX algum espaço\n\nRecomendo Utilizar **CPF ou EMAIL sem pontos.`, ephemeral: true });
        //     return;
        // }

        // if (Pix.includes('.') || Pix.includes('-')) {
        //     interaction.reply({ content: `ERROR: você inseriu em sua CHAVE PIX algum caractere inválido\n\nRecomendo Utilizar **CPF ou EMAIL sem pontos. (CASO NÃO FUNCIONER TESTE OUTRA CHAVEPIX OU CADASTRE OUTRA)`, ephemeral: true });
        // }

        // if (Pix.length > 30) {
        //     interaction.reply({ content: `ERROR: você inseriu em sua CHAVE PIX um valor muito grande\n\nRecomendo Utilizar **CPF ou EMAIL sem pontos.`, ephemeral: true });
        //     return;
        // }

        client.db.General.set(`ConfigGeral.SemiAutoConfig.pix`, Pix);

        await ConfigSemiAuto(interaction, user, client);
    }
}


async function configbot(interaction, user, client) {

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Configurações')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Configurações`, value: `-# - Nome da Aplicação: \`${client.user.username}\`\n-# - Cor Padrão: \`${client.db.General.get('ConfigGeral').ColorEmbed}\`\n-# - Banner Default: ${client.db.General.get('ConfigGeral.BannerEmbeds') == null ? `\`Não definido...\`` : `[[Banner](${client.db.General.get('ConfigGeral.BannerEmbeds')})]`}\n-# - Miniatura Default: ${client.db.General.get('ConfigGeral.MiniaturaEmbeds') == null ? `\`Não definido...\`` : `[[Miniatura](${client.db.General.get('ConfigGeral.MiniaturaEmbeds')})]`}`, inline: false },
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ChangeName")
                .setLabel('Alterar Nome')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ChangeAvatar")
                .setLabel('Alterar Avatar')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ChangeColorBOT")
                .setLabel('Alterar Cor Padrão do bot')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
        )


    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ChangeStatusBOT")
                .setLabel('Alterar o Status do bot')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("AlterarBanner")
                .setLabel('Alterar Banner')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("AlterarMiniatura")
                .setLabel('Alterar Miniatura')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
        )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2)
    )

    await interaction.update({
        content: ``, embeds: [embed], components: [row, row2, row3]
    })
}

async function configbotToggle(interaction, user, client) {

    if (interaction.customId == 'ChangeName') {

        const modalaAA = new ModalBuilder()
            .setCustomId('newnamebot')
            .setTitle(`Alterar Nome Do BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('newnamebot')
            .setLabel("NOVO NOME:")
            .setPlaceholder("Novo Nome")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeAvatar') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeAvatar')
            .setTitle(`Alterar Avatar Do BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('ChangeAvatar')
            .setLabel("LINK AVATAR:")
            .setPlaceholder("NOVO AVATAR")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeColorBOT') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeColorBOT')
            .setTitle(` | Alterar COR do seu BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('ChangeColorBOT')
            .setLabel("Nova Cor do seu Bot. (Hexadecimal):")
            .setPlaceholder("#FF0000, #FF69B4, #FF1493")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'AlterarBanner') {

        const modalaAA = new ModalBuilder()
            .setCustomId('AlterarBanner')
            .setTitle(` | Alterar Banner do Painel`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('editpainelBanner')
            .setLabel("LINK BANNER:")
            .setPlaceholder("NOVO BANNER")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId.startsWith('AlterarMiniatura')) {
        const t = await uu.get(interaction.message.id)
        const modalaAA = new ModalBuilder()
            .setCustomId('AlterarMiniatura')
            .setTitle(` | Alterar Miniatura do Painel`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('AlterarMiniatura')
            .setLabel("LINK DA MINIATURA:")
            .setPlaceholder("NOVO MINIATURA")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeStatusBOT') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeStatusBOT')
            .setTitle(`Alterar Status do seu BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('typestatus')
            .setLabel("ESCOLHA O TIPO DE PRESENÇA:")
            .setPlaceholder("Online, Ausente, Invisivel ou Não Pertubar")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('ativistatus')
            .setLabel("ESCOLHA O TIPO DE ATIVIDADE:")
            .setPlaceholder("Jogando, Assistindo, Competindo, Transmitindo, Ouvindo")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN3 = new TextInputBuilder()
            .setCustomId('textstatus')
            .setLabel("ESCREVA O TEXTO DA ATIVIDADE:")
            .setPlaceholder("Vendas Automáticas")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN4 = new TextInputBuilder()
            .setCustomId('urlstatus')
            .setLabel("URL DO CANAL:")
            .setPlaceholder("Se a escolha foi Transmitindo, Coloque a Url aqui, ex: https://www.twitch.tv/gaules")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
        const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);
        const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN4);
        modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6);
        await interaction.showModal(modalaAA);

    }

}

async function FunctionCompletConfig(interaction, user, client) {
    if (interaction.customId === 'newnamebot') {
        const newnamebot = interaction.fields.getTextInputValue('newnamebot');
        try {
            await client.user.setUsername(newnamebot)
            await configbot(interaction, user, client)
            interaction.followUp({ ephemeral: true, content: `${global.emoji.certo} Você alterou o nome do seu bot com sucesso!` })
        } catch (error) {
            interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Ocorreu um erro interno na API do bot, ou você está tentando alterar o nome muito rapidamente.` })
        }
    }

    if (interaction.customId === 'ChangeAvatar') {
        const ChangeAvatar = interaction.fields.getTextInputValue('ChangeAvatar');

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(ChangeAvatar)) {
            try {
                await client.user.setAvatar(`${ChangeAvatar}`)

                await configbot(interaction, user, client)
                interaction.followUp({ ephemeral: true, content: `${global.emoji.certo} Você alterou o avatar do seu bot com sucesso!` })
            } catch (error) {
                interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Ocorreu um erro interno na API do bot, ou você está tentando alterar o avatar muito rapidamente.` })
            }
        } else {
            interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Você inseriu um LINK de imagem invalido para seu BOT;` })
        }
    }
    if (interaction.customId === 'ChangeColorBOT') {
        const ChangeColorBOT = interaction.fields.getTextInputValue('ChangeColorBOT');

        var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        var isHexadecimal = regex.test(ChangeColorBOT);

        if (isHexadecimal) {

            client.db.General.set(`ConfigGeral.ColorEmbed`, ChangeColorBOT)
            await configbot(interaction, user, client)
            interaction.followUp({ ephemeral: true, content: `${global.emoji.certo} Você alterou a cor do padrão do seu bot com sucesso!` })
        } else {
            interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Você inseriu uma cor inválida para o seu bot.` })
        }
    }

    if (interaction.customId === 'AlterarMiniatura') {

        const AlterarMiniatura = interaction.fields.getTextInputValue('AlterarMiniatura');

        if (AlterarMiniatura == ``) {
            client.db.General.delete(`ConfigGeral.MiniaturaEmbeds`)
            await configbot(interaction, user, client)
            interaction.followUp({ ephemeral: true, content: `${global.emoji.certo} Você removeu a miniatura do seu bot com sucesso!` })
            return
        }

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(AlterarMiniatura)) {


            client.db.General.set(`ConfigGeral.MiniaturaEmbeds`, AlterarMiniatura)
            await configbot(interaction, user, client)
            interaction.followUp({ ephemeral: true, content: `${global.emoji.certo} Você alterou a miniatura do seu bot com sucesso!` })
        } else {
            interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Você inseriu uma miniatura invalida para seu BOT;` })
        }

    }

    if (interaction.customId === 'AlterarBanner') {
        const AlterarBanner = interaction.fields.getTextInputValue('editpainelBanner');

        if (AlterarBanner == ``) {
            client.db.General.delete(`ConfigGeral.BannerEmbeds`)
            await configbot(interaction, user, client)
            interaction.followUp({ ephemeral: true, content: `${global.emoji.certo} Você removeu o banner do seu bot com sucesso!` })
            return
        }

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(AlterarBanner)) {


            client.db.General.set(`ConfigGeral.BannerEmbeds`, AlterarBanner)
            await configbot(interaction, user, client)
            interaction.followUp({ ephemeral: true, content: `${global.emoji.certo} Você alterou o banner do seu bot com sucesso!` })
        } else {
            interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Você inseriu um banner inválido para o seu bot.` })
        }
    }


    if (interaction.customId === 'ChangeStatusBOT') {
        const typestatus = interaction.fields.getTextInputValue('typestatus');
        const ativistatus = interaction.fields.getTextInputValue('ativistatus');
        const textstatus = interaction.fields.getTextInputValue('textstatus');
        const urlstatus = interaction.fields.getTextInputValue('urlstatus');

        if (typestatus !== 'Online' && typestatus !== 'Ausente' && typestatus !== 'Invisível' && typestatus !== 'Não Perturbar') return interaction.reply({ ephemeral: true, content: `ERROR: Você inseriu um TIPO incorreto de STATUS;` })
        if (ativistatus !== "Jogando" && ativistatus !== "Assistindo" && ativistatus !== "Competindo" && ativistatus !== "Transmitindo" && ativistatus !== "Ouvindo") return interaction.reply({ ephemeral: true, content: `ERROR: Você inseriu uma ATIVIDADE incorreto de STATUS;` })
        if (ativistatus == "Transmitindo") {
            if (urlstatus == "") {
                interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Você não inseriu a URL do canal de transmissão.` })
                return
            }
        }


        client.db.General.set(`ConfigGeral.StatusBot.typestatus`, typestatus)
        client.db.General.set(`ConfigGeral.StatusBot.ativistatus`, ativistatus)
        client.db.General.set(`ConfigGeral.StatusBot.textstatus`, textstatus)

        interaction.reply({ content: `${global.emoji.certo} Você alterou com sucesso o status do seu bot.`, ephemeral: true })

        if (urlstatus !== "") {
            client.db.General.set(`ConfigGeral.StatusBot.urlstatus`, urlstatus)
        }


    }
}




async function ButtonDuvidasPainel(interaction, client, sa, msg) {
    let statusFlag = client.db.General.get(`ConfigGeral.statusduvidas`) ? "ON" : "OFF";
    let buttonColor, label, emoji;

    if (statusFlag === 'ON') {
        statusFlag = `🟢 Ativado`;
        buttonColor = 4;
        label = 'Desligar Sistema';
        emoji = "<:desligar:1238978047504547871>";
        anjo = "Ativado"
    } else {
        statusFlag = `🔴 Desativado`;
        buttonColor = 3;
        label = 'Ativar Sistema';
        emoji = "<:Ligado:1238977621220655125>";
        anjo = "Desativado"

    }

    const canalRaw = client.db.General.get(`ConfigGeral.channelredirectduvidas`);
    const canal = canalRaw ? `[Canal](${canalRaw})` : '`Não definido...`';
    const textoduvidas = client.db.General.get(`ConfigGeral.textoduvidas`) || 'Dúvida';
    const emojiduvidas = client.db.General.get(`ConfigGeral.emojiduvidas`) || '🔗';
    const uptimeTimestamp = Math.floor(client.readyAt.getTime() / 1000);



    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Sistema de Dúvidas')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${uptimeTimestamp}:R>`, inline: true },
            { name: `Sistema De Duvidas`, value: `-# - Status do Sistema: \`${anjo}\`\n-# - Canal de Redirecionamento: ${canal}\n-# - Texto do botão: \`${textoduvidas}\`\n-# - Emoji do botão: ${emojiduvidas}`, inline: true },
        );

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("StatusDuvidas")
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("changechannelredirecionamento")
            .setLabel('Canal de Redirecionamento')
            .setEmoji('1237122940617883750')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("changetextoduvidas")
            .setLabel('Texto Button')
            .setEmoji('1237122940617883750')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("changeemojiduvidas")
            .setLabel('Emoji Button')
            .setEmoji('1237122940617883750')
            .setStyle(2)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("PainelVendas")
            .setEmoji('1237055536885792889')
            .setStyle(2)
    );

    const payload = {
        embeds: [embed],
        components: [row1, row2, row3]
    };

    if (msg) {
        payload.message = msg
    }

    if (sa === 1) {
        return interaction.editReply(payload);
    } else {
        return interaction.update(payload);
    }
}

async function roleconfig(interaction, client) {
    let logcargo = client.db.General.get(`ConfigGeral.ChannelsConfig.CargoCliente`) == null ? '\`Não Definido...\`' : `<@&${client.db.General.get(`ConfigGeral.ChannelsConfig.CargoCliente`)}>`
    let logadm = client.db.General.get(`ConfigGeral.ChannelsConfig.CargoAdm`) == null ? '\`Não Definido...\`' : `<@&${client.db.General.get(`ConfigGeral.ChannelsConfig.CargoAdm`)}>`

    let message = `### Configurações de Cargos:\n\n- Cargo Cliente: ${logcargo}\n- Cargo Administrador: ${logadm}\n\n-# Sistema desenvolvido exclusivamente para o servidor: **${interaction.guild.name}**.`

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Cargos')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Sistemas`, value: `-# - Cargo Cliente: ${logcargo}\n-# - Cargo Administrador: ${logadm}`, inline: false },
        );


    let components = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('cargoset')
                .setPlaceholder('Selecione aqui para configurar um cargo')
                .addOptions([
                    {
                        label: 'Definir cargo de Cliente',
                        value: 'CargoCliente'
                    },
                    {
                        label: 'Definir cargo de Administrador',
                        value: 'CargoAdm'
                    },
                ])
        )


    const row4 = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    await interaction.update({
        content: ``, embeds: [embed], components: [components, row4]
    })

}


async function SelecionarCargos(interaction, id, client) {
    let cargo = client.db.General.get(`ConfigGeral.ChannelsConfig.${id}`) == null ? '\`Não Definido...\`' : `<@&${client.db.General.get(`ConfigGeral.ChannelsConfig.${id}`)}>`
    const select = new ActionRowBuilder()
        .addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId('roleset_' + id)
                .setPlaceholder('Selecione um cargo para definir')
                .setMaxValues(1)
                .setDefaultRoles(client.db.General.get(`ConfigGeral.ChannelsConfig.${id}`) == null ? [] : [client.db.General.get(`ConfigGeral.ChannelsConfig.${id}`)])
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ConfigRoles")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
                .setDisabled(false),
        )

    await interaction.update({
        components: [select, row2], embeds: []
    })


}


async function configchannels(interaction, user, client) {

    let logsistema = client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`)}>`
    let logsadm = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`)}>`
    let logspub = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`)}>`
    let logavaliar = client.db.General.get(`ConfigGeral.ChannelsConfig.feedbacks`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.feedbacks`)}>`
    let logsugestao = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`)}>`
    let logcategoria = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`)}>`
    let logInvites = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelInvites`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelInvites`)}>`
    let logentrada = client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`)}>`
    let logsaida = client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`)}`
    let statuscarrinho = client.db.General.get(`ConfigGeral.statuslogcompras`) == null ? '\`Ativado\`' : client.db.General.get(`ConfigGeral.statuslogcompras`) == true ? '\`Ativado\`' : `\`Desativado\``


    let buttonColor
    let label
    let emoji
    if (statuscarrinho == '\`Ativado\`') {
        buttonColor = 4
        label = 'Desativar Logs Carrinhos'
        emoji = "<:desligar:1238978047504547871>"
    } else {
        buttonColor = 3
        label = 'Ativar Logs Carrinhos'
        emoji = "<:Ligado:1238977621220655125>"
    }


    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Canais')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Canais`, value: `-# - Logs Sistema: ${logsistema}\n-# - Categoria Carrinhos: ${logcategoria}\n-# - Logs Pedidos: ${logsadm}\n-# - Logs Compras (Publica): ${logspub}\n-# - Logs FeedBacks: ${logavaliar}\n-# - Logs Carrinhos: ${statuscarrinho}`, inline: false },
        );

    let components = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('canaisset')
                .setPlaceholder('Selecione aqui para configurar um canal')
                .addOptions([
                    {
                        label: 'Definir canal de Sistema',
                        value: 'ChangeChannelMod'
                    },
                    {
                        label: 'Definir categoria de Carrinhos',
                        value: 'cat_ChannelCategoriaShop'
                    },
                    {
                        label: 'Definir canal de Pedidos',
                        value: 'ChannelLogAdm'
                    },
                    {
                        label: 'Definir canal de Compras',
                        value: 'ChannelLogPublica'
                    },
                    {
                        label: 'Definir canal de Sugestão',
                        value: 'ChannelSugestao'
                    },
                    {
                        label: 'Definir canal de Entradas',
                        value: 'ChangeChannelentrada'
                    },
                    {
                        label: 'Definir canal de Saídas',
                        value: 'ChangeChannelsaida'
                    },
                    {
                        label: 'Definir canal de Invites',
                        value: 'ChannelInvites'
                    },
                    {
                        label: 'Definir canal de Feedbacks',
                        value: 'feedbacks'
                    }
                ])
        )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("desativarlogcarrinhos")
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor),
    )

    const row4 = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.update({ embeds: [embed], components: [components, row2, row4] })
}

async function SelecionarChannels(interaction, channel, type, client) {
    let estilo
    if (type == 'channel') {
        estilo = ChannelType.GuildText
    } else if (type == 'category') {
        estilo = ChannelType.GuildCategory
    }

    let canal = client.db.General.get(`ConfigGeral.ChannelsConfig.${channel}`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.${channel}`)}>`


    const select = new ActionRowBuilder()
        .addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId('canalset_' + channel)
                .setPlaceholder('Selecione um canal / categoria para configurar')
                .setMaxValues(1)
                .setDefaultChannels(client.db.General.get(`ConfigGeral.ChannelsConfig.${channel}`) == null ? [] : [client.db.General.get(`ConfigGeral.ChannelsConfig.${channel}`)])
                .addChannelTypes(estilo)
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("vvconfigchannels")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
                .setDisabled(false),
        )

    await interaction.update({
        components: [select, row2], embeds: []
    })
}


async function ConfigTermo(interaction, user, client) {

    let status = client.db.General.get(`ConfigGeral.TermosCompra`)

    const modalaAA = new ModalBuilder()
        .setCustomId('newtermocompra')
        .setTitle(`Alterar Termos De Compra`);

    const newnameboteN = new TextInputBuilder()
        .setCustomId('newtermocompra')
        .setLabel("TERMOS DE COMPRA:")
        .setPlaceholder("Novos Termos de Compra")
        .setValue(status == null ? '' : status)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)

    const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
    modalaAA.addComponents(firstActionRow3);
    await interaction.showModal(modalaAA);
}
async function ConfigTermoConfig(interaction, user, client) {
    if (interaction.customId === 'newtermocompra') {
        const newtermocompra = interaction.fields.getTextInputValue('newtermocompra');

        if (newtermocompra == '') {
            interaction.reply({
                ephemeral: true,
                content: `${global.emoji.certo} Você removeu os termos de compra com sucesso!`
            })
            return client.db.General.delete(`ConfigGeral.TermosCompra`)
        }



        client.db.General.set(`ConfigGeral.TermosCompra`, newtermocompra)
        await PainelVendas(interaction, client)
        interaction.followUp({ ephemeral: true, content: `${global.emoji.certo} Você alterou os termos de compra com sucesso!` })
    }
}

async function ConfigCashBack(interaction, user, client) {
    const toggle = client.db.General.get(`ConfigGeral.CashBack.ToggleCashBack`);
    const statusRaw = toggle == null ? 'OFF' : toggle;

    let status, label, emoji, style;
    if (statusRaw === 'ON') {
        status = '`Ativado`';
        label = 'Desativar Cash-Back';
        emoji = '1238978047504547871';
        style = 4;
    } else {
        status = '`Desativado`';
        label = 'Ativar Cash-Back';
        emoji = '1238977621220655125';
        style = 3;
    }

    const porcentagem = client.db.General.get(`ConfigGeral.CashBack.Porcentagem`) || '0';

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Cash-Back')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Cash-Back`, value: `-# - Status: ${status}\n-# - Porcentagem: \`${porcentagem}%\``, inline: false },
        );

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('cashtoggle')
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(style),
        new ButtonBuilder()
            .setCustomId('configurarporcentagemcashback')
            .setLabel('Configurar Cash-Back')
            .setEmoji('1236318155056349224')
            .setStyle(2)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('returnUpdatePagamento')
            .setEmoji('1237055536885792889')
            .setStyle(2)
    );

    await interaction.update({
        embeds: [embed],
        components: [row1, row3]
    });
}

async function UpdateCashBack(interaction, user, client) {
    const currentStatus = client.db.General.get(`ConfigGeral.CashBack.ToggleCashBack`);
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    client.db.General.set(`ConfigGeral.CashBack.ToggleCashBack`, newStatus);

    ConfigCashBack(interaction, user, client)
}
async function autorole(interaction, client) {

    const gawawg2 = client.db.General.get(`ConfigGeral.AutoRole.add`)

    var cargosadd = ''
    if (gawawg2 !== null) {
        for (const add of gawawg2) {
            cargosadd += `<@&${add}>\n`
        }
    } else {
        cargosadd = `\`Nenhuma configuração de cargos automáticos.\`\n`
    }



    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Moderação')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `AutoRole`, value: `-# - Cargos Automáticos:\n-# - ${cargosadd}`, inline: false },
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("AdicionarNaAutorole")
                .setLabel('Adicionar Cargo Ao Entrar')
                .setEmoji(`1233110125330563104`)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId("returnconfigmoderacao")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    await interaction.update({
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}


module.exports = {
    updateMessageConfig,
    UpdateStatusVendas,
    UpdatePagamento, ConfigMP,
    ToggeMP,
    TimeMP,
    ConfigSaldo,
    ToggleSaldo,
    bonusSaldo,
    ConfigSemiAuto,
    ConfigCashBack,
    ToggleSemiAuto,
    PixChangeSemiAuto,
    configbot,
    configbotToggle,
    FunctionCompletConfig,
    configchannels,
    SelecionarChannels,
    ConfigTermo,
    UpdateCashBack,
    ConfigTermoConfig,
    ButtonDuvidasPainel,
    SaldoInvitePainel,
    BlackListPainel,
    configmoderacao,
    autorole,
    definicoes,
    mensagemautogeral,
    removerprodutosrepostar,
    adicionarprodutosrepostar,
    configprodutosrespotar,
    acoesautomaticas,
    autolock,
    mensagemabertura,
    testarbertura,
    mensagemfechamento,
    testarfechamento,
    blockbank,
    roleconfig,
    SelecionarCargos,
    PainelVendas
};