const fs = require('fs').promises;
const path = require('path');
const { globals, CONSTANTS } = require('../globals');

const logLevels = Object.freeze({
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
})

class Logger {
    constructor(baseFilename, logDirectory, logHistoryInDays, logToConsole=true) {

        if (Logger.instance) {
            return Logger.instance;
        } else {

            if (!baseFilename) throw new Error('baseFilename must be provided');

            if (!logDirectory) throw new Error('logDirectory must be provided');

            this.baseFilename = baseFilename
            this.logDirectory = logDirectory
            this.logHistoryInDays = logHistoryInDays
            this.logToConsole = logToConsole

            Logger.instance = this;
            this.#removeOldLogs()
        }
    }

    async #removeOldLogs() {
        const currentDate = new Date();

        const files = await fs.readdir(path.join(__dirname, this.logDirectory))
        const logFiles = files.filter(file => file.includes(this.baseFilename))

        const oldLogFiles = logFiles.filter(file => {
            const logDate = new Date(file.replace(this.baseFilename + '_', '').replace('.log', ''))
            return currentDate - logDate > this.logHistoryInDays * 24 * 60 * 60 * 1000
        })

        for (const file of oldLogFiles) {
            await fs.unlink(path.join(__dirname, this.logDirectory, file))
        }

    }

    #getCurrentLogFile() {
        const date = new Date();
        const year = date.getFullYear()
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)

        return path.join(__dirname, this.logDirectory, `${this.baseFilename}_${year}-${month}-${day}.log`)
    }

    #getTimestamp() {
        const date = new Date();
        const year = date.getFullYear()
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)
        return `${day}-${month}-${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
    }

    async #createLog(newLog) {

        newLog.timestamp = this.#getTimestamp()

        try {
            await fs.mkdir(path.join(__dirname, this.logDirectory), { recursive: true });
            await fs.appendFile(this.#getCurrentLogFile(), JSON.stringify(newLog) + '\n')
        } catch (e) {
            console.error('Error writing to log file:', e)
        } finally {
            if (globals.ENVIRONMENT == CONSTANTS.envionment.development && this.logToConsole)
                console.log(newLog)
        }
    }

    async debug(message, routine) {
        await this.#createLog({ level: logLevels.debug, message: JSON.stringify(message), routine })
    }

    async info(message, routine) {
        await this.#createLog({ level: logLevels.info, message: JSON.stringify(message), routine })
    }

    async warn(message, routine) {
        await this.#createLog({ level: logLevels.warn, message: JSON.stringify(message), routine })
    }

    async error(message, routine) {
        await this.#createLog({ level: logLevels.error, message: JSON.stringify(message), routine })
    }

    async getRoutineLogs(routineID) {
        const files = await fs.readdir(path.join(__dirname, this.logDirectory))
        const logFiles = files.filter(file => file.includes(this.baseFilename))

        const routineLogs = {}

        for (const file of logFiles) {
            const logDate = file.replace(this.baseFilename + '_', '').replace('.log', '')
            routineLogs[logDate] = []

            const thisFile = await fs.readFile(path.join(__dirname, this.logDirectory, file), 'utf-8')
            let logs = thisFile.replaceAll("}", "},")
            logs = logs.slice(0, -2)
            const jsonLogs = JSON.parse(`[${logs}]`)
            const thisRoutineLogs = jsonLogs
                .filter(log => log.routine == routineID || !log?.routine)
                .map(log =>
                    log.routine
                        ? { ...log }
                        : { ...log, system: true }
                )


            for (let log of thisRoutineLogs) {
                const {routine, ...rest} = log
                routineLogs[logDate].push({
                    ...rest,
                    timestamp: log.timestamp.split(" ")[1],
                })
            }

        }

        return (routineLogs)
    }

}

module.exports = { Logger, logLevels };