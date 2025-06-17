const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle } = require("discord.js");
const { QuickDB } = require("quick.db");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const db = new QuickDB();
var uu = db.table('painelsettings')

function createpainel(interaction, client, painelid, produto, namepainel) {

    const colorEmbed = client.db.General.get(`ConfigGeral.ColorEmbed`);
    const embed = new EmbedBuilder()
        .setTitle(namepainel)
        .setDescription('Não configurado ainda...')
        .setColor(colorEmbed === '#008000' ? '#000000' : colorEmbed);

    const produtoInfo = client.db.produtos.get(produto);
    if (!produtoInfo) {
        return interaction.reply({
            ephemeral: true,
            content: `${global.emoji.errado} O produto selecionado não existe ou não está cadastrado.`,
        })
    }
    const precoFormatado = Number(produtoInfo.settings.price).toLocaleString(global.lenguage.um, {
        style: 'currency',
        currency: global.lenguage.dois,
    });
    const estoque = Object.keys(produtoInfo.settings.estoque).length;

    const style2row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('buyprodutoporselect')
            .setPlaceholder('Selecione um Produto.')
            .addOptions([
                {
                    label: produtoInfo.settings.name,
                    description: `💸 | Valor: ${precoFormatado} - 📦 | Estoque: ${estoque}`,
                    emoji: global.emoji.carrinhobranco,
                    value: produto,
                },
            ])
    );

    const rows = [style2row];

    const statusDuvidas = client.db.General.get(`ConfigGeral.statusduvidas`);
    if (statusDuvidas) {
        const duvidasRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setURL(client.db.General.get(`ConfigGeral.channelredirectduvidas`) || 'https://www.youtube.com/')
                .setLabel(client.db.General.get(`ConfigGeral.textoduvidas`) || 'Dúvida')
                .setStyle(ButtonStyle.Link)
                .setEmoji(client.db.General.get(`ConfigGeral.emojiduvidas`) || '🔗')
                .setDisabled(false)
        );
        rows.push(duvidasRow);
    }

    const estiloMensagens = client.db.General.get(`ConfigGeral.EstiloMensagens`);
    const messageOptions = estiloMensagens
        ? { content: namepainel, components: rows, embeds: [] }
        : { content: '', embeds: [embed], components: rows };

    interaction.channel.send(messageOptions).then((msg) => {
        client.db.PainelVendas.set(painelid, {
            ID: painelid,
            produtos: [produto],
            ChannelID: msg.channel.id,
            MessageID: msg.id,
            settings: {
                title: namepainel,
                desc: 'Não configurado ainda...',
            },
        });
    });

    interaction.reply({
        ephemeral: true,
        content: `${obterEmoji(8)} | Painel criado com sucesso! Use **/config_painel** \`${painelid}\` para configurá-lo.`,
    });
}


