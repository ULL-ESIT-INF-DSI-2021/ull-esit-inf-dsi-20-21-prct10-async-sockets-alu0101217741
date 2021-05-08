import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterServer} from '../src/server/messageEventEmitterServer';

describe('MessageEventEmitterServer class tests', () => {
  it('A request event is emitted when the entire message is received', (done) => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitterServer(socket);

    server.on('request', (message) => {
      expect(message).to.be.eql({'title': 'Test note', 'body': 'This is a test note', 'color': 'green'});
      done();
    });

    socket.emit('data', '{"title": "Test note",');
    socket.emit('data', '"body": "This is a test note",');
    socket.emit('data', '"color": "green"}');
    socket.emit('data', '\n');
  });
});
