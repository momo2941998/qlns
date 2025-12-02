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
