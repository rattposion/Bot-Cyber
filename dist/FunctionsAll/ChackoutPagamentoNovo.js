const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Role, AttachmentBuilder } = require("discord.js");
const axios = require('axios');
const { QuickDB } = require("quick.db");
const { atualizarmensagempainel } = require("./PainelSettingsAndCreate");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const { SendMessageZap } = require("./WppFunctions/wpp");
const { ReembolsoEfi } = require("./Payments/EfíBank");
const { atualizarmessageprodutosone } = require("./Createproduto");
const db = new QuickDB();
var uud = db.table('avaliarrrrr')

async function EntregarProdutos(client) {
    var status = client.db.StatusCompras.fetchAll()
    for (let i = 0; i < status.length; i++) {
        const PaymentName = status[i].ID
        const Status = status[i].data.Status
        const GuildServerID = status[i].data.GuildServerID
        const user = status[i].data.user
        const ID = status[i].data.ID
        const ID2 = status[i]
        const IdCompra = status[i].data.IdCompra
        const Metodo = status[i].data.Metodo

        if (Status == "Aprovado") {
            client.db.StatusCompras.set(`${PaymentName}.Status`, 'Entregue')
            var tbbb = client.db.Carrinho.get(`${ID}`)

            try {
                const channel222 = await client.channels.fetch(tbbb.ChannelID).catch()
                await channel222.messages.fetch().then(async (messages) => {
                    try {
                        await channel222.bulkDelete(messages)
                    } catch (error) {

                    }

                })
            } catch (error) {

            }
            var t = client.db.Carrinho.get(`${ID}.produtos`)

            var produtosname = []
            var logmessage1 = ''
            var logmessage2 = ''
            var logmessage3 = ''
            var logmessage4 = ''
            let logmessage5 = ''
            let logmessage6 = ''

            for (let i = 0; i < t.length; i++) {
                for (let key in t[i]) {
                    produtosname.push({
                        Name: key,
                        Qtd: t[i][key].qtd,
                        Name_2: client.db.produtos.get(`${key}.settings.name`)
                    });

                    logmessage1 += `${client.db.produtos.get(`${key}.settings.name`)} x${t[i][key].qtd}`
                    logmessage2 += client.db.produtos.get(`${key}.settings.name`)
                    logmessage3 += client.db.produtos.get(`${key}.ID`)
                    logmessage4 += `${client.db.produtos.get(`${key}.settings.name`)} - ${t[i][key].qtd}\n`
                    logmessage6 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)}\`\n`


                    var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)

                    logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`

                    var get = 0
                    var get2 = 0
                    if (client.db.estatisticas.get(`${key}.TotalPrice`) !== null) {
                        get = Number(client.db.estatisticas.get(`${key}.TotalPrice`))
                    }
                    if (client.db.estatisticas.get(`${key}.TotalQtd`) !== null) {
                        get2 = Number(client.db.estatisticas.get(`${key}.TotalQtd`))
                    }

                    client.db.estatisticas.set(`${key}.TotalQtd`, Number(get2) + Number(t[i][key].qtd))
                    client.db.estatisticas.set(`${key}.TotalPrice`, Number(get) + Number(valor))

                    if (i < t.length - 1) {
                        logmessage2 += ', ';
                        logmessage3 += ', ';
                        logmessage1 += ', ';
                    }
                }
            }

            client.db.StatusCompras.set(`${PaymentName}.ProdutosComprados`, logmessage4)


            var ppppopopooopo = ''
            var finalproduto = ''
            var finalproduto2 = ''

            var qtddd = 0
            for (var ie = 0; ie < produtosname.length; ie++) {


                qtddd += produtosname[ie].Qtd
                const estoque = client.db.produtos.get(`${produtosname[ie].Name}.settings.estoque`) || [];
                for (let j = 0; j < produtosname[ie].Qtd; j++) {
                    const produto = estoque.length > 0 ? estoque.shift() : '`Estoque desse produto esgotou - Contate um STAFF`';

                    finalproduto += `${obterEmoji(12)} | Entrega do Produto: ${produtosname[ie].Name_2} - ${j + 1}/${produtosname[ie].Qtd}\n${produto}\n\n`;
                    finalproduto2 += `${produto}\n`;
                }
                client.db.produtos.set(`${produtosname[ie].Name}.settings.estoque`, estoque);

                var oooo = client.db.produtos.get(`${produtosname[ie].Name}.embedconfig.cargo.name`)
                var temporole = client.db.produtos.get(`${produtosname[ie].Name}.embedconfig.cargo.tempo`)

                if (oooo !== null) {
                    try {
                        await client.guilds.cache.get(GuildServerID).members.fetch(user).then(member => member.roles.add(oooo))
                    } catch (error) {

                    }

                    const currentTime = new Date();
                    const timestamp2 = currentTime.getTime();
                    var dkçnajbyoa = temporole * produtosname[ie].Qtd
                    const timestamp = dkçnajbyoa * 24 * 60 * 60 * 1000;
                    bfuu = timestamp2 + timestamp

                    if (temporole !== null) {
                        var gg = client.db.RoleTime.get(user)
                        if (gg && gg.length) {
                            for (let i = 0; i < gg.length; i++) {
                                if (client.db.RoleTime.get(`${user}[${i}].role`) == oooo)
                                    client.db.RoleTime.set(`${user}[${i}].timestamp`, client.db.RoleTime.get(`${user}[${i}].timestamp`) + timestamp);
                                else
                                    await client.db.RoleTime.push(user, { role: oooo, user, timestamp: bfuu, guildid: GuildServerID, produto: client.db.produtos.get(`${produtosname[ie].Name}.settings.name`) });
                            }
                        } else {
                            await client.db.RoleTime.push(user, { role: oooo, user, timestamp: bfuu, guildid: GuildServerID, produto: client.db.produtos.get(`${produtosname[ie].Name}.settings.name`) });
                        }
                    }


                    if (gg && gg.length) {
                        for (let i = 0; i < gg.length; i++) {
                            if (!ppppopopooopo.includes(`<@&${oooo}> - Permanente`) && temporole === null) ppppopopooopo += `<@&${oooo}> - Permanente\n`;
                            let timestamp2 = Math.floor(client.db.RoleTime.get(`${user}[${i}].timestamp`) / 1000);
                            if (!ppppopopooopo.includes(`<@&${oooo}> - Expira em:`)) temporole !== null ? ppppopopooopo += `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n` : '';
                            else if (temporole !== null) ppppopopooopo = ppppopopooopo.replace(new RegExp(`<@&${oooo}> - Expira em:.+`, 'g'), `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n`);
                        }
                    } else {
                        if (!ppppopopooopo.includes(`<@&${oooo}> - Permanente\n`) && temporole === null) ppppopopooopo += `<@&${oooo}> - Permanente\n`;
                        const currentTime = new Date(), timestamp2 = currentTime.getTime(), dkçnajbyoa = temporole * produtosname[ie].Qtd, timestamp = dkçnajbyoa * 24 * 60 * 60 * 1000, bfuu = timestamp2 + timestamp, timestamp22 = Math.floor(bfuu / 1000);
                        if (!ppppopopooopo.includes(`<@&${oooo}> - Expira em:`)) temporole !== null ? ppppopopooopo += `<@&${oooo}> - Expira em: <t:${timestamp22}:R>\n` : '';
                        else if (temporole !== null) ppppopopooopo = ppppopopooopo.replace(new RegExp(`<@&${oooo}> - Expira em:.+`, 'g'), `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n`);
                    }



                }

                var fsfs = client.db.produtos.get(`${produtosname[ie].Name}.settings.estoque`)
                var fsfs2222 = client.db.produtos.get(`${produtosname[ie].Name}.settings.name`)

                try {
                    if (fsfs.length == 0) {
                        const channela = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));

                        try {
                            await channela.send({ content: `Acabou o stock do produto de id: **${produtosname[ie].Name}** Nome: **${fsfs2222}**` })
                        } catch (error) {

                        }
                    }
                } catch (error) {

                }


            }

            var kkkkkkk = client.db.PainelVendas.fetchAll()
            let channel
            try {
                channel = await client.channels.fetch(tbbb.ChannelID)
            } catch (error) {

            }


            for (var bg = produtosname.length - 1; bg >= 0; bg--) {
                var produto = produtosname[bg].Name;
                try {
                    for (const item of kkkkkkk) {
                        for (const p of item.data.produtos) {
                            if (p === produto) {
                                await atualizarmensagempainel(tbbb.GuildServerID, item.ID, client);
                            }
                        }
                    }
                } catch (error) { }
                atualizarmessageprodutosone(null, client, produto);
            }

            const member = await client.guilds.cache.get(tbbb.GuildServerID).members.fetch(user);
            if (client.db.General.get('ConfigGeral.ChannelsConfig.CargoCliente') !== null) {
                try {
                    await member.roles.add(client.db.General.get('ConfigGeral.ChannelsConfig.CargoCliente'));
                } catch (error) {
                }
            }
            var fileName
            var fileBuffer2

            fileName = `entrega_produtos.txt`;
            fileBuffer2 = Buffer.from(finalproduto2, 'utf-8');

            client.db.StatusCompras.set(`${PaymentName}.valortotal`, Number(tbbb.totalpicecar).toFixed(2))

            let guild = client.guilds.cache.get(GuildServerID)
            let channela
            try {
                channela = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
            } catch (error) {

            }
            const embedlogsucess = new EmbedBuilder()
                .setColor('Purple')
                .setAuthor({ name: `Entrega realizada!`, iconURL: 'https://cdn.discordapp.com/emojis/1230562879116152923.webp?size=44&quality=lossless' })
                .setDescription(`- O usuário <@${user}> teve seu pedido entregue.`)
                .setFields(
                    { name: `Detalhes`, value: `${logmessage5}`, inline: false },
                    { name: `ID do Pedido`, value: `\`${IdCompra}\``, inline: false },
                )
                .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
                .setTimestamp()

            try {
                const canal = await client.channels.fetch(client.db.StatusCompras.get(`${PaymentName}.canal`));
                const msg = await canal.messages.fetch(client.db.StatusCompras.get(`${PaymentName}.msg`));
                await msg.reply({
                    embeds: [embedlogsucess], files: [{ attachment: fileBuffer2, name: fileName }]
                }).then(msg => {

                    client.db.StatusCompras.set(`${PaymentName}.produtosentregue`, finalproduto);
                });
            } catch (error) { }

            const embed = new EmbedBuilder()
                .setColor('Purple')
                .setAuthor({ name: `Entrega realizada!`, iconURL: 'https://cdn.discordapp.com/emojis/1182868166813171742.webp?size=44&quality=lossless' })
                .setDescription(`Seu produto foi anexado a essa mensagem.`)
                .addFields(
                    { name: `Detalhes:`, value: `\`${tbbb.messagepagamento}\`` },
                    { name: `Id da Compra:`, value: `\`${IdCompra}\`` },
                )
                .setFooter({ text: `Seu(s) Produto(s) estão abaixo:`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null });



            if (client.db.General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
                embed.setThumbnail(client.db.General.get(`ConfigGeral.MiniaturaEmbeds`))
            }

            const embedppppp = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Purple' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                .setAuthor({ name: `Avalie sua compra`, iconURL: 'https://cdn.discordapp.com/emojis/1232378451902730261.webp?size=44&quality=lossless' })
                .setDescription(`- Avalie sua compra de acordo com a qualidade do produto e atendimento.`)

            const row2222 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('1avaliar')
                    .setLabel('1')
                    .setEmoji('⭐')
                    .setStyle(2)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId('2avaliar')
                    .setLabel('2')
                    .setEmoji('⭐')
                    .setStyle(2)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId('3avaliar')
                    .setLabel('3')
                    .setEmoji('⭐')
                    .setStyle(2)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId('4avaliar')
                    .setEmoji('⭐')
                    .setLabel('4')
                    .setStyle(2)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId('5avaliar')
                    .setEmoji('⭐')
                    .setLabel('5')
                    .setStyle(2)
            )

            try { await channel.send(`${obterEmoji(8)} | Pagamento Aprovado\n${obterEmoji(9)} | Id da Compra: ${IdCompra}`) } catch (error) { }
            if (client.db.General.get(`ConfigGeral.CashBack.ToggleCashBack`) == "ON") {

                var yui = Number(tbbb.totalpicecar)
                const porcentagem = client.db.General.get(`ConfigGeral.CashBack.Porcentagem`);
                var yty = (yui * porcentagem) / 100;
                if (client.db.PagamentosSaldos.get(`${user}.SaldoAccount`) == null) {
                    client.db.PagamentosSaldos.set(`${user}.SaldoAccount`, Number(yty))
                } else {

                    client.db.PagamentosSaldos.set(`${user}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${user}.SaldoAccount`)) + Number(yty))
                }
                try { await channel.send(`${obterEmoji(4)} | Parabéns o sistema de CASHBACK do servidor está ligado!\n\n💥 | Você recebeu \`${client.db.General.get(`ConfigGeral.CashBack.Porcentagem`)}%\` do valor da compra de volta em **SALDO**\n\n${obterEmoji(4)} | Valor recebido ${Number(yty).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`) } catch (error) { }
            }

            if (client.db.usuariosinfo.get(`${user}.qtdprodutos`) !== null && client.db.usuariosinfo.get(`${user}.qtdprodutos`) !== undefined) {
                client.db.usuariosinfo.set(`${user}.qtdprodutos`, Number(client.db.usuariosinfo.get(`${user}.qtdprodutos`)) + 1)
            } else {
                client.db.usuariosinfo.set(`${user}.qtdprodutos`, 1)
            }

            if (client.db.usuariosinfo.get(`${user}.gastos`) !== null && client.db.usuariosinfo.get(`${user}.gastos`) !== undefined) {
                client.db.usuariosinfo.set(`${user}.gastos`, Number(client.db.usuariosinfo.get(`${user}.gastos`)) + Number(tbbb.totalpicecar))
            } else {
                client.db.usuariosinfo.set(`${user}.gastos`, Number(tbbb.totalpicecar))
            }

            var date = new Date();
            date.setUTCHours(date.getUTCHours() + 3)
            var dataatual = date.getTime();

            client.db.usuariosinfo.set(`${user}.ultimacompra`, dataatual)


            const today = new Date();
            client.db.estatisticasgeral.set(`${PaymentName}.Status`, 'Entregue')
            client.db.estatisticasgeral.set(`${PaymentName}.Data`, today)
            client.db.estatisticasgeral.set(`${PaymentName}.valortotal`, Number(tbbb.totalpicecar).toFixed(2))
            client.db.estatisticasgeral.set(`${PaymentName}.produtos`, qtddd)


            try {
                await member.send({ embeds: [embed] }).then(async (msg222) => {
                    if (finalproduto.length >= 500) {
                        const embed2 = new EmbedBuilder()
                            .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                            .setTitle(`${obterEmoji(6)} ${client.user.username} | Pagamento Aprovado ${obterEmoji(6)}`)
                            .setDescription(`<@${user}> **Pagamento aprovado verifique sua Dm**\n__Este canal será apagado após 1 minuto__`)

                        const row = new ActionRowBuilder()
                        row.addComponents(
                            new ButtonBuilder()
                                .setURL(msg222.url)
                                .setLabel('Atalho Para DM')
                                .setStyle(5)
                                .setDisabled(false))

                        await channel.send({ embeds: [embed2], components: [row] }).then(msg => {
                            setTimeout(async () => {
                                try {
                                    await channel.delete()
                                } catch (error) {

                                }
                            }, 60000);
                        });

                        await member.send({
                            files: [{
                                attachment: fileBuffer2,
                                name: fileName
                            }]
                        })

                        member.send({
                            embeds: [embedppppp],
                            components: [row2222]
                        }).then(ppppp => {

                            uud.set(ppppp.id, { message: tbbb.messagepagamento3, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID, date: Date.now() })

                            setTimeout(async () => {
                                var null2 = null
                                avaliacao(null2, ppppp.id, ppppp.channel.id, client, user)

                            }, 300000);
                        })

                    } else {
                        member.send({ content: finalproduto }).then(async msg => {

                            const embed2 = new EmbedBuilder()
                                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                                .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                                .setDescription(`- Olá <@${user}> seu pedido foi aprovado e entregue com sucesso!, verifique sua DM.`)

                            if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
                                embed2.setImage(client.db.General.get(`ConfigGeral.BannerEmbeds`))
                            }

                            const row = new ActionRowBuilder()
                            row.addComponents(
                                new ButtonBuilder()
                                    .setURL(msg.url)
                                    .setLabel('Atalho Para DM')
                                    .setStyle(5)
                            )

                            await channel.send({ embeds: [embed2], components: [row] }).then(msg => {
                                setTimeout(async () => {
                                    try {
                                        await channel.delete()
                                    } catch (error) {

                                    }
                                }, 60000);
                            });


                            member.send({
                                embeds: [embedppppp],
                                components: [row2222]
                            }).then(ppppp => {

                                uud.set(ppppp.id, { message: tbbb.messagepagamento3, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID, date: Date.now() })

                                setTimeout(async () => {
                                    var null2 = null
                                    avaliacao(null2, ppppp.id, ppppp.channel.id, client, user)

                                }, 300000);
                            })


                        })
                    }
                })
            } catch (error) {
                const embed2 = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setDescription(`- Olá <@${user}> seu pedido foi aprovado mas não consegui enviar a mensagem privada, enviarei o produto aqui.`)

                if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
                    embed2.setThumbnail(client.db.General.get(`ConfigGeral.BannerEmbeds`))
                }


                if (finalproduto.length >= 500) {
                    await channela.send({
                        embeds: [embed2], files: [{
                            attachment: fileBuffer2,
                            name: fileName
                        }]
                    })
                } else {
                    await channel.send({ embeds: [embed2] }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await channel.delete()
                            } catch (error) {

                            }
                        }, 60000);
                    });

                    try {
                        await channel.send({ content: finalproduto })
                    } catch (error) {

                    }
                }



                try {
                    await channel.send({
                        embeds: [embedppppp],
                        components: [row2222]
                    }).then(async ppppp => {
                        uud.set(ppppp.id, { message: tbbb.messagepagamento3, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID, date: Date.now() })
                        setTimeout(async () => {
                            var null2 = null
                            avaliacao(null2, ppppp.id, client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`), client, user, GuildServerID)
                        }, 300000);
                    })
                } catch (error) {

                }
            }

            try { if (ppppopopooopo !== '') await channel.send({ content: `${obterEmoji(8)} | Cargos setados:\n${ppppopopooopo}` }); } catch (error) { }


            try {
                let channelusermark = client.db.General.get(`ConfigGeral.ChannelsConfig.feedbacks`)
                if (channelusermark !== null) {
                    let channeluser = await client.channels.fetch(channelusermark)

                    await channeluser.send({ content: `<@${user}>` }).then(async msg => {
                        await msg.delete()
                    }
                    )
                }
            } catch (error) {

            }
        }
    }
}













async function verificarpagamento(client) {

    var type = client.db.Pagamentos.fetchAll()
    for (let i = 0; i < type.length; i++) {
        const PaymentName = type[i].data.ID;
        const PaymentName22 = type[i].ID;
        const typeValue = type[i].data.Type;
        const PaymentId = type[i].data.PaymentId;
        const IdServer = type[i].data.IdServer;
        const IdServer2 = type[i].data.IdServer2;
        const BodyCompra = type[i].data.BodyCompra;
        const canalidd = type[i].data.CanalID;
        const user = type[i].data.user;

        let channel = await client.channels.cache.get(canalidd)
        if (!channel) {
            client.db.Pagamentos.delete(PaymentName22)
            client.db.StatusCompras.set(`${BodyCompra}.Status`, 'Cancelado')
        }

        if (typeValue == 'pix') {
            var res = await axios.get(`https://api.mercadopago.com/v1/payments/${BodyCompra}`, {
                headers: {
                    Authorization: `Bearer ${IdServer}`
                }
            })

            if (res.data.status == 'approved') { // approved ou approved

                let bancosbloqueados = client.db.General.get('ConfigGeral.BankBlock') || []
                if (bancosbloqueados.length !== 0) {
                    const ffaa11 = client.db.Carrinho.get(`${PaymentName22}`)
                    if (bancosbloqueados.includes(res.data.point_of_interaction.transaction_data.bank_info.payer.long_name) == true) {

                        await channel.messages.fetch().then(async (messages) => {
                            try {
                                await channel.bulkDelete(messages)
                            } catch (error) {

                            }

                        })

                        const urlReembolso = `https://api.mercadopago.com/v1/payments/${BodyCompra}/refunds`;
                        const headers = {
                            Authorization: `Bearer ${IdServer}`,
                        };
                        const body = {
                            metadata: {
                                reason: 'Banco Bloqueado!',
                            },
                        };
                        axios.post(urlReembolso, body, { headers })
                            .then(async response => {

                                const embed = new EmbedBuilder()
                                    .setColor('Red')
                                    .setAuthor({ name: `Pedido #${BodyCompra}` })
                                    .setTitle(`Pedido não aprovado`)
                                    .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${res.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\`, seu dinheiro foi reembolsado, tente novamente usando outro banco.`)
                                    .addFields(
                                        { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | ${Number(ffaa11.totalpicecar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`` }
                                    )

                                const embed2 = new EmbedBuilder()
                                    .setColor('Red')
                                    .setAuthor({ name: `Pedido #${BodyCompra}` })
                                    .setTitle(`Anti Banco | Nova Venda`)
                                    .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${res.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\`, o dinheiro do Comprador foi reembolsado, Obrigado por confiar em meu trabalho.`).addFields(
                                        { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | ${Number(ffaa11.totalpicecar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`` }
                                    )

                                try {
                                    const canal2 = await client.channels.fetch(client.db.StatusCompras.get(`${BodyCompra}.canal`));
                                    const msg2 = await canal2.messages.fetch(client.db.StatusCompras.get(`${BodyCompra}.msg`));
                                    msg2.reply({ embeds: [embed2], content: `<@${user}>` })
                                } catch (error) {

                                }

                                const agora = Math.floor(new Date().getTime() / 1000);
                                const novoTimestamp = agora + 60;

                                channel.send({ content: `<@${user}>, Este canal será excluido em <t:${novoTimestamp}:R>`, embeds: [embed] }).then(deletechannel => {
                                    setInterval(async () => {
                                        try {
                                            await channel.delete()
                                        } catch (error) {

                                        }
                                    }, 60000);
                                })


                            })
                            .catch(error => {

                                console.error('Erro ao emitir o reembolso:', error.response.data);
                            });
                        client.db.Pagamentos.delete(PaymentName22)
                        return
                    }
                }
                client.db.StatusCompras.set(`${BodyCompra}.Status`, 'Aprovado')

                const today = new Date();

                client.db.StatusCompras.set(`${BodyCompra}.Data`, today)
                client.db.StatusCompras.set(`${BodyCompra}.IdCompra`, BodyCompra)
                client.db.StatusCompras.set(`${BodyCompra}.Metodo`, 'Pix')

                var t = client.db.Carrinho.get(`${PaymentName22}.produtos`)

                let logmessage5 = ''
                let logmessage6 = ''
                let guild = client.guilds.cache.get(client.db.Carrinho.get(`${PaymentName22}.GuildServerID`))

                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`
                        logmessage6 += `${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\n`
                    }
                }

                if (global.server !== 'aliensales') {
                    if (client.db.General.get('ConfigGeral.Notificar.Wpp.status') == true) {
                        let number = client.db.General.get('ConfigGeral.Notificar.Wpp.numero')
                        let valor = Number(client.db.Carrinho.get(`${PaymentName22}.totalpicecar`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })
                        const today = new Date();
                        let user = await client.users.fetch(client.db.StatusCompras.get(`${BodyCompra}.user`))
                        let datafommarterhoje = today.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                    }
                }
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setColor('Green')
                    .setDescription(`Usuário <@!${client.db.StatusCompras.get(`${BodyCompra}.user`)}> teve seu pedido aprovado`)
                    .setFields(
                        { name: `Detalhes`, value: logmessage5, inline: false },
                        { name: `ID do Pedido`, value: `\`${BodyCompra}\``, inline: false },
                        { name: `Banco`, value: `\`${res.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\``, inline: false }
                    )
                    .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
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
                    const canal = await client.channels.fetch(client.db.StatusCompras.get(`${BodyCompra}.canal`));
                    const msg = await canal.messages.fetch(client.db.StatusCompras.get(`${BodyCompra}.msg`));
                    msglog = await msg.reply({ embeds: [embed], components: [row222] })

                    await client.db.StatusCompras.set(`${BodyCompra}.IDMessageLogs`, msglog.id);
                    await client.db.StatusCompras.set(`${BodyCompra}.IDChannelLogs`, msglog.channel.id);
                    await client.db.StatusCompras.set(`${uu2}.canal`, msglog.channel.id)
                    await client.db.StatusCompras.set(`${uu2}.msg`, msglog.id)
                } catch (error) {



                }

                EntregarProdutos(client)
                client.db.Pagamentos.delete(PaymentName22)

            }
        }




        if (typeValue == `efibank`) {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://promisseapi.squareweb.app/efibank/${BodyCompra}`,
                headers: {
                    'Authorization': 'wj5O7E82dG4t'
                }
            };

            let status
            try { status = await axios.request(config) } catch (error) { }
            if (status?.data?.status == 'approved') {
                const ffaa11 = client.db.Carrinho.get(`${PaymentName22}`)

                const table = [
                    { banco: "Picpay Serviços S.A.", codigos: ["22896431", "09516419"] },
                    { banco: "Nu Pagamentos S.A.", codigos: ["18236120", "32219232"] },
                    { banco: "Banco Inter S.A.", codigos: ["00416968"] },
                    { banco: "Banco do Brasil S.A.", codigos: ["00000000"] },
                    { banco: "Ame Digital Brasil Ltda.", codigos: ["32778350"] },
                    { banco: "Cloud Walk Meios de Pagamentos e Serviços Ltda.", codigos: ["18189547"] },
                    { banco: "Banco Bradesco S.A.", codigos: ["60746948"] },
                    { banco: "Banco Itaucard S.A.", codigos: ["17192451"] },
                    { banco: "PagSeguro Internet S.A.", codigos: ["08561701"] },
                    { banco: "Banco BTG Pactual S.A.", codigos: ["30306294"] }
                ];

                let bancosbloqueados = client.db.General.get('ConfigGeral.BankBlock') || []
                const bancoEncontrado = table.find(banco =>
                    banco.codigos.includes(status.data.bankinfo.gnExtras.pagador.codigoBanco)
                );

                if (bancoEncontrado && bancosbloqueados.includes(bancoEncontrado.banco)) {
                    await channel.messages.fetch().then(async (messages) => {
                        try {
                            await channel.bulkDelete(messages)
                        } catch (error) {

                        }

                    })


                    await ReembolsoEfi(BodyCompra, client)

                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setAuthor({ name: `Pedido #${BodyCompra}` })
                        .setTitle(`Pedido não aprovado`)
                        .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${status.data.bankinfo.gnExtras.pagador.namebank}\`, seu dinheiro foi reembolsado, tente novamente usando outro banco.`)
                        .addFields(
                            { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | ${Number(ffaa11.totalpicecar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`` }
                        )

                    const embed2 = new EmbedBuilder()
                        .setColor('Red')
                        .setAuthor({ name: `Pedido #${BodyCompra}` })
                        .setTitle(`Anti Banco | Nova Venda`)
                        .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${status.data.bankinfo.gnExtras.pagador.namebank}\`, o dinheiro do Comprador foi reembolsado, Obrigado por confiar em meu trabalho.`).addFields(
                            { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | ${Number(ffaa11.totalpicecar).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`` }
                        )

                    try {
                        const canal2 = await client.channels.fetch(client.db.StatusCompras.get(`${BodyCompra}.canal`));
                        const msg2 = await canal2.messages.fetch(client.db.StatusCompras.get(`${BodyCompra}.msg`));
                        msg2.reply({ embeds: [embed2], content: `<@${user}>` })
                    } catch (error) {

                    }

                    const agora = Math.floor(new Date().getTime() / 1000);
                    const novoTimestamp = agora + 60;

                    channel.send({ content: `<@${user}>, Este canal será excluido em <t:${novoTimestamp}:R>`, embeds: [embed] }).then(deletechannel => {
                        setInterval(async () => {
                            try {
                                await channel.delete()
                            } catch (error) {

                            }
                        }, 60000);
                    })
                    client.db.Pagamentos.delete(PaymentName22)
                    return


                }




                client.db.StatusCompras.set(`${BodyCompra}.Status`, 'Aprovado')

                const today = new Date();

                client.db.StatusCompras.set(`${BodyCompra}.Data`, today)
                client.db.StatusCompras.set(`${BodyCompra}.IdCompra`, BodyCompra)
                client.db.StatusCompras.set(`${BodyCompra}.Metodo`, 'EfiBank')

                // APROVAR PIX 
                var t = client.db.Carrinho.get(`${PaymentName22}.produtos`)

                let logmessage5 = ''
                let logmessage6 = ''
                let guild = client.guilds.cache.get(client.db.Carrinho.get(`${PaymentName22}.GuildServerID`))

                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`
                        logmessage6 += `${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\n`
                    }
                }

                if (global.server !== 'aliensales') {
                    if (client.db.General.get('ConfigGeral.Notificar.Wpp.status') == true) {
                        let number = client.db.General.get('ConfigGeral.Notificar.Wpp.numero')
                        let valor = Number(client.db.Carrinho.get(`${PaymentName22}.totalpicecar`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })
                        const today = new Date();
                        let user = await client.users.fetch(client.db.StatusCompras.get(`${BodyCompra}.user`))
                        let datafommarterhoje = today.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                    }
                }

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setColor('Green')
                    .setDescription(`Usuário <@!${client.db.StatusCompras.get(`${BodyCompra}.user`)}> teve seu pedido aprovado`)
                    .setFields(
                        { name: `Detalhes`, value: logmessage5, inline: false },
                        { name: `ID do Pedido`, value: `\`${BodyCompra}\``, inline: false },
                        { name: `Banco`, value: `\`${status.data.bankinfo.gnExtras.pagador.namebank}\``, inline: false },
                        { name: `Nome do Comprador`, value: `\`${status.data.bankinfo.gnExtras.pagador.nome}\` (\`${status.data.bankinfo.gnExtras.pagador.cpf}\` )`, inline: false },
                    )
                    .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
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
                    const canal = await client.channels.fetch(client.db.StatusCompras.get(`${BodyCompra}.canal`));
                    const msg = await canal.messages.fetch(client.db.StatusCompras.get(`${BodyCompra}.msg`));
                    msglog = await msg.reply({ embeds: [embed], components: [row222] })

                    await client.db.StatusCompras.set(`${BodyCompra}.IDMessageLogs`, msglog.id);
                    await client.db.StatusCompras.set(`${BodyCompra}.IDChannelLogs`, msglog.channel.id);
                    await client.db.StatusCompras.set(`${uu2}.canal`, msglog.channel.id)
                    await client.db.StatusCompras.set(`${uu2}.msg`, msglog.id)
                } catch (error) {



                }

                EntregarProdutos(client)
                client.db.Pagamentos.delete(PaymentName22)

            }
        }

        if (typeValue == 'nubank') {
            let valor = Number(type[i].data.price).toFixed(2)
            let date = type[i].data.dateCreated
            let pagamentoscheck = client.db.PagamentoImap.fetchAll()

            let valoresFiltrados = pagamentoscheck.filter(p => {
                return Number(p.data.valor).toFixed(2) == Number(valor).toFixed(2) && p.data.used == false && p.data.data > date
            });
            if (valoresFiltrados.length > 0) {
                client.db.StatusCompras.set(`${BodyCompra}.Status`, 'Aprovado')
                client.db.PagamentoImap.set(`${valoresFiltrados[0].ID}.used`, true)
                client.db.PagamentoImap.set(`${valoresFiltrados[0].ID}.dateUsed`, Date.now())

                const today = new Date();

                client.db.StatusCompras.set(`${BodyCompra}.Data`, today)
                client.db.StatusCompras.set(`${BodyCompra}.IdCompra`, BodyCompra)
                client.db.StatusCompras.set(`${BodyCompra}.Metodo`, 'Nubank')

                var t = client.db.Carrinho.get(`${PaymentName22}.produtos`)

                let logmessage5 = ''
                let logmessage6 = ''
                let guild = client.guilds.cache.get(client.db.Carrinho.get(`${PaymentName22}.GuildServerID`))

                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        const valor2 = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor2).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`
                        logmessage6 += `${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor2).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\n`
                    }
                }

                if (global.server !== 'aliensales') {
                    if (client.db.General.get('ConfigGeral.Notificar.Wpp.status') == true) {
                        let number = client.db.General.get('ConfigGeral.Notificar.Wpp.numero')
                        let valor2 = Number(client.db.Carrinho.get(`${PaymentName22}.totalpicecar`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })
                        const today = new Date();
                        let datafommarterhoje = today.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                    }
                }


                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setColor('Green')
                    .setDescription(`Usuário <@!${client.db.StatusCompras.get(`${BodyCompra}.user`)}> teve seu pedido aprovado`)
                    .setFields(
                        { name: `Detalhes`, value: logmessage5, inline: false },
                        { name: `ID do Pedido`, value: `\`${BodyCompra}\``, inline: false },
                        { name: `Nome do Comprador`, value: `\`${valoresFiltrados[0].data.nome}\``, inline: false },
                    )
                    .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
                    .setTimestamp()

                const row222 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ReembolsarCompra')
                            .setLabel('Reembolsar')
                            .setEmoji('1243421135673229362')
                            .setStyle(2)
                            .setDisabled(true)
                    );

                let msglog
                try {
                    const canal = await client.channels.fetch(client.db.StatusCompras.get(`${BodyCompra}.canal`));
                    const msg = await canal.messages.fetch(client.db.StatusCompras.get(`${BodyCompra}.msg`));
                    msglog = await msg.reply({ embeds: [embed], components: [row222] })

                    await client.db.StatusCompras.set(`${BodyCompra}.IDMessageLogs`, msglog.id);
                    await client.db.StatusCompras.set(`${BodyCompra}.IDChannelLogs`, msglog.channel.id);
                    await client.db.StatusCompras.set(`${uu2}.canal`, msglog.channel.id)
                    await client.db.StatusCompras.set(`${uu2}.msg`, msglog.id)
                } catch (error) {



                }

                EntregarProdutos(client)
                client.db.Pagamentos.delete(PaymentName22)


            }
        }

    }
}


