const dgram = require('dgram')

class TriggerUDP {

    name = "UDP"

    constructor({ port, message }) {
        this.port = port;
        this.message = message;
        this.triggerHistory = [];
        this.armed = false;
    }

    arm(callback) {
        this.armed = true;
        const server = dgram.createSocket('udp4');
        server.bind(this.port);
        server.on('message', (msg, rinfo) => {
            if (msg != this.message) return;
            this.armed = false;
            callback()
            this.triggerHistory.push({
                timestamp: new Date(),
                ip: rinfo.address,
                port: rinfo.port,
                message: msg.toString()
            })
        });
    }

    clearHistory(){
        this.triggerHistory = []
    }

    toJSON(){
        return {
            name: this.name,
            port: this.port,
            message: this.message,
            triggerHistory: this.triggerHistory
        }
    }
}

module.exports = { TriggerUDP };