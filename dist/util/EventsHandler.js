const fs = require('fs');
const path = require('path');

module.exports = {

    run: (client) => {

        const eventsPath = path.resolve(__dirname, '../events');
        fs.readdirSync(eventsPath).forEach(local => {
            const localPath = path.resolve(eventsPath, local);
            const eventFiles = fs.readdirSync(localPath).filter(arquivo => arquivo.endsWith('.js'));
            for (const file of eventFiles) {
                const event = require(path.resolve(localPath, file));
                if (event.once) {
                    client.once(event.name, (...args) => event.run(...args, client));
                } else {
                    client.on(event.name, (...args) => event.run(...args, client));
                }
            }
        });
    }
}