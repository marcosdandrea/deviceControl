const net = require("net");
const errorTranslating = require("../common/errorTransalting")

const PjLinkCommands = {
  powerOn: {
    send: "%1POWR 1",
  },
  powerOff: {
    send: "%1POWR 0",
  },
};

function PjLinkCommand() {}

const verbose = false;

PjLinkCommand.run = async ({ ip, command }) => {
  if (!Object.keys(PjLinkCommands).includes(command))
    throw new Error("Unknown pjLink command");

  const port = 4352;
  const messageToSend = PjLinkCommands[command].send;

  return new Promise((resolve, reject) => {

    const client = new net.createConnection(port, ip);

    client.on("connect", async () => {
      if (verbose) console.log(`Connected to ${ip}:${port}`);

      await client.write(`${messageToSend}/r`, () => {
        if (verbose) console.log(`Message "${messageToSend}" sent to ${ip}:${port}`);
        client.end();
        resolve();
      });
    });

    client.on("error", (err) => {
      reject(errorTranslating.net[err.code] + ": " + err.message);
      client.end();
    });
  });
};

PjLinkCommand.args = () => {
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

module.exports = PjLinkCommand;
