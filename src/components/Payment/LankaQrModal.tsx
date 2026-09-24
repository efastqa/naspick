import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, Smartphone, ShieldCheck, X, RefreshCw, Copy, Check } from 'lucide-react';

interface LankaQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountLkr: number;
  rideId: string;
  onPaymentSuccess: () => void;
}

export const LankaQrModal: React.FC<LankaQrModalProps> = ({
  isOpen,
  onClose,
  amountLkr,
  rideId,
  onPaymentSuccess,
}) => {
  const [selectedApp, setSelectedApp] = useState<'genie' | 'qplus' | 'vishwa' | 'frimi' | 'smartpay'>('genie');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 min expiry

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setCountdown(300);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const qrPayload = `00020101021226680014lk.lankaclear.qr0128NASPICK-SL-PAY-009210512800520448145303144540${amountLkr}.005802LK5913NASPICK CEYLON6007COLOMBO62250117${rideId}6304`;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 1500);
    }, 1800);
  };

  const handleCopyQrString = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="lanka-qr-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {/* LankaQR national badge */}
            <div className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-xs tracking-wider">
              LankaQR
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-heading">National QR Payment</h3>
              <p className="text-[10px] text-slate-400">Central Bank of Sri Lanka Certified</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-white font-heading">Payment Successful!</h4>
            <p className="text-xs text-slate-300">
              LKR {amountLkr.toLocaleString()} settled via LankaClear LankaQR.
            </p>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400">
              Ref: LQR-SL-{Math.floor(1000000 + Math.random() * 9000000)}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Amount Banner */}
            <div className="text-center p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amount to Pay</span>
              <div className="text-2xl font-black text-emerald-400 font-heading mt-0.5">
                LKR {amountLkr.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-1">
                <span>Ride ID: <strong className="text-slate-200">{rideId}</strong></span>
                <span>•</span>
                <span>Expires in: <strong className="text-amber-400">{formattedTime}</strong></span>
              </div>
            </div>

            {/* QR Visual Card */}
            <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
              <div className="w-44 h-44 bg-slate-50 rounded-xl border-2 border-slate-900/20 p-2 flex flex-col items-center justify-center relative">
                {/* SVG LankaQR Graphic */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="11" y="11" width="14" height="14" fill="currentColor" />
                  <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="75" y="11" width="14" height="14" fill="currentColor" />
                  <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="11" y="75" width="14" height="14" fill="currentColor" />
                  
                  {/* Simulated matrix bits */}
                  <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="46" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="56" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="36" y="18" width="16" height="6" fill="currentColor" />
                  <rect x="8" y="36" width="6" height="16" fill="currentColor" />
                  <rect x="18" y="46" width="6" height="12" fill="currentColor" />
                  <rect x="36" y="36" width="28" height="28" rx="3" fill="#047857" />
                  <text x="50" y="53" fill="white" fontSize="10" fontWeight="900" textAnchor="middle" dominantBaseline="middle">LK</text>
                  <rect x="69" y="36" width="10" height="10" fill="currentColor" />
                  <rect x="82" y="48" width="10" height="8" fill="currentColor" />
                  <rect x="36" y="68" width="12" height="6" fill="currentColor" />
                  <rect x="52" y="76" width="18" height="6" fill="currentColor" />
                  <rect x="76" y="68" width="16" height="16" fill="currentColor" />
                  <rect x="82" y="74" width="6" height="6" fill="white" />
                </svg>

                {/* EMVCo Logo Overlay */}
                <div className="absolute bottom-1 text-[8px] font-mono font-bold text-slate-600">
                  LankaClear CEFT
                </div>
              </div>

              <span className="text-[10px] font-semibold text-slate-600 mt-2">
                Scan with any Sri Lankan Banking App
              </span>
            </div>

            {/* Supported Bank Apps Selection */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Simulation App
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                {[
                  { id: 'genie', name: 'Dialog Genie' },
                  { id: 'qplus', name: 'ComBank Q+' },
                  { id: 'vishwa', name: 'Sampath Vishwa' },
                  { id: 'frimi', name: 'FriMi' },
                  { id: 'smartpay', name: 'BOC SmartPay' },
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app.id as any)}
                    className={`py-1.5 px-2 rounded-lg border font-medium text-center truncate transition-colors ${
                      selectedApp === app.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                id="simulate-lankaqr-pay-button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing LankaQR via LankaClear...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Simulate Scan & Pay with {selectedApp.toUpperCase()}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyQrString}
                className="w-full py-1.5 text-slate-400 hover:text-slate-200 text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'QR Payload Copied to Clipboard!' : 'Copy EMVCo QR String for Banking Apps'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
