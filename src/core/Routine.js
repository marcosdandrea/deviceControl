const events = require("events")
const crypto = require("crypto")
const { taskEvents } = require("./Task")

const routineEvents = Object.freeze({
    enabled: "enabled",
    disabled: "disabled",
    armed: "armed",
    completed: "completed",
    failed: "failed",
    triggered: "triggered",
    taskStarted: "taskStarted",
    taskCompleted: "taskCompleted",
    taskFailed: "taskFailed",
    taskRetry: "taskRetry",
    warning: "warning",
    conditionsEvaluated: "conditionsEvaluated",
})

const routineState = Object.freeze({
    unknown: "unknown",
    fullfiled: "fullfiled",
    incomplete: "incomplete",
})

class Routine extends events {

    isRunning = false
    armed = false
    failed = false
    finished = false
    evaluateConditionsTimer = null

    constructor(_id, name, description, secuential, stopIfFails, triggers, evaluateConditionsInterval, visible) {

        if (typeof secuential !== "boolean")
            throw new Error("'secuential' must be a boolean value")

        if (typeof stopIfFails !== "boolean")
            throw new Error("'stopIfFails' must be a boolean value")

        super()
        this._id = _id || crypto.randomUUID()
        this.name = name
        this.description = description || ""
        this.secuential = secuential
        this.tasks = []
        this.triggers = triggers || []
        this.stopIfFails = stopIfFails || false
        this.enabled = true
        this.rearmOnFinish = true
        this.visible = visible || false
        this.state = routineState.unknown
        this.evaluateConditionsInterval = evaluateConditionsInterval || false
    }

