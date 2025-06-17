const Discord = require("discord.js");
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder} = require('discord.js');
const { obterEmoji } = require("../Handler/EmojiFunctions");
const { atualizarmensagempainel } = require("./PainelSettingsAndCreate");


async function StartConfigProduto(interaction, produto, client, a) {
    var u = client.db.produtos.get(`${produto}.settings.price`)

    var s = await client.db.produtos.get(`${produto}.settings.estoque`)

    const gfgf = await client.db.produtos.get(`${produto}`)

    if (gfgf == null) {
        await interaction.reply({ content: `${global.emoji.errado} Esse produto não existe!`, ephemeral: true })
        return
    }

    var ggg = client.db.produtos.get(`${produto}.settings.CargosBuy`)

    if (ggg == null) {
        ggg = `\`Todos Cargos!\``
    } else {
        let roleMentions = '';

        for (const roleId of ggg) {
            roleMentions += `\n- <@&${roleId}>`;
        }
        ggg = roleMentions;
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#ADD8E6' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

        .addFields(
            { name: `${global.emoji.calendarioooo} Descrição do Produto`, value: `${client.db.produtos.get(`${produto}.settings.desc`)}`, inline: false },
            { name: `${global.emoji.chavefenda} Identificação do Produto`, value: `\`${client.db.produtos.get(`${produto}.ID`)}\``, inline: true },
            { name: `${global.emoji.dev} Nome do produto`, value: `\`${client.db.produtos.get(`${produto}.settings.name`)}\``, inline: true },
            { name: `${global.emoji.dinheiro2} Preço`, value: `\`${Number(u).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``, inline: true },
            { name: `${global.emoji.caixa} Quantidade de Estoque`, value: `\`${s == null ? 0 : Object.keys(s).length}\``, inline: true },
            { name: `${global.emoji.usuario2} Cargos que podem comprar`, value: `${ggg}`, inline: false }
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("alterarnomeproduto_" + produto)
                .setLabel('NOME')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("alterarpriceproduto_" + produto)
                .setLabel('PREÇO')
                .setEmoji(`1233103068942569543`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("alterardescproduto_" + produto)
                .setLabel('DESCRIÇÃO')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("alterarestoqueproduto_" + produto)
                .setLabel('ESTOQUE')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configavancadaproduto_" + produto)
                .setLabel('Configurações Avançadas')
                .setEmoji(`1237120481887518850`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone_" + produto)
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1238978383845654619`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("deletarproduto_" + produto)
                .setLabel('Deletar')
                .setEmoji(`1229787813046915092`)
                .setStyle(4),
            new ButtonBuilder()
                .setCustomId("infoproduto_" + produto)
                .setEmoji(`1243277106079600641`)
                .setStyle(1)
        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("CargosBuyer_" + produto)
                .setLabel('Cargos autorizados comprar')
                .setEmoji(`1233127515141308416`)
                .setStyle(3)
        )



    if (interaction.message == undefined) {
        await interaction.reply({ embeds: [embed], components: [row, row2, row3], flags: [Discord.MessageFlags.Ephemeral] })
    } else {
        if (a == 1) {
            return interaction.editReply({ embeds: [embed], components: [row, row2, row3] })
        }
        interaction.update({ embeds: [embed], components: [row, row2, row3] })
    }
}

function alterarnomeproduto(interaction, produto, client) {
    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`🏷️ | **Nome Atual:** ${client.db.produtos.get(`${produto}.settings.name`)}\n\nEnvie o novo nome abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)

    interaction.update({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, 1)
                return
            }

            if (message.content == '') {
                await StartConfigProduto(interaction, produto, client, 1)
                interaction.followUp({ content: `${global.emoji.errado} Você não pode deixar o nome vazio!`, ephemeral: true })
                return
            }
            client.db.produtos.set(`${produto}.settings.name`, message.content)
            await StartConfigProduto(interaction, produto, client, 1)
            interaction.followUp({ content: `${global.emoji.certo} O nome foi atualizado com sucesso para \`${message.content}\`.`, ephemeral: true })
        })
        collector.on('end', async (message) => {
            message.delete()
            collector.stop()
            if (message.size >= 1) return
            try {
                await StartConfigProduto(interaction, produto, client, 1)
            } catch (error) {

            }

        });
    })
}

