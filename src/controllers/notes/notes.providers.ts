import { Connection } from 'mongoose';
import { NotesSchema } from '../../schema/notes.schema';
import { DATABASE_CONNECTION, NOTES_MODEL } from '../../config';

export const NotesProviders = [
  {
    provide: NOTES_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Notes', NotesSchema),
    inject: [DATABASE_CONNECTION],
  },
];
