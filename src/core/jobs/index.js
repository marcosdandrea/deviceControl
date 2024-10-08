const sendDMX = require('./job.sendDMX');
const wait = require('./job.wait');
const wakeOnLan = require('./job.wakeOnLan');
const sendTCP = require('./job.sendTCP');
const sendUDP = require('./job.sendUDP');

module.exports = {
    sendDMX,
    wakeOnLan,
    wait,
    sendTCP,
    sendUDP
}