function alterarpriceproduto(interaction, produto, client) {
    var u = client.db.produtos.get(`${produto}.settings.price`)
    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(14)} | **Preço Atual:** ${Number(u).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\n\nEnvie o novo preço abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)


    interaction.update({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, 1)
                return
            }

            if (message.content == '') {
                await StartConfigProduto(interaction, produto, client, 1)
                interaction.followUp({ content: `${global.emoji.errado} Você não pode enviar algo vazio!`, ephemeral: true })
                return
            }
            if (isNaN(message.content)) {
                await StartConfigProduto(interaction, produto, client, 1)
                interaction.followUp({ content: `${global.emoji.errado} Você não pode utilizar algo diferente de numeros e ponto!`, ephemeral: true })
                return
            }
            client.db.produtos.set(`${produto}.settings.price`, Number(message.content))

            await StartConfigProduto(interaction, produto, client, 1)
            interaction.followUp({ content: `${global.emoji.certo} O preço foi atualizado com sucesso para \`${Number(message.content).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`.`, ephemeral: true })

            var kkkkkkk = client.db.PainelVendas.fetchAll()
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
            const idEncontrado = encontrarProdutoPorNome(kkkkkkk, produto);
            if (idEncontrado !== null) {
                atualizarmensagempainel(interaction.guild.id, idEncontrado, client)
            }
            atualizarmessageprodutosone(interaction, client, produto)

        })
        collector.on('end', async (message) => {
            message.delete()
            collector.stop()
            if (message.size >= 1) return
            try {
                await StartConfigProduto(interaction, produto, client, 1)
            } catch (error) {

            }

        });
    })
}

function alterardescproduto(interaction, produto, client) {
    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(19)} | **Descrição atual:** \`\`\`${client.db.produtos.get(`${produto}.settings.desc`)}\`\`\`\nEnvie a nova descrição abaixo, Caso queira pode utilizar variaveis \n- \`#{nome}\`\n- \`#{preco}\`\n- \`#{estoque}\`\n\n- Atenção as variaveis só funciona caso o \`Estilo de Mensagem\` esteja \`ATIVA\` nas configurações, caso esteja desativada utilize \`/PERSONALIZAR\`\n\nCaso queira cancelar escreva abaixo **cancelar**
`)

    interaction.update({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, 1)
                return
            }

            if (message.content == '') {
                StartConfigProduto(interaction, produto, client, 1)
                interaction.followUp({ content: `${global.emoji.errado} Você não pode enviar algo vazio!`, ephemeral: true })
                return
            }
            client.db.produtos.set(`${produto}.settings.desc`, message.content)
            await StartConfigProduto(interaction, produto, client, 1)
            interaction.followUp({ content: `${global.emoji.certo} A descrição foi atualizada com sucesso para \`${message.content}\`.`, ephemeral: true })


            var kkkkkkk = client.db.PainelVendas.fetchAll()
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
            const idEncontrado = encontrarProdutoPorNome(kkkkkkk, produto);
            if (idEncontrado !== null) {
                atualizarmensagempainel(interaction.guild.id, idEncontrado, client)
            }
            atualizarmessageprodutosone(interaction, client, produto)
        })


        collector.on('end', async (message) => {
            message.delete()
            collector.stop()
            if (message.size >= 1) return
            try {
                await StartConfigProduto(interaction, produto, client, 1)
            } catch (error) {

            }

        });
    })
}




