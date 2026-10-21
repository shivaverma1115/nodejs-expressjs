import multer from 'multer';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/httpStatus';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!allowed.has(file.mimetype)) {
      cb(new AppError('Only jpeg, png, webp, and gif images are allowed', HttpStatus.BAD_REQUEST));
      return;
    }
    cb(null, true);
  },
}).single('file');
