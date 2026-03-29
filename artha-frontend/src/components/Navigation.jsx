import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, MessageSquare, LayoutGrid, TrendingUp, UserRound, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', to: '/', icon: Sparkles },
  { label: 'AI Concierge', to: '/chat', icon: MessageSquare },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
  { label: 'Simulator', to: '/simulation', icon: TrendingUp },
  { label: 'Personality', to: '/personality', icon: UserRound },
];

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1540px] items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-400 text-white">
            <Sparkles size={16} />
          </span>
          <p className="text-xl font-semibold leading-none text-slate-800 sm:text-2xl">Artha AI</p>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'primary-pill shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'primary-pill shadow-sm'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <item.icon size={14} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default Navigation;
