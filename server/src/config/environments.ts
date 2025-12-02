import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/qlns_db?authSource=admin',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/avatars',
} as const;

// Log environment variables
console.log('========================================');
console.log('📋 ENVIRONMENT VARIABLES');
console.log('========================================');
console.log('NODE_ENV:', ENV.NODE_ENV);
console.log('PORT:', ENV.PORT);
console.log('MONGO_URI:', ENV.MONGO_URI);
console.log('UPLOAD_DIR:', ENV.UPLOAD_DIR);
console.log('========================================');
