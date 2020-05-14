import * as mongoose from 'mongoose';

export const HuntsSchema = new mongoose.Schema(
  {
    ip: String,
    num: Number,
    time: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
