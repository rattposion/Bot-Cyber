const fs = require('fs');
const path = require('path');

module.exports = {
    run: (client) => {
        const SlashsArray = [];
        const commandsPath = path.join(__dirname, '..', 'commands');

        fs.readdir(commandsPath, (erro, pasta) => {
            if (erro) {
                console.error("Erro ao ler pasta commands:", erro);
                return;
            }

            pasta.forEach(subpasta => {
                const subpastaPath = path.join(commandsPath, subpasta);
                fs.readdir(subpastaPath, (erro, arquivos) => {
                    if (erro) {
                        console.error(`Erro ao ler subpasta ${subpasta}:`, erro);
                        return;
                    }

                    arquivos.forEach(arquivoNome => {
                        if (!arquivoNome.endsWith('.js')) return;

                        // Usa caminho absoluto para o require
                        const arquivoPath = path.join(subpastaPath, arquivoNome);
                        const arquivo = require(arquivoPath);

                        if (!arquivo?.name) return;

                        client.slashCommands.set(arquivo.name, arquivo);
                        SlashsArray.push(arquivo);
                    });
                });
            });
        });

        client.on("ready", async () => {
            client.statusStart = 0;
            console.log(`\x1b[36m[INFO]\x1b[0m ${client.user.tag} has started - Serving ${client.guilds.cache.size} servers - Accessing ${client.channels.cache.size} channels - Tracking ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`);

            try {
                await client.application.commands.set(SlashsArray);
                console.log(`\x1b[36m[Slash Commands]\x1b[0m Commands loaded successfully!`);
            } catch (err) {
                console.error("Erro ao registrar slash commands:", err);
            }
        });
    }
};
