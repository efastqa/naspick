import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink,
  Car,
  QrCode,
  MapPin
} from 'lucide-react';
import { Ride } from '../../types';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride | null;
  onSendSmsToContact?: (phone: string, text: string) => void;
}

export const ShareTripModal: React.FC<ShareTripModalProps> = ({
  isOpen,
  onClose,
  ride,
  onSendSmsToContact,
}) => {
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState('');
  const [sentCustom, setSentCustom] = useState(false);

  if (!isOpen || !ride) return null;

  const trackingUrl = `https://naspick.lk/track/${ride.id}`;
  const shareMessage = `Track my live Naspick ride to ${ride.dropoff.name}!\nDriver: ${ride.driver?.name || 'Partner'} (${ride.driver?.vehiclePlate || 'Vehicle'})\nLive GPS Map: ${trackingUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    // Use an anchor element instead of window.open to comply with environment constraints
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  const handleSendCustomSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhone.trim()) return;

    if (onSendSmsToContact) {
      onSendSmsToContact(
        customPhone.trim(),
        `Naspick Live Ride Alert from ${ride.riderName}: I am en route to ${ride.dropoff.name}. Driver: ${ride.driver?.name} (${ride.driver?.vehiclePlate}). Live Tracking: ${trackingUrl}`
      );
    }
    setSentCustom(true);
    setTimeout(() => setSentCustom(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Share Live Trip</h3>
              <p className="text-[11px] text-slate-400 font-mono">Trip #{ride.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Trip Summary Card */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Live GPS Active
              </span>
              <span className="text-[11px] font-mono text-slate-400">OTP {ride.otp}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center border border-slate-700">
                <Car className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{ride.driver?.name}</h4>
                <p className="text-[11px] font-mono text-emerald-300">
                  {ride.driver?.vehiclePlate} · {ride.driver?.vehicleModel}
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-1 border-t border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">Heading to: <strong>{ride.dropoff.name}</strong></span>
            </div>
          </div>

          {/* Share via WhatsApp 1-Tap Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Copy Link Input Bar */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Live Public Tracking URL
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5 pl-3">
              <span className="text-xs font-mono text-slate-300 truncate flex-1">
                {trackingUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SMS to Custom Contact */}
          <form onSubmit={handleSendCustomSms} className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Send Tracking SMS to Any Contact
            </label>
            <div className="flex items-center gap-2">
              <input
                type="tel"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="+94 7X XXX XXXX"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 flex-shrink-0"
              >
                {sentCustom ? 'Sent ✓' : 'Send SMS'}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Recipient can track vehicle location, driver speed, and estimated arrival time in real-time.
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Live Session</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
