const { app } = require("electron")
const { Logger } = require("./log")
const logger = new Logger("deviceControl", "/logs", 120, false)
logger.info("Device Control started")
require("./events")
const { startServer } = require("./server")
const { loadConfigFile } = require("./odm")
const { buildConfiguration } = require("./core")
const { createTrayIcon } = require("./electron")
const { createMainWindow } = require("./electron/windowManager")
const { globals, CONSTANTS } = require("./globals")

app.whenReady()
  .then(async () => {

    createTrayIcon()
    await loadConfigFile()
    await startServer()
    buildConfiguration()
    if (globals.ENVIRONMENT == CONSTANTS.envionment.production)
      createMainWindow()
  })
  .catch(async (e) => {
    if (logger)
    await logger.error(e)
    app.quit()
    process.exit()
  })

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
