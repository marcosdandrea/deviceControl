const fs = require("fs").promises;
const {app} = require("electron");
const path = require("path");
const { globals, CONSTANTS } = require("../../globals");

const deleteLog = (req, res, next) => {
    const { id } = req.params;
    
    const filename = `deviceControl_${id}.log`
    const dirname = globals.ENVIRONMENT == CONSTANTS.envionment.production ? app.getPath('userData') : __dirname

    const logPath = path.join(dirname, "..", "..", "log", "logs", filename);

    fs.unlink(logPath)
       .then(() => res.send("Log deleted successfully"))
       .catch(err => next(err));

}

module.exports = {
    deleteLog,
}