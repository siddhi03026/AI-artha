import { useMemo, useState } from 'react';
import { Heart, RotateCcw } from 'lucide-react';

function PersonalityPage() {
  const questions = useMemo(
    () => [
      {
        question: 'You receive an unexpected bonus. What do you do?',
        options: [
          'Invest it in stocks immediately',
          'Put it in a fixed deposit',
          'Treat yourself to something nice',
          'Split between savings and fun',
        ],
      },
      {
        question: 'When planning your monthly budget, you prefer to:',
        options: [
          'Track every rupee in detail',
          'Use broad % categories',
          'Keep it flexible and intuitive',
          'Use an app with reminders',
        ],
      },
      {
        question: 'Your ideal financial milestone is:',
        options: [
          'Aggressive wealth growth',
          'A safe emergency cushion',
          'Freedom to enjoy lifestyle',
          'Balanced peace of mind',
        ],
      },
    ],
    [],
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const onSelect = (option) => {
    const nextAnswers = [...answers, option];
    setAnswers(nextAnswers);
    setStep((prev) => prev + 1);
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
  };

  const done = step >= questions.length;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 text-center sm:px-6 sm:py-8">
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Money Personality</h1>
      <p className="mt-1 text-base text-slate-500 sm:text-lg">Discover your financial personality in 3 quick questions.</p>

      <section className="soft-card mx-auto mt-6 max-w-3xl p-5 text-left sm:mt-8 sm:p-7">
        {!done ? (
          <>
            <div className="mb-7">
              <div className="mb-2 flex items-center gap-3 text-sm font-semibold text-violet-500">
                <span>Question {step + 1} of {questions.length}</span>
                <div className="h-1 flex-1 rounded-full bg-slate-200">
                  <div className="h-1 rounded-full bg-violet-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{questions[step].question}</h2>

            <div className="mt-6 space-y-3">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelect(option)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-base font-medium text-slate-800 transition hover:border-violet-300 hover:bg-violet-50 sm:px-5 sm:py-4 sm:text-lg"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-500 text-white">
              <Heart size={38} />
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">The Emotional Spender</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              You have a rich relationship with money tied to feelings. Shopping therapy is real for you, and financial decisions often come from the heart.
            </p>

            <div className="mx-auto mt-7 max-w-xl text-left">
              <h3 className="text-xl font-semibold text-slate-900">Tips for You</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-slate-500 marker:text-violet-400">
                <li>Try a 24-hour rule before big purchases</li>
                <li>Automate your savings so emotions don't interfere</li>
                <li>Create a 'fun money' budget to spend guilt-free</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-base font-semibold text-slate-700"
            >
              <RotateCcw size={16} />
              Take Again
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default PersonalityPage;
