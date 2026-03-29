const User = require('../models/User');
const { getChatCompletion } = require('../services/aiAgentService');

const DEFAULT_USER_ID = 'demo-user-123';

const buildFallbackPlan = (user) => {
  const income = user?.income || 0;
  const riskLevel = user?.riskLevel || 'medium';
  const goals = Array.isArray(user?.goals) ? user.goals : [];

  const steps = [
    'Set up automated monthly savings on salary day.',
    'Track fixed and variable spending weekly for visibility.',
    'Build and maintain an emergency fund covering 3 to 6 months.',
  ];

  if (income >= 100000) {
    steps.push('Increase long-term index fund allocation gradually each quarter.');
  } else {
    steps.push('Prioritize debt reduction and emergency reserves before high-risk investing.');
  }

  if (riskLevel === 'high') {
    steps.push('Limit speculative assets to a small cap and rebalance monthly.');
  } else if (riskLevel === 'low') {
    steps.push('Prefer conservative allocations with higher fixed-income exposure.');
  } else {
    steps.push('Maintain balanced allocation and review yearly against goals.');
  }

  if (goals.length) {
    steps.push(`Create goal buckets for: ${goals.join(', ')}.`);
  }

  return steps.slice(0, 6);
};

const getAIActionPlan = async (_req, res) => {
  try {
    let user = await User.findOne({ userId: DEFAULT_USER_ID });

    if (!user) {
      user = await User.create({ userId: DEFAULT_USER_ID });
    }

    let source = 'fallback';
    let plan = buildFallbackPlan(user);

    try {
      const prompt = [
        'Create a concise 6-step personal finance action plan for the user.',
        'Use beginner-friendly language, one sentence per step.',
        'Return only numbered steps without extra headers.',
      ].join(' ');

      const aiText = await getChatCompletion({
        message: prompt,
        history: [],
        userProfile: user,
      });

      const parsedSteps = aiText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^\d+[.)]\s*/, ''))
        .slice(0, 6);

      if (parsedSteps.length >= 3) {
        plan = parsedSteps;
        source = 'ai';
      }
    } catch (_error) {
      source = 'fallback';
    }

    return res.status(200).json({
      source,
      plan,
      userId: DEFAULT_USER_ID,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to generate AI action plan',
      error: error.message,
    });
  }
};

module.exports = {
  getAIActionPlan,
};
