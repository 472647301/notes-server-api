import * as mongoose from 'mongoose';

export const NotesSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: String,
    update_name: String,
    /**
     * 协作者 JSON {'email':'name'}
     */
    members: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
