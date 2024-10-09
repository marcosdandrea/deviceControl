const os = require('os');

const CONSTANTS = Object.freeze({
    envionment: {
        production: "PRODUCTION",
        development: "DEVELOPMENT",
    }
})

const globals = {
    ENVIRONMENT: CONSTANTS.envionment.production,
    LOCAL_IP: getLocalIP(),
    SERVER_PORT: 3030,
    DEV_TOOLS: false,
    EXPRESS_APP: null,
    HTTP_SERVER: null,
    SOCKET_SERVER: null,
    EVENTS: null,
    CONFIG: null,
    ROUTINES: [],
    TRAY: null,
    AUTO_RUN_CONDITION_INTERVAL_MS: 60000 
}


function getLocalIP() {
    const networkInterfaces = os.networkInterfaces(); // Obtener todas las interfaces de red
  
    for (const interfaceName in networkInterfaces) {
      const networkInterface = networkInterfaces[interfaceName];
  
      for (const iface of networkInterface) {
        // Filtrar IPv4 y evitar direcciones internas (como localhost)
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address; // Retornar la primera dirección IP local encontrada
        }
      }
    }
    return null; // Si no se encuentra ninguna IP válida
  }

module.exports = {
    globals,
    CONSTANTS
}