const { globals } = require("../../globals")
const os = require("os")
const routineServices = require("../services/routines.services")

const io = globals.SOCKET_SERVER

io.on("connection", (socket) => {
    console.log("New client connected")

    socket.on("getRoutines", (value, cb) => {
        const routines = routineServices.getRoutines(null, null, null)
        cb(routines)
    })

    socket.on("getRoutineLogs", async (routineID, cb) => {
        const req = req.params = { id: routineID }
        const logs = await routineServices.getRoutineLogs(req, null, null)
        cb(logs)
    })

    socket.on("enableRoutine", (routineID, cb) => {
        const req = {}
        req.params = routineID 
        routineServices.enableRoutine(req, null, null)
        cb()
    })

    socket.on("disableRoutine", (routineID, cb) => {
        const req = {}
        req.params = routineID 
        routineServices.disableRoutine(req, null, null)
        cb()
    })

    socket.on("getIP", (_, cb) => {
        const networkInterfaces = os.networkInterfaces();

        for (const interfaceName in networkInterfaces) {
            const interfaces = networkInterfaces[interfaceName];

            interfaces.forEach((iface) => {
                if (iface.family === 'IPv4' && !iface.internal) {
                    cb(iface.address)
                }
            });
        }

    })

    socket.on("disconnect", () => {
        console.log("Client disconnected")
    })

})
