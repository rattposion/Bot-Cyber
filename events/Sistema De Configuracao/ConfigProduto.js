const { UpdateStatusVendas, updateMessageConfig, UpdatePagamento, ConfigMP, ToggeMP, TimeMP, ToggleSaldo, bonusSaldo, ConfigSaldo, ConfigSemiAuto, ToggleSemiAuto, PixChangeSemiAuto, configbot, configbotToggle, FunctionCompletConfig, configchannels, configchannelsToggle, CompletConfigChannels, ConfigTermoConfig, ConfigTermo } = require("../../FunctionsAll/BotConfig")
const { InteractionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const { TextInputStyle, ComponentType, RoleSelectMenuBuilder, ButtonBuilder, TextInputBuilder, ActionRowBuilder, ModalBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
const { alterarnomeproduto, alterarpriceproduto, alterardescproduto, alterarestoqueproduto, StartConfigProduto, configavancadaproduto, CargoChangeProduto, atualizarmessageprodutosone } = require("../../FunctionsAll/Createproduto");
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {


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

        if (interaction.isButton()) {


            if (interaction.customId.startsWith('CargosBuyer_')) {
                const produto = interaction.customId.split('_')[1]


                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('cargosbuyernormal_' + produto)
                            .setPlaceholder('Selecione abaixo quais cargos vão poder comprar esse produto.')
                            .setMaxValues(25)
                    )

                const row = new ActionRowBuilder()
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId("resetcargosbuyer_" + produto)
                        .setLabel('Resetar (Liberar para Todos)')
                        .setEmoji(`1237055536885792889`)
                        .setStyle(4)
                        .setDisabled(false),
                );
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId("vltconfigstart_" + produto)
                        .setLabel('Voltar')
                        .setEmoji(`1237055536885792889`)
                        .setStyle(1)
                        .setDisabled(false),
                );
                interaction.update({ components: [select, row] })


            }

            if (interaction.customId.startsWith('resetcargosbuyer_')) {
                const produto = interaction.customId.split('_')[1]
                client.db.produtos.delete(`${produto}.settings.CargosBuy`)
                StartConfigProduto(interaction, produto, client)
            }





            if (interaction.customId.startsWith('alterarnomeproduto_')) {
                let produto = interaction.customId.split('_')[1]
                alterarnomeproduto(interaction, produto, client)
            }
            if (interaction.customId.startsWith('alterarpriceproduto_')) {
                let produto = interaction.customId.split('_')[1]
                alterarpriceproduto(interaction, produto, client)
            }

            if (interaction.customId.startsWith('alterardescproduto')) {
                let produto = interaction.customId.split('_')[1]
                alterardescproduto(interaction, produto, client)
            }
            if (interaction.customId.startsWith('alterarestoqueproduto')) {
                let produto = interaction.customId.split('_')[1]
                alterarestoqueproduto(interaction, produto, client)
            }

            if (interaction.customId.startsWith('vltconfigstart_')) {
                let produto = interaction.customId.split('_')[1]
                StartConfigProduto(interaction, produto, client)
            }

            if (interaction.customId.startsWith('configavancadaproduto_')) {
                const produto = interaction.customId.split('_')[1]
                configavancadaproduto(interaction, produto, client)
            }

            if (interaction.customId.startsWith('atualizarmessageprodutosone_')) {
                await interaction.reply({ content: `${global.emoji.loading_promisse} | Atualizando Mensagem...`, ephemeral: true })
                let produto = interaction.customId.split('_')[1]
                await atualizarmessageprodutosone(interaction, client, produto)
                await interaction.editReply({ content: `${global.emoji.certo} Mensagem Atualizada!`, ephemeral: true })
            }


            if (interaction.customId.startsWith('deletarproduto_')) {
                const produto = interaction.customId.split('_')[1]
                var dd = client.db.produtos.get(`${produto}`)
                try {
                    const channel = await client.channels.fetch(dd.ChannelID);
                    await channel.messages.delete(dd.MessageID);
                } catch (error) {
                }

                var tttttt = client.db.PainelVendas.fetchAll()
                for (let iii = 0; iii < tttttt.length; iii++) {
                    const element = tttttt[iii];
                    var uuppp = element.data.produtos
                    if (uuppp == null) continue
                    if (uuppp.includes(produto)) {
                        client.db.PainelVendas.pull(`${tttttt[iii].ID}.produtos`, (element, index, array) => element == produto)
                        atualizarmensagempainel(interaction.guild.id, element.ID, client)
                    }
                }



                client.db.produtos.delete(`${produto}`)

                client.db.estatisticas.delete(`${produto}`)
                interaction.update({ content: `${global.emoji.errado} O produto \`${produto}\` foi deletado de seu Servidor.`, embeds: [], components: [] })
            }

            if (interaction.customId.startsWith('infoproduto_')) {

                const produto = interaction.customId.split('_')[1]

                var u = client.db.estatisticas.fetchAll()

                function compararPorTotalQtd(a, b) {
                    return b.data.TotalQtd - a.data.TotalQtd;
                }

                var bb = u.sort(compararPorTotalQtd);

                var position = -1;

                for (var i = 0; i < bb.length; i++) {
                    if (bb[i].ID === `${produto}`) {
                        position = i + 1;
                        break;
                    }
                }

                if (position == -1) position = 'Nenhuma venda foi realizada até o momento!'

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#ADD8E6' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.db.General.get(`emojis.info`)} | Estatísticas do Produto`)
                    .addFields(
                        { name: `${global.emoji.caixa} Total de Vendas:`, value: `${client.db.estatisticas.get(`${produto}.TotalQtd`) == null ? '\`0\`' : `\`${Number(client.db.estatisticas.get(`${produto}.TotalQtd`))}\``}`, inline: false },
                        { name: `${global.emoji.dinheiro2} Valor Recebido:`, value: `${client.db.estatisticas.get(`${produto}.TotalPrice`) == null ? '\`R$ 0.00\`' : `\`${Number(client.db.estatisticas.get(`${produto}.TotalPrice`)).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``}`, inline: false },
                        { name: `${global.emoji.giveaway} Posição no Rank:`, value: `\`${position == `Nenhuma venda foi realizada até o momento!` ? `Nenhuma venda foi realizada até o momento!` : `${position}º`}\``, inline: false }
                    )
                interaction.reply({ embeds: [embed], ephemeral: true })
            }

            if (interaction.customId.startsWith('CargoChangeProduto_')) {
                const produto = interaction.customId.split('_')[1]
                CargoChangeProduto(interaction, client, produto)
            }

            if (interaction.customId.startsWith('setroleproduto_')) {
                const produto = interaction.customId.split('_')[1]
                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('rpçey13273n_' + produto)
                            .setPlaceholder('Selecione abaixo qual cargo CLIENTES DESTE PRODUTO.')
                            .setMaxValues(1)
                    )

                const row = new ActionRowBuilder()
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId("22C222argoChangeProduto222_" + produto)
                        .setLabel('Voltar')
                        .setEmoji(`1237055536885792889`)
                        .setStyle(1)
                        .setDisabled(false),
                );
                interaction.update({ components: [select, row] })

            }

            if (interaction.customId.startsWith('22C222argoChangeProduto222_')) {
                const produto = interaction.customId.split('_')[1]
                CargoChangeProduto(interaction, client, produto)
            }
            if (interaction.customId.startsWith('vlarteconfigavancadaproduto_')) {
                const produto = interaction.customId.split('_')[1]
                configavancadaproduto(interaction, produto, client)
            }



            if (interaction.customId.startsWith('settemproleproduto_')) {
                const produto = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('settemproleproduto_' + produto)
                    .setTitle(`Ativar Cargo Temporario `);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('settemproleproduto')
                    .setLabel("QUANTIDADE DE DIAS:")
                    .setPlaceholder("7")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }

            if (interaction.customId.startsWith('togglecuponsprodutoo_')) {
                const produto = interaction.customId.split('_')[1]

                client.db.produtos.set(`${produto}.embedconfig.cupom`, !client.db.produtos.get(`${produto}.embedconfig.cupom`))


                configavancadaproduto(interaction, produto, client)
            }

            if (interaction.customId.startsWith('addstock_')) {
                let produto = interaction.customId.split('_')[1]

                const content = `Selecione um método abaixo`

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("adcporlinha_" + produto)
                            .setLabel('Adicionar por linha')
                            .setEmoji(`1233110125330563104`)
                            .setStyle(3),
                        new ButtonBuilder()
                            .setCustomId("adcumporum_" + produto)
                            .setLabel('Adicionar um por um')
                            .setEmoji(`1237122937631408128`)
                            .setStyle(1),
                        new ButtonBuilder()
                            .setCustomId("awdwadwadaddstocktxt_" + produto)
                            .setLabel('Enviar Arquivo')
                            .setEmoji(`1229787811205353493`)
                            .setStyle(1),
                        new ButtonBuilder()
                            .setCustomId("estoqueinfinitofernanda_" + produto)
                            .setLabel('Adicionar Estoque Fantasma')
                            .setEmoji(`1243283332716957777`)
                            .setStyle(2)
                    )

                const row2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("vltconfigestoque_" + produto)
                        .setEmoji(`1237055536885792889`)
                        .setStyle(2)
                )

                interaction.update({ content: content, embeds: [], components: [row, row2] })


            }
            if (interaction.customId.startsWith('vltconfigestoque_')) {
                const produto = interaction.customId.split('_')[1]
                alterarestoqueproduto(interaction, produto, client)
            }
            if (interaction.customId.startsWith('estoqueinfinitofernanda_')) {

                const produto = interaction.customId.split('_')[1]

                const modalaAA = new ModalBuilder()
                    .setCustomId('StockFantasma_' + produto)
                    .setTitle(`Definir estoque fantasma`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('1')
                    .setLabel("QUANTIDADE (Maximo 1000):")
                    .setPlaceholder("Insira aqui a quantidade de estoque fantasma desejada")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('2')
                    .setLabel("VALOR FANTASMA")
                    .setPlaceholder("Insira aqui um valor fantasma, ex: abra ticket pra resgatar")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);
                await interaction.showModal(modalaAA);


            }
            if (interaction.customId.startsWith('awdwadwadaddstocktxt_')) {
                const produto = interaction.customId.split('_')[1]

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(7)} | Envie o \`ARQUIVO\` TXT abaixo! (Iremos reconhecer por linha do TXT)`)

                interaction.update({ content: ``, embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {

                        collector.stop()

                        if (message.attachments.size !== 0) {

                            const [attachmentId, attachmentInfo] = message.attachments.entries().next().value;
                            axios.get(attachmentInfo.attachment)
                                .then(async response => {
                                    message.delete()
                                    const lines = response.data.split('\n');

                                    let arraystockadd = []
                                    arraystockadd.push(...lines.filter(linha => linha.trim()));
                                    let produto2 = client.db.produtos.get(`${produto}.settings.estoque`)
                                    const novoArray = produto2.concat(arraystockadd);

                                    client.db.produtos.set(`${produto}.settings.estoque`, novoArray);

                                    var ll = client.db.produtos.get(`${produto}.settings.notify`)
                                    if (ll !== null) {
                                        ll.forEach(async function (id) {
                                            const member = await interaction.guild.members.fetch(id);
                                            const embed = new EmbedBuilder()
                                                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                                                .setTitle(`${client.user.username} - Notificações`)
                                                .setThumbnail(`${client.user.displayAvatarURL()}`)
                                                .setDescription(`${obterEmoji(27)} | O estoque do produto **${produto}**, foi reabastecido com \`${lines.length}\` itens.\n${obterEmoji(12)}| O produto se encontra no canal <#${client.db.produtos.get(`${produto}.ChannelID`)}>`)
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
                                    await alterarestoqueproduto(interaction, produto, client, 1)
                                    await interaction.followUp({ content: `${global.emoji.certo} Foram adicionados ${lines.length} Produtos`, ephemeral: true })

                                })
                                .catch(async error => {
                                    console.log(error)
                                    message.delete()
                                    await alterarestoqueproduto(interaction, produto, client, 1)
                                    interaction.followUp({ content: `${global.emoji.errado} Você enviou um arquivo invalido!`, ephemeral: true })
                                });

                        } else {
                            message.delete()
                            await alterarestoqueproduto(interaction, produto, client, 1)
                            interaction.followUp({ content: `${global.emoji.errado} Você não enviou um arquivo!`, ephemeral: true })
                        }
                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {

                            await alterarestoqueproduto(interaction, produto, client, 1)
                        } catch (error) {

                        }

                    });
                })




            }
            if (interaction.customId.startsWith('adcporlinha_')) {
                let produto = interaction.customId.split('_')[1]

                const modal = new ModalBuilder()
                    .setCustomId(`adcporlinha_${produto}`)
                    .setTitle('Adicionar Estoque')

                const estoque = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('estoque')
                        .setLabel('Estoque')
                        .setLabel('INSIRA AQUI O ESTOQUE')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                )

                modal.addComponents(estoque)
                await interaction.showModal(modal)
            }


            if (interaction.customId.startsWith('adcumporum_')) {
                const produto = interaction.customId.split('_')[1]
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(7)} | Envie o produto de um em um, quando terminar de enviar digite: "finalizar"`)

                interaction.update({ content: ``, embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        if (message.content == 'finalizar') {

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
                            await alterarestoqueproduto(interaction, produto, client, 1)
                            collector.stop()
                            return
                        }

                        client.db.produtos.push(`${produto}.settings.estoque`, message.content);
                    })


                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) {
                            var ll = client.db.produtos.get(`${produto}.settings.notify`)
                            if (ll !== null) {
                                ll.forEach(async function (id) {
                                    const member = await interaction.guild.members.fetch(id);
                                    const embed = new EmbedBuilder()
                                        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                                        .setTitle(`${client.user.username} - Notificações`)
                                        .setThumbnail(`${client.user.displayAvatarURL()}`)
                                        .setDescription(`${obterEmoji(27)} | O estoque do produto **${produto}**, foi reabastecido com \`${message.size - 1}\` itens.\n${obterEmoji(12)} | O produto se encontra no canal <#${client.db.produtos.get(`${produto}.ChannelID`)}>`)
                                    try {
                                        await member.send({ embeds: [embed] })
                                    } catch (error) {

                                    }

                                });
                                client.db.produtos.delete(`${produto}.settings.notify`)
                            }
                            return interaction.followUp({ content: `${global.emoji.certo} Foram adicionados ${message.size - 1} Produtos`, ephemeral: true })
                        }
                        try {
                            await alterarestoqueproduto(interaction, produto, client, 1)
                        } catch (error) {

                        }

                    });

                })






            }

            if (interaction.customId.startsWith('remstock_')) {

                let produto = interaction.customId.split('_')[1]


                const u = client.db.produtos.get(`${produto}.settings.estoque`)
                var result = '';
                for (const key in u) {
                    result += `${obterEmoji(12)}**| ` + key + '** - ' + u[key] + '\n';
                }
                if (result == '') result = ''

                if (result.length > 4000) {
                    await alterarestoqueproduto(interaction, produto, client)
                    interaction.followUp({ content: `${global.emoji.errado} O estoque do produto está muito grande, não consigo remover desta forma!`, ephemeral: true })
                }


                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Produto`)
                    .setDescription(`${obterEmoji(19)} | Este é seu estoque:\n\n${result}\n\nCaso queira cancelar escreva abaixo **cancelar**`)
                    .setFooter({ text: `Para remover um item você irá enviar o número da linha do produto!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                interaction.update({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.content == `cancelar`) {
                            await alterarestoqueproduto(interaction, produto, client)
                            return
                        }

                        var u = client.db.produtos.get(`${produto}.settings.estoque`)
                        if (u[message.content] == null) {

                            await alterarestoqueproduto(interaction, produto, client)
                            interaction.followUp({ content: `${global.emoji.errado} Você não enviou um número válido!`, ephemeral: true })
                            return
                        }

                        client.db.produtos.pull(`${produto}.settings.estoque`, (element, index, array) => index == message.content)

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
                        await alterarestoqueproduto(interaction, produto, client, 1)
                        interaction.followUp({ content: `${global.emoji.certo} O produto foi removido com sucesso!`, ephemeral: true })

                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {
                            await alterarestoqueproduto(interaction, produto, client, 1)
                        } catch (error) {

                        }

                    });
                })
            }

            if (interaction.customId.startsWith('backupstock_')) {

                const produto = interaction.customId.split('_')[1]
                const u = client.db.produtos.get(`${produto}.settings.estoque`)
                var result = '';
                var result2 = '';
                for (const key in u) {
                    result += u[key] + '\n';
                    result2 += `${key} - ${u[key]}\n`
                }
                if (result == '') return interaction.reply({ content: `${global.emoji.errado} Este produto está sem estoque!`, ephemeral: true })
                if (result2 == '') return interaction.reply({ content: `${global.emoji.errado} Este produto está sem estoque!`, ephemeral: true })
                const fileName = `stock_${produto}.txt`;
                const fileBuffer = Buffer.from(result, 'utf-8');
                const fileBuffer2 = Buffer.from(result2, 'utf-8');
                interaction.reply({ content: `${global.emoji.certo} O backup do produto \`${produto}\` foi enviado em seu privado.`, ephemeral: true })

                try {
                    interaction.user.send({
                        files: [{
                            attachment: fileBuffer,
                            name: fileName
                        }]
                    })
                    interaction.user.send({
                        files: [{
                            attachment: fileBuffer2,
                            name: fileName
                        }]
                    })
                } catch (error) {

                }
            }

            if (interaction.customId.startsWith('clearstock_')) {
                const produto = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('clearstock222_' + produto)
                    .setTitle(`Confirmar`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('clearstock222')
                    .setLabel(`PARA CONTINUAR ESCREVA "SIM"`)
                    .setPlaceholder("SIM")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }




            if (interaction.customId.startsWith('CategoriaProdutoChangeeee_')) {
                const produto = interaction.customId.split('_')[1]
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Produto`)
                    .setDescription(`**Categoria atual:** ${client.db.produtos.get(`${produto}.embedconfig.categoria`) == null ? 'Não definido' : `<#${client.db.produtos.get(`${produto}.embedconfig.categoria`)}>`}
                    Selecione abaixo nova categoria:`)

                const select = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('CategoriaProdutoChangeeee_' + produto)
                            .setPlaceholder('Selecione abaixo qual será a CATEGORIA que set produto será vinculado.')
                            .setMaxValues(1)
                            .addChannelTypes(ChannelType.GuildCategory)
                    )
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("vlarteconfigavancadaproduto_" + produto)
                            .setLabel('Voltar')
                            .setEmoji(`1237055536885792889`)
                            .setStyle(1)
                            .setDisabled(false),
                    )

                interaction.update({ embeds: [embed], components: [select, row3] })
            }




            if (interaction.customId.startsWith('BannerChangeProduto_')) {
                const produto = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('BannerChangeProduto_' + produto)
                    .setTitle(`Alterar Banner do Produto`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('BannerChangeProduto')
                    .setLabel("LINK BANNER:")
                    .setPlaceholder("NOVO BANNER")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }

            if (interaction.customId.startsWith('MiniaturaChangeProduto_')) {
                const produto = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('MiniaturaChangeProduto_' + produto)
                    .setTitle(`Alterar Miniatura do Produto`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('MiniaturaChangeProduto')
                    .setLabel("LINK DA MINIATURA:")
                    .setPlaceholder("NOVO MINIATURA")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }

            if (interaction.customId.startsWith('CorEmbedProduto_')) {
                const produto = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('CorEmbedProduto_' + produto)
                    .setTitle(`Alterar Cor Embed`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('CorEmbedProduto')
                    .setLabel("Nova Cor do seu Bot. (Hexadecimal):")
                    .setPlaceholder("#FF0000, #FF69B4, #FF1493")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }




        }

        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId.startsWith('clearstock222_')) {

                const produto = interaction.customId.split('_')[1]
                const clearstock = interaction.fields.getTextInputValue('clearstock222').toLowerCase();

                if (clearstock != 'sim') return interaction.reply({ content: `${global.emoji.errado} Você não escreveu \`Sim\` corretamente.`, ephemeral: true })

                client.db.produtos.set(`${produto}.settings.estoque`, [])
                atualizarmessageprodutosone(interaction, client, produto)
                await alterarestoqueproduto(interaction, produto, client)
                interaction.followUp({ content: `${obterEmoji(8)} | O estoque do produto \`${produto}\` foi limpo com sucesso!`, ephemeral: true })

            }

            if (interaction.customId.startsWith('BannerChangeProduto_')) {
                const produto = interaction.customId.split('_')[1]
                const BannerChangeProduto = interaction.fields.getTextInputValue('BannerChangeProduto');

                const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

                if (url.test(BannerChangeProduto)) {


                    client.db.produtos.set(`${produto}.embedconfig.banner`, BannerChangeProduto)
                    await configavancadaproduto(interaction, produto, client)
                    interaction.followUp({
                        ephemeral: true,
                        content: `${global.emoji.certo} O banner do seu produto foi atualizado com sucesso.`
                    });
                } else {
                    interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Você inseriu um BANNER invalido para seu BOT;` })
                }
            }

            if (interaction.customId.startsWith('MiniaturaChangeProduto_')) {
                const produto = interaction.customId.split('_')[1]
                const MiniaturaChangeProduto = interaction.fields.getTextInputValue('MiniaturaChangeProduto');

                const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

                if (url.test(MiniaturaChangeProduto)) {

                    client.db.produtos.set(`${produto}.embedconfig.miniatura`, MiniaturaChangeProduto)
                    await configavancadaproduto(interaction, produto, client)
                    interaction.followUp({
                        ephemeral: true,
                        content: `${global.emoji.certo} A miniatura do seu produto foi atualizada com sucesso.`
                    });
                } else {
                    interaction.reply({ ephemeral: true, content: `${global.emoji.errado} Você inseriu uma MINIATURA invalida para seu BOT;` })
                }
            }

            if (interaction.customId.startsWith('CorEmbedProduto_')) {
                const produto = interaction.customId.split('_')[1]
                const CorEmbedProduto = interaction.fields.getTextInputValue('CorEmbedProduto');


                var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                var isHexadecimal = regex.test(CorEmbedProduto);

                if (isHexadecimal) {

                    client.db.produtos.set(`${produto}.embedconfig.color`, CorEmbedProduto)
                    await configavancadaproduto(interaction, produto, client)
                    interaction.followUp({ content: `${global.emoji.certo} A cor do seu produto foi atualizada com sucesso.`, ephemeral: true })
                } else {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu um COR diferente de HexaDecimal;` })
                }
            }

            if (interaction.customId.startsWith('settemproleproduto_')) {
                const produto = interaction.customId.split('_')[1]
                const settemproleproduto = interaction.fields.getTextInputValue('settemproleproduto');
                var isNumeric = /^\d+$/.test(settemproleproduto);

                if (isNumeric) {
                    client.db.produtos.set(`${produto}.embedconfig.cargo.tempo`, Number(settemproleproduto))
                    await configavancadaproduto(interaction, produto, client)
                    interaction.followUp({ content: `${global.emoji.certo} O tempo do cargo foi atualizado com sucesso.`, ephemeral: true })
                } else {
                    return interaction.reply({ content: `${obterEmoji(22)} | Você pode apenas colocar DIAS em NUMEROS`, ephemeral: true })
                }
            }
        }

        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId.startsWith('adcporlinha_')) {
                var produto = interaction.customId.split('_')[1]

                let estoque = interaction.fields.getTextInputValue('estoque');
                const estoqueantigo = client.db.produtos.get(`${produto}.settings.estoque`) || [];

                estoque = estoque.split('\n').filter(x => x.trim());

                client.db.produtos.set(`${produto}.settings.estoque`, [...estoqueantigo, ...estoque]);

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
                interaction.followUp({ content: `${global.emoji.certo} Item adicionado ao estoque: \`${estoque}\``, ephemeral: true })
            }
        }




        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId.startsWith(`CategoriaProdutoChangeeee_`)) {
                const produto = interaction.customId.split('_')[1]
                client.db.produtos.set(`${produto}.embedconfig.categoria`, interaction.values[0])
                await configavancadaproduto(interaction, produto, client)
                interaction.followUp({ content: `${global.emoji.certo} A categoria do produto foi alterada com sucesso!`, ephemeral: true })

            }
        }

        if (interaction.isRoleSelectMenu()) {

            if (interaction.customId.startsWith(`rpçey13273n_`)) {
                const produto = interaction.customId.split('_')[1]
                const botMember = interaction.guild.members.cache.get(client.user.id)
                const role = interaction.guild.roles.cache.get(interaction.values[0]);
                if (role.position > botMember.roles.highest.position) {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | O cargo selecionado é superior ao meu!` })
                    return
                }
                client.db.produtos.set(`${produto}.embedconfig.cargo.name`, interaction.values[0])
                configavancadaproduto(interaction, produto, client)

            }




            if (interaction.customId.startsWith('cargosbuyernormal_')) {
                const produto = interaction.customId.split('_')[1]


                client.db.produtos.set(`${produto}.settings.CargosBuy`, interaction.values)
                StartConfigProduto(interaction, produto, client)

            }
        }


        if (interaction.isAutocomplete()) {
            if (interaction.commandName == 'config') {
                var nomeDigitado = interaction.options.getFocused().toLowerCase();

                var produtosFiltrados = client.db.produtos.filter(x => {
                    const id = x?.data?.ID?.toLowerCase() || '';
                    const nome = x?.data?.settings?.name?.toLowerCase() || '';
                    return id.includes(nomeDigitado) || nome.includes(nomeDigitado);
                });

                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    return {
                        name: `ID - ${x.data.ID} | Nome - ${(x.data.settings.name).slice(0, 15)}`,
                        value: `${x.data.ID}`
                    };
                });

                interaction.respond(!config.length
                    ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }]
                    : config
                );
            }
            if (interaction.commandName == 'stockid') {
                var nomeDigitado = interaction.options.getFocused().toLowerCase();

                var produtosFiltrados = client.db.produtos.filter(x => {
                    const id = x?.data?.ID?.toLowerCase() || '';
                    const nome = x?.data?.settings?.name?.toLowerCase() || '';
                    return id.includes(nomeDigitado) || nome.includes(nomeDigitado);
                });

                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    return {
                        name: `ID - ${x.data.ID} | Nome - ${(x.data.settings.name).slice(0, 15)}`,
                        value: `${x.data.ID}`
                    };
                });

                interaction.respond(!config.length
                    ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }]
                    : config
                );
            }

            if (interaction.commandName == 'set') {
              
                var nomeDigitado = interaction.options.getFocused().toLowerCase();

                var produtosFiltrados = client.db.produtos.filter(x => {
                    const id = x?.data?.ID?.toLowerCase() || '';
                    const nome = x?.data?.settings?.name?.toLowerCase() || '';
                    return id.includes(nomeDigitado) || nome.includes(nomeDigitado);
                });

                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    return {
                        name: `ID - ${x.data.ID} | Nome - ${(x.data.settings.name).slice(0, 15)}`,
                        value: `${x.data.ID}`
                    };
                });

                interaction.respond(!config.length
                    ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }]
                    : config
                );
            }
        }
    }

}