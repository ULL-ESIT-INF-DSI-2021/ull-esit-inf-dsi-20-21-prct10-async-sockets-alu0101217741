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
