import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV } from './config/environments';
import { connectDB } from './config/database';
import departmentRoutes from './routes/department.routes';
import employeeRoutes from './routes/employee.routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);

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
