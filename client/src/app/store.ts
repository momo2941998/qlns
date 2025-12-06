import { configureStore } from '@reduxjs/toolkit';
import departmentReducer from '../features/departments/departmentSlice';
import employeeReducer from '../features/employees/employeeSlice';

export const store = configureStore({
  reducer: {
    departments: departmentReducer,
    employees: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
