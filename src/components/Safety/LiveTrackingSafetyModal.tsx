import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Share2, 
  MessageSquare, 
  AlertTriangle, 
  Copy, 
  Check, 
  X, 
  Radio, 
  Navigation,
  ExternalLink,
  Smartphone,
  Lock
} from 'lucide-react';
import { LocationPoint, Driver, PRIMARY_SAFETY_CONTACT, PRIMARY_SAFETY_CONTACT_INTL } from '../../types';

interface LiveTrackingSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideId?: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  driver?: Driver;
  onSendSmsToContact?: (phone: string, text: string) => void;
}

export const LiveTrackingSafetyModal: React.FC<LiveTrackingSafetyModalProps> = ({
  isOpen,
  onClose,
  rideId = 'NPK-729104',
  pickup,
  dropoff,
  driver,
  onSendSmsToContact,
}) => {
  const [copied, setCopied] = useState(false);
  const [routeMonitorActive, setRouteMonitorActive] = useState(true);
  const [anomalyTriggered, setAnomalyTriggered] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  if (!isOpen) return null;

  const trackingUrl = `https://naspick.lk/track/${rideId}?contact=${PRIMARY_SAFETY_CONTACT}`;

  const shareText = `Ayubowan! I'm on a Naspick Sri Lanka ride from ${pickup.name} to ${dropoff.name}. Vehicle: ${
    driver ? `${driver.vehiclePlate} (${driver.vehicleModel})` : 'Assigned Vehicle'
  }. Track my real-time GPS location here: ${trackingUrl}`;

  const whatsappUrl = `https://wa.me/94775260765?text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSmsAlert = () => {
    if (onSendSmsToContact) {
      onSendSmsToContact(
        PRIMARY_SAFETY_CONTACT_INTL,
        `Naspick Live Safety: Sahan is en route from ${pickup.name} to ${dropoff.name} in vehicle ${driver?.vehiclePlate || 'NPK'}. Live tracking: ${trackingUrl}`
      );
    }
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3500);
  };

  const handleSimulateDeviation = () => {
    setAnomalyTriggered(true);
    if (onSendSmsToContact) {
      onSendSmsToContact(
        PRIMARY_SAFETY_CONTACT_INTL,
        `⚠️ NASPICK SAFETY ALERT: Route deviation detected for ride ${rideId} near ${pickup.name}. Naspick 24/7 Security Center is monitoring. Contact passenger or emergency services.`
      );
    }
  };

  return (
    <div
      id="safety-live-tracking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-md w-full p-5 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">
                Safety Shield & Live Tracking
              </h3>
              <p className="text-[10px] text-slate-400">24/7 Colombo Security Operations Center</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Designated Primary Safety Contact Card */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-emerald-500/40 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Primary Trusted Safety Contact
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                VERIFIED
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-sm font-black text-white font-mono tracking-wide">
                  {PRIMARY_SAFETY_CONTACT_INTL}
                </p>
                <p className="text-[11px] text-slate-400">
                  Designated Emergency Recipient ({PRIMARY_SAFETY_CONTACT})
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Direct Call to Safety Contact */}
                <a
                  href={`tel:${PRIMARY_SAFETY_CONTACT}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
                  title="Call Contact"
                >
                  <Phone className="w-4 h-4" />
                </a>

                {/* WhatsApp Share Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Send via WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick SMS Trigger */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Send instant GPS telemetry link:</span>
              <button
                onClick={handleSendSmsAlert}
                disabled={smsSent}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                {smsSent ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>SMS Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3 h-3 text-emerald-400" />
                    <span>Dispatch SMS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Shareable Live URL */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Encrypted Real-Time Web Tracking Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={trackingUrl}
                className="flex-1 py-1.5 px-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Anyone with this link can view vehicle GPS location, driver plate, and estimated time of arrival.
            </p>
          </div>

          {/* Route Deviation & Anomaly Monitoring */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">Route Deviation Protection</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={routeMonitorActive}
                  onChange={(e) => setRouteMonitorActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              If the vehicle departs from the standard route by more than 500 meters, our Colombo SOC initiates an automated security check and notifies contact <strong className="text-emerald-400">{PRIMARY_SAFETY_CONTACT}</strong>.
            </p>

            {anomalyTriggered ? (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-lg text-xs text-rose-300 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span>Test deviation alert beamed to {PRIMARY_SAFETY_CONTACT} & SOC.</span>
                </div>
                <button
                  onClick={() => setAnomalyTriggered(false)}
                  className="text-[10px] underline text-rose-300 hover:text-white"
                >
                  Reset
                </button>
              </div>
            ) : (
              <button
                onClick={handleSimulateDeviation}
                className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-300 text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Test Route Anomaly Trigger</span>
              </button>
            )}
          </div>

          {/* National Sri Lanka Emergency Hotlines */}
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
              National Emergency Hotlines (Sri Lanka)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:119"
                className="p-2 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg text-white font-bold flex items-center justify-between transition-colors"
              >
                <span>Police 119</span>
                <Phone className="w-3.5 h-3.5 text-rose-400" />
              </a>
              <a
                href="tel:1990"
                className="p-2 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg text-white font-bold flex items-center justify-between transition-colors"
              >
                <span>Suwa Seriya 1990</span>
                <Phone className="w-3.5 h-3.5 text-rose-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>End-to-end encrypted telemetry</span>
          </span>
          <button
            onClick={onClose}
            className="py-1 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
