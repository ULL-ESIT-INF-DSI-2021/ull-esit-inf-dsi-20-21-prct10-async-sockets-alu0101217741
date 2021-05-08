import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterClient} from '../src/client/messageEventEmitterClient';

describe('MessageEventEmitterClient class tests', () => {
  it('A message event is emitted when the entire message is received', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);

    client.on('message', (message) => {
      expect(message).to.be.eql({'title': 'Test note', 'body': 'This is a test note', 'color': 'green'});
      done();
    });

    socket.emit('data', '{"title": "Test note",');
    socket.emit('data', '"body": "This is a test note",');
    socket.emit('data', '"color": "green"}');
    socket.emit('end');
  });
});
