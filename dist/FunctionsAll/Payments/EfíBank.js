const { default: axios } = require("axios")
const { MessageFlags, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const { getSaudacao } = require('../PermissionAPI/PermissionGet');

function ConfigEfíStart(client, interaction) {

    let status = client.db.General.get('ConfigGeral.EfiBank.status') ? true : false
    let emoji
    let label
    let buttonColor

    if (status == true) {
        status = `\`Ligado\``
        emoji = "<:desligar:1238978047504547871>"
        label = 'Desligar Efí Bank'
        buttonColor = 4
    } else {
        status = `\`Desligado\``
        emoji = "<:Ligado:1238977621220655125>"
        label = 'Ligar Efí Bank'
        buttonColor = 3
    }

    let embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Painel De Efí Bank')
        .setDescription(`${getSaudacao()} ${interaction.user.username}, seja muito bem-vindo(a) ao nosso sistema de vendas, desenvolvido especialmente para impulsionar suas vendas e elevar sua autoestima durante o processo, com uma divulgação automática, constante e estratégica em nossos canais parceiros.`)
        .addFields(
            { name: `Informações`, value: `-# - Nome da Aplicação: ${client.user}\n-# - Estou trabalhando <t:${Math.floor(client.readyAt.getTime() / 1000)}:R>`, inline: true },
            { name: `Efí Bank`, value: `-# - Status: ${client.db.General.get('ConfigGeral.EfiBank.status') == null ? '\`Desativado\`' : client.db.General.get('ConfigGeral.EfiBank.status') == true ? '\`Ativado\`' : '\`Desativado\`'}`, inline: false },
        );

    let components1 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId('EfíBankStatus')
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(buttonColor),
            new ButtonBuilder()
                .setCustomId('EfíBankConfig')
                .setLabel('Autorizar Efí Bank')
                .setEmoji('1282395493263081532')
                .setStyle(2)
        )
    let components2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('returnUpdatePagamento')
                .setEmoji('1237055536885792889')
                .setStyle(2),
        )

    return { embeds: [embed], flags: [MessageFlags.Ephemeral], components: [components1, components2] }

}

const https = require("https");


async function UpdatePix(chave, certificado, token) {
    const agent = new https.Agent({
        pfx: certificado,
        passphrase: '',
    });

    try {
        const payload = {
            "pix": {
                "receberSemChave": true,
                "chaves": {
                    [chave]: {
                        "recebimento": {
                            "txidObrigatorio": false,
                            "qrCodeEstatico": {
                                "recusarTodos": false
                            },
                            "webhook": {
                                "notificacao": {
                                    "tarifa": true,
                                    "pagador": true
                                }
                            }
                        }
                    }
                }
            }
        };

        await axios.put(
            'https://pix.api.efipay.com.br/v2/gn/config',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "x-skip-mtls-checking": true,
                },
                httpsAgent: agent,
            }
        );

    } catch (error) {
        console.error("Erro ao atualizar configuração do webhook:", error.response ? error.response.data : error.message);
    }
}
const fs = require("fs");
const path = require("path");
async function GenerateToken(clientid, clientsecret, certificado, client) {
    if (clientid == null || clientsecret == null || certificado == null) {
        clientid = client.db.General.get('ConfigGeral.EfiBank.Licenses.client_id')
        clientsecret = client.db.General.get('ConfigGeral.EfiBank.Licenses.client_secret')

        try {
            const certificadoPath = path.join(`./DataBaseJson/${client.db.General.get('ConfigGeral.EfiBank.Licenses.certificado')}`);
            const certificadoBuffer = fs.readFileSync(certificadoPath);


            certificado = certificadoBuffer
        } catch (error) {
            return client.db.General.delete('ConfigGeral.EfiBank.Licenses')
        }

    }


    const agent = new https.Agent({ pfx: certificado, passphrase: "" });

    const authData = Buffer.from(`${clientid}:${clientsecret}`).toString("base64");


    const tokenResponse = await axios.post(
        "https://pix.api.efipay.com.br/oauth/token",
        JSON.stringify({ grant_type: "client_credentials" }),
        {
            headers: {
                Authorization: `Basic ${authData}`,
                "Content-Type": "application/json",
            },
            httpsAgent: agent,
        }
    );
    global.tokenefi = tokenResponse.data.access_token;
    return tokenResponse.data.access_token;

}

