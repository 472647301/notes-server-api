import { Connection } from 'mongoose';
import { UsersSchema } from '../../schema/users.schema';
import { DATABASE_CONNECTION, USERS_MODEL } from '../../config';

export const UsersProviders = [
  {
    provide: USERS_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Users', UsersSchema),
    inject: [DATABASE_CONNECTION],
  },
];
