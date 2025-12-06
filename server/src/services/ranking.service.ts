import RankingScore, { IRankingScore } from '../models/RankingScore';

export const rankingService = {
  // Submit a new ranking score
  async submitScore(data: {
    playerName: string;
    score: number;
    totalQuestions: number;
    timeInSeconds: number;
    mode: 'face-to-name' | 'name-to-face';
  }): Promise<IRankingScore> {
    const percentage = Math.round((data.score / data.totalQuestions) * 100);

    const rankingScore = new RankingScore({
      ...data,
      percentage,
    });

    return await rankingScore.save();
  },

  // Get top rankings
  async getTopRankings(
    mode?: 'face-to-name' | 'name-to-face',
    limit: number = 50
  ): Promise<IRankingScore[]> {
    const query = mode ? { mode } : {};

    return await RankingScore.find(query)
      .sort({ score: -1, percentage: -1, timeInSeconds: 1 }) // Priority: Score > Percentage > Time (faster)
      .limit(limit)
      .select('-__v')
      .exec();
  },

  // Get rankings with pagination
  async getRankingsWithPagination(
    mode?: 'face-to-name' | 'name-to-face',
    page: number = 1,
    limit: number = 20
  ) {
    const query = mode ? { mode } : {};
    const skip = (page - 1) * limit;

    const [rankings, total] = await Promise.all([
      RankingScore.find(query)
        .sort({ score: -1, percentage: -1, timeInSeconds: 1 }) // Priority: Score > Percentage > Time (faster)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .exec(),
      RankingScore.countDocuments(query),
    ]);

    return {
      rankings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};
