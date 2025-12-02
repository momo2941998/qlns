import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import departmentReducer from '../features/departments/departmentSlice';
import employeeReducer from '../features/employees/employeeSlice';

const departmentPersistConfig = {
  key: 'departments',
  storage,
  blacklist: ['loading', 'error'], // Không lưu loading và error state
};

const employeePersistConfig = {
  key: 'employees',
  storage,
  blacklist: ['loading', 'error'], // Không lưu loading và error state
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
