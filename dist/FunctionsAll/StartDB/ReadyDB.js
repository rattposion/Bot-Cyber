const fs = require('fs');
const { JsonDatabase } = require('wio.db');

function StartDB(client) {
    const databasePath = `./DataBaseJson`;
    let a = 0
    if (!fs.existsSync(databasePath)) {
        fs.mkdirSync(databasePath, { recursive: true });
        a = 1
    }
    client.db = {
        Giveaways: new JsonDatabase({
            databasePath: `${databasePath}/Giveaways.json`
        }),
        PagamentoImap: new JsonDatabase({
            databasePath: `${databasePath}/PagamentosImap.json`
        }),
        drops: new JsonDatabase({
            databasePath: `${databasePath}/drops.json`
        }),
        giftcards: new JsonDatabase({
            databasePath: `${databasePath}/giftcards.json`
        }),
        General: new JsonDatabase({
            databasePath: `${databasePath}/General.json`
        }),
        PagamentosSaldos: new JsonDatabase({
            databasePath: `${databasePath}/PagamentosSaldos.json`
        }),
        Keys: new JsonDatabase({
            databasePath: `${databasePath}/Keys.json`
        }),
        produtos: new JsonDatabase({
            databasePath: `${databasePath}/produtos.json`
        }),
        estatisticas: new JsonDatabase({
            databasePath: `${databasePath}/estatisticas.json`
        }),
        DefaultMessages: new JsonDatabase({
            databasePath: `${databasePath}/DefaultMessages.json`
        }),
        Carrinho: new JsonDatabase({
            databasePath: `${databasePath}/Carrinho.json`
        }),
        Pagamentos: new JsonDatabase({
            databasePath: `${databasePath}/Pagamentos.json`
        }),
        Cupom: new JsonDatabase({
            databasePath: `${databasePath}/Cupom.json`
        }),
        StatusCompras: new JsonDatabase({
            databasePath: `${databasePath}/StatusCompras.json`
        }),
        RoleTime: new JsonDatabase({
            databasePath: `${databasePath}/RoleTime.json`
        }),
        PainelVendas: new JsonDatabase({
            databasePath: `${databasePath}/PainelVendas.json`
        }),
        usuariosinfo: new JsonDatabase({
            databasePath: `${databasePath}/usuariosinfo.json`
        }),
        estatisticasgeral: new JsonDatabase({
            databasePath: `${databasePath}/estatisticasgeral.json`
        }),
        sugerir: new JsonDatabase({
            databasePath: `${databasePath}/sugerir.json`
        }),
        invite: new JsonDatabase({
            databasePath: `${databasePath}/invite.json`
        }),
        blacklist: new JsonDatabase({
            databasePath: `${databasePath}/blacklist.json`
        }),
        entradas: new JsonDatabase({
            databasePath: `${databasePath}/entradas.json`
        }),
        blacklistAll: new JsonDatabase({
            databasePath: `${databasePath}/blacklistAll.json`
        }),
        OAuth2: new JsonDatabase({
            databasePath: `${databasePath}/OAuth2.json`
        }),
        MensagensAutomaticas: new JsonDatabase({
            databasePath: `${databasePath}/MensagensAutomaticas.json`
        }),
        Anuncio: new JsonDatabase({
            databasePath: `${databasePath}/Anuncio.json`
        }),
    };
    global.emoji = client.db.General.get('emojis');

    const dbs = Object.keys(client.db);
    for (const db of dbs) {
        try {
            if (!client.db[db].all()) {
            }
        } catch (error) {
            fs.writeFileSync(`./DataBaseJson/${db}.json`, '{}');

        }

    }

    if (a == 1) {


        client.db.DefaultMessages.set(`ConfigGeral`, {
            embeddesc: "\n#{desc}\n\n💸 **| Valor à vista:** `#{preco}`\n📦 **| Restam:** `#{estoque}`",
            embedtitle: "#{nome} | Produto",
            emojibutton: "1243275863827546224"
        })

        client.db.General.set(`ConfigGeral`, {
            Status: "ON",
            ColorEmbed: "#008000",
            TermosCompra: "Não definido",
            MercadoPagoConfig: {
                PixToggle: "OFF",
                SiteToggle: "OFF",
                TimePagament: "20",
                TokenAcessMP: ""
            },
            SaldoConfig: {
                SaldoStatus: "ON",
                Bonus: "10",
                ValorMinimo: "10"
            },
            SemiAutoConfig: {
                SemiAutoStatus: "ON",
                pix: "",
                qrcode: ""
            },
            CashBack: {
                ToggleCashBack: "OFF",
                Porcentagem: "10"
            },
            StatusBot: {
                typestatus: null,
                ativistatus: null,
                textstatus: null,
                urlstatus: null
            }
        })

    }

}

module.exports = StartDB;