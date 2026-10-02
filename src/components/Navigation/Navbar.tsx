import React from 'react';
import { 
  User, 
  Car, 
  ShieldCheck, 
  Smartphone, 
  Tablet,
  Monitor, 
  MessageSquare, 
  Settings,
  Download,
  Lock,
  Navigation,
  Sparkles,
  History,
  HelpCircle,
  UserPlus,
  Plane
} from 'lucide-react';
import { NaspickLogo } from '../Common/NaspickLogo';
import { LanguageSwitcher } from '../Common/LanguageSwitcher';
import { PWAInstallButton } from '../Common/PWAInstallButton';
import { Language, DeviceViewMode, CustomerUser, CurrencyMode } from '../../types';

interface NavbarProps {
  currentRole: 'rider' | 'driver' | 'admin';
  onSelectRole: (role: 'rider' | 'driver' | 'admin') => void;
  isAdminAuthenticated?: boolean;
  deviceViewMode: DeviceViewMode;
  onSelectDeviceViewMode: (mode: DeviceViewMode) => void;
  onOpenSettings: () => void;
  onOpenSmsDrawer: () => void;
  unreadSmsCount: number;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  customerUser?: CustomerUser | null;
  onOpenCustomerAuth?: () => void;
  onOpenTripHistory?: () => void;
  pastTripsCount?: number;
  onOpenAdviceModal?: () => void;
  onOpenDriverWizard?: () => void;
  currency?: CurrencyMode;
  onSelectCurrency?: (curr: CurrencyMode) => void;
  onOpenFlightTracker?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  isAdminAuthenticated = false,
  deviceViewMode,
  onSelectDeviceViewMode,
  onOpenSettings,
  onOpenSmsDrawer,
  unreadSmsCount,
  language,
  onSelectLanguage,
  customerUser,
  onOpenCustomerAuth,
  onOpenTripHistory,
  pastTripsCount = 0,
  onOpenAdviceModal,
  onOpenDriverWizard,
  currency = 'LKR',
  onSelectCurrency,
  onOpenFlightTracker,
}) => {
  return (
    <header className="w-full bg-slate-950/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-2.5 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Mobile Live Status */}
        <div className="flex items-center gap-2">
          <div 
            onClick={() => onSelectRole('rider')} 
            className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 cursor-pointer py-0.5"
            title="Return to Naspick Home"
          >
            <NaspickLogo size="md" />
          </div>

          {/* Quick Active Role Badge on Small Screens (< md) */}
          <div className="flex md:hidden items-center gap-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-slate-900 border border-slate-800 flex items-center gap-1">
              {currentRole === 'rider' && (
                <>
                  <User className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Rider</span>
                </>
              )}
              {currentRole === 'driver' && (
                <>
                  <Car className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Driver</span>
                </>
              )}
              {currentRole === 'admin' && (
                <>
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 font-bold">Admin</span>
                </>
              )}
            </span>

            {onOpenDriverWizard && (
              <button
                type="button"
                onClick={onOpenDriverWizard}
                className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold flex items-center gap-1"
                title="Drive with Naspick - Register Driver Partner"
              >
                <UserPlus className="w-3 h-3" />
                <span>Drive</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Role Switcher (Visible on md+ screens) */}
        <div className="hidden md:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
          <button
            id="role-btn-rider"
            onClick={() => onSelectRole('rider')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              currentRole === 'rider'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Rider</span>
          </button>

          <button
            id="role-btn-driver"
            onClick={() => onSelectRole('driver')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              currentRole === 'driver'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Driver Partner</span>
          </button>

          <button
            id="role-btn-admin"
            onClick={() => onSelectRole('admin')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              currentRole === 'admin'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title={isAdminAuthenticated ? 'Admin Control (Unlocked)' : 'Admin Control (Password Protected)'}
          >
            {isAdminAuthenticated ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Admin Control</span>
            {!isAdminAuthenticated && (
              <span className="hidden lg:inline px-1 py-0.2 bg-slate-800 text-amber-300 text-[9px] rounded font-mono">
                PIN
              </span>
            )}
          </button>

          {/* App Separation & 4-Service Operation Advice Helper */}
          {onOpenAdviceModal && (
            <button
              id="role-advice-btn"
              type="button"
              onClick={onOpenAdviceModal}
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1 ml-0.5 sm:ml-1 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded-lg text-xs font-bold transition-all min-h-[36px]"
              title="Driver & Passenger Separation & Multi-Service Advice"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Guide</span>
            </button>
          )}

          {/* Driver Partner Self-Service Registration Wizard */}
          {onOpenDriverWizard && (
            <button
              id="nav-join-driver-btn"
              type="button"
              onClick={onOpenDriverWizard}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 ml-0.5 sm:ml-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all min-h-[36px]"
              title="Drive with Naspick - Register Driver Partner"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Drive with Us</span>
            </button>
          )}
        </div>

        {/* Device Viewport Selector (Available on all screens: full pill on sm+, compact toggle on mobile) */}
        <div className="flex items-center gap-1">
          {/* Full 3-mode pill on sm+ */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
            <button
              id="quick-view-web"
              onClick={() => onSelectDeviceViewMode('web')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                deviceViewMode === 'web'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Web Responsive Fluid View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Web</span>
            </button>

            <button
              id="quick-view-tablet"
              onClick={() => onSelectDeviceViewMode('tablet')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                deviceViewMode === 'tablet'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet / iPad Mode"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tab</span>
            </button>

            <button
              id="quick-view-mobile"
              onClick={() => onSelectDeviceViewMode('mobile')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                deviceViewMode === 'mobile'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Smartphone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Quick cycle button on small mobile (< sm) */}
          <button
            onClick={() => {
              const nextMode = deviceViewMode === 'web' ? 'mobile' : deviceViewMode === 'mobile' ? 'tablet' : 'web';
              onSelectDeviceViewMode(nextMode);
            }}
            className="sm:hidden flex items-center gap-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300"
            title={`Active view: ${deviceViewMode}. Tap to switch between Web, Mobile, and Tablet`}
          >
            {deviceViewMode === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-emerald-400" />}
            {deviceViewMode === 'tablet' && <Tablet className="w-3.5 h-3.5 text-emerald-400" />}
            {deviceViewMode === 'web' && <Monitor className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="capitalize">{deviceViewMode}</span>
          </button>
        </div>

        {/* Right Tools: Activity, Customer Profile, PWA Install, Language, Settings & SMS */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Activity / Trips History Button */}
          {onOpenTripHistory && (
            <button
              id="navbar-trips-history-btn"
              onClick={onOpenTripHistory}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-all shadow-sm"
              title="Your Trips & Activity History"
            >
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Activity</span>
              {pastTripsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full font-mono">
                  {pastTripsCount}
                </span>
              )}
            </button>
          )}

          {/* Customer Auth / Profile Button */}
          {customerUser?.isLoggedIn ? (
            <button
              id="customer-profile-nav-btn"
              onClick={onOpenCustomerAuth}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 transition-all shadow-sm"
              title="Customer Profile & Live Location Integration"
            >
              <div className="relative">
                <img
                  src={customerUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                  alt={customerUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-slate-700"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-900"></span>
              </div>
              <span className="hidden sm:inline font-bold text-xs truncate max-w-[80px]">
                {customerUser.name.split(' ')[0]}
              </span>
              {customerUser.lastLoginLocation ? (
                <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-mono">
                  <Navigation className="w-2.5 h-2.5" />
                  {customerUser.lastLoginLocation.cityName}
                </span>
              ) : (
                <span className="hidden md:inline text-[10px] text-amber-300 font-mono">
                  ★ {customerUser.rewardPoints}p
                </span>
              )}
            </button>
          ) : (
            <button
              id="customer-signin-nav-btn"
              onClick={onOpenCustomerAuth}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Sign In to Book with Live GPS Location"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* CMB Airport Flight Tracker Trigger */}
          {onOpenFlightTracker && (
            <button
              id="navbar-cmb-flights-btn"
              type="button"
              onClick={onOpenFlightTracker}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Bandaranaike Airport (CMB) Live Flight Tracker & Chauffeur Transfer"
            >
              <Plane className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">CMB Flights</span>
              <span className="lg:hidden text-[10px]">CMB</span>
            </button>
          )}

          {/* Currency Selector (LKR / USD / EUR / GBP / AUD) */}
          {onSelectCurrency && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shadow-sm">
              {(['LKR', 'USD', 'EUR'] as CurrencyMode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onSelectCurrency(c)}
                  className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${
                    currency === c
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Switch currency to ${c}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* PWA In-App Install Prompt */}
          <PWAInstallButton />

          {/* Trilingual Language Selector (EN / SI / TA) */}
          <LanguageSwitcher currentLanguage={language} onSelectLanguage={onSelectLanguage} />

          {/* Page Settings Dialog Trigger */}
          <button
            id="open-page-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors"
            title="Open Page & Device Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* SMS & Alerts Notification Drawer Trigger */}
          <button
            id="open-sms-drawer-btn"
            onClick={onOpenSmsDrawer}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors"
            title="Sri Lanka Automated SMS Log"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadSmsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 shadow-sm">
                {unreadSmsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

