# CÁC BƯỚC TRIỂN KHAI DỰ ÁN QUẢN LÝ NHÂN SỰ

## BƯỚC 1: THIẾT LẬP CẤU TRÚC THỨ MỤC DỰ ÁN

```
QLNS/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── app/           # Redux store configuration
│   │   ├── components/    # React components
│   │   ├── features/      # Feature-based modules
│   │   │   ├── departments/
│   │   │   └── employees/
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                 # Backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   │   ├── database.ts
│   │   │   └── environments.ts
│   │   ├── models/        # Mongoose models
│   │   │   ├── Department.ts
│   │   │   └── Employee.ts
│   │   ├── routes/        # API routes
│   │   │   ├── department.routes.ts
│   │   │   └── employee.routes.ts
│   │   ├── controllers/   # Request handlers
│   │   │   ├── department.controller.ts
│   │   │   └── employee.controller.ts
│   │   ├── services/      # Business logic
│   │   │   ├── department.service.ts
│   │   │   └── employee.service.ts
│   │   ├── middlewares/   # Express middlewares
│   │   └── server.ts      # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml      # MongoDB container configuration
├── .gitignore
└── README.md
```

## BƯỚC 2: THIẾT LẬP DOCKER COMPOSE CHO MONGODB

### 2.1. Tạo file `docker-compose.yml`

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: qlns_mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: qlns_db
    volumes:
      - mongodb_data:/data/db
    networks:
      - qlns_network

volumes:
  mongodb_data:
    driver: local

networks:
  qlns_network:
    driver: bridge
```

### 2.2. Khởi động MongoDB

```bash
docker-compose up -d
```

## BƯỚC 3: THIẾT LẬP SERVER (BACKEND)

### 3.1. Khởi tạo project Node.js

```bash
mkdir server && cd server
npm init -y
```

### 3.2. Cài đặt dependencies

```bash
# Dependencies
npm install express mongoose dotenv cors

# Dev dependencies
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
```

### 3.3. Cấu hình TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3.4. Tạo file `.env`

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://admin:admin123@localhost:27017/qlns_db?authSource=admin
```

### 3.5. Tạo file `src/config/environments.ts`

```typescript
import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/qlns_db?authSource=admin',
} as const;
```

### 3.6. Tạo Mongoose Models

#### `src/models/Department.ts`

```typescript
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
```

