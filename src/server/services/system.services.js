const { globals } = require("../../globals")

const enableHDCP = () => { }

const setFixedIP = ({
    interface,
    ipAddress,
    subnetMask,
    gateway,
    dnsServer1,
    dnsServer2
}) => { }

const devMode = (req, res, next) => {
    if (globals.mainWindow.webContents.isDevToolsOpened())
        globals.mainWindow.webContents.closeDevTools();
    else
        globals.mainWindow.webContents.openDevTools();
    res.sendStatus(200);
}


module.exports = {
    enableHDCP,
    setFixedIP,
    devMode
}