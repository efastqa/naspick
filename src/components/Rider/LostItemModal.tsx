import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Smartphone, 
  Briefcase, 
  Umbrella, 
  Glasses, 
  Key, 
  Phone,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Ride } from '../../types';

interface LostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride | null;
  onSubmitReport: (report: {
    rideId: string;
    itemType: string;
    description: string;
    contactPhone: string;
    driverPhone: string;
    driverName: string;
  }) => void;
}

const COMMON_ITEMS = [
  { id: 'phone', label: 'Mobile Phone', icon: Smartphone },
  { id: 'wallet', label: 'Wallet / Purse', icon: Briefcase },
  { id: 'umbrella', label: 'Umbrella', icon: Umbrella },
  { id: 'glasses', label: 'Glasses / Sunglasses', icon: Glasses },
  { id: 'keys', label: 'Keys', icon: Key },
];

export const LostItemModal: React.FC<LostItemModalProps> = ({
  isOpen,
  onClose,
  ride,
  onSubmitReport,
}) => {
  const [selectedItemType, setSelectedItemType] = useState('phone');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState(ride?.riderPhone || '+94 77 982 1092');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen || !ride) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = `LOST-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(newTicket);
    setIsSubmitted(true);

    onSubmitReport({
      rideId: ride.id,
      itemType: selectedItemType,
      description: description.trim() || `Item left in vehicle ${ride.driver?.vehiclePlate || 'Naspick vehicle'}`,
      contactPhone,
      driverPhone: ride.driver?.phone || '+94 77 123 4567',
      driverName: ride.driver?.name || 'Driver Partner',
    });
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setDescription('');
    onClose();
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
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Report Lost Item</h3>
              <p className="text-[11px] text-slate-400 font-mono">Trip #{ride.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Report Filed Successfully</h4>
              <p className="text-xs text-slate-400 mt-1">
                Ticket Reference: <strong className="text-emerald-400 font-mono">{ticketId}</strong>
              </p>
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 text-left space-y-1.5">
              <p className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Urgent SMS notification dispatched to driver {ride.driver?.name}.</span>
              </p>
              <p className="text-slate-400 text-[11px]">
                Driver contact number: <strong className="text-white">{ride.driver?.phone || '+94 77 123 4567'}</strong>
              </p>
              <p className="text-slate-400 text-[11px]">
                Vehicle: <strong>{ride.driver?.vehiclePlate} ({ride.driver?.vehicleModel})</strong>
              </p>
              <p className="text-slate-500 text-[10px] pt-1 border-t border-slate-800">
                Naspick 24/7 Lost & Found team is on standby to assist retrieval.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Driver:</span>
                <strong className="text-white">{ride.driver?.name || 'Kasun Bandara'}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Vehicle:</span>
                <strong className="text-emerald-400 font-mono">{ride.driver?.vehiclePlate || 'WP ABK-4819'}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Trip:</span>
                <span className="truncate max-w-[200px] text-slate-300">{ride.pickup.name} → {ride.dropoff.name}</span>
              </div>
            </div>

            {/* Quick Item Picker */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                What item did you leave behind?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COMMON_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedItemType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItemType(item.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item Details */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Description / Color / Brand
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="E.g. Black Samsung Galaxy in leather case left on rear seat..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                required
              />
            </div>

            {/* Return Contact Phone */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Alternative Contact Phone (To reach you)
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                required
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              An immediate high-priority SMS alert will be dispatched to driver {ride.driver?.name} with your contact number to check the vehicle.
            </p>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Lost Item Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