#### `src/models/Employee.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  stt: number;
  hoTen: string;
  chucDanh: string;
  gioiTinh: string;
  ngaySinh: Date;
  sdt: string;
  canCuoc: {
    soThe: string;
    ngayCap: Date;
    noiCap: string;
  };
  trinhDoChuyenMon: {
    loaiBang: string;
    namTotNghiep: number;
    chuyenNganh: string;
    truongDaiHoc: string;
  };
  maSoBHXH: string;
  maSoThue: string;
  queQuan: string;
  diaChiHienTai: string;
  thoiGianBatDauLamViec: Date;
  phanTo: string;
  diaChiIP: string;
  email: string;
  ghiChu: string;
  department: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
  {
    stt: { type: Number, required: true, unique: true },
    hoTen: { type: String, required: true, trim: true },
    chucDanh: { type: String, trim: true },
    gioiTinh: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
    ngaySinh: { type: Date, required: true },
    sdt: { type: String, trim: true },
    canCuoc: {
      soThe: { type: String, trim: true },
      ngayCap: { type: Date },
      noiCap: { type: String, trim: true },
    },
    trinhDoChuyenMon: {
      loaiBang: { type: String, trim: true },
      namTotNghiep: { type: Number },
      chuyenNganh: { type: String, trim: true },
      truongDaiHoc: { type: String, trim: true },
    },
    maSoBHXH: { type: String, trim: true },
    maSoThue: { type: String, trim: true },
    queQuan: { type: String, trim: true },
    diaChiHienTai: { type: String, trim: true },
    thoiGianBatDauLamViec: { type: Date },
    phanTo: { type: String, trim: true },
    diaChiIP: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    ghiChu: { type: String, trim: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
```

### 3.7. Tạo Database Connection (`src/config/database.ts`)

```typescript
import mongoose from 'mongoose';
import { ENV } from './environments';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
```

### 3.8. Tạo Services (Business Logic)

#### `src/services/department.service.ts`

```typescript
import Department, { IDepartment } from '../models/Department';

export class DepartmentService {
  async getAll(): Promise<IDepartment[]> {
    return await Department.find().sort({ stt: 1 });
  }

  async getById(id: string): Promise<IDepartment | null> {
    return await Department.findById(id);
  }

  async create(data: Partial<IDepartment>): Promise<IDepartment> {
    const department = new Department(data);
    return await department.save();
  }

  async update(id: string, data: Partial<IDepartment>): Promise<IDepartment | null> {
    return await Department.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IDepartment | null> {
    return await Department.findByIdAndDelete(id);
  }
}
```

#### `src/services/employee.service.ts`

```typescript
import Employee, { IEmployee } from '../models/Employee';

export class EmployeeService {
  async getAll(): Promise<IEmployee[]> {
    return await Employee.find().populate('department').sort({ stt: 1 });
  }

  async getById(id: string): Promise<IEmployee | null> {
    return await Employee.findById(id).populate('department');
  }

  async getByDepartment(departmentId: string): Promise<IEmployee[]> {
    return await Employee.find({ department: departmentId }).populate('department');
  }

  async create(data: Partial<IEmployee>): Promise<IEmployee> {
    const employee = new Employee(data);
    return await employee.save();
  }

  async update(id: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
    return await Employee.findByIdAndUpdate(id, data, { new: true }).populate('department');
  }

  async delete(id: string): Promise<IEmployee | null> {
    return await Employee.findByIdAndDelete(id);
  }
}
```

### 3.9. Tạo Controllers

#### `src/controllers/department.controller.ts`

```typescript
import { Request, Response } from 'express';
import { DepartmentService } from '../services/department.service';

const departmentService = new DepartmentService();

export class DepartmentController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const departments = await departmentService.getAll();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.getById(req.params.id);
      if (!department) {
        res.status(404).json({ message: 'Department not found' });
        return;
      }
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.create(req.body);
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({ message: 'Bad request', error });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.update(req.params.id, req.body);
      if (!department) {
        res.status(404).json({ message: 'Department not found' });
        return;
      }
      res.json(department);
    } catch (error) {
      res.status(400).json({ message: 'Bad request', error });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.delete(req.params.id);
      if (!department) {
        res.status(404).json({ message: 'Department not found' });
        return;
      }
      res.json({ message: 'Department deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}
```

#### `src/controllers/employee.controller.ts`

```typescript
import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

const employeeService = new EmployeeService();

export class EmployeeController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const employees = await employeeService.getAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const employee = await employeeService.getById(req.params.id);
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getByDepartment(req: Request, res: Response): Promise<void> {
    try {
      const employees = await employeeService.getByDepartment(req.params.departmentId);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const employee = await employeeService.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ message: 'Bad request', error });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const employee = await employeeService.update(req.params.id, req.body);
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      res.json(employee);
    } catch (error) {
      res.status(400).json({ message: 'Bad request', error });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const employee = await employeeService.delete(req.params.id);
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}
```

### 3.10. Tạo Routes

#### `src/routes/department.routes.ts`

```typescript
import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';

const router = Router();
const departmentController = new DepartmentController();

router.get('/', departmentController.getAll.bind(departmentController));
router.get('/:id', departmentController.getById.bind(departmentController));
router.post('/', departmentController.create.bind(departmentController));
router.put('/:id', departmentController.update.bind(departmentController));
router.delete('/:id', departmentController.delete.bind(departmentController));

export default router;
```

#### `src/routes/employee.routes.ts`

```typescript
import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

const router = Router();
const employeeController = new EmployeeController();

router.get('/', employeeController.getAll.bind(employeeController));
router.get('/:id', employeeController.getById.bind(employeeController));
router.get('/department/:departmentId', employeeController.getByDepartment.bind(employeeController));
router.post('/', employeeController.create.bind(employeeController));
router.put('/:id', employeeController.update.bind(employeeController));
router.delete('/:id', employeeController.delete.bind(employeeController));

export default router;
```

### 3.11. Tạo Server Entry Point (`src/server.ts`)

```typescript
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/environments';
import { connectDB } from './config/database';
import departmentRoutes from './routes/department.routes';
import employeeRoutes from './routes/employee.routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
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
```

### 3.12. Cập nhật `package.json` scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

## BƯỚC 4: THIẾT LẬP CLIENT (FRONTEND)

### 4.1. Khởi tạo project Vite + React + TypeScript

```bash
cd ..
npm create vite@latest client -- --template react-ts
cd client
```

### 4.2. Cài đặt dependencies

```bash
# Core dependencies
npm install @reduxjs/toolkit react-redux redux-persist axios

# UI libraries (optional but recommended)
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Development dependencies
npm install -D @types/react @types/react-dom
```

### 4.3. Cấu hình Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### 4.4. Tạo TypeScript Types (`src/types/index.ts`)

```typescript
export interface Department {
  _id: string;
  stt: number;
  ten: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  stt: number;
  hoTen: string;
  chucDanh: string;
  gioiTinh: 'Nam' | 'Nữ' | 'Khác';
  ngaySinh: string;
  sdt: string;
  canCuoc: {
    soThe: string;
    ngayCap: string;
    noiCap: string;
  };
  trinhDoChuyenMon: {
    loaiBang: string;
    namTotNghiep: number;
    chuyenNganh: string;
    truongDaiHoc: string;
  };
  maSoBHXH: string;
  maSoThue: string;
  queQuan: string;
  diaChiHienTai: string;
  thoiGianBatDauLamViec: string;
  phanTo: string;
  diaChiIP: string;
  email: string;
  ghiChu: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
}
```

### 4.5. Tạo API Services (`src/services/api.ts`)

```typescript
import axios from 'axios';
import { Department, Employee } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Department API
export const departmentAPI = {
  getAll: () => api.get<Department[]>('/departments'),
  getById: (id: string) => api.get<Department>(`/departments/${id}`),
  create: (data: Partial<Department>) => api.post<Department>('/departments', data),
  update: (id: string, data: Partial<Department>) => api.put<Department>(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get<Employee[]>('/employees'),
  getById: (id: string) => api.get<Employee>(`/employees/${id}`),
  getByDepartment: (departmentId: string) => api.get<Employee[]>(`/employees/department/${departmentId}`),
  create: (data: Partial<Employee>) => api.post<Employee>('/employees', data),
  update: (id: string, data: Partial<Employee>) => api.put<Employee>(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

export default api;
```

### 4.6. Thiết lập Redux Store

#### `src/app/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import departmentReducer from '../features/departments/departmentSlice';
import employeeReducer from '../features/employees/employeeSlice';

const departmentPersistConfig = {
  key: 'departments',
  storage,
};

const employeePersistConfig = {
  key: 'employees',
  storage,
};

const persistedDepartmentReducer = persistReducer(departmentPersistConfig, departmentReducer);
const persistedEmployeeReducer = persistReducer(employeePersistConfig, employeeReducer);

export const store = configureStore({
  reducer: {
    departments: persistedDepartmentReducer,
    employees: persistedEmployeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### `src/app/hooks.ts`

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 4.7. Tạo Redux Slices

#### `src/features/departments/departmentSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { departmentAPI } from '../../services/api';
import { Department } from '../../types';

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

export const fetchDepartments = createAsyncThunk('departments/fetchAll', async () => {
  const response = await departmentAPI.getAll();
  return response.data;
});

export const createDepartment = createAsyncThunk(
  'departments/create',
  async (data: Partial<Department>) => {
    const response = await departmentAPI.create(data);
    return response.data;
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, data }: { id: string; data: Partial<Department> }) => {
    const response = await departmentAPI.update(id, data);
    return response.data;
  }
);

export const deleteDepartment = createAsyncThunk('departments/delete', async (id: string) => {
  await departmentAPI.delete(id);
  return id;
});

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch departments';
      })
      .addCase(createDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.departments.push(action.payload);
      })
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        const index = state.departments.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })
      .addCase(deleteDepartment.fulfilled, (state, action: PayloadAction<string>) => {
        state.departments = state.departments.filter((d) => d._id !== action.payload);
      });
  },
});

export default departmentSlice.reducer;
```

#### `src/features/employees/employeeSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { employeeAPI } from '../../services/api';
import { Employee } from '../../types';

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async () => {
  const response = await employeeAPI.getAll();
  return response.data;
});

