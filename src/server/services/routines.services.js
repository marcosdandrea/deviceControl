const {globals} = require("../../globals")


const getRoutines = (req, res, next) => {
    const visibleRoutines = globals.ROUTINES.filter(routine => routine.visible)
    const routines = visibleRoutines.map(routine => routine.toJSON())
    res?.send(routines)
    return routines
}

const enableRoutine = (req, res, next) => {
    const { routineID } = req.params
    const thisRoutine = globals.ROUTINES.find(routine => routine._id == routineID)
    if (!thisRoutine)
        throw new Error (`Routine ${routineID} not found`)
    thisRoutine.enable()
    res?.send(thisRoutine)
    return thisRoutine
}

const disableRoutine = (req, res, next) => {
    const { routineID } = req.params
    const thisRoutine = globals.ROUTINES.find(routine => routine._id == routineID)
    if (!thisRoutine)
        throw new Error (`Routine ${routineID} not found`)
    thisRoutine.disable()
    res?.send(thisRoutine)
    return thisRoutine
}


module.exports = {
    getRoutines,
    enableRoutine,
    disableRoutine
}