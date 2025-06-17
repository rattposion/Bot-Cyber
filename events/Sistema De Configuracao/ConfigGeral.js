const { UpdateStatusVendas, updateMessageConfig, UpdatePagamento, ConfigMP, ToggeMP, TimeMP, ToggleSaldo, bonusSaldo, ConfigSaldo, ConfigSemiAuto, ToggleSemiAuto, PixChangeSemiAuto, configbot, configbotToggle, FunctionCompletConfig, configchannels, configchannelsToggle, CompletConfigChannels, ConfigTermoConfig, ConfigTermo, ConfigCashBack, configmoderacao, autorole, definicoes, SelecionarChannels, roleconfig, SelecionarCargos, PainelVendas } = require("../../FunctionsAll/BotConfig")
const { InteractionType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, RoleSelectMenuBuilder, ChannelType, ChannelSelectMenuBuilder, IntegrationExpireBehavior, TextDisplayBuilder, MessageFlags, ButtonStyle } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const axios = require('axios');
const { QuickDB } = require("quick.db");
const { automsg } = require("../../FunctionsAll/Blacklist");
const { PainelPrincipal, ConfigurarMensagem } = require("../../FunctionsAll/PedrinhaAuth");
const { ConfigEfíStart, UpdatePix, GenerateToken, SetCallBack } = require("../../FunctionsAll/Payments/EfíBank");
const { PainelNotify, PainelWpp } = require("../../FunctionsAll/WppFunctions/PainelNotificações");
const { SendMessageZap } = require("../../FunctionsAll/WppFunctions/wpp");
const { autoreact } = require("../../FunctionsAll/ActionsAutomatics/autorectmessage");
const db = new QuickDB();
var uu = db.table('permissionsmessage')
let delaywppconfirm = {}

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.isButton()) {


            if (interaction.customId === 'PainelOauth2') {
                await PainelPrincipal(client, interaction)
            }



            if (interaction.customId === 'ativaroauth2') {


                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

                if (client.db.OAuth2.get('Config.status') == true) {
                    client.db.OAuth2.set('Config.status', false)
                } else {

                    request = request.data

                    client.db.OAuth2.set('Config.status', true)
                }

                await PainelPrincipal(client, interaction, 2)

            }



            if (interaction.customId === 'gerarlicencaoauth2') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('gerarlicencaoauth2')
                    .setTitle(`Gerar Licença OAuth2`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenbot')
                    .setLabel("Qual seu token do bot?")
                    .setPlaceholder("Exemplo: MTMwNjYxNzA2Njk2Njc0NTE1...")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('client_secret')
                    .setLabel("Qual seu client_secret do bot?")
                    .setPlaceholder("Exemplo: 4A-IanM8Re0tIl-Lu")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN2);
                modalaAA.addComponents(firstActionRow4, firstActionRow5);
                await interaction.showModal(modalaAA);

            }





        }

        if (interaction.type == InteractionType.ModalSubmit) {


            if (interaction.customId === 'gerarlicencaoauth2') {

                return interaction.deferUpdate()

                if (true) return

                const token = interaction.fields.getTextInputValue('tokenbot')
                const client_secret = interaction.fields.getTextInputValue('client_secret')

                if (token == '' || client_secret == '') return interaction.reply({ content: `${global.emoji.errado} Ocorreu algum erro, tem certeza que colocou as informações corretas?`, ephemeral: true })

                await interaction.update({ content: `${global.emoji.loading_promisse} Gerando licença...`, components: [], embeds: [] })


                request = await request.json()
                if (request.message == "401: Unauthorized") {
                    await PainelPrincipal(client, interaction, 1)
                    return interaction.followUp({ content: `${global.emoji.errado} Você tentou adicionar uma aplicação com **TOKEN** incorreto.`, ephemeral: true });
                }
                if (request.message == "Bot already registered") {
                    await PainelPrincipal(client, interaction, 1)
                    return interaction.followUp({
                        content: `${global.emoji.errado} Você já possui um bot registrado com esse token. Caso queira recuperar sua **API Key**, entre no Discord da AlienSales Solutions e utilize \`/auth\`.`,
                        ephemeral: true
                    });
                }
                if (request.message == "Invalid client_secret") {
                    await PainelPrincipal(client, interaction, 1)
                    return interaction.followUp({
                        content: `${global.emoji.errado} O client_secret informado é inválido. Verifique se o mesmo está correto.`,
                        ephemeral: true
                    });
                }

                if (request.message == "Bot successfully registered") {
                    client.db.OAuth2.set('Config.LicenseID', request.licenseKey)
                    await PainelPrincipal(client, interaction, 1)

                }

            }









            if (interaction.customId === 'timeMP') {

                TimeMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId === 'tokenMP') {
                TimeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'bonusSaldo') {

                bonusSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'SemiautoPix') {

                PixChangeSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newnamebot') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeAvatar') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeColorBOT') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'AlterarMiniatura') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'AlterarBanner') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeStatusBOT') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newtermocompra') {

                ConfigTermoConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newanuncio') {

                const title = interaction.fields.getTextInputValue('title');
                const desc = interaction.fields.getTextInputValue('desc');
                const content = interaction.fields.getTextInputValue('content');
                const image = interaction.fields.getTextInputValue('image');
                const color = interaction.fields.getTextInputValue('color');

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(title)
                    .setDescription(desc)

                if (color !== '') {
                    var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                    var isHexadecimal = regex.test(color);
                    if (isHexadecimal) {
                        embed.setColor(color)
                    } else {
                        interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Ocorreu algum erro, tem certeza que colocou as informações corretas?` })
                        return
                    }
                }
                if (image !== '') {
                    const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                    if (url.test(image)) {
                        embed.setThumbnail(image)
                    } else {
                        interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Ocorreu algum erro, tem certeza que colocou as informações corretas?` })
                        return
                    }
                }
                if (content !== '') {
                    interaction.channel.send({ embeds: [embed], content: content })
                } else {
                    interaction.channel.send({ embeds: [embed] })
                }

                interaction.reply({ ephemeral: true, content: `${global.emoji.certo} Anuncio enviado com sucesso!` })
            }








            if (interaction.customId === 'sdajuidsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');

                const stringSemEspacos = title.replace(/\s/g, '');
                const arrayDeBancos = stringSemEspacos.split(',');


                client.db.General.set(`ConfigGeral.BankBlock`, arrayDeBancos)
                const gfgfggfg = client.db.General.get(`ConfigGeral.BankBlock`)
                var hhhh = ''
                for (const key in gfgfggfg) {
                    const element = gfgfggfg[key];
                    hhhh += `${element}`;
                    if (key !== Object.keys(gfgfggfg)[Object.keys(gfgfggfg).length - 1]) {
                        hhhh += ', ';
                    }
                }
                interaction.reply({ content: `${global.emoji.certo} Lista de bancos bloqueados foi atualizada com sucesso!\n\`${hhhh}\``, ephemeral: true })
            }






            if (interaction.customId === 'sdaju11111idsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                const title2 = interaction.fields.getTextInputValue('tokenMP2');
                const title3 = interaction.fields.getTextInputValue('tokenMP3');




                if (title !== 'não') {
                    if (!isNaN(title)) {
                        client.db.General.set(`ConfigGeral.AntiFake.diasminimos`, Number(title))
                    } else {
                        interaction.reply({ content: `${global.emoji.errado} Você colocou um numero incorreto nos dias!`, ephemeral: true })
                        return
                    }
                } else {
                    client.db.General.set(`ConfigGeral.AntiFake.diasminimos`, 0)
                }


                if (title2 !== 'não') {

                    const stringSemEspacos = title2.replace(/\s/g, '');
                    const arrayDeBancos = stringSemEspacos.split(',');
                    client.db.General.set(`ConfigGeral.AntiFake.status`, arrayDeBancos)
                }


                if (title3 !== 'não') {

                    const stringSemEspacos = title3.replace(/\s/g, '');
                    const arrayDeBancos = stringSemEspacos.split(',');
                    client.db.General.set(`ConfigGeral.AntiFake.nomes`, arrayDeBancos)
                }


                interaction.reply({ content: `${global.emoji.certo} Todas configurações de Anti-Fake foram configuradas com sucesso!`, ephemeral: true })


            }



            if (interaction.customId === 'sdaju111idsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                const title2 = interaction.fields.getTextInputValue('tokenMP2');
                const title3 = interaction.fields.getTextInputValue('qualcanal');


                const stringSemEspacos = title3.replace(/\s/g, '');
                const arrayDeBancos = stringSemEspacos.split(',');


                if (isNaN(title2) == true) return interaction.reply({ content: `${global.emoji.errado} Você colocou um tempo incorreto para a mensagem ser apagada!`, ephemeral: true })

                client.db.General.set('ConfigGeral.Entradas', {
                    msg: title,
                    tempo: title2,
                    channelid: arrayDeBancos,
                })

                interaction.reply({ content: `${global.emoji.certo} Todas configurações de Bem vindo foram configuradas com sucesso!`, ephemeral: true })
            }




        }



        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId == 'wdawwadawwadwaroleaddautorole') {

                let cargos = interaction.values

                let positionbot = interaction.guild.members.me.roles.highest.position;


                let cargosmaiores = cargos.filter(cargo => interaction.guild.roles.cache.get(cargo).position > positionbot)
                cargos = cargos.filter(cargo => !cargosmaiores.includes(cargo))
                let cargosmaioresnomes = cargosmaiores.map(cargo => interaction.guild.roles.cache.get(cargo).name)

                let msgnot = ''
                cargosmaioresnomes.forEach((cargo, index) => {
                    if (index === cargosmaioresnomes.length - 1) {
                        msgnot += `\`${cargo}\``;
                    } else {
                        msgnot += `\`${cargo}\`, `;
                    }
                });
                if (msgnot !== '') msgnot = `\n- Infelizmente alguns cargos não puderam ser adicionados pois não possuo permissão para definir pessoas nele(s): ${msgnot}`


                if (cargos.length == 0) {
                    client.db.General.delete(`ConfigGeral.AutoRole.add`)
                } else {
                    client.db.General.set(`ConfigGeral.AutoRole.add`, cargos)
                }

                await autorole(interaction, client)
                interaction.followUp({ content: `${client.db.General.get(`emojis.certo`)} Todas configurações do sistema de cargos automáticos foram salvas.${msgnot}`, ephemeral: true })
            }

        }

        if (interaction.isButton()) {
            if (interaction.customId === 'addbutton_automsg') {
                const modal = new ModalBuilder()
                    .setCustomId('add_button_modal')
                    .setTitle('Adicionar Botão');

                const labelInput = new TextInputBuilder()
                    .setCustomId('button_label')
                    .setLabel('Nome do Botão')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const urlInput = new TextInputBuilder()
                    .setCustomId('button_url')
                    .setLabel('URL do Botão')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const emojiInput = new TextInputBuilder()
                    .setCustomId('button_emoji')
                    .setLabel('Emoji do Botão (opcional)')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Caso for personalizado, use assim: <:users:1368603764495224843>')
                    .setRequired(false);


                modal.addComponents(
                    new ActionRowBuilder().addComponents(labelInput),
                    new ActionRowBuilder().addComponents(emojiInput),
                    new ActionRowBuilder().addComponents(urlInput)
                );

                await interaction.showModal(modal);
            }

            if (interaction.customId === 'finish_automsg') {
                if (!client.tempAutoMessage) {
                    return interaction.reply({
                        content: 'Erro: Dados temporários não encontrados',
                        ephemeral: true
                    });
                }

                client.db.General.push(`ConfigGeral.AutoMessage`, [client.tempAutoMessage]);

                delete client.tempAutoMessage;

                await automsg(interaction, client);
                return interaction.followUp({
                    content: 'Mensagem automática configurada com sucesso!',
                    ephemeral: true
                });
            }
        }

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'add_button_modal') {
                const label = interaction.fields.getTextInputValue('button_label');
                const url = interaction.fields.getTextInputValue('button_url');
                const emoji = interaction.fields.getTextInputValue('button_emoji') || '';

                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    return interaction.reply({
                        content: 'URL inválida! A URL deve começar com http:// ou https://',
                        ephemeral: true
                    });
                }

                if (!client.tempAutoMessage) {
                    return interaction.reply({
                        content: 'Erro: Dados temporários não encontrados',
                        ephemeral: true
                    });
                }

                if (emoji !== '') {
                    const emojiRegexPattern = /[\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu;

                    const customEmojiRegex = /<a?:[a-zA-Z0-9_]+:\d+>/;
                    if (!emojiRegexPattern.test(emoji) && !customEmojiRegex.test(emoji)) {
                        return interaction.reply({
                            content: 'Emoji inválido! O emoji deve ser um emoji padrão ou um emoji personalizado.',
                            ephemeral: true
                        });
                    }
                }

                client.tempAutoMessage.buttons.push({ label, url, emoji });

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('addbutton_automsg')
                            .setLabel('Adicionar Botão')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(client.tempAutoMessage.buttons.length >= 5),
                        new ButtonBuilder()
                            .setCustomId('finish_automsg')
                            .setLabel('Finalizar')
                            .setStyle(ButtonStyle.Success)
                    );

                await interaction.update({
                    content: `✅ Botão adicionado! Total de botões: ${client.tempAutoMessage.buttons.length}/5`,
                    components: [row],
                    embeds: [],
                    ephemeral: true
                });
            }

            if (interaction.customId === 'awdwat123ransferawdawdwadaw') {
                const titulo = interaction.fields.getTextInputValue('titulo');
                const descricao = interaction.fields.getTextInputValue('descricao');
                const bannerembed = interaction.fields.getTextInputValue('bannerembed');
                const buttomes = interaction.fields.getTextInputValue('buttomes');
                const idchanell = interaction.fields.getTextInputValue('idchanell');

                try {
                    const canal = await client.channels.fetch(idchanell);

                    if (!canal || !canal.isTextBased()) {
                        return interaction.reply({
                            content: '${global.emoji.errado} O canal fornecido não é válido ou não é um canal de texto.',
                            ephemeral: true
                        });
                    }

                    client.tempAutoMessage = {
                        titulo,
                        descricao,
                        bannerembed,
                        time: buttomes,
                        idchanell,
                        buttons: []
                    };

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('addbutton_automsg')
                                .setLabel('Adicionar Botão')
                                .setEmoji('1233110125330563104')
                                .setStyle(1),
                            new ButtonBuilder()
                                .setCustomId('finish_automsg')
                                .setLabel('Finalizar')
                                .setEmoji('1226536127796740106')
                                .setStyle(3)
                        );

                    await interaction.update({
                        content: `Configure os botões da mensagem automática:`,
                        embeds: [],
                        components: [row],
                        ephemeral: true
                    });

                } catch (error) {
                    return interaction.reply({
                        content: '${global.emoji.errado} O canal fornecido é inválido ou não pôde ser encontrado.',
                        ephemeral: true
                    });
                }
            }

            if (interaction.customId === 'awdwasdajdaawdu1111awdwadawdaw1idsjjsdua') {

                const tokenMP = interaction.fields.getTextInputValue('tokenMP');


                if (isNaN(tokenMP) == true) return interaction.reply({ content: `${global.emoji.errado} Número incorreto.`, ephemeral: true })

                const gggg = client.db.General.get(`ConfigGeral.AutoMessage`)

                if (gggg[tokenMP - 1] == undefined) return interaction.reply({ content: `${global.emoji.errado} Número incorreto.`, ephemeral: true })

                client.db.General.pull(`ConfigGeral.AutoMessage`, (element, index, array) => index == tokenMP - 1)

                await automsg(interaction, client)
                return interaction.followUp({ content: `O sistema foi configurado com sucesso!`, ephemeral: true })



            }




            if (interaction.customId === 'CadastrarOAuth2') {
                const token = interaction.fields.getTextInputValue('token')

                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

                // await interaction.update({
                //     components: [
                //         new TextDisplayBuilder({
                //             content: 'Realizando o vinculação da sua aplicação na Nuvem...'
                //         })
                //     ], embeds: []
                // })



                if (request.message == '401: Unauthorized') {
                    await PainelPrincipal(client, interaction, 1)
                    return interaction.followUp({ content: `${global.emoji.errado} Você tentou adicionar uma **API Key** incorreta para utilizar o seu sistema de verificação.`, ephemeral: true });
                } else {
                    client.db.OAuth2.set('Config.LicenseID', token)
                    await PainelPrincipal(client, interaction)
                    await interaction.followUp({ content: `${global.emoji.certo} OAuth2 cadastrado com sucesso.`, ephemeral: true });
                }
            }
        }


        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId == 'selecionarcanallog') {
                const id = interaction.values[0]

                await client.db.OAuth2.set('LogChannel', id)

                await PainelPrincipal(client, interaction)
                interaction.followUp({ content: `${global.emoji.certo} Canal de logs definido com sucesso!`, ephemeral: true })

            }
        }

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'recuperarmembrosoauth2') {

                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')


                let idserver = interaction.fields.getTextInputValue('iddoservidor');
                let quantidadeusers = interaction.fields.getTextInputValue('quantidadeusers');
                await interaction.reply({ content: `${global.emoji.loading_promisse} | Realizando verificações necessárias`, components: [], embeds: [], ephemeral: true })
                if (idserver == '') idserver = interaction.guild.id



                request2 = await request2.json()

                if (quantidadeusers == '') quantidadeusers = request2.users
                if (request2.users < quantidadeusers) return interaction.editReply({ content: `${global.emoji.errado} A quantidade de membros que você deseja puxar é maior do que a quantidade de membros que você possui em sua licença.`, ephemeral: true })




                request = await request.json()



                if (request.message == 'Guild not found') {
                    const botao = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setURL(request.convite)
                            .setLabel('Adicionar Bot OAuth2')
                            .setStyle(5)
                    )


                    return interaction.editReply({ content: `${global.emoji.errado} Para restaurar seus membros, você precisa adicionar seu bot no servidor. `, components: [botao], ephemeral: true })
                }

                let json = {
                    pass: request.licenseOrder,
                }

                client.db.OAuth2.push('Config.requestid', json)
                //     let info = client.db.OAuth2.get('Config')
                //    //LicenseID






                //     // calcular o tempo, ver a quantidade de membros e dividir pelo tempo que gasta por membro e mostrar na mensagem
                //     // 2 segundos por membro

                let tempo = Number(request.info.amount) / 1 // 

                let forFormat = Date.now() + tempo * 1000

                let timestamp = Math.floor(forFormat / 1000)






                interaction.editReply({ content: `Recuperando membros, estimativa para acabar em <t:${timestamp}:R>, isso pode demorar... `, ephemeral: true })







            }

            if (interaction.customId === 'confirmarbot1') {

                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

                let confirm = interaction.fields.getTextInputValue('confirm').toLowerCase()
                let token = await uu.get(`${interaction.message.id}2.tokenn`)
                let client_secret = await uu.get(`${interaction.message.id}2.client_secrett`)
                let botid = await uu.get(`${interaction.message.id}2.botid`)

                if (confirm == 'confirmo') {

                    let configaaa = {
                        method: 'POST',
                        headers: {
                            'Authorization': 'joaozinhogostoso',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            license: client.db.OAuth2.get('Config.LicenseID'),
                            token: token,
                            client_secret: client_secret,
                            status: 1,
                            botid: botid
                        })
                    };
                    let json = await ddddd.json()

                    if (json.code == 200) {
                        await PainelPrincipal(client, interaction)
                        return interaction.followUp({ content: `✔ Atualizamos sua nuvem de dados. (Auth Resetado)`, ephemeral: true })
                    }


                } else {
                    await PainelPrincipal(client, interaction)
                    return interaction.followUp({ content: `${global.emoji.errado} Você negou sua confirmação (AÇÃO CANCELADA).`, ephemeral: true })
                }

            }


        }




        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'efibank') {
                const clientid = interaction.fields.getTextInputValue('efibank1');
                const clientsecret = interaction.fields.getTextInputValue('efibank2');

                if (clientid == '' || clientsecret == '') return interaction.reply({ content: `${global.emoji.errado} Ocorreu algum erro, tem certeza que colocou as informações corretas?`, ephemeral: true })


                await interaction.reply({ content: `Agora, envie o arquivo do certificado \`.p12\` como um anexo.`, embeds: [], components: [] }).then(async () => {
                    const filter = (m) => m.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 })
                    collector.on('collect', async (m) => {
                        if (m.attachments.first()) {
                            const file = m.attachments.first()
                            if (file.name.endsWith(".p12")) {
                                const fs = require("fs")
                                const path = require("path")
                                const https = require("https");
                                const axios = require("axios");

                                try {
                                    m.delete();
                                    const certificadoPath = path.join(`./DataBaseJson/${file.name}`);
                                    const response = await axios.get(file.url, { responseType: "arraybuffer" });
                                    fs.writeFileSync(certificadoPath, response.data);
                                    const certificadoBuffer = fs.readFileSync(certificadoPath);
                                    const agent = new https.Agent({ pfx: certificadoBuffer, passphrase: "" });

                                    const access_token = await GenerateToken(clientid, clientsecret, certificadoBuffer)

                                    const chavesPixResponse = await axios.get("https://pix.api.efipay.com.br/v2/gn/evp", {
                                        headers: {
                                            Authorization: `Bearer ${access_token}`,
                                            "Content-Type": "application/json",
                                        },
                                        httpsAgent: agent,
                                    });
                                    let chavepix = ``
                                    if (chavesPixResponse.data.chaves.length < 1) {

                                        await interaction.editReply({
                                            content: `${client.db.General.get(`emojis.errado`)} Não foi possível encontrar uma chave PIX cadastrada!`,
                                            embeds: [],
                                            components: [],
                                            ephemeral: true,
                                        });
                                    } else {
                                        chavepix = chavesPixResponse.data.chaves[0]
                                    }

                                    await UpdatePix(chavepix, certificadoBuffer, access_token)

                                    client.db.General.set("ConfigGeral.EfiBank.Licenses", {
                                        client_id: clientid,
                                        client_secret: clientsecret,
                                        chavepix: chavepix,
                                        certificado: file.name,
                                    });

                                    await SetCallBack(client)

                                    await interaction.editReply({
                                        content: `${client.db.General.get(`emojis.certo`)} Certificado enviado com sucesso!`,
                                        embeds: [],
                                        components: [],
                                        ephemeral: true,
                                    });

                                } catch (error) {
                                    console.log(error)
                                    console.error("Erro:", error.message);;

                                    await interaction.editReply({
                                        content: `${client.db.General.get(`emojis.errado`)} Houve um erro ao salvar as informações, tente novamente.`,
                                        ephemeral: true,
                                        embeds: [],
                                        components: [],
                                    });

                                }
                            } else {

                                await interaction.editReply({ content: `${client.db.General.get(`emojis.errado`)} O arquivo enviado não é um certificado \`.p12\`!`, embeds: [], components: [], ephemeral: true });

                            }
                        } else {
                            await interaction.editReply({ content: `${client.db.General.get(`emojis.errado`)} Você não enviou nenhum arquivo!`, embeds: [], components: [], ephemeral: true });

                        }
                    })
                })

            }



            if (interaction.customId === 'numerowpp') {
                const numero = interaction.fields.getTextInputValue('numero')

                if (client.db.General.get('ConfigGeral.Notificar.Wpp.numero') == numero) return interaction.reply({ content: `${global.emoji.errado} O número de WhatsApp informado é o mesmo que já está configurado!`, ephemeral: true })

                if (numero == '') {
                    client.db.General.delete('ConfigGeral.Notificar.Wpp.numero')
                    client.db.General.set('ConfigGeral.Notificar.Wpp.status', false)
                    let message = PainelWpp(interaction, client)
                    await interaction.update({
                        content: ``,
                        embeds: message.embeds,
                        components: [
                            message.components[0],
                            message.components[1],
                        ]
                    })
                    interaction.followUp({ content: `${global.emoji.certo} Número de WhatsApp removido com sucesso!`, ephemeral: true })
                    return
                }

                if (delaywppconfirm[interaction.user.id] && delaywppconfirm[interaction.user.id] > Date.now()) return interaction.reply({ content: `${global.emoji.errado} Você está enviando códigos de confirmação muito rápido! Espere um pouco e tente novamente.`, ephemeral: true })

                delaywppconfirm[interaction.user.id] = Date.now() + 120000

                let number6lenghtsramdom = Math.floor(100000 + Math.random() * 900000)

                interaction.reply({ content: `📱 | Enviamos um código de confirmação para o número \`${numero}\`.\n\n- Digite abaixo o numero de confirmação.`, ephemeral: true }).then(
                    async () => {

                        const filter = (m) => m.author.id === interaction.user.id
                        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 })
                        collector.on('collect', async (m) => {
                            if (m.content == number6lenghtsramdom) {
                                collector.stop()
                                m.delete()
                                client.db.General.set('ConfigGeral.Notificar.Wpp.numero', numero)
                                client.db.General.set('ConfigGeral.Notificar.Wpp.status', true)
                                let message = PainelWpp(interaction, client)

                                await interaction.editReply({
                                    content: ``,
                                    embeds: message.embeds,
                                    components: [
                                        message.components[0],
                                        message.components[1],
                                    ]
                                })
                                await interaction.editReply({ content: `${global.emoji.certo} Número de WhatsApp definido com sucesso!`, ephemeral: true })
                            } else {
                                m.delete()
                                await interaction.followUp({ content: `${global.emoji.errado} Código incorreto, tente novamente.`, ephemeral: true })
                            }
                        })
                        collector.on('end', async (collected, reason) => {
                            if (reason == 'time') {
                                await interaction.editReply({ content: `${global.emoji.errado} Tempo esgotado, tente novamente.`, ephemeral: true })
                            }
                        })

                    }
                )


            }

        }




        if (interaction.isButton()) {

            if (interaction.customId === 'NotificaçãoPainel') {
                let message = PainelNotify(client, interaction)
                interaction.update({
                    content: ``,
                    embeds: message.embeds,
                    components: [
                        message.components[0],
                        message.components[1],
                    ]
                })
            }

            if (interaction.customId === 'VoltarNotifys') {
                let message = PainelNotify(client, interaction)
                interaction.update({
                    content: ``,
                    embeds: message.embeds,
                    components: [
                        message.components[0],
                        message.components[1],
                    ]
                })
            }


            if (interaction.customId === 'WhatsappNotify') {
                let status = client.db.General.get('ConfigGeral.Notificar.Wpp.status')

                let message = PainelWpp(interaction, client)

                interaction.update({
                    content: ``,
                    embeds: message.embeds,
                    components: [
                        message.components[0],
                        message.components[1],
                    ]
                })
            }

            if (interaction.customId === 'WppStatus') {

                if (client.db.General.get('ConfigGeral.Notificar.Wpp.numero') == null) {
                    interaction.reply({ content: ` ${global.emoji.errado} Você precisa definir um número de WhatsApp antes de ativar o sistema de notificação!`, ephemeral: true })
                    return
                }

                let status = client.db.General.get('ConfigGeral.Notificar.Wpp.status')
                if (status == null) {
                    client.db.General.set('ConfigGeral.Notificar.Wpp.status', true)
                } else {
                    client.db.General.set('ConfigGeral.Notificar.Wpp.status', !status)
                }

                let message = PainelWpp(interaction, client)


                await interaction.update({
                    content: ``,
                    embeds: message.embeds,
                    components: [
                        message.components[0],
                        message.components[1],
                    ]
                })

                interaction.followUp({ content: `${global.emoji.certo} O sistema de notificação foi ${status == true ? 'desativado' : 'ativado'} com sucesso!`, ephemeral: true })
            }

            if (interaction.customId === 'WppNumero') {
                const modalaAA = new ModalBuilder()
                    .setCustomId('numerowpp')
                    .setTitle(`Definir Número de WhatsApp`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('numero')
                    .setLabel("Número de WhatsApp")
                    .setPlaceholder("Exemplo: 22992148256")
                    .setStyle(TextInputStyle.Short)
                    .setValue(client.db.General.get('ConfigGeral.Notificar.Wpp.numero') == null ? '' : client.db.General.get('ConfigGeral.Notificar.Wpp.numero'))
                    .setRequired(false)
                    .setMaxLength(11)

                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow4);
                await interaction.showModal(modalaAA);



            }





            if (interaction.customId == 'ConfigEfi') {
                let message = await ConfigEfíStart(client, interaction)

                interaction.update({
                    embeds: message.embeds,
                    components: [
                        message.components[0],
                        message.components[1],

                    ]
                })
            }

            if (interaction.customId == 'EfíBankConfig') {
                const modalaAA = new ModalBuilder()
                    .setCustomId('efibank')
                    .setTitle(`Autorizar Efi Bank`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('efibank1')
                    .setLabel("CLIENT ID")
                    .setPlaceholder("Client_Id_XxxXxXx")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(256)
                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('efibank2')
                    .setLabel("CLIENT SECRET")
                    .setPlaceholder("Client_Secret_XxxXxXx")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(256)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                modalaAA.addComponents(firstActionRow4);
                await interaction.showModal(modalaAA);


            }


            if (interaction.customId == 'confirmar') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                const modal = new ModalBuilder()
                    .setTitle('Confirmação Alterar BOT')
                    .setCustomId(`confirmarbot1`)

                const iddoservidor = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('confirm')
                        .setLabel(`Escreva abaixo: CONFIRMO`)
                        .setPlaceholder('CONFIRMO')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true),
                )


                modal.addComponents(iddoservidor)
                await interaction.showModal(modal)
            }

            if (interaction.customId == 'voltar717231732') {
                                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                await PainelPrincipal(client, interaction)
            }



            if (interaction.customId == 'recuperarmembrosoauth2') {
                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

                const modal = new ModalBuilder()
                    .setTitle('Recuperar Membros')
                    .setCustomId(`recuperarmembrosoauth2`)

                const iddoservidor = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('iddoservidor')
                        .setLabel(`ID DO SERVIDOR`)
                        .setPlaceholder(`Insira um ID, se for esse servidor deixe em branco`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                )
                const quantidadeusers = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('quantidadeusers')
                        .setLabel(`Qual a quantidade de membros?`)
                        .setPlaceholder(`Escolha a quantidade de membros que deseja puxar`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                )

                modal.addComponents(iddoservidor, quantidadeusers)
                await interaction.showModal(modal)
            }



            if (interaction.customId == 'definircanallogsoauth2') {

                const select = new ActionRowBuilder().addComponents(
                    new ChannelSelectMenuBuilder()
                        .setCustomId('selecionarcanallog')
                        .setPlaceholder('Selecione um canal para definir')
                        .setMaxValues(1)
                        .addChannelTypes(ChannelType.GuildText)
                )

                const botao = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('removercanallogoauth2')
                        .setLabel('Remover')
                        .setEmoji('1229787813046915092')
                        .setStyle(4)
                )


                interaction.update({ components: [select, botao], content: ``, embeds: [] })
            }


            if (interaction.customId == 'voltaroauth2') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                interaction.deferUpdate()
                updateMessageConfig(interaction, client)
            }

            if (interaction.customId == 'Cadastraroauth2') {
                const modal = new ModalBuilder()
                    .setTitle('Cadastrar OAuth2')
                    .setCustomId(`CadastrarOAuth2`)

                const token = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('token')
                        .setLabel(`Informe abaixo a API KEY do OAuth2`)
                        .setStyle(TextInputStyle.Short)
                )

                modal.addComponents(token)
                await interaction.showModal(modal)
            }

            if (interaction.customId == 'Desvincularoauth2') {
                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

                await client.db.OAuth2.delete('Config')
                await PainelPrincipal(client, interaction)
                interaction.followUp({ content: `${global.emoji.certo} OAuth2 desvinculado com sucesso!`, ephemeral: true })
            }

            if (interaction.customId == 'msgoauth2') {

                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

                let info = client.db.OAuth2.get('Config')

                request = await request.json()

                if (oo !== true) {
                    return
                }


                ConfigurarMensagem(client, interaction, 1)
            }


            if (interaction.customId == 'criarmsgauto') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('awdwat123ransferawdawdwadaw')
                    .setTitle(`Configurar Embed`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('titulo')
                    .setLabel(`Envie abaixo o Titulo da Embed`)
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(100)
                    .setRequired(false)


                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('descricao')
                    .setLabel("Envie abaixo a Mensagem")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(4000)
                    .setRequired(true)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('bannerembed')
                    .setLabel("Envie o Banner")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN444 = new TextInputBuilder()
                    .setCustomId('buttomes')
                    .setLabel("Quanto tempo? (Em segundos)")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(150)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('idchanell')
                    .setLabel("Envie o ID do canal que será enviado")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(25)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN3);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN444);
                modalaAA.addComponents(firstActionRow3, firstActionRow2, firstActionRow4, firstActionRow5, firstActionRow6);
                await interaction.showModal(modalaAA);


            }

            if (interaction.customId == 'automsgggs') {
                automsg(interaction, client)
            }


            if (interaction.customId == 'remmsgautomatica') {


                const modalaAA = new ModalBuilder()
                    .setCustomId('awdwasdajdaawdu1111awdwadawdaw1idsjjsdua')
                    .setTitle(`Configurar Mensagem Automatica`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`QUAL MENSAGEM DESEJA RETIRAR?`)
                    .setPlaceholder(`Envie apenas numeros.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)



                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);


                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);



            }




            if (interaction.customId == 'systemantifake') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111idsjjsdua')
                    .setTitle(`Configurar anti fake`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`QUANTIDADE DE DIAS MÍNIMA PARA ENTRAR`)
                    .setPlaceholder(`Digite "não" para desativar, serve para todos os campos.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`LISTA DE STATUS QUE DESEJA BLOQUEAR`)
                    .setPlaceholder(`Digite separado por vírgual os status das contas que deseja punir se detectadas.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(4000)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`LISTA DE NOMES QUE DESEJA BLOQUEAR`)
                    .setPlaceholder(`Digite separado por vírgual os nomes das contas que deseja punir se detectadas.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(4000)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                await interaction.showModal(modalaAA);


            }



            if (interaction.customId == 'AdicionarNaAutorole') {
                let msg = `Selecione abaixo quais serão os cargos que o bot vai dar automaticamente ao entrar no servidor.`

                let optionsActive = client.db.General.get(`ConfigGeral.AutoRole.add`) || []

                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('wdawwadawwadwaroleaddautorole')
                            .setPlaceholder('Selecione abaixo qual será o CARGO vai dar AUTOMATICAMENTE.')
                            .setDefaultRoles(optionsActive)
                            .setMaxValues(20)
                    )

                let buttonvoltarautorole = new ButtonBuilder()
                    .setCustomId('autorole')
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)

                let actionrow = new ActionRowBuilder().addComponents(buttonvoltarautorole)



                interaction.update({
                    content: ``,
                    embeds: [],
                    components: [select, actionrow]
                })

            }



            if (interaction.customId == 'autorole') {
                autorole(interaction, client)


            }


            if (interaction.customId == 'boasveindas') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju111idsjjsdua')
                    .setTitle(`Editar Boas Vindas`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`Mensagem`)
                    .setPlaceholder(`Insira aqui sua mensagem, use {member} para mencionar o membro e {guildname} para o servidor.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1000)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`TEMPO PARA APAGAR A MENSAGEM`)
                    .setPlaceholder(`Insira aqui a quantidade em segundos.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(6)


                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('qualcanal')
                    .setLabel(`QUAL CANAL VAI SER ENVIADO?`)
                    .setPlaceholder(`Insira aqui o ID do canal que vai enviar. (ID, ID, ID)`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(200)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                await interaction.showModal(modalaAA);

            }



            if (interaction.customId == '+18porra') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('tokenMP')
                    .setTitle(`Alterar Token`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel("TOKEN: APP_USR-2837005141447972-076717-c37...")
                    .setPlaceholder("APP_USR-2837005141447972-076717-c37...")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(256)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }


            if (interaction.customId == 'voltar1234sda') {
                interaction.deferUpdate()
                ConfigMP(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'vendastoggle') {
                UpdateStatusVendas(interaction, interaction.user.id, client)
            } else if (interaction.customId == 'estilocarrinho') {
                const currentStatus = client.db.General.get(`ConfigGeral.Vendas.EstiloCarrinho`);
                const newStatus = currentStatus === true ? false : true
                client.db.General.set(`ConfigGeral.Vendas.EstiloCarrinho`, newStatus);

                PainelVendas(interaction, client)
            }

            if (interaction.customId == 'returnconfig') {
                updateMessageConfig(interaction, client)
            }
            if (interaction.customId == 'returndefinicoesconfig') {
                definicoes(interaction, client)
            }
            if (interaction.customId == 'returnconfigmoderacao') {

                configmoderacao(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'closepanel') {
                interaction.deferUpdate()
                interaction.message.delete()
            }

            if (interaction.customId == 'confirmpagament') {
                UpdatePagamento(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigMP') {
                ConfigMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'returnConfigMP') {
                ConfigMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'returnUpdatePagamento') {
                UpdatePagamento(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'PixMPToggle') {
                ToggeMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'TimePagament') {
                ToggeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'TokenAcessMP') {
                ToggeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SaldoToggle') {
                ToggleSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'BonusChange') {
                ToggleSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigSaldo') {
                ConfigSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigSemiAuto') {
                ConfigSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigCashBack') {
                ConfigCashBack(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SemiautoToggle') {
                ToggleSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SemiautoPix') {
                ToggleSemiAuto(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'configbot') {
                configbot(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeName') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeAvatar') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeColorBOT') {
                configbotToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'AlterarBanner') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'AlterarMiniatura') {
                configbotToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeStatusBOT') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'configchannels') {
                configchannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'vvconfigchannels') {
                configchannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigRoles') {
                roleconfig(interaction, client)
            }


            if (interaction.customId == 'changetermos') {
                ConfigTermo(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'PainelVendas') {
                PainelVendas(interaction, client)
            }

            if (interaction.customId == 'autorectmessage') {
                autoreact(interaction, client)
            }

            if (interaction.customId == 'alterarstatusreact') {
                let status = client.db.General.get('ConfigGeral.AutoReact.status') || false
                client.db.General.set('ConfigGeral.AutoReact.status', !status)
                autoreact(interaction, client)
            }

            if (interaction.customId === 'alteraremojireact') {
                interaction.update({
                    ephemeral: true,
                    flags: [MessageFlags.Ephemeral],
                    embeds: [],
                    content: `Envie abaixo o emoji que deseja utilizar como reação automática.`,
                    components: []
                }).then(async () => {
                    const filter = (m) => m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

                    collector.on('collect', async (m) => {
                        let emoji = m.content;

                        if (emoji.includes('<:') || emoji.includes('<a:')) {
                            emoji = emoji.split(':')[2].replace('>', '');
                        }

                        client.db.General.set('ConfigGeral.AutoReact.emoji', emoji);

                        await m.delete();

                        autoreact(interaction, client, 2);
                    });
                });
            }
        }

        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId.startsWith('canalset_')) {
                let info = interaction.customId.split('_')[1]
                let id = interaction.values[0]
                client.db.General.set(`ConfigGeral.ChannelsConfig.${info}`, id)
                await configchannels(interaction, interaction.user.id, client)
            }


        }

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId == 'canaisset') {
                let id = interaction.values[0]
                let type = 'channel'
                if (id.includes('cat_')) {
                    type = 'category'
                    id = id.replace('cat_', '')
                }
                await SelecionarChannels(interaction, id, type, client)
            }

            if (interaction.customId == 'cargoset') {
                let id = interaction.values[0]
                await SelecionarCargos(interaction, id, client)
            }
        }

        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId.startsWith('roleset_')) {
                let info = interaction.customId.split('_')[1]
                let id = interaction.values[0]
                client.db.General.set(`ConfigGeral.ChannelsConfig.${info}`, id)
                await roleconfig(interaction, client)
            }
        }
    }
}
