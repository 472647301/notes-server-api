import { Document } from 'mongoose';

export interface Hunts extends Document {
  readonly ip: string;
  readonly num: Number;
  readonly time: string;
}
