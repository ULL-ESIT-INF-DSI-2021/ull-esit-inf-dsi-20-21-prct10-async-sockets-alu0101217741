import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/notes/note';


describe('Note class tests', () => {
  const note = new Note('test', 'Test note', 'This is a test note', 'green');

  it('A Note class object can be successfully created', () => {
    expect(note).not.to.be.equal(null);
  });

  it('Note.getUserName() returns test', () => {
    expect(note.getUserName()).to.be.equal('test');
  });

  it('Note.getTitles() returns Test note', () => {
    expect(note.getTitle()).to.be.equal('Test note');
  });

  it('Note.getBody() returns This is a test note', () => {
    expect(note.getBody()).to.be.equal('This is a test note');
  });

  it('Note.getColor() returns green', () => {
    expect(note.getColor()).to.be.equal('green');
  });
});
