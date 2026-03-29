const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const {
  calculateFinancialHealthScore,
  buildRecommendations,
  buildInsights,
} = require('../services/financeService');
const { getMarketSnapshot } = require('../services/marketService');

const DEFAULT_USER_ID = 'demo-user-123';

const getDashboardData = async (req, res) => {
  try {
    const user =
      (await User.findOne({ userId: DEFAULT_USER_ID })) ||
      (await User.create({ userId: DEFAULT_USER_ID }));

    const score = calculateFinancialHealthScore(user);
    const insights = buildInsights(user);
    const generatedRecommendations = buildRecommendations(user);

    await Recommendation.deleteMany({ userId: DEFAULT_USER_ID });
    if (generatedRecommendations.length) {
      await Recommendation.insertMany(
        generatedRecommendations.map((item) => ({
          userId: DEFAULT_USER_ID,
          type: item.type,
          content: item.content,
        }))
      );
    }

    const recommendations = await Recommendation.find({ userId: DEFAULT_USER_ID })
      .sort({ createdAt: -1 })
      .lean();

    const market = await getMarketSnapshot();

    return res.status(200).json({
      financialHealthScore: score,
      insights,
      recommendations,
      market,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};
