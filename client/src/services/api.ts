import axios from 'axios';
import { Department, Employee } from '../types';
import { generateChecksum } from '../utils/checksum';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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

// Avatar API
export const avatarAPI = {
  upload: (employeeId: string, imageBase64: string) =>
    api.post<{ message: string; avatar: string }>('/avatar/upload', {
      employeeId,
      image: imageBase64,
    }),
  delete: (employeeId: string) =>
    api.delete<{ message: string }>(`/avatar/${employeeId}`),
};

// Ranking API
export interface RankingScore {
  _id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  timeInSeconds: number;
  mode: 'face-to-name' | 'name-to-face';
  percentage: number;
  createdAt: string;
}

export const rankingAPI = {
  submitScore: async (data: {
    playerName: string;
    score: number;
    totalQuestions: number;
    timeInSeconds: number;
    mode: 'face-to-name' | 'name-to-face';
  }) => {
    // Generate checksum for the request body
    const checksum = await generateChecksum(data);

    // Send request with checksum header
    return api.post<{ message: string; data: RankingScore }>('/ranking', data, {
      headers: {
        'x-checksum': checksum,
      },
    });
  },

  getRankings: (params?: { mode?: 'face-to-name' | 'name-to-face'; limit?: number }) =>
    api.get<{ data: RankingScore[] }>('/ranking', { params }),
};

export default api;
