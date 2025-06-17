const { ActivityType, EmbedBuilder } = require('discord.js');
const { carregarCache } = require('../../Handler/EmojiFunctions');
const { VarreduraBlackList } = require('../../FunctionsAll/Blacklist');

const { SendAllMgs, SelectProduct } = require('../../FunctionsAll/SendAllMgs');
const { joinVoiceChannel } = require('@discordjs/voice');
const { updateCache } = require('../../FunctionsAll/PermissionAPI/PermissionGet');
const { SetCallBack, GenerateToken } = require('../../FunctionsAll/Payments/EfíBank');
const StartDB = require('../../FunctionsAll/StartDB/ReadyDB');
const { connectIMAP } = require('../../FunctionsAll/Payments/Nubank');
const { atualizarmessageprodutosone } = require('../../FunctionsAll/Createproduto');
const { atualizarmensagempainel } = require('../../FunctionsAll/PainelSettingsAndCreate');
const { autoLockSystem } = require('../../FunctionsAll/ActionsAutomatics/autolock');
const { repostagemAutomatica } = require('../../FunctionsAll/ActionsAutomatics/repostagem');
const { syncEmojis } = require('../../FunctionsAll/EmojisPersonalizados/CreateEmojisStart');
const permissionsInstance = require('../../FunctionsAll/permissionsInstance');

