import mongoose, { Schema, Document } from 'mongoose';

export interface IRankingScore extends Document {
  playerName: string;
  score: number;
  totalQuestions: number;
  timeInSeconds: number;
  mode: 'face-to-name' | 'name-to-face';
  percentage: number;
  createdAt: Date;
}

const RankingScoreSchema: Schema = new Schema(
  {
    playerName: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    timeInSeconds: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      enum: ['face-to-name', 'name-to-face'],
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
RankingScoreSchema.index({ mode: 1, percentage: -1, timeInSeconds: 1 });

export default mongoose.model<IRankingScore>('RankingScore', RankingScoreSchema);
