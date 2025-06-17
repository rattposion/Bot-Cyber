const { EmbedBuilder, InteractionType, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder, SelectMenuBuilder, StringSelectMenuBuilder, ButtonBuilder } = require("discord.js");
const { configembedpainel, configpainel, configprodutospainel, atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate")
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('painelsettings')
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const { PainelPages } = require("../../FunctionsAll/PainelPages/PainelPage")
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.type == InteractionType.ModalSubmit) {



            if (interaction.customId.startsWith('changesequenciaprodutos_')) {
                const painel = interaction.customId.split('_')[1]
                const idproduto = interaction.fields.getTextInputValue('idproduto');
                const newposicaoproduto = interaction.fields.getTextInputValue('newposicaoproduto');

                if (!client.db.PainelVendas.get(`${painel}.produtos`).includes(idproduto)) {
                    interaction.reply({ content: `${global.emoji.errado} Produto não encontrado!`, ephemeral: true })
                    return
                }

                var produtos2 = client.db.PainelVendas.get(`${painel}.produtos`)

                const indexProduto = produtos2.indexOf(idproduto);

                if (indexProduto !== -1 && newposicaoproduto >= 0 && newposicaoproduto < produtos2.length) {
                    produtos2.splice(newposicaoproduto, 0, produtos2.splice(indexProduto, 1)[0]);


                } else {
                    interaction.reply({ content: `${global.emoji.errado} Posição não encontrada!`, ephemeral: true })
                    return
                }

                client.db.PainelVendas.set(`${painel}.produtos`, produtos2)

                await configprodutospainel(interaction, client, painel)

                await interaction.followUp({ content: `${global.emoji.certo} Produto movido com sucesso!`, ephemeral: true })


                let up = await interaction.followUp({ content: `${global.emoji.loading_promisse} | Atualizando Mensagem do Painel...`, ephemeral: true })
                await atualizarmensagempainel(interaction.guild.id, painel, client)
                await interaction.editReply({ content: `${global.emoji.certo} Mensagem do Painel Atualizada com Sucesso!`, ephemeral: true, message: up })


            }








            if (interaction.customId.startsWith('editpainelcolor_')) {
                const editpainelcolor = interaction.fields.getTextInputValue('editpainelcolor');
                const painel = interaction.customId.split('_')[1]

                var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                var isHexadecimal = regex.test(editpainelcolor);

                if (isHexadecimal) {

                    client.db.PainelVendas.set(`${painel}.settings.color`, editpainelcolor)
                    await configembedpainel(interaction, client, painel)
                } else {
                    await configembedpainel(interaction, client, painel)
                    interaction.followUp({ content: `${global.emoji.errado} Você inseriu uma cor invalida para seu BOT;`, ephemeral: true })
                }
            }





            if (interaction.customId.startsWith('editpainelBanner')) {
                const painel = interaction.customId.split('_')[1]
                const editpainelBanner = interaction.fields.getTextInputValue('editpainelBanner');

                const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

                if (url.test(editpainelBanner)) {


                    client.db.PainelVendas.set(`${painel}.settings.banner`, editpainelBanner)
                    await configembedpainel(interaction, client, painel)
                    interaction.followUp({ content: `${obterEmoji(8)} | Você alterou o BANNER do seu Produto.`, ephemeral: true })
                } else {

                    await configembedpainel(interaction, client, painel)
                    interaction.followUp({ content: `${obterEmoji(22)} | Você inseriu um BANNER invalido para seu BOT;`, ephemeral: true })

                }
            }


            if (interaction.customId.startsWith('editpainelMiniatura')) {
                const painel = interaction.customId.split('_')[1]
                const editpainelMiniatura = interaction.fields.getTextInputValue('editpainelMiniatura');

                const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

                if (url.test(editpainelMiniatura)) {


                    client.db.PainelVendas.set(`${painel}.settings.miniatura`, editpainelMiniatura)
                    await configembedpainel(interaction, client, painel)
                    interaction.followUp({ content: `${global.emoji.certo} Você alterou a MINIATURA do seu Produto.`, ephemeral: true })
                } else {
                    await configembedpainel(interaction, client, painel)
                    interaction.followUp({ content: `${global.emoji.errado} Você inseriu uma MINIATURA invalida para seu BOT;`, ephemeral: true })
                }
            }

        }


        if (interaction.isStringSelectMenu()) {
            if (interaction.customId.startsWith('addprodutopainel_')) {
                let painel = interaction.customId.split('_')[1]
                let page = interaction.customId.split('_')[2]
                let produto = interaction.values[0]
                let info = client.db.produtos.get(`${produto}`)
                if (!info) {
                    await PainelPages(interaction, painel, page, client)
                    return interaction.followUp({ content: `${global.emoji.errado} Produto não encontrado!`, ephemeral: true })
                }

                if (client.db.PainelVendas.get(`${painel}.produtos`).includes(produto)) {
                    await PainelPages(interaction, painel, page, client)
                    return interaction.followUp({ content: `${global.emoji.errado} Produto já adicionado!`, ephemeral: true })
                }

                client.db.PainelVendas.push(`${painel}.produtos`, produto)
                await configprodutospainel(interaction, client, painel)
                await interaction.followUp({ content: `${global.emoji.certo} Produto adicionado com sucesso!`, ephemeral: true })


                // update a mensagem do painel

                let up = await interaction.followUp({ content: `${global.emoji.loading_promisse} | Atualizando Mensagem do Painel...`, ephemeral: true })
                await atualizarmensagempainel(interaction.guild.id, painel, client)
                await interaction.editReply({ content: `${global.emoji.certo} Mensagem do Painel Atualizada com Sucesso!`, ephemeral: true, message: up })
            }

        }



        if (interaction.isButton()) {
            if (interaction.customId.startsWith('paginasPainelAdd_')) {
                const painel = interaction.customId.split('_')[1]
                const page = interaction.customId.split('_')[2]
                await PainelPages(interaction, painel, page, client)

            }


            if (interaction.customId.startsWith('configembedpainel_')) {
                let painel = interaction.customId.split('_')[1]
                await configembedpainel(interaction, client, painel)
            }

            if (interaction.customId.startsWith('uay89efg7t9a7wa87dawgbydaid76_')) {
                let painel = interaction.customId.split('_')[1]
                configpainel(interaction, painel, client)
            }



            if (interaction.customId.startsWith('deletarpainel_')) {
                const painel = interaction.customId.split('_')[1]
                await interaction.update({ content: `${global.emoji.loading_promisse} | Deletando Painel...`, embeds: [], components: [] })

                var sasassasa = client.db.PainelVendas.get(painel)

                try {
                    const channel = await client.channels.fetch(sasassasa.ChannelID);
                    await channel.messages.delete(sasassasa.MessageID);
                } catch (error) { console.log(error) }

                client.db.PainelVendas.delete(painel)
                interaction.editReply({ content: `${global.emoji.certo} Painel Deletado com Sucesso!`, embeds: [], components: [] })
            }

            if (interaction.customId.startsWith('atualizarmensagempainel_')) {
                const painel = interaction.customId.split('_')[1]
                await interaction.reply({ content: `${global.emoji.loading_promisse} | Atualizando Mensagem do Painel...`, ephemeral: true })
                await atualizarmensagempainel(interaction.guild.id, painel, client)
                await interaction.editReply({ content: `${global.emoji.certo} Mensagem do Painel Atualizada com Sucesso!`, ephemeral: true })

            }


            if (interaction.customId.startsWith('configprodutospainel_')) {
                const painel = interaction.customId.split('_')[1]
                configprodutospainel(interaction, client, painel)
            }


            if (interaction.customId.startsWith('removeprodutopainel_')) {
                const painel = interaction.customId.split('_')[1]
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`Envie o ID do produto que você deseja remover do painel:\n\nCaso queira cancelar escreva abaixo **cancelar**`)


                interaction.update({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.content == `cancelar`) {
                            await configprodutospainel(interaction, client, painel, 1)
                            return
                        }

                        if (client.db.produtos.get(`${message.content}`) == null) {
                            await configprodutospainel(interaction, client, painel, 1)
                            interaction.followUp({ content: `${global.emoji.errado} Produto não encontrado!`, ephemeral: true })
                            return
                        }

                        if (!client.db.PainelVendas.get(`${painel}.produtos`).includes(message.content)) {
                            configprodutospainel(interaction, client, painel, 1)
                            interaction.followUp({ content: `${global.emoji.errado} Produto não encontrado! x2`, ephemeral: true })
                            return
                        }

                        client.db.PainelVendas.pull(`${painel}.produtos`, (element, index, array) => element.uuuuuuu)
                        await configprodutospainel(interaction, client, painel, 1)
                        interaction.followUp({ content: `${global.emoji.certo} Produto removido com sucesso!`, ephemeral: true })

                        let up = await interaction.followUp({ content: `${global.emoji.loading_promisse} | Atualizando Mensagem do Painel...`, ephemeral: true })
                        await atualizarmensagempainel(interaction.guild.id, painel, client)
                        await interaction.editReply({ content: `${global.emoji.certo} Mensagem do Painel Atualizada com Sucesso!`, ephemeral: true, message: up })
                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {
                            await configprodutospainel(interaction, client, painel, 1)

                        } catch (error) { console.log(error) }

                    });
                })
            }










            if (interaction.customId.startsWith('addprodutopainel_')) {
                const painel = interaction.customId.split('_')[1]
                const page = interaction.customId.split('_')[2]
                await PainelPages(interaction, painel, page, client)
            }



            if (interaction.customId.startsWith('changesequenciaprodutos_')) {
                const painel = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('changesequenciaprodutos_' + painel)
                    .setTitle(`Alterar Posição`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('idproduto')
                    .setLabel("ID DO PRODUTO:")
                    .setPlaceholder("Coloque o id do produto aqui.")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('newposicaoproduto')
                    .setLabel("NOVA POSIÇÃO:")
                    .setPlaceholder("Ex: 1")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
                modalaAA.addComponents(firstActionRow3, firstActionRow2);
                await interaction.showModal(modalaAA);
            }


            if (interaction.customId.startsWith('editpainelembed_')) {
                let painel = interaction.customId.split('_')[1]


                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`**Título Atual:**
${client.db.PainelVendas.get(`${painel}.settings.title`)}
Envie o novo título abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)




                interaction.update({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.content == `cancelar`) {
                            configembedpainel(interaction, client, painel, 1)
                            return
                        }

                        client.db.PainelVendas.set(`${painel}.settings.title`, message.content)
                        await configembedpainel(interaction, client, painel, 1)
                        interaction.followUp({ content: `${obterEmoji(8)} | Título atualizado com sucesso`, ephemeral: true })


                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {
                            await configembedpainel(interaction, client, painel, 1)
                        } catch (error) { console.log(error) }

                    });
                })
            }



            if (interaction.customId.startsWith('editpaineldesc_')) {
                let painel = interaction.customId.split('_')[1]
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`**Descrição Atual:**
${client.db.PainelVendas.get(`${painel}.settings.desc`)}
Envie a nova descrição abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)

                await interaction.update({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.content == `cancelar`) {
                            await configembedpainel(interaction, client, painel, 1)
                            return
                        }

                        client.db.PainelVendas.set(`${painel}.settings.desc`, message.content)
                        await configembedpainel(interaction, client, painel, 1)
                        interaction.followUp({ content: `${global.emoji.certo} Descrição atualizada com sucesso`, ephemeral: true })


                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {
                            await configembedpainel(interaction, client, painel, 1)
                        } catch (error) { console.log(error) }

                    });
                })
            }


            if (interaction.customId.startsWith('editpainelrodape_')) {
                let painel = interaction.customId.split('_')[1]
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`**Rodapé Atual:**
${client.db.PainelVendas.get(`${painel}.settings.rodape`) == null ? 'Sem Rodapé' : client.db.PainelVendas.get(`${painel}.settings.rodape`)}
Envie o novo rodapé abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)



                interaction.update({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.content == `cancelar`) {
                            await configembedpainel(interaction, client, painel, 1)
                            return
                        }

                        client.db.PainelVendas.set(`${painel}.settings.rodape`, message.content)
                        await configembedpainel(interaction, client, painel, 1)
                        interaction.followUp({ content: `${global.emoji.certo} Rodapé atualizado com sucesso`, ephemeral: true })


                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {
                            await configembedpainel(interaction, client, painel, 1)
                        } catch (error) { console.log(error) }

                    });
                })
            }


            if (interaction.customId.startsWith('editpainelplaceholder_')) {
                let painel = interaction.customId.split('_')[1]
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`**Place Holder Atual:**\n${client.db.PainelVendas.get(`${painel}.settings.placeholder`) == null ? '\`Envie o novo Texto abaixo:\`' : client.db.PainelVendas.get(`${painel}.settings.placeholder`)}\nEnvie o novo Texto abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)



                interaction.update({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.content == `cancelar`) {
                            await configembedpainel(interaction, client, painel, 1)
                            return
                        }

                        client.db.PainelVendas.set(`${painel}.settings.placeholder`, message.content)


                        await configembedpainel(interaction, client, painel, 1)
                        interaction.followUp({ content: `${global.emoji.certo} Texto atualizado com sucesso`, ephemeral: true })
                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {
                            await configembedpainel(interaction, client, painel, 1)
                        } catch (error) { console.log(error) }

                    });
                })
            }



            if (interaction.customId.startsWith('editpainelcolor_')) {
                let painel = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('editpainelcolor_' + painel)
                    .setTitle(`${obterEmoji(1)} | Alterar Cor Painel`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('editpainelcolor')
                    .setLabel("Nova Cor do seu Bot. (Hexadecimal):")
                    .setPlaceholder("#FF0000, #FF69B4, #FF1493")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }


            if (interaction.customId.startsWith('editpainelBanner_')) {
                const painel = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('editpainelBanner_' + painel)
                    .setTitle(` | Alterar Banner do Painel`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('editpainelBanner')
                    .setLabel("LINK BANNER:")
                    .setPlaceholder("NOVO BANNER")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }



            if (interaction.customId.startsWith('editpainelMiniatura_')) {
                const painel = interaction.customId.split('_')[1]
                const modalaAA = new ModalBuilder()
                    .setCustomId('editpainelMiniatura_' + painel)
                    .setTitle(`${obterEmoji(1)} | Alterar Miniatura do Painel`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('editpainelMiniatura')
                    .setLabel("LINK DA MINIATURA:")
                    .setPlaceholder("NOVO MINIATURA")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }
        }


        if (interaction.isAutocomplete()) {
            if (interaction.commandName == 'criar_painel') {

                var nomeDigitado = interaction.options.getFocused().toLowerCase();

                var produtosFiltrados = client.db.produtos.filter(x => {
                    const id = x?.data?.ID?.toLowerCase() || '';
                    const nome = x?.data?.settings?.name?.toLowerCase() || '';
                    return id.includes(nomeDigitado) || nome.includes(nomeDigitado);
                });

                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    return {
                        name: `ID - ${x.data.ID} | Nome - ${x.data.settings.name}`,
                        value: `${x.data.ID}`
                    };
                });

                interaction.respond(!config.length
                    ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }]
                    : config
                );
            }


            if (interaction.commandName == 'config_painel') {
                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.PainelVendas.filter(x => {
                    const id = x?.data?.ID?.toLowerCase() || '';
                    const titulo = x?.data?.settings?.title?.toLowerCase() || '';
                    return id.includes(nomeDigitado) || titulo.includes(nomeDigitado);
                });

                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    let title = x.data.settings.title || '';
                    title = title.length > 50 ? title.slice(0, 50) : title;

                    const name = `🖥 | Painel - ${title} (${x.data.ID})`;

                    return {
                        name: name,
                        value: `${x.data.ID}`
                    };
                });

                interaction.respond(!config.length
                    ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }]
                    : config
                );
            }



            if (interaction.commandName == 'set_painel') {
                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.PainelVendas.filter(x => {
                    const id = x?.data?.ID?.toLowerCase() || '';
                    const titulo = x?.data?.settings?.title?.toLowerCase() || '';
                    return id.includes(nomeDigitado) || titulo.includes(nomeDigitado);
                });

                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    let title = x.data.settings.title || '';
                    title = title.length > 50 ? title.slice(0, 50) : title;

                    return {
                        name: `🖥 | Painel - ${title} (${x.data.ID})`,
                        value: `${x.data.ID}`
                    };
                });

                interaction.respond(!config.length
                    ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }]
                    : config
                );
            }


            if (interaction.commandName == 'del') {
                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.produtos.filter(x => x?.data?.ID?.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {

                    return {
                        name: `ID - ${x.data.ID} | Nome - ${x.data.settings.name}`,
                        value: `${x.data.ID}`
                    }
                })
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }

            if (interaction.commandName == 'entregar') {
                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.produtos.filter(x => x?.data?.ID?.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {

                    return {
                        name: `ID - ${x.data.ID} | Nome - ${x.data.settings.name}`,
                        value: `${x.data.ID}`
                    }
                })
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }
        }

        if (interaction.isStringSelectMenu()) {

            if (interaction.customId.startsWith('changeemojipainelproduto_')) {
                const painel = interaction.customId.split('_')[1]
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`Envie o emoji para trocar no Painél:\n\nCaso queira cancelar escreva abaixo **cancelar**`)


                interaction.update({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.content == `cancelar`) {
                            await configprodutospainel(interaction, client, painel, 1)
                            return
                        }


                        function verificarEmoji(mensagem) {
                            const isEmoji = (char) => {
                                const code = char.codePointAt(0);
                                return (
                                    (code >= 0x1F600 && code <= 0x1F64F) ||
                                    (code >= 0x1F300 && code <= 0x1F5FF) ||
                                    (code >= 0x1F680 && code <= 0x1F6FF) ||
                                    (code >= 0x1F700 && code <= 0x1F77F) ||
                                    (code >= 0x1F900 && code <= 0x1F9FF) ||
                                    (code >= 0x1FA70 && code <= 0x1FAFF) ||
                                    (code >= 0x2600 && code <= 0x26FF) ||
                                    (code >= 0x2700 && code <= 0x27BF) ||
                                    (code >= 0x1F1E6 && code <= 0x1F1FF) ||
                                    (code >= 0x1F900 && code <= 0x1F9FF) ||
                                    (code >= 0x1F91A && code <= 0x1F91F) ||
                                    code === 0x1F91D
                                );
                            };
                            for (const char of [...mensagem]) {
                                if (isEmoji(char)) {
                                    return true;
                                }
                            }

                            if (mensagem.includes('<:') || mensagem.includes('<a:')) {
                                return true;
                            }

                            return false;
                        }

                        if (verificarEmoji(message.content) == false) {
                            await configprodutospainel(interaction, client, painel, 1)
                            interaction.followUp({ content: `${global.emoji.errado} Você inseriu um emoji invalido para seu BOT;`, ephemeral: true })
                            return
                        }

                        await client.db.produtos.set(`${interaction.values[0]}.painel.emoji`, message.content)
                        await configprodutospainel(interaction, client, painel, 1)
                        interaction.followUp({ content: `${global.emoji.certo} Emoji atualizado com sucesso`, ephemeral: true })

                        let up = await interaction.followUp({ content: `${global.emoji.loading_promisse} | Atualizando Mensagem do Painel...`, ephemeral: true })
                        await atualizarmensagempainel(interaction.guild.id, painel, client)
                        await interaction.editReply({ content: `${global.emoji.certo} Mensagem do Painel Atualizada com Sucesso!`, ephemeral: true, message: up })
                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {
                            await configprodutospainel(interaction, client, painel, 1)
                        } catch (error) { console.log(error) }

                    });
                })
            }

            if (interaction.values[0] === 'nada') {
                interaction.deferUpdate()
            }
        }

    }
}