const net = require('net')

function sendTCP() { }

sendTCP.run = ({ ip, port, message }) => {
    return new Promise((resolve, reject) => {
        
        const client = net.createConnection(port, ip)
    
        client.on("connect", () => {
            client.write(message, (err) => {
                if (err) {
                    reject(`Error al enviar el mensaje: ${err.message}`);
                } else {
                    client.end();
                    resolve();
                }
            });
        });
    
        client.on("error", (err) => {
            reject(`Error al conectar con el dispositivo: ${err.message}`);
        });
    });
}

sendTCP.args = function () {
    return [
        {
            name: 'ip',
            description: 'Dirección ip donde se realizará la conexión',
            type: 'string',
            required: true
        },
        {
            name: 'port',
            description: 'Puerto de la dirección ip donde se realizará la conexión',
            type: 'number',
            required: true
        },
        {
            name: 'message',
            description: 'El mensaje que se enviará',
            type: 'string',
            required: true
        }
    ];
}

module.exports = sendTCP;