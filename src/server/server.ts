import * as net from 'net';
import * as chalk from 'chalk';
import {ResponseType} from '../types';
import {Database} from '../notes/database';
import {Note} from '../notes/note';
import {MessageEventEmitterServer} from './messageEventEmitterServer';

/**
 * A server is created with the net module of Node.js.
 */
const server = net.createServer((connection) => {
  /**
   * An object of class MessageEventEmitterServer is created.
   */
  const socket = new MessageEventEmitterServer(connection);

  console.log(chalk.bold.green('A client has connected.'));

  /**
   * When the request event is received, the message sent by the client is processed.
   */
  socket.on('request', (note) => {
    const database = new Database();
    const response: ResponseType = {
      type: 'add',
      success: true,
    };
    switch (note.type) {
      case 'add':
        const newNote = new Note(note.user, note.title, note.body, note.color);
        if (!database.addNote(newNote)) {
          response.success = false;
        }
        break;
      case 'modify':
        response.type = 'modify';
        if (!database.modifyNote(note.user, note.title, note.body, note.color)) {
          response.success = false;
        }
        break;
      case 'remove':
        response.type = 'remove';
        if (!database.removeNote(note.user, note.title)) {
          response.success = false;
        }
        break;
      case 'list':
        response.type = 'list';
        const listNotes: Note[] = database.showNotes(note.user);
        if (listNotes.length == 0) {
          response.success = false;
        } else {
          response.notes = listNotes;
        }
        break;
      case 'read':
        response.type = 'read';
        const noteContent = database.readNote(note.user, note.title);
        if (noteContent == false) {
          response.success = false;
        } else if (typeof noteContent !== 'boolean') {
          response.notes = [noteContent];
        }
        break;
      default:
        console.log(chalk.bold.red('The type of message is wrong'));
        break;
    }

    /**
     * The response is sent to the client.
     */
    connection.write(JSON.stringify(response), (error) => {
      if (error) {
        console.log(chalk.bold.red('The response has not been sent to the client.'));
      } else {
        console.log(chalk.bold.green('The response has been sent to the client.'));
        connection.end();
      }
    });
  });

  /**
   * If there is an error in the connection it is handled properly.
   */
  connection.on('error', (err) => {
    if (err) {
      console.log(`Connection could not be established: ${err.message}`);
    }
  });

  /**
   * When a client disconnects a message informing about this is displayed
   * on the server.
   */
  connection.on('close', () => {
    console.log(chalk.bold.green('A client has disconnected.\n'));
  });
});

/**
 * The server is listening on port 60300.
 */
server.listen(60300, () => {
  console.log(chalk.bold.green('Waiting for clients to connect...\n'));
});
