import 'mocha';
import {expect} from 'chai';
import * as fs from 'fs';
import {Database} from '../src/notes/database';
import {Note} from '../src/notes/note';

describe('Database class tests', () => {
  const database = new Database();

  it('A Database class object can be successfully created', () => {
    expect(database).not.to.be.equal(null);
  });

  it('database.addNode() returns true', () => {
    expect(database.addNote(new Note('test', 'Test note', 'This is a test note', 'green'))).to.be.equal(true);
    expect(database.addNote(new Note('test', 'Test note 2', 'This is second a test note', 'blue'))).to.be.equal(true);
  });

  it('The note was created successfully', () => {
    expect(fs.existsSync(`notes/test/Test note.json`)).to.be.equal(true);
  });

  it('database.addNote(new Note("test", "Test note", "This is a test note", "green") returns false', () => {
    expect(database.addNote(new Note('test', 'Test note', 'This is a test note', 'green'))).to.be.equal(false);
  });

  it('database.modifyNote("test", "Test note", "Testing the modify method", "blue") returns true', () => {
    expect(database.modifyNote('test', 'Test note', 'Testing the modify method', 'blue')).to.be.equal(true);
  });

  it('The file has been modified successfully', () => {
    expect(fs.readFileSync(`notes/test/Test note.json`, {encoding: 'utf-8'})).to.be.equal('{"title": "Test note", "body": "Testing the modify method", "color": "blue"}');
  });

  it('database.modifyNote("test", "Non-existent file", "Testing the modify method", "blue") returns false', () => {
    expect(database.modifyNote('test', 'Non-existent file', 'Testing the modify method', 'blue')).to.be.equal(false);
  });

  it('database.showNotes("test") returns [note1, note2]', () => {
    const note1 = new Note('test', 'Test note', 'Testing the modify method', 'blue');
    const note2 = new Note('test', 'Test note 2', 'This is second a test note', 'blue');
    expect(database.showNotes('test')).to.be.eql([note2, note1]);
  });

  it('database.showNotes("Non-existent user") returns []', () => {
    expect(database.showNotes('Non-existent user')).to.be.eql([]);
  });

  it('note.readNote("test", "Test note") returns "Test note Testing the modify method"', () => {
    expect(database.readNote('test', 'Test note')).to.be.eql(new Note('test', 'Test note', 'Testing the modify method', 'blue'));
  });

  it('note.readNote("test", "Non-existent file") returns false', () => {
    expect(database.readNote('test', 'Non-existent file')).to.be.equal(false);
  });

  it('note.removeNote("test", "Test note") returns true', () => {
    expect(database.removeNote('test', 'Test note')).to.be.equal(true);
  });

  it('The note has been deleted successfully', () => {
    expect(database.removeNote('test', 'Test note')).to.be.equal(false);
    fs.rmdirSync('./notes', {recursive: true});
  });
});
