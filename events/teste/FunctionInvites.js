module.exports = {
    name: 'ready',
    once: true, // Indica que este evento deve ser executado apenas uma vez

    run: async (client) => {
        console.log(`${client.user.tag} está online!`);

        client.guildInvites = new Map();

        for (const guild of client.guilds.cache.values()) {
            await cacheGuildInvites(guild);
        }


        setupInviteTracking(client);
    }
};

async function cacheGuildInvites(guild) {
    try {
        const invites = await guild.invites.fetch();
        const codeUses = new Map();
        invites.forEach(invite => codeUses.set(invite.code, {
            uses: invite.uses,
            inviter: invite.inviter?.id,
            maxUses: invite.maxUses
        }));
        guild.client.guildInvites.set(guild.id, codeUses);
    } catch (error) {
        console.error(`Erro ao coletar convites de ${guild.name}: ${error.message}`);
    }
}

function setupInviteTracking(client) {
    client.on("inviteCreate", async (invite) => {
        await cacheGuildInvites(invite.guild);
    });

    client.on("inviteDelete", async (invite) => {
        await cacheGuildInvites(invite.guild);
    });

    client.on("guildMemberAdd", async (member) => {
        if (!client.guildInvites.has(member.guild.id)) return;

        try {
            const cachedInvites = client.guildInvites.get(member.guild.id);

            const newInvites = await member.guild.invites.fetch();

            let usedInvite = null;

            newInvites.forEach(invite => {
                const cachedInvite = cachedInvites.get(invite.code);
                if (cachedInvite && invite.uses > cachedInvite.uses) {
                    usedInvite = invite;
                }
            });

            await cacheGuildInvites(member.guild);

            if (usedInvite) {
                let qtdInvites = client.db.invite.get(`${usedInvite.inviter.id}`) || []
                // adicione no array o usuario convidado se ja tiver , não adicione
                if (!qtdInvites.includes(member.user.id)) {
                    qtdInvites.push(member.user.id)
                }

                client.db.invite.set(`${usedInvite.inviter.id}`, qtdInvites);

                let qtdInvitesNumber = qtdInvites.length;

                try {
                    let channelInvite = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelInvites`);
                    if (channelInvite) {
                        const channel = member.guild.channels.cache.get(channelInvite);
                        if (channel) {
                            channel.send({ content: `${member.user} (\`${member.user.id}\`) entrou usando o convite de ${usedInvite.inviter || 'Desconhecido'} (\`${usedInvite.inviter.id}\`) (\`${qtdInvitesNumber} uso(s)\`)` });
                        }
                    }
                } catch (error) {

                }


                console.log(`${member.user.tag} entrou usando o convite ${usedInvite.code} criado por ${usedInvite.inviter?.tag || 'Desconhecido'} `);

            } else {
                console.log(`${member.user.tag} entrou, mas não foi possível determinar qual convite foi usado`);
            }

        } catch (error) {
            console.error(`Erro ao rastrear convite: ${error.message}`);
        }
    });
}