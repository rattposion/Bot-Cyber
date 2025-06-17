const { InteractionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, AttachmentBuilder, ButtonStyle, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, ChannelType, MessageFlags, MediaGalleryBuilder, ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { default: MercadoPagoConfig, Payment } = require("mercadopago");
const configureMercadoPago = (accessToken) => {
    return new MercadoPagoConfig({
        accessToken: accessToken
    });
};

const lastReturnTimes = {};
const cooldownTime = 3;
let processing = {}

const { QuickDB } = require("quick.db");
const { verificarpagamento, EntregarProdutos } = require('../../FunctionsAll/ChackoutPagamentoNovo');
const { obterEmoji } = require('../../Handler/EmojiFunctions');
const { ConfigEfíStart, GenerateToken, createCobEfi, generateQRCode } = require('../../FunctionsAll/Payments/EfíBank');
const { SendMessageZap } = require('../../FunctionsAll/WppFunctions/wpp');
const { GerarQrCode } = require('../../FunctionsAll/QrCodePersonalizado/QrCode');
const permissionsInstance = require('../../FunctionsAll/permissionsInstance');
const db = new QuickDB();
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {



        const editMessage = async (message) => {

            try {

                const resultado = message.channel.topic.replace('carrinho_', '');
                const member = await interaction.guild.members.fetch(resultado);
                client.db.Carrinho.delete(interaction.channel.topic)

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                    .setDescription(`O tempo para o pagamento expirou.`)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()

                await member.send({ embeds: [embed] })
            } catch (error) {

            }

            try {
                if (client.db.General.get(`ConfigGeral.statuslogcompras`) !== false) {
                    const embedppppp = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                        .setDescription(`Usuário ${interaction.user} deixou o pagamento expirar.`)
                        .setFields(
                            { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
                        )
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTimestamp()

                    const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
                    await channel.send({ embeds: [embedppppp] })
                }
            } catch (error) {

            }

            try {
                client.db.Carrinho.delete(message.channel.topic)
                await message.channel.delete()
            } catch (error) {

            }

        };

        const createCollector = (message) => {

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: client.db.General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000
            });

            collector.on('collect', () => {
                collector.stop();
            });

            collector.on('end', (collected) => {

                if (collected.size === 0) {
                    editMessage(message);

                }
            });
        };

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'addcupomcarlast') {

                const Cupom22 = interaction.fields.getTextInputValue('addcupomcarlast');

                var ppp = client.db.Cupom.get(Cupom22)
                var carr = client.db.Carrinho.get(interaction.channel.topic)

                if (ppp == null) return interaction.reply({ content: `${obterEmoji(22)} | Cupom invalído`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                if (ppp.quantidade <= 0) return interaction.reply({ content: `${obterEmoji(22)} | Todas quantidades dísponiveis do CUPOM foram utilizadas.`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                if (Number(carr.totalpicecar) < ppp.valorminimo) return interaction.reply({ content: `${obterEmoji(22)} | O valor mínimo para utilizar esse cupom e de \`${Number(ppp.valorminimo).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                const member = await interaction.guild.members.fetch(interaction.user.id);
                if (ppp.cargo !== undefined) if (!member.roles.cache.has(ppp.cargo)) return interaction.reply({ content: `${obterEmoji(22)} | Este cupom e permitido apenas se você tiver o CARGO <@&${ppp.cargo}>`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                var carr22222 = client.db.Carrinho.get(`${interaction.channel.topic}.cupomaplicado`)
                if (carr22222 !== null) return interaction.reply({ content: `${obterEmoji(22)} | Você já aplicou um CUPOM neste produto.`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })


                var carr2 = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)
                var nomes = carr2.map(obj => Object.keys(obj)[0]);

                var nomespossui = []
                var nomespossui22 = []
                var nomespossui23 = []
                var cupomaplicatotal = 0
                if (ppp.categoria !== null) {
                    for (var i = 0; i < nomes.length; i++) {
                        var nome = nomes[i];
                        var p = client.db.produtos.get(`${nome}.embedconfig.categoria`)
                        if (p == ppp.categoria) {
                            nomespossui.push(nome)

                        }
                    }

                    if (nomespossui == 0) {
                        for (var i = 0; i < nomes.length; i++) {

                            var nome = nomes[i];

                            var p = client.db.produtos.get(`${nome}.embedconfig.cupom`)

                            if (p == true) {
                                nomespossui22.push(nome)

                            }
                        }

                    } else {
                        for (let i = 0; i < nomespossui.length; i++) {
                            const name = nomespossui[i];

                            for (var i2 = 0; i2 < carr2.length; i2++) {
                                var objeto = carr2[i2];
                                var nome = Object.keys(objeto)[0];

                                if (nome === name) {
                                    if (client.db.produtos.get(`${nome}.embedconfig.cupom`) == true) {
                                        var produto = objeto[nome];

                                        cupomaplicatotal = cupomaplicatotal + produto.pricetotal
                                        break;
                                    }
                                }
                            }


                        }
                    }
                } else {
                    for (var i = 0; i < nomes.length; i++) {
                        var nome = nomes[i];
                        var p = client.db.produtos.get(`${nome}.embedconfig.cupom`)
                        if (p == true) {
                            nomespossui22.push(nome)

                        }
                    }
                }

                if (nomespossui22 !== 0) {
                    for (let pds = 0; pds < nomespossui22.length; pds++) {
                        const ele = nomespossui22[pds];
                        var bbbbbbbb = client.db.produtos.get(`${ele}`);
                        if (bbbbbbbb.embedconfig.cupom == true) {
                            nomespossui23.push(ele)
                        }
                    }

                    for (let i = 0; i < nomespossui23.length; i++) {
                        const name = nomespossui23[i];

                        for (var i2 = 0; i2 < carr2.length; i2++) {
                            var objeto = carr2[i2];
                            var nome = Object.keys(objeto)[0];

                            if (nome === name) {
                                if (client.db.produtos.get(`${nome}.embedconfig.cupom`) == true) {
                                    var produto = objeto[nome];

                                    cupomaplicatotal = cupomaplicatotal + produto.pricetotal
                                    break;
                                }
                            }
                        }
                    }
                }
                if (cupomaplicatotal == 0) interaction.channel.send({ content: `${obterEmoji(22)} | Nenhum dos produtos estão ativados para receber CUPOM!!`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })

                var un = client.db.Carrinho.get(interaction.channel.topic)
                var u = un.messagem
                var totalll = Number(un.totalpicecar).toFixed(2)

                var resultado = (Number(cupomaplicatotal) * ppp.porcentagem) / 100;
                var kk = Number(cupomaplicatotal).toFixed(2)
                var kkk = Number(resultado).toFixed(2)

                var novoValorAPagar = totalll - kkk

                if (novoValorAPagar <= 0) return interaction.channel.send({ content: `${obterEmoji(22)} | Valor de sua compra não pode se menor de 0`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })


                client.db.Carrinho.set(`${interaction.channel.topic}.totalpicecar`, totalll - kkk)


                string = u.replace(/\n${obterEmoji(14)} \*\*| Valor a Pagar:\*\* `.*`\n${obterEmoji(16)} \*\*| Cupom adicionado:\*\* `.*`/g, '');
                string = string.replace(/\n${obterEmoji(14)} \*\*| Valor a Pagar:\*\* `.*`\n${obterEmoji(16)} \*\*| Cupom adicionado:\*\* `.*`/g, '');

                string = string.replace(/^\|.*$/gm, '');


                string += `${obterEmoji(14)} **| Valor a Pagar:** \`${Number(novoValorAPagar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`;
                string += `${obterEmoji(6)} **| Valor do desconto aplicado:** \`${Number(kkk).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })} - ${ppp.porcentagem}%\`\n`
                string += `${obterEmoji(16)} **| Cupom adicionado:** \`${Cupom22}\``;

                let string2 = string.replace(/${global.emoji.carrinhobranco} \*\*\| Produtos no Carrinho:\*\* \`2\`(\|+)/g, `${global.emoji.carrinhobranco} **| Produtos no Carrinho:** \`2\``);
                string2 = string2.replace(/🎁 \*\*.*\n/g, '\n');

                client.db.Carrinho.set(`${interaction.channel.topic}.cupomaplicado`, Cupom22)
                client.db.Carrinho.set(`${interaction.channel.topic}.valordodesconto`, kkk)
                client.db.Cupom.set(`${Cupom22}.quantidade`, client.db.Cupom.get(`${Cupom22}.quantidade`) - 1)

                let vv = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)
                let field = []
                let produtostotal = 0
                let somaPricetotal = 0

                let porcentagem = Number(client.db.Carrinho.get(`${interaction.channel.topic}.valordodesconto`))

                for (let i = 0; i < vv.length; i++) {
                    produtostotal = produtostotal + 1
                    const objeto = vv[i];

                    const propriedade = Object.keys(objeto)[0]

                    const pricetotal = objeto[propriedade].pricetotal
                    const price = objeto[propriedade].price
                    const name = objeto[propriedade].name
                    const qtd2 = objeto[propriedade].qtd

                    somaPricetotal = parseFloat(somaPricetotal) + parseFloat(pricetotal);

                    let porcento = ppp.porcentagem / 100

                    field.push({
                        name: `Produto: ${name}`,
                        value: `- Valor: \`${Number(price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n- Quantidade: \`${qtd2}\`\n- Soma Total: \`${Number((price * qtd2)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``,
                        inline: true
                    })
                }

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `${interaction.user.username} | Resumo da Compra`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(field)

                embed.addFields(
                    { name: `Detalhes Pagamento`, value: `- Produtos Adicionados: \`${vv.length}\`\n- Valor a Pagar: **De:** \~\~\`${Number(somaPricetotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\~\~ **Por:** \`${Number(somaPricetotal - porcentagem).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n- Cupom: \`${client.db.Carrinho.get(`${interaction.channel.topic}.cupomaplicado`)} | ${ppp.porcentagem}% OFF\``, inline: false },
                )


                interaction.deferUpdate()
                interaction.message.edit({ embeds: [embed] }).then(msg => {
                    createCollector(msg)
                })
            }

            if (interaction.customId === 'escolherqtdproduto') {
                let qtdddd = interaction.fields.getTextInputValue('escolherqtdproduto');
                qtdddd = Number(qtdddd);


                if (processing[interaction.channel.id] == true) return

                if (isNaN(qtdddd) || !Number.isInteger(qtdddd) || qtdddd <= 1) {
                    return interaction.reply({
                        content: `${obterEmoji(21)} | Quantidade inválida! Deve ser um número inteiro maior que 1.`,
                        ephemeral: true
                    }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete();
                            } catch (error) {
                                console.error(error);
                            }
                        }, 3000);
                    });
                }




                var uuu = db.table('infoseditproductocarrinho')
                var h = await uuu.get(interaction.message.id)


                const nomeObjetoProcurado = h.ID
                const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                var ggggg = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
                var uuuuu = client.db.produtos.get(`${h.ID}.settings.estoque`)
                if (qtdddd > Object.keys(uuuuu).length) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível adicionar mais que o estoque disponível!`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })

                client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`, qtdddd)


                var gggggf = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)

                var pricee = ggggg.price * gggggf.qtd
                client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.pricetotal`, pricee)




                let produto = client.db.produtos.get(`${h.ID}`)
                let estoqueproduto = client.db.produtos.get(`${h.ID}.settings.estoque`)
                let valorapagar = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos.${posicao}.${h.ID}.pricetotal`)
                let novoquantidade = gggggf.qtd

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(
                        { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(produto.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Estoque: \`${Object.keys(estoqueproduto).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(valorapagar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Quantidade: \`${novoquantidade}\``, inline: false }
                    )



                interaction.message.edit({ embeds: [embed] })
                interaction.deferUpdate()
            }
        }


        if (interaction.isButton()) {

            if (interaction.customId === 'EfíBankStatus') {

                if (client.db.General.get('ConfigGeral.EfiBank.Licenses') == null) return interaction.reply({ content: `${obterEmoji(22)} | Licença não encontrada!`, ephemeral: true })


                let status = client.db.General.get('ConfigGeral.EfiBank.status')
                if (status == null) {
                    client.db.General.set('ConfigGeral.EfiBank.status', true)
                    let message = await ConfigEfíStart(client, interaction)
                    interaction.update({
                        embeds: message.embeds,
                        components: [
                            message.components[0],
                            message.components[1],

                        ]
                    })
                } else {
                    client.db.General.set('ConfigGeral.EfiBank.status', !status)
                    let message = await ConfigEfíStart(client, interaction)
                    interaction.update({
                        embeds: message.embeds,
                        components: [
                            message.components[0],
                            message.components[1],

                        ]
                    })
                }
            }

            // CRIAR PAGAMENTO AQUI

            if (interaction.customId.startsWith('generatepagamentlastfase')) {
                await interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = client.db.Carrinho.get(interaction.channel.topic)


                var sss = ''
                var sss2 = ''
                let ss3 = ''
                gg.produtos.forEach((objeto, index) => {
                    const chave = Object.keys(objeto)[0];
                    const { name, qtd } = objeto[chave];
                    sss += `${name} x${qtd}`;
                    if (index !== gg.produtos.length - 1) {
                        sss += '\n';
                    }

                    sss2 += `${name} - ${qtd}, `;
                    ss3 += `\`${qtd}x ${name}\` | \`${Number(client.db.produtos.get(`${chave}.settings.price`) * qtd).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`;

                });

                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento`, sss)
                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento2`, sss2)
                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento3`, ss3)


                if (client.db.General.get(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`) == "ON" && (
                    client.db.General.get(`ConfigGeral.EfiBank.status`) !== true &&
                    client.db.General.get(`ConfigGeral.MercadoPagoConfig.PixToggle`) === "OFF" &&
                    client.db.General.get(`ConfigGeral.Nubank.status`) !== true
                )) {

                    const buttonCarregando = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('carregando')
                                .setLabel('Gerando...')
                                .setStyle(2)
                                .setDisabled(true)
                        )

                    await interaction.editReply({
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

                    interaction.channel.permissionOverwrites.edit(interaction.member, { SendMessages: true, AttachFiles: true })
                    const uu2 = GenerateKeyRandom(11);

                    if (client.db.General.get(`ConfigGeral.SemiAutoConfig.pix`) == "") return interaction.followUp({ content: `${global.emoji.errado} Chave Pix não configurada!`, ephemeral: true })
                    const nomeRecebedor = 'ManualPix';
                    const cidadeRecebedor = 'Sao Paulo';
                    const payloadPix = gerarPayloadPix(client.db.General.get(`ConfigGeral.SemiAutoConfig.pix`), Number(gg.totalpicecar), nomeRecebedor, cidadeRecebedor, uu2);

                    await interaction.editReply({
                        components: [
                            new TextDisplayBuilder({
                                content: `${global.emoji.loading_promisse}  Espere só mais um pouco...`
                            }),
                        ],
                        flags: [MessageFlags.IsComponentsV2]
                    })

                    const buffer = await GerarQrCode(payloadPix, client)


                    client.db.Carrinho.set(`${interaction.channel.topic}.payloadPix`, payloadPix)


                    const attachment = new AttachmentBuilder(buffer, { name: 'payment.png' });


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("manualpix")
                                .setLabel('Copia e Colar')
                                .setEmoji(`1233200554252042260`)
                                .setStyle(2),
                            new ButtonBuilder()
                                .setCustomId("AprovarManual")
                                .setLabel('Aprovar Compra')
                                .setEmoji(`1237122935437656114`)
                                .setStyle(3)
                                .setDisabled(false),

                        )
                    const row2 = new ActionRowBuilder()
                        .addComponents(

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

                    const embed2 = new EmbedBuilder()
                        .setAuthor({ name: `Pedido solicitado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562913790595133.webp?size=44&quality=lossless' })
                        .setColor('Yellow')
                        .setDescription(`Usuário ${interaction.user} solicitou um pedido.`)
                        .setFields(
                            { name: `Detalhes:`, value: logmessage5 },
                            { name: `ID do Pedido`, value: `\`${uu2}\`` },
                            { name: `Forma de Pagamento`, value: `\`Pix - SemiAutomatico\`` }
                        )
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTimestamp()

                    let msglog
                    try {
                        const channel = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                        msglog = await channel.send({ embeds: [embed2] })
                    } catch (error) {
                    }

                    client.db.StatusCompras.set(interaction.channel.id, { type: `SemiAutomatico`, canal: msglog?.channel?.id, msg: msglog?.id, uu2: uu2 })

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
                            row,
                            row2
                        ],
                        files: [attachment],
                        flags: [MessageFlags.IsComponentsV2]
                    }).then(msg => {
                        createCollector(msg)
                    })

                    await interaction.channel.send({ content: `Após realizar o pagamento, envie o comprovante e aguarde pacientemente o retorno da equipe. Agradecemos pela sua compreensão e confiança.`, ephemeral: true })
                } else {

                    const content = `Selecione uma forma de pagamento.`

                    var u = client.db.General.get(`ConfigGeral.MercadoPagoConfig.PixToggle`) == "OFF"
                    var bb = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"

                    const row = new ActionRowBuilder()


                    if (u == false) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultpix")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    } else if (client.db.General.get(`ConfigGeral.EfiBank.status`) == true) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultEfiBank")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    } else if (client.db.General.get('ConfigGeral.Nubank.status') == true) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultNubankImap")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    }




                    if (bb == false) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoutsaldo")
                                .setLabel('Saldo')
                                .setEmoji(`1242917506247692491`)
                                .setStyle(2)
                                .setDisabled(bb)
                        )
                    }

                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setLabel('Cancelar')
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                            .setDisabled(false)
                    )


                    if (row.components.length == 1) return interaction.followUp({ content: `${global.emoji.errado} Não há formas de pagamento disponíveis.`, flags: [MessageFlags.Ephemeral] })



                    interaction.message.edit({ content: content, embeds: [], components: [row] }).then(msg => {
                        createCollector(msg)
                    })
                }
            }

            if (interaction.customId.startsWith('manualpix')) {

                let payloadPix = client.db.Carrinho.get(`${interaction.channel.topic}.payloadPix`)
                try {
                    await interaction.reply({ ephemeral: true, content: payloadPix })

                } catch (error) {
                    await interaction.reply({ content: `${obterEmoji(21)} | Não Disponível!`, ephemeral: true })
                }
            }

            if (interaction.customId.startsWith('AprovarManual')) {

                if (!permissionsInstance.get(interaction.user.id)) return interaction.deferUpdate()


                const resultado = interaction.channel.topic.replace('carrinho_', '');

                var gg = client.db.Carrinho.get(interaction.channel.topic)
                const today = new Date();

                let info2 = client.db.StatusCompras.get(interaction.channel.id)

                var t = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)

                let logmessage5 = ''
                let logmessage6 = ''

                if (t == null) return interaction.reply({ content: `${obterEmoji(22)} | Não foi possível encontrar os produtos do carrinho.`, ephemeral: true })

                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`
                        logmessage6 += `${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\n`

                    }
                }

                let canal = null
                let msg = null
                try {
                    canal = await client.channels.fetch(info2.canal)
                    msg = await canal.messages.fetch(info2.msg)
                } catch (error) {

                }

                let usersResp = await client.users.fetch(resultado)


                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setColor('Green')
                    .setDescription(`Usuário <@!${resultado}> teve seu pedido aprovado`)
                    .setFields(
                        { name: `Detalhes`, value: logmessage5, inline: false },
                        { name: `ID do Pedido`, value: `\`${info2.uu2}\``, inline: false },
                        { name: `Forma de Pagamento`, value: `\`Pix - SemiAutomatico\``, inline: false }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()

                let datafommarterhoje = today.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                let formatterprice = Number(gg.totalpicecar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })
                if (global.server !== 'aliensales') {
                    if (client.db.General.get('ConfigGeral.Notificar.Wpp.status') == true) {
                        let number = client.db.General.get('ConfigGeral.Notificar.Wpp.numero')
                    }
                }
                const row222 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ReembolsarCompra')
                            .setLabel('Reembolsar')
                            .setEmoji('1243421135673229362')
                            .setStyle(2)
                    );
                let msglog
                if (msg !== null) {
                    msglog = await msg.reply({ embeds: [embed], components: [row222] })
                }
                await client.db.StatusCompras.delete(interaction.channel.id)

                let uu2 = info2.uu2
                await client.db.StatusCompras.set(`${info2.uu2}`, { Status: 'Aprovado', user: resultado, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, IdCompra: info2.uu2, Metodo: 'Saldo', Data: today, canal: msglog?.channel?.id, msg: msglog?.id })

                if (gg.messagepagamento !== null) {
                    client.db.StatusCompras.set(`${uu2}.messageinfoprodutos`, gg.messagepagamento)
                }

                if (gg.cupomaplicado !== null && gg.cupomaplicado !== undefined) {
                    client.db.StatusCompras.set(`${uu2}.cupomaplicado`, gg.cupomaplicado)
                }
                if (gg.valordodesconto !== null && gg.valordodesconto !== undefined) {
                    client.db.StatusCompras.set(`${uu2}.valordodesconto`, gg.valordodesconto)
                }
                await interaction.channel.messages.fetch().then(async (messages) => {
                    // await interaction.channel.bulkDelete(messages)
                })

                var date = new Date();
                date.setUTCHours(date.getUTCHours() + 3)
                var dataatual = date.getTime();

                client.db.usuariosinfo.set(`${resultado}.ultimacompra`, dataatual)

                EntregarProdutos(client)
            }


            if (interaction.customId.startsWith('checkoutsaldo')) {

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                var pp = client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)
                if (pp == null) pp = 0.00

                var gg = client.db.Carrinho.get(interaction.channel.topic)

                var tt = client.db.General.get('ConfigGeral')

                if (pp < Number(gg.totalpicecar)) {
                    interaction.reply({ content: `${obterEmoji(22)} | Você não tem saldo suficiente para realizar essa compra. Seu saldo: \`${Number(pp).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`, valor da compra: \`${Number(gg.totalpicecar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``, ephemeral: true })
                    var u = client.db.General.get(`ConfigGeral.MercadoPagoConfig.PixToggle`) == "OFF"
                    var bb = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"

                    const row = new ActionRowBuilder()

                    if (u == false) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultpix")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    } else if (client.db.General.get(`ConfigGeral.EfiBank.status`) == true) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultEfiBank")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    } else if (client.db.General.get('ConfigGeral.Nubank.status') == true) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultNubankImap")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    }

                    if (bb == false) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoutsaldo")
                                .setLabel('Saldo')
                                .setEmoji(`1242917506247692491`)
                                .setStyle(2)
                                .setDisabled(bb)
                        )
                    }

                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setLabel('Cancelar')
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                            .setDisabled(false)
                    )


                    interaction.message.edit({ content: `Selecione uma forma de pagamento.`, components: [row] }).then(msg => {
                        createCollector(msg)
                    })
                    return
                }
                interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Sistema de pagamento`)
                    .setDescription(`${obterEmoji(9)} - Você deseja efetuar o pagamento de ${gg.messagepagamento2} no valor de \`${Number(gg.totalpicecar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\` utilizando seu saldo de \`${Number(pp).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`?`)
                    .setFooter({ text: `Após efetuar o pagamento, o tempo de entrega é de no maximo 1 minuto!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("ComprarSaLDOcONFIRM")
                            .setLabel('Comprar')
                            .setEmoji(`1237122935437656114`)
                            .setStyle(3)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("voltarlastcheckout")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false))

                interaction.message.edit({ content: ``, embeds: [embed], components: [row] }).then(msg => {
                    createCollector(msg)
                })
            }

            if (interaction.customId.startsWith('ComprarSaLDOcONFIRM')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var pp = client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)

                var gg = client.db.Carrinho.get(interaction.channel.topic)
                const uu2 = generateCode2(7)
                client.db.PagamentosSaldos.set(`${interaction.user.id}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)) - Number(gg.totalpicecar).toFixed(2))



                const today = new Date();

                await client.db.StatusCompras.set(`${uu2}`, { Status: 'Aprovado', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, IdCompra: uu2, Metodo: 'Saldo', Data: today })
                if (gg.messagepagamento !== null) {
                    client.db.StatusCompras.set(`${uu2}.messageinfoprodutos`, gg.messagepagamento)
                }

                if (gg.cupomaplicado !== null && gg.cupomaplicado !== undefined) {
                    client.db.StatusCompras.set(`${uu2}.cupomaplicado`, gg.cupomaplicado)
                }
                if (gg.valordodesconto !== null && gg.valordodesconto !== undefined) {
                    client.db.StatusCompras.set(`${uu2}.valordodesconto`, gg.valordodesconto)
                }
                await interaction.channel.messages.fetch().then(async (messages) => {
                    await interaction.channel.bulkDelete(messages)
                })

                var t = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)

                let logmessage5 = ''

                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`
                    }
                }

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setColor('Green')
                    .setDescription(`Usuário <@!${resultado}> teve seu pedido aprovado`)
                    .setFields(
                        { name: `Detalhes`, value: logmessage5, inline: false },
                        { name: `ID do Pedido`, value: `\`${uu2}\``, inline: false },
                        { name: `Forma de Pagamento`, value: `\`Saldo\``, inline: false }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()

                const row222 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ReembolsarCompra')
                            .setLabel('Reembolsar')
                            .setEmoji('1243421135673229362')
                            .setStyle(2)
                    );

                let msglog
                try {
                    const canal = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                    msglog = await canal.send({ embeds: [embed], components: [row222] })
                    await client.db.StatusCompras.set(`${uu2}.canal`, msglog.channel.id)
                    await client.db.StatusCompras.set(`${uu2}.msg`, msglog.id)
                } catch (error) { }

                interaction.channel.send(`${interaction.user}, estamos verificando seu pagamento. Aguarde.`)
                EntregarProdutos(client)
            }

            if (interaction.customId.startsWith('voltarlastcheckout')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = client.db.Carrinho.get(interaction.channel.topic)
                var sss = ''
                var sss2 = ''
                let ss3 = ''
                gg.produtos.forEach((objeto, index) => {
                    const chave = Object.keys(objeto)[0];
                    const { name, qtd } = objeto[chave];
                    sss += `${name} x${qtd}`;
                    if (index !== gg.produtos.length - 1) {
                        sss += '\n';
                    }

                    sss2 += `${name} - ${qtd}, `;
                    ss3 += `\`${qtd}x ${name}\` | \`${Number(client.db.produtos.get(`${chave}.settings.price`) * qtd).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`;
                });


                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento`, sss)
                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento2`, sss2)
                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento3`, ss3)

                const content = `Selecione uma forma de pagamento.`

                var u = client.db.General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`) == "OFF"
                var bb = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"

                const row = new ActionRowBuilder()

                if (u == false) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId("checkoultpix")
                            .setLabel('Pix')
                            .setEmoji(`1233188452330373142`)
                            .setStyle(2)
                            .setDisabled(false)
                    )
                } else if (client.db.General.get(`ConfigGeral.EfiBank.status`) == true) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId("checkoultEfiBank")
                            .setLabel('Pix')
                            .setEmoji(`1233188452330373142`)
                            .setStyle(2)
                            .setDisabled(false)
                    )
                } else if (client.db.General.get('ConfigGeral.Nubank.status') == true) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId("checkoultNubankImap")
                            .setLabel('Pix')
                            .setEmoji(`1233188452330373142`)
                            .setStyle(2)
                            .setDisabled(false)
                    )
                }

                if (bb == false) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId("checkoutsaldo")
                            .setLabel('Saldo')
                            .setEmoji(`1242917506247692491`)
                            .setStyle(2)
                            .setDisabled(bb)
                    )
                }

                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId("stopcompracancellastfase")
                        .setLabel('Cancelar')
                        .setEmoji(`1229787813046915092`)
                        .setStyle(4)
                        .setDisabled(false)
                )

                interaction.message.edit({ content: content, embeds: [], components: [row] }).then(msg => {
                    createCollector(msg)
                })
            }


            if (interaction.customId.startsWith('checkoultEfiBank')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate();
                
                var gg = client.db.Carrinho.get(interaction.channel.topic);
                
                const buttonCarregando = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('carregando')
                            .setLabel('Gerando...')
                            .setStyle(2)
                            .setDisabled(true)
                    );
            
                // Atualiza a interação mostrando o botão desativado e a mensagem de carregamento no content
                await interaction.update({
                    content: `${global.emoji.loading_promisse} Gerando pagamento...`,
                    embeds: [],
                    components: [buttonCarregando],
                });
            


                GenerateToken(null, null, null, client).then(async () => {

                    let payment = await createCobEfi(Number(gg.totalpicecar), `Pagamento - ${interaction.guild.name} - ${interaction.user.id}`, `${interaction.user.username}`, client)

                    let qrcode = await generateQRCode(payment.loc.id, client)

                    const base64Image = qrcode.imagemQrcode.split(",")[1];
                    client.db.Pagamentos.set(`${interaction.channel.topic}`, {
                        Type: 'efibank',
                        BodyCompra: payment.txid,
                        IdServer: client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP,
                        user: interaction.user.id,
                        ID: payment.txid,
                        pixcopiaecola: qrcode.qrcode,
                        CanalID: interaction.channel.id,
                    })


                    await interaction.editReply({
                        content: `${global.emoji.loading_promisse}  Espere só mais um pouco...`,
                        components: []  // ou mantenha os botões que quiser aqui dentro, em ActionRowBuilder
                    });
                    

                    const buffer = await GerarQrCode(qrcode.qrcode, client)
                    const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

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







                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Pedido solicitado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562913790595133.webp?size=44&quality=lossless' })
                        .setColor('Yellow')
                        .setDescription(`Usuário ${interaction.user} solicitou um pedido.`)
                        .setFields(
                            { name: `Detalhes:`, value: logmessage5 },
                            { name: `ID do Pedido`, value: `\`${payment.txid}\`` },
                            { name: `Forma de Pagamento`, value: `\`Efí Bank\`` }
                        )
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTimestamp()


                        await interaction.editReply({
                            content: `${interaction.user}`,
                            embeds: [embed],
                            components: [row],
                            files: [attachment]
                            // Removed invalid flags parameter
                        });
                    
                          
                          
    

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
                                        { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
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
                                    { name: `ID do Pedido`, value: `\`${payment.txid}\`` },
                                )
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                .setTimestamp()


                            await member.send({ embeds: [embed] })
                        } catch (error) {

                        }
                    }, client.db.General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000);
                    client.db.StatusCompras.set(`${payment.txid}`, { Status: 'Pendente', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, canal: msglog?.channel?.id, msg: msglog?.id, type: 'pix' })
                }).catch(async (err) => {
                    console.log(err)
                    const content = `Selecione uma forma de pagamento.`

                    var u = client.db.General.get(`ConfigGeral.MercadoPagoConfig.PixToggle`) == "OFF"
                    var bb = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"

                    const row = new ActionRowBuilder()


                    if (u == false) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultpix")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    } else if (client.db.General.get(`ConfigGeral.EfiBank.status`) == true) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultEfiBank")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    } else if (client.db.General.get('ConfigGeral.Nubank.status') == true) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultNubankImap")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false)
                        )
                    }

                    if (bb == false) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoutsaldo")
                                .setLabel('Saldo')
                                .setEmoji(`1242917506247692491`)
                                .setStyle(2)
                                .setDisabled(bb)
                        )
                    }
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setLabel('Cancelar')
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                            .setDisabled(false)
                    )
                    await interaction.editReply({ content: content, embeds: [], components: [row] }).then(msg => {
                        createCollector(msg)
                    })
                    interaction.followUp({ content: `${global.emoji.errado} Ocorreu um erro ao gerar o pagamento.`, ephemeral: true })
                })


            }




            if (interaction.customId.startsWith('checkoultpix')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                var gg = client.db.Carrinho.get(interaction.channel.topic)
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
                    content: `${global.emoji.loading_promisse} Gerando pagamento...`, // Adicione como texto principal
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('loading_payment')
                                .setLabel('Processando...')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                    ]
                });


                var payment_data = {
                    transaction_amount: Number(gg.totalpicecar),
                    description: `Pagamento - ${interaction.guild.name} - ${interaction.user.id}`,
                    payment_method_id: 'pix',
                    payer: {
                        email: `${interaction.user.id}@gmail.com`,
                        first_name: `Victor André`,
                        last_name: `Ricardo Almeida`,
                        identification: {
                            type: 'CPF',
                            number: '15084299872'
                        },

                        address: {
                            zip_code: '86063190',
                            street_name: 'Rua Jácomo Piccinin',
                            street_number: '971',
                            neighborhood: 'Pinheiros',
                            city: 'Londrina',
                            federal_unit: 'PR'
                        }
                    }
                }
                var ttttttt = generateCode2(7)
                const mercadoPagoClient = configureMercadoPago(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
                const payment = new Payment(mercadoPagoClient);
                await payment.create({ body: payment_data }).then(async function (data) {

                    client.db.Pagamentos.set(`${interaction.channel.topic}`, {
                        Type: 'pix',
                        BodyCompra: data.id,
                        IdServer: client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP,
                        user: interaction.user.id,
                        ID: ttttttt,
                        QrCode: data.point_of_interaction.transaction_data.qr_code_base64,
                        pixcopiaecola: data.point_of_interaction.transaction_data.qr_code,
                        CanalID: interaction.channel.id,
                    })


                    await interaction.editReply({
                        content: `${global.emoji.loading_promisse} Espere só mais um pouco...`,
                        components: [] // ou deixe sem components se não tiver botão
                      });
                      
                      

                    const buffer = await GerarQrCode(data.point_of_interaction.transaction_data.qr_code, client)
                    const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });



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

                    //  interaction.editReply({ content: ``, embeds: [embed2], components: [row], files: [attachment] })

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

                    


                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Pedido solicitado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562913790595133.webp?size=44&quality=lossless' })
                        .setColor('Yellow')
                        .setDescription(`Usuário ${interaction.user} solicitou um pedido.`)
                        .setFields(
                            { name: `Detalhes:`, value: logmessage5 },
                            { name: `ID do Pedido`, value: `\`${data.id}\`` },
                            { name: `Forma de Pagamento`, value: `\`Pix - Mercado Pago\`` }
                        )
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTimestamp()


                            // Final reply with all components
    await interaction.editReply({
        content: `${interaction.user}`,
        embeds: [embed],
        components: [row],
        files: [attachment]
        // Removed invalid flags parameter
    });



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
                                        { name: `ID do Pedido`, value: `\`${data.id}\`` },
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
                                    { name: `ID do Pedido`, value: `\`${data.id}\`` },
                                )
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                .setTimestamp()


                            await member.send({ embeds: [embed] })
                        } catch (error) {

                        }
                    }, client.db.General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000);


                    client.db.StatusCompras.set(`${data.id}`, { Status: 'Pendente', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, canal: msglog?.channel?.id, msg: msglog?.id, type: 'pix' })

                })
                    .catch(function (error) {
                        console.log(error)
                    });
            }

            if (interaction.customId.startsWith('pixcopiaecola182381371')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                interaction.reply({ content: `${client.db.Pagamentos.get(`${interaction.channel.topic}.pixcopiaecola`)}`, ephemeral: true })
            }
            if (interaction.customId.startsWith('qrcode182812981')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                await interaction.reply({ content: `${obterEmoji(10)} Gerando QRCode...`, ephemeral: true })
                var ttttt = client.db.Pagamentos.get(`${interaction.channel.topic}.pixcopiaecola`)
                if (
                    ttttt == null
                ) return interaction.editReply({ content: `QR Code invalido, crie outro carrinho.`, ephemeral: true })
                const { qrGenerator } = require("../../util/QRCodeLib");
                const qr = new qrGenerator({ imagePath: './util/aaaaa.png' })

                const qrcode = await qr.generate(ttttt)


                const buffer = Buffer.from(qrcode.response, "base64");
                const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

                interaction.editReply({ files: [attachment], ephemeral: true, content: `` })
            }


            if (interaction.customId.startsWith('verificarpagamento172371293')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                verificarpagamento(client)
            }


            if (interaction.customId.startsWith('termos-continuar')) {

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate();

                var vv = client.db.Carrinho.get(interaction.channel.topic).produtos;

                if (vv.length === 0) return interaction.reply({ content: `${global.emoji.errado} Você não pode prosseguir sem nenhum produto no carrinho`, ephemeral: true });
                processing[interaction.channel.id] = true
                const allMessages = await interaction.channel.messages.fetch({ limit: 100 });
                const messagesToDelete = allMessages.filter(msg => msg.id !== interaction.message.id);
                await interaction.channel.bulkDelete(messagesToDelete, true).catch();
                interaction.deferUpdate();


                let somaPricetotal = 0;
                let produtostotal = 0;
                let mensagem = '';
                let field = [];

                // Collect all promises for message deletions
                const deletePromises = vv.map(async objeto => {
                    produtostotal++;
                    const propriedade = Object.keys(objeto)[0];
                    const { ChannelID, MessageID, pricetotal, price, name, qtd } = objeto[propriedade];

                    // const canal = client.channels.cache.get(ChannelID);
                    // if (canal) {
                    //     const message = await canal.messages.fetch(MessageID).catch(console.error);
                    //     if (message) await message.delete().catch(console.error);
                    // }

                    somaPricetotal += parseFloat(pricetotal);

                    mensagem += `${obterEmoji(28)} | Produto: \`${name}\`\n`;
                    mensagem += `${obterEmoji(14)} | Valor unitário: \`${Number(price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`;
                    mensagem += `${obterEmoji(12)} | Quantidade: \`${qtd}\`\n`;
                    mensagem += `${obterEmoji(14)} | Total: \`${Number(price * qtd).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n\n`;

                    field.push({
                        name: `Produto: ${name}`,
                        value: `- Valor: \`${Number(price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n- Quantidade: \`${qtd}\`\n- Soma Total: \`${Number(price * qtd).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``,
                        inline: true
                    });
                });

                // Wait for all message deletions to complete
                await Promise.all(deletePromises);

                mensagem += `\n${obterEmoji(12)} **| Produtos no Carrinho:** \`${produtostotal}\`\n`;
                mensagem += `${obterEmoji(14)} **| Valor a Pagar:** \`${somaPricetotal.toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`;
                mensagem += `${obterEmoji(16)} **| Cupom adicionado:** \`Sem Cupom\`\n`;

                client.db.Carrinho.set(`${interaction.channel.topic}.totalpicecar`, somaPricetotal.toFixed(2));
                client.db.Carrinho.set(`${interaction.channel.topic}.messagem`, mensagem);
                client.db.Carrinho.set(`${interaction.channel.topic}.accepttermo`, true);

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) === '#008000' ? 'Green' : client.db.General.get(`ConfigGeral.ColorEmbed`))
                    .setAuthor({ name: `${interaction.user.username} | Resumo da Compra`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(field)
                    .addFields({
                        name: `Detalhes Pagamento`,
                        value: `- Produtos Adicionados: \`${produtostotal}\`\n- Valor a Pagar: \`${somaPricetotal.toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n- Cupom: \`Sem Cupom Adicionado\``,
                        inline: false
                    });

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("generatepagamentlastfase")
                            .setLabel('Ir para o Pagamento')
                            .setEmoji(`1237122935437656114`)
                            .setStyle(3),
                        new ButtonBuilder()
                            .setCustomId("addcupomcarlast")
                            .setLabel('Cupom')
                            .setEmoji(`1234653175617687704`)
                            .setStyle(1),
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setLabel('Cancelar')
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                    );

                interaction.message.edit({ embeds: [embed], components: [row], content: `${interaction.user}` }).then(msg => {
                    createCollector(msg);
                });
            }
            if (interaction.customId.startsWith('stopcompracancellastfase')) {
                //  const resultado = interaction.channel.topic.replace('carrinho_', '');

                let info = client.db.StatusCompras.get(interaction.channel.id)
                client.db.Carrinho.delete(interaction.channel.topic)
                client.db.Carrinho.delete(`carrinho_${interaction.user.id}`)


                if (info == null) {
                    interaction.channel.delete()
                    return
                }

                let uu2 = info.uu2
                let type
                if (info.type == "SemiAutomatico") {
                    type = "\`Pix - SemiAutomatico\`"
                } else {
                    type = "\`Pix - Mercado Pago\`"
                }

                const embed2 = new EmbedBuilder()
                    .setAuthor({ name: `Pedido Cancelado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                    .setColor('Red')
                    .setDescription(`Usuário ${interaction.user} cancelou seu pedido.`)
                    .setFields(
                        { name: `ID do Pedido`, value: `\`${uu2}\`` },
                        { name: `Forma de Pagamento`, value: `${type}` }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()

                try {
                    const canal = await client.channels.fetch(info.canal)
                    const msg = await canal.messages.fetch(info.msg)
                    await msg.reply({ embeds: [embed2] })
                } catch (error) {
                }

                interaction.channel.delete()
            }

            if (interaction.customId.startsWith('addcupomcarlast')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                const modala = new ModalBuilder()
                    .setCustomId('addcupomcarlast')
                    .setTitle(`Adicionar Cupom`);

                const AdicionarNoTicket = new TextInputBuilder()
                    .setCustomId('addcupomcarlast')
                    .setLabel("NOME DO CUPOM?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow = new ActionRowBuilder().addComponents(AdicionarNoTicket);

                modala.addComponents(firstActionRow);

                await interaction.showModal(modala);
            }

            if (interaction.customId.startsWith('escolherqtdproduto')) {

                // COLOCAR DELAY AQUI

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                const modala = new ModalBuilder()
                    .setCustomId('escolherqtdproduto')
                    .setTitle(`✏ | Alterar Quantidade`);

                const AdicionarNoTicket = new TextInputBuilder()
                    .setCustomId('escolherqtdproduto')
                    .setLabel("Quantidade?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow = new ActionRowBuilder().addComponents(AdicionarNoTicket);

                modala.addComponents(firstActionRow);

                await interaction.showModal(modala);
            }


            if (interaction.customId.startsWith('removerprodutocarrinho')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                var uuu = db.table('infoseditproductocarrinho')
                var h = await uuu.get(interaction.message.id)

                // quero remover o produto com o nome h.ID

                const nomeObjetoProcurado = h.ID
                const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                if (posicao === -1) return interaction.reply({ content: `${obterEmoji(22)} | Produto não encontrado!`, ephemeral: true })

                const objetoRemovido = t.produtos.splice(posicao, 1)[0];

                client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos`, t.produtos)

                interaction.message.delete()
            }



            if (interaction.customId.startsWith('termos-ler')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                interaction.reply({ content: client.db.General.get(`ConfigGeral.TermosCompra`), ephemeral: true })
            }



            if (interaction.customId.startsWith('remqtdproducto')) {
                const userid = interaction.channel.topic.replace('carrinho_', '');
                if (userid !== interaction.user.id) return interaction.deferUpdate()

                if (processing[interaction.channel.id] == true) return
                let infocarrinho = db.table('infoseditproductocarrinho')
                let info = await infocarrinho.get(interaction.message.id)

                const nomeObjetoProcurado = info.ID
                const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                let Informacaoproduto = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}`)
                if (Informacaoproduto.qtd <= 1) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível diminuir mais que o produto mínimo!`, ephemeral: true })
                interaction.deferUpdate()

                await client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.qtd`, Informacaoproduto.qtd - 1)
                let produto = client.db.produtos.get(`${info.ID}`)
                let pricee = Informacaoproduto.price * (Informacaoproduto.qtd - 1)
                await client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.pricetotal`, pricee)

                let novoquantidade = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.qtd`)
                let estoqueproduto = client.db.produtos.get(`${info.ID}.settings.estoque`)
                let valorapagar = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.pricetotal`)

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(
                        { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(produto.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Estoque: \`${Object.keys(estoqueproduto).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(valorapagar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Quantidade: \`${novoquantidade}\``, inline: false }
                    )



                interaction.message.edit({ embeds: [embed] })
            }
            if (interaction.customId.startsWith('addqtdproducto')) {
                const userid = interaction.channel.topic.replace('carrinho_', '');
                if (userid !== interaction.user.id) return interaction.deferUpdate()

                if (processing[interaction.channel.id] == true) return

                let infocarrinho = db.table('infoseditproductocarrinho')
                let info = await infocarrinho.get(interaction.message.id)

                const nomeObjetoProcurado = info.ID
                const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                let Informacaoproduto = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}`)
                let estoqueproduto = client.db.produtos.get(`${info.ID}.settings.estoque`)
                if (Informacaoproduto.qtd >= Object.keys(estoqueproduto).length) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível adicionar mais que o estoque disponível!`, ephemeral: true })
                interaction.deferUpdate()

                await client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.qtd`, Informacaoproduto.qtd + 1)
                let produto = client.db.produtos.get(`${info.ID}`)
                let pricee = Informacaoproduto.price * (Informacaoproduto.qtd + 1)
                await client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.pricetotal`, pricee)

                let novoquantidade = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.qtd`)
                let valorapagar = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.pricetotal`)

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(
                        { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(produto.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Estoque: \`${Object.keys(estoqueproduto).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(valorapagar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Quantidade: \`${novoquantidade}\``, inline: false }
                    )


                interaction.message.edit({ embeds: [embed] })
            }

            if (interaction.customId.startsWith('activeNotificacaoProduto_')) {
                let produto = interaction.customId.replace('activeNotificacaoProduto_', '')


                var tt = client.db.produtos.get(`${produto}.settings.notify`)
                if (tt !== null) {
                    if (tt.includes(interaction.user.id)) {
                        interaction.reply({
                            content: `${obterEmoji(8)} | Você já estava com as notificações ativadas, portanto elas foram desativadas.\n**Caso queira ativar só clicar no botão novamente!**`, ephemeral: true
                        })
                        var novaArray = tt.filter(function (elemento) {
                            return elemento !== interaction.user.id;
                        });

                        client.db.produtos.set(`${produto}.settings.notify`, novaArray)

                    } else {
                        interaction.reply({ content: `${obterEmoji(8)} | Notificações ativadas com sucesso!`, ephemeral: true })
                        client.db.produtos.push(`${produto}.settings.notify`, interaction.user.id)
                    }
                } else {
                    interaction.reply({ content: `${obterEmoji(8)} | Notificações ativadas com sucesso!`, ephemeral: true })
                    client.db.produtos.push(`${produto}.settings.notify`, interaction.user.id)
                }
            }

        }
















        var g = null
        var namecustom = null
        var painel2222 = null
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'buyprodutoporselect') {
                g = client.db.produtos.get(interaction.values[0])
                namecustom = interaction.values[0]
                painel2222 = true
                painelname = interaction.customId
            }
        }
        if (interaction.isButton()) {
            g = client.db.produtos.get(interaction.customId)
            namecustom = interaction.customId
            painel2222 = false
        }
        if (g !== null) {
            interaction.message.edit()
            const currentTime = Date.now();
            const customId = interaction.user.id;

            const ddawdawdd = client.db.blacklist.get(`BlackList.users`)

            if (ddawdawdd !== null) {
                if (ddawdawdd.includes(interaction.user.id) == true) {
                    interaction.reply({ content: `${global.emoji.errado} Você está na **lista de restrições** do nosso sistema de loja e não pode prosseguir.`, ephemeral: true });
                    return
                }
            }


            if (lastReturnTimes[customId]) {
                const elapsedTime = currentTime - lastReturnTimes[customId];
                const remainingTime = Math.max(0, cooldownTime - Math.floor(elapsedTime / 1000));

                if (remainingTime > 0) {
                    interaction.reply({ content: `Aguarde ${remainingTime} segundos para interagir novamente.`, ephemeral: true });
                    return;
                }
            }
            const axios = require('axios');
            lastReturnTimes[customId] = currentTime;


            // aquii

            if (client.db.General.get('ConfigGeral').MercadoPagoConfig.PixToggle == "ON") {
                const embed3 = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Sistema de Vendas`)
                    .setDescription(`${obterEmoji(21)} | ${interaction.user} Você não configurou corretamente o Token do Mercado Pago!.`)

                if (client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP == "") return interaction.reply({ embeds: [embed3], ephemeral: true })


            }


            if (client.db.General.get(`ConfigGeral.Status`) == 'OFF') return interaction.reply({ content: `${global.emoji.errado} O sistema de vendas desse servidor está desligado!`, ephemeral: true })



            var fasasas = client.db.produtos.get(`${namecustom}.settings.CargosBuy`)

            if (fasasas !== null) {
                const hasAnyRole = fasasas.some(roleId => interaction.member.roles.cache.has(roleId))
                if (hasAnyRole) {
                } else {

                    const content = `${global.emoji.errado} Você não possui permissão para comprar esse produto!`

                    interaction.reply({ content: content, ephemeral: true })
                    return
                }
            }



            var f = client.db.produtos.get(`${namecustom}.settings.estoque`)

            let content = `${global.emoji.setinha} o produto **${g.settings.name}** não possui estoque, caso queira ser notificado quando o produto voltar a ter estoque clique no botão abaixo!`

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("activeNotificacaoProduto_" + namecustom)
                        .setLabel('Ativar Notificações')
                        .setEmoji(`1243307533158842521`)
                        .setStyle(2)
                )


            if (f !== null) {
                if (Object.keys(f).length <= 0) {


                    return await interaction.reply({ content: content, components: [row], ephemeral: true })
                }
            } else {
                return interaction.reply({ content: content, components: [row], ephemeral: true })
            }






            let achando = interaction.guild.channels.cache.find(a => a.topic === `carrinho_${interaction.user.id}`);

            var a = client.db.Carrinho.get(`carrinho_${interaction.user.id}.ChannelUrl`)



            if (a !== null) {


                const row2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel(`Ver Carrinho`)
                        .setStyle(5)
                        .setURL(a)
                )
                if (achando) {

                    var uuuu = client.db.Carrinho.get(`carrinho_${interaction.user.id}.accepttermo`)

                    const row99 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel(`Ver Carrinho`)
                            .setStyle(5)
                            .setURL(a)
                    )
                    if (uuuu == true) return interaction.reply({ content: `${global.emoji.errado} Não é possível adicionar mais produtos no seu carrinho!`, components: [row99], ephemeral: true })


                    var all = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                    var bbbb = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos`)
                    const objetoEncontrado = bbbb.find(objeto => {
                        return objeto.hasOwnProperty(g.ID);
                        // Ou utilize: return palavra in objeto;
                    });
                    if (objetoEncontrado) {
                        interaction.reply({ content: `${global.emoji.errado} Esse produto ja foi adicionado ao seu carrinho.`, components: [row2], ephemeral: true })
                        return
                    }


                    const content = `${global.emoji.certo} Produto adicionado com sucesso no seu carrinho!`

                    const row3 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel(`Ver Carrinho`)
                            .setStyle(5)
                            .setURL(a)
                    )

                    interaction.reply({ content: content, embeds: [], components: [row3], ephemeral: true })
                    const channela = interaction.guild.channels.cache.get(all.ChannelID);

                    let estoqueproduto = client.db.produtos.get(`${g.ID}.settings.estoque`)
                    let valorapagar = g.settings.price
                    let novoquantidade = 1
                    let produto = client.db.produtos.get(`${g.ID}`)

                    const embed = new EmbedBuilder()
                        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                        .setFields(
                            { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(produto.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Estoque: \`${Object.keys(estoqueproduto).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(valorapagar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Quantidade: \`${novoquantidade}\``, inline: false }
                        )



                    const row22 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji('1233110125330563104')
                            .setCustomId('addqtdproducto')
                            .setStyle(2),
                        new ButtonBuilder()
                            .setEmoji('1237122937631408128')
                            .setCustomId('escolherqtdproduto')
                            .setStyle(3),
                        new ButtonBuilder()
                            .setEmoji('1242907028079247410')
                            .setCustomId('remqtdproducto')
                            .setStyle(2),
                        new ButtonBuilder()
                            .setEmoji('1229787813046915092')
                            .setCustomId('removerprodutocarrinho')
                            .setStyle(4)
                    )

                    channela.send({ embeds: [embed], components: [row22] }).then(msg => {
                        const produto = { [g.ID]: { price: g.settings.price, qtd: 1, name: g.settings.name, ChannelID: msg.channel.id, MessageID: msg.id, pricetotal: g.settings.price, GuildServerID: interaction.guild.id } };
                        client.db.Carrinho.push(`carrinho_${interaction.user.id}.produtos`, produto)
                        var uuu = db.table('infoseditproductocarrinho')
                        uuu.set(msg.id, { ID: g.ID, ChannelID: msg.channel.id, MessageID: msg.id })
                    })
                    return
                }
            }


            if (client.db.OAuth2.get('Config.status')) {
                return interaction.reply('Desculpe, mas o sistema de OAuth2 está em manutenção e não está disponível no momento.')

                
                request = request.data

                if (request.message == '401: Unauthorized') {
                    await client.db.OAuth2.delete('Config')
                }
                if (!request.users.includes(interaction.user.id)) {

                    let buttonlink = new ButtonBuilder()
                        .setStyle(5)
                        .setLabel('Clique aqui para se autenticar')
                        .setURL(invite)

                    return interaction.reply({ content: `Este servidor requer que os membros estejam verificados para abrir carrinhos. Por favor, clique no botão abaixo e autorize para continuar.`, components: [new ActionRowBuilder().addComponents(buttonlink)], ephemeral: true })

                }
            }



            var categoria
            if (client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`) !== null) {
                categoria = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`)
                let category = client.channels.cache.get(categoria);
                if (category == undefined) categoria = null
            } else {
                categoria = null
            }

            let channel = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`));
            if (channel == undefined) channel = null
            if (channel !== null) {
                var tttttttt = channel.type == ChannelType.GuildCategory
                if (tttttttt == false) return interaction.reply({ content: `${global.emoji.errado} Error o CHAT escolhido não é uma categoria`, ephemeral: true })
            }

            var uuuuuuuuuu = 1
            if (client.db.General.get('ConfigGeral.MercadoPagoConfig.PixToggle') == "ON") {
                await axios.get('https://api.mercadopago.com/v1/payment_methods', {
                    headers: {
                        'Authorization': `Bearer ${client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP}`
                    }
                })
                    .then(async (data) => {
                        await interaction.reply({ content: `${global.emoji.loading_promisse} Aguarde, criando carrinho..`, ephemeral: true })
                    })
                    .catch(async error => {
                        try {
                            await interaction.reply({ content: `${global.emoji.errado} Error Mercado Pago: ${error.response.data.message}`, ephemeral: true })
                        } catch (error) {
                            await interaction.reply({ content: `${global.emoji.errado} Error Mercado Pago: ${error}`, ephemeral: true })
                        }

                        uuuuuuuuuu = 0
                    });
            } else {
                await interaction.reply({ content: `${global.emoji.loading_promisse} Aguarde, criando carrinho..`, ephemeral: true })
            }

            if (uuuuuuuuuu !== 1) return

            interaction.guild.channels.create({
                name: `🛒・${interaction.user.username}`,
                parent: categoria,
                topic: `carrinho_${interaction.user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            }).then(async channel281243664 => {

                var g = client.db.produtos.get(namecustom)
                var f = client.db.produtos.get(`${namecustom}.settings.estoque`)
                var pp = g.ID
                client.db.Carrinho.delete(`carrinho_${interaction.user.id}`)
                const produto = { [pp]: { price: g.settings.price, qtd: 1, name: g.settings.name, pricetotal: g.settings.price } };
                if (painel2222 == true) {
                    client.db.Carrinho.set(`carrinho_${interaction.user.id}`, { ChannelUrl: channel281243664.url, ChannelID: channel281243664.id, produtos: [produto], GuildServerID: interaction.guild.id, painel: painel2222, painelname: painelname })
                } else {
                    client.db.Carrinho.set(`carrinho_${interaction.user.id}`, { ChannelUrl: channel281243664.url, ChannelID: channel281243664.id, produtos: [produto], GuildServerID: interaction.guild.id, painel: painel2222 })
                }
                const embedPrincipalCar = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} | Carrinho de Compras`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`- Olá ${interaction.user}, bem vindo ao seu carrinho! Aqui você poderá adicionar produtos e finalizar sua compra.\n- Lembre-se de ler nossos termos e compra, para não ter nenhum problema futuramente, ao continuar com a compra, você concorda com nossos termos.\n- Quando estiver tudo pronto aperte o botão abaixo, para continuar com sua compra!`)

                const RowPrincipalCar = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Aceitar e Continuar')
                        .setEmoji('1237122935437656114')
                        .setCustomId('termos-continuar')
                        .setStyle(3),
                    new ButtonBuilder()
                        .setLabel('Cancelar')
                        .setEmoji('1229787813046915092')
                        .setCustomId('stopcompracancellastfase')
                        .setStyle(4),
                    new ButtonBuilder()
                        .setLabel('Ler os Termos')
                        .setEmoji('1234606184711979178')
                        .setCustomId('termos-ler')
                        .setDisabled(client.db.General.get(`ConfigGeral.TermosCompra`) == null ? true : false)
                        .setStyle(1)
                )
                channel281243664.send({ content: `${interaction.user}`, embeds: [embedPrincipalCar], components: [RowPrincipalCar] }).then(msg => {
                    createCollector(msg)
                })


                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Produto: ${g.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(
                        { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(g.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Estoque: \`${Object.keys(f).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(g.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n - Quantidade: \`1\``, inline: false }
                    )


                const row22 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setEmoji('1233110125330563104')
                        .setCustomId('addqtdproducto')
                        .setStyle(2),
                    new ButtonBuilder()
                        .setEmoji('1237122937631408128')
                        .setCustomId('escolherqtdproduto')
                        .setStyle(3),
                    new ButtonBuilder()
                        .setEmoji('1242907028079247410')
                        .setCustomId('remqtdproducto')
                        .setStyle(2),
                    new ButtonBuilder()
                        .setEmoji('1229787813046915092')
                        .setCustomId('removerprodutocarrinho')
                        .setStyle(4)
                )

                channel281243664.send({ embeds: [embed], components: [row22] }).then(msg => {
                    const nomeObjetoProcurado = g.ID
                    const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                    let posicao = -1;

                    for (let i = 0; i < t.produtos.length; i++) {
                        const objeto = t.produtos[i];
                        if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                            posicao = i;
                            break;
                        }
                    }
                    client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${g.ID}.ChannelID`, msg.channel.id)
                    client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${g.ID}.MessageID`, msg.id)
                    var uuu = db.table('infoseditproductocarrinho')
                    uuu.set(msg.id, { ID: g.ID, ChannelID: msg.channel.id, MessageID: msg.id, GuildServerID: interaction.guild.id })
                })


                const reply = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Sistema de Vendas`)
                    .setDescription(`**${global.emoji.certo} ${interaction.user} Seu carrinho foi aberto com sucesso em: ${channel281243664}, fique à vontade para adicionar mais produtos.**`)
                    .setColor('Green')

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel(`Ver Carrinho`)
                        .setStyle(5)
                        .setURL(channel281243664.url)
                )

                interaction.editReply({ content: `Olá ${interaction.user}, Seu carrinho está aberto! Sinta-se à vontade para adicionar mais produtos.`, embeds: [], components: [row] })
            })
        } else {
            return
        }
    }
}

function generateCode(length) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}
function generateCode2(length) {
    let characters = '1234567890';
    let code = '';

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
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