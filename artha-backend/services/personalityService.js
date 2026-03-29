const detectPersonality = ({ income = 0, goals = [], riskLevel = 'medium' }) => {
  const normalizedGoals = goals.map((goal) => goal.toLowerCase());

  if (riskLevel === 'high' && normalizedGoals.some((goal) => goal.includes('wealth') || goal.includes('growth'))) {
    return {
      type: 'Growth Seeker',
      explanation: 'You are comfortable taking calculated risks for higher long-term returns.',
    };
  }

  if (riskLevel === 'low' || normalizedGoals.some((goal) => goal.includes('security') || goal.includes('emergency'))) {
    return {
      type: 'Safety Planner',
      explanation: 'You value stability and prefer predictable financial progress with lower volatility.',
    };
  }

  if (income > 150000 && normalizedGoals.some((goal) => goal.includes('retire') || goal.includes('legacy'))) {
    return {
      type: 'Legacy Architect',
      explanation: 'You focus on long-term wealth structuring, retirement confidence, and future generations.',
    };
  }

  return {
    type: 'Balanced Builder',
    explanation: 'You seek steady growth while keeping risk and safety in healthy balance.',
  };
};

module.exports = {
  detectPersonality,
};
