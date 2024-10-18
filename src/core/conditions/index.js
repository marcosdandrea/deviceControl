const ping = require('./condition.ping');
const UDPAnswer = require('./condition.UDPAnswer');
const TCPAnswer = require('./condition.TCPAnswer');
const pjLinkStatus = require('./condition.pjLinkStatus');

module.exports = {
    ping,
    UDPAnswer,
    TCPAnswer,
    pjLinkStatus
}