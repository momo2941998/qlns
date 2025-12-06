import { Request, Response } from 'express';
import { rankingService } from '../services/ranking.service';

export const rankingController = {
  // POST /api/ranking - Submit a new score
  async submitScore(req: Request, res: Response) {
    try {
      const { playerName, score, totalQuestions, timeInSeconds, mode } = req.body;

      // Validation
      if (!playerName || playerName.trim() === '') {
        return res.status(400).json({ message: 'Tên người chơi không được để trống' });
      }

      if (typeof score !== 'number' || typeof totalQuestions !== 'number') {
        return res.status(400).json({ message: 'Điểm và tổng số câu hỏi phải là số' });
      }

      if (score < 0 || score > totalQuestions) {
        return res.status(400).json({ message: 'Điểm không hợp lệ' });
      }

      if (typeof timeInSeconds !== 'number' || timeInSeconds <= 0) {
        return res.status(400).json({ message: 'Thời gian không hợp lệ' });
      }

      if (!['face-to-name', 'name-to-face'].includes(mode)) {
        return res.status(400).json({ message: 'Chế độ chơi không hợp lệ' });
      }

      const rankingScore = await rankingService.submitScore({
        playerName: playerName.trim(),
        score,
        totalQuestions,
        timeInSeconds,
        mode,
      });

      res.status(201).json({
        message: 'Ghi nhận kết quả thành công',
        data: rankingScore,
      });
    } catch (error) {
      console.error('Error submitting score:', error);
      res.status(500).json({ message: 'Lỗi khi ghi nhận kết quả' });
    }
  },

  // GET /api/ranking - Get rankings
  async getRankings(req: Request, res: Response) {
    try {
      const mode = req.query.mode as 'face-to-name' | 'name-to-face' | undefined;
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string);

      if (page) {
        // Paginated
        const result = await rankingService.getRankingsWithPagination(mode, page, limit);
        res.json(result);
      } else {
        // Top N
        const rankings = await rankingService.getTopRankings(mode, limit);
        res.json({ data: rankings });
      }
    } catch (error) {
      console.error('Error getting rankings:', error);
      res.status(500).json({ message: 'Lỗi khi lấy bảng xếp hạng' });
    }
  },
};
