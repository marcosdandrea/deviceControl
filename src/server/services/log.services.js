const { dialog } = require("electron");
const { Logger } = require("../../log");
const logger = new Logger()

const deleteLog = async (req, res, next) => {
    const { routineID, date } = req.params;


    try {
        const db = logger.db
        const stmt = db.prepare(`
            DELETE FROM logs WHERE routine = ? AND date = ?
          `);
          const info = stmt.run(routineID, date);

        console.log("deleted ", info, date)
        res.send("Log deleted successfully")
    } catch (err) {
        dialog.showErrorBox("Error borrando el log", `${err.message}`)
        res.status(500).send(`Error borrando el log ${err.message}`)
    }

}

const getRoutineLogs = async (req, res, next) => {
    const { routineID } = req.params
    try {

        const db = logger.db
        const stmt = db.prepare(`
            SELECT * FROM logs WHERE routine = ? OR routine IS NULL ORDER BY id ASC
          `);
        const routineLogsRaw = stmt.all(routineID);

        
        const routineLogs = {}
        
        routineLogsRaw.forEach(log => {
            routineLogs[log.date] = routineLogs[log.date] || []
            const { message, routine, time, level, id, ...rest } = log
            routineLogs[log.date].push({ message, routine, time, level, id })
        })


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