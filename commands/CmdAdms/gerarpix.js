const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('messagepixgerar')

const { default: MercadoPagoConfig, Payment } = require("mercadopago");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

const configureMercadoPago = (accessToken) => {
  return new MercadoPagoConfig({
    accessToken: accessToken
  });
};



module.exports = {
  name: "gerarpix",
  description: '[💰 | Vendas] Gere uma cobrança.',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor para ser Resgatado",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    if (!permissionsInstance.get(interaction.user.id)) return interaction.reply({ content: `${client.db.General.get(`emojis.errado`)} Você não possui permissão para usar esse comando.`, ephemeral: true })


    let valor = interaction.options.getNumber('valor');

    if (client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP === "") {
      return interaction.reply({
        content: `${global.emoji.errado} O token de acesso do Mercado Pago não foi configurado.`,
        ephemeral: true
      });
    }



    interaction.reply({ content: `${client.db.General.get(`emojis.loading_promisse`)} | Gerando pagamento...` }).then(async msg => {
      try {
        const messages = await interaction.channel.messages.fetch({ limit: 1 });
        const lastMessage = messages.first();

        var payment_data = {
          transaction_amount: Number(valor),
          description: `Pagamento - ${interaction.guild.name} - ${interaction.user.id}`,
          payment_method_id: 'pix',
          payer: {
            email: `${interaction.user.id}@gmail.com`,
            first_name: `Victor André`,
            last_name: `Ricardo Almeida`,
            identification: {
              type: 'CPF',
              number: '15084299872'
            },

            address: {
              zip_code: '86063190',
              street_name: 'Rua Jácomo Piccinin',
              street_number: '971',
              neighborhood: 'Pinheiros',
              city: 'Londrina',
              federal_unit: 'PR'
            }
          }
        }

        //mercadopago.configurations.setAccessToken(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
        // const data = await mercadopago.payment.create(payment_data);

        const mercadoPagoClient = configureMercadoPago(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
        const payment = new Payment(mercadoPagoClient);
        const data = await payment.create({ body: payment_data });

        uu.set(lastMessage.id, { user: interaction.user.id, qrcode: data.point_of_interaction.transaction_data.qr_code_base64, pixcopiaecola: data.point_of_interaction.transaction_data.qr_code, id: data.id, })
        var tt = client.db.General.get('ConfigGeral')

  
        const buffer = Buffer.from(data.point_of_interaction.transaction_data.qr_code_base64, "base64");
        const attachment = new Discord.AttachmentBuilder(buffer, { name: "payment.png" });

        const embed = new EmbedBuilder()
          .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#008000' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
          .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setFields(
            { name: `Código copia e cola`, value: `\`\`\`${data.point_of_interaction.transaction_data.qr_code}\`\`\``, inline: false }
          )
          .setImage(`attachment://payment.png`)

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("pixcdawdwadawdwdopiawdwawdwadecola182381371")
              .setLabel('Copia e Colar')
              .setEmoji(`1233200554252042260`)
              .setStyle(2),
            new ButtonBuilder()
              .setCustomId("cancelgeneratepix")
              .setEmoji(`1229787813046915092`)
              .setStyle(4)
              .setDisabled(false),
          )

        msg.edit({ content: ``, embeds: [embed], components: [row], files: [attachment] }).then(msggggg => {
          setTimeout(async () => {
            try {
              await msggggg.delete()
            } catch (error) {
              console.error("Error deleting message:", error);
            }
          }, tt.MercadoPagoConfig.TimePagament * 60 * 1000);
        })
      } catch (error) {
        interaction.editReply({ content: `Error: ${error}`, ephemeral: true })
      }
    })


  }
}