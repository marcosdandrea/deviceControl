const net = require('net');

try{
    const client = new net.createConnection(4352, "192.168.1.101")
    client.on("data", (data) => {
        console.log(`Received: ${data}`);
    })

    client.on("connect", (socket) => {
        console.log("Connected")
        client.write("%1POWR 1\\r", ()=> console.log ("mensaje enviado"))
    })


}catch(err){
    console.error(err);
}