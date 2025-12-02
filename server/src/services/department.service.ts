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
