const { exec } = require('child_process');
const { app, Tray, Menu, nativeImage, nativeTheme } = require('electron');
const path = require('path');
const { globals } = require('../globals');
const { Logger } = require('../log');
const logger = new Logger()

  // Detectar el sistema operativo y usar el comando adecuado
  function openFile(file) {
    const platform = process.platform;

    if (platform === 'win32') {
      exec(`start "" "${file}"`);
    } else if (platform === 'darwin') {
      exec(`open "${file}"`);
    } else if (platform === 'linux') {
      exec(`xdg-open "${file}"`);
    } else {
      logger.error('Sistema operativo no soportado.');
      throw new Error('Sistema operativo no soportado')
    }
  }


const handleOnShowConfiguration = () => {
  //const filePath = path.join(__dirname, "..", 'config.json');
  //openFile(filePath);
}

const handleOnShowDocumentation = () => {
  //const filePath = path.join(process.resourcesPath, "app.asar", 'README.html'); 
  //openFile(filePath);
}

const setTrayIcon = () => {
  nativeTheme.themeSource = 'system';
  const icon = nativeTheme.shouldUseDarkColors
    ? nativeImage.createFromPath(path.join(__dirname, "./icon.png"))
    : nativeImage.createFromPath(path.join(__dirname, "./icon_dark.png"))

  if (globals.TRAY)
    globals.TRAY.setImage(icon)
  else
  globals.TRAY = new Tray(icon)
}

const createTrayIcon = () => {
  setTrayIcon()
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir configuración', click: handleOnShowConfiguration },
    { label: 'Mostrar documentación', click: handleOnShowDocumentation},
    { label: 'Salir', click: () => { app.quit(); } },
    { type: 'separator'},
    { label: `${globals.LOCAL_IP} : ${globals.SERVER_PORT}`, type: 'normal', enabled: false}
  ]);

  globals.TRAY.setContextMenu(contextMenu);

  globals.TRAY.setToolTip('Device Control');

  nativeTheme.on("updated", setTrayIcon)

  logger.info("Tray icon created.")

}

module.exports = {
  createTrayIcon
}