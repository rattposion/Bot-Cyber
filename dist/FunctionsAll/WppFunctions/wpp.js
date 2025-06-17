async function SendMessageZap(number, message) {
    const axios = require('axios');
    let data = JSON.stringify({
        "number": number,
        "message": message
    });

   
    await axios.request(config)


}

module.exports = {
    SendMessageZap  
}