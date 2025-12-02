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
