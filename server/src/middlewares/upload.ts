import multer from 'multer';
import path from 'path';

// Disk storage for avatar uploads
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/avatar/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Memory storage for Excel imports
const memoryStorage = multer.memoryStorage();

const excelFileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed'));
  }
};

// For Excel imports - use memory storage
export const uploadExcel = multer({
  storage: memoryStorage,
  fileFilter: excelFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// For avatar uploads - use disk storage (kept for backward compatibility)
export const upload = multer({
  storage: diskStorage,
  fileFilter: excelFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
