### Autor: Alberto Mendoza Rodríguez (alu0101217741@ull.edu.es)

# Informe Práctica 10 - Cliente y servidor para una aplicación de procesamiento de notas de texto

## 1. Introducción

En este informe se explica la solución diseñada para implementar una aplicación de procesamiento de notas de texto utilizando un servidor y un cliente que emplean los sockets proporcionados por el módulo `net` de **Node.js**.

Para realizar esta aplicación hay que partir de la que se realizó en la [Práctica 8](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101217741.git) ya que las operaciones que puede solicitar el cliente al servidor son las mismas que se llevaron a cabo en esa práctica, esto es, añadir, modificar, eliminar, listar y leer notas de un usuario concreto. Además, un usuario sólo puede interactuar con el cliente de la aplicación, a través de la línea de comandos. Al mismo tiempo, en el servidor, las notas se almacenan como ficheros JSON en el sistema de ficheros.

## 2. Objetivos

Los objetivos de esta práctica son:

* Aprender a utilizar el módulo net de Node.js.
* Aprender a utilizar la clase EventEmitter del módulo Events de Node.js.

## 3. Tareas previas

Antes de empezar con la práctica hay que realizar las siguientes tareas:

1. Aceptar la [asignación de GitHub Classroom](https://classroom.github.com/assignment-invitations/86449c6e8761262c57246a986902a9e8/status) asociada a esta práctica.
2. Leer la documentación sobre el [módulo net de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/net.html) y la clase  [EventEmitter del módulo Events de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#events_class_eventemitter).
