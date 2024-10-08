const _ping = require('ping');

function ping(){}

ping.run = async ({ip}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await _ping.promise.probe(ip);
            if (res.alive) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
};

ping.args = () => {
    return [{
        name: 'ip',
        description: 'Dirección IP del dispositivo a llamar',
        type: 'string',
        required: true
    }]
}


module.exports = ping