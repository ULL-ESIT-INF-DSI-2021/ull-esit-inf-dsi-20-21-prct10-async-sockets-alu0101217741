import {Note} from './notes/note';

export type Color = 'red' | 'green' |'blue' | 'yellow';

export type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'list' | 'read';
    user: string;
    title?: string;
    body?: string;
    color?: Color;
  }

export type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list';
    success: boolean;
    notes?: Note[];
}
