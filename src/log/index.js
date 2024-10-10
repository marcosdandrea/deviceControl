const fs = require('fs').promises;
const path = require('path');
const { globals, CONSTANTS } = require('../globals');
const { app } = require("electron")
const Database = require('better-sqlite3');


const logLevels = Object.freeze({
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
})

class Logger {

    constructor(baseFilename, logDirectory, logHistoryInDays, logToConsole = true) {

        if (Logger.instance) {
            return Logger.instance;
        } else {

            if (!baseFilename) throw new Error('baseFilename must be provided');

            if (!logDirectory) throw new Error('logDirectory must be provided');

            this.baseFilename = baseFilename
            this.logDirectory = logDirectory
            this.logHistoryInDays = logHistoryInDays
            this.logToConsole = logToConsole
            this.ready = false
            this.db = undefined
            this.__dirname = globals.ENVIRONMENT == CONSTANTS.envionment.production
                ? path.join(app.getPath('userData'), this.logDirectory)
                : path.join(__dirname, this.logDirectory)


            Logger.instance = this;
            this.#init()

        }
    }

    async #init() {
        this.db = new Database('logs.db');

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS logs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              date TEXT NOT NULL,
              time TEXT NOT NULL,
              level INTEGER NOT NULL,
              message TEXT NOT NULL,
              routine TEXT
            )
          `).run();

    }

    #getTimestamp() {
        const date = new Date();
        const year = date.getFullYear()
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)
        return {
            date: `${day}-${month}-${year}`, 
            time: `${String(date.getHours()).padStart(2, 0)}:${String(date.getMinutes()).padStart(2, 0)}:${String(date.getSeconds()).padStart(2, 0)}.${String(date.getMilliseconds()).padStart(2, 0)}`
        }
    }

    async #createLog({level, message, routine}) {

        const timestamp = this.#getTimestamp()

        const stmt = this.db.prepare(`
                INSERT INTO logs (date, time, level, message, routine) 
                VALUES (?, ?, ?, ?, ?)
              `);
        stmt.run(timestamp.date, timestamp.time, level, message, routine || null);

        if (globals.ENVIRONMENT == CONSTANTS.envionment.development && this.logToConsole)
            console.log(newLog)

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