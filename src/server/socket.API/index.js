const { globals } = require("../../globals")
const routineServices = require("../services/routines.services")

const io = globals.SOCKET_SERVER

io.on("connection", (socket) => {
    console.log("New client connected")

    socket.on("getRoutines", (value, cb) => {
        const routines = routineServices.getRoutines(null, null, null)
        cb(routines)
    })
    
    socket.on("getRoutineLogs", async (routineID, cb) => {
        const req = req.params = {id: routineID}
        const logs = await routineServices.getRoutineLogs(req, null, null)
        cb(logs)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected")
    })
    
})