    #enableAutoEvaluateConditions() {
        if (!this.evaluateConditionsInterval) return
        this.evaluateConditionsTimer = setTimeout(async () => {
            const result = await this.#evaluateConditions()
            this.#eventEmitter(routineEvents.conditionsEvaluated, result)
            this.#enableAutoEvaluateConditions()
        }, this.evaluateConditionsInterval)
    }

    #disableAutoEvaluateConditions() {
        clearTimeout(this.evaluateConditionsTimer)
    }

    async #evaluateConditions() {
        if (!this.evaluateConditionsInterval) return
        const conditions = []
        for (const task of this.tasks) {
            if (!task?.condition) continue

            let conditionResult = undefined
            try {
                conditionResult = await task.condition()
            } catch (error) {
                console.log("ERROR:", error)
                this.#eventEmitter(routineEvents.warning, `Error evaluating condition for task ${task.name}: ${error.message}`)
                conditionResult = false
            } finally {
                conditions.push(conditionResult)
            }
        }

        const result = conditions.every(condition => condition === true)
        this.state = result
            ? routineState.fullfiled
            : routineState.incomplete

        this.finished = result
        return result

    }

    onEventEmit(callback) {
        this.onEventEmit = callback
    }

    #eventEmitter(event, value) {
        if (!routineEvents[event])
            throw new Error(`Invalid event: ${event}`)

        if (this.onEventEmit)
            this.onEventEmit(event, value)

        this.emit(event, value)
    }

    enable() {
        this.enabled = true;
        this.#eventEmitter(routineEvents.enabled);
    }

    disable() {
        this.enabled = false;
        this.#eventEmitter(routineEvents.disabled);
    }

    addTrigger(trigger) {
        if (this.isRunning)
            throw new Error("Cannot add trigger while routine is running")

        if (typeof trigger !== "function")
            throw new Error("'trigger' must be a function")

        this.triggers.push(trigger)
    }

    addTask(task) {
        if (this.isRunning)
            throw new Error("Cannot add task while routine is running")

        if (typeof task !== "object")
            throw new Error("'task' must be a Task object")

        task.on(taskEvents.started, () => {
            this.#eventEmitter(routineEvents.taskStarted, task.toJSON());
        });

        task.on(taskEvents.completed, () => {
            this.#eventEmitter(routineEvents.taskCompleted, task.toJSON());
        });

        task.on(taskEvents.failed, (cause) => {
            this.#eventEmitter(routineEvents.taskFailed, {taskName: task.name, cause});
        });

        task.on(taskEvents.retry, (e) => {
            this.#eventEmitter(routineEvents.taskRetry, task.toJSON())
        }
        )

        this.tasks.push(task)
        return task._id
    }

    removeTask(taskID) {
        if (this.isRunning)
            throw new Error("Cannot remove task while routine is running")

        const index = this.tasks.findIndex(task => task._id === taskID)
        if (index == -1)
            throw new Error(`Task not found: ${task}`)

        this.tasks.splice(index, 1)

    }

    async #armTriggers(callback) {

        this.triggers.forEach(trigger => {
            try {
                trigger.arm(callback);
            } catch (error) {
                throw new Error("Error in trigger arm:", error);
            }
        });

        if (this.triggers.every(trigger => trigger.armed)) {
            this.armed = true
        } else {
            throw new Error(`Error in trigger arm in routine ${this._id}:`,
                this.triggers
                    .filter(trigger => !trigger.armed)
                    .map(trigger => trigger.name))
        }

    }

    /**
     * Async method that waits for the trigger function to complete
     * in order to start running given tasks.
    */
    async arm() {
        try {
            this.#evaluateConditions()
            this.#enableAutoEvaluateConditions()
            this.#eventEmitter(routineEvents.armed)
            this.#armTriggers(async () => {

                this.#disableAutoEvaluateConditions()

                try {
                    this.isRunning = true
                    this.failed = false
                    this.finished = false
                    this.armed = false
                    this.#eventEmitter(routineEvents.triggered, { name: this.name, id: this._id })
                    this.timeStarted = performance.now()
                    if (this.secuential)
                        await this.#runSecuential()
                    else
                        await this.#runAsync()

                } catch (e) {
                    console.error("ERROR", e)
                    this.#eventEmitter(routineEvents.failed, e)
                } finally {
                    this.#handleOnRoutineCompleted()

                    if (this.rearmOnFinish) {
                        setImmediate(() => this.arm());
                    }
                }
            })
        } catch (e) {
            console.error(e)
        }
    }

    async #runAsync() {
        return new Promise(async (resolve, reject) => {
            try {
                await Promise.all(this.tasks.map(task => task.run()))
                resolve()
            } catch (error) {
                //this.#eventEmitter(routineEvents.failed,task.name ?? task._id , error?.message)
                this.tasks.forEach(task => task.abortTask())
                reject()
            }
        })
    }

    async #runSecuential() {
        for (const task of this.tasks) {
            try {
                await task.run()
            } catch (error) {
                console.error(error)
                //this.#eventEmitter(routineEvents.failed, task.name ?? task._id , error?.message)
                if (this.stopIfFails) break
            }
        }
    }

    #handleOnRoutineCompleted() {
        this.#enableAutoEvaluateConditions()

        this.isRunning = false
        this.finished = true

        const event = this.tasks.some(task => task.failed)
            ? routineEvents.failed
            : routineEvents.completed

        this.failed = event == routineEvents.failed

        this.#eventEmitter(event, {
            id: this._id,
            name: this.name,
            tasksCompleted: this.tasks.filter(task => task.completed).map(task => task._id),
            tasksFailed: this.tasks.filter(task => task.failed).map(task => task._id),
            totalTimeInSec: Math.floor((performance.now() - this.timeStarted) / 1000)
        })
        console.log({
            id: this._id,
            name: this.name,
            tasksCompleted: this.tasks.filter(task => task.completed).map(task => task._id),
            tasksFailed: this.tasks.filter(task => task.failed).map(task => task._id),
            totalTimeInSec: Math.floor((performance.now() - this.timeStarted) / 1000)
        })
    }

    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            enabled: this.enabled,
            description: this.description,
            armed: this.armed,
            finished: this.finished,
            failed: this.failed,
            running: this.isRunning,
            secuential: this.secuential,
            stopIfFails: this.stopIfFails,
            visible: this.visible || false,
            state: this.state,
            triggers: this.triggers.map(trigger => trigger.toJSON()),
            tasks: this.tasks.map(task => task.toJSON()),
        }
    }

}

module.exports = {
    Routine,
    routineEvents,
}