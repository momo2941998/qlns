import express from 'express';
import { rankingController } from '../controllers/ranking.controller';
import { verifyChecksumMiddleware } from '../middlewares/verifyChecksum.middleware';

const router = express.Router();

// POST /api/ranking - Submit score (protected with checksum verification)
router.post('/', verifyChecksumMiddleware, rankingController.submitScore);

// GET /api/ranking - Get rankings (public, no checksum required)
router.get('/', rankingController.getRankings);

export default router;
