import {Color} from "../types";

export class Note {
  constructor(private userName: string, private title: string,
    private body: string, private color: Color) {}

  getUserName() {
    return this.userName;
  }

  getTitle() {
    return this.title;
  }

  getBody() {
    return this.body;
  }

  getColor() {
    return this.color;
  }
}
