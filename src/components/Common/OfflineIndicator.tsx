import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (!isOnline) {
    return (
      <div
        id="pwa-offline-alert"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-white shadow-2xl border border-amber-400/40 animate-bounce"
      >
        <WifiOff className="w-4 h-4 text-amber-100 flex-shrink-0" />
        <div>
          <span className="font-bold block">Offline Mode Active</span>
          <span className="text-[11px] text-amber-100">Cached Sri Lanka routes and fleet data are being used.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="pwa-reconnected-alert"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-white shadow-2xl border border-emerald-400/40"
    >
      <Wifi className="w-4 h-4 text-emerald-100 flex-shrink-0" />
      <div>
        <span className="font-bold block">Connected to Network</span>
        <span className="text-[11px] text-emerald-100">Live GPS tracking re-synchronized.</span>
      </div>
    </div>
  );
};
