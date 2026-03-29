import { motion } from 'framer-motion';
import { MessageSquare, LayoutGrid, TrendingUp, Brain, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const features = [
    {
      title: 'AI Concierge',
      text: 'Chat with your personal financial advisor. Get answers, not jargon.',
      icon: MessageSquare,
    },
    {
      title: 'Financial Dashboard',
      text: 'See your financial health at a glance with smart insights.',
      icon: LayoutGrid,
    },
    {
      title: 'Future Simulator',
      text: 'Visualize how your investments grow over time.',
      icon: TrendingUp,
    },
    {
      title: 'Money Personality',
      text: 'Discover your financial personality type and get tailored tips.',
      icon: Brain,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-[1540px] px-4 py-6 sm:px-6 sm:py-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[28px] border border-slate-200 bg-[#f5f7fb] px-4 py-10 text-center sm:px-8 sm:py-12"
      >
        <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-500">
          <Sparkles size={14} />
          Powered by AI
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-[1.15] text-slate-900 sm:text-4xl md:text-5xl">
          Your Calm, Smart
          <span className="ml-3 bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">
            Money Companion
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-500 sm:text-lg md:text-xl">
          Artha AI helps you understand, plan, and grow your finances - with the warmth of a friend and the precision of an expert.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/chat" className="inline-flex items-center rounded-2xl bg-gradient-to-r from-violet-600 to-violet-400 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-200">
            Start Chatting
            <span className="ml-3">→</span>
          </Link>
          <Link to="/dashboard" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-900">
            View Dashboard
          </Link>
        </div>
      </motion.section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map((item) => (
          <motion.div key={item.title} whileHover={{ y: -4 }} className="soft-card p-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/90 text-white">
              <item.icon size={20} />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">{item.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="mt-8 rounded-[34px] border border-violet-200 bg-violet-50 px-5 py-10 text-center text-slate-900 sm:px-8 sm:py-14">
        <Shield size={48} className="mx-auto text-violet-600" />
        <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">Your data stays yours</h2>
        <p className="mx-auto mt-4 max-w-4xl text-base leading-relaxed text-slate-600 sm:text-lg">
          We never sell your information. Artha AI is designed with privacy-first principles, giving you peace of mind while you plan your future.
        </p>
      </section>
    </main>
  );
}

export default LandingPage;
