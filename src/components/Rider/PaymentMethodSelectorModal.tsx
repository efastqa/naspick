import React from 'react';
import { Banknote, CreditCard, QrCode, Check, X, ShieldCheck } from 'lucide-react';

interface PaymentMethodSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMethod: 'cash' | 'card' | 'payhere' | 'lankaqr';
  onSelectMethod: (method: 'cash' | 'card' | 'payhere' | 'lankaqr') => void;
  onOpenLankaQr?: () => void;
}

export const PaymentMethodSelectorModal: React.FC<PaymentMethodSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMethod,
  onSelectMethod,
  onOpenLankaQr,
}) => {
  if (!isOpen) return null;

  const paymentOptions = [
    {
      id: 'cash' as const,
      name: 'Cash to Driver',
      description: 'Pay exact or round amount in LKR cash at end of trip',
      icon: <Banknote className="w-5 h-5 text-emerald-400" />,
      badge: 'Most Popular in LK',
    },
    {
      id: 'card' as const,
      name: 'Visa / Mastercard',
      description: 'Saved debit or credit card for automatic trip settlement',
      icon: <CreditCard className="w-5 h-5 text-sky-400" />,
      badge: 'Instant & Cashless',
    },
    {
      id: 'lankaqr' as const,
      name: 'LankaQR / Genie / FriMi',
      description: 'Scan national EMVCo QR with your Sri Lankan banking app',
      icon: <QrCode className="w-5 h-5 text-emerald-300" />,
      badge: 'Zero Convenience Fee',
    },
    {
      id: 'payhere' as const,
      name: 'PayHere Gateway',
      description: 'Pay with Sampath Vishwa, BOC, Commercial Bank or Mobile Wallet',
      icon: (
        <div className="w-5 h-5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
          P
        </div>
      ),
      badge: 'Bank Portal',
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-heading">Payment Options</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select how you want to pay for your Naspick ride</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 pt-3">
          {paymentOptions.map((opt) => {
            const isSelected = currentMethod === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelectMethod(opt.id);
                  if (opt.id === 'lankaqr' && onOpenLankaQr) {
                    onOpenLankaQr();
                  }
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{opt.name}</span>
                      {opt.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 font-semibold rounded border border-emerald-500/20">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
                  </div>
                </div>

                <div className="flex-shrink-0 pl-2">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>All payments secured with 256-bit encryption & LankaPay CEFT compliance.</span>
        </div>
      </div>
    </div>
  );
};
