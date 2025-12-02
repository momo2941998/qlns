import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { ENV } from './config/environments';
import { connectDB } from './config/database';
import departmentRoutes from './routes/department.routes';
import employeeRoutes from './routes/employee.routes';
import importRoutes from './routes/import.routes';
import avatarRoutes from './routes/avatar.routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // Tăng limit để nhận base64 image
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads) - Sử dụng UPLOAD_DIR từ ENV
// Tính toán đường dẫn tuyệt đối đầy đủ để serve files
const uploadBaseAbsolute = ENV.UPLOAD_DIR

// Serve static files
app.use(`/uploads/avatar`, express.static(uploadBaseAbsolute));

console.log(`📂 Serving static files:`);
console.log(`   Serve from: ${uploadBaseAbsolute}`);

// Routes
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/import', importRoutes);
app.use('/api/avatar', avatarRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server is running on port ${ENV.PORT}`);
      console.log(`📝 Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
