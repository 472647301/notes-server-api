import { Document } from 'mongoose';

export interface Users extends Document {
  readonly email: string;
  readonly password: string;
  readonly nickname: string;
  readonly active_code: string;
}
