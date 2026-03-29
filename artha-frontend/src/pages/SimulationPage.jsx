import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

function SimulationPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [duration, setDuration] = useState(15);

  const principal = monthlyInvestment * 12 * duration;
  const rate = 0.12 / 12;
  const months = duration * 12;
  const futureValue = monthlyInvestment * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
  const gain = futureValue - principal;

  const chartPoints = Array.from({ length: duration + 1 }, (_, year) => {
    const m = year * 12;
    const invested = monthlyInvestment * m;
    const value = m === 0 ? 0 : monthlyInvestment * ((Math.pow(1 + rate, m) - 1) / rate) * (1 + rate);
    return {
      year,
      invested,
      value,
    };
  });

  const maxValue = Math.max(...chartPoints.map((p) => p.value), 1);

  const formatLakh = (value) => `₹${(value / 100000).toFixed(2)} L`;

  const linePath = chartPoints
    .map((point, index) => {
      const x = (index / (chartPoints.length - 1 || 1)) * 100;
      const y = 100 - (point.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  const investedPath = chartPoints
    .map((point, index) => {
      const x = (index / (chartPoints.length - 1 || 1)) * 100;
      const y = 100 - (point.invested / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Future Simulator</h1>
      <p className="mt-1 text-base text-slate-500 sm:text-lg">See how your money grows with the power of compounding.</p>

      <section className="soft-card mt-8 p-6">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900 sm:text-xl">Monthly Investment</h2>
            <span className="text-lg font-semibold text-violet-500 sm:text-xl">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={monthlyInvestment}
            onChange={(event) => setMonthlyInvestment(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-violet-500"
          />
          <div className="mt-2 flex justify-between text-sm text-slate-500">
            <span>₹1,000</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900 sm:text-xl">Investment Duration</h2>
            <span className="text-lg font-semibold text-violet-500 sm:text-xl">{duration} years</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-violet-500"
          />
          <div className="mt-2 flex justify-between text-sm text-slate-500">
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="soft-card p-6 text-center">
          <TrendingUp size={22} className="mx-auto text-violet-500" />
          <p className="mt-2 text-base text-slate-500">Future Value</p>
          <p className="mt-2 text-2xl font-bold text-violet-500 sm:text-3xl">{formatLakh(futureValue)}</p>
        </div>
        <div className="soft-card p-6 text-center">
          <p className="text-base text-slate-500">₹</p>
          <p className="mt-2 text-base text-slate-500">Total Invested</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{formatLakh(principal)}</p>
        </div>
        <div className="soft-card p-6 text-center">
          <TrendingUp size={22} className="mx-auto text-emerald-500" />
          <p className="mt-2 text-base text-slate-500">Wealth Gained</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600 sm:text-3xl">{formatLakh(gain)}</p>
        </div>
      </section>

      <section className="soft-card mt-6 p-6">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Growth Over Time</h2>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-[#fbfcff] p-4">
          <svg viewBox="0 0 100 42" className="h-52 w-full sm:h-64">
            <defs>
              <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#d8e0ec" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="36" fill="url(#grid)" />
            <polyline fill="none" stroke="#233282" strokeWidth="0.7" points={investedPath} />
            <polyline fill="none" stroke="#7c3aed" strokeWidth="0.9" points={linePath} />
          </svg>

          <div className="mt-2 flex justify-between text-sm text-slate-500">
            {chartPoints.map((point) => (
              <span key={point.year}>{point.year === 0 ? 'Yr 0' : `Yr ${point.year}`}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SimulationPage;