async function alterarestoqueproduto(interaction, produto, client, a) {
    const u = client.db.produtos.get(`${produto}.settings.estoque`)
    var result = '';
    for (const key in u) {
        result += `${obterEmoji(12)}**| ` + key + '** - ' + u[key] + '\n';
    }
    if (result == '') result = 'Sem estoque, adicione'

    var fot = 'Esse é seu estoque completo!'
    if (result.length >= 2048) {
        result = result.substring(0, 2000); // Obter os primeiros 2000 caracteres
        fot = "Existem + produtos no estoque, faça um backup para ver seu estoque completo!";
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(19)} | Este é seu estoque:\n\n${result}`)
        .setFooter({ text: `${fot}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addstock_" + produto)
                .setLabel('Adicionar estoque')
                .setEmoji(`1233110125330563104`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("remstock_" + produto)
                .setLabel('Remover estoque')
                .setEmoji(`1242907028079247410`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("backupstock_" + produto)
                .setLabel('Realizar Backup do Estoque')
                .setEmoji(`1229787811205353493`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("clearstock_" + produto)
                .setLabel('Limpar Estoque')
                .setEmoji(`1229787813046915092`)
                .setStyle(4)
        )
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone_" + produto)
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1238978383845654619`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("vltconfigstart_" + produto)
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )

    if (a == 1) {
        return interaction.editReply({ content: ``, embeds: [embed], components: [row, row2] })
    }

    await interaction.update({ content: ``, embeds: [embed], components: [row, row2] })

}

async function configavancadaproduto(interaction, produto, client) {

    let statuscupom = client.db.produtos.get(`${produto}.embedconfig.cupom`) == true ? 'Pode utilizar cupom nesse produto!' : `Não pode utilizar nenhum cupom nesse produto!`
    let label
    let emoji
    let ButtonStyle

    if (statuscupom == 'Pode utilizar cupom nesse produto!') {
        label = 'Desativar Cupons'
        emoji = '1238978047504547871'
        ButtonStyle = 4
    } else {
        label = 'Ativar Cupons'
        emoji = '1238977621220655125'
        ButtonStyle = 3
    }

    let bannerproduto = client.db.produtos.get(`${produto}.embedconfig.banner`) == null ? 'Não definido' : `[Banner](${client.db.produtos.get(`${produto}.embedconfig.banner`)})`
    let miniaturaproduto = client.db.produtos.get(`${produto}.embedconfig.miniatura`) == null ? 'Não definido' : `[Miniatura](${client.db.produtos.get(`${produto}.embedconfig.miniatura`)})`
    let cargoproduto = client.db.produtos.get(`${produto}.embedconfig.cargo.name`) == null ? 'Não definido' : `<@&${client.db.produtos.get(`${produto}.embedconfig.cargo.name`)}>`
    let colorproduto = client.db.produtos.get(`${produto}.embedconfig.color`) == null ? '#ADD8E6' : `${client.db.produtos.get(`${produto}.embedconfig.color`)}`
    let categoriaproduto = client.db.produtos.get(`${produto}.embedconfig.categoria`) == null ? 'Não definido' : `<#${client.db.produtos.get(`${produto}.embedconfig.categoria`)}>`
    let cupomproduto = client.db.produtos.get(`${produto}.embedconfig.cupom`) == true ? 'Pode utilizar cupom nesse produto!' : `Não pode utilizar nenhum cupom nesse produto!`

    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: `${client.user.username} | Configurações Avançadas` })
        .setDescription(`- Configurações do Produto: \`${produto}\``)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setFields(
            { name: 'Categoria', value: `${categoriaproduto}`, inline: true },
            { name: 'Banner', value: `${bannerproduto}`, inline: true },
            { name: 'Miniatura', value: `${miniaturaproduto}`, inline: true },
            { name: 'Cargo', value: `${cargoproduto}`, inline: true },
            { name: 'Cor Embed', value: `${colorproduto}`, inline: true },
            { name: 'Cupom', value: `${cupomproduto}`, inline: true }
        )



    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("BannerChangeProduto_" + produto)
                .setLabel('Banner')
                .setEmoji(`🖼️`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("MiniaturaChangeProduto_" + produto)
                .setLabel('Miniatura')
                .setEmoji(`🖼️`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("CargoChangeProduto_" + produto)
                .setLabel('Cargo')
                .setEmoji(`1233127515141308416`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("CorEmbedProduto_" + produto)
                .setLabel('Cor Embed')
                .setEmoji(`1233129471922540544`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("CategoriaProdutoChangeeee_" + produto)
                .setLabel('Definir Categoria')
                .setEmoji(`1233127513178247269`)
                .setStyle(2)
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("togglecuponsprodutoo_" + produto)
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(ButtonStyle),
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone_" + produto)
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1238978383845654619`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("vltconfigstart_" + produto)
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )

    await interaction.update({ embeds: [embed], components: [row, row2] })
}



async function CargoChangeProduto(interaction, client, produto) {
    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Outras Configurações`)
        .setDescription(`${obterEmoji(13)} | Cargo:  ${client.db.produtos.get(`${produto}.embedconfig.cargo.name`) == null ? 'Não configurado.' : `<@&${client.db.produtos.get(`${produto}.embedconfig.cargo.name`)}>`}\n🕒 | Cargo Temporário: \`${client.db.produtos.get(`${produto}.embedconfig.cargo.tempo`) == null ? 'Não configurado.' : `${client.db.produtos.get(`${produto}.embedconfig.cargo.tempo`)}`} dias\``)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("setroleproduto_" + produto)
                .setLabel('Setar Cargo')
                .setEmoji(`1233127515141308416`)
                .setStyle(1)
                .setDisabled(false)
        )
    if (client.db.produtos.get(`${produto}.embedconfig.cargo.name`) == null) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId("settemproleproduto_" + produto)
                .setLabel('Cargo Temporário On/Off')
                .setEmoji('1233127515141308416')
                .setStyle(1)
                .setDisabled(true)
        );
    } else {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId("settemproleproduto_" + produto)
                .setLabel('Cargo Temporário On/Off')
                .setEmoji('1233127515141308416')
                .setStyle(1)
                .setDisabled(false)
        );
    }
    row.addComponents(
        new ButtonBuilder()
            .setCustomId("vlarteconfigavancadaproduto_" + produto)
            .setEmoji(`1237055536885792889`)
            .setStyle(1)
            .setDisabled(false),
    );

    interaction.update({ embeds: [embed], components: [row] })
}

