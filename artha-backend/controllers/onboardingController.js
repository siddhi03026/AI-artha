const User = require('../models/User');
const { detectPersonality } = require('../services/personalityService');

const DEFAULT_USER_ID = 'demo-user-123';

const saveOnboarding = async (req, res) => {
  try {
    const { name, income, goals, riskLevel } = req.body;

    const personality = detectPersonality({ income, goals, riskLevel });

    const user = await User.findOneAndUpdate(
      { userId: DEFAULT_USER_ID },
      {
        userId: DEFAULT_USER_ID,
        name: name || 'Demo User',
        income: Number(income) || 0,
        goals: Array.isArray(goals) ? goals : [],
        riskLevel: riskLevel || 'medium',
        personalityType: personality.type,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: 'Onboarding saved successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to save onboarding data',
      error: error.message,
    });
  }
};

module.exports = {
  saveOnboarding,
};