function configpainel(interaction, painel, client) {

    const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Gerenciar Painel`)
        .setDescription(`Escolha oque deseja gerenciar:`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configembedpainel_" + painel)
                .setLabel('Configurar Embed')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("configprodutospainel_" + painel)
                .setLabel('Configurar Produtos')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
        )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("atualizarmensagempainel_" + painel)
            .setLabel('Atualizar Painel')
            .setEmoji(`1238978383845654619`)
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("deletarpainel_" + painel)
            .setLabel('Deletar')
            .setEmoji(`1229787813046915092`)
            .setStyle(4)
    )

    if (interaction.message == undefined) {
        interaction.reply({ components: [row, row2], embeds: [embed], ephemeral: true })
    } else {
        interaction.update({ embeds: [embed], components: [row, row2], ephemeral: true })
    }
}


async function configembedpainel(interaction, client, painel, status) {


    const embed = new EmbedBuilder()
        .setTitle(`Tíltulo Atual: ${client.db.PainelVendas.get(`${painel}.settings.title`)}`)
        .setDescription(`${obterEmoji(19)} **| Descrição Atual:**\n${client.db.PainelVendas.get(`${painel}.settings.desc`)}\n\n🎨 | Cor da Embed: ${client.db.PainelVendas.get(`${painel}.settings.color`) == null ? '#000000' : client.db.PainelVendas.get(`${painel}.settings.color`)}\n📒 | Texto do Place Holder: ${client.db.PainelVendas.get(`${painel}.settings.placeholder`) == null ? 'Selecione um Produto' : client.db.PainelVendas.get(`${painel}.settings.placeholder`)}\n📂 | Banner: ${client.db.PainelVendas.get(`${painel}.settings.banner`) == null ? 'Painel Sem Banner.' : `[Banner](${client.db.PainelVendas.get(`${painel}.settings.banner`)})`}\n🖼️ | Miniatura: ${client.db.PainelVendas.get(`${painel}.settings.miniatura`) == null ? 'Painel Sem Miniatura.' : `[Miniatura](${client.db.PainelVendas.get(`${painel}.settings.miniatura`)})`}`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setFooter({ text: `Rodapé Atual: ${client.db.PainelVendas.get(`${painel}.settings.rodape`) == null ? 'Sem Rodapé' : client.db.PainelVendas.get(`${painel}.settings.rodape`)}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editpainelembed_" + painel)
                .setLabel('Título da embed')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpaineldesc_" + painel)
                .setLabel('Descrição da embed')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpainelrodape_" + painel)
                .setLabel('Rodapé da embed')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpainelplaceholder_" + painel)
                .setLabel('Place Holder')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpainelcolor_" + painel)
                .setLabel('Cor Embed')
                .setEmoji(`1233129471922540544`)
                .setStyle(2)
                .setDisabled(false),)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editpainelBanner_" + painel)
                .setLabel('Banner')
                .setEmoji(`🖼️`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpainelMiniatura_" + painel)
                .setLabel('Miniatura')
                .setEmoji(`🖼️`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("atualizarmensagempainel_" + painel)
                .setLabel('Atualizar Painel')
                .setEmoji(`1238978383845654619`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("uay89efg7t9a7wa87dawgbydaid76_" + painel)
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    if (status == 1) {
        return await interaction.editReply({ embeds: [embed], components: [row, row2], ephemeral: true })
    }

    await interaction.update({ embeds: [embed], components: [row, row2] })
}




async function configprodutospainel(interaction, client, painel, status) {

    var tt = client.db.PainelVendas.get(`${painel}.produtos`)

    const options = [];
    var messageeee = ''
    for (let iiii = 0; iiii < tt.length; iiii++) {
        const element = tt[iiii];
        var bb = client.db.produtos.get(`${element}`)
        messageeee += `${bb.painel == null ? `${global.emoji.carrinhobranco}` : bb.painel.emoji} \`${iiii}°\` - Nome: \`${bb.settings.name}\` ( **ID:** \`${bb.ID}\` )\n`


        const option = {
            label: `${bb.settings.name}`,
            description: `💸 | Valor: ${Number(bb.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })} - 📦 | Estoque: ${Object.keys(bb.settings.estoque).length}`,
            emoji: `${bb.painel == null ? `${global.emoji.carrinhobranco}` : bb.painel.emoji}`,
            value: `${bb.ID}`,
        };

        options.push(option);

    }

    if (options == 0) {
        const options2 = {
            label: `Nenhum Produto Cadastrado nesse Painel!`,
            emoji: `1229787813046915092`,
            value: `nada`,
        };

        options.push(options2);
        messageeee += `Sem Produtos, adicione!`

    }

    const embed = new EmbedBuilder()
        .setTitle(`Estes são os produtos cadastrados no Painel:`)
        .setDescription(messageeee)
        .setFooter({ text: `Caso queira trocar o emoji de algum produto, selecione ele no select menu abaixo:`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addprodutopainel_" + painel + "_1")
                .setLabel('Adicionar Produto')
                .setDisabled(tt.length >= 25)
                .setEmoji(`1233110125330563104`)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId("removeprodutopainel_" + painel)
                .setLabel('Remover Produto')
                .setEmoji(`1242907028079247410`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("changesequenciaprodutos_" + painel)
                .setLabel('Alterar Sequencia')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
        )


    const style2row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('changeemojipainelproduto_' + painel)
                .setPlaceholder('Selecione um Produto para alterar o Emoji')
                .addOptions(options)
        )


    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("atualizarmensagempainel_" + painel)
                .setLabel('Atualizar Painel')
                .setEmoji(`1238978383845654619`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("uay89efg7t9a7wa87dawgbydaid76_" + painel)
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )
    try {
        if(status == 1) {
            return await interaction.editReply({ embeds: [embed], components: [row, style2row, row2], ephemeral: true })
        }
        await interaction.update({ embeds: [embed], components: [row, style2row, row2], content: `` })
    } catch (error) {
        if (error.code === 50035 && error.rawError?.errors?.data?.components) {
            const parseErrors = async (obj, path = '') => {
                if (Array.isArray(obj)) {
                    for (let i = 0; i < obj.length; i++) {
                        await parseErrors(obj[i], `${path}.${i}`);
                    }
                    
                } else if (typeof obj === 'object' && obj !== null) {
                    for (const key in obj) {
                        if (key === '_errors') {
                            for (const err of obj[key]) {
                                if (err.code === 'BUTTON_COMPONENT_INVALID_EMOJI') {
                                    const match = path.match(/components\.(\d+)\.components\.(\d+)\.options\.(\d+)/);
                                    if (match) {
                                        const optionIndex = Number(match[3]);
                                        const produtoComErro = options[optionIndex];
                                        client.db.produtos.delete(`${produtoComErro.value}.painel`);
                                        await configprodutospainel(interaction, client, painel, status);
                                    }
                                }
                            }
                        } else {
                            await parseErrors(obj[key], `${path}.${key}`);
                        }
                    }
                }
            };

            parseErrors(error.rawError?.errors?.data?.components, 'components');
        }
    }

}



async function atualizarmensagempainel(guildid, painel, client) {

    var tttttt = client.db.PainelVendas.get(painel)

    var ttttttttt = tttttt.produtos

    var options = []
    for (let iiii = 0; iiii < ttttttttt.length; iiii++) {
        const element = ttttttttt[iiii];
        var bb = client.db.produtos.get(`${element}`)

        const option = {
            label: `${bb.settings.name}`,
            description: `💸 | Valor: ${Number(bb.settings.price).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })} - 📦 | Estoque: ${Object.keys(bb.settings.estoque).length}`,
            emoji: `${bb.painel == null ? `${global.emoji.carrinhobranco}` : bb.painel.emoji}`,
            value: `${bb.ID}`,
        };
        options.push(option);

    }

    const dddddd = client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? `#000000` : client.db.General.get(`ConfigGeral.ColorEmbed`)


    const embed = new EmbedBuilder()
        .setTitle(`${tttttt.settings.title}`)
        .setDescription(`${tttttt.settings.desc}`)
        .setColor(client.db.PainelVendas.get(`${painel}.settings.color`) == null ? dddddd : client.db.PainelVendas.get(`${painel}.settings.color`))

    if (tttttt.settings.banner !== null) {
        embed.setImage(tttttt.settings.banner)
    }
    if (tttttt.settings.miniatura !== null) {
        embed.setThumbnail(tttttt.settings.miniatura)
    }
    if (tttttt.settings.rodape !== null && tttttt.settings.rodape !== undefined) {
        embed.setFooter({ text: `${tttttt.settings.rodape}` })
    }

    if (options == 0) {
        const options2 = {
            label: `Nenhum Produto Cadastrado nesse Painel!`,
            emoji: `1229787813046915092`,
            value: `nada`,
        };

        options.push(options2);

    }

    const style2row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('buyprodutoporselect')
                .setPlaceholder(`${client.db.PainelVendas.get(`${painel}.settings.placeholder`) == null ? 'Selecione um Produto' : client.db.PainelVendas.get(`${painel}.settings.placeholder`)}`)
                .addOptions(options)
        )

    try {
        const channel = await client.channels.fetch(tttttt.ChannelID)
        const fetchedMessage = await channel.messages.fetch(tttttt.MessageID);


        if (client.db.General.get(`ConfigGeral.EstiloMensagens`) == true) {
            let banner = tttttt.settings.banner


            if (!banner) {
                await fetchedMessage.edit({ content: `${tttttt.settings.desc}`, components: [style2row], embeds: [] });
            } else {
                const attachment = new AttachmentBuilder(banner, { name: 'banner.png' });
                await fetchedMessage.edit({ content: `${tttttt.settings.desc}`, files: [attachment], components: [style2row], embeds: [] });
            }


        } else {
            await fetchedMessage.edit({ embeds: [embed], components: [style2row], content: `` });
        }
    } catch (error) {
    }

}




module.exports = {
    createpainel,
    configpainel,
    configembedpainel,
    configprodutospainel,
    atualizarmensagempainel
};