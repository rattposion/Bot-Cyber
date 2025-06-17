const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");


module.exports = {
    name: "painel-saldo",
    description: "Não envie nada caso não queira configurar a embeds",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })

        let modal = new Discord.ModalBuilder()
            .setCustomId('modal')
            .setTitle(`🥊 | Configurar Painel`);

        let desc = new Discord.TextInputBuilder()
            .setCustomId('descricao2')
            .setLabel("Descrição da mensagem de saldo?")
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setPlaceholder('Digite a descrição do anúncio de saldo.')
            .setRequired(false);

        let cor = new Discord.TextInputBuilder()
            .setCustomId('cor')
            .setLabel("Qual será a cor da Embed?")
            .setStyle(Discord.TextInputStyle.Short)
            .setPlaceholder('Digite a cor do anúncio de saldo.')
            .setRequired(false);

        let botao = new Discord.TextInputBuilder()
            .setCustomId('botao')
            .setLabel("Qual texto ficará no botão?")
            .setStyle(Discord.TextInputStyle.Short)
            .setPlaceholder('Digite o texto do botão.')
            .setRequired(false);

        let image = new Discord.TextInputBuilder()
            .setCustomId('image')
            .setLabel("Qual será a imagem?")
            .setStyle(Discord.TextInputStyle.Short)
            .setPlaceholder('Envie o link da imagem.')
            .setRequired(false);

        const descrição = new Discord.ActionRowBuilder().addComponents(desc);
        const color = new Discord.ActionRowBuilder().addComponents(cor);
        const butao = new Discord.ActionRowBuilder().addComponents(botao);
        const imagem = new Discord.ActionRowBuilder().addComponents(image);

        modal.addComponents(descrição, color, butao, imagem);

        await interaction.showModal(modal);

        const modalInteraction = await interaction.awaitModalSubmit({ filter: i => i.user.id === interaction.user.id, time: 1200000_000 })
        modalInteraction.reply({
            content: `${global.emoji.certo} Seu painel de saldo foi enviado!`,
            ephemeral: true
        });
        const descs = modalInteraction.fields.getTextInputValue('descricao2') || `Ao utilizar nossos serviços e produtos você confirma que está de acordo com os nossos Termos De Serviços\nAdicione saldo em nossa loja para realizar a compra de um produto\n\n**Pagamento**\n> Escolha um método de pagamento preferencial abaixo para adicionar seu saldo.`;
        const coloração = modalInteraction.fields.getTextInputValue('cor') || (`ADD8E6`)
        const button = modalInteraction.fields.getTextInputValue('botao') || (`Adicionar Saldo`)
        const imagi = modalInteraction.fields.getTextInputValue('image')

        const embed = new EmbedBuilder()
            .setColor(coloração)
            .setDescription(descs)

        if (imagi) {
            embed.setImage(imagi)
        }

        const button1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('addsaldo')
                    .setLabel(button)
                    .setEmoji(`1242917506247692491`)
                    .setStyle(Discord.ButtonStyle.Primary))

        interaction.channel.send({ embeds: [embed], components: [button1] });

    }
}