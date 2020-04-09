import { Document } from 'mongoose';

export interface Notes extends Document {
  readonly title: string;
  readonly content: string;
  readonly author: string;
  readonly update_name: string;
  /**
   * 协作者 JSON {'email':'name'}
   */
  readonly members: string;
}
