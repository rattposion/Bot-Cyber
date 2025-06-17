const { ButtonBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ComponentType, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, DiscordAPIError, AttachmentBuilder } = require('discord.js');

async function SelectProduct(client) {


    let produtosselecionados = client.db.General.get('ConfigGeral.produtosrespostar') || [];

    if (produtosselecionados.length === 0) return;

    const produtossalvos = client.db.produtos.fetchAll();



    if (!produtossalvos || produtossalvos.length === 0) return

    try {
        await Promise.all(produtosselecionados.map(async (produto) => {
            const produtoid = produtossalvos.find(p => p.ID === produto.id);
            if (!produtoid) return;

            const canalvendas = await client.channels.cache.get(produtoid.data.ChannelID);
            if (!canalvendas) return;

            let mensageminfo;
            try {
                mensageminfo = await canalvendas.messages.fetch(produtoid.data.MessageID);
            } catch (error) {
                return;
            }

            if(mensageminfo.attachments.first()) {
            } else {
                await mensageminfo.delete();
            }


            // const botMessages = (await canalvendas.messages.fetch()).filter(msg => msg.author.id === client.user.id);
            // await Promise.all(botMessages.map(async (msg) => {
            //     try {
            //         await msg.delete();
            //     } catch (error) {
            //     }
            // }));

            try {
                if (mensageminfo.embeds[0] == undefined) {
                    let messageimage = mensageminfo.attachments.first();

                    let imagem = null;
                    let sentMessage

                    if (messageimage) {
                        imagem = new AttachmentBuilder(messageimage.attachment, { name: 'banner.png' });
                        sentMessage = await canalvendas.send({ content: mensageminfo.content, files: [imagem], components: mensageminfo.components });
                        await mensageminfo.delete();
                    } else {
                        sentMessage = await canalvendas.send({ content: mensageminfo.content, components: mensageminfo.components });
                    }
                    await client.db.produtos.set(`${produtoid.ID}.MessageID`, sentMessage.id);
                    await client.db.produtos.set(`${produtoid.ID}.ChannelID`, sentMessage.channel.id);
                } else {


                    const sentMessage = await canalvendas.send({ embeds: [mensageminfo.embeds[0]], components: mensageminfo.components, content: `` });
                    await client.db.produtos.set(`${produtoid.ID}.MessageID`, sentMessage.id);
                    await client.db.produtos.set(`${produtoid.ID}.ChannelID`, sentMessage.channel.id);
                }
            } catch (error) {
                console.log(`Erro ao enviar: ${error}`)
            }
        }));

    } catch (error) {
        console.log(`Erro ao enviar: ${error}`)
    }
}
async function SendAllMgs(client) {
    const produtossalvos = client.db.produtos.fetchAll();
    if (!produtossalvos || produtossalvos.length === 0) return

    //add os paineis do PainelVendas no array do produtossalvos

    let painelsalvos = client.db.PainelVendas.fetchAll();


    if (painelsalvos.length > 0) {
        painelsalvos.map(painel => {
            painel.data.status = true
            produtossalvos.push(painel)
        })
    }


    try {
        await Promise.all(produtossalvos.map(async (produtoid) => {
            const canalvendas = await client.channels.cache.get(produtoid.data.ChannelID);

            if (!canalvendas) return;

            let mensageminfo;
            try {
                mensageminfo = await canalvendas.messages.fetch(produtoid.data.MessageID);
            } catch (error) {
                return;
            }

       
            if(mensageminfo.attachments.first()) {
            } else {
                await mensageminfo.delete();
            }


            // const botMessages = (await canalvendas.messages.fetch()).filter(msg => msg.author.id === client.user.id);
            // await Promise.all(botMessages.map(async (msg) => {
            //     try {
            //         await msg.delete();
            //     } catch (error) {
            //     }
            // }));

            try {
                if (mensageminfo.embeds[0] == undefined) {

                    let messageimage = mensageminfo.attachments.first();

                    let imagem = null;
                    let sentMessage

                    if (messageimage) {
                        imagem = new AttachmentBuilder(messageimage.attachment, { name: 'banner.png' });
                        sentMessage = await canalvendas.send({ content: mensageminfo.content, files: [imagem], components: mensageminfo.components });
                        await mensageminfo.delete();
                    } else {
                        sentMessage = await canalvendas.send({ content: mensageminfo.content, components: mensageminfo.components });
                    }

                    if (produtoid.data.status !== true) {
                        await client.db.produtos.set(`${produtoid.ID}.MessageID`, sentMessage.id);
                        await client.db.produtos.set(`${produtoid.ID}.ChannelID`, sentMessage.channel.id);
                    } else {
                        await client.db.PainelVendas.set(`${produtoid.ID}.MessageID`, sentMessage.id);
                        await client.db.PainelVendas.set(`${produtoid.ID}.ChannelID`, sentMessage.channel.id);
                    }
                } else {
                    const sentMessage = await canalvendas.send({ embeds: [mensageminfo.embeds[0]], components: mensageminfo.components, content: `` });
                    if (produtoid.data.status !== true) {
                        await client.db.produtos.set(`${produtoid.ID}.MessageID`, sentMessage.id);
                        await client.db.produtos.set(`${produtoid.ID}.ChannelID`, sentMessage.channel.id);
                    } else {
                        await client.db.PainelVendas.set(`${produtoid.ID}.MessageID`, sentMessage.id);
                        await client.db.PainelVendas.set(`${produtoid.ID}.ChannelID`, sentMessage.channel.id);
                    }
                }

            } catch (error) {
                console.log(`Erro ao enviar: ${error}`)
            }
        }));
    } catch (error) {
        console.log(`Erro ao enviar: ${error}`)
    }
}



module.exports = {
    SendAllMgs,
    SelectProduct
}