import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Download,
  Receipt,
  Building2,
  FileCheck
} from 'lucide-react';
import { Ride } from '../../types';

interface TripReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride | null;
}

export const TripReceiptModal: React.FC<TripReceiptModalProps> = ({
  isOpen,
  onClose,
  ride,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !ride) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `Naspick Sri Lanka Official e-Receipt\nTrip Ref: ${ride.id}\nDriver: ${ride.driver?.name || 'Assigned Driver'} (${ride.driver?.vehiclePlate || 'DMT'})\nRoute: ${ride.pickup.name} -> ${ride.dropoff.name}\nTotal Paid: LKR ${ride.fare.totalLkr.toLocaleString()}\nVerify: https://naspick.lk/receipt/${ride.id}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alertCopied();
    }
  };

  const [copied, setCopied] = React.useState(false);
  const alertCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const tripDate = new Date(ride.completedAt || ride.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const tripTime = new Date(ride.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const completedTime = ride.completedAt
    ? new Date(ride.completedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Action Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Official e-Receipt</h3>
              <p className="text-[11px] text-slate-400 font-mono">Invoice #{ride.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy receipt details"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div 
          ref={receiptRef}
          className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-900 text-slate-100 print:bg-white print:text-black print:p-8"
        >
          {copied && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5 print:hidden">
              <CheckCircle2 className="w-4 h-4" />
              <span>Receipt details copied to clipboard!</span>
            </div>
          )}

          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4 print:border-gray-300">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-emerald-400 font-heading tracking-tight print:text-black">
                  NASPICK
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded print:border print:border-black print:text-black">
                  SRI LANKA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 print:text-gray-600">
                Naspick Mobility & Logistics (Pvt) Ltd
              </p>
              <p className="text-[10px] text-slate-500 print:text-gray-500">
                VAT Reg: 10492819-7000 · Colombo 03, Western Province
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 font-bold text-xs print:text-black print:border-black">
                <FileCheck className="w-3.5 h-3.5" />
                <span>PAID ({ride.paymentMethod.toUpperCase()})</span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 print:text-gray-700">{tripDate}</p>
            </div>
          </div>

          {/* Fare Total Hero Banner */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between print:border-gray-300 print:bg-gray-50">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold print:text-gray-600">
                Total Amount Paid
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading mt-0.5 print:text-black">
                LKR {ride.fare.totalLkr.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-gray-600">
              <p>Payment: <strong className="text-emerald-400 uppercase print:text-black">{ride.paymentMethod}</strong></p>
              <p className="font-mono text-[11px] text-slate-500 print:text-gray-500">Ref: {ride.id}</p>
            </div>
          </div>

          {/* Trip Driver & Vehicle Specifications */}
          <div className="p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-2 print:border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 print:text-gray-600">Driver Partner</span>
              <span className="font-bold text-white print:text-black">{ride.driver?.name || 'Kasun Bandara'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 print:text-gray-600">Vehicle Category & Plate</span>
              <span className="font-mono font-bold text-emerald-400 print:text-black">
                {ride.driver?.vehiclePlate || 'WP ABK-4819'} · {ride.driver?.vehicleModel || ride.vehicleCategory}
              </span>
            </div>
            {ride.driver?.nicNumber && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 print:text-gray-600">Driver DMT NIC</span>
                <span className="font-mono text-slate-300 print:text-gray-700">{ride.driver.nicNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 print:text-gray-600">Rider Contact</span>
              <span className="font-mono text-slate-300 print:text-gray-700">{ride.riderPhone}</span>
            </div>
          </div>

          {/* Route Progression */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 print:text-black">Pickup</span>
                  <span className="text-slate-500 text-[11px] font-mono print:text-gray-600">{tripTime}</span>
                </div>
                <p className="font-semibold text-slate-200 print:text-black">{ride.pickup.name}</p>
                <p className="text-[11px] text-slate-400 print:text-gray-500">{ride.pickup.city || 'Western Province'}</p>
              </div>
            </div>

            {ride.intermediateStops && ride.intermediateStops.map((st, i) => (
              <div key={st.id} className="flex items-start gap-3 pl-0.5">
                <div className="w-2 h-2 rounded-full bg-sky-400 mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-sky-400 print:text-black">Stop {i + 1}</span>
                  <p className="font-medium text-slate-300 print:text-black">{st.name}</p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-white mt-1 flex-shrink-0 print:bg-black"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-300 print:text-black">Dropoff</span>
                  <span className="text-slate-500 text-[11px] font-mono print:text-gray-600">{completedTime}</span>
                </div>
                <p className="font-semibold text-slate-200 print:text-black">{ride.dropoff.name}</p>
                <p className="text-[11px] text-slate-400 print:text-gray-500">{ride.dropoff.city || 'Sri Lanka'}</p>
              </div>
            </div>
          </div>

          {/* Itemized Tariff Calculation */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs print:border-gray-300">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 print:text-black">
              Fare Itemization
            </h4>
            <div className="flex justify-between text-slate-300 print:text-black">
              <span>Base Fare ({ride.vehicleCategory.toUpperCase()})</span>
              <span>LKR {ride.fare.baseFare}</span>
            </div>
            <div className="flex justify-between text-slate-300 print:text-black">
              <span>Distance Charge</span>
              <span>LKR {ride.fare.distanceFare}</span>
            </div>
            <div className="flex justify-between text-slate-300 print:text-black">
              <span>Time Fare ({ride.fare.estimatedMinutes} mins)</span>
              <span>LKR {ride.fare.timeFare}</span>
            </div>
            {ride.includeExpressway && (
              <div className="flex justify-between text-sky-400 print:text-black">
                <span>Expressway Toll ({ride.expresswayName || 'E01/E03 Toll'})</span>
                <span>+LKR 300</span>
              </div>
            )}
            {ride.fare.surgeMultiplier > 1 && (
              <div className="flex justify-between text-amber-400 print:text-black">
                <span>Peak Rush Multiplier ({ride.fare.surgeMultiplier}x)</span>
                <span>Applied</span>
              </div>
            )}
            {ride.tipLkr && ride.tipLkr > 0 && (
              <div className="flex justify-between text-emerald-400 print:text-black">
                <span>Driver Gratuity / Tip</span>
                <span>+LKR {ride.tipLkr}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white print:border-gray-300 print:text-black">
              <span>Subtotal & Taxes (18% Sri Lanka VAT Included)</span>
              <span className="font-heading">LKR {ride.fare.totalLkr.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer Legal & Support Notice */}
          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-1 text-center print:border-gray-200 print:text-gray-500">
            <p>Authorized Electronic Receipt pursuant to Inland Revenue Act of Sri Lanka.</p>
            <p>Need support or dispute a charge? Contact Naspick Sri Lanka at support@naspick.lk or call 077 526 0765.</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
