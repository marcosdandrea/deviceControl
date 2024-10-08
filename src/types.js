//version 1.0.0

const types = {
    trigger: [
        {
            type: "api",
            description: "Permite iniciar la ejecución de una rutina mediante una llamda a un determinado endpoint con un determinado metodo.",
            params: {
                method: /^(GET|POST|PATCH|DELETE)$/,  // Métodos HTTP permitidos
                endpoint: /^\/([\w.-]+\/?)*$/,  // Expresión regular para el endpoint
                descriptions: {
                    method: "Método HTTP utilizado para la llamada al endpoint, ejemplo: GET, POST, PATCH, DELETE",
                    endpoint: "Ruta al endpoint que será llamado con el formato '/ruta01/ruta02/endpoint'",
                }
            }
        },
        {
            type: "event",
            description: "Incia la ejecución de una rutina cuando una rutina indicada produce un evento específico.",
            params: {
                name: /^[\s\S]*\\?[\s\S]*$/,
                descriptions: {
                    name: "Nombre de la rutina que se debe ejecutar cuando se produce el evento (Ej: 'rutina1:completed').",
                }
            }
        },
        {
            type: "cron",
            description: "Inicia una rutina en un día en formato numerico, donde 0 es domingo y 6 es sabado, y en el horario determinado en formato 24hs",
            params: {
                day: /^[0-6]$/,  // Números entre 0 y 6
                time: /^([01]\d|2[0-3]):([0-5]\d)$/,  // Formato HH:MM
                descriptions: {
                    day: "Día en formato numérico (0-6), donde 0 es domingo y 6 es sabado.",
                    time: "Hora en formato 24hs (HH:MM)."
                }
            }
        },
        {
            type: "udp",
            description: "Inicia una rutina cuando se recibe un mensaje UDP determinado en un puerto específico.",
            params: {
                port: /^[0-9]+$/,  // Número para el puerto
                message: /^[\s\S]*\\?[\s\S]*$/,  // Mensaje como string no vacío
                descriptions: {
                    port: "Número del puerto UDP.",
                    message: "Mensaje como cadena de caracteres no vacío."
                }
            }
        }
    ],
    job: [
        {
            type: "wait",
            description: "Genera una espera con un tiempo específico, puede servir para separar la ejecución de tareas en el tiempo",
            params: {
                time: /^[0-9]+$/,  // Tiempo en milisegundos como número entero
                descriptions: {
                    time: "Tiempo de espera en milisegundos como número entero."
                }
            }
        },
        {
            type: "wakeOnLan",
            description: "Inicia la activación de un dispositivo de red con capacidad WakeOnLan utilizando la dirección MAC",
            params: {
                macAddress: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/,  // Formato MAC address
                descriptions: {
                    macAddress: "Dirección MAC del dispositivo de red a encender. Ejemplo: 34-E1-2D-E5-05-01",
                }
            }
        },
        {
            type: "sendUDP",
            description: "Envía un mensaje UDP hacia un puerto e ip específicos",
            params: {
                ip: /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/,
                port: /^[0-9]+$/,  // Número para el puerto
                message: /^[\s\S]*\\?[\s\S]*$/,  // Mensaje como string no vacío
                descriptions: {
                    ip: "Dirección IP del destino",
                    port: "Número del puerto UDP",
                    message: "Mensaje como cadena de caracteres no vacío"
                }
            }
        },
        {
            type: "sendTCP",
            description: "Envía un mensaje TCP hacia un puerto e ip específicos",
            params: {
                ip: /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/,
                port: /^[0-9]+$/,  // Número para el puerto
                message: /^[\s\S]*\\?[\s\S]*$/,  // Mensaje como string no vacío
                descriptions: {
                    ip: "Dirección IP del destino",
                    port: "Número del puerto TCP",
                    message: "Mensaje como cadena de caracteres no vacío"
                }
            }
        },
        {
            type: "sendArtnet",
            description: "Emite una señal arnet",
            params: {
                universe: /^[0-9]+$/,
                channel: /^[0-9]+$/,
                value: /^[0-9]+$/,
                descriptions: {
                    universe: "Universo de la señal arnet",
                    channel: "Canal de la señal arnet",
                    value: "Valor de la señal arnet"
                }
            }
        },
        {
            type: "sendCOM",
            description: "Envía un mensaje serial hacia un puerto específico",
            params: {
                port: /^[0-9]+$/,
                value: /^[0-9]+$/,
                descriptions: {
                    port: "Número del puerto serial",
                    value: "Valor del mensaje serial"
                }
            }
        }
    ],
    condition: [
        {
            type: "ping",
            description: "Comprueba si un dispositivo está conectado a la red utilizando un ping",
            params: {
                ip: /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/,  // Formato IP
                descriptions: {
                    ip: "Dirección IP del dispositivo a comprobar"
                }
            }
        },
        {
            type: "TCPAnswer",
            description: "Envía un mensaje TCP a un puerto e ip específico y espera una respuesta determinada.",
            params: {
                ip: /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/,  // Formato IP
                port: /^[0-9]+$/,  // Número para el puerto
                messageToSend: /^[\s\S]*\\?[\s\S]*$/,  // Mensaje como string no vacío
                messageToExpect: /^[\s\S]*\\?[\s\S]*$/, // Mensaje
                descriptions: {
                    ip: "Dirección IP del dispositivo con el que se va a comunicar",
                    port: "Número del puerto TCP",
                    messageToSend: "Mensaje como cadena de caracteres no vacío",
                    messageToExpect: "Mensaje que se espera como una cadena de caracteres no vacío"

                }
            }
        },
        {
            type: "UDPAnswer",
            description: "Envía un mensaje UDP a un puerto e ip específico y espera una respuesta determinada.",
            params: {
                ip: /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/,  // Formato IP
                port: /^[0-9]+$/,  // Número para el puerto
                messageToSend: /^[\s\S]*\\?[\s\S]*$/,  // Mensaje como string no vacío
                messageToExpect: /^[\s\S]*\\?[\s\S]*$/, // Mensaje
                descriptions: {
                    port: "Número del puerto UDP",
                    messageToSend: "Mensaje como cadena de caracteres no vacío",
                    messageToExpect: "Mensaje que se espera como una cadena de caracteres no vacío"
                }
            }
        },
        {
            type: "COMAnswer",
            description: "Envía un mensaje serial a un puerto específico y espera una respuesta determinada.",
            params: {
                port: /^[0-9]+$/,  // Número para el puerto
                messageToSend: /^[\s\S]*\\?[\s\S]*$/,  // Mensaje como string no vacío
                messageToExpect: /^[\s\S]*\\?[\s\S]*$/,  // Mensaje como string no vacío
                descriptions: {
                    port: "Número del puerto serial",
                    messageToSend: "Mensaje como cadena de caracteres no vacío",
                    messageToExpect: "Mensaje que se espera como una cadena de caracteres no vacío"
                }
            }
        }
    ]
};

module.exports = types;