module.exports = {
    name: 'ready',

    run: async (client) => {

        permissionsInstance.reload()

        console.log(`Convite do bot: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)

        StartDB(client);

        try {
            await syncEmojis(client);
            console.log(`[EMOJI_MANAGER] Emojis carregados com sucesso.`);
        } catch (err) {
            console.error(`[EMOJI_MANAGER] Falha ao carregar os emojis:\n`, err);
        }

        updateCache(client);
        setInterval(() => {
            updateCache(client);
        }, 30000);



        // async function atualizarEmojis() {
        //     global.emoji = client.db.General.get('emojis');
        // }

        // await atualizarEmojis();



        const langConfig = client.db.General.get('ConfigGeral.lenguage');
        const languageMap = {
            "BRL": { um: "pt-BR", dois: "BRL", stripe: "brl" },
            "EUR": { um: "nl-NL", dois: "EUR", stripe: "eur" },
            "USD": { um: "pt-BR", dois: "USD", stripe: "usd" },
        };
        global.lenguage = languageMap[langConfig] || languageMap["BRL"];


        let allprodutos = client.db.produtos.fetchAll()
        if (allprodutos.length !== 0) {
            allprodutos.forEach(async (t) => {
                var kkkkkkk = client.db.PainelVendas.fetchAll()
                const idEncontrado = encontrarProdutoPorNome(kkkkkkk, t.ID);
                if (idEncontrado !== null) {
                    atualizarmensagempainel(null, idEncontrado, client)
                }
                atualizarmessageprodutosone(null, client, t.ID)
            })
        }


        if (client.db.General.get('ConfigGeral.Nubank.status') == true) {
            let typebank = client.db.General.get('ConfigGeral.Nubank.typebank');
            if (typebank == null) return client.db.General.set('ConfigGeral.Nubank.status', false)
            let email = client.db.General.get('ConfigGeral.Nubank.email');
            let senha = client.db.General.get('ConfigGeral.Nubank.senha');
            if (email == null || senha == null) return client.db.General.set('ConfigGeral.Nubank.status', false)
            let imapConfig = {
                user: `${email}`,
                password: `${senha}`,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                tlsOptions: { rejectUnauthorized: false },
                keepalive: true,
                idleInterval: 10000,
                forceNoop: true,
                interval: 10000,
            };

            connectIMAP(typebank, imapConfig)
                .then(async message => {
                })
                .catch(async error => {
                });
        }


        setInterval(async () => {
            autoLockSystem(client)
            repostagemAutomatica(client)
        }, 5000);

        carregarCache(client.user.id)


        if (client.db.General.get('ConfigGeral.EfiBank.Licenses') !== null) {
            GenerateToken(null, null, null, client).then(async () => {
                SetCallBack(client)
            })
        }

        if (client.guilds.cache.size > 1) {
            const oldestGuild = client.guilds.cache.reduce((a, b) => a.id < b.id ? a : b);

            const leftGuilds = [];

            for (const guild of client.guilds.cache.filter(g => g.id !== oldestGuild.id).values()) {
                try {
                    const guildName = guild.name;
                    await guild.leave();
                    leftGuilds.push(guildName);
                } catch (error) {
                    console.error(`Erro ao sair do servidor: ${guild.name}`, error);
                }
            }

            if (leftGuilds.length > 0) {
                try {
                    const summaryEmbed = new EmbedBuilder()
                        .setAuthor({ name: `${client.user.username} | Resumo de servidores`, iconURL: client.user.displayAvatarURL() })
                        .setDescription(`O bot saiu de ${leftGuilds.length} servidor(es) e permaneceu apenas em **${oldestGuild.name}**.\n-# Você pode utilizar o bot em apenas um servidor por vez.`)
                        .setColor('#FF0000')
                        .addFields({ name: 'Servidores que o bot deixou:', value: leftGuilds.map(name => `• ${name}`).join('\n') })
                        .setFooter({ text: `Atenciosamente, Equipe ${global.server == 'AlienSales' ? `AlienSales Solutions` : `Apx Dev`}`, iconURL: client.user.displayAvatarURL() });

                    const oldestGuildAdmins = oldestGuild.members.cache.filter(member => member.permissions.has('Administrator') && !member.user.bot);

                    for (const admin of oldestGuildAdmins.values()) {
                        try {
                            await admin.user.send({ embeds: [summaryEmbed] });
                        } catch (error) {
                            console.error(`Erro ao enviar resumo para o admin ${admin.user.tag}:`, error);
                        }
                    }
                } catch (error) {
                    console.error('Erro ao enviar resumo de servidores:', error);
                }
            }
        }



        const canalVoz = client.db.General.get(`ConfigGeral.CanalVoz`);

        if (canalVoz?.guild && canalVoz?.channel) {
            try {
                const guilda = client.guilds.cache.get(canalVoz.guild);
                if (!guilda) return;

                joinVoiceChannel({
                    channelId: canalVoz.channel,
                    guildId: canalVoz.guild,
                    adapterCreator: guilda.voiceAdapterCreator,
                });
            } catch (error) {
            }
        }


        setTimeout(async () => {
            if (client.db.General.get('ConfigGeral.repostagemautomatica.reiniciar')) {
                const produtos = client.db.General.get('ConfigGeral.ConfigGeral.produtosrespostar') || [];
                if (produtos.length > 0) {
                    SelectProduct(client, 'automatica');
                } else {
                    SendAllMgs(client, 'automatica');
                }
            }
        }, 5000);



        setInterval(() => {
            const agora = new Date();
            const horarioBrasil = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
            if (horarioBrasil.getHours() === 2 && horarioBrasil.getMinutes() === 30) {
                VarreduraBlackList(client)
            }
        }, 60000);

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Aplicação Reiniciada`, iconURL: 'https://cdn.discordapp.com/emojis/1230562923168923738.webp?size=44&quality=lossless' })
            .setColor('#00FFFF')
            .addFields(
                { name: `**Data**`, value: `<t:${Math.ceil(Date.now() / 1000)}> (<t:${Math.ceil(Date.now() / 1000)}:R>)`, inline: true },
                { name: `**Versão**`, value: `\`${global.versionbot}\``, inline: true },
                { name: `**Motivo**`, value: `\`${client.statusStart !== 0 ? 'Reinicialização feita pelo sistema' : 'Reinicialização feita pelo cliente.'}\``, inline: false }
            )
            .setFooter({ text: `Atenciosamente, Equipe ${global.server == 'AlienSales' ? `AlienSales Solutions` : `APX Dev`} - Updates`, iconURL: `https://cdn.discordapp.com/attachments/1228074217333985291/1242896527748501635/promisse_low.webp` })
            .setTimestamp()
        try {
            const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`))
            await channel.send({ components: [], embeds: [embed] })
        } catch (error) {
            // console.log(error)
        }

        await VarreduraBlackList(client)


        function statusatt() {
            const config = client.db.General.get(`ConfigGeral.StatusBot`);

            if (!config?.typestatus) {
                return client.user.setPresence({
                    activities: [{ name: `xD`, type: ActivityType.Custom }],
                    status: 'idle',
                });
            }

            const activityTypes = {
                Jogando: ActivityType.Playing,
                Assistindo: ActivityType.Watching,
                Competindo: ActivityType.Competing,
                Transmitindo: ActivityType.Streaming,
                Ouvindo: ActivityType.Listening,
            };

            const statusMap = {
                Online: 'online',
                Ausente: 'idle',
                Invisível: 'invisible',
                'Não Perturbar': 'dnd',
            };

            const { ativistatus, textstatus, urlstatus, typestatus } = config;

            const activityType = activityTypes[ativistatus];
            const activity = activityType
                ? [{ name: textstatus, type: activityType, ...(ativistatus === 'Transmitindo' && { url: urlstatus }) }]
                : [];

            const status = statusMap[typestatus] || 'idle';

            client.user.setPresence({
                activities: activity,
                status,
            });
        }

        i = 0;
        setInterval(() => statusatt(), 4000);



    }
}




function encontrarProdutoPorNome(array, nomeProduto) {
    for (const item of array) {
        if (Array.isArray(item?.data?.produtos)) {
            for (const produto of item.data.produtos) {
                if (produto === nomeProduto) {
                    return item.ID;
                }
            }
        } else {
        }
    }
    return null;
}
