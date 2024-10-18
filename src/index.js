require("./parseParams")
const { app, dialog } = require("electron")
const { Logger } = require("./log")
const logger = new Logger(120, false)

logger.init(() => {
  logger.info("Device Control started")
  require("./events")
  const { startServer } = require("./server")
  const { loadConfigFile } = require("./odm")
  const { buildConfiguration } = require("./core")
  const { createTrayIcon } = require("./electron")
  const { createMainWindow } = require("./electron/windowManager")

  app.whenReady()
    .then(async () => {

      createTrayIcon()
      await loadConfigFile()
      await startServer()
      buildConfiguration()
      createMainWindow()
    })
    .catch(async (e) => {
      dialog.showErrorBox("Se produjo un error", e?.message)
      console.error(e)
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
})