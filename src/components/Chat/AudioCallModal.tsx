import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { Driver } from '../../types';

interface AudioCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver;
}

export const AudioCallModal: React.FC<AudioCallModalProps> = ({
  isOpen,
  onClose,
  driver,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallStatus('ringing');
      setSeconds(0);
      setIsMuted(false);
      setIsSpeaker(false);
      return;
    }

    // Connect call after 2.5s
    const ringTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2500);

    return () => clearTimeout(ringTimer);
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isOpen && callStatus === 'connected') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, callStatus]);

  if (!isOpen) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedDuration = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div
      id="audio-call-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-6 flex flex-col items-center justify-between shadow-2xl text-center relative min-h-[420px]">
        {/* Masked Telecom Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 border border-slate-700/60 rounded-full text-[10px] text-emerald-400 font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Dialog Sri Lanka Number Masking</span>
        </div>

        {/* Driver Avatar & Pulse Ring */}
        <div className="my-6 relative flex items-center justify-center">
          {callStatus === 'ringing' && (
            <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping pointer-events-none"></div>
          )}
          <img
            src={driver.avatar}
            alt={driver.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-xl relative z-10"
          />
        </div>

        {/* Driver Details & Status */}
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-white font-heading">{driver.name}</h3>
          <p className="text-xs text-slate-400 font-mono">
            {driver.vehiclePlate} • {driver.vehicleModel}
          </p>
          <div className="pt-2">
            {callStatus === 'ringing' && (
              <span className="text-xs font-semibold text-emerald-400 animate-pulse">
                Ringing on Sri Lanka mobile network...
              </span>
            )}
            {callStatus === 'connected' && (
              <span className="text-sm font-bold text-white font-mono">{formattedDuration}</span>
            )}
            {callStatus === 'ended' && (
              <span className="text-xs font-semibold text-rose-400">Call Ended</span>
            )}
          </div>
        </div>

        {/* Controls: Mute, Speaker, End Call */}
        <div className="w-full pt-6 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-colors ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Mute Mic"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-full border transition-colors ${
              isSpeaker
                ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Speakerphone"
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
