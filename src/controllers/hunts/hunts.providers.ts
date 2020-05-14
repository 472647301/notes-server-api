import { Connection } from 'mongoose';
import { HuntsSchema } from '../../schema/hunts.schema';
import { DATABASE_CONNECTION, HUNTS_MODEL } from '../../config';

export const UsersProviders = [
  {
    provide: HUNTS_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Hunts', HuntsSchema),
    inject: [DATABASE_CONNECTION],
  },
];
