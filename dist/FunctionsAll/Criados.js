
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js");
const { getSaudacao } = require("./PermissionAPI/PermissionGet");

function CriadosStart(interaction, client) {

    let qtdProdutos = client.db.produtos.fetchAll().length
    let qtdCupons = client.db.Cupom.fetchAll().length
    let qtdKeys = client.db.Keys.fetchAll().length
    let qtdGifts = client.db.giftcards.fetchAll().length
    let qtdDrops = client.db.drops.fetchAll().length


    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Criados')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de criados, desenvolvido especialmente para visualizar seus produtos, keys, gifts, entre outras diversos sistemas criados dentro de nosso bot de vendas.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Quantidades`, value: `-# - Quantidade de Produtos: ${qtdProdutos}\n-# - Quantidade de Cupons: ${qtdCupons}\n-# - Quantidade de Keys: ${qtdKeys}\n-# - Quantidade de Gifts: ${qtdGifts}\n-# - Quantidade de Drops: ${qtdDrops}`, inline: false },
        );


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("criadosproduto")
                .setLabel('Produtos')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("criadoscupons")
                .setLabel('Cupons')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("criadoskeys")
                .setLabel('Keys')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("criadosgifts")
                .setLabel('GiftCards')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("criadossemstock")
                .setLabel('Produtos sem Estoque')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("criadosdrop")
                .setLabel('Drops')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
        )
    if (interaction.message == undefined) {
        interaction.reply({ embeds: [embed], components: [row, row2], fetchReply: true, ephemeral: true })
    } else {
        interaction.update({ embeds: [embed], components: [row, row2], fetchReply: true, ephemeral: true })
    }

}

async function paginascreate(interaction, title, blocks, client, a) {
    const pages = splitIntoPages(blocks);
    let pageNumber = 1;

    let embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`Painel De ${title}`)
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de criados, desenvolvido especialmente para visualizar seus produtos, keys, gifts, entre outras diversos sistemas criados dentro de nosso bot de vendas.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Dados Capturados`, value: `${pages[pageNumber - 1]}`, inline: false },
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("paginaanterior")
                .setEmoji(`<:seta_esquerda:1242906050479259679>`)
                .setStyle(2)
                .setDisabled(pageNumber === 1),
            new ButtonBuilder()
                .setCustomId("selecionarpagina")
                .setLabel(`${pageNumber} de ${pages.length}`)
                .setStyle(2)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("paginaseguinte")
                .setEmoji(`<:seta_direita:1242906048994742393>`)
                .setStyle(2)
                .setDisabled(pageNumber === pages.length),
        )

    let voltar = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltarCriadosRestart")
                .setEmoji(`<:seta_esquerda:1242906050479259679>`)
                .setStyle(2)
                .setDisabled(false))
    let message
    if (a == 1) {
        message = await interaction.reply({ embeds: [embed], components: [row, voltar], fetchReply: true, ephemeral: true })
    } else {
        message = await interaction.update({ embeds: [embed], components: [row, voltar], fetchReply: true, ephemeral: true })
    }

    message.then(msg => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button });
        collector.on('collect', i => {
            let newPageNumber = pageNumber;

            switch (i.customId) {
                case 'primeirapagina':

                    newPageNumber = 1;
                    break;
                case 'ultimapagina':

                    newPageNumber = pages.length;
                    break;
                case 'paginaseguinte':

                    newPageNumber = Math.min(pageNumber + 1, pages.length);
                    break;
                case 'paginaanterior':

                    newPageNumber = Math.max(pageNumber - 1, 1);
                    break;

                default:
                    break;
            }

            if (newPageNumber !== pageNumber) {
                pageNumber = newPageNumber;
                i.deferUpdate();
                updateMessageWithPages(pages, pageNumber, interaction, title, client);
            }
        });

    });
}

function updateMessageWithPages(pages, pageNumber, interaction, title, client) {
    let embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`Painel De ${title}`)
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de criados, desenvolvido especialmente para visualizar seus produtos, keys, gifts, entre outras diversos sistemas criados dentro de nosso bot de vendas.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Dados Capturados`, value: `${pages[pageNumber - 1]}`, inline: false },
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("paginaanterior")
                .setEmoji(`<:seta_esquerda:1242906050479259679>`)
                .setStyle(2)
                .setDisabled(pageNumber === 1),
            new ButtonBuilder()
                .setCustomId("selecionarpagina")
                .setLabel(`${pageNumber} de ${pages.length}`)
                .setStyle(2)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("paginaseguinte")
                .setEmoji(`<:seta_direita:1242906048994742393>`)
                .setStyle(2)
                .setDisabled(pageNumber === pages.length),
        );

    let voltar = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltarCriadosRestart")
                .setEmoji(`<:seta_esquerda:1242906050479259679>`)
                .setStyle(2)
                .setDisabled(false))

    interaction.editReply({ embeds: [embed], components: [row, voltar], fetchReply: true, ephemeral: true }).catch(error => {
    });
}

function splitIntoPages(blocks) {
    const pages = [];
    let currentPage = '';

    for (let i = 0; i < blocks.length; i++) {
        currentPage += blocks[i] + '\n';

        if ((i + 1) % 10 === 0) {
            pages.push(currentPage);
            currentPage = '';
        }
    }

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    return pages;
}

