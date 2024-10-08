const fs = require('fs');
const path = require('path');
const types = require('../types'); // Ajusta la ruta según corresponda

function generateDocs() {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentación</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1, h2 {
            color: #333;
        }
        h2 {
            border-bottom: 2px solid #ddd;
            padding-bottom: 5px;
        }
        p {
            margin: 10px 0;
        }
        ul {
            margin: 5px 0;
        }
        li {
            margin: 5px 0;
        }
        .description {
            font-weight: bold;
        }
        pre {
            background-color: #f4f4f4;
            border-left: 4px solid #ccc;
            padding: 10px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>Device Control</h1>
    <p>Este documento proporciona una guía completa para configurar y gestionar rutinas y tareas en el sistema de control de dispositivos. Aquí encontrará la información necesaria para definir triggers, jobs y conditions, así como ejemplos prácticos para ayudarle a configurar sus rutinas de manera efectiva.</p>
    <p>A continuación, se muestra un ejemplo de una estructura de configuración básica para rutinas y tareas:</p>
    <pre>
{
    "routines": [
        {
            "id": "routine1",
            "name": "Routine 1",
            "description": "This is routine 1",
            "isSequential": true,
            "stopOnTaskFailure": false,
            "trigger": [
                {
                    "type": "api",
                    "params": {
                        "method": "GET",
                        "endpoint": "/trigger/routine1"
                    }
                },
                {
                    "type": "cron",
                    "params": {
                        "day": 3,
                        "time": "15:44"
                    }
                },
                {
                    "type": "udp",
                    "params": {
                        "port": 5000,
                        "message": "trigger"
                    }
                }
            ],
            "tasks": [
                {
                    "name": "Tarea numero 1",
                    "job": {
                        "type": "wait",
                        "params": {
                            "time": 10000
                        }
                    }
                }
            ]
        },
        {
            "id": "routine2",
            "name": "Routine 2",
            "description": "This is routine 2",
            "isSequential": true,
            "stopOnTaskFailure": false,
            "trigger": [
                {
                    "type": "event",
                    "params": {
                        "name": "routine1:completed"
                    }
                }
            ],
            "tasks": [
                {
                    "name": "Tarea numero 1",
                    "retries": 3,
                    "retryDelay": 20000,
                    "job": {
                        "type": "wakeOnLan",
                        "params": {
                            "macAddress": "D8:9E:F3:0A:8A:D3"
                        }
                    },
                    "condition": {
                        "type": "ping",
                        "params": {
                            "ip": "192.168.100.63"
                        }
                    }
                }
            ]
        }
    ]
}
    </pre>
`;

    // Función para agregar secciones de documentación
    function addSection(title, items) {
        htmlContent += `
        <h2>${title}</h2>
        ${items.map(item => `
            <p class="description">${item.type}</p>
            <p>${item.description}</p>
            <ul>
                ${Object.entries(item.params.descriptions).map(([param, description]) => `
                    <li><strong>${param}:</strong> ${description}</li>
                `).join('')}
            </ul>
        `).join('')}
        `;
    }

    // Agregar documentación para triggers
    addSection('Triggers', types.trigger.map(trigger => ({
        type: trigger.type,
        description: trigger.description,
        params: trigger.params
    })));

    // Agregar documentación para jobs
    addSection('Jobs', types.job.map(job => ({
        type: job.type,
        description: job.description,
        params: job.params
    })));

    // Agregar documentación para conditions
    addSection('Conditions', types.condition.map(condition => ({
        type: condition.type,
        description: condition.description,
        params: condition.params
    })));

    // Cerrar el documento HTML
    htmlContent += `
</body>
</html>
`;

    // Guardar el documento en un archivo HTML
    const outputPath = path.join(__dirname, "..", "..", 'README.html');
    fs.writeFileSync(outputPath, htmlContent);
    console.log('Documentación generada en docs.html');
}

// Ejecutar la función para generar la documentación
//generateDocs();
