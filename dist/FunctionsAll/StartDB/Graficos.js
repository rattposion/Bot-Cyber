const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
async function Grafico(valores, dias, label) {
    const width = 1000;  
    const height = 500;  
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width,
        height
    });

    const config = {
        type: 'line',
        data: {
            labels: dias,
            datasets: [{
                label,
                data: valores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.5,
                datalabels: {
                    display: true,
                    color: 'white',  
                    font: {
                        size: 16, 
                        weight: '4',  
                        family: 'Helvetica Neue, sans-serif'  
                    },
                    align: 'top',  
                    anchor: 'end', 
                    offset: 8, 
                    formatter: function (value) {
                        return `${value.toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`; 
                    }
                }
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 18 
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', 
                        lineWidth: 0.5 
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return `${value.toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}`; 
                        },
                        color: 'white', 
                        font: {
                            size: 18 
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', 
                        lineWidth: 0.5
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white', 
                        font: {
                            size: 18 
                        }
                    }
                },
                tooltip: {
                    titleColor: 'white', 
                    bodyColor: 'white', 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    borderColor: 'rgba(75, 192, 192, 1)', 
                    borderWidth: 1
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0.7 
                }
            }
        }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);

    return imageBuffer
}


module.exports = {
    Grafico
}