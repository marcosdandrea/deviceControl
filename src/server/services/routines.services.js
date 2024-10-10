const {globals} = require("../../globals")


const getRoutines = (req, res, next) => {
    const visibleRoutines = globals.ROUTINES.filter(routine => routine.visible)
    const routines = visibleRoutines.map(routine => routine.toJSON())
    res?.send(routines)
    return routines
}

module.exports = {
    getRoutines,
}