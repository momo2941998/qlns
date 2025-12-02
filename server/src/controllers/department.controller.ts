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
