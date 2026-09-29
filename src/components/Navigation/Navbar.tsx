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
  UserPlus
} from 'lucide-react';
import { NaspickLogo } from '../Common/NaspickLogo';
import { LanguageSwitcher } from '../Common/LanguageSwitcher';
import { PWAInstallButton } from '../Common/PWAInstallButton';
import { Language, DeviceViewMode, CustomerUser } from '../../types';

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
}) => {
  return (
    <header className="w-full bg-slate-950/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
        {/* Brand Logo in Top-Left Corner */}
        <div 
          onClick={() => onSelectRole('rider')} 
          className="flex items-center gap-2 sm:gap-3 flex-shrink-0 cursor-pointer py-0.5"
          title="Return to Naspick Home"
        >
          <NaspickLogo size="lg" />
        </div>

        {/* Primary Role Switcher (Rider | Driver Partner | Admin Control) */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
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
            <span className="hidden sm:inline">Driver Partner</span>
            <span className="sm:hidden">Driver</span>
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
            <span className="hidden sm:inline">Admin Control</span>
            <span className="sm:hidden">Admin</span>
            {!isAdminAuthenticated && (
              <span className="hidden md:inline px-1 py-0.2 bg-slate-800 text-amber-300 text-[9px] rounded font-mono">
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
              <span className="hidden sm:inline">Guide</span>
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
              <span className="hidden md:inline">Drive with Us</span>
              <span className="md:hidden">Drive</span>
            </button>
          )}
        </div>

        {/* Device Viewport Selector (Web | Tab | Mobile) */}
        <div className="hidden lg:flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            id="quick-view-web"
            onClick={() => onSelectDeviceViewMode('web')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              deviceViewMode === 'web'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Web Desktop Fluid Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Web</span>
          </button>

          <button
            id="quick-view-tablet"
            onClick={() => onSelectDeviceViewMode('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              deviceViewMode === 'tablet'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet (Tab) Mode"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tab</span>
          </button>

          <button
            id="quick-view-mobile"
            onClick={() => onSelectDeviceViewMode('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              deviceViewMode === 'mobile'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile Smartphone Simulator"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right Tools: Activity / Trips History, Customer Sign-In / Profile, PWA Install, Language Switcher, Settings & SMS Drawer Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
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

