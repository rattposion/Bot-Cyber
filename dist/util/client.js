const { Client, GatewayIntentBits, Partials } = require("discord.js");

class MainClient extends Client {
    constructor() {
        super({
            shards: "auto",
            allowedMentions: { parse: ["users", "roles"] },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildInvites
            ],
            partials: [Partials.Channel, Partials.Message]
        });

        process.on('unhandledRejection', error => this.handleError(error));
        process.on('uncaughtException', error => this.handleError(error));

        // veja se existe o arquivo config.json
        this.deploy = require('../../deploy.json');
        if (!require('fs').existsSync('./config.json')) {
            this.token = this.deploy.token;
        } else {
            this.config = require('../config.json');
            this.deploy = require('../../deploy.json');
            if (this.deploy.token) {
                this.token = this.deploy.token
            } else {
                this.token = this.config.token;
            }
        }



        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async connect() {
        try {
            return await super.login(this.token);
        } catch (error) {
            this.handleError(error);
            // stop bot 
           // this.scheduleReconnect();
        }
    }

    handleError(error) {
        console.log(error)
        console.log(`\x1b[31m[ERRO START]\x1b[0m Ocorreu um erro inesperado: ${error.message}`);
    }

    // scheduleReconnect() {
    //     console.log(`\x1b[31m[ERRO]\x1b[0m Token inválido, estamos recorrentemente tentando reconectar`);
    //     setTimeout(() => this.connect(), 30000);
    // }
}

// Exporta a classe para uso em outro lugar
module.exports = MainClient;
