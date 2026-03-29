const User = require('../models/User');
const { detectPersonality } = require('../services/personalityService');

const DEFAULT_USER_ID = 'demo-user-123';

const getPersonalityProfile = async (_req, res) => {
  try {
    let user = await User.findOne({ userId: DEFAULT_USER_ID });

    if (!user) {
      user = await User.create({ userId: DEFAULT_USER_ID });
    }

    const personality = detectPersonality(user);

    user.personalityType = personality.type;
    await user.save();

    return res.status(200).json({
      personalityType: personality.type,
      explanation: personality.explanation,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch personality profile',
      error: error.message,
    });
  }
};

module.exports = {
  getPersonalityProfile,
};