export const fetchEmployeesByDepartment = createAsyncThunk(
  'employees/fetchByDepartment',
  async (departmentId: string) => {
    const response = await employeeAPI.getByDepartment(departmentId);
    return response.data;
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (data: Partial<Employee>) => {
    const response = await employeeAPI.create(data);
    return response.data;
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }: { id: string; data: Partial<Employee> }) => {
    const response = await employeeAPI.update(id, data);
    return response.data;
  }
);

export const deleteEmployee = createAsyncThunk('employees/delete', async (id: string) => {
  await employeeAPI.delete(id);
  return id;
});

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      .addCase(fetchEmployeesByDepartment.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.employees = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        const index = state.employees.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<string>) => {
        state.employees = state.employees.filter((e) => e._id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
```

### 4.8. Cập nhật `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
```

### 4.9. Tạo Components cơ bản

#### `src/components/DepartmentList.tsx`

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchDepartments } from '../features/departments/departmentSlice';

const DepartmentList = () => {
  const dispatch = useAppDispatch();
  const { departments, loading, error } = useAppSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Danh sách Phòng ban</h2>
      <ul>
        {departments.map((dept) => (
          <li key={dept._id}>
            {dept.stt}. {dept.ten}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentList;
```

#### `src/components/EmployeeList.tsx`

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';

const EmployeeList = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useAppSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Danh sách Nhân viên</h2>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Chức danh</th>
            <th>Phòng ban</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.stt}</td>
              <td>{emp.hoTen}</td>
              <td>{emp.chucDanh}</td>
              <td>{emp.department?.ten}</td>
              <td>{emp.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
```

### 4.10. Cập nhật `src/App.tsx`

```typescript
import DepartmentList from './components/DepartmentList';
import EmployeeList from './components/EmployeeList';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Hệ thống Quản lý Nhân sự</h1>
      <DepartmentList />
      <EmployeeList />
    </div>
  );
}

