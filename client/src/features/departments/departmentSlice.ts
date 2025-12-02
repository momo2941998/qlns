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
