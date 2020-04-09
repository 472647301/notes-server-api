import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from '../config';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://127.0.0.1:27017/notes', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
  },
];
