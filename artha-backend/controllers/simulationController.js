const { runSimulation } = require('../services/financeService');

const runFutureSimulation = async (req, res) => {
  try {
    const { monthlyInvestment, duration } = req.body;

    if (!monthlyInvestment || !duration) {
      return res.status(400).json({
        message: 'monthlyInvestment and duration are required',
      });
    }

    const result = runSimulation({ monthlyInvestment, duration, annualRate: 0.1 });

    return res.status(200).json({
      monthlyInvestment: Number(monthlyInvestment),
      duration: Number(duration),
      annualRate: 10,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to run simulation',
      error: error.message,
    });
  }
};

module.exports = {
  runFutureSimulation,
};
