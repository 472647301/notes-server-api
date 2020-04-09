import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    nickname: String,
    active_code: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
