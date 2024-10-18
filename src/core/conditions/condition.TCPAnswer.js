const net = require('net');
const errorTranslating = require("../common/errorTransalting")

function TCPAnswer() { }

const verbose = false

TCPAnswer.run = async ({ ip, port, messageToSend, messageToExpect }) => {
    return new Promise((resolve, reject) => {
        let timeout = undefined;

        const client = new net.createConnection(port, ip)

        client.on("connect", async ()=> {
            if (verbose) console.log(`Connected to ${ip}:${port}`);
            await client.write(messageToSend);
            if (verbose) console.log(`Message "${messageToSend}" sent to ${ip}:${port}`);
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                reject("Tiempo de espera de respuesta agotado")
                client.end()
            }, 20000)
        })

        client.on("data", (message) => {
            if (verbose) console.log(`Received: ${message.toString()}`)
                
            if (message.toString().trim() === messageToExpect.trim()) {
                resolve(true)
            } else {
                reject(`No se recibió el mensaje esperado. Se esperaba "${messageToExpect}" y se recibió "${message.toString()}"`)
            }
            client.end()
            clearTimeout(timeout)
        })

        client.on("error", (err) => {
            reject(errorTranslating.net[err.code] + ": " + err.message);
            client.end()
        })

    })
}

TCPAnswer.args = () => {
    return [
        {
            name: 'ip',
            type: 'string',
            description: 'Dirección IP del dispositivo con el que se va a comunicar',
            required: true
        },
        {
            name: 'port',
            type: 'number',
            description: 'Número del puerto TCP',
            required: true
        },
        {
            name: 'messageToSend',
            type: 'string',
            description: 'Mensaje como cadena de caracteres no vacío',
            required: true
        },
        {
            name: 'messageToExpect',
            type: 'string',
            description: 'Mensaje que se espera como una cadena de caracteres no vacío',
            required: true
        }
    ]
}

module.exports = TCPAnswer;