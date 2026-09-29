import React, { useState } from 'react';
import { 
  X, 
  Split, 
  Smartphone, 
  Globe, 
  Layers, 
  CheckCircle2, 
  Car, 
  User, 
  ShieldCheck, 
  ExternalLink, 
  HelpCircle,
  Package,
  Palmtree,
  Clock,
  Sparkles,
  ArrowRight,
  UserPlus
} from 'lucide-react';

interface AppSeparationAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: 'rider' | 'driver' | 'admin';
  onSwitchRole: (role: 'rider' | 'driver' | 'admin') => void;
  onOpenDriverWizard?: () => void;
}

export const AppSeparationAdviceModal: React.FC<AppSeparationAdviceModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSwitchRole,
  onOpenDriverWizard,
}) => {
  const [activeTab, setActiveTab] = useState<'separation' | 'services'>('separation');

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Naspick Architecture & Operations
                </span>
                <span className="px-2 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">
                  Recommended Setup
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                Driver vs Passenger Separation & Multi-Service Guide
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('separation')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'separation'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>How to Separate Driver & Passenger (3 Options)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'services'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Operating 4 Services in One App</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {activeTab === 'separation' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Executive Recommendation</span>
                </h4>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  You have <strong className="text-white">3 industry-standard architectural options</strong> for separating Driver and Passenger. 
                  In modern Sri Lankan & Asian ride-hailing (like InDrive, PickMe, Grab), apps either use <strong>Option 1 (Unified Super-App with Role Switch)</strong> or <strong>Option 2 (Subdomain / URL parameter separation)</strong>. Both are fully supported in this app right now!
                </p>
              </div>

              {/* Option 1: Unified App */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-sm font-bold text-white font-heading">
                      Option A: Unified Super-App (Currently Active)
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-full uppercase">
                    Easiest & Fastest
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Both passengers and drivers download the same app or PWA. Passengers use the default booking screen; drivers simply click <strong>"Driver Partner"</strong> in the top navigation or sign in with their driver phone number.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-emerald-400 block mb-0.5">✅ Advantages:</strong>
                    <ul className="text-slate-400 space-y-0.5 list-disc list-inside">
                      <li>One codebase & one URL to deploy</li>
                      <li>Instant testing of live ride requests & driver acceptance</li>
                      <li>Passengers can also become part-time drivers</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">⚡ Deployment:</strong>
                    <p className="text-slate-400">
                      Deploy 1 app at <code className="text-emerald-300 font-mono">naspick.lk</code>.
                    </p>
                  </div>
                </div>

                {onOpenDriverWizard && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDriverWizard();
                      }}
                      className="w-full py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Test Driver Self-Service Registration Wizard</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Option 2: Dedicated URL / Subdomain */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h4 className="text-sm font-bold text-white font-heading">
                      Option B: URL Routing / Subdomains (Instant Test Available)
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold text-[10px] rounded-full uppercase">
                    Cleanest Web Separation
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  You deploy the same codebase on two web addresses or use URL parameters:
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-emerald-400 text-xs block">Passenger Web App:</strong>
                      <span className="text-slate-400 font-mono text-[11px]">{currentOrigin}/?role=rider</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('rider');
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold transition-colors"
                    >
                      Switch to Passenger
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-sky-400 text-xs block">Driver Captain Portal:</strong>
                      <span className="text-slate-400 font-mono text-[11px]">{currentOrigin}/?role=driver</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('driver');
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg text-xs font-bold transition-colors"
                    >
                      Switch to Driver
                    </button>
                  </div>
                </div>
              </div>

              {/* Option 3: Two Separate Native App Packages */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h4 className="text-sm font-bold text-white font-heading">
                      Option C: Two Separate Native Apps (Play Store / App Store)
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold text-[10px] rounded-full uppercase">
                    Full Enterprise
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  When releasing to Google Play and Apple App Store, compile into two APKs/IPAs:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">📱 App 1: "Naspick: Rides & Courier"</span>
                    <p className="text-slate-400 mt-0.5">
                      Rider & Courier booking only. Role switcher is hidden.
                    </p>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">🚗 App 2: "Naspick Driver Partner"</span>
                    <p className="text-slate-400 mt-0.5">
                      Driver Captain portal with earnings, turn-by-turn navigation, and trip dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Can we operate all 4 services in the same app?</span>
                </h4>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-emerald-400 font-bold">YES! Absolutely.</strong> Operating <strong className="text-white">Rides, Flash Courier, Tourist Tours, and Hourly Rental</strong> in the same app is the modern standard (pioneered by Grab, Uber, and PickMe). It provides huge business and technical advantages:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Rides */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Car className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-white text-sm">1. Rides</h5>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    On-demand city rides with Tuk, Nano, Sedan, and Van. Automated route matching, live GPS tracking, and upfront pricing.
                  </p>
                </div>

                {/* 2. Flash Courier */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-white text-sm">2. Flash Courier</h5>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Fast parcel & document dispatch with 4-digit security OTP. Motorcycle & Tuk couriers deliver directly across Sri Lanka.
                  </p>
                </div>

                {/* 3. Tourist Tours */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Palmtree className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-white text-sm">3. Tourist Tours</h5>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Curated day tour packages to Galle Fort, Sigiriya, Kandy, and Ella with dedicated air-conditioned vehicles and verified tourist drivers.
                  </p>
                </div>

                {/* 4. Hourly Rental */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-white text-sm">4. Hourly Rental</h5>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Hourly chauffeur hire with unlimited stops (2 hrs, 4 hrs, 8 hrs full-day, 12 hrs). Fixed km packages for weddings, meetings, and shopping.
                  </p>
                </div>
              </div>

              {/* Core Advantages */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                  Why operating all in one app is best for you:
                </h5>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Higher Fleet Utilization:</strong> A driver who is not getting a ride can immediately accept a Flash Courier parcel or Tourist Tour.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Higher Customer Retention:</strong> Customers keep 1 app installed on their phone instead of needing 4 different apps.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Unified Payments & Wallet:</strong> Cash, Card, LankaQR, and PayHere work seamlessly across all 4 services.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Current Active Mode: <strong className="text-white capitalize">{currentRole}</strong></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
