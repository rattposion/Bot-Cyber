const { InteractionType, ActionRowBuilder, TextInputStyle, ModalBuilder, TextInputBuilder, Client, AttachmentBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags, ContainerBuilder, MediaGalleryBuilder } = require("discord.js");
const { PageNubank } = require("../../FunctionsAll/Payments/NubankPage");
const { connectIMAP, disconnectIMAP } = require("../../FunctionsAll/Payments/Nubank");
const { atualizarmessageprodutosone } = require("../../FunctionsAll/Createproduto");
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { SectionUser } = require("../../FunctionsAll/Sections");
const { GerarQrCode } = require("../../FunctionsAll/QrCodePersonalizado/QrCode");

const Imap = require('imap');

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === 'selecttypebank') {

                let typebank = interaction.values[0];
                client.db.General.set('ConfigGeral.Nubank.typebank', typebank);
                await PageNubank(client, interaction);
                await interaction.followUp({ content: `Banco selecionado com sucesso!`, components: [], ephemeral: true });
                return

            }

            if (interaction.customId === 'selecttypemoeda') {
                let moeda = interaction.values[0];
                client.db.General.set('ConfigGeral.lenguage', moeda);

                if (moeda == 'BRL') {
                    global.lenguage = {
                        "um": "pt-BR",
                        "dois": "BRL",
                        "stripe": "brl",
                    }
                } else if (moeda == 'USD') {
                    global.lenguage = {
                        "um": "pt-BR",
                        "dois": "USD",
                        "stripe": "usd",
                    }
                } else if (moeda == 'EUR') {
                    global.lenguage = {
                        "um": "nl-NL",
                        "dois": "EUR",
                        "stripe": "eur",
                    }
                }

                await interaction.reply({ content: `Moeda selecionada com sucesso!`, ephemeral: true });
                let allprodutos = client.db.produtos.fetchAll()
                if (allprodutos.length !== 0) {
                    allprodutos.forEach(async (t) => {
                        var kkkkkkk = client.db.PainelVendas.fetchAll()
                        const idEncontrado = encontrarProdutoPorNome(kkkkkkk, t.ID);
                        if (idEncontrado !== null) {
                            atualizarmensagempainel(null, idEncontrado, client)
                        }
                        atualizarmessageprodutosone(null, client, t.ID)
                    })
                }
                return
            }
        }

        // Nubank Imap Pagamentos
        if (interaction.isButton()) {

            const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

            if (interaction.customId === 'ConfigMoedaPay') {
                let moeda = client.db.General.get('ConfigGeral.lenguage');

                let components = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('selecttypemoeda')
                            .setPlaceholder('Selecione o tipo de moeda')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    label: 'R$',
                                    value: 'BRL',
                                    description: 'Selecione o tipo de moeda real.',
                                    default: moeda == 'BRL' ? true : false
                                },
                                {
                                    label: '$',
                                    value: 'USD',
                                    description: 'Selecione o tipo de moeda dólar.',
                                    default: moeda == 'USD' ? true : false
                                },
                                {
                                    label: '€',
                                    value: 'EUR',
                                    description: 'Selecione o tipo de moeda euro.',
                                    default: moeda == 'EUR' ? true : false
                                }
                            ]),
                    );

                let components2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('returnUpdatePagamento')
                            .setEmoji('1237055536885792889')
                            .setStyle(2),
                    );

                await interaction.update({
                    components: [
                        components,
                        components2
                    ],
                    content: ''
                });
            }

            if (interaction.customId === 'ConfigNuBankImap') {
                PageNubank(client, interaction);
            }

            if (interaction.customId === 'nubankStatus') {
                let status = client.db.General.get('ConfigGeral.Nubank.status');
                await interaction.update({ content: `Aguarde um momento...`, embeds: [], components: [] });
                if (status == null || status == false) {
                    let typebank = client.db.General.get('ConfigGeral.Nubank.typebank');
                    if (typebank == null) {
                        await PageNubank(client, interaction, 1);
                        return interaction.followUp({ content: `Você precisa selecionar um banco primeiro!`, ephemeral: true });
                    }
                    let email = client.db.General.get('ConfigGeral.Nubank.email');
                    let senha = client.db.General.get('ConfigGeral.Nubank.senha');
                    if (email == null || senha == null) {
                        await PageNubank(client, interaction, 1);
                        return interaction.followUp({ content: `Você precisa configurar o IMAP do Nubank primeiro!`, ephemeral: true });
                    } else {
                        let imapConfig = {
                            user: `${email}`,
                            password: `${senha}`,
                            host: 'imap.gmail.com',
                            port: 993,
                            tls: true,
                            tlsOptions: { rejectUnauthorized: false },
                            keepalive: true,
                            idleInterval: 10000,
                            forceNoop: true,
                            interval: 10000,
                        };
                        connectIMAP(typebank, imapConfig)

                        setTimeout(async () => {
                            client.db.General.set('ConfigGeral.Nubank.status', global.statusImap);
                            await PageNubank(client, interaction, 1);
                            if (global.statusImap == false) {
                                interaction.followUp({ content: `Ocorreu um erro ao configurar o seu Imap, sua senha ou email está incorreto.`, ephemeral: true });
                            }
                        }, 5000);

                    }
                } else if (status == true) {
                    console.log('[🔌] Desconectando do IMAP...')
                    disconnectIMAP();
                    client.db.General.set('ConfigGeral.Nubank.status', status == null ? true : !status);
                    PageNubank(client, interaction, 1)
                }

            }

            if (interaction.customId === 'nubankConfig') {


                let modal = new ModalBuilder()
                    .setCustomId('modalimapnubank')
                    .setTitle(`🥊 | Configurar Nubank & Picpay (Imap)`);

                let desc = new TextInputBuilder()
                    .setCustomId('email')
                    .setLabel("Qual seu email do imap?")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Digite o email do imap.')
                    .setRequired(false);

                let cor = new TextInputBuilder()
                    .setCustomId('Senha')
                    .setLabel("Senha da aplicação (IMAP)?")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Digite a senha da aplicação (IMAP).')
                    .setRequired(false);



                const descrição = new ActionRowBuilder().addComponents(desc);
                const color = new ActionRowBuilder().addComponents(cor);


                modal.addComponents(descrição, color);

                await interaction.showModal(modal);
            }


        }


        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'modalimapnubank') {
                const email = interaction.fields.getTextInputValue('email');
                const senha = interaction.fields.getTextInputValue('Senha');

                let typebank = client.db.General.get('ConfigGeral.Nubank.typebank');
                if (!typebank) {
                    await PageNubank(client, interaction);
                    return interaction.followUp({
                        content: `${global.emoji.errado} Você precisa selecionar um banco primeiro!`,
                        ephemeral: true
                    });
                }

                await interaction.update({
                    components: [
                        new TextDisplayBuilder({
                            content: `⏳ Verificando credenciais IMAP...`
                        }),
                    ]
                });

                // Configuração IMAP
                let imapConfig = {
                    user: email,
                    password: senha,
                    host: 'imap.gmail.com',
                    port: 993,
                    tls: true,
                    tlsOptions: { rejectUnauthorized: false },
                    keepalive: true,
                    authTimeout: 3000, // Timeout de autenticação
                    connTimeout: 10000, // Timeout de conexão
                };

                // Função para testar conexão IMAP
                async function testImapConnection(config) {
                    return new Promise((resolve, reject) => {
                        const testImap = new Imap(config);

                        const timeoutId = setTimeout(() => {
                            testImap.end();
                            reject('Timeout ao tentar conectar ao servidor IMAP');
                        }, 15000); // 15 segundos de timeout total

                        testImap.once('ready', () => {
                            clearTimeout(timeoutId);
                            testImap.openBox('INBOX', false, (err, box) => {
                                testImap.end();
                                if (err) {
                                    reject('Erro ao acessar INBOX: ' + err.message);
                                } else {
                                    resolve(true);
                                }
                            });
                        });

                        testImap.once('error', (err) => {
                            clearTimeout(timeoutId);
                            testImap.end();
                            if (err.message.includes('AUTHENTICATIONFAILED')) {
                                reject('Credenciais inválidas');
                            } else {
                                reject('Erro de conexão: ' + err.message);
                            }
                        });

                        testImap.connect();
                    });
                }

                try {
                    // Primeiro testa a conexão
                    await testImapConnection(imapConfig)
                        .then(async () => {
                            // Se o teste for bem sucedido, inicia a conexão real
                            return connectIMAP(typebank, imapConfig);
                        })
                        .then(async message => {
                            // Salva as configurações e atualiza a interface
                            client.db.General.set('ConfigGeral.Nubank.email', email);
                            client.db.General.set('ConfigGeral.Nubank.senha', senha);
                            await PageNubank(client, interaction, 1);

                            interaction.followUp({
                                content: `✅ Conexão IMAP estabelecida com sucesso!`,
                                ephemeral: true
                            });
                        })
                        .catch(async error => {
                            console.error('[${global.emoji.errado} ERRO IMAP]', error);
                            await PageNubank(client, interaction, 1);

                            let errorMessage = '${global.emoji.errado} Erro ao conectar ao IMAP: ';

                            if (error.includes('AUTHENTICATIONFAILED')) {
                                errorMessage += 'Credenciais inválidas.';
                            } else if (error.includes('Timeout')) {
                                errorMessage += 'Tempo de conexão excedido.';
                            } else {
                                errorMessage += 'Verifique suas credenciais e tente novamente.';
                            }

                            interaction.followUp({
                                content: errorMessage,
                                ephemeral: true
                            });
                        });

                } catch (error) {
                    console.error('[${global.emoji.errado} ERRO CRÍTICO]', error);
                    await PageNubank(client, interaction, 1);

                    interaction.followUp({
                        content: `${global.emoji.errado} Erro crítico ao processar sua solicitação. Tente novamente mais tarde.`,
                        ephemeral: true
                    });
                }
            }
        }





        if (interaction.isButton()) {
            if (interaction.customId === 'checkoultNubankImap') {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                const buttonCarregando = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('carregando')
                            .setLabel('Gerando...')
                            .setStyle(2)
                            .setDisabled(true)
                    )

                await interaction.update({
                    content: ``,
                    embeds: [],
                    components: [buttonCarregando],
                })
                await interaction.editReply({
                    components: [
                        new TextDisplayBuilder({
                            content: `${global.emoji.loading_promisse} Gerando pagamento...`
                        }),
                    ],
                    flags: [MessageFlags.IsComponentsV2]
                })


                var gg = client.db.Carrinho.get(interaction.channel.topic)

                let pagamentos = client.db.Pagamentos.fetchAll();
                let valoresUtilizados = pagamentos.map(p => Number(p.data.price));
                let valorcart = Number(gg.totalpicecar);
                let taxaNubank = { status: false, value: 0 }

                const arredondar = (valor) => Math.round(valor * 100) / 100;

                while (valoresUtilizados.includes(arredondar(valorcart))) {
                    valorcart = arredondar(valorcart + 0.01);
                }


                if (gg.totalpicecar != valorcart) {
                    taxaNubank.status = true;
                    taxaNubank.value = valorcart - gg.totalpicecar;
                }

                client.db.Carrinho.set(`${interaction.channel.topic}.totalpicecar`, String(valorcart));

                let email = client.db.General.get('ConfigGeral.Nubank.email');


                const nomeRecebedor = 'ManualPix';
                const cidadeRecebedor = 'Sao Paulo';
                let identificadorTransacao = GenerateKeyRandom(10);
                const payloadPix = gerarPayloadPix(email, Number(valorcart), nomeRecebedor, cidadeRecebedor, identificadorTransacao);

                await interaction.editReply({
                    components: [
                        new TextDisplayBuilder({
                            content: `${global.emoji.loading_promisse}  Espere só mais um pouco...`
                        }),
                    ],
                    flags: [MessageFlags.IsComponentsV2]
                })

                const buffer = await GerarQrCode(payloadPix, client)
                const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });


                client.db.Pagamentos.set(`${interaction.channel.topic}`, {
                    Type: 'nubank',
                    BodyCompra: identificadorTransacao,
                    user: interaction.user.id,
                    ID: interaction.channel.topic,
                    pixcopiaecola: payloadPix,
                    CanalID: interaction.channel.id,
                    price: valorcart,
                    dateCreated: Date.now()
                })


                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("pixcopiaecola182381371")
                            .setLabel('Copia e Colar')
                            .setEmoji(`1233200554252042260`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setLabel('Cancelar')
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                    )


                var t = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)

                let logmessage5 = ''
                let logmessage6 = ''
                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)

                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`
                        logmessage6 += `\`${t[i][key].qtd}x - ${client.db.produtos.get(`${key}.settings.name`)}\` → \`${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`
                    }
                }


                let colorHex = client.db.General.get(`ConfigGeral.ColorEmbed`);
                let color = (colorHex === '#008000') ? 5763719 : parseInt(colorHex.replace('#', ''), 16);

                const conteiner = new ContainerBuilder({
                    accent_color: color,
                    components: [
                        new TextDisplayBuilder({
                            content: `## ${global.emoji.carrinhobranco} Seu Carrinho de Compras\nProdutos no Carrinho:\n${logmessage6}\nValor Total: **${Number(gg.totalpicecar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}**`
                        }),
                        new MediaGalleryBuilder({
                            items: [
                                {
                                    media: {
                                        url: `attachment://payment.png`,

                                    }
                                }
                            ]
                        })
                    ]
                })

                await interaction.editReply({
                    components: [
                        new TextDisplayBuilder({
                            content: `${interaction.user}`
                        }),
                        conteiner,
                        row
                    ],
                    files: [attachment],
                    flags: [MessageFlags.IsComponentsV2]
                })




                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido solicitado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562913790595133.webp?size=44&quality=lossless' })
                    .setColor('Yellow')
                    .setDescription(`Usuário ${interaction.user} solicitou um pedido.`)
                    .setFields(
                        { name: `Detalhes:`, value: logmessage5 },
                        { name: `ID do Pedido`, value: `\`${identificadorTransacao}\`` },
                        { name: `Forma de Pagamento`, value: `\`Nubank\`` }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()

                let msglog
                try {
                    const channel = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                    msglog = await channel.send({ embeds: [embed] })
                } catch (error) {
                }

                setTimeout(async () => {
                    try {
                        let channelexiste = client.channels.cache.get(interaction.channel.id)
                        if (channelexiste) {
                            const embed = new EmbedBuilder()
                                .setColor("Red")
                                .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                                .setDescription(`Usuário ${interaction.user} deixou o pagamento expirar.`)
                                .setFields(
                                    { name: `ID do Pedido`, value: `\`${identificadorTransacao}\`` },
                                )
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                .setTimestamp()

                            await msglog.reply({ embeds: [embed] })
                        }
                    } catch (error) {

                    }
                    try {
                        const resultado = interaction.channel.topic.replace('carrinho_', '');
                        const member = await interaction.guild.members.fetch(resultado);
                        await interaction.channel.delete()
                        client.db.Carrinho.delete(interaction.channel.topic)
                        client.db.Carrinho.delete(`carrinho_${resultado}`)

                        const embed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                            .setDescription(`O tempo para o pagamento expirou.`)
                            .setFields(
                                { name: `ID do Pedido`, value: `\`${identificadorTransacao}\`` },
                            )
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()


                        await member.send({ embeds: [embed] })
                    } catch (error) {

                    }
                }, client.db.General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000);
                client.db.StatusCompras.set(`${identificadorTransacao}`, { Status: 'Pendente', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, canal: msglog?.channel?.id, msg: msglog?.id, type: 'pix' })

            }
        }





















        // handler
        if (interaction.isChatInputCommand()) {

            const cmd = client.slashCommands.get(interaction.commandName);

            if (!cmd) return interaction.reply(`Ocorreu algum erro amigo.`);

            if (!interaction.guild) return interaction.reply({ content: `Hmm... Isso não é um servidor, né?🤔`, ephemeral: true })

            interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

            cmd.run(client, interaction)

        }

        if (interaction.isMessageContextMenuCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }

        if (interaction.isUserContextMenuCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
    }
}




