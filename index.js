
const { globals, CONSTANTS } = require("./src/globals")

if (process.argv[3] == "--dev")
    globals.ENVIRONMENT = CONSTANTS.envionment.development

//main entry point
require("./src")