const net = require("net");
const errorTranslating = require("../common/errorTransalting")

const PjLinkCommands = {
  checkPowerOn: {
    send: "%1POWR=?",
    expected: "%1POWR=1",
  },
  checkPowerOff: {
    send: "%1POWR=?",
    expected: "%1POWR=0",
  },
};

function PjLinkStatus() {}

const verbose = false;

PjLinkStatus.run = async ({ ip, command }) => {
  if (!Object.keys(PjLinkCommands).includes(command))
    throw new Error("Unknown pjLink command");

  const port = 4352;
  const messageToSend = PjLinkCommands[command].send;
  const messageToExpect = PjLinkCommands[command].expected;

  return new Promise((resolve, reject) => {
    let timeout = undefined;

    const client = new net.createConnection(port, ip);

    client.on("connect", async () => {
      if (verbose) console.log(`Connected to ${ip}:${port}`);

      await client.write(`${messageToSend}/r`, () => {
        if (verbose)
          console.log(`Message "${messageToSend}" sent to ${ip}:${port}`);
      });

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        reject("Tiempo de espera de respuesta agotado");
        client.end();
      }, 20000);
    });

    client.on("data", (message) => {
      if (verbose) console.log(`Received: ${message.toString()}`);

      const messageReceived = message.toString().trim();

      if (messageReceived === messageToExpect.trim()) {
        resolve(true);
      } else {
        reject(
          `No se recibió el mensaje esperado. Se esperaba "${messageToExpect}" y se recibió "${messageReceived}"`
        );
      }
      client.end();
      clearTimeout(timeout);
    });

    client.on("error", (err) => {
      clearTimeout(timeout);
      reject(errorTranslating.net[err.code] + ": " + err.message);
      client.end();
    });
  });
};

PjLinkStatus.args = () => {
  return [
    {
      name: "ip",
      type: "string",
      description: "Dirección IP del dispositivo con el que se va a controlar",
      required: true,
    },
    {
      name: "command",
      type: "string",
      description: `Comando PjLink: ${Object.keys(PjLinkCommands)
        .map((comm) => comm)
        .join(", ")}}`,
      required: true,
    },
  ];
};

module.exports = PjLinkStatus;
