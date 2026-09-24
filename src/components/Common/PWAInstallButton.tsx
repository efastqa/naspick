import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-nav-btn"
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
        title="Install Naspick as Desktop or Mobile App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-nav-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
          title="Install Naspick on iOS"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Install on iPhone / iPad</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <p>Add Naspick to your iOS home screen for an app experience:</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                  <p>1. Tap the <strong className="text-emerald-400">Share</strong> button in the Safari bottom bar.</p>
                  <p>2. Scroll down and choose <strong className="text-white">Add to Home Screen</strong>.</p>
                  <p>3. Tap <strong className="text-emerald-400">Add</strong> at top right to complete.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-emerald-500 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
