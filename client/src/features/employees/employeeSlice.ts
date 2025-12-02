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
