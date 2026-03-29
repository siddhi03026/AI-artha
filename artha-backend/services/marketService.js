const axios = require('axios');

const fetchTickerTrend = async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
  const response = await axios.get(url, { timeout: 8000 });

  const result = response.data?.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const closes = result?.indicators?.quote?.[0]?.close?.filter((value) => value !== null) || [];

  if (!timestamps.length || !closes.length) {
    return null;
  }

  const latest = closes[closes.length - 1];
  const previous = closes[0];
  const change = latest - previous;
  const changePercent = previous ? (change / previous) * 100 : 0;

  return {
    symbol,
    latest: Number(latest.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    trend: closes,
  };
};

const getMarketSnapshot = async () => {
  try {
    const [sp500, nasdaq] = await Promise.all([
      fetchTickerTrend('^GSPC'),
      fetchTickerTrend('^IXIC'),
    ]);

    return {
      stocks: [sp500, nasdaq].filter(Boolean),
    };
  } catch (error) {
    return {
      stocks: [],
      error: 'Market feed unavailable right now.',
    };
  }
};

module.exports = {
  getMarketSnapshot,
};