async function atualizarmessageprodutosone(interaction, client, produto) {
    const produtoID = produto
    const settingsPath = `${produtoID}.settings`;
    const produtos2 = client.db.produtos.get(produtoID);
    const produtoSettings = client.db.produtos.get(settingsPath);
    const estoque = client.db.produtos.get(`${settingsPath}.estoque`) || {};
    const nome = produtoSettings.name;
    const preco = Number(produtoSettings.price).toLocaleString(global.lenguage.um, {
        style: 'currency',
        currency: global.lenguage.dois,
    });
    let desc = produtoSettings.desc;
    const estoqueQtd = Object.keys(estoque).length;

    const embedDefaults = client.db.DefaultMessages.get(`ConfigGeral`);
    const embedTitle = embedDefaults.embedtitle
        .replace('#{nome}', nome)
        .replace('#{preco}', preco)
        .replace('#{estoque}', estoqueQtd);

    const embedDesc = embedDefaults.embeddesc
        .replace('#{nome}', nome)
        .replace('#{preco}', preco)
        .replace('#{estoque}', estoqueQtd)
        .replace('#{desc}', desc
            .replace('#{nome}', nome)
            .replace('#{preco}', preco)
            .replace('#{estoque}', estoqueQtd)
        );

    const configGeralColor = client.db.General.get(`ConfigGeral.ColorEmbed`);
    const embedColor = produtos2.embedconfig?.color || (configGeralColor === '#008000' ? '#ADD8E6' : configGeralColor);

    const embed = new Discord.EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(embedDesc)
        .setColor(embedColor);

    const { banner, miniatura } = produtos2.embedconfig || {};
    if (banner) embed.setImage(banner);
    if (miniatura) embed.setThumbnail(miniatura);


    const rodape = embedDefaults.embedrodape;
    if (rodape) embed.setFooter({ text: rodape });

    try {
        const { ChannelID, MessageID } = client.db.produtos.get(produtoID);
        const channel = await client.channels.fetch(ChannelID);
        const fetchedMessage = await channel.messages.fetch(MessageID);

        if (client.db.General.get(`ConfigGeral.EstiloMensagens`)) {
            const content = desc
                .replace('#{nome}', nome)
                .replace('#{preco}', preco)
                .replace('#{estoque}', estoqueQtd);
            await fetchedMessage.edit({ content, embeds: [] });

        } else {
            await fetchedMessage.edit({ embeds: [embed], content: '', files: [] });
        }

        if (!produto) {
            await interaction.reply({
                content: `${global.emoji.certo} Atualizada mensagem do produto: \`${nome}\` (\`${produtoID}\`)`,
                ephemeral: true,
            });
        }

    } catch (error) {
        return {
            content: `mensagem não encontrada!`,
        }
    }
}


module.exports = {
    StartConfigProduto,
    alterarnomeproduto,
    alterarpriceproduto,
    alterardescproduto,
    alterarestoqueproduto,
    configavancadaproduto,
    CargoChangeProduto,
    atualizarmessageprodutosone
};