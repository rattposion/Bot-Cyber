const { ApplicationCommandOptionType } = require("discord.js");
const fs = require('fs');
const axios = require('axios');
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
    name: 'qrcode_personalizar',
    description: "[🔧 | Moderação] Personalize seu QRCODE de pagamentos.",
    options: [
        {
            name: 'imagem',
            description: 'Coloque a imagem para personalizar o QR Code (PNG/JPG)',
            type: ApplicationCommandOptionType.Attachment,
            required: false
        },
        {
            name: 'color',
            description: 'Defina a cor do QR Code no formato RGB (ex: 255,0,0)',
            type: ApplicationCommandOptionType.String,
            required: false
        },
    ],

    run: async (client, interaction) => {
        try {
            if (!permissionsInstance.get(interaction.user.id)) {
                return interaction.reply({ 
                    content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, 
                    ephemeral: true 
                });
            }

            const img = interaction.options.getAttachment('imagem');
            const rgb = interaction.options.getString('color');

            if (!img && !rgb) {
                return interaction.reply({ 
                    content: `${client.db.General.get(`emojis.errado`)} Você precisa fornecer pelo menos uma opção: imagem ou cor.`, 
                    ephemeral: true 
                });
            }

            await interaction.reply({ 
                content: `${client.db.General.get(`emojis.loading_promisse`)} Processando sua solicitação...`, 
                ephemeral: true 
            });

            if (rgb) {
                const rgbRegex = /^\d{1,3},\d{1,3},\d{1,3}$/;
                if (!rgbRegex.test(rgb)) {
                    return interaction.editReply({ 
                        content: `${client.db.General.get(`emojis.errado`)} O formato da cor deve ser RGB (exemplo: 255,0,0)`, 
                        ephemeral: true 
                    });
                }
            }

            // Processar imagem se fornecida
            if (img) {
                const response = await axios({
                    method: 'get',
                    url: img.url,
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync('./DataBaseJson/joaoanim.png', response.data);
            }

            const codealeatorio = Math.floor(Math.random() * 1000000000);
            
            if (rgb) client.db.General.set(`qrcodecor`, rgb);
            if (img) client.db.General.set(`qrcode`, codealeatorio.toString());

            let successMessage = '';
            if (img && rgb) {
                successMessage = 'Imagem e cor do QR Code atualizadas com sucesso!';
            } else if (img) {
                successMessage = 'Imagem do QR Code atualizada com sucesso!';
            } else {
                successMessage = 'Cor do QR Code atualizada com sucesso!';
            }

          
            await interaction.editReply({ 
                content: `${client.db.General.get(`emojis.certo`)} ${successMessage}`,
                ephemeral: true 
            });

        } catch (error) {
            console.error('Erro ao processar comando:', error);
            await interaction.editReply({ 
                content: `${client.db.General.get(`emojis.errado`)} Ocorreu um erro ao processar sua solicitação. Tente novamente.`, 
                ephemeral: true 
            });
        }
    }
};