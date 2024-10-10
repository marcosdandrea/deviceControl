const { globals, CONSTANTS } = require('../globals');
const fs = require('fs').promises
const path = require('path');

const logLevels = Object.freeze({
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
})

class Logger {

    constructor(logHistoryInDays, logToConsole = true) {

        if (Logger.instance) {
            return Logger.instance;
        } else {

            this.baseFilename = "devicControlLog"
            this.logHistoryInDays = logHistoryInDays
            this.logToConsole = logToConsole
            this.store = undefined
            Logger.instance = this;
            this.#deleteOldLogs()
        }
    }

    async init(cb) {
        const ElectronStore = (await import('electron-store')).default;
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        this.store = new ElectronStore({
            name: `${this.baseFilename}_${date.getTime()}`
        });
        cb()
    }

    async #deleteOldLogs() {
        try {
            const storeDir = path.dirname(this.store.path)
            const files = await fs.readdir(storeDir);
            const storeFiles = files.filter(file => file.includes(this.baseFilename))

            const maxLogHistory = new Date();
            maxLogHistory.setDate(maxLogHistory.getDate() - this.logHistoryInDays);

            const logFilesToDelete = storeFiles.filter(file => {
                const fileDate = file.replace(`${this.baseFilename}_`, '').replace('.json', '')
                const fileDateObj = new Date(parseInt(fileDate))
                return fileDateObj < maxLogHistory
            })

            for (const file of logFilesToDelete) {
                await fs.unlink(path.join(storeDir, file))
                this.info(`Automatically log file deleted due configuration: ${file}`)
            }
        } catch (e) {
            console.error(e.message)
        }
    }

    async #createLog({ level, message, routine = "system" }) {
        try {
            if (!this.store)
                throw new Error('Logger not ready')


            this.store.set({
                [new Date().getTime()]: {
                    level,
                    message,
                    routine
            }
            })

        if (globals.ENVIRONMENT == CONSTANTS.envionment.development && this.logToConsole)
            console.log({ level, message, routine })
    } catch(err) {
        console.error('Error creating log:', err.message)
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

}

module.exports = { Logger, logLevels };