export default App;
```

## BƯỚC 5: CHẠY VÀ KIỂM THỬ

### 5.1. Khởi động MongoDB

```bash
docker-compose up -d
```

### 5.2. Khởi động Server

```bash
cd server
npm run dev
```

Server sẽ chạy tại: http://localhost:5000

### 5.3. Khởi động Client

```bash
cd client
npm run dev
```

Client sẽ chạy tại: http://localhost:3000

### 5.4. Test API với curl hoặc Postman

```bash
# Tạo phòng ban
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"stt": 1, "ten": "Phòng Kỹ thuật"}'

# Lấy danh sách phòng ban
curl http://localhost:5000/api/departments

# Tạo nhân viên
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "stt": 1,
    "hoTen": "Nguyễn Văn A",
    "chucDanh": "Kỹ sư phần mềm",
    "gioiTinh": "Nam",
    "ngaySinh": "1990-01-01",
    "email": "nguyenvana@example.com",
    "department": "YOUR_DEPARTMENT_ID_HERE"
  }'
```

## BƯỚC 6: HOÀN THIỆN VÀ MỞ RỘNG

### 6.1. Thêm các tính năng

- Tìm kiếm và lọc nhân viên
- Phân trang (pagination)
- Sắp xếp (sorting)
- Validation và xử lý lỗi nâng cao
- Upload ảnh đại diện cho nhân viên
- Export dữ liệu ra Excel/PDF
- Authentication và Authorization

### 6.2. Cải thiện UI/UX

- Sử dụng Material-UI hoặc Ant Design
- Tạo form tạo/sửa nhân viên và phòng ban
- Thêm modal xác nhận xóa
- Thêm thông báo (toast/snackbar)
- Responsive design

### 6.3. Deployment

- Build production: `npm run build`
- Deploy server lên Heroku, Railway, hoặc VPS
- Deploy client lên Vercel, Netlify
- Sử dụng MongoDB Atlas cho production database

## GHI CHÚ QUAN TRỌNG

1. Đảm bảo MongoDB đang chạy trước khi khởi động server
2. Các file environments.ts phải được import đúng cách trong toàn bộ server
3. Kiểm tra CORS configuration nếu gặp lỗi kết nối giữa client và server
4. Sử dụng `.gitignore` để không commit file `.env` và `node_modules`
5. Thường xuyên test API endpoints trước khi tích hợp vào client
