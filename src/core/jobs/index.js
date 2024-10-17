const sendDMX = require('./job.sendDMX');
const wait = require('./job.wait');
const wakeOnLan = require('./job.wakeOnLan');
const sendTCP = require('./job.sendTCP');
const sendUDP = require('./job.sendUDP');
const pjLinkCommand = require('./job.pjLinkCommand');

module.exports = {
    sendDMX,
    wakeOnLan,
    wait,
    sendTCP,
    sendUDP,
    pjLinkCommand
}