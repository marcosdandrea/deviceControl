const dgram = require("dgram")

function sendUDP() { }

sendUDP.run = ({ ip, port, message }) => {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket("udp4")

        const broadcast = new RegExp("^(\d{1,3}\.){3}\d{1,3}\.255$")

        if (broadcast.test(ip))
            client.setBroadcast(true)

        client.send(message, port, ip, (err) => {
            if (err)
                reject(err)
            else
                resolve()
            client.close()
        })

        client.on("error", (err) => {
            reject(err)
            client.close()
        })

    })

}

sendUDP.args = () => {
    return [
        {
            name: 'ip',
            type: 'string',
            description: 'La dirección IP del dispositivo. Puede usar direcciones broadcast termiandas en 255.'
        },
        {
            name: 'port',
            type: 'number',
            description: 'El puerto UDP al que se enviará el mensaje'
        },
        {
            name: 'message',
            type: 'string',
            description: 'El mensaje a enviar'
        }
    ];
}

module.exports = sendUDP