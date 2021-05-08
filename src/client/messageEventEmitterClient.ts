import {EventEmitter} from 'events';

export class MessageEventEmitterClient extends EventEmitter {
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