async function SetCallBack(client) {
    let certificado
    try {
        certificado = fs.readFileSync(`./DataBaseJson/${client.db.General.get('ConfigGeral.EfiBank.Licenses.certificado')}`);
    } catch (error) {
        return client.db.General.delete('ConfigGeral.EfiBank.Licenses')
    }
    const agent = new https.Agent({

        pfx: certificado,
        passphrase: '', // Add passphrase if required
    });

    const chave = client.db.General.get('ConfigGeral.EfiBank.Licenses.chavepix')

    const response = await axios.put(
        `https://pix.api.efipay.com.br/v2/webhook/${chave}`,
        {
            webhookUrl: "https://promisseapi.squareweb.app/efibank/callback?ignorar=",
        },
        {
            headers: {
                Authorization: `Bearer ${global.tokenefi}`,
                "Content-Type": "application/json",
                "x-skip-mtls-checking": true,
            },
            httpsAgent: agent,
        }
    );
    return true

}




async function createCobEfi(price, desc, username, client) {
    let certificado
    try {
        certificado = fs.readFileSync(`./DataBaseJson/${client.db.General.get('ConfigGeral.EfiBank.Licenses.certificado')}`);
    } catch (error) {
        return client.db.General.delete('ConfigGeral.EfiBank.Licenses')
    }

    const agent = new https.Agent({
        pfx: certificado,
        passphrase: '',
    });
    let chave = String(client.db.General.get('ConfigGeral.EfiBank.Licenses.chavepix'))
    let precoString = price == 0 ? '0.01' : price.toFixed(2);

    const data = {
        calendario: {
            expiracao: 3600
        },
        devedor: {
            cpf: '12345678909',
            nome: username
        },
        valor: {
            original: `${precoString}`
        },
        chave: chave,
        solicitacaoPagador: desc
    };


    const config = {
        method: 'POST',
        url: 'https://pix.api.efipay.com.br/v2/cob',
        headers: {
            Authorization: `Bearer ${global.tokenefi}`,
            'Content-Type': 'application/json',
        },
        httpsAgent: agent,
        data: data,
    };

    try {
        const response = await axios(config);

        return response.data;
    } catch (error) {
        // console.log(error)
        //console.error('Erro ao criar cobrança:', error.response ? error.response.data : error.message);
    }
}

async function generateQRCode(locID, client) {



    let certificado
    try {
        certificado = fs.readFileSync(`./DataBaseJson/${client.db.General.get('ConfigGeral.EfiBank.Licenses.certificado')}`);
    } catch (error) {
        return client.db.General.delete('ConfigGeral.EfiBank.Licenses')
    }
    const agent = new https.Agent({
        pfx: certificado,
        passphrase: '',
    });

    const config = {
        method: 'GET',
        url: `https://pix.api.efipay.com.br/v2/loc/${locID}/qrcode`,
        headers: {
            Authorization: `Bearer ${global.tokenefi}`,
            'Content-Type': 'application/json',
        },
        httpsAgent: agent,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error('Erro ao gerar QR Code:', error.response ? error.response.data : error.message);
    }
}


async function ReembolsoEfi(txid, client) {

    let certificado
    try {
        certificado = fs.readFileSync(`./DataBaseJson/${client.db.General.get('ConfigGeral.EfiBank.Licenses.certificado')}`);
    } catch (error) {
        return client.db.General.delete('ConfigGeral.EfiBank.Licenses')
    }
    const agent = new https.Agent({
        pfx: certificado,
        passphrase: '',
    });

    const config = {
        method: 'GET',
        url: `https://pix.api.efipay.com.br/v2/cob/${txid}`,
        headers: {
            Authorization: `Bearer ${global.tokenefi}`,
            'Content-Type': 'application/json',
        },
        httpsAgent: agent,
    };
    let endtoendid
    let valor
    try {
        const response = await axios(config);
        endtoendid = response.data.pix[0].endToEndId
        valor = response.data.valor.original
    } catch (error) {
        console.error('Erro ao reembolsar pagamento:', error.response ? error.response.data : error.message);
    }

    const config2 = {
        method: 'PUT',
        url: `https://pix.api.efipay.com.br/v2/pix/${endtoendid}/devolucao/${txid}`,
        headers: {
            Authorization: `Bearer ${global.tokenefi}`,
            'Content-Type': 'application/json',
        },
        httpsAgent: agent,
        data: {
            valor: valor
        }
    };

    try {
        const response = await axios(config2);
        return response.data
    } catch (error) {
        console.error('Erro ao reembolsar pagamento:', error.response ? error.response.data : error.message);
    }


}


module.exports = { ConfigEfíStart, UpdatePix, GenerateToken, SetCallBack, createCobEfi, generateQRCode, ReembolsoEfi }