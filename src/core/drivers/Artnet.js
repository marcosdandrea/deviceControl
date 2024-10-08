const events = require("events");
const { dmxnet } = require("dmxnet");

const artnetEvents = Object.freeze({
    packetReceived: "packetReceived",
});

class Artnet extends events {
    static dmxnetInstance = null;
    static senders = new Map();
    static receivers = new Map();

    constructor(ipToSend, subnet, universe, net, port, refreshInterval) {
        super();
        this.ipToSend = ipToSend || "255.255.255.255";
        this.subnet = Number(subnet) || 0;
        this.universe = Number(universe) || 0;
        this.net = Number(net) || 0;
        this.port = Number(port) || 6454;
        this.refreshInterval = Number(refreshInterval) || 1000;

        this.dmxFrame = new Array(512).fill(0); // Inicializa dmxFrame con 512 canales en 0

        this.#initializeArtnet();
    }

    #eventDispatcher(event, data) {
        this.emit(event, data);
    }

    static #createDmxnetInstance() {
        if (!Artnet.dmxnetInstance) {
            const dmxnetOptions = {
                log: { silent: true, level: "error" },
                oem: 0,
                esta: 0,
                sName: "Kinetik CMS",
                lName: "Kinetik - Dynamic Digital Signage",
            };
            Artnet.dmxnetInstance = new dmxnet(dmxnetOptions);
        }
        return Artnet.dmxnetInstance;
    }

    #initializeArtnet() {
        Artnet.dmxnetInstance = Artnet.#createDmxnetInstance();
        this.#initializeSender();
        this.#initializeReceiver();
    }

    #initializeReceiver() {
        const receiverKey = `Rec-${this.ipToSend}-${this.subnet}-${this.universe}-${this.net}`;

        if (!Artnet.receivers.has(receiverKey)) {
            const receiver = Artnet.dmxnetInstance.newReceiver({
                subnet: this.subnet,
                universe: this.universe,
                net: this.net,
            });

            Artnet.receivers.set(receiverKey, receiver);
        }

        this.receiver = Artnet.receivers.get(receiverKey);
        this.#initializeListeners(this.receiver);
    }

    #initializeListeners(receiver) {
        receiver.on("data", (data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== this.dmxFrame[i]) {
                    this.dmxFrame[i] = data[i];
                    this.emit(`ch${i}`, data[i]); // Emite un evento para el canal cambiado
                }
            }
        });
    }

    #initializeSender() {
        const senderKey = `Sen-${this.ipToSend}-${this.subnet}-${this.universe}-${this.net}`;

        if (!Artnet.senders.has(senderKey)) {
            const sender = Artnet.dmxnetInstance.newSender({
                ip: this.ipToSend,
                subnet: this.subnet,
                universe: this.universe,
                net: this.net,
                port: this.port,
                base_refresh_interval: this.refreshInterval,
            });

            Artnet.senders.set(senderKey, sender);
        }

        this.sender = Artnet.senders.get(senderKey);
    }

    send({ channel, value }) {
        if (channel > 511 || channel < 1) {
            throw new Error("Channel must be between 1 and 511");
        }
        if (value > 255 || value < 0) {
            throw new Error("Value must be between 0 and 255");
        }
        this.sender.setChannel(channel - 1, value);
    }

    reset() {
        this.sender.reset();
    }

    // Método para suscribirse a eventos de un canal específico
    onChannel(channel, listener) {
        if (channel < 1 || channel > 511) {
            throw new Error("Channel must be between 1 and 512");
        }
        this.on(`ch${channel-1}`, listener);
    }
}

module.exports = { Artnet, artnetEvents };
