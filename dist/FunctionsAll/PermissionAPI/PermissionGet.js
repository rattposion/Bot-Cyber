const { ActionRowBuilder } = require("discord.js");

function getCache(userId) {


}

function updateCache(params) {
    
}

function getSaudacao() {
    const brazilTime = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    const hora = new Date(brazilTime).getHours();

    if (hora < 12) {
        return 'Bom dia';
    } else if (hora < 18) {
        return 'Boa tarde';
    } else {
        return 'Boa noite';
    }
}

module.exports = {
    getCache,
    getSaudacao,
    updateCache
};
