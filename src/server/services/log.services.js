const { dialog } = require("electron");
const { Logger } = require("../../log");
const fs = require("fs").promises;
const logger = new Logger()
const path = require("path")

const deleteLog = async (req, res, next) => {
    const { routineID, date } = req.params;

    try {
        const store = logger.store
        const storeDir = path.dirname(store.path)
        const logToOpen = `${logger.baseFilename}_${date}.json`
        const logFile = JSON.parse(await fs.readFile(path.join(storeDir, logToOpen), 'utf-8'))

        const newLogFile = {}

        Object.keys(logFile).forEach(timeLog => {
            if (logFile[timeLog].routine !== routineID)
                newLogFile[timeLog] = { ...logFile[timeLog] }
        })

        await fs.writeFile(path.join(storeDir, logToOpen), JSON.stringify(newLogFile))
        res.send("Log borrado correctamente")

    } catch (err) {
        dialog.showErrorBox("Error borrando el log", `${err.message}`)
        res.status(500).send(`Error borrando el log ${err.message}`)
    }

}

const getRoutineLogs = async (req, res, next) => {
    const { routineID } = req.params

    try {
        const store = logger.store
        const storeDir = path.dirname(store.path)
        const files = await fs.readdir(storeDir);
        const storeFiles = files.filter(file => file.includes(logger.baseFilename))

        let routineLogs = {}

        for (const store of storeFiles) {
            const logs = JSON.parse(await fs.readFile(path.join(storeDir, store), 'utf-8'))
            const storeDate = store.replace(`${logger.baseFilename}_`, '').replace('.json', '')
            routineLogs[storeDate] = []

            Object.keys(logs).forEach(timeLog => {
                if (logs[timeLog].routine == routineID || logs[timeLog].routine == "system") {
                    routineLogs[storeDate].push({ ...logs[timeLog], time: timeLog })
                }
            })

            if (!routineLogs[storeDate].some(log => log.routine == routineID))
                delete routineLogs[storeDate] 
        }


        res.send(JSON.stringify(routineLogs));
    } catch (e) {
        res.status(500).send("Error reading database")
        console.error("Error reading database", e)
    }
}


module.exports = {
    deleteLog,
    getRoutineLogs
}