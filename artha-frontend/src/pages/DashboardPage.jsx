import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Lightbulb, Target, CreditCard, Shield, Wallet, PiggyBank } from 'lucide-react';
import { fetchServices, trackServiceInteraction } from '../services/api';

const healthScore = 72;

const insights = [
  { icon: Lightbulb, title: 'Spending Alert', text: 'Your dining expenses increased 23% this month. Consider meal prepping to save Rs 3,000/month.', color: 'text-amber-500' },
  { icon: Target, title: 'Goal Progress', text: "You're 68% towards your emergency fund goal. Keep going - 4 months left!", color: 'text-emerald-500' },
  { icon: TrendingUp, title: 'Investment Tip', text: 'Your SIP returns are 14.2% CAGR. Consider increasing SIP by Rs 2,000 to maximize compounding.', color: 'text-accent' },
];

const summary = [
  { label: 'Monthly Income', value: 'Rs 75,000', icon: Wallet, change: '+5%' },
  { label: 'Savings Rate', value: '22%', icon: PiggyBank, change: '+3%' },
  { label: 'Total Invested', value: 'Rs 4,50,000', icon: TrendingUp, change: '+12%' },
  { label: 'Debt Remaining', value: 'Rs 1,20,000', icon: TrendingDown, change: '-8%' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const categoryIconMap = {
  loan: CreditCard,
  insurance: Shield,
  creditCard: CreditCard,
  mutualFund: TrendingUp,
};

const categoryOrder = ['loans', 'insurance', 'creditCards', 'mutualFunds'];

const fallbackServices = [
  {
    serviceId: 'loan-smart-personal',
    category: 'loan',
    name: 'Smart Personal Loan',
    suitability: 'Low-interest rates from 8.5% p.a.',
    details: 'Fast approval, flexible tenures, and low processing fee.',
    ctaLabel: 'Explore',
    highlight: '8.5% - 12.5% APR',
  },
  {
    serviceId: 'insurance-health-shield',
    category: 'insurance',
    name: 'Health Shield Plus',
    suitability: 'Coverage starting at Rs 500/month',
    details: 'Cashless support with family floater and add-ons.',
    ctaLabel: 'Compare',
    highlight: 'INR 10L - INR 50L',
  },
  {
    serviceId: 'creditcard-artha-rewards',
    category: 'creditCard',
    name: 'Artha Rewards Card',
    suitability: 'Cashback and reward cards tailored for you',
    details: 'Up to 5% cashback on essentials and bill payments.',
    ctaLabel: 'Apply',
    highlight: '5% on essentials',
  },
  {
    serviceId: 'mf-goal-sip',
    category: 'mutualFund',
    name: 'Goal SIP Plan',
    suitability: 'Curated SIP plans for your goals',
    details: 'Diversified fund baskets aligned with your risk profile.',
    ctaLabel: 'Invest',
    highlight: '11% - 14% CAGR',
  },
];

export default function DashboardPage() {
  const [services, setServices] = useState(fallbackServices);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceStatus, setServiceStatus] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await fetchServices();
        const flattened = categoryOrder.flatMap((bucket) => data?.[bucket] || []);
        if (flattened.length) {
          setServices(flattened);
        }
      } catch (_error) {
        setServices(fallbackServices);
      }
    };

    loadServices();
  }, []);

  const enrichedServices = useMemo(() => {
    return services.map((service) => {
      const icon = categoryIconMap[service.category] || CreditCard;
      return {
        ...service,
        icon,
      };
    });
  }, [services]);

  const handleServiceClick = async (service) => {
    setSelectedService(service);
    setServiceStatus('Saving your interest...');

    try {
      await trackServiceInteraction({ serviceId: service.serviceId, action: 'explore' });
      setServiceStatus('Saved. Our advisor can now prioritize this in your recommendations.');
    } catch (_error) {
      setServiceStatus('Selection opened, but activity could not be saved right now.');
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1540px] space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Financial Dashboard</h1>
        <p className="mt-1 text-base text-slate-500 sm:text-lg">Your money, at a glance.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="soft-card rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Financial Health Score</h2>
            <p className="text-sm text-slate-500 sm:text-base">Based on savings, debt, and spending habits</p>
          </div>
          <span className="text-2xl font-bold text-violet-500 sm:text-3xl">{healthScore}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="accent-gradient h-full rounded-full"
          />
        </div>
        <div className="mt-2 flex justify-between text-sm text-slate-500">
          <span>Needs work</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <motion.div key={s.label} variants={item} className="soft-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-slate-500">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{s.value}</p>
            <span className={`text-sm font-semibold ${s.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {s.change} vs last month
            </span>
          </motion.div>
        ))}
      </motion.div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-900 sm:text-2xl">Smart Insights</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {insights.map((ins) => (
            <motion.div key={ins.title} variants={item} className="soft-card flex items-start gap-4 rounded-2xl p-5">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 ${ins.color}`}>
                <ins.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{ins.title}</h3>
                <p className="mt-1 text-sm text-slate-500 sm:text-base">{ins.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-900 sm:text-2xl">Services for You</h2>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {enrichedServices.map((s) => (
            <motion.div key={s.serviceId || s.name} variants={item} className="soft-card flex flex-col p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/85 text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{s.name}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-500 sm:text-base">{s.suitability}</p>
              {s.highlight ? <p className="mt-2 text-sm font-medium text-violet-600">{s.highlight}</p> : null}
              <button
                className="mt-4 text-sm font-medium text-violet-600 hover:underline text-left sm:text-base"
                type="button"
                onClick={() => handleServiceClick(s)}
              >
                {(s.ctaLabel || 'Explore')} →
              </button>
            </motion.div>
          ))}
        </motion.div>

        {selectedService ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="soft-card mt-5 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">Selected Service</p>
                <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{selectedService.name}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600">{selectedService.details || selectedService.suitability}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedService(null);
                  setServiceStatus('');
                }}
                className="rounded-xl border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            {serviceStatus ? <p className="mt-3 text-sm text-violet-600">{serviceStatus}</p> : null}
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}
