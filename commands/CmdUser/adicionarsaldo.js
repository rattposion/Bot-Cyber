const Discord = require("discord.js");
const { ButtonBuilder,EmbedBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const { ChecarPagamentoAdicionarsaldo } = require("../../FunctionsAll/Saldo");
const { default: MercadoPagoConfig, Payment } = require("mercadopago");
const configureMercadoPago = (accessToken) => {
  return new MercadoPagoConfig({
    accessToken: accessToken
  });
};



module.exports = {
  name: "adicionarsaldo",
  description: "[💰|Vendas] Adicionar Saldo Via Pix",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor que deseja adicionar.",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let valor = interaction.options.getNumber('valor')
    await interaction.reply({ content: `🔄 | Processando...`, ephemeral: true })

    if (valor <= 0) return interaction.editReply({ content: `Você precise adicionar um valor maior que 0` })
    if (client.db.General.get('ConfigGeral').SaldoConfig.ValorMinimo > valor) return interaction.editReply({ content: `Está função foi definida para ter um VALOR MÍNIMO de \`${Number(client.db.General.get('ConfigGeral').SaldoConfig.ValorMinimo).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``, ephemeral: true })

      const bonus = client.db.General.get('ConfigGeral').SaldoConfig.Bonus
      var saldoComBonus = Number(valor) + (Number(valor) * Number(bonus) / 100);
      if (bonus == 0) saldoComBonus = 0
      var totalvalor = Number(valor) + (valor * bonus / 100)
      if (bonus == 0) totalvalor = Number(valor)

    var payment_data = {
      transaction_amount: valor,
      description: `Adicionar Saldo - ${interaction.guild.name} - ${interaction.user.id}`,
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
    const mercadoPagoClient = configureMercadoPago(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
    const payment = new Payment(mercadoPagoClient);
    await payment.create({ body: payment_data }).then(async function (data) {
        const pix = data.point_of_interaction.transaction_data.qr_code;
        const qr = data.point_of_interaction.transaction_data.qr_code_base64;
        client.db.PagamentosSaldos.set(interaction.user.id, { pix: pix, qr: qr })
        ChecarPagamentoAdicionarsaldo(data.id, interaction, Number(valor).toFixed(2), Number(totalvalor).toFixed(2), client)
      }).catch(function (error) {
        console.log(error)
      });

    var t = client.db.PagamentosSaldos.get(`${interaction.user.id}`)


    const buffer = Buffer.from(t.qr, "base64");
    const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setColor("#2f3136")
      .setTitle(`Adicionar Saldo`)
      .setFields(
        { name: `Valor à pagar`, value: `\`${Number(valor).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``, inline: true },
        { name: `Bônus`, value: `\`${bonus}%\``, inline: true },
        { name: `Receberá`, value: `\`${Number(saldoComBonus).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``, inline: true },
        { name: `Código copia e cola`, value: `\`\`\`${t.pix}\`\`\``, inline: false },
      )
      .setFooter({ text: `${interaction.guild.name} - Pagamento expira em 10 min` })
      .setTimestamp()
      .setImage(`attachment://payment.png`)

    const botao = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('copiarecolar')
        .setLabel('Copiar e Colar')
        .setStyle(2)
        .setEmoji('1233200554252042260'),
    )

    interaction.editReply({ content: '', embeds: [embed], files: [attachment], components: [botao], ephemeral: true })
  }
}