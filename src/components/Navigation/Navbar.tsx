import React from 'react';
import { Sun, Moon, User } from 'lucide-react';
import { NaspickLogo } from '../Common/NaspickLogo';
import { CustomerUser } from '../../types';
import { UberNavTab } from './UberBottomNav';

interface NavbarProps {
  activeNavTab?: UberNavTab;
  onSelectNavTab?: (tab: UberNavTab) => void;
  customerUser?: CustomerUser | null;
  pastTripsCount?: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenAccountModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeNavTab = 'home',
  onSelectNavTab,
  customerUser,
  pastTripsCount = 0,
  theme = 'dark',
  onToggleTheme,
  onOpenAccountModal,
}) => {
  const isLight = theme === 'light';
  const firstName = customerUser?.isLoggedIn && customerUser.name
    ? customerUser.name.split(' ')[0]
    : null;

  const handleTab = (tab: UberNavTab) => {
    if (onSelectNavTab) {
      onSelectNavTab(tab);
    }
  };

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-colors backdrop-blur-md border-b ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-900'
          : 'bg-slate-950/95 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single clean element) */}
        <button
          type="button"
          onClick={() => handleTab('home')}
          className="flex items-center whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
          aria-label="Naspick Home"
        >
          <NaspickLogo size="sm" showSubtitle={false} />
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links (Desktop md+) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          <button
            type="button"
            id="nav-tab-home"
            onClick={() => handleTab('home')}
            className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
              activeNavTab === 'home'
                ? 'border-emerald-500 text-emerald-500 font-semibold'
                : isLight
                  ? 'border-transparent text-slate-600 hover:text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            id="nav-tab-services"
            onClick={() => handleTab('services')}
            className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
              activeNavTab === 'services'
                ? 'border-emerald-500 text-emerald-500 font-semibold'
                : isLight
                  ? 'border-transparent text-slate-600 hover:text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Services
          </button>

          <button
            type="button"
            id="nav-tab-activity"
            onClick={() => handleTab('activity')}
            className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeNavTab === 'activity'
                ? 'border-emerald-500 text-emerald-500 font-semibold'
                : isLight
                  ? 'border-transparent text-slate-600 hover:text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>Activity</span>
            {pastTripsCount > 0 && (
              <span className="text-xs text-slate-500 tabular-nums">({pastTripsCount})</span>
            )}
          </button>
        </nav>

        {/* Zone 3: Theme Toggle + Primary Account Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onToggleTheme && (
            <button
              type="button"
              id="header-theme-toggle-btn"
              onClick={onToggleTheme}
              className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            type="button"
            id="header-account-profile-btn"
            onClick={() => (onOpenAccountModal ? onOpenAccountModal() : handleTab('account'))}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'
            }`}
            title="Account & Settings"
          >
            {firstName ? (
              <>
                <img
                  src={customerUser?.avatar || '/naspick_logo.png'}
                  alt={firstName}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover bg-slate-800"
                />
                <span>{firstName}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
