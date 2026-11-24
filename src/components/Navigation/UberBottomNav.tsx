import React from 'react';
import { Home, LayoutGrid, Clock, User } from 'lucide-react';

export type UberNavTab = 'home' | 'services' | 'activity' | 'account';

interface UberBottomNavProps {
  activeTab: UberNavTab;
  onSelectTab: (tab: UberNavTab) => void;
  pastTripsCount?: number;
  unreadSmsCount?: number;
  theme?: 'dark' | 'light';
}

export const UberBottomNav: React.FC<UberBottomNavProps> = ({
  activeTab,
  onSelectTab,
  pastTripsCount = 0,
  unreadSmsCount = 0,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  const items: { id: UberNavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: LayoutGrid },
    { id: 'activity', label: 'Activity', icon: Clock, badge: pastTripsCount > 0 ? pastTripsCount : undefined },
    { id: 'account', label: 'Account', icon: User, badge: unreadSmsCount > 0 ? unreadSmsCount : undefined },
  ];

  return (
    <nav
      aria-label="Customer Bottom Navigation"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md transition-colors ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-700'
          : 'bg-slate-950/95 border-slate-800 text-slate-200'
      } px-2 py-1 pb-[max(0.35rem,env(safe-area-inset-bottom))]`}
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`uber-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors relative ${
                isActive
                  ? isLight
                    ? 'text-emerald-700 font-semibold'
                    : 'text-emerald-400 font-semibold'
                  : isLight
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold tabular-nums">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-none whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
