const dgram = require('dgram');

function UDPAnswer() {}

UDPAnswer.run = ({ip, port, messageToSend, messageToExpect}) => {
    return new Promise((resolve, reject) => {

        let timeout = undefined;

        const client = dgram.createSocket('udp4');
        const broadcast = new RegExp("^(\d{1,3}\.){3}\d{1,3}\.255$")
        if (broadcast.test(ip)) client.setBroadcast(true)

        client.send(messageToSend, port, ip, (err) => {
            if (err) {
                reject(err)
                return
            }

            clearTimeout(timeout)
            timeout = setTimeout(() => {
                client.close()
                reject(new Error('Timeout'))
            }, 5000)
        })

        client.on('message', (message, rinfo) => {
            if (message.toString() === messageToExpect) {
                client.close()
                resolve()
                clearTimeout(timeout)
            }
        })


    })
}

UDPAnswer.args = () => {
    return [
        { name: 'ip', type: 'string', required: true },
        { name: 'port', type: 'number', required: true },
        { name: 'messageToSend', type: 'string', required: true },
        { name: 'messageToExpect', type: 'string', required: true },
    ]
}

module.exports = UDPAnswer;