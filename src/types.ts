import {Note} from './notes/note';

/**
 * Type representing the colors accepted by the system.
 */
export type Color = 'red' | 'green' |'blue' | 'yellow';

/**
 * Type that represents the elements that a request message must include.
 */
export type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'list' | 'read';
    user: string;
    title?: string;
    body?: string;
    color?: Color;
  }

/**
 * Type that represents the elements that a response message should include.
 */
export type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list';
    success: boolean;
    notes?: Note[];
}
