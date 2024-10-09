const {globals, CONSTANTS} = require("./globals")
const args = process.argv.slice(2);

if (args.includes("--dev")) {
    console.log("Running in development mode");
    globals.ENVIRONMENT = CONSTANTS.envionment.development
}


