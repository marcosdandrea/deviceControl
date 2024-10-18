const { globals } = require("../globals.js")
const { Logger } = require("../log/index.js")
const { Routine, routineEvents } = require("./Routine.js")
const { Task } = require("./Task.js")
const logger = new Logger()

const routines = {}

const buildConfiguration = () => {

    logger.info("Building routines configuration...")
    const config = globals.CONFIG

    config.routines.forEach(routine => {

        const availableTriggers = require("./triggers")
        let triggers = []

        routine.trigger.forEach(trigger => {
            const thisTrigger = availableTriggers[trigger.type]
            triggers.push(new thisTrigger(trigger.params))
        })

        const newRoutine = new Routine(
            routine.id,
            routine.name,
            routine.description,
            routine.isSequential,
            routine.stopOnTaskFailure,
            triggers,
            routine.autoEvaluateConditions,
            routine?.visible
        )

        routine.tasks.forEach(task => {

            const jobs = require("./jobs")
            const thisJob = jobs[task.job.type]

            let thisCondition = undefined
            if (task.condition) {
                const conditions = require("./conditions")
                thisCondition = conditions[task.condition.type]

                if (typeof thisCondition === "undefined")
                    throw new Error(`Condition "${task.condition.type}" not found in conditions modules`)
            }

            if (typeof thisJob === "undefined")
                throw new Error(`Job "${task.job.type}" not found in jobs modules`)

            const newTask = new Task({
                job: thisJob,
                condition: thisCondition,
                name: task.name,
                retryTimeout: task.retryDelay,
                retries: task.retries,
                jobArgs: task.job.params,
                conditionArgs: task.condition?.params
            })

            newRoutine.addTask(newTask)
        })

        routines[routine.id] = newRoutine

        newRoutine.onEventEmit((event, args) => {
            globals.EVENTS.emit(`${newRoutine._id}:${event}`, args);
            globals.SOCKET_SERVER.emit("setRoutine", newRoutine.toJSON())
        }) 

        appendRoutineListeners(newRoutine)

        if (routine?.enabled)
            newRoutine.enable()
        
        globals.ROUTINES.push(newRoutine)
    })
    //console.log (JSON.stringify(routines, null, 2))
    logger.info("Routines configuration built successfully")

}

const appendRoutineListeners = (routine) => {
    routine.on(routineEvents.armed, () => logger.info(`Routine is armed`, routine._id))
    routine.on(routineEvents.triggered, () => logger.info(`Routine has been triggered`, routine._id))
    routine.on(routineEvents.completed, () => logger.info(`Routine completed successfully`, routine._id))
    routine.on(routineEvents.failed, () => logger.error(`Routine execution failed`, routine._id))
    routine.on(routineEvents.disabled, () => logger.info(`Routine is disabled`, routine._id))
    routine.on(routineEvents.enabled, () => logger.info(`Routine is enabled`, routine._id))
    routine.on(routineEvents.warning, (warn) => logger.warn(`Routine thrown a warning: ${warn}`, routine._id))

    routine.on(routineEvents.taskStarted, (task) => logger.info(`Task '${task.name ?? task._id}' started.`, routine._id))
    routine.on(routineEvents.taskCompleted, (task) => logger.info(`Task '${task.name ?? task._id}' completed successfully.`, routine._id))
    routine.on(routineEvents.taskFailed, ({taskName, cause}) => logger.error(`Task '${taskName}' failed: ${cause}`, routine._id))
    routine.on(routineEvents.taskRetry, (task) => logger.warn(`Task '${task.name ?? task._id}' retry ${task.retry}/${task.retryies}.`, routine._id))
}

module.exports = { buildConfiguration };