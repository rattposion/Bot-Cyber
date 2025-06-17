
const config = require("../../../deploy.json");

async function AtivarIntents() {

    await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `Bot ${config.token}`,
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const url = `https://discord.com/api/v9/applications/${data.id}`;
            fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${config.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "flags": 8953856,
                    "custom_install_url": "https://discord.gg/7ZkH4992zz",
                    "install_params": null
                }),
            });

        })
}




module.exports = {
    AtivarIntents
}
