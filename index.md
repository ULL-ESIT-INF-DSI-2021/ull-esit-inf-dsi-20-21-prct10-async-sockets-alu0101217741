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

## 4. Explicación de la solución diseñada

En este apartado se explica el diseño que se ha llevado a cabo para realizar la aplicación de procesamiento de notas de texto. Antes de comenzar hay que crear la [estructura básica del proyecto vista en clase](https://ull-esit-inf-dsi-2021.github.io/typescript-theory/typescript-project-setup.html). Además, se sigue la metodología **TDD** por lo que en la estructura del proyecto es necesario añadir el directorio `tests` en el cual se incluyen las pruebas unitarias, que hacen posible confirmar el correcto funcionamiento del software y verificar que es robusto ante entradas no válidas. Para documentar el proyecto se utiliza la herramienta **TypeDoc**. Por último, se incluyen flujos de trabajo de GitHub Actions para realizar las pruebas en distintos entornos con diferentes versiones de Node.js, enviar los datos de cubrimiento a Coveralls, así como producir un análisis de la calidad y seguridad del código fuente a través de Sonar Cloud.

El proyecto se organiza en tres directorios: `client`, `notes` y `server`. En `notes` se encuentran las clases que permiten disponer del sistema de ficheros. Por su parte en `client` se encuentran los ficheros que incluyen toda la lógica de negocio asociada al paso de parámetros desde la línea de comandos y el envió de mensajes al servidor, así como el procesamiento de las respuestas. Por último, en `server` se almacenan los ficheros que permiten disponer de un servidor capaz de gestionar las peticiones del cliente y enviarle las respuestas adecuadas. Cabe destacar que fuera de estos directorios está el fichero `types.ts` que define una serie de tipos de datos necesarios para el desarrollo de la aplicación.

### 4.1. Directorio notes

**Código de la clase Note:**

```ts
import {Color} from '../types';

/**
 * Class representing an application note.
 */
export class Note {
  /**
   * Class constructor.
   * @param userName The user who owns the note.
   * @param title The title of the note.
   * @param body The message that the note contains.
   * @param color The color of the note.
   */
  constructor(private userName: string, private title: string,
    private body: string, private color: Color) {}

  /**
   * Method that allows to obtain the username of the note.
   * @returns The username of the note.
   */
  getUserName() {
    return this.userName;
  }

  /**
   * Method that allows obtaining the title of the note.
   * @returns The title of the note.
   */
  getTitle() {
    return this.title;
  }

  /**
   * Method that allows to obtain the body of the note.
   * @returns The message containing the note.
   */
  getBody() {
    return this.body;
  }

  /**
   * Method that allows to obtain the color of the note.
   * @returns The color of the note.
   */
  getColor() {
    return this.color;
  }
}
```

**Explicación del código:**

Esta clase permite definir la forma que debe tener una nota de la aplicación, es decir, una nota tiene que pertenecer a un determinado usuario, e incluir un título, cuerpo y color. Estas propiedades son las que se incluyen como parámetros del constructor de la clase. Además, se definen una serie de getters para poder acceder a cada una de ellas.

**Código de la clase Database:**

```ts
import * as fs from 'fs';
import {Color} from '../types';
import {Note} from './note';

/**
 * Class that manages the filesystem that contains the notes.
 */
export class Database {
  /**
   * Class constructor.
   */
  constructor() {}

  /**
   * Method that allows adding a note to the list.
   * @param note The note to be added.
   * @returns true if the note has been added correctly, false if an error has occurred.
   */
  addNote(note: Note): boolean {
    if (fs.existsSync(`notes/${note.getUserName()}/${note.getTitle()}.json`)) {
      return false;
    }
    const jsonText = `{"title": "${note.getTitle()}", "body": "${note.getBody()}", "color": "${note.getColor()}"}`;
    if (fs.existsSync(`notes/${note.getUserName()}`)) {
      fs.appendFileSync(`notes/${note.getUserName()}/${note.getTitle()}.json`, jsonText);
    } else {
      fs.mkdirSync(`notes/${note.getUserName()}`, {recursive: true});
      fs.appendFileSync(`notes/${note.getUserName()}/${note.getTitle()}.json`, jsonText);
    }
    return true;
  }

  /**
   * Method that allows modifying a note in the list.
   * @param userName The username to modify the note.
   * @param title The title of the note.
   * @param body The message that the note contains.
   * @param color The color of the note.
   * @returns true if the note has been modified correctly, false if an error has occurred.
   */
  modifyNote(userName: string, title: string, body: string, color: Color): boolean {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      return false;
    }
    const jsonText = `{"title": "${title}", "body": "${body}", "color": "${color}"}`;
    fs.writeFileSync(`notes/${userName}/${title}.json`, jsonText);
    return true;
  }

  /**
   * Method to remove a note from the list.
   * @param userName The username to remove the note.
   * @param title The title of the note.
   * @returns true if the note has been deleted correctly, false if an error has occurred.
   */
  removeNote(userName: string, title: string): boolean {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      return false;
    }
    fs.rmSync(`notes/${userName}/${title}.json`);
    return true;
  }

  /**
   * Method that lists the titles of all a user's notes.
   * @param userName The username to show the notes.
   * @returns An array with the user's notes.
   */
  showNotes(userName: string): Note[] {
    if (!fs.existsSync(`notes/${userName}`)) {
      return [];
    }
    const arrayNote: Note[] = [];
    const filesInDirectory: string[] = fs.readdirSync(`notes/${userName}`);
    filesInDirectory.forEach((file) => {
      const contentFile: string = fs.readFileSync(`notes/${userName}/${file}`, {encoding: 'utf-8'});
      const jsonContent = JSON.parse(contentFile);
      arrayNote.push(new Note(userName, jsonContent.title, jsonContent.body, jsonContent.color));
    });
    return arrayNote;
  }

  /**
   * Method that allows you to read a specific note from the list.
   * @param userName The username to read a note.
   * @param title The title of the note.
   * @returns The note to be read or false if an error has occurred.
   */
  readNote(userName: string, title: string): Note | boolean {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      return false;
    }
    const contentFile: string = fs.readFileSync(`notes/${userName}/${title}.json`, {encoding: 'utf-8'});
    const jsonContent = JSON.parse(contentFile);
    return (new Note(userName, jsonContent.title, jsonContent.body, jsonContent.color));
  }
}
```

**Explicación del código:**

Este código es similar a la clase `Note` que se utilizó en la [Práctica 8](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101217741.git) con la diferencia de que ahora en los métodos en lugar de mostrar un mensaje por consola, se retorna algún valor que indica si la operación se ha realizado con éxito. Esto se hace porque la clase Database va a ser utilizada desde el servidor por lo que únicamente se desea saber si la operación se ha realizado correctamente y así poder informar al cliente, quien debe ser el encargado de mostrar en pantalla diferentes mensajes en función de la respuesta recibida.

### 4.1. Directorio client

**Código de la clase MessageEventEmitterClient:**

```ts
import {EventEmitter} from 'events';

/**
 * Class that emits a message event when it receives a complete message.
 */
export class MessageEventEmitterClient extends EventEmitter {
  /**
   * Constructor of the class that receives portions of a message with the data event,
   * and when it receives an end event, it emits a message event to indicate that it has
   * received a complete message.
   * @param connection An object of the EventEmitter class to be used as a socket.
   */
  constructor(connection: EventEmitter) {
    super();

    let wholeResponse = '';
    connection.on('data', (responseChunk) => {
      wholeResponse += responseChunk;
    });

    connection.on('end', () => {
      this.emit('message', JSON.parse(wholeResponse));
    });
  }
}
```

**Explicación del código:**

Esta clase que hereda de `EventEmitter` será utilizada por el el cliente para poder comunicarse adecuadamente con el servidor, debido a que es capaz de emitir un evento de tipo `message` con cada recepción de un mensaje completo enviado por el servidor a través del socket correspondiente. 

En el constructor se tiene como parámetro un objeto `EventEmitter` apuntado por **connection**. Sobre este objeto se registra un manejador que se ejecutará con cada emisión del evento `data`, de forma que se almacena en **wholeResponse** un mensaje completo recibido a trozos desde el servidor.

Cuando se recibe un evento `end` significa que el servidor ha terminado de enviar la respuesta, por lo que se emite un evento de tipo `message` junto con el mensaje completo para comunicar al cliente que ya se dispone de toda la respuesta. Cabe destacar que se utiliza el método `JSON.parse` para serializar el contenido de **wholeResponse** y convertirlo en una representación de un objeto JSON válido.

**Código del fichero client:**

```ts
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import * as net from 'net';
import {MessageEventEmitterClient} from './messageEventEmitterClient';
import {RequestType} from '../types';

/**
 * A client connected to port 60300 of the server is created.
 */
const client = net.connect({port: 60300});

/**
 * An object of class MessageEventEmitterClient is created.
 */
const socket = new MessageEventEmitterClient(client);

/**
 * The request message is by default of type add.
 */
let request: RequestType = {
  type: 'add',
  user: '',
};

/**
 * Command to add a note to the list.
 */
yargs.command( {
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User who is going to add the note',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'The title of the note',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'The text of the note',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'The color of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.body === 'string' && typeof argv.title === 'string' &&
        typeof argv.user === 'string' && typeof argv.color === 'string') {
      if (argv.color == 'red' || argv.color == 'green' ||
          argv.color == 'blue' || argv.color == 'yellow') {
        request ={
          type: 'add',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: argv.color,
        };
      } else {
        console.log(chalk.bold.red('Note color must be red, green, yellow, or blue'));
      }
    }
  },
});

/**
 * Command to modify a note in the list.
 */
yargs.command({
  command: 'modify',
  describe: 'Modify a note',

  builder: {
    user: {
      describe: 'User who is going to modify a note',
      demandOption: true,
      type: 'string',
    },

    title: {
      describe: 'The title of the note',
      demandOption: true,
      type: 'string',
    },

    body: {
      describe: 'The text of the note',
      demandOption: true,
      type: 'string',
    },

    color: {
      describe: 'The color of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.body === 'string' && typeof argv.color === 'string' &&
          typeof argv.user === 'string' && typeof argv.title === 'string') {
      if (argv.color != 'blue' && argv.color != 'red' && argv.color != 'yellow' && argv.color != 'green') {
        console.log(chalk.bold.red('Note color must be red, green, blue, or yellow.'));
      } else {
        request = {
          type: 'modify',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: argv.color,
        };
      }
    }
  },
});

/**
 * Command to remove a note from the list.
 */
yargs.command({
  command: 'remove',
  describe: 'Delete a note',
  builder: {
    user: {
      describe: 'User who is going to delete the note',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'The title of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
      request = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
    }
  },
});

/**
 * Command to list the titles of a user's notes.
 */
yargs.command({
  command: 'list',
  describe: 'List the titles of the notes',
  builder: {
    user: {
      describe: 'User who will show his notes',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      request = {
        type: 'list',
        user: argv.user,
      };
    }
  },
});

/**
 * Command to read a specific note from the list.
 */
yargs.command({
  command: 'read',
  describe: 'Read a specific note from the list',
  builder: {
    user: {
      describe: 'User who will read a note',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'The title of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      request = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
    }
  },
});

/**
 * Process the arguments passed from the command line to the application.
 */
yargs.parse();

/**
 * The message is sent to the server.
 */
client.write(JSON.stringify(request) + `\n`, (err) => {
  if (err) {
    console.log(chalk.bold.red('The note could not be sent to the server.'));
  }
});

/**
 * When the message event is received, the response sent by the server is processed.
 */
socket.on('message', (jsonRequest) => {
  switch (jsonRequest.type) {
    case 'add':
      if (jsonRequest.success) {
        console.log( chalk.bold.green('New note added!'));
      } else {
        console.log(chalk.bold.red('Note title taken! '));
      }
      break;
    case 'modify':
      if ( jsonRequest.success) {
        console.log(chalk.bold.green( 'Note modified!'));
      } else {
        console.log( chalk.bold.red('The note you want to modify does not exist!'));
      }
      break;
    case 'remove':
      if (jsonRequest.success ) {
        console.log(chalk.bold.green('Note removed!') );
      } else {
        console.log( chalk.bold.red('Note not found'));
      }
      break;
    case 'list':
      if (jsonRequest.success) {
        console.log('Your notes' );
        jsonRequest.notes.forEach((note: any) => {
          console.log( chalk.bold.keyword(note.color)(note.title));
        });
      } else {
        console.log(chalk.bold.red('You have never saved a note') );
      }
      break;
    case 'read':
      if (jsonRequest.success) {
        console.log( chalk.bold.keyword(jsonRequest.notes[0].color)(jsonRequest.notes[0].title +
                                                      '\n' + jsonRequest.notes[0].body));
      } else {
        console.log( chalk.bold.red('Note not found') );
      }
      break;
    default:
      console.log(chalk.bold.red('The type of message is wrong'));
      break;
  }
});

/**
 * If there is an error in the connection it is handled properly.
 */
client.on( 'error', (err) => {
  console.log(`Connection could not be established: ${err.message}` );
});
```

**Explicación del código:**

Este código incluye los mismos comandos que se tenían en el fichero `note-app.ts` de la [Práctica 8](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101217741). Pero ahora primero se utiliza la función `connect` el módulo `net` de **Node.js**, que recibe un objeto con información sobre la conexión que se desea establecer y devuelve un objeto `Socket`, el cual queda apuntado por **client**. Tras ello, se crea el objeto **socket** de la clase `MessageEventEmitterClient` que va a permitir procesar de manera adecuada la respuesta del servidor cuando esta se haya recibido completamente. 

Una vez hecho esto, se define **request** cuyo tipo es `RequestType` y que incluye los elementos que debe tener una petición en función del comando que ejecute el cliente. Por tanto, empleando `yargs` se gestionan los diferentes comandos que se pueden utilizar y según el que se haya ejecutado se establecen correctamente los valores de las propiedades de **request**.

Cuando se han procesado mediante `yargs.parse()` los argumentos pasados por línea de comandos, se envía la petición al servidor con el método `write` del socket **client**. Ahora se emplea `JSON.stringify` para deserializar el objeto JSON **request**.

Como un objeto `MessageEventEmitterClient` puede emitir eventos del tipo `message`, se incluye un manejador que se ejecuta con la emisión de cada evento de ese tipo, es decir, cada vez que se recibe un mensaje completo desde el servidor. Junto con este evento, se incluye el parámetro **jsonRequest** que se trata de un objeto JSON con la respuesta del servidor. Por ello, accedemos a la propiedad `type` de este objeto y según el tipo de respuesta que sea y si la propiedad `success` es `true` o `false`, se mostrará en pantalla un mensaje informativo y el contenido correspondiente o un mensaje de error.

Por último, se utiliza un manejador que se ejecuta con un evento `error` para que en caso de que se produzca un error en la conexión, se pueda gestionar adecuadamente.

