const { app, BrowserWindow } = require('electron');
const { globals, CONSTANTS } = require('../../globals');
const isDev = globals.ENVIRONMENT == CONSTANTS.envionment.development

const createMainWindow = () => {
    globals.mainWindow = new BrowserWindow({
        show: false,
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
        }else{
            globals.mainWindow.fullScreen = true;
        }
        globals.mainWindow.show();
    })
}

module.exports = {
    createMainWindow
}