function produtoscriados(interaction, client) {

    var u = client.db.produtos.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii];
        const idproduto = u[iiiiii].data.ID
        const nameproduto = u[iiiiii].data.settings.name
        const priceproduto = u[iiiiii].data.settings.price

        const estoqueproduto = Object.keys(u[iiiiii].data.settings.estoque).length

        blocks.push(`-# - ID: \`${idproduto}\` - Nome: \`${nameproduto}\` - Preço: \`${Number(priceproduto).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\` - Quantidade: \`${estoqueproduto}\``)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true })

    var title = 'Produtos'
    paginascreate(interaction, title, blocks, client);
}

function criadoscupons(interaction, client) {

    var u = client.db.Cupom.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        const valorminimo = u[iiiiii].data.valorminimo

        const porcentagem = u[iiiiii].data.porcentagem
        const quantidade = u[iiiiii].data.quantidade

        blocks.push(`-# - Nome: \`${element}\` - Porcentagem: \`${porcentagem}%\` - Valor Mínimo: \`${Number(valorminimo).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\` - Quantidade: \`${quantidade}\``)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Cupons'
    paginascreate(interaction, title, blocks, client);
}

function criadoskeys(interaction, client) {
    var u = client.db.Cupom.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        let cargo = u[iiiiii].data.cargo
        cargo = cargo ? `<@&${cargo}>` : '\`Nenhum cargo definido\`'
        let cargo2 = u[iiiiii].data.cargo || '\`0\`'

        blocks.push(`-# - Key: \`${element}\` - ID do cargo: ${cargo2} -  Cargo: ${cargo}`)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Keys'
    paginascreate(interaction, title, blocks, client);
}

function criadosgifts(interaction, client) {
    var u = client.db.giftcards.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        const cargo = u[iiiiii].data.valor

        blocks.push(`-# - GiftCard: \`${element}\` - Valor do Gift: \`${Number(cargo).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true })
    var title = 'GiftCards'
    paginascreate(interaction, title, blocks, client);
}

function criadosdrop(interaction, client) {
    var u = client.db.drops.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        const premio = u[iiiiii].data.premio

        blocks.push(`-# - Código: \`${element}\` -  Item Entregue: \`${premio}\``)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true })
    var title = 'Drops'
    paginascreate(interaction, title, blocks, client);
}










function rankprosdutos(interaction, client) {
    var u = client.db.estatisticas.fetchAll()

    function compararPorTotalQtd(a, b) {
        return b.data.TotalQtd - a.data.TotalQtd;
    }

    var bb = u.sort(compararPorTotalQtd);

    // Exibir a lista ordenada


    var position = -1;
    var blocks = []
    for (var i = 0; i < bb.length; i++) {

        if (i === 0) {
            emoji = '🥇';
        } else if (i === 1) {
            emoji = '🥈';
        } else if (i === 2) {
            emoji = '🥉';
        } else {
            emoji = '🏅';
        }

        var ia = client.db.produtos.get(bb[i].ID)
        if (ia !== null) {
            blocks.push(`${emoji} | **__${i + 1}°__** - ${ia.settings.name} - ${ia.ID}\n💳 | Rendeu: **${Number(bb[i].data.TotalPrice).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}**\n🛒 | Total de Vendas: **${Number(bb[i].data.TotalQtd)}**`);
        }
    }

    var title = 'Rank Produtos:'
    if (blocks.length == 0) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Nenhum produto foi vendido até momento para criação de um RANK`, iconURL: `https://cdn.discordapp.com/emojis/1249255826602852372.webp?size=96&quality=lossless` })
            .setColor('Green')

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
    paginascreate(interaction, title, blocks, client);
}

function rank(interaction, client) {
    var u = client.db.usuariosinfo.fetchAll()
    var blocks = []
    u.sort((a, b) => b.data.gastos - a.data.gastos);
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        const price = u[iiiiii].data.gastos
        const qtd = u[iiiiii].data.qtdprodutos
        blocks.push(`**${iiiiii + 1}°.** <@!${element}>, total de \`${Number(price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\` gastos e \`${qtd}\` pedido(s).`);
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.update({ embeds: [embed], ephemeral: true, fetchReply: true })

    var title = 'Gastos'
    paginascreate(interaction, title, blocks, client, 1);
}



function criadossemstock(interaction, client) {

    var u = client.db.produtos.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii];
        const idproduto = u[iiiiii].data.ID
        const nameproduto = u[iiiiii].data.settings.name
        const priceproduto = u[iiiiii].data.settings.price
        const pessoas = u[iiiiii].data.settings.notify

        var tt = 0

        if (pessoas !== null && pessoas !== 0 && pessoas !== undefined) {
            tt = pessoas.length
        } else {
            tt = 0
        }

        const estoqueproduto = Object.keys(u[iiiiii].data.settings.estoque).length

        if (estoqueproduto <= 0) {
            blocks.push(`-# - ID: \`${idproduto}\` - Nome: \`${nameproduto}\` - Preço: \`${Number(priceproduto).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\` - Fila de Espera: \`${tt}\``)
        }
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Produtos:'
    paginascreate(interaction, title, blocks, client);
}

module.exports = {
    CriadosStart,
    paginascreate,
    produtoscriados,
    criadoscupons,
    criadoskeys,
    criadossemstock,
    criadosgifts,
    criadosdrop,
    rank,
    rankprosdutos
};