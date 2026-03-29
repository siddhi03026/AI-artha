const calculateFinancialHealthScore = ({ income = 0, goals = [], riskLevel = 'medium' }) => {
  let score = 50;

  if (income >= 200000) score += 20;
  else if (income >= 100000) score += 12;
  else if (income >= 50000) score += 6;

  score += Math.min(goals.length * 4, 16);

  if (riskLevel === 'medium') score += 10;
  if (riskLevel === 'low') score += 6;
  if (riskLevel === 'high') score += 8;

  return Math.max(0, Math.min(100, score));
};

const buildRecommendations = ({ income = 0, goals = [], riskLevel = 'medium' }) => {
  const recommendations = [];

  if (income < 60000) {
    recommendations.push({
      type: 'cashflow',
      content: 'Build a 3-month emergency fund before increasing high-risk exposure.',
    });
  } else {
    recommendations.push({
      type: 'investment',
      content: 'Automate monthly index investing to maintain discipline and compound gains.',
    });
  }

  if (goals.some((goal) => goal.toLowerCase().includes('home'))) {
    recommendations.push({
      type: 'goal',
      content: 'Create a dedicated home down-payment account with monthly auto-transfer.',
    });
  }

  if (riskLevel === 'high') {
    recommendations.push({
      type: 'risk',
      content: 'Cap speculative assets at 15% and rebalance quarterly to protect downside.',
    });
  } else if (riskLevel === 'low') {
    recommendations.push({
      type: 'risk',
      content: 'Use a conservative allocation: 60% debt or fixed income and 40% equities.',
    });
  } else {
    recommendations.push({
      type: 'risk',
      content: 'Keep a balanced allocation and review annually for life-goal alignment.',
    });
  }

  return recommendations;
};

const buildInsights = ({ income = 0, goals = [] }) => {
  return [
    `Income profile suggests ${income >= 100000 ? 'strong' : 'developing'} saving potential.`,
    `You currently have ${goals.length} active financial goal${goals.length === 1 ? '' : 's'}.`,
    'Consistency in monthly investing remains the top driver of long-term wealth creation.',
  ];
};

const runSimulation = ({ monthlyInvestment = 0, duration = 0, annualRate = 0.1 }) => {
  const principal = Number(monthlyInvestment);
  const years = Number(duration);

  const monthlyRate = annualRate / 12;
  const months = years * 12;

  if (principal <= 0 || years <= 0) {
    return {
      futureValue: 0,
      invested: 0,
      gain: 0,
    };
  }

  const futureValue = principal * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const invested = principal * months;

  return {
    futureValue: Number(futureValue.toFixed(2)),
    invested: Number(invested.toFixed(2)),
    gain: Number((futureValue - invested).toFixed(2)),
  };
};

module.exports = {
  calculateFinancialHealthScore,
  buildRecommendations,
  buildInsights,
  runSimulation,
};
