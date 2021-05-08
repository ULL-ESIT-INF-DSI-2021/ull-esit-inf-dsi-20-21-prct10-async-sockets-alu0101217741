import {Color} from '../types';

/**
 * Class representing an application note.
 */
export class Note {
  /**
   * Class constructor.
   * @param userName The user who owns the note.
   * @param title The title of the note.
   * @param body The message that the note contains.
   * @param color The color of the note.
   */
  constructor(private userName: string, private title: string,
    private body: string, private color: Color) {}

  /**
   * Method that allows to obtain the username of the note.
   * @returns The username of the note.
   */
  getUserName() {
    return this.userName;
  }

  /**
   * Method that allows obtaining the title of the note.
   * @returns The title of the note.
   */
  getTitle() {
    return this.title;
  }

  /**
   * Method that allows to obtain the body of the note.
   * @returns The message containing the note.
   */
  getBody() {
    return this.body;
  }

  /**
   * Method that allows to obtain the color of the note.
   * @returns The color of the note.
   */
  getColor() {
    return this.color;
  }
}
