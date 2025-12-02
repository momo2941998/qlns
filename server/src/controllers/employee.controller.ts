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
