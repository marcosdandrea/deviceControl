const { globals } = require("../../globals")
const routinesServices = require("../services/routines.services")
const logServices = require("../services/log.services")
const systemServices = require("../services/system.services")
const app = globals.EXPRESS_APP

app.get("/routines", routinesServices.getRoutines)

app.get("/routine/logs/:id", routinesServices.getRoutineLogs)

app.get("/devmode", systemServices.devMode )

app.delete("/log/:id", logServices.deleteLog)


