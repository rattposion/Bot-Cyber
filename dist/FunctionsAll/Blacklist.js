const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { getSaudacao } = require('./PermissionAPI/PermissionGet');

const axios = require('axios');

async function VarreduraBlackList(client) {

  try {
    const embed3 = new EmbedBuilder()
      .setColor('#1c44ff')
      .setAuthor({ name: `Sistema Anti-Fraude`, iconURL: `https://cdn.discordapp.com/emojis/1230562927032012860.webp?size=44&quality=lossless` })
      .setDescription(`Seu BOT está realizando uma varredura nos pagamentos para verificar a existência de quaisquer reembolsos suspeitos.`)
      .setFooter({ iconURL: `https://cdn.discordapp.com/attachments/1228074217333985291/1242896527748501635/promisse_low.webp`, text: `Mensagem enviada pelo sistema.` })
      .setTimestamp()


    const row222 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('asSs')
          .setLabel('Mensagem do Sistema')
          .setStyle(2)
          .setDisabled(true)
      );


    const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`))
    await channel.send({ components: [row222], embeds: [embed3] })
  } catch (error) {

  }



  try {
    var res = await axios.get(`https://api.mercadopago.com/v1/payments/search`, {
      headers: {
        Authorization: `Bearer ${client.db.General.get('ConfigGeral.MercadoPagoConfig.TokenAcessMP')}`
      },
      params: {
        status: 'refunded',
        limit: 1000
      }
    });

    res.data.results.forEach(async pagamento => {
      if (pagamento.refunds[0].source.type == 'admin') {

        let dddd = client.db.blacklistAll.get(`bloqueados.id`) || []
        if (!dddd.includes(pagamento.id)) {
          try {
            client.db.blacklistAll.push(`bloqueados.id`, pagamento.id)
          } catch (error) {

          }

        }
      }

    });


  } catch (error) {
    //  console.log(error)
  }
}

async function automsg(interaction, client) {
  const mensagens = client.db.General.get(`ConfigGeral.AutoMessage`);
  let desc = '';

  if (mensagens && Array.isArray(mensagens)) {
    for (let index = 0; index < mensagens.length; index++) {
      const elemento = mensagens[index];
      const dados = elemento[0];

      const descricao = dados.descricao || '';
      const buttons = dados.buttons || [];
      const buttonsCount = buttons.length;

      const truncatedDescricao = descricao.length > 30 ? descricao.substring(0, 30) + '...' : descricao;

      desc += `\n-# (\`${index + 1}\`) - ${truncatedDescricao} ${buttonsCount > 0 ? `(${buttonsCount} botão(ões))` : ''}`;
    }
  }

  if (!desc) {
    desc = `- \`Nenhuma mensagem automática cadastrada.\`\n`;
  }

  const uptimeTimestamp = Math.floor(client.readyAt.getTime() / 1000);

  let embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Painel Mensagem Automatica')
    .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
    .addFields(
      { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${uptimeTimestamp}:R>`, inline: true },
      { name: `Mensagens`, value: `-# - Mensagens cadastradas: ${desc}`, inline: false },
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('criarmsgauto')
      .setLabel('Criar Mensagem Automática')
      .setEmoji('1233110125330563104')
      .setStyle(3),
    new ButtonBuilder()
      .setCustomId('remmsgautomatica')
      .setLabel('Remover Mensagem Automática')
      .setEmoji('1229787813046915092')
      .setStyle(4),
    new ButtonBuilder()
      .setCustomId('returnacoesautomaticas')
      .setEmoji('1237055536885792889')
      .setStyle(2)
  );

  await interaction.update({
    content: ``,
    embeds: [embed],
    components: [row],
    ephemeral: true
  });
}

module.exports = {
  VarreduraBlackList, automsg
}