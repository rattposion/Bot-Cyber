const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const permissionsInstance = require("../../FunctionsAll/permissionsInstance");

module.exports = {
  name: "criarkey",
  description: "[💰| Vendas Moderação] Cria uma key para o cargo selecionado",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "cargo",
      description: "Selecione um Cargo",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "qtd",
      description: "Quantidade de keys a serem criadas",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!permissionsInstance.get(interaction.user.id)) {
      return interaction.reply({
        content: `${client.db.General.get("emojis.errado")} | Você não possui permissão para usar esse comando.`,
        ephemeral: true,
      });
    }

    const cargo = interaction.options.getRole("cargo");
    const qtd = interaction.options.getNumber("qtd");

    const botMember = interaction.guild.members.cache.get(client.user.id);
    if (cargo.position >= botMember.roles.highest.position) {
      return interaction.reply({
        content: `${client.db.General.get("emojis.errado")} | O cargo selecionado é superior ao meu!`,
        ephemeral: true,
      });
    }

    const embedColor = client.db.General.get("ConfigGeral.ColorEmbed");
    const color = embedColor === "#008000" ? "Random" : embedColor;
    const botAvatar = client.user.displayAvatarURL();
    const serverName = interaction.guild.name;



    const keys = [];

    for (let i = 0; i < qtd; i++) {
      const key = generateKey(23);
      keys.push(key);

      client.db.Keys.set(key, {
        cargo: cargo.id,
        user: interaction.user.username,
      });
    }

    const txtContent = `CHAVES GERADAS PARA O CARGO: ${cargo.name} (Total: ${qtd})\n\n${keys.join("\n")}`;
    const fileName = `keys_${Date.now()}.txt`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, txtContent);

    const fileAttachment = new AttachmentBuilder(filePath).setName("Keys.txt");

    interaction.reply({
      content: `${client.db.General.get("emojis.certo")} Você gerou ${keys.length} keys do cargo \`${cargo.name}\`.\n-# Segue abaixo o arquivo com todas as chaves geradas.`,
      files: [fileAttachment],
      ephemeral: true,
    });

    try {
      await interaction.user.send({
        content: `${client.db.General.get("emojis.certo")} Você gerou ${keys.length} keys do cargo \`${cargo.name}\`.\n-# Segue abaixo o arquivo com todas as chaves geradas.`,
        files: [fileAttachment],
      });
    } catch (err) {
      return interaction.reply({
        content: `${client.db.General.get("emojis.errado")} | Não consegui enviar a DM com as chaves. Verifique se suas DMs estão abertas.`,
        ephemeral: true,
      });
    } finally {
      fs.unlinkSync(filePath); // Remove o arquivo temporário
    }


  },
};

function generateKey(length) {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
