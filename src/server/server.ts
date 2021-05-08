import * as net from 'net';
import * as chalk from 'chalk';
import {ResponseType} from '../types';
import {Database} from '../notes/database';
import {Note} from '../notes/note';
import {MessageEventEmitterServer} from './messageEventEmitterServer';

const server = net.createServer((connection) => {
  const socket = new MessageEventEmitterServer(connection);

  console.log(chalk.bold.green('A client has connected.'));

  socket.on('request', (note) => {
    const database = new Database(); // MIRAR SI PONER EL PATRON SINGLETON
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
        if (listNotes == []) {
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
    connection.write(JSON.stringify(response), (error) => {
      if (error) {
        console.log(chalk.bold.red('The response has not been sent to the client'));
      } else {
        console.log(chalk.bold.green('The response has been sent to the client'));
        connection.end();
      }
    });
  });

  connection.on('error', (err) => {
    if (err) {
      console.log(`Connection could not be established: ${err.message}`);
    }
  });

  connection.on('close', () => {
    console.log(chalk.bold.green('A client has disconnected.'));
  });
});

server.listen(60300, () => {
  console.log(chalk.bold.green('Waiting for clients to connect...'));
});
