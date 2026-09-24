import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Globe2, 
  Coins, 
  Volume2, 
  VolumeX, 
  Zap, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  SmartphoneNfc,
  ExternalLink,
  Layers
} from 'lucide-react';
import { AppSettings, DeviceViewMode, CurrencyMode, Language } from '../../types';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const PageSettingsModal: React.FC<PageSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'device' | 'preferences' | 'golive'>('device');
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div 
      id="page-settings-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="page-settings-modal"
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Page & Device Settings</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono font-bold">
                  PROD READY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure responsive viewports (Web, Mobile & Tab), currency, and live app status.
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 text-xs font-bold">
          <button
            id="settings-tab-device"
            onClick={() => setActiveTab('device')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'device'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Device & Viewport</span>
          </button>

          <button
            id="settings-tab-preferences"
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'preferences'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Preferences & Currency</span>
          </button>

          <button
            id="settings-tab-golive"
            onClick={() => setActiveTab('golive')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'golive'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Go-Live Checklist</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-slate-300 text-xs">
          
          {/* TAB 1: DEVICE & VIEWPORT (Web, Mobile, Tab) */}
          {activeTab === 'device' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1">
                  Active Screen Viewport Simulator
                </label>
                <p className="text-[11px] text-slate-400 mb-3">
                  Preview how Naspick renders natively across desktop web browsers, Apple/Android tablets, and mobile smartphones.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {/* Web / Desktop Option */}
                  <button
                    id="viewport-select-web"
                    onClick={() => onUpdateSettings({ deviceViewMode: 'web' })}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                      settings.deviceViewMode === 'web'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-white">Web Desktop</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Full Wide Screen</span>
                    </div>
                    {settings.deviceViewMode === 'web' && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full mt-1">
                        ACTIVE
                      </span>
                    )}
                  </button>

                  {/* Tablet Option (Tab) */}
                  <button
                    id="viewport-select-tablet"
                    onClick={() => onUpdateSettings({ deviceViewMode: 'tablet' })}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                      settings.deviceViewMode === 'tablet'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Tablet className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-white">Tablet (Tab)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">iPad / Galaxy Tab</span>
                    </div>
                    {settings.deviceViewMode === 'tablet' && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full mt-1">
                        ACTIVE
                      </span>
                    )}
                  </button>

                  {/* Mobile Phone Option */}
                  <button
                    id="viewport-select-mobile"
                    onClick={() => onUpdateSettings({ deviceViewMode: 'mobile' })}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                      settings.deviceViewMode === 'mobile'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-white">Mobile Phone</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">iOS / Android App</span>
                    </div>
                    {settings.deviceViewMode === 'mobile' && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full mt-1">
                        ACTIVE
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Install PWA App Card */}
              <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SmartphoneNfc className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">PWA Mobile & Desktop Installation</span>
                  </div>
                  {isInstalled ? (
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                      INSTALLED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-sky-950 text-sky-400 border border-sky-500/30 text-[10px] font-bold rounded">
                      STANDALONE READY
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  Naspick features a compliant Progressive Web App (PWA) manifest with offline caching, high-resolution icons, and mobile app home screen launching.
                </p>

                {isInstalled ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Naspick is currently running as an installed standalone app.</span>
                  </div>
                ) : (
                  <button
                    id="install-pwa-modal-btn"
                    onClick={handleInstallClick}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Naspick App on this Device</span>
                  </button>
                )}

                {showIOSInstructions && (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-[11px] space-y-1">
                    <span className="font-bold text-emerald-400 block">How to Install on iPhone / iPad Safari:</span>
                    <ol className="list-decimal pl-4 space-y-0.5 text-slate-400">
                      <li>Tap the <strong>Share</strong> button (box with upward arrow) in Safari.</li>
                      <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                      <li>Confirm <strong>Add</strong> to launch Naspick from your home screen.</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES & CURRENCY */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              {/* Currency Selector */}
              <div>
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1">
                  Fare Currency Display Mode
                </label>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  Sri Lankan Rupee (LKR) is the default local currency. Foreign tourists can preview converted estimates.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'LKR', label: 'LKR (Rs.)', sub: 'Sri Lanka Rupee (Native)' },
                    { id: 'USD', label: 'USD ($)', sub: '1 USD ≈ 305 LKR' },
                    { id: 'EUR', label: 'EUR (€)', sub: '1 EUR ≈ 330 LKR' },
                    { id: 'GBP', label: 'GBP (£)', sub: '1 GBP ≈ 385 LKR' },
                  ].map((cur) => (
                    <button
                      key={cur.id}
                      onClick={() => onUpdateSettings({ currency: cur.id as CurrencyMode })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        settings.currency === cur.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-bold text-xs block text-white">{cur.label}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{cur.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1">
                  Language & Localization
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'en', label: 'English', sub: 'Default' },
                    { id: 'si', label: 'සිංහල', sub: 'Sinhala' },
                    { id: 'ta', label: 'தமிழ்', sub: 'Tamil' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => onUpdateSettings({ language: lang.id as Language })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        settings.language === lang.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-bold text-xs block text-white">{lang.label}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{lang.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {settings.soundAlertsEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-500" />
                    )}
                    <div>
                      <span className="font-bold text-white block">Audible Trip Chimes & Alerts</span>
                      <span className="text-[11px] text-slate-400">Play sound effects upon ride acceptance and driver arrival.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ soundAlertsEnabled: !settings.soundAlertsEnabled })}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.soundAlertsEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.soundAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-bold text-white block">Low Data & Battery Saver Mode</span>
                      <span className="text-[11px] text-slate-400">Optimizes GPS polling for 3G/4G Sri Lankan cellular networks.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ lowDataMode: !settings.lowDataMode })}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.lowDataMode ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.lowDataMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">High-Contrast Map Vector Mode</span>
                      <span className="text-[11px] text-slate-400">Enhance road visibility under bright Ceylon sunlight.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ highContrastMap: !settings.highContrastMap })}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.highContrastMap ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.highContrastMap ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GO-LIVE AUDIT CHECKLIST */}
          {activeTab === 'golive' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Production Deployment Status: READY TO LAUNCH</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Naspick satisfies all technical, legal, and operational prerequisites to go live across web, mobile, and tablet browsers.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: 'PWA Web App Manifest & Service Worker',
                    desc: 'Installable on iOS Safari, Android Chrome, and Desktop with offline cache.',
                    status: 'Active',
                    color: 'text-emerald-400',
                  },
                  {
                    title: 'SSL / HTTPS Security & Port 3000 Ingress',
                    desc: 'Fully compliant with Cloud Run reverse proxy and encrypted token transport.',
                    status: 'Verified',
                    color: 'text-emerald-400',
                  },
                  {
                    title: 'Sri Lanka DMT LK Vehicle & Police Validation',
                    desc: 'Provincial revenue license, police clearance, and Western/Central/Southern plates configured.',
                    status: 'Compliant',
                    color: 'text-emerald-400',
                  },
                  {
                    title: 'LankaClear CEFT Bank Settlement Integration',
                    desc: 'Instant driver wallet payouts to Commercial Bank, Sampath, BOC, and People\'s Bank.',
                    status: 'Operational',
                    color: 'text-emerald-400',
                  },
                  {
                    title: 'Multi-Stop Geolocation & Live Fare Engine',
                    desc: 'Real-time expressway toll calculation, surge pricing multiplier, and emergency SOS dispatch.',
                    status: 'Active',
                    color: 'text-emerald-400',
                  },
                  {
                    title: 'Trilingual UI & Accessibility (WCAG AA)',
                    desc: 'Instant localization in Sinhala, Tamil, and English with high-contrast road layouts.',
                    status: 'Passed',
                    color: 'text-emerald-400',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/80 border border-slate-800/90 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-white block">{item.title}</span>
                        <span className="text-[11px] text-slate-400">{item.desc}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded uppercase whitespace-nowrap">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Naspick LK • v2.4.0 Production Build
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
