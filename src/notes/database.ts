import * as fs from 'fs';
import {Color} from '../types';
import {Note} from './note';


export class Database {
  constructor() {}

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

  modifyNote(userName: string, title: string, body: string, color: Color): boolean {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      return false;
    }
    const jsonText = `{"title": "${title}", "body": "${body}", "color": "${color}"}`;
    fs.writeFileSync(`notes/${userName}/${title}.json`, jsonText);
    return true;
  }

  removeNote(userName: string, title: string): boolean {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      return false;
    }
    fs.rmSync(`notes/${userName}/${title}.json`);
    return true;
  }

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

  readNote(userName: string, title: string): Note | boolean {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      return false;
    }
    const contentFile: string = fs.readFileSync(`notes/${userName}/${title}.json`, {encoding: 'utf-8'});
    const jsonContent = JSON.parse(contentFile);
    return (new Note(userName, jsonContent.title, jsonContent.body, jsonContent.color));
  }
}
