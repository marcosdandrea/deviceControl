const { globals } = require("../../globals")
const routinesServices = require("../services/routines.services")
const logServices = require("../services/log.services")
const systemServices = require("../services/system.services")
const app = globals.EXPRESS_APP

app.get("/routines", routinesServices.getRoutines)

app.get("/routine/logs/:routineID", logServices.getRoutineLogs)

app.get("/devmode", systemServices.devMode )

app.delete("/log/:routineID/:date", logServices.deleteLog)


