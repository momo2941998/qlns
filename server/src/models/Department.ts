import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  stt: number;
  ten: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema(
  {
    stt: { type: Number, required: true, unique: true },
    ten: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDepartment>('Department', DepartmentSchema);
