import mongoose from 'mongoose';
import { ENV } from './environments';

// Set timezone to Asia/Ho_Chi_Minh (UTC+7)
process.env.TZ = 'Asia/Ho_Chi_Minh';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    console.log('🕐 Timezone set to:', process.env.TZ);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
