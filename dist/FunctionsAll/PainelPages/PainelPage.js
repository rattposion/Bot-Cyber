const { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require('discord.js');

function PainelPages(interaction, painel, page, client) {

    const embed = `Selecione o produto que deseja adicionar ao painel \`${painel}\`\n\nCaso queira voltar clique no botão abaixo.`
    let produtos = client.db.produtos.filter(x => !client.db.PainelVendas.get(`${painel}.produtos`).includes(x.data.ID))
    const itemsPerPage = 24;
    const getPageData = (page, allVendas) => allVendas.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const allVendas = getPageData(page, produtos);

    if (allVendas.length == 0) return interaction.reply({ content: `${global.emoji.errado} Nenhum produto encontrado!`, embeds: [], components: [], ephemeral: true })

    let maxPage = Math.ceil(produtos.length / itemsPerPage)

    let produtosEmbed = []
    allVendas.map(x => {
        produtosEmbed.push({
            label: `Nome: ${String(x.data.settings.name).slice(0, 40)} (${x.data.ID})`,
            value: `${x.data.ID}`
        })
    })


    let CompSleect = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('addprodutopainel_' + painel + '_' + page)
                .setPlaceholder('Selecione o Produto')
                .addOptions(produtosEmbed)
                .setMinValues(1)
                .setMaxValues(1)
        )

    let compVoltar = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`configprodutospainel_${painel}`)
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    const generatePaginationRow = (page, maxPage, customIdPrefix) => {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`${customIdPrefix}_${painel}_${Number(page) - 1}`)
                .setEmoji(`<:seta_esquerda:1257790237929767032>`)
                .setStyle(2)
                .setDisabled(Number(page) === 1),
            new ButtonBuilder()
                .setCustomId(`${customIdPrefix}_paginaSelecionada`)
                .setLabel(`${page} de ${maxPage == 0 ? 1 : maxPage}`)
                .setStyle(2)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`${customIdPrefix}_${painel}_${Number(page) + 1}`)
                .setEmoji(`<:seta_direita:1257790236524806165>`)
                .setStyle(2)
                .setDisabled(Number(page) >= Number(maxPage)),
        );
    };

    const row2Bloqueados = generatePaginationRow(page, maxPage, 'paginasPainelAdd');


    interaction.update({ content: embed, embeds: [], components: [CompSleect, row2Bloqueados, compVoltar] })


}

module.exports = { PainelPages };