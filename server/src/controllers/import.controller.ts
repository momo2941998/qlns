import { Request, Response } from 'express';
import { ImportService } from '../services/import.service';

const importService = new ImportService();

export class ImportController {
  async importEmployees(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const { departmentId } = req.body;

      if (!departmentId) {
        res.status(400).json({ message: 'Department ID is required' });
        return;
      }

      const result = await importService.importEmployeesFromExcel(
        req.file.path,
        departmentId
      );

      res.json({
        message: 'Import completed',
        result,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Import failed', error: error.message });
    }
  }
}
