const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ComponentType, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, UserSelectMenuBuilder, MessageType, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const { avaliacao } = require("../../FunctionsAll/ChackoutPagamentoNovo");
const db = new QuickDB();
var uud = db.table('avaliarrrrr')
const axios = require('axios');
const { UpdateCashBack, ConfigCashBack, configchannels, ButtonDuvidasPainel, SaldoInvitePainel, BlackListPainel, configmoderacao, definicoes, mensagemautogeral, configprodutosrespotar, adicionarprodutosrepostar, removerprodutosrepostar, blockbank, unlockbank, ConfigMP, UpdatePagamento, PainelVendas } = require("../../FunctionsAll/BotConfig");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const { AdicionarSaldo, getqrcode, CopiaECola } = require("../../FunctionsAll/Saldo");
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { atualizarmessageprodutosone, alterarestoqueproduto } = require("../../FunctionsAll/Createproduto");
const { SendAllMgs, SelectProduct } = require("../../FunctionsAll/SendAllMgs");
const { criadoscupons, produtoscriados, criadoskeys, criadossemstock, criadosgifts, criadosdrop, CriadosStart } = require("../../FunctionsAll/Criados");
const { TipoMensagem } = require("../../FunctionsAll/anunciar");
const Estatisticas = require("../../FunctionsAll/estatisticas");
const { ReembolsoEfi } = require("../../FunctionsAll/Payments/EfíBank");
const { SectionUser } = require("../../FunctionsAll/Sections");
const { PageGiveaway } = require("../../FunctionsAll/Sorteios/Pages");
var uu = db.table('permissionsmessage')
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId.startsWith('Sorteio_')) {
                const action = interaction.customId.split('_')[1]
                if (action == 'Nome') {
                    const name = interaction.fields.getTextInputValue('name')
                    client.db.Giveaways.set(`Giveaway.temp.${interaction.user.id}.name`, name)
                    await PageGiveaway(client, interaction, 1)
                } else if (action == 'Desc') {
                    const desc = interaction.fields.getTextInputValue('desc')
                    client.db.Giveaways.set(`Giveaway.temp.${interaction.user.id}.desc`, desc)
                    await PageGiveaway(client, interaction, 1)
                } else if (action == 'Imagem') {
                    const image = interaction.fields.getTextInputValue('image')
                    if (image == '') {
                        client.db.Giveaways.delete(`Giveaway.temp.${interaction.user.id}.image`)
                    } else {

                        // verifique se a imagem é válida
                        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                        if (!url.test(image)) return interaction.reply({ content: `${global.emoji.errado} Você inseriu uma imagem incorreta.`, ephemeral: true })
                        client.db.Giveaways.set(`Giveaway.temp.${interaction.user.id}.image`, image)
                    }

                    await PageGiveaway(client, interaction, 1)
                } else if (action == 'Thumb') {
                    const thumb = interaction.fields.getTextInputValue('thumb')
                    if (thumb == '') {
                        client.db.Giveaways.delete(`Giveaway.temp.${interaction.user.id}.thumb`)
                    } else {

                        // verifique se a imagem é válida
                        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                        if (!url.test(thumb)) return interaction.reply({ content: `${global.emoji.errado} Você inseriu uma imagem incorreta.`, ephemeral: true })
                        client.db.Giveaways.set(`Giveaway.temp.${interaction.user.id}.thumb`, thumb)
                    }
                    await PageGiveaway(client, interaction, 1)
                } else if (action == 'Cor') {
                    let cor = interaction.fields.getTextInputValue('cor')
                    if (cor == '') {
                        client.db.Giveaways.set(`Giveaway.temp.${interaction.user.id}.cor`, '#29a6fe')
                    } else {

                        // verifique se a cor é válida se tem # e se a hexadecimal é válida
                        const url = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
                        if (!url.test(cor)) return interaction.reply({ content: `${global.emoji.errado} Você inseriu uma cor incorreta.`, ephemeral: true })
                        cor = cor.replace('#', '0x')
                        client.db.Giveaways.set(`Giveaway.temp.${interaction.user.id}.cor`, cor)
                    }
                    await PageGiveaway(client, interaction, 1)
                }
            }
        }



        if (interaction.isButton()) {

            if (interaction.customId.startsWith('Sorteio_')) {
                const action = interaction.customId.split('_')[1]
                if (action == 'Nome') {
                    const modal = new ModalBuilder()
                        .setCustomId('Sorteio_Nome')
                        .setTitle('Configuração do Sorteio')

                    const input = new TextInputBuilder()
                        .setCustomId('name')
                        .setLabel('Nome do Sorteio')
                        .setStyle(TextInputStyle.Short)
                        .setValue(client.db.Giveaways.get(`Giveaway.temp.${interaction.user.id}.name`) || '')
                        .setRequired(true)

                    const row = new ActionRowBuilder().addComponents(input)
                    modal.addComponents(row)
                    await interaction.showModal(modal)
                } else if (action == 'Desc') {
                    const modal = new ModalBuilder()
                        .setCustomId('Sorteio_Desc')
                        .setTitle('Configuração do Sorteio')

                    const input = new TextInputBuilder()
                        .setCustomId('desc')
                        .setLabel('Descrição do Sorteio')
                        .setStyle(TextInputStyle.Paragraph)
                        .setValue(client.db.Giveaways.get(`Giveaway.temp.${interaction.user.id}.desc`) || '')
                        .setRequired(true)

                    const row = new ActionRowBuilder().addComponents(input)
                    modal.addComponents(row)
                    await interaction.showModal(modal)
                } else if (action == 'Imagem') {
                    const modal = new ModalBuilder()
                        .setCustomId('Sorteio_Imagem')
                        .setTitle('Configuração do Sorteio')

                    const input = new TextInputBuilder()
                        .setCustomId('image')
                        .setLabel('Imagem do Sorteio')
                        .setStyle(TextInputStyle.Short)
                        .setValue(client.db.Giveaways.get(`Giveaway.temp.${interaction.user.id}.image`) || '')
                        .setRequired(false)

                    const row = new ActionRowBuilder().addComponents(input)
                    modal.addComponents(row)
                    await interaction.showModal(modal)
                } else if (action == 'Thumb') {
                    const modal = new ModalBuilder()
                        .setCustomId('Sorteio_Thumb')
                        .setTitle('Configuração do Sorteio')

                    const input = new TextInputBuilder()
                        .setCustomId('thumb')
                        .setLabel('Thumbnail do Sorteio')
                        .setStyle(TextInputStyle.Short)
                        .setValue(client.db.Giveaways.get(`Giveaway.temp.${interaction.user.id}.thumb`) || '')
                        .setRequired(false)

                    const row = new ActionRowBuilder().addComponents(input)
                    modal.addComponents(row)
                    await interaction.showModal(modal)
                } else if (action == 'Cor') {
                    const modal = new ModalBuilder()
                        .setCustomId('Sorteio_Cor')
                        .setTitle('Configuração do Sorteio')

                    const input = new TextInputBuilder()
                        .setCustomId('cor')
                        .setLabel('Cor do Sorteio')
                        .setStyle(TextInputStyle.Short)
                        .setValue(client.db.Giveaways.get(`Giveaway.temp.${interaction.user.id}.cor`) || '')
                        .setRequired(false)

                    const row = new ActionRowBuilder().addComponents(input)
                    modal.addComponents(row)
                    await interaction.showModal(modal)
                }


                if (action == 'PageGeral') {
                    await PageGiveaway(client, interaction, 2)
                } else if (action == 'PageAparencia') {
                    await PageGiveaway(client, interaction, 1)
                }

            }

            if (interaction.customId == 'voltarCriadosRestart') {
                CriadosStart(interaction, client)
            }

            if (interaction.customId.startsWith('criadosproduto')) {
                produtoscriados(interaction, client)
            }
            if (interaction.customId.startsWith('criadoscupons')) {

                criadoscupons(interaction, client)
            }
            if (interaction.customId.startsWith('criadoskeys')) {

                criadoskeys(interaction, client)
            }
            if (interaction.customId.startsWith('criadossemstock')) {

                criadossemstock(interaction, client)
            }
            if (interaction.customId.startsWith('criadosgifts')) {

                criadosgifts(interaction, client)
            }
            if (interaction.customId.startsWith('criadosdrop')) {

                criadosdrop(interaction, client)
            }
        }


        if (interaction.isButton()) {
            if (interaction.customId.startsWith('deletemessageal')) {
                interaction.update({ embeds: [], components: [], content: `${obterEmoji(7)} | Pagamento Cancelado` })
            }
            if (interaction.customId.startsWith('qrcodesaldo')) {
                getqrcode(interaction, interaction.user.id)
            }
            if (interaction.customId.startsWith('pixcopiaecolasaldo')) {
                CopiaECola(interaction, interaction.user.id)
            }
        }



        if (interaction.isStringSelectMenu()) {
            if (interaction.customId == 'blockbank') {
                let bancos = interaction.values

                await client.db.General.set(`ConfigGeral.BankBlock`, bancos)
                await blockbank(interaction, interaction.user.id, client)
                interaction.followUp({ content: `${global.emoji.certo} Configurações de bloqueios de banco atualizada!`, ephemeral: true })
            }
        }
        if (interaction.isButton()) {
            if (interaction.customId == 'blockbank') {
                blockbank(interaction, interaction.user.id, client)
            }
        }
        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'modal2212121212121') {
                const qtd = interaction.fields.getTextInputValue('desccc');

                if (!isNaN(qtd)) {
                    AdicionarSaldo(interaction, client, interaction.user.id, qtd)
                } else {
                    interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Você adicionou um *VALOR* inválido para ser gerado um pagamento!` })
                }

            }
            if (interaction.customId === 'confirm-reembolso') {

                const qtd = interaction.fields.getTextInputValue('yesorno');

                if (qtd !== 'SIM') return interaction.reply({ content: `Resposta incorreta, reembolso cancelado.`, ephemeral: true })

                var status = client.db.StatusCompras.fetchAll()
                for (let i = 0; i < status.length; i++) {
                    const id = status[i].data.IDMessageLogs
                    const IdCompra2 = status[i].data.IdCompra
                    const IdCompra = status[i].data.IdPreference
                    const Metodo = status[i].data.Metodo
                    const valortotal = status[i].data.valortotal
                    const user = status[i].data.user
                    const editsql = status[i].ID



                    if (id == interaction.message.id) {

                        if (Metodo == 'Site') {
                            await realizarReembolso(IdCompra, interaction, id, editsql, IdCompra2, valortotal)
                            client.db.estatisticasgeral.set(`${editsql}.Status`, `Reembolsado`)
                            const fetchedMessage = await interaction.channel.messages.fetch(id);
                            if (fetchedMessage) {
                                fetchedMessage.edit({ content: `\n${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: ${Number(valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`, components: [] });
                            }
                        } else if (Metodo == 'Saldo') {
                            interaction.reply({ content: `${obterEmoji(10)} | Reembolsando`, ephemeral: true })
                            client.db.estatisticasgeral.set(`${editsql}.Status`, `Reembolsado`)
                            setTimeout(async () => {

                                const fetchedMessage = await interaction.channel.messages.fetch(id);
                                if (fetchedMessage) {
                                    fetchedMessage.edit({
                                        content: `${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: ${Number(valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`, components: []
                                    });
                                }

                                interaction.editReply({
                                    content: `${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: ${Number(valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}
                                        `, ephemeral: true
                                });


                                client.db.StatusCompras.set(`${editsql}.Status`, 'Reembolsado')
                                if (client.db.PagamentosSaldos.get(`${user}.SaldoAccount`) == null) {
                                    client.db.PagamentosSaldos.set(`${user}.SaldoAccount`, Number(valortotal))
                                } else {
                                    client.db.PagamentosSaldos.set(`${user}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${user}.SaldoAccount`)) + Number(valortotal))
                                }


                            }, 3000);
                        } else if (Metodo == 'Pix') {
                            client.db.estatisticasgeral.set(`${editsql}.Status`, `Reembolsado`)
                            interaction.reply({ content: `${obterEmoji(10)} | Reembolsando`, ephemeral: true })
                            const urlReembolso = `https://api.mercadopago.com/v1/payments/${IdCompra2}/refunds`;
                            const headers = {
                                Authorization: `Bearer ${client.db.General.get(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`)}`,
                            };
                            const body = {
                                metadata: {
                                    reason: 'Motivo do reembolso',
                                },
                            };
                            axios.post(urlReembolso, body, { headers })
                                .then(async response => {
                                    const fetchedMessage = await interaction.channel.messages.fetch(id);
                                    if (fetchedMessage) {
                                        fetchedMessage.edit({
                                            content: `👮‍♀️ Reembolso Feito Por: ${interaction.user}\n${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: ${Number(valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}
                                        `, components: []
                                        });



                                        interaction.editReply({
                                            content: `${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: ${Number(valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}
                                        `, ephemeral: true
                                        });
                                        client.db.StatusCompras.set(`${editsql}.Status`, 'Reembolsado')
                                    }
                                })
                                .catch(error => {
                                    console.error('Erro ao emitir o reembolso:', error.response.data);
                                });
                        } else if (Metodo == `EfiBank`) {
                            await interaction.reply({ content: `${client.db.General.get('emojis.loading_promisse')} | Reembolsando...`, ephemeral: true })
                            await ReembolsoEfi(IdCompra2, client)

                            interaction.editReply({ content: `${global.emoji.certo} Reembolso aprovado`, ephemeral: true })

                            const fetchedMessage = await interaction.channel.messages.fetch(id);
                            if (fetchedMessage) {
                                fetchedMessage.edit({
                                    content: `👮‍♀️ Reembolso Feito Por: ${interaction.user}\n${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: ${Number(valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}
                                `, components: []
                                });
                                client.db.StatusCompras.set(`${editsql}.Status`, 'Reembolsado')
                            }
                        }
                    }
                }

            }



            if (interaction.customId === 'sugestaoprodutos') {

                const title = interaction.fields.getTextInputValue('1');
                const desc = interaction.fields.getTextInputValue('2');
                const image = interaction.fields.getTextInputValue('3');

                if (image !== '') {
                    const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                    if (!url.test(image)) return interaction.reply({ content: `${global.emoji.errado} Você inseriu uma imagem incorreta.`, ephemeral: true })
                }

                const channela = interaction.guild.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`));

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTitle(title)
                    .setColor("Random")
                    .setDescription(`\`\`\`${desc}\`\`\``)

                if (image !== '') {
                    embed.setImage(image)
                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("sugerir+1")
                            .setLabel('・ 1 - (50%)')
                            .setEmoji(`1155221222490112032`)
                            .setStyle(3)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("sugerir-1")
                            .setLabel('・ 1 - (50%)')
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("moderacaosugerir")
                            .setEmoji(`1155225179262287995`)
                            .setStyle(2)
                            .setDisabled(false),
                    )


                try {
                    await channela.send({ embeds: [embed], content: `${interaction.user}`, components: [row] }).then(async msg => {
                        const thread = await msg.startThread({
                            name: `Debater Sugestão - ${title}`,
                        });

                        if (image !== '') {
                            client.db.sugerir.set(msg.id, { aprova: [], reprova: [], title: title, desc: desc, image: image })
                        } else {
                            client.db.sugerir.set(msg.id, { aprova: [], reprova: [], title: title, desc: desc, image: null })
                        }
                    })
                    interaction.reply({ content: `${global.emoji.certo} Obrigado por sugerir`, ephemeral: true })
                } catch (error) {
                    interaction.reply({ content: `${global.emoji.errado} Canal de sugestão invalido!`, ephemeral: true })
                    return
                }


            }
        }

        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId == 'canalderedirecionamernto') {

                var TTTT = interaction.guild.channels.cache.get(interaction.values[0]);

                client.db.General.set(`ConfigGeral.channelredirectduvidas`, TTTT.url)

                ButtonDuvidasPainel(interaction, client)
            }
        }

        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'newnamebutton') {
                const name = interaction.fields.getTextInputValue('1');
                client.db.General.set(`ConfigGeral.textoduvidas`, name)
                ButtonDuvidasPainel(interaction, client)
            }
            if (interaction.customId === 'RemoverNaBlacklist') {
                const name = interaction.fields.getTextInputValue('1');

                if (!isNaN(name - 1)) {
                    const ashdhasdhsahd = client.db.blacklist.get(`BlackList.users`)
                    if (ashdhasdhsahd.length < name - 1) {
                        await BlackListPainel(interaction, client)
                        interaction.followUp({ content: `${global.emoji.errado} Você adicionou um ID incorreto para ser removido!`, ephemeral: true })
                        return
                    }
                    client.db.blacklist.pull(`BlackList.users`, (element, index, array) => index == name - 1)

                    await BlackListPainel(interaction, client)
                    interaction.followUp({ content: `${global.emoji.certo} Configurações de blacklist alteradas com sucesso!`, ephemeral: true })
                } else {
                    await BlackListPainel(interaction, client)
                    interaction.followUp({ content: `${global.emoji.errado} Você adicionou um ID incorreto para ser removido!`, ephemeral: true })
                }
            }
        }


        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId == 'roleexpecificoconvite') {

                client.db.General.set(`ConfigGeral.Convites.Cargo`, interaction.values[0])

                SaldoInvitePainel(interaction, client)
            }
        }

        if (interaction.isUserSelectMenu()) {
            if (interaction.customId == 'usersadd') {

                const ddddddddda = interaction.values
                const pp = client.db.blacklist.get(`BlackList.users`)

                for (let index = 0; index < ddddddddda.length; index++) {
                    const element = ddddddddda[index];

                    if (pp.includes(element) !== true) {
                        client.db.blacklist.push(`BlackList.users`, element)
                    }
                }

                await BlackListPainel(interaction, client)
                interaction.followUp({ content: `${global.emoji.certo} Configurações de blacklist alteradas com sucesso!`, ephemeral: true })


            }
        }


        if (interaction.isButton()) {


            if (interaction.customId == 'todayyyy' || interaction.customId == '7daysss' || interaction.customId == '30dayss' || interaction.customId == 'totalrendimento') {


                var rendimento = 0
                var pedidos = 0
                var produtos22 = 0

                if (interaction.customId == 'todayyyy') {
                    rendimento = Estatisticas(client, 1).intervalo.valorTotal
                    pedidos = Estatisticas(client, 1).intervalo.quantidadePedidos
                    produtos22 = Estatisticas(client, 1).intervalo.totalProdutos
                } else if (interaction.customId == '7daysss') {
                    rendimento = Estatisticas(client, 7).intervalo.valorTotal
                    pedidos = Estatisticas(client, 7).intervalo.quantidadePedidos
                    produtos22 = Estatisticas(client, 7).intervalo.totalProdutos
                } else if (interaction.customId == '30dayss') {
                    rendimento = Estatisticas(client, 30).intervalo.valorTotal
                    pedidos = Estatisticas(client, 30).intervalo.quantidadePedidos
                    produtos22 = Estatisticas(client, 30).intervalo.totalProdutos
                } else if (interaction.customId == 'totalrendimento') {
                    rendimento = Estatisticas(client, 0).total.valorTotal
                    pedidos = Estatisticas(client, 0).total.quantidadePedidos
                    produtos22 = Estatisticas(client, 0).total.totalProdutos
                }

                let diasemnumeros = 0

                if (interaction.customId == 'todayyyy') {
                    diasemnumeros = 1
                } else if (interaction.customId == '7daysss') {
                    diasemnumeros = 7
                } else if (interaction.customId == '30dayss') {
                    diasemnumeros = 30
                } else if (interaction.customId == 'totalrendimento') {
                    diasemnumeros = 0
                }

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .addFields(
                        { name: `**Rendimento**`, value: `\`${Number(rendimento).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``, inline: true },
                        { name: `**Pedidos aprovados**`, value: `\`${pedidos}\``, inline: true },
                        { name: `**Produtos entregues**`, value: `\`${produtos22}\``, inline: true },
                    )
                    .setAuthor({ name: `Estatisticas de vendas dos ultimos ${diasemnumeros == 0 ? `anos` : `${diasemnumeros} dias`}`, iconURL: `https://cdn.discordapp.com/emojis/1262947958727639091.webp?size=96&quality=lossless` })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })

                interaction.update({ embeds: [embed], content: `` })
            }
            if (interaction.customId == 'configmoderacao') {
                configmoderacao(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'mensagemautogeral') {
                mensagemautogeral(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'returnmensagemautogeral') {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                mensagemautogeral(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'reenviarmensagens') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()

                let quantidade

                if (!client.db.General.get(`ConfigGeral.produtosrespostar`)) {
                    quantidade = 0
                } else {
                    quantidade = client.db.General.get(`ConfigGeral.produtosrespostar`).length
                }

                const botao = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('reenviartodasmensagens')
                        .setLabel('Reenviar Todas Mensagens')
                        .setStyle(2),
                    new ButtonBuilder()
                        .setCustomId('reenviarmensagensselecionadas')
                        .setLabel(`Reenviar Mensagens Selecionadas (${quantidade})`)
                        .setDisabled(quantidade == 0 ? true : false)
                        .setStyle(2),
                )

                interaction.reply({ content: `Selecione o tipo das mensagens que serão repostadas.`, components: [botao], ephemeral: true })
            }
            if (interaction.customId == 'reenviartodasmensagens') {
                await interaction.update({ content: `🔄️ | Iniciando o processo de repostagem...`, components: [], ephemeral: true })
                await SendAllMgs(client, 'manual')
                interaction.editReply({ content: `${global.emoji.certo} Todas mensagens estão foram repostada!`, components: [], ephemeral: true })
            }
            if (interaction.customId == 'reenviarmensagensselecionadas') {
                await interaction.update({ content: `🔄️ | Iniciando o processo de repostagem...`, components: [], ephemeral: true })
                await SelectProduct(client, 'manual')
                interaction.editReply({ content: `${global.emoji.certo} Todas mensagens estão foram repostada!`, components: [], ephemeral: true })
            }
            if (interaction.customId == 'ativarrepostagem') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()

                if (client.db.General.get(`ConfigGeral.repostagemautomatica.status`) == true) {
                    await client.db.General.set(`ConfigGeral.repostagemautomatica.status`, false)
                } else {
                    await client.db.General.set(`ConfigGeral.repostagemautomatica.status`, true)
                }


                mensagemautogeral(interaction, interaction.user.id, client)
                interaction.deferUpdate()
            }
            if (interaction.customId == 'RemoverNaBlacklist') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('RemoverNaBlacklist')
                    .setTitle(`💡 | Remoção BlackList`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('1')
                    .setLabel("ID da Black-list")
                    .setPlaceholder("Exemplo: 1")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }





            if (interaction.customId == 'ResetarConvites') {

                client.db.General.delete('ConfigGeral.Convites')
                await SaldoInvitePainel(interaction, client)
                interaction.followUp({ content: `${global.emoji.certo} Configurações de convites resetadas!`, ephemeral: true })
            }


            if (interaction.customId == 'SaldoporInvite') {

                interaction.update({ embeds: [], content: `💡 | Qual valor ele vai ganhar por cada convite?`, components: [] })

                    .then(msg => {
                        const collectorFilter = response => {
                            return response.author.id === interaction.user.id;
                        };
                        interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 300000, errors: ['time'] })
                            .then(async collected => {
                                const receivedMessage = collected.first();
                                receivedMessage.delete()

                                if (!isNaN(receivedMessage.content)) {

                                    client.db.General.set('ConfigGeral.Convites.QuantoVaiGanharPorInvites', receivedMessage.content)
                                    await SaldoInvitePainel(interaction, client, 1)
                                } else {

                                    await SaldoInvitePainel(interaction, client, 1)
                                    interaction.followUp({ content: `${global.emoji.errado} Você adicionou um VALOR inválido`, ephemeral: true })
                                }


                            })
                    })


            }
            if (interaction.customId == 'QuantosInvitesParaGanharSaldo') {

                interaction.update({ embeds: [], components: [], content: `💡 | Quantos convites ele vai precisar para resgatar o saldo?` })

                    .then(msg => {
                        const collectorFilter = response => {
                            return response.author.id === interaction.user.id;
                        };
                        interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 300000, errors: ['time'] })
                            .then(async collected => {
                                const receivedMessage = collected.first();
                                receivedMessage.delete()

                                if (!isNaN(receivedMessage.content)) {

                                    client.db.General.set('ConfigGeral.Convites.qtdinvitesresgatarsaldo', receivedMessage.content)
                                    await SaldoInvitePainel(interaction, client, 1)
                                } else {

                                    await SaldoInvitePainel(interaction, client, 1)
                                    interaction.followUp({ content: `${global.emoji.errado} Você adicionou um VALOR inválido`, ephemeral: true })
                                }


                            })
                    })


            }
            if (interaction.customId == 'AdicionarNaBlacklist') {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId('usersadd')
                            .setPlaceholder('Selecione qual membro deseja adicionar na Black-List.')
                            .setMaxValues(25)
                    )

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("awdawdawdwadwd34343")
                            .setLabel('Voltar')
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false),
                    )

                interaction.update({ components: [select, row2] })

            }

            if (interaction.customId == 'awdawdawdwadwd34343') {
                BlackListPainel(interaction, client)

            }

            if (interaction.customId == 'BlackListPainel') {
                BlackListPainel(interaction, client)

            }
            if (interaction.customId == 'configdefinicoes') {

                definicoes(interaction, client)

            }


            if (interaction.customId == 'StatusConvites') {
                var d = client.db.General.get('ConfigGeral.Convites.Status')
                if (d == null) {
                    client.db.General.set('ConfigGeral.Convites.Status', true)
                } else {
                    client.db.General.set('ConfigGeral.Convites.Status', !client.db.General.get('ConfigGeral.Convites.Status'))
                }

                SaldoInvitePainel(interaction, client)
            }

            if (interaction.customId == 'awdkhawbdhaddwadwaouydwd') {
                SaldoInvitePainel(interaction, client)
            }

            if (interaction.customId == 'CargoExpecificoConvite') {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('roleexpecificoconvite')
                            .setPlaceholder('Selecione abaixo qual será o CARGO que terá Permissão.')
                            .setMaxValues(1)
                    )

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("awdkhawbdhaddwadwaouydwd")
                            .setLabel('Voltar')
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false),
                    )

                interaction.update({ components: [select, row2] })
            }




            if (interaction.customId == 'SaldoInvitePainel') {
                SaldoInvitePainel(interaction, client)
            }




            if (interaction.customId == 'changetextoduvidas') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('newnamebutton')
                    .setTitle(`💡 | Novo Titulo`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('1')
                    .setLabel("Novo Nome do Button")
                    .setPlaceholder("Dê um título para o button.")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);


            }


            if (interaction.customId == 'changeemojiduvidas') {

                await interaction.deferUpdate();
                const emojiPrompt = await interaction.channel.send({
                    content: `- Reaja com a reação que você deseja que seja usada no botao de duvidas nesta mensagem que eu acabei de de enviar! Ou seja, é para reagir na mensagem que você está lendo neste exato momento.`
                });

                const filter = (reaction, user) => {
                    return user.id === interaction.user.id;
                };

                emojiPrompt.awaitReactions({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async collected => {
                        // delete a mensagem de prompt
                        await emojiPrompt.delete();
                        const reaction = collected.first();

                        const emoji = reaction.emoji;
                        const isCustom = emoji.id !== null;
                        const emojiStr = isCustom ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` : emoji.name;




                        client.db.General.set(`ConfigGeral.emojiduvidas`, emojiStr);

                        await ButtonDuvidasPainel(interaction, client, 1, interaction.message);
                    })
                    .catch(async () => {
                        await emojiPrompt.delete();
                        interaction.followUp({ content: `- Tempo esgotado para reagir com um emoji.`, ephemeral: true });
                    });
            }



            if (interaction.customId == 'changechannelredirecionamento') {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('canalderedirecionamernto')
                            .setPlaceholder('Selecione abaixo qual será o CANAL de Redirecionamento.')
                            .setMaxValues(1)
                            .addChannelTypes(ChannelType.GuildText)
                    )

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("awdkhawbdhwaouydwd")
                            .setLabel('Voltar')
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false),
                    )



                interaction.update({
                    components: [
                        select,
                        row2
                    ], embeds: [],
                })
            }


            if (interaction.customId == 'ButtonDuvidasPainel') {
                ButtonDuvidasPainel(interaction, client)
            }

            if (interaction.customId == 'awdkhawbdhwaouydwd') {
                ButtonDuvidasPainel(interaction, client)
            }



            if (interaction.customId == 'StatusDuvidas') {

                var d = client.db.General.get(`ConfigGeral.statusduvidas`)
                if (d == null) {
                    client.db.General.set(`ConfigGeral.statusduvidas`, false)
                } else {
                    client.db.General.set(`ConfigGeral.statusduvidas`, !client.db.General.get(`ConfigGeral.statusduvidas`))
                }

                ButtonDuvidasPainel(interaction, client)
            }



            if (interaction.customId == 'desativarlogcarrinhos') {
                var d = client.db.General.get(`ConfigGeral.statuslogcompras`)
                if (d == null) {
                    client.db.General.set(`ConfigGeral.statuslogcompras`, false)
                } else {
                    client.db.General.set(`ConfigGeral.statuslogcompras`, !client.db.General.get(`ConfigGeral.statuslogcompras`))
                }

                configchannels(interaction, interaction.user.id, client)

            }

            if (interaction.customId == 'EditEstiloMensagem') {
                let dd = client.db.General.get(`ConfigGeral.EstiloMensagens`)
                let aaa

                if (dd == null) aaa = true
                if (dd == true) aaa = false
                if (dd == false) aaa = true

                client.db.General.set(`ConfigGeral.EstiloMensagens`, aaa)
                PainelVendas(interaction, client)

                let allProdutos = client.db.produtos.fetchAll()
                var kkkkkkk = client.db.PainelVendas.fetchAll()
                for (let index = 0; index < kkkkkkk.length; index++) {
                    atualizarmensagempainel(interaction.guild.id, kkkkkkk[index].ID, client)
                }
                for (let index = 0; index < allProdutos.length; index++) {
                    atualizarmessageprodutosone(null, client, allProdutos[index].ID)
                }
            }








            if (interaction.customId == 'addsaldo') {
                let modal = new ModalBuilder()
                    .setCustomId('modal2212121212121')
                    .setTitle('✏️ | Quantidade de Saldo');

                let desc = new TextInputBuilder()
                    .setCustomId('desccc')
                    .setLabel("Quanto de saldo você deseja adicionar?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const desc2 = new ActionRowBuilder().addComponents(desc);

                modal.addComponents(desc2);

                await interaction.showModal(modal);
            }



            if (interaction.customId.startsWith('moderacaosugerir')) {

                var u = client.db.sugerir.get(interaction.message.id)
                var userconfirm = ''
                var userreprova = ''
                for (let index = 0; index < u.aprova.length; index++) {
                    const element = u.aprova[index];
                    userconfirm += `<@${element}> - \`${element}\`\n`
                }
                for (let index = 0; index < u.reprova.length; index++) {
                    const element = u.reprova[index];
                    userreprova += `<@${element}> - \`${element}\`\n`
                }

                const embed = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Detalhes Sugestão`)
                    .setColor("Random")
                    .setDescription(`Usuários que aprovam (**${client.db.sugerir.get(`${interaction.message.id}.aprova`).length}**):\n\n${userconfirm == '' ? `Nenhum usuário votou` : userconfirm}\nUsuários que reprovam (**${client.db.sugerir.get(`${interaction.message.id}.reprova`).length}**):\n\n${userreprova == '' ? `Nenhum usuário votou` : userreprova}`)


                interaction.reply({ embeds: [embed], ephemeral: true })
            }

            if (interaction.customId.startsWith('sugerir-1')) {
                var u = client.db.sugerir.get(interaction.message.id)

                if (u.reprova.includes(interaction.user.id)) {
                    if (u.aprova.includes(interaction.user.id)) {
                        client.db.sugerir.pull(`${interaction.message.id}.aprova`, (element, index, array) => element == interaction.user.id)
                    }
                    client.db.sugerir.pull(`${interaction.message.id}.reprova`, (element, index, array) => element == interaction.user.id)
                    interaction.reply({ content: `${global.emoji.certo} Voto Retirado!`, ephemeral: true })

                    const Valor1 = client.db.sugerir.get(`${interaction.message.id}.aprova`).length + 1
                    const Valor2 = client.db.sugerir.get(`${interaction.message.id}.reprova`).length + 1

                    const soma = Valor1 + Valor2;
                    const porcentagem1 = (Valor1 / soma) * 100;
                    const porcentagem2 = (Valor2 / soma) * 100;


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("sugerir+1")
                                .setLabel(`・ ${client.db.sugerir.get(`${interaction.message.id}.aprova`).length + 1} - (${Number(porcentagem1).toFixed(0)}%)`)
                                .setEmoji(`1155221222490112032`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("sugerir-1")
                                .setLabel(`・ ${client.db.sugerir.get(`${interaction.message.id}.reprova`).length + 1} - (${Number(porcentagem2).toFixed(0)}%)`)
                                .setEmoji(`1229787813046915092`)
                                .setStyle(4)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("moderacaosugerir")
                                .setEmoji(`1155225179262287995`)
                                .setStyle(2)
                                .setDisabled(false),
                        )

                    interaction.message.edit({ components: [row] })





                } else {
                    if (u.aprova.includes(interaction.user.id)) {
                        client.db.sugerir.pull(`${interaction.message.id}.aprova`, (element, index, array) => element == interaction.user.id)
                    }
                    client.db.sugerir.push(`${interaction.message.id}.reprova`, interaction.user.id)
                    interaction.reply({ content: `${global.emoji.certo} Obrigado por sugerir!`, ephemeral: true })

                    const Valor1 = client.db.sugerir.get(`${interaction.message.id}.aprova`).length + 1
                    const Valor2 = client.db.sugerir.get(`${interaction.message.id}.reprova`).length + 1

                    const soma = Valor1 + Valor2;
                    const porcentagem1 = (Valor1 / soma) * 100;
                    const porcentagem2 = (Valor2 / soma) * 100;


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("sugerir+1")
                                .setLabel(`・ ${client.db.sugerir.get(`${interaction.message.id}.aprova`).length + 1} - (${Number(porcentagem1).toFixed(0)}%)`)
                                .setEmoji(`1155221222490112032`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("sugerir-1")
                                .setLabel(`・ ${client.db.sugerir.get(`${interaction.message.id}.reprova`).length + 1} - (${Number(porcentagem2).toFixed(0)}%)`)
                                .setEmoji(`1229787813046915092`)
                                .setStyle(4)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("moderacaosugerir")
                                .setEmoji(`1155225179262287995`)
                                .setStyle(2)
                                .setDisabled(false),
                        )

                    interaction.message.edit({ components: [row] })
                }
            }

            if (interaction.customId.startsWith('sugerir+1')) {
                var u = client.db.sugerir.get(interaction.message.id)

                if (u.aprova.includes(interaction.user.id)) {
                    if (u.reprova.includes(interaction.user.id)) {
                        client.db.sugerir.pull(`${interaction.message.id}.reprova`, (element, index, array) => element == interaction.user.id)
                    }


                    client.db.sugerir.pull(`${interaction.message.id}.aprova`, (element, index, array) => element == interaction.user.id)
                    interaction.reply({ content: `${global.emoji.certo} Voto Retirado!`, ephemeral: true })

                    const Valor1 = client.db.sugerir.get(`${interaction.message.id}.aprova`).length + 1
                    const Valor2 = client.db.sugerir.get(`${interaction.message.id}.reprova`).length + 1



                    const soma = Valor1 + Valor2;
                    const porcentagem1 = (Valor1 / soma) * 100;
                    const porcentagem2 = (Valor2 / soma) * 100;


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("sugerir+1")
                                .setLabel(`・ ${client.db.sugerir.get(`${interaction.message.id}.aprova`).length + 1} - (${Number(porcentagem1).toFixed(0)}%)`)
                                .setEmoji(`1155221222490112032`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("sugerir-1")
                                .setLabel(`・ ${client.db.sugerir.get(`${interaction.message.id}.reprova`).length + 1} - (${Number(porcentagem2).toFixed(0)}%)`)
                                .setEmoji(`1229787813046915092`)
                                .setStyle(4)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("moderacaosugerir")
                                .setEmoji(`1155225179262287995`)
                                .setStyle(2)
                                .setDisabled(false),
                        )

                    interaction.message.edit({ components: [row] })





                } else {
                    if (u.reprova.includes(interaction.user.id)) {
                        client.db.sugerir.pull(`${interaction.message.id}.reprova`, (element, index, array) => element == interaction.user.id)
                    }
                    client.db.sugerir.push(`${interaction.message.id}.aprova`, interaction.user.id)
                    interaction.reply({ content: `${global.emoji.certo} Obrigado por votar!`, ephemeral: true })

                    const Valor1 = client.db.sugerir.get(`${interaction.message.id}.aprova`).length + 1
                    const Valor2 = client.db.sugerir.get(`${interaction.message.id}.reprova`).length + 1

                    const soma = Valor1 + Valor2;
                    const porcentagem1 = (Valor1 / soma) * 100;
                    const porcentagem2 = (Valor2 / soma) * 100;


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("sugerir+1")
                                .setLabel(`・ ${client.db.sugerir.get(`${interaction.message.id}.aprova`).length + 1} - (${Number(porcentagem1).toFixed(0)}%)`)
                                .setEmoji(`1155221222490112032`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("sugerir-1")
                                .setLabel(`・ ${client.db.sugerir.get(`${interaction.message.id}.reprova`).length + 1} - (${Number(porcentagem2).toFixed(0)}%)`)
                                .setEmoji(`1229787813046915092`)
                                .setStyle(4)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("moderacaosugerir")
                                .setEmoji(`1155225179262287995`)
                                .setStyle(2)
                                .setDisabled(false),
                        )

                    interaction.message.edit({ components: [row] })
                }
            }
        }







        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === 'sugestaoprodutos') {
                if (interaction.values[0] === 'SugerirEnviar') {
                    interaction.message.edit()
                    const modalaAA = new ModalBuilder()
                        .setCustomId('sugestaoprodutos')
                        .setTitle(`💡 | Sugerir`);

                    const newnameboteN = new TextInputBuilder()
                        .setCustomId('1')
                        .setLabel("TÍTULO DA SUGESTÃO:")
                        .setPlaceholder("Dê um título para sua sugestão.")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                    const newnameboteN2 = new TextInputBuilder()
                        .setCustomId('2')
                        .setLabel("DESCRIÇÃO DA SUGESTÃO:")
                        .setPlaceholder("Descreva sua sugestão.")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                    const newnameboteN3 = new TextInputBuilder()
                        .setCustomId('3')
                        .setLabel("CASO QUEIRA, COLOQUE UMA IMAGEM: (OPCIONAL)")
                        .setPlaceholder("Coloque o link da imagem aqui.")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)

                    const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                    const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                    const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);
                    modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                    await interaction.showModal(modalaAA);
                }
            }
        }

        const editEmbed = {
            content: `⚠️ | Use o Comando Novamente!`,
            components: [],
            embeds: []
        };

        const editMessage = async (message) => {
            try {
                await message.edit(editEmbed)
            } catch (error) {

            }

        };

        const createCollector = (message) => {
            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 120000
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
            var uu22 = db.table('permissionsmessage2')
            if (interaction.customId.startsWith('StockFantasma_')) {

                const qtd = interaction.fields.getTextInputValue('1')
                const valor = interaction.fields.getTextInputValue('2')

                // Verifica se o valor é um número e e inteiro
                if (isNaN(qtd) || !Number.isInteger(Number(qtd))) return interaction.reply({ content: `${global.emoji.errado} Você inseriu um VALOR inválido para adicionar em seu estoque.`, ephemeral: true })
                if (qtd > 1000) return interaction.reply({ content: `${global.emoji.errado} Você não pode adicionar mais de 1.000 itens de uma vez!`, ephemeral: true })

                const produto = interaction.customId.split('_')[1]

                const novosValores = Array.from({ length: qtd }, () => valor);
                const estoqueantigo = client.db.produtos.get(`${produto}.settings.estoque`) || [];

                client.db.produtos.set(`${produto}.settings.estoque`, [...estoqueantigo, ...novosValores]);

                var ll = client.db.produtos.get(`${produto}.settings.notify`)
                if (ll !== null) {
                    ll.forEach(async function (id) {
                        const member = await interaction.guild.members.fetch(id);
                        const embed = new EmbedBuilder()
                            .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                            .setTitle(`${client.user.username} - Notificações`)
                            .setThumbnail(`${client.user.displayAvatarURL()}`)
                            .setDescription(`${obterEmoji(27)} | O estoque do produto **${produto}**, foi reabastecido com \`${qtd}\` itens.\n${obterEmoji(12)}| O produto se encontra no canal <#${client.db.produtos.get(`${produto}.ChannelID`)}>`)
                        try {
                            await member.send({ embeds: [embed] })
                        } catch (error) {

                        }
                    });
                    client.db.produtos.delete(`${produto}.settings.notify`)
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
                var kkkkkkk = client.db.PainelVendas.fetchAll()
                const idEncontrado = encontrarProdutoPorNome(kkkkkkk, produto);
                if (idEncontrado !== null) {
                    atualizarmensagempainel(interaction.guild.id, idEncontrado, client)
                }
                atualizarmessageprodutosone(interaction, client, produto)
                await alterarestoqueproduto(interaction, produto, client)
                interaction.followUp({ content: `${global.emoji.certo} Estoque do produto **${produto}** atualizado com sucesso!`, ephemeral: true })


            }






            if (interaction.customId === 'configurarporcentagemcashback') {
                const codigo = interaction.fields.getTextInputValue('configurarporcentagemcashback')
                if (isNaN(codigo)) return interaction.reply({ content: `Você inseriu um VALOR inválido para adicionar em sua porcnetagem do cash-back.`, ephemeral: true })

                client.db.General.set(`ConfigGeral.CashBack.Porcentagem`, codigo)
                await ConfigCashBack(interaction, interaction.user.id, client)
                interaction.followUp({ content: `${global.emoji.certo} Porcentagem alterada com sucesso!`, ephemeral: true })
            }

            if (interaction.customId === 'avaliar') {
                interaction.deferUpdate()
                avaliacao(interaction, interaction.message.id, interaction.channel.id, client, interaction.user.id)
            }
            if (interaction.customId === 'criar-drop-modal') {
                const codigo = interaction.fields.getTextInputValue('codigo-drop')
                const premio = interaction.fields.getTextInputValue('premio-drop')

                var u = client.db.drops.get(codigo)

                if (u !== null) interaction.reply({ cointent: `Código já existente nesse servidor.`, ephemeral: true })

                client.db.drops.set(codigo, { premio: premio, usercreate: interaction.user.id })

                const embed = new EmbedBuilder()
                    .setTitle('Drop criado!')
                    .setDescription(`Você acabou de criar um drop, para alguem resgatar só utilizar o comando \`/pegardrop\` e inserir o código: \`${codigo}\``)
                    .addFields(
                        { name: `${obterEmoji(11)} | Código:`, value: `${codigo}` },
                        { name: `${obterEmoji(6)} | O QUE SERÁ ENTREGUE:`, value: `${premio}` }
                    )
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }

        if (interaction.isButton()) {

            if (interaction.customId.startsWith('resetperfilestatisticas')) {
                client.db.estatisticasgeral.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | As estatisticas foram resetadas com sucesso!`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetRankCompradores')) {
                client.db.usuariosinfo.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | O Rank de compradores foram resetadas com sucesso!`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetRankProdutos')) {
                client.db.estatisticas.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | O Rank de produtos foram resetadas com sucesso!`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetCupons')) {
                client.db.Cupom.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | Os Cupons foram resetados`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetGiftCards')) {
                client.db.giftcards.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | Os Gifts Cards foram resetados`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetKeys')) {
                client.db.Keys.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | As Keys foram resetados`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetDrops')) {
                client.db.drops.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | Os Drops foram resetados`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetProdutos')) {
                var a = client.db.produtos.fetchAll()
                var b = client.db.PainelVendas.fetchAll()

                for (var i = 0; i < a.length; i++) {
                    var obj = a[i];
                    var ID = obj.data.ID;
                    var dd = client.db.produtos.get(`${ID}`)
                    try {
                        const channel = await client.channels.fetch(dd.ChannelID);
                        const fetchedMessage = await channel.messages.fetch(dd.MessageID);
                        fetchedMessage.delete()
                    } catch (error) {

                    }
                }

                for (let bbbb = 0; bbbb < b.length; bbbb++) {
                    const element = b[bbbb];
                    try {
                        const channel = await client.channels.fetch(element.data.ChannelID);
                        const fetchedMessage = await channel.messages.fetch(element.data.MessageID);
                        fetchedMessage.delete()
                    } catch (error) {

                    }

                }

                client.db.produtos.deleteAll()
                client.db.PainelVendas.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | Os produtos e paineis foram resetados`, ephemeral: true })

            }




            if (interaction.customId.startsWith('cashtoggle')) {
                UpdateCashBack(interaction, interaction.user.id, client)
            }

            if (interaction.customId.startsWith('configurarporcentagemcashback')) {

                const modalaAA = new ModalBuilder()
                    .setCustomId('configurarporcentagemcashback')
                    .setTitle(`Nova porcentagem`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('configurarporcentagemcashback')
                    .setLabel("Nova porcentagem do cash-back:")
                    .setPlaceholder("Exemplo: 22")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }




            if (interaction.customId.startsWith('ReembolsarCompra')) {


                const modal = new ModalBuilder()
                    .setCustomId('confirm-reembolso')
                    .setTitle(`Confirmar Reembolso`)

                const pergunta01 = new TextInputBuilder()
                    .setCustomId('yesorno')
                    .setLabel('Deseja realizar o reembolso dessa compra?')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Digite SIM caso queira reembolsar')
                    .setRequired(true)

                const p1 = new ActionRowBuilder().addComponents(pergunta01)

                modal.addComponents(p1)

                await interaction.showModal(modal);





            }
            if (interaction.customId.startsWith('222coma22ndosliv333reuso')) {
                interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Comandos Liberados Para todos os Usuários`)
                    .addFields(
                        {
                            name: `${obterEmoji(1)} /help`,
                            value: `\`Exibe essa mensagem.\``
                        },
                        {
                            name: `${obterEmoji(1)} /perfil`,
                            value: `\`Mostra o perfil de quem enviou o comando.\``
                        },
                        {
                            name: `${obterEmoji(1)} /rank`,
                            value: `\`Mostra o rank de pessoas que mais compraram.\``
                        },
                        {
                            name: `${obterEmoji(1)} /adicionarsaldo`,
                            value: `\`Adiciona saldo via pix.\``
                        },
                        {
                            name: `${obterEmoji(1)} /ativarkey`,
                            value: `\`Resgata uma key.\``
                        },
                        {
                            name: `${obterEmoji(1)} /resgatargift`,
                            value: `\`Resgata um gift.\``
                        },
                        {
                            name: `${obterEmoji(1)} /pegardrop \`CÓDIGO\``,
                            value: `\`Pega um drop.\``
                        },
                        {
                            name: `${obterEmoji(1)} /cleardm`,
                            value: `\`Apagar as mensagens do bot da sua dm.\``
                        },
                        {
                            name: `${obterEmoji(1)} /info \`ID DA COMPRA\``,
                            value: `\`Mostra informações da compra que você colocou o ID.(Liberado apenas para quem comprou e para os Adm)\``
                        },
                        {
                            name: `${obterEmoji(1)} /pegar \`ID DA COMPRA\``,
                            value: `\`Mostra o Produto que foi Entregue da compra que você colocou o ID.(Liberado apenas para quem comprou e para os Adm)\``
                        }
                    )
                    .setFooter({ text: `Página 1/2`, iconURL: `${client.user.displayAvatarURL()}` })

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("wdgjujujcojujmandosuajujujudmhelp")
                            .setLabel('Comandos Adm')
                            .setEmoji(`1237122940617883750`)
                            .setStyle(1)
                            .setDisabled(false),
                    )

                interaction.message.edit({ embeds: [embed], components: [row] }).then(async u => {
                    createCollector(u)
                })
            }

            if (interaction.customId.startsWith('wdgjujujcojujmandosuajujujudmhelp')) {
                interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Comandos Liberados Para todos os Usuários`)
                    .setFooter({ text: `Página 2/2`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setDescription(`**${obterEmoji(1)} /botconfig**\n\`Configura o bot e os canais.\`\n\n**${obterEmoji(1)} /administrarsaldo**\n\`Administra o saldo de um usuário, podendo adicionar ou remover saldo.\`\n\n**${obterEmoji(1)} /criar**\n\`Cria um produto para venda.\`\n\n**${obterEmoji(1)} /config**\n**\`Configura o produto selecionado.\`**\n\n**${obterEmoji(1)} /criardrop**\n**\`Cria um drop.\`**`)
                    .addFields(

                        {
                            name: `${obterEmoji(1)} /gerarpix`,
                            value: `\`Cria uma cobrança com o valor selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /set`,
                            value: `\`Seta a mensagem de compra do produto selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /stockid`,
                            value: `\`Mostra o estoque do produto selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /del`,
                            value: `\`Deleta o produto selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /criarcupom`,
                            value: `\`Cria um Cupom de Desconto.\``
                        },
                        {
                            name: `${obterEmoji(1)} /configcupom`,
                            value: `\`Configura o Cupom selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /criargift`,
                            value: `\`Cria um código que ao ser resgatado, o usuário ganhará o saldo selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /criados`,
                            value: `\`Mostra todos os produtos, cupons, keys, etc. cadastrados no bot.\``
                        },
                        {
                            name: `${obterEmoji(1)} /criarkey \`@cargo\``,
                            value: `\`Cria uma key, ao ser resgatada o usuário receberá o cargo selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /delkey \`key\``,
                            value: `\`Deleta uma key.\``
                        },
                        {
                            name: `${obterEmoji(1)} /entregar`,
                            value: `\`Entrega o produto selecionado para um usuário.\``
                        },
                        {
                            name: `${obterEmoji(1)} /estatisticas`,
                            value: `\`Mostra as estatisticas de vendas do bot.\``
                        },
                        {
                            name: `${obterEmoji(1)} /permadd`,
                            value: `\`Concede a permissão de usar o bot para um usuário.\``
                        },
                        {
                            name: `${obterEmoji(1)} /permremove`,
                            value: `\`Remove a permissão de um usuário\``
                        },
                        {
                            name: `${obterEmoji(1)} /permlista`,
                            value: `\`Ver todos os usuários que tem permissão\``
                        },
                        {
                            name: `${obterEmoji(1)} /personalizar`,
                            value: `\`Personalize uma embed\``
                        },
                        {
                            name: `${obterEmoji(1)} /rankadm`,
                            value: `\`Mostra o rank de pessoas que mais compraram com o valor gasto.\``
                        },
                        {
                            name: `${obterEmoji(1)} /rankprodutos`,
                            value: `\`Mostra os produtos que mais geraram lucro.\``
                        },
                        {
                            name: `${obterEmoji(1)} /reembolsar`,
                            value: `\`Reembolsa de forma automática o pagamento selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /resetar`,
                            value: `\`Reseta as vendas, o rank, cupons, etc.\``
                        },
                        {
                            name: `${obterEmoji(1)} /status`,
                            value: `\`Verifica o Status da Compra selecionada.\``
                        },
                        {
                            name: `${obterEmoji(1)} /conectar`,
                            value: `\`Faz o bot entrar no canal de voz selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /say`,
                            value: `\`Faz o bot falar.\``
                        },
                        {
                            name: `${obterEmoji(1)} /dm`,
                            value: `\`Faz o bot mandar uma mensagem no privado do membro selecionado.\``
                        }
                    )




                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("222coma22ndosliv333reuso")
                            .setLabel('Comandos de Livre uso.')
                            .setEmoji(`1237122940617883750`)
                            .setStyle(3)
                            .setDisabled(false),
                    )
                interaction.message.edit({ embeds: [embed], components: [row] }).then(async u => {
                    createCollector(u)
                })
            }


            if (interaction.customId.startsWith('cancelgeneratepix')) {
                interaction.message.delete()
            }

            if (interaction.customId.startsWith('pixcdawdwadawdwdopiawdwawdwadecola182381371')) {
                var uu182723937247347934978398 = db.table('messagepixgerar')
                var tttttt = await uu182723937247347934978398.get(interaction.message.id)

                interaction.reply({ content: `${tttttt.pixcopiaecola}`, ephemeral: true })
            }
            if (interaction.customId.startsWith('qwadawrcode18281wadawdwadwa2981')) {
                var uu182723937247347934978398 = db.table('messagepixgerar')
                var tttttt = await uu182723937247347934978398.get(interaction.message.id)
                const buffer = Buffer.from(tttttt.qrcode, "base64");
                const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });
                interaction.reply({ files: [attachment], ephemeral: true })
            }

            if (interaction.customId.startsWith('verificarpagam032')) {
                var uu182723937247347934978398 = db.table('messagepixgerar')
                var tttttt = await uu182723937247347934978398.get(interaction.message.id)
                interaction.reply({ content: `${obterEmoji(10)} | Verificando pagamento....`, ephemeral: true })
                var res = await axios.get(`https://api.mercadopago.com/v1/payments/${tttttt.id}`, {
                    headers: {
                        Authorization: `Bearer ${client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP}`
                    }
                })

                if (res.data.status == 'approved') { // approved ou approved

                    interaction.message.edit({ content: `${obterEmoji(8)} | O Pagamento foi aprovado.`, embeds: [], components: [] })
                    interaction.editReply({ content: `${obterEmoji(8)} | O Pagamento foi aprovado.`, ephemeral: true })

                } else {
                    interaction.editReply({ content: `${obterEmoji(10)} | Aguardando o Pagamento!`, ephemeral: true })

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("pixcdawdwadawdwdopiawdwawdwadecola182381371")
                                .setLabel('Pix Copia e Cola')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(1)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("qwadawrcode18281wadawdwadwa2981")
                                .setLabel('Qr Code')
                                .setEmoji(`1242663891868057692`)
                                .setStyle(1)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("verificarpagam032")
                                .setLabel('Verificar o Pagamento')
                                .setEmoji(`1155221222490112032`)
                                .setStyle(3)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId("cancelgeneratepix")
                                .setEmoji(`1229787813046915092`)
                                .setStyle(4)
                                .setDisabled(false),)


                    interaction.message.edit({ components: [row] })

                    setTimeout(() => {
                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("pixcdawdwadawdwdopiawdwawdwadecola182381371")
                                    .setLabel('Pix Copia e Cola')
                                    .setEmoji(`1233188452330373142`)
                                    .setStyle(1)
                                    .setDisabled(false),
                                new ButtonBuilder()
                                    .setCustomId("qwadawrcode18281wadawdwadwa2981")
                                    .setLabel('Qr Code')
                                    .setEmoji(`1242663891868057692`)
                                    .setStyle(1)
                                    .setDisabled(false),
                                new ButtonBuilder()
                                    .setCustomId("cancelgeneratepix")
                                    .setEmoji(`1229787813046915092`)
                                    .setStyle(4)
                                    .setDisabled(false),)


                        interaction.message.edit({ components: [row] })
                    }, 10000);
                }
            }

            if (interaction.customId.startsWith('1avaliar') || interaction.customId.startsWith('2avaliar') || interaction.customId.startsWith('3avaliar') || interaction.customId.startsWith('4avaliar') || interaction.customId.startsWith('5avaliar')) {
                var aaa = interaction.customId
                var resultado = aaa.replace(/avaliar/, "");

                function transformarEmEstrelas(numero) {
                    return '\u2B50'.repeat(numero);
                }

                uud.set(`${interaction.message.id}.resultado`, resultado)

                setTimeout(async () => {
                    try {
                        await avaliacao(interaction, interaction.message.id, interaction.channel.id, client, interaction.user.id)
                    } catch (error) {

                    }
                }, 120000);

                const modala = new ModalBuilder()
                    .setCustomId('avaliar')
                    .setTitle(`⭐ | Avaliar`);

                const AdicionarNoTicket = new TextInputBuilder()
                    .setCustomId('avaliar')
                    .setLabel(`AVALIAÇÃO - ${transformarEmEstrelas(resultado)} (${resultado})`)
                    .setPlaceholder("Escreva uma breve avaliação aqui.")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow = new ActionRowBuilder().addComponents(AdicionarNoTicket);

                modala.addComponents(firstActionRow);

                // Verifique se a interação já foi respondida antes de chamar `showModal()`
                if (!interaction.deferred) {
                    await interaction.showModal(modala);
                }
            }

        }






        // ANUNCIAR

        const {ContentAnnounce} = require(`../../commands/CmdAdms/anunciar`);

        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId === `postaranuncio`) {
                let canal = await client.channels.fetch(interaction.values[0]);

                const anjo = client.db.Anuncio.get(`Anuncio`) || {};

                const {
                    content = ``, contentimagem = ``, imagem = ``, thumbnail = ``, author = ``, title = ``, description = ``, color = ``, footer = ``,
                } = anjo;

                const embedexemple = new EmbedBuilder();

                if (imagem != ``) {
                    embedexemple.setImage(imagem);
                }
                if (thumbnail != ``) {
                    embedexemple.setThumbnail(thumbnail);
                }
                if (author != ``) {
                    embedexemple.setAuthor({ name: author });
                }
                if (title != ``) {
                    embedexemple.setTitle(title);
                }
                if (description != ``) {
                    embedexemple.setDescription(description);
                }
                if (color != ``) {
                    embedexemple.setColor(color);
                }
                if (footer != ``) {
                    embedexemple.setFooter({ text: footer });
                }

                const updatemessage = {
                    content: content != `` ? content : ``,
                    embeds: embedexemple.length > 0 ? [embedexemple] : [],
                    files: contentimagem != `` ? [contentimagem] : []
                };

                canal.send(updatemessage).then(async (msg) => {
                    interaction.update({ content: `${client.db.General.get(`emojis.certo`)} Anuncio enviado com sucesso.`, components: [], ephemeral: true });
                    client.db.Anuncio.delete(`Anuncio`);
                }).catch(async (err) => {
                    await ContentAnnounce(client, interaction);
                    interaction.followUp({ content: `${client.db.General.get(`emojis.errado`)} Erro ao enviar o Anuncio.`, components: [], ephemeral: true });
                });
            }
        }
        if (interaction.isButton()) {
            if (interaction.customId === `postaranuncio`) {
                const botao = new ActionRowBuilder().addComponents(
                    new ChannelSelectMenuBuilder()
                        .setChannelTypes(ChannelType.GuildText)
                        .setCustomId(`postaranuncio`)
                        .setPlaceholder(`Selecione um canal`)
                        .setMaxValues(1)
                );

                interaction.update({ content: ``, components: [botao], embeds: [], files: [] });
            }
            if (interaction.customId === `limparmsganuncio`) {
                client.db.Anuncio.delete(`Anuncio.content`);
                ContentAnnounce(client, interaction);
            }
            if (interaction.customId === `limparembedanuncio`) {
                client.db.Anuncio.delete(`Anuncio.author`);
                client.db.Anuncio.delete(`Anuncio.title`);
                client.db.Anuncio.delete(`Anuncio.description`);
                client.db.Anuncio.delete(`Anuncio.color`);
                client.db.Anuncio.delete(`Anuncio.footer`);
                ContentAnnounce(client, interaction);
            }
            if (interaction.customId === `limparimagemanuncio`) {
                client.db.Anuncio.delete(`Anuncio.contentimagem`);
                client.db.Anuncio.delete(`Anuncio.imagem`);
                client.db.Anuncio.delete(`Anuncio.thumbnail`);
                ContentAnnounce(client, interaction);
            }
            if (interaction.customId === `definirmsganuncio`) {
                const modal = new ModalBuilder()
                    .setCustomId(`definirmsganuncio`)
                    .setTitle(`Definir Mensagem`);

                const mensagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`content`)
                        .setLabel(`DEFINIR MENSAGEM`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.content`) || ''}`)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                );

                modal.addComponents(mensagem);
                await interaction.showModal(modal);
            }
            if (interaction.customId === `definirembedanuncio`) {
                const modal = new ModalBuilder()
                    .setCustomId(`definirembedanuncio`)
                    .setTitle(`Definir Embed`);

                const author = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`author`)
                        .setLabel(`DEFINIR AUTHOR (OPCIONAL)`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.author`) || ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                );

                const title = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`title`)
                        .setLabel(`DEFINIR TITULO (OBRIGATORIO)`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.title`) || ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                );

                const description = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`description`)
                        .setLabel(`DEFINIR DESCRICAO (OBRIGATORIO)`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.description`) || ''}`)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                );

                const color = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`color`)
                        .setLabel(`DEFINIR COR (OPCIONAL)`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.color`) || ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                );

                const footer = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`footer`)
                        .setLabel(`DEFINIR FOOTER (OPCIONAL)`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.footer`) || ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                );

                modal.addComponents(author, title, description, color, footer);
                await interaction.showModal(modal);
            }
            if (interaction.customId === `definirimagemanuncio`) {
                const modal = new ModalBuilder()
                    .setCustomId(`definirimagemanuncio`)
                    .setTitle(`Definir Imagem`);

                const contentimagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`contentimagem`)
                        .setLabel(`DEFINIR IMAGEM (OPCIONAL)`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.contentimagem`) || ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                );

                const imagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`imagem`)
                        .setLabel(`DEFINIR IMAGEM (OPCIONAL)`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.imagem`) || ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                );

                const thumbnail = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(`thumbnail`)
                        .setLabel(`DEFINIR THUMBNAIL (OPCIONAL)`)
                        .setValue(`${client.db.Anuncio.get(`Anuncio.thumbnail`) || ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                );

                modal.addComponents(contentimagem, imagem, thumbnail);
                await interaction.showModal(modal);
            }
        }
        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === `definirmsganuncio`) {
                client.db.Anuncio.set(`Anuncio.content`, interaction.fields.getTextInputValue(`content`));
                ContentAnnounce(client, interaction);
            }
            if (interaction.customId === `definirembedanuncio`) {
                let author = interaction.fields.getTextInputValue(`author`) || ``;
                let title = interaction.fields.getTextInputValue(`title`) || ``;
                let description = interaction.fields.getTextInputValue(`description`) || ``;
                let color = interaction.fields.getTextInputValue(`color`) || ``;
                let footer = interaction.fields.getTextInputValue(`footer`) || ``;

                if (author != ``) {
                    client.db.Anuncio.set(`Anuncio.author`, author);
                }
                if (title != ``) {
                    client.db.Anuncio.set(`Anuncio.title`, title);
                }
                if (description != ``) {
                    client.db.Anuncio.set(`Anuncio.description`, description);
                }
                if (color != ``) {
                    client.db.Anuncio.set(`Anuncio.color`, color);
                }
                if (footer != ``) {
                    client.db.Anuncio.set(`Anuncio.footer`, footer);
                }


                ContentAnnounce(client, interaction);
            }
            if (interaction.customId === `definirimagemanuncio`) {
                let contentimagem = interaction.fields.getTextInputValue(`contentimagem`) || ``;
                let imagem = interaction.fields.getTextInputValue(`imagem`) || ``;
                let thumbnail = interaction.fields.getTextInputValue(`thumbnail`) || ``;

                if (contentimagem != ``) {
                    client.db.Anuncio.set(`Anuncio.contentimagem`, contentimagem);
                }
                if (imagem != ``) {
                    client.db.Anuncio.set(`Anuncio.imagem`, imagem);
                }
                if (thumbnail != ``) {
                    client.db.Anuncio.set(`Anuncio.thumbnail`, thumbnail);
                }


                ContentAnnounce(client, interaction);
            }
        }







    }
}

async function realizarReembolso(preferenceId, interaction, id, editsql, IdCompra2, valortotal) {
    try {
        interaction.reply({ content: `${obterEmoji(10)} | Reembolsando`, ephemeral: true })
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/search?external_reference=${preferenceId}`, {
            headers: {
                'Authorization': `Bearer ${client.db.General.get(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`)}`
            }
        });
        const paymentStatus = response.data.results[0].status;
        if (paymentStatus !== 'approved' && paymentStatus !== 'authorized') {
            interaction.editReply({ content: `${obterEmoji(22)} | O pagamento não está elegível para reembolso.`, ephemeral: true })
            return;
        }
        const paymentId = response.data.results[0].id;
        const refundResponse = await axios.post(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {}, {
            headers: {
                'Authorization': `Bearer ${client.db.General.get(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`)}`
            }
        });

        client.db.StatusCompras.set(`${editsql}.Status`, 'Reembolsado')
        interaction.editReply(`${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: ${Number(valortotal).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`)


    } catch (error) {
        interaction.editReply({ content: `${obterEmoji(22)} | Ocorreu um erro ao realizar o reembolso: ${error.message}` });
    }
}