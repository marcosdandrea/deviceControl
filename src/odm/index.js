require("./docs.js")
const fs = require('fs');
const path = require('path');
const types = require("../types.js")
const { dialog, app } = require("electron")
const { globals, CONSTANTS } = require('../globals');
const { Logger } = require("../log/index.js");
const logger = new Logger()

const loadConfigFile = () => {
    logger.info("Loading config file")
    const executablePath = path.dirname(app.getPath('exe'));
    const configFilePath = path.join(executablePath, 'config.json');

    return new Promise((resolve, reject) => {

        const configPath = globals.ENVIRONMENT == CONSTANTS.envionment.development 
                                ? path.join(__dirname, "..", "config.json") 
                                : configFilePath
                                
        console.log (configPath)
        
        if (fs.existsSync(configPath)) {
            const configFile = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            const result = validateConfig(configFile)
            if (result.length != 0) {
                logger.error("Configuration file contains errors")
                dialog.showErrorBox('Error en el archivo de configuración. Si necesita ayuda vea el archivo README.html. A continuación, los errores encontrados:', result.join('\n'));
                reject()
                return;
            }
            globals.CONFIG = configFile
            resolve()
            logger.info("Configuration file loaded successfully")
        } else {
            logger.error("Configuration file not found")
            dialog.showErrorBox('Archivo de configuración no encontrado', 'Asegúrese que el archivo se encuentra en la misma carpeta que el ejecutable de esta aplicación.');
            reject()
        }
    })
}

