const { app, BrowserWindow } = require('electron');
const { globals, CONSTANTS } = require('../../globals');
const isDev = globals.ENVIRONMENT == CONSTANTS.envionment.development

const createMainWindow = () => {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL( isDev 
            ? `http://localhost:5173` 
            : `http://localhost:${globals.SERVER_PORT}`)

    win.setMenu(null)

    win.webContents.on("did-finish-load", ()=> {
        if (isDev){
            win.webContents.openDevTools();
        }else{
            win.fullScreen = true;
        }
        win.show();
    })
}

module.exports = {
    createMainWindow
}