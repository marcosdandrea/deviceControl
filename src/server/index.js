const cors = require('cors');
const { Logger } = require('../log');
const logger = new Logger()
const path = require('path');

const express = require('express');
const { createServer } = require("http")
const { Server } = require("socket.io")

const { globals } = require('../globals');

const corsOptions = {
    origin: '*',
    methods: ['GET','DELETE'],
    allowedHeaders: ['Content-Type']
}

globals.EXPRESS_APP = express();
globals.EXPRESS_APP.use(cors(corsOptions))
globals.HTTP_SERVER = createServer(globals.EXPRESS_APP)
globals.SOCKET_SERVER = new Server(globals.HTTP_SERVER, {
    cors: {
        origin: '*',
        methods: ['GET','DELETE'],
        credentials: false
      }
})

globals.EXPRESS_APP.use(express.static(path.join(__dirname, '../public')))

require('../server/API')
require('./socket.API');

const startServer = () => {

    return new Promise((resolve, reject) => {
        globals.HTTP_SERVER.listen(globals.SERVER_PORT, "0.0.0.0", () => {
            logger.info(`Server started on port ${globals.SERVER_PORT}`)
            resolve("Server started on port", globals.SERVER_PORT);
        });
    })
}

module.exports = {
    startServer
}