const fs = require("fs").promises;
const path = require("path");

const deleteLog = (req, res, next) => {
    const { id } = req.params;
    
    const filename = `deviceControl_${id}.log`
    const logPath = path.join(__dirname, "..", "..", "log", "logs", filename);

    fs.unlink(logPath)
       .then(() => res.send("Log deleted successfully"))
       .catch(err => next(err));

}

module.exports = {
    deleteLog,
}