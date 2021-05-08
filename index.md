### Autor: Alberto Mendoza Rodríguez (alu0101217741@ull.edu.es)

# Informe Práctica 10 - Cliente y servidor para una aplicación de procesamiento de notas de texto

## 1. Introducción

En este informe se explica la solución diseñada para implementar una aplicación de procesamiento de notas de texto utilizando un servidor y un cliente que emplean los sockets proporcionados por el módulo `net` de **Node.js**.

Para realizar esta aplicación hay que partir de la que se realizó en la [Práctica 8](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101217741.git) ya que las operaciones que puede solicitar el cliente al servidor son las mismas que se llevaron a cabo en esa práctica, esto es, añadir, modificar, eliminar, listar y leer notas de un usuario concreto. Además, un usuario sólo puede interactuar con el cliente de la aplicación, a través de la línea de comandos. Al mismo tiempo, en el servidor, las notas se almacenan como ficheros JSON en el sistema de ficheros.

