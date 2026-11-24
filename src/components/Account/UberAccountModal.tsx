import React from 'react';
import {
  X,
  User,
  Car,
  ShieldCheck,
  Clock,
  Plane,
  Settings,
  MessageSquare,
  Sun,
  Moon,
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  Globe,
  Coins,
  UserPlus,
} from 'lucide-react';
import {
  CustomerUser,
  Language,
  CurrencyMode,
  PRIMARY_SAFETY_CONTACT,
} from '../../types';

interface UberAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: 'rider' | 'driver' | 'admin';
  onSelectRole: (role: 'rider' | 'driver' | 'admin') => void;
  isAdminAuthenticated?: boolean;
  customerUser?: CustomerUser | null;
  onOpenCustomerAuth?: () => void;
  onOpenDriverWizard?: () => void;
  currency: CurrencyMode;
  onSelectCurrency?: (curr: CurrencyMode) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  theme: 'dark' | 'light';
  onToggleTheme?: () => void;
  pastTripsCount?: number;
  onOpenTripHistory?: () => void;
  onOpenFlightTracker?: () => void;
  onOpenAdviceModal?: () => void;
  onOpenSettings: () => void;
  onOpenSmsDrawer: () => void;
  unreadSmsCount: number;
}

export const UberAccountModal: React.FC<UberAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  customerUser,
  onOpenCustomerAuth,
  onOpenDriverWizard,
  currency,
  onSelectCurrency,
  language,
  onSelectLanguage,
  theme,
  onToggleTheme,
  pastTripsCount = 0,
  onOpenTripHistory,
  onOpenFlightTracker,
  onOpenAdviceModal,
  onOpenSettings,
  onOpenSmsDrawer,
  unreadSmsCount,
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const userName = customerUser?.name || 'Guest Rider';
  const userPhone = customerUser?.phone || '+94 77 982 1092';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-900'
            : 'bg-slate-950 border-slate-800 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <h2 className="text-base font-bold font-heading">Account</h2>
          <button
            type="button"
            onClick={onClose}
            className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg transition-colors ${
              isLight
                ? 'hover:bg-slate-100 text-slate-600'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
            aria-label="Close account modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* 1. Customer Profile Row */}
          <div
            className={`p-4 rounded-xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={customerUser?.avatar || '/naspick_logo.png'}
                  alt={userName}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-slate-700 bg-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{userName}</p>
                  <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {userPhone} · ★ 4.98
                  </p>
                </div>
              </div>

              {onOpenCustomerAuth && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCustomerAuth();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shrink-0"
                >
                  {customerUser?.isLoggedIn ? 'Profile' : 'Sign In'}
                </button>
              )}
            </div>

            <div
              className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${
                isLight ? 'border-slate-100 text-slate-600' : 'border-slate-800 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Safety Contact: {PRIMARY_SAFETY_CONTACT}</span>
              </span>
              <span className="text-emerald-500 font-medium">119 SOS Ready</span>
            </div>
          </div>

          {/* 2. Customer Actions */}
          <div
            className={`rounded-xl border divide-y overflow-hidden ${
              isLight
                ? 'bg-white border-slate-200 divide-slate-100'
                : 'bg-slate-900 border-slate-800 divide-slate-800'
            }`}
          >
            {onOpenTripHistory && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTripHistory();
                }}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold">My Trips & e-Receipts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 tabular-nums">
                  {pastTripsCount > 0 && <span>{pastTripsCount}</span>}
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            )}

            {onOpenFlightTracker && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFlightTracker();
                }}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-semibold">Airport (CMB) Flight Tracker</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSmsDrawer();
              }}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold">SMS Alerts & Receipts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 tabular-nums">
                {unreadSmsCount > 0 && <span>{unreadSmsCount}</span>}
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold">App & Sound Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* 3. Language, Currency & Theme */}
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Preferences
            </p>
            <div
              className={`rounded-xl border divide-y ${
                isLight
                  ? 'bg-white border-slate-200 divide-slate-100'
                  : 'bg-slate-900 border-slate-800 divide-slate-800'
              }`}
            >
              {onSelectCurrency && (
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold">Currency</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['LKR', 'USD', 'EUR'] as CurrencyMode[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onSelectCurrency(c)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                          currency === c
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : isLight
                              ? 'text-slate-600 hover:bg-slate-100'
                              : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold">Language</span>
                </div>
                <div className="flex items-center gap-1">
                  {[
                    { code: 'en', label: 'EN' },
                    { code: 'si', label: 'සිංහල' },
                    { code: 'ta', label: 'தமிழ்' },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => onSelectLanguage(item.code as Language)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                        language === item.code
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : isLight
                            ? 'text-slate-600 hover:bg-slate-100'
                            : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {onToggleTheme && (
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {isLight ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs font-semibold">Appearance</span>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isLight ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. Separated Management & Partner Portals (Quiet Footer) */}
          <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'} space-y-2.5`}>
            <p className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Management & Driver Portals
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="account-open-admin-btn"
                onClick={() => {
                  onClose();
                  onSelectRole('admin');
                }}
                className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Admin Panel</span>
                  <span className="text-[10px] text-slate-400 block">Fleet & Rates</span>
                </div>
              </button>

              <button
                type="button"
                id="account-open-driver-btn"
                onClick={() => {
                  onClose();
                  onSelectRole('driver');
                }}
                className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <Car className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Driver App</span>
                  <span className="text-[10px] text-slate-400 block">Partner Cockpit</span>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              {onOpenDriverWizard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDriverWizard();
                  }}
                  className="text-emerald-500 hover:underline font-medium flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register as a Driver</span>
                </button>
              )}

              {onOpenAdviceModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdviceModal();
                  }}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Guide</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
