const { ButtonBuilder, EmbedBuilder, ActionRowBuilder, ContainerBuilder, SectionBuilder, TextDisplayBuilder, MessageFlags, ComponentType, ButtonStyle, MediaGalleryBuilder, time } = require("discord.js")


async function PageGiveaway(client, interaction, page) {


    let nameTempGiveaway
    let descTempGiveaway
    let imageTempGiveaway
    let thumbTempGiveaway
    let corTempGiveaway
    let qtdWinnersTempGiveaway
    let timeTempGiveaway
    let emojiTempGiveaway
    if (interaction.message) {
        let listTemp = client.db.Giveaways.get(`Giveaway.temp.${interaction.message.id}`)
        nameTempGiveaway = listTemp.name
        descTempGiveaway = listTemp.desc
        imageTempGiveaway = listTemp.image
        thumbTempGiveaway = listTemp.thumb
        corTempGiveaway = listTemp.cor
        qtdWinnersTempGiveaway = listTemp.qtdWinners
        timeTempGiveaway = listTemp.time
        emojiTempGiveaway = listTemp.emoji
    } else {
        nameTempGiveaway = `Felicidade AlienSales.`
        descTempGiveaway = `Uma pessoa sortuda irá ganhar esse incrível sorteio realizado atráves do bot da AlienSales Solutions.`
        imageTempGiveaway = null
        thumbTempGiveaway = null
        corTempGiveaway = `#29a6fe`
        qtdWinnersTempGiveaway = 1
        timeTempGiveaway = '1 hora'
        emojiTempGiveaway = '🎉'
    }

    // converter a time em timestamp, 1d = 86400000, 1h = 3600000, 1m = 60000, 1dia = 86400000, 1hora = 3600000, 1minuto = 60000, 1 dia = 86400000, 1 hora = 3600000, 1 minuto = 60000, 1 d = 86400000, 1 h = 3600000, 1 m = 60000, 1 dia = 86400000, 1 hora = 3600000, 1 minuto = 60000, 1 d = 86400000, 1 h = 3600000, 1 m = 60000, 1 dia = 86400000, 1 hora = 3600000, 1 minuto = 60000 , 30/03/2030 17:00 
    let timeTempGiveawayTimestamp = 0
    if (timeTempGiveaway) {
        if (timeTempGiveaway.includes('d')) {
            timeTempGiveawayTimestamp = parseInt(timeTempGiveaway.split('d')[0]) * 86400000
        } else if (timeTempGiveaway.includes('h')) {
            timeTempGiveawayTimestamp = parseInt(timeTempGiveaway.split('h')[0]) * 3600000
        } else if (timeTempGiveaway.includes('m')) {
            timeTempGiveawayTimestamp = parseInt(timeTempGiveaway.split('m')[0]) * 60000
        } else if (timeTempGiveaway.includes('/')) {
            let date = new Date(timeTempGiveaway)
            timeTempGiveawayTimestamp = date.getTime() - Date.now()
        } else {
            let date = new Date(timeTempGiveaway)
            timeTempGiveawayTimestamp = date.getTime() - Date.now()
        }
    }


    const conteinerAparencia = new ContainerBuilder(
        {
            accent_color: corTempGiveaway == '#29a6fe' ? 0x29a6fe : parseInt(corTempGiveaway),
            components: [
                new TextDisplayBuilder({
                    content: `### 🎨 Aparência`,
                }),
                new SectionBuilder(
                    {
                        components: [
                            new TextDisplayBuilder({
                                content: `**Nome do Sorteio**\n${nameTempGiveaway ? nameTempGiveaway : '*Felicidade AlienSales.*'}`,
                            })
                        ],
                        accessory: {
                            type: ComponentType.Button,
                            custom_id: 'Sorteio_Nome',
                            label: 'Alterar',
                            style: 1,
                        }
                    }
                ),

                new SectionBuilder(
                    {
                        components: [
                            new TextDisplayBuilder({
                                content: `**Descrição do Sorteio**\n${descTempGiveaway ? descTempGiveaway : '*Uma pessoa sortuda irá ganhar esse incrível sorteio realizado atráves do bot da AlienSales Solutions.*'}`,
                            })
                        ],
                        accessory: {
                            type: ComponentType.Button,
                            custom_id: 'Sorteio_Desc',
                            label: 'Alterar',
                            style: 1,
                        }
                    }
                ),
                new SectionBuilder(
                    {
                        components: [
                            new TextDisplayBuilder({
                                content: `**Imagem da Embed**\n${imageTempGiveaway ? imageTempGiveaway : '*Sem imagem*'}`,
                            })
                        ],
                        accessory: {
                            type: ComponentType.Button,
                            custom_id: 'Sorteio_Imagem',
                            label: 'Alterar',
                            style: 1,
                        }
                    }
                ),
                ...(imageTempGiveaway ? [
                    new MediaGalleryBuilder({
                        items: [{
                            media: {
                                url: imageTempGiveaway,
                            },
                        },
                        ],
                    })

                ] : []),
                new SectionBuilder(
                    {
                        components: [
                            new TextDisplayBuilder({
                                content: `**Thumbnail da Embed**\n${thumbTempGiveaway ? thumbTempGiveaway : '*Sem thumbnail*'}`,
                            })
                        ],
                        accessory: {
                            type: ComponentType.Button,
                            custom_id: 'Sorteio_Thumb',
                            label: 'Alterar',
                            style: 1,
                        }
                    }
                ),
                ...(thumbTempGiveaway ? [
                    new MediaGalleryBuilder({
                        items: [{
                            media: {
                                url: thumbTempGiveaway,
                            },
                        },
                        ],
                    })

                ] : []),
                new SectionBuilder(
                    {
                        components: [
                            new TextDisplayBuilder({
                                content: `**Cor da Embed**\n${corTempGiveaway ? corTempGiveaway : '*#29a6fe*'}`,
                            })
                        ],
                        accessory: {
                            type: ComponentType.Button,
                            custom_id: 'Sorteio_Cor',
                            label: 'Alterar',
                            style: 1,
                        }
                    }
                )
            ]
        }
    )

    const conteinerGeral = new ContainerBuilder(
        {
            accent_color: corTempGiveaway == '#29a6fe' ? 0x29a6fe : parseInt(corTempGiveaway),
            components: [
                new TextDisplayBuilder({
                    content: `### 🤖 Geral`,
                }),
                new SectionBuilder(
                    {
                        components: [
                            new TextDisplayBuilder({
                                content: `**Quantidade de Vencedores**\n${qtdWinnersTempGiveaway ? qtdWinnersTempGiveaway : '1'}`,
                            })
                        ],
                        accessory: {
                            type: ComponentType.Button,
                            custom_id: 'Sorteio_Winners',
                            label: 'Alterar',
                            style: 1,
                        }
                    }
                ),
                new SectionBuilder(
                    {
                        components: [
                            new TextDisplayBuilder({
                                content: `**Duração do Sorteio**\n-# A duração pode ser um tempo relativo (5 minutos, 1 hora 30 minutos, 7 dias, etc) ou um tempo absoluto (30/03/2030 17:00).\n${timeTempGiveaway} (<t:${Math.floor((Date.now() + timeTempGiveawayTimestamp) / 1000)}:f>) (<t:${Math.floor((Date.now() + timeTempGiveawayTimestamp) / 1000)}:R>)`,
                            })
                        ],
                        accessory: {
                            type: ComponentType.Button,
                            custom_id: 'Sorteio_Duration',
                            label: 'Alterar',
                            style: 1,
                        }
                    }
                ),
                 new SectionBuilder(
                    {
                        components: [
                            new TextDisplayBuilder({
                                content: `**Emoji do Sorteio**\n-# Usado no botão de participar do sorteio\n${emojiTempGiveaway ? emojiTempGiveaway : '🎉'}`,
                            })
                        ],
                        accessory: {
                            type: ComponentType.Button,
                            custom_id: 'Sorteio_Emoji',
                            label: 'Alterar',
                            style: 1,
                        }
                    }
                ),
            ]
        })

    const buttons = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId('Sorteio_PageAparencia')
            .setLabel('Aparência')
            .setEmoji('🎨')
            .setDisabled(page === 1)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('Sorteio_PageGeral')
            .setLabel('Geral')
            .setEmoji('⚙️')
            .setDisabled(page === 2)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('Sorteio_PageCargos')
            .setLabel('Cargos Permitidos/Bloqueados')
            .setEmoji('🔒')
            .setDisabled(page === 3)
            .setStyle(2)
    )

    const buttons2 = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId('Sorteio_PageEntradasExtras')
            .setLabel('Entradas Extras')
            .setEmoji('🎟️')
            .setDisabled(page === 4)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('Sorteio_PageTeemplates')
            .setLabel('Templates')
            .setEmoji('📜')
            .setDisabled(page === 5)
            .setStyle(2),
    )

    const buttons3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('Sorteio_PageIniciar')
            .setLabel('Iniciar Sorteio')
            .setEmoji('🎉')
            .setDisabled(page === 6)
            .setStyle(ButtonStyle.Success),

    )


    let components
    if (page === 1) {
        components = [conteinerAparencia, buttons, buttons2, buttons3]
    } else if (page === 2) {
        components = [conteinerGeral, buttons, buttons2, buttons3]
    }
    if (!interaction.message) {

        await interaction.editReply({
            flags: [MessageFlags.IsComponentsV2],
            components: components,
            fetchReply: true,
        }).then(async (msg) => {
            let fetchMsg = await interaction.fetchReply()
            if (!client.db.Giveaways.has(`Giveaway.temp.${fetchMsg.id}`)) {
                client.db.Giveaways.set(`Giveaway.temp.${fetchMsg.id}`, {
                    name: nameTempGiveaway,
                    desc: descTempGiveaway,
                    image: imageTempGiveaway,
                    thumb: thumbTempGiveaway,
                    cor: corTempGiveaway,
                    startConfig: Date.now(),
                    qtdWinners: qtdWinnersTempGiveaway,
                    time: timeTempGiveaway,
                    emoji: emojiTempGiveaway,
                })
            }

        })
    } else {
        await interaction.update({
            flags: [MessageFlags.IsComponentsV2],
            components: components,
        })
    }

}

module.exports = {
    PageGiveaway
}