function validateConfig(config) {
    logger.info("Validating config file")
    const errors = [];

    if (!config.hasOwnProperty("routines"))
        errors.push("El archivo de configuración debe tener una propiedad 'routines'.")

    for (const routineIndex in config.routines) {
        const routine = config.routines[routineIndex];

        if (!routine.hasOwnProperty("id"))
            errors.push(`La rutina ${Number(routine) + 1} debe tener una propiedad 'id'.`)

        if (!routine.hasOwnProperty("name"))
            errors.push(`La rutina ${Number(routine) + 1} debe tener una propiedad 'name'.`)

        if (!routine.hasOwnProperty("description"))
            errors.push(`La rutina ${Number(routine) + 1} debe tener una propiedad 'description'.`)

        if (!routine.hasOwnProperty("isSequential") || typeof routine.isSequential !== 'boolean')
            errors.push(`La rutina ${Number(routine) + 1} debe tener una propiedad 'isSequential' que sea un booleano (true o false)`)

        if (!routine.hasOwnProperty("stopOnTaskFailure") || typeof routine.stopOnTaskFailure !== 'boolean')
            errors.push(`La rutina ${Number(routine) + 1} debe tener una propiedad'stopOnTaskFailure' que sea un booleano (true o false)`)

        if (!routine.hasOwnProperty("trigger"))
            errors.push(`La rutina ${Number(routine) + 1} debe tener una propiedad 'trigger' que sea un array`)

        if (!routine.hasOwnProperty("tasks"))
            errors.push(`La rutina ${Number(routine) + 1} debe tener una propiedad 'tasks' que sea un array`)

        checkTriggers()
        checkTasks()

        function checkTriggers() {
            for (const triggerIndex in routine.trigger) {

                const trigger = routine.trigger[triggerIndex];

                if (!trigger.hasOwnProperty("type")) {
                    errors.push(`El trigger ${Number(triggerIndex)} en la rutina ${routine.id} debe tener una propiedad 'type'.`)
                    continue;
                }

                if (!trigger.hasOwnProperty("params")) {
                    errors.push(`El trigger ${Number(triggerIndex)} en la rutina ${routine.id} debe tener una propiedad 'params'.`)
                    continue;
                }

                const triggerModel = types.trigger.find(triggerModel => triggerModel.type == trigger.type)

                if (triggerModel === -1) {

                    errors.push(`El tipo '${trigger.type}' del trigger ${Number(triggerIndex) + 1} en la rutina ${routine.id} no es válido. Los tipos válidos son: ${types.trigger.map(triggerModel => triggerModel.type).join(', ')}`)

                } else {

                    //params comparison

                    for (const param in triggerModel.params) {

                        if (param == "descriptions") continue;

                        if (!trigger.params.hasOwnProperty(param)) {
                            errors.push(`El trigger ${Number(triggerIndex)} en la rutina ${routine.id} no tiene la propiedad '${param}' esperada. ${triggerModel.params.descriptions[param]}`)
                            break;
                        }


                        if (!triggerModel.params[param].test(trigger.params[param])) {
                            errors.push(`El trigger ${Number(triggerIndex)} con valor '${trigger.params[param]}' en la rutina ${routine.id} tiene un valor de '${param}' no válido. ${triggerModel.params.descriptions[param]}`)
                            console.log(param, triggerModel.params[param], trigger.params[param])
                            break;
                        }


                    }



                    if (!trigger.hasOwnProperty("params"))
                        errors.push(`El trigger ${Number(triggerIndex)} en la rutina ${routine.id} debe tener una propiedad 'params'.`)

                }
            }
        }

        function checkTasks() {
            for (const taskIndex in routine.tasks) {
                const task = routine.tasks[taskIndex];

                if (!task.hasOwnProperty("name")) {
                    errors.push(`La tarea ${Number(taskIndex) + 1} en la rutina ${routine.id} debe tener una propiedad 'name'.`)
                    continue;
                }

                if (!task.hasOwnProperty("job")) {
                    errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" debe tener una propiedad 'job'.`)
                    continue;
                }

                if (!task.job.hasOwnProperty("type")) {
                    errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" debe tener una propiedad 'type' en su 'job'.`)
                    continue;
                }

                const jobType = types.job.find(jobType => jobType.type == task.job.type);

                if (!jobType) {
                    errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" no posee un tipo de 'job' (${task.job.type}) valido. Los tipos de jobs validos son "${types.job.map(jobType => jobType.type).join(", ")}"`)
                    continue;
                }

                for (const param in jobType.params) {
                    if (param == "descriptions") continue;

                    if (!task.job.params.hasOwnProperty(param)) {
                        errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" no tiene la propiedad '${param}' esperada en su 'job'. ${jobType.params.descriptions[param]}`)
                        break;
                    }

                    if (!jobType.params[param].test(task.job.params[param])) {
                        errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" tiene un valor de '${param}' no válido en su 'job'. ${jobType.params.descriptions[param]}`)
                        break;
                    }

                }


                if (!task.job.hasOwnProperty("params")) {
                    errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" debe tener una propiedad 'params' en su 'job'.`)
                    continue;
                }


                if (task.hasOwnProperty("condition")) {
                    if (!task.hasOwnProperty("retry") && !task.hasOwnProperty("retryDelay")) {
                        errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" debe tener una propiedad "retry" y "retryDelay" porque poseen la propiedad "condition".`)
                        continue;
                    }

                    const conditionType = types.condition.find(conditionType => conditionType.type == task.condition.type)

                    if (!conditionType) {
                        errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" no posee un tipo de 'condition' (${task.condition.type}) valido. Los tipos de condiciones validos son "${types.condition.map(conditionType => conditionType.type).join(", ")}"`)
                        continue;
                    }

                    for (const param in conditionType.params) {
                        if (param == "descriptions") continue;

                        if (!task.condition.params.hasOwnProperty(param)) {
                            errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" no tiene la propiedad '${param}' esperada en su 'condition'. ${conditionType.params.descriptions[param]}`)
                            break;
                        }

                        if (!conditionType.params[param].test(task.condition.params[param])) {
                            errors.push(`La tarea "${task.name}" en la rutina "${routine.id}" tiene un valor de '${param}' no válido en su 'condition'. ${conditionType.params.descriptions[param]}`)
                            break;
                        }
                    }

                }

            }
        }
    }

    if (errors.length > 0)
        logger.warn("There were errors in config file")

    return errors;
}

module.exports = {
    loadConfigFile
}