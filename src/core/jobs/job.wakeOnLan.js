const dgram = require('dgram');

function wakeOnLan() {}

wakeOnLan.run = function ({ macAddress }) {
    return new Promise(async (resolve, reject) => {
        const buildMagicPacket = (macAddress) => {
            macAddress = macAddress.replace(/[:-]/g, ''); // Eliminar los separadores
            if (macAddress.length !== 12) {
                throw new Error('Dirección MAC no válida');
            }
            let magicPacket = 'FFFFFFFFFFFF';
            for (let i = 0; i < 16; i++) {
                magicPacket += macAddress;
            }
            return Buffer.from(magicPacket, 'hex');
        }

        const client = dgram.createSocket('udp4');
        client.bind(() => { client.setBroadcast(true); });

        try {
            const magicPacket = buildMagicPacket(macAddress);
            const PORT = 9;
            const HOST = '255.255.255.255';
            const packetsAmount = 10;

            const send = () => {
                return new Promise((resolve, reject) => {
                    client.send(magicPacket, PORT, HOST, (err) => {
                        if (err) {
                            reject(`Error al enviar el mensaje: ${err}`);
                        } else {
                            resolve();
                        }
                    });
                });
            }

            const packets = [];
            for (let i = 0; i < packetsAmount; i++) {
                packets.push(send());
            }

            await Promise.all(packets);
            client.close(); // Cerrar el socket después de enviar todos los paquetes
            resolve();
        } catch (err) {
            client.close();
            reject(err);
        }
    });
}

wakeOnLan.args = function () {
    return [{
        name: 'macAddress',
        description: 'Dirección MAC de la tarjeta Ethernet a encender',
        type: 'string',
        required: true
    }];
}

module.exports = wakeOnLan;
