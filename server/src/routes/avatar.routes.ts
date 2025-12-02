import express from 'express';
import { AvatarController } from '../controllers/avatar.controller';

const router = express.Router();
const avatarController = new AvatarController();

// Upload avatar (nhận base64 từ client đã crop)
router.post('/upload', (req, res) => avatarController.uploadAvatar(req, res));

// Xóa avatar
router.delete('/:employeeId', (req, res) => avatarController.deleteAvatar(req, res));

export default router;
