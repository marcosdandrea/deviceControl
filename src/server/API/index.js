const { globals } = require("../../globals")
const routinesServices = require("../services/routines.services")
const logServices = require("../services/log.services")
const app = globals.EXPRESS_APP

app.get("/routines", routinesServices.getRoutines)

app.get("/routine/logs/:id", routinesServices.getRoutineLogs)

app.delete("/log/:id", logServices.deleteLog)


