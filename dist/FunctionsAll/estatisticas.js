function Estatisticas(client, dias) {
    const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const u = client.db.estatisticasgeral.fetchAll();

    const now = new Date();
    const today = startOfDay(now);
    const daysAgo = startOfDay(new Date(today.getTime() - dias * 24 * 60 * 60 * 1000));

    let price = 0;
    let qtd = 0;
    let produtos = 0;

    let totalPedidos = 0;
    let totalRecebidos = 0;
    let totalProdutos = 0;

    for (const element of u) {
        if (element.data.Status === 'Entregue') {
            const elementDate = startOfDay(new Date(element.data.Data));

            if (elementDate >= daysAgo && elementDate <= today) {
                price += Number(element.data.valortotal);
                qtd += 1;
                if (element.data.produtos) {
                    produtos += element.data.produtos;
                }
            }

            totalRecebidos += Number(element.data.valortotal);
            totalPedidos += 1;
            if (element.data.produtos) {
                totalProdutos += element.data.produtos;
            }
        }
    }

    return {
        intervalo: {
            dias: dias,
            valorTotal: price,
            quantidadePedidos: qtd,
            totalProdutos: produtos,
        },
        total: {
            valorTotal: totalRecebidos,
            quantidadePedidos: totalPedidos,
            totalProdutos: totalProdutos,
        }
    };
}

module.exports = Estatisticas;
