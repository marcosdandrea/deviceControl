const {version} = require("../../../package.json")
const { BrowserWindow } = require('electron');
const { globals, CONSTANTS } = require('../../globals');
const isDev = globals.ENVIRONMENT == CONSTANTS.envionment.development

const createMainWindow = () => {
    globals.mainWindow = new BrowserWindow({
        width: 800,
        height: 480,
        show: false,
        title: `Device Control v${version}`,
        webPreferences: {
            nodeIntegration: true
        }
    });

    globals.mainWindow.loadURL( isDev 
            ? `http://localhost:5173` 
            : `http://localhost:${globals.SERVER_PORT}`)

    globals.mainWindow.setMenu(null)

    globals.mainWindow.webContents.on("did-finish-load", ()=> {
        if (isDev || globals.DEV_TOOLS){
            globals.mainWindow.webContents.openDevTools();
        }
        globals.mainWindow.show();
    })


}

module.exports = {
    createMainWindow
}