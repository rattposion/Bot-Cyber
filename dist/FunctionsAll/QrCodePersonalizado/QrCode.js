const QRCode = require('qrcode');
const fs = require('fs');
const path = './DataBaseJson/qrcode.png';

async function GerarQrCode(payloadPix) {
    try {
        await QRCode.toFile(path, payloadPix, {
            type: 'png',
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });
        const buffer = fs.readFileSync(path);
        return buffer;
    } catch (err) {
        console.error('Erro ao gerar QR Code:', err);
        return null;
    }
}

module.exports = {
    GerarQrCode
};
