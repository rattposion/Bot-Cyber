const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'ready',
    run: async (client) => {
        const ultimosEnvios = new Map();

        async function enviarMensagem(mensagem, canalId, client, chave) {
            try {
                const agora = Date.now();
                const mensagemSalva = client.db.MensagensAutomaticas.get(chave);
                const ultimoEnvio = mensagemSalva?.timestamp || 0;
                const intervalo = parseInt(mensagem.time, 10) * 1000;

                if (agora - ultimoEnvio < intervalo) return;

                const canal = client.channels.cache.get(canalId);
                if (!canal) return client.db.MensagensAutomaticas.delete(chave);

                if (mensagemSalva?.id) {
                    try {
                        const msgAnterior = await canal.messages.fetch(mensagemSalva.id).catch(() => null);
                        if (msgAnterior) await msgAnterior.delete().catch(() => { });
                    } catch (err) {
                        console.error("Erro ao deletar mensagem antiga:", err);
                    }
                }

                // Criar componentes (botões)
                const components = [];
                if (mensagem.buttons?.length > 0) {
                    for (let i = 0; i < mensagem.buttons.length; i += 5) {
                        const row = new ActionRowBuilder();
                        mensagem.buttons.slice(i, i + 5).forEach(button => {
                            const btn = new ButtonBuilder()
                                .setLabel(button.label)
                                .setURL(button.url)
                                .setStyle(ButtonStyle.Link);
                            if (button.emoji) btn.setEmoji(button.emoji);
                            row.addComponents(btn);
                        });
                        components.push(row);
                    }
                } else {
                    components.push(
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('autoMsg')
                                .setLabel('Mensagem Automática')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                    );
                }

                // Enviar mensagem
                let msg;
                if (!mensagem.titulo && !mensagem.bannerembed) {
                    msg = await canal.send({ content: mensagem.descricao, components });
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(client.db.General.get('ConfigGeral.ColorEmbed') || 'Random')
                        .setTitle(mensagem.titulo || '')
                        .setDescription(mensagem.descricao || '')
                        .setImage(mensagem.bannerembed || '');

                    msg = await canal.send({ embeds: [embed], components });
                }

                // Salvar info da mensagem enviada
                ultimosEnvios.set(chave, agora);
                client.db.MensagensAutomaticas.set(chave, {
                    id: msg.id,
                    channel: canalId,
                    timestamp: agora
                });

            } catch (error) {
                console.error(`Erro ao enviar mensagem automática:`, error);
            }
        }

        const agendadas = new Map();

        function agendarMensagens(client) {
            const verificarMensagens = async () => {
                const configuracoes = client.db.General.get('ConfigGeral.AutoMessage');

                if (!configuracoes) {
                    // Limpar todas
                    for (const [, interval] of agendadas) clearInterval(interval);
                    agendadas.clear();
                    return;
                }

                const mensagensAtuais = new Set();

                for (const [mensagem] of configuracoes) {
                    const chaveMensagem = `${mensagem.idchanell}-${mensagem.time}`;

                    mensagensAtuais.add(chaveMensagem);

                    if (!agendadas.has(chaveMensagem)) {
                        await enviarMensagem(mensagem, mensagem.idchanell, client, chaveMensagem);

                        const intervalo = setInterval(() => {
                            enviarMensagem(mensagem, mensagem.idchanell, client, chaveMensagem);
                        }, parseInt(mensagem.time, 10) * 1000);

                        agendadas.set(chaveMensagem, intervalo);
                    }
                }

                // Remover agendamentos antigos
                for (const [chave, interval] of agendadas) {
                    if (!mensagensAtuais.has(chave)) {
                        clearInterval(interval);
                        agendadas.delete(chave);
                        ultimosEnvios.delete(chave);
                        client.db.MensagensAutomaticas.delete(chave);
                    }
                }
            };

            // Verifica a cada segundo
            setInterval(verificarMensagens, 1000);
            verificarMensagens();
        }

        // Inicializar agendamento após pequeno delay
        setTimeout(() => agendarMensagens(client), 1000);
    }
};
