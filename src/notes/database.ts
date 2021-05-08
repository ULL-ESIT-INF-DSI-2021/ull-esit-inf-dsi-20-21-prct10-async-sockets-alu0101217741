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
