
const { Client } = require("discord.js");

async function StatusCloud(client) {

    return
    let dbb = client.db.OAuth2.fetchAll()

    if (dbb?.length == 0) return

    let itens = dbb[0].data.requestid
    if(itens == undefined) return
    if (itens?.lenght == 0) return
    for (const itens2 of itens) {

       
        request = await request.json()
        console.log(request)

        if (request?.message == "400: Bad Request") {
            let itensa = itens.filter(item => item.pass !== itens2.pass);
            client.db.OAuth2.set('Config.requestid', itensa)
            return
        }


        if (request.order.status == 'failed' || request.order.status == 'completed') {
            let qtd = request.order.amount
            let puxou = request.order.pulled.success

            let falhas = qtd - puxou


            let content = `Processo de **recuperação de membros** finalizado, total de \`${puxou}\` êxitos e \`${falhas}\` falhas, seu bot deverá ser expulso automaticamente por segurança. @here`

            try {
                const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`))
                await channel.send({ content: content })
            } catch (error) {

            }
           let itensa = itens.filter(item => item.pass !== itens2.pass);
            client.db.OAuth2.set('Config.requestid', itensa)
        }




    }
}

module.exports = {
    StatusCloud
}