let GenerateKeyRandom = function (length) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function gerarPayloadPix(chave, valor, nomeRecebedor, cidadeRecebedor, identificadorTransacao = '') {
    function formatarCampo(id, valor) {
        return id + String(valor.length).padStart(2, '0') + valor;
    }

    const payloadFormatIndicator = formatarCampo('00', '01');
    const merchantAccountInfo = formatarCampo('26', formatarCampo('00', 'BR.GOV.BCB.PIX') + formatarCampo('01', chave)); // Chave PIX
    const merchantCategoryCode = formatarCampo('52', '0000');
    const transactionCurrency = formatarCampo('53', '986');
    const transactionAmount = valor ? formatarCampo('54', valor.toFixed(2)) : '';
    const countryCode = formatarCampo('58', 'BR');
    const merchantName = formatarCampo('59', nomeRecebedor.toUpperCase());
    const merchantCity = formatarCampo('60', cidadeRecebedor.toUpperCase());
    const additionalDataFieldTemplate = identificadorTransacao ? formatarCampo('62', formatarCampo('05', identificadorTransacao)) : ''; // Identificador da transação

    // Concatena todos os campos antes de calcular o CRC
    const payloadSemCRC = payloadFormatIndicator + merchantAccountInfo + merchantCategoryCode + transactionCurrency + transactionAmount + countryCode + merchantName + merchantCity + additionalDataFieldTemplate + '6304'; // Campo CRC placeholder

    // Função para calcular o CRC16
    const crc16 = (str) => {
        let crc = 0xFFFF;
        for (let i = 0; i < str.length; i++) {
            crc ^= str.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc = crc << 1;
                }
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    };

    // Calcula o CRC16 e adiciona ao final do payload
    const crc = crc16(payloadSemCRC);
    return payloadSemCRC + crc;
}


function encontrarProdutoPorNome(array, nomeProduto) {
    for (const item of array) {
        for (const produto of item.data.produtos) {
            if (produto === nomeProduto) {
                return item.ID;
            }
        }
    }
    return null;
}