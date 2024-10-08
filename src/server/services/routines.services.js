const {globals} = require("../../globals")
const { Logger } = require("../../log")
const logger = new Logger()

const getRoutines = (req, res, next) => {
    const visibleRoutines = globals.ROUTINES.filter(routine => routine.visible)
    const routines = visibleRoutines.map(routine => routine.toJSON())
    res?.send(routines)
    return routines
}

const getRoutineLogs = async (req, res, next) => {
    const {id} = req.params
    const result = await logger.getRoutineLogs(id)
    res?.send(result)
    return result
}

module.exports = {
    getRoutines,
    getRoutineLogs,
}