async function avaliacao(interaction, pp, canalId, client, user) {
    var tttttt = await uud.get(pp)
    var avaliar22
    try {
        avaliar22 = interaction.fields.getTextInputValue('avaliar');
    } catch (error) {
        avaliar22 = null
    }

    const canal = client.channels.cache.get(canalId)
    try {


        await canal.messages.fetch(pp)
            .then(async (mensagem) => {

                await mensagem.edit({ content: `${obterEmoji(8)} | Obrigado por avaliar!`, embeds: [], components: [] }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) {
                        }
                    }, 2000);
                })
            })
    } catch (error) {
        return
    }
    function transformarEmEstrelas(numero) {
        return '\u2B50'.repeat(numero);
    }
    const member = await client.guilds.cache.get(tttttt.guildid).members.fetch(user);

    var mensagemfinal

    var result = null



    if (tttttt.resultado !== null) {
        result = tttttt.resultado
    }



    if (result == null) {
        mensagemfinal = `\`Nenhuma Avaliação\``
    } else {
        mensagemfinal = `${transformarEmEstrelas(result)} (${result})`

        if (avaliar22 !== ``) {
            mensagemfinal = `${transformarEmEstrelas(result)} | \`${avaliar22}\``
        } else {
            mensagemfinal = `${transformarEmEstrelas(result)} | \`Nenhum Comentário Adicional.\``
        }
    }

    let guild = client.guilds.cache.get(tttttt.guildid)

    let datacompleta
    datacompleta = new Date(tttttt.date).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    const embedppppp = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: `Compra aprovada!`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
        .setFields(
            { name: `${global.emoji.usuario2} | Comprador`, value: `<@!${member.id}> - \`${member.id}\`` },
            { name: `${global.emoji.calendarioooo} | Data da Compra`, value: `\`${datacompleta}\`` },
            { name: `${global.emoji.carrinhobranco} | Produtos Comprados`, value: `${tttttt.message}` },
            { name: `${global.emoji.giveaway} | Desconto`, value: `\`${tttttt.valordodesconto == null ? `Nenhum Cupom de desconto foi utilizado.` : `${Number(tttttt.valordodesconto).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`}\`` },
            { name: `${global.emoji.dinheiro2} | Valor Total do Carrinho`, value: `\`${Number(tttttt.valorpago).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`` },
        )
        .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
        .setTimestamp()


    embedppppp.addFields({ name: `Feedback da compra`, value: `${mensagemfinal == `\`Nenhuma Avaliação\`` ? `\`Nenhuma Avaliação Enviada.\`` : mensagemfinal}` })


    if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
        embedppppp.setImage(client.db.General.get(`ConfigGeral.BannerEmbeds`))
    }


    try {
        const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`))
        channel.send({ embeds: [embedppppp] })
    } catch (error) {

    }

}


module.exports = {
    EntregarProdutos,
    verificarpagamento,
    avaliacao
};