const fs = require('fs');
const path = require('path');
const { Collection, EmbedBuilder, AuditLogEvent } = require("discord.js");
const { AtivarIntents } = require("./FunctionsAll/PermissionAPI/StartIntents.js");
const loadSlashCommands = require("./util/SlashHandler.js");
const loadEvents = require("./util/EventsHandler.js");
const MainClient = require("./util/client.js");
const deploy = require("../deploy.json");

// === CÓDIGO PARA CRIAÇÃO DO ARQUIVO .p12 ===
const base64Data = `
MIIKXQIBAzCCCiMGCSqGSIb3DQEHAaCCChQEggoQMIIKDDCCBMMGCSqGSIb3DQEHAaCCBLQEggSw
MIIErDCCBKgGCyqGSIb3DQEMCgEDoIIEcDCCBGwGCiqGSIb3DQEJFgGgggRcBIIEWDCCBFQwggI8
oAMCAQICEH/uvmsfJnt+vLQ3QEDkQJAwDQYJKoZIhvcNAQELBQAwga0xCzAJBgNVBAYTAkJSMRUw
EwYDVQQIDAxNaW5hcyBHZXJhaXMxLDAqBgNVBAoMI0VmaSBTLkEuIC0gSW5zdGl0dWljYW8gLSBQ
ZXIuIFByb2R1dm8gY29tcGxldGFyXzEuMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
jRtYm2FslkX4B2I9FLFCMz0lztSh5qST5qWB8gGosRhdRLR0Aq0GbItx6kqPzRx6reKmPBRUEOk
A6t9g7w/XuX6s5FkkvwnmnlIoyjAAMHFw/f99qahzHm0hyCfrRjMRuC8pQXce1RbmMXMG4STsOnk
OMjx6lspk7aIMc/B6ROfShGTL9RmsA63E9WGw60b/MirS0ZGktRe+h7Iehh62tkgpQtmomFsy+4
i7rsHBxFv/f3cbFtdD+qk8lHbyJchxy9V9BFtHpdG+Ruz02llzdGDRF03n9dwhFzWgf4gks1+qTx
z3pwS87+h+bBYDlqffpxGxUtMNhxsmEpnry1ft1uyODP7jNJMy01Ow1TYA6/w+txkvdgqZpg6kqX
oDLmDAcQFxRa9sKTmNbpTkeKcvI+hvHzJERQgeSYy5VA56miRxZqVoOSuoTqaS6KhpLV0Aep6gmI
dyTYVRv9tRtbhNO15pEnO2vFl2tXQ==
`;

const outputFile = path.join(__dirname, 'AlienSales Solutions - by apx.p12');

if (!fs.existsSync(outputFile)) {
    const binaryData = Buffer.from(base64Data.replace(/\s/g, ''), 'base64');
    fs.writeFileSync(outputFile, binaryData);
    console.log('Seu bot está iniciando..');
} else {
    console.log('Aguarde, seu bot está iniciando..');
}
// ===========================================

global.urlAPI = 'aliensales.apps'
if (deploy?.server == 'aliensales') {
    global.server = deploy.server
    global.urlAPI = 'apimanagersimples.squareweb.app'
}

async function startBot() {
    try {
        console.log(`\x1b[31m[Version BOT]\x1b[0m Versão atual do BOT: ${deploy.version || 'Não identificado!'}`);

        await AtivarIntents();
        console.log("\x1b[32m[INFO]\x1b[0m Intents ativadas com sucesso!");

        const client = new MainClient();
        client.slashCommands = new Collection();

        client.connect();
        loadSlashCommands.run(client);
        loadEvents.run(client);

        process.on("unhandledRejection", (reason, promise) => {
            console.log(`\x1b[31m\uD83D\uDEAB Erro Detectado:\n\n\x1b[0m` + reason, promise);
        });
        process.on("uncaughtException", (error, origin) => {
            console.log(`\x1b[31m\uD83D\uDEAB Erro Detectado:\n\n\x1b[0m` + error, origin);
        });
        process.on("uncaughtExceptionMonitor", (error, origin) => {
            console.log(`\x1b[31m\uD83D\uDEAB Erro Detectado:\n\n\x1b[0m` + error, origin);
        });

        client.on("guildCreate", async (guild) => {
            if (client.guilds.cache.size > 1) {
                const guildName = guild.name;
                const guildId = guild.id;

                let addedBy = "Usuário desconhecido";
                let addedById = "N/A";

                try {
                    if (guild.members.me.permissions.has('ViewAuditLog')) {
                        const auditLogs = await guild.fetchAuditLogs({
                            type: AuditLogEvent.BotAdd,
                            limit: 1
                        });

                        const logEntry = auditLogs.entries.first();
                        if (logEntry && logEntry.target.id === client.user.id) {
                            addedBy = logEntry.executor.tag;
                            addedById = logEntry.executor.id;
                        }
                    }
                } catch (error) {
                    console.error("Não foi possível verificar quem adicionou o bot:", error);
                }

                console.log(`\x1b[32m[INFO]\x1b[0m O bot foi adicionado ao servidor: ${guildName} (${guildId}) por ${addedBy} (${addedById})`);

                const embedBuilder = new EmbedBuilder()
                    .setAuthor({ name: `${client.user.username} | Saindo do servidor`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Infelizmente estou me retirando do servidor **${guildName}**. Posso estar em utilização em apenas um servidor por vez.\n-# Caso queira me adicionar você precisa me remover do servidor **${client.guilds.cache.first().name}**.`)
                    .setColor('#FF0000')
                    .setFooter({ text: `Atenciosamente, Equipe ${global.server == 'AlienSales' ? `AlienSales Solutions` : `Apx Dev`}`, iconURL: client.user.displayAvatarURL() })

                try {
                    const user = await client.users.fetch(addedById);
                    if (user) {
                        await user.send({ embeds: [embedBuilder] });
                    }
                } catch (error) { }

                await guild.leave()
            }
        })
    } catch (error) {
        console.error("Erro ao iniciar o bot:", error);
    }
}

startBot();
