# Desarrollo de Sistemas Informáticos - Grado en Ingeniería Informática - ULL

## Alberto Mendoza Rodríguez (alu0101217741@ull.edu.es)

## Práctica 10 - Cliente y servidor para una aplicación de procesamiento de notas de texto

<p align="center">
    <a href="https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741/actions/workflows/coveralls.yml">
        <img alt="Coveralls" src="https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741/actions/workflows/coveralls.yml/badge.svg">
    </a>
    <a href='https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741?branch=main'>
        <img src='https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741/badge.svg?branch=main' alt='Coverage Status'/>
    </a>
    <a href='https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741/actions/workflows/node.js.yml'>
        <img src='https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741/actions/workflows/node.js.yml/badge.svg' alt='Tests' />
    </a>
    <a href='https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741/actions/workflows/sonarcloud.yml'>
        <img src='https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741/actions/workflows/sonarcloud.yml/badge.svg' alt='Quality Gate Status' />
    </a>
</p>

En esta práctica se implementa la aplicación de procesamiento de notas de texto que se llevó a cabo en la [Práctica 8](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101217741.git) para escribir un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo **net** de **Node.js**.

Las operaciones que se pueden solicitar del cliente al servidor deberán ser las mismas que ya se implementaron durante la [Práctica 8](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101217741.git), esto es, añadir, modificar, eliminar, listar y leer notas de un usuario concreto. Un usuario interactuará con el cliente de la aplicación, exclusivamente, a través de la línea de comandos. Al mismo tiempo, en el servidor, las notas se almacenarán como ficheros JSON en el sistema de ficheros y siguiendo la misma estructura de directorios utilizada durante la Práctica 8.

Para ejecutar la aplicación hay que utilizar dos terminales, en una de ellas para tener disponible el servidor hay que ejecutar `node dist/server/server.js`. En la otra terminal hay que ejecutar `node dist/client/client.js comando_a_ejecutar` donde en `comando_a_ejecutar` hay que indicar el comando que se quiere utilizar desde el cliente para enviar la petición al servidor. Los comandos que disponibles son: `add`, `modify`, `remove`, `list` y `read`.

Además, se llevará a cabo un informe donde se muestra y explica la solución diseñada.

Para ver el informe de la práctica haz clic [aquí](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101217741/).
