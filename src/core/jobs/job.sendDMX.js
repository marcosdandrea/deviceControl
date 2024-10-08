const {Artnet} = require("../drivers/Artnet")

function sendDmx () {}

sendDmx.run = ({ipToSend, universe, net, subnet, channel, value }) =>{
    const artnet = new Artnet(ipToSend, universe, net, subnet)
    artnet.send({
        channel,
        value,
    })
}

sendDmx.args = () => {
    return [
        {
            name: 'universe',
            type: 'number',
            description: 'Art-Net universe to send the DMX data to',
            required: true,
        },
        {
            name: 'net',
            type: 'number',
            description: 'Art-Net network to send the DMX data to',
            required: false,
        },
        {
            name: 'subnet',
            type: 'number',
            description: 'Art-Net subnet to send the DMX data to',
            required: false,
        },
        {
            name: 'channel',
            type: 'number',
            description: 'Channel to send the DMX data to',
            required: true,
        },
        {
            name: 'value',
            type: 'number',
            description: 'Value to send to the specified channel',
            required: true,
        },
        {
            name: 'ipToSend',
            type:'string',
            description: 'IP address to send the DMX data to. If empty, will send broadcast.',
            required: false,
        }
    ]
}

module.exports = sendDmx