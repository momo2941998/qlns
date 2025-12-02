import { Router } from 'express';
import { ImportController } from '../controllers/import.controller';
import { upload } from '../middlewares/upload';

const router = Router();
const importController = new ImportController();

router.post('/employees', upload.single('file'), importController.importEmployees.bind(importController));

export default router;
