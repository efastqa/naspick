import React, { useState } from 'react';
import { 
  Package, 
  FileText, 
  Utensils, 
  Cpu, 
  Box, 
  User, 
  Phone, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle,
  Truck,
  ArrowRight,
  Clock,
  MapPin,
  Navigation
} from 'lucide-react';
import { LocationPoint, ParcelCategory, DeliveryDetails } from '../../types';
import { calculateDistanceKm } from '../../data/mockLocations';

interface DeliveryFormProps {
  pickup: LocationPoint;
  dropoff: LocationPoint;
  onSelectPickup: (loc: LocationPoint) => void;
  onSelectDropoff: (loc: LocationPoint) => void;
  onSubmitDelivery: (details: DeliveryDetails, totalLkr: number, vehicleCategory?: 'moto' | 'tuk' | 'van') => void;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  pickup,
  dropoff,
  onSelectPickup,
  onSelectDropoff,
  onSubmitDelivery,
}) => {
  const [parcelCategory, setParcelCategory] = useState<ParcelCategory>('documents');
  const [packageWeightKg, setPackageWeightKg] = useState<number>(1);
  const [courierVehicle, setCourierVehicle] = useState<'moto' | 'tuk' | 'van'>('moto');
  const [recipientName, setRecipientName] = useState('Dilshan Jayasuriya');
  const [recipientPhone, setRecipientPhone] = useState('+94 77 526 0765');
  const [specialInstructions, setSpecialInstructions] = useState('Deliver to recipient. Call upon arrival.');
  const [requireSignatureOtp, setRequireSignatureOtp] = useState(true);
  const [expressDelivery, setExpressDelivery] = useState(false);

  const distanceKm = calculateDistanceKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);

  // Delivery pricing algorithm in LKR
  const baseRates: Record<ParcelCategory, { base: number; perKm: number }> = {
    documents: { base: 220, perKm: 75 },
    food: { base: 260, perKm: 85 },
    electronics: { base: 350, perKm: 110 },
    box: { base: 450, perKm: 130 },
  };

  const vehicleMultiplier = courierVehicle === 'moto' ? 1.0 : courierVehicle === 'tuk' ? 1.3 : 2.2;
  const currentRate = baseRates[parcelCategory];
  const weightSurcharge = packageWeightKg > 2 ? Math.round((packageWeightKg - 2) * 45) : 0;
  const expressSurcharge = expressDelivery ? 150 : 0;
  const rawTotal = (currentRate.base + Math.round(distanceKm * currentRate.perKm) + weightSurcharge + expressSurcharge) * vehicleMultiplier;
  const totalLkr = Math.round(rawTotal);

  const courierVehicles = [
    {
      id: 'moto' as const,
      name: 'Flash Moto',
      desc: 'Small items, urgent docs (≤3kg)',
      icon: '🏍️',
      badge: 'Fastest',
    },
    {
      id: 'tuk' as const,
      name: 'Tuk Courier',
      desc: 'Medium boxes & food catering (≤10kg)',
      icon: '🛺',
      badge: 'Popular',
    },
    {
      id: 'van' as const,
      name: 'Mini Cargo / Van',
      desc: 'Heavy parcels & multiple boxes (≤50kg)',
      icon: '🚐',
      badge: 'High Capacity',
    },
  ];

  const categories = [
    {
      id: 'documents',
      name: 'Documents',
      sub: 'Legal papers, Passports, Contracts',
      icon: FileText,
      color: 'emerald',
    },
    {
      id: 'food',
      name: 'Food & Meals',
      sub: 'Warm bakery, grocery & snacks',
      icon: Utensils,
      color: 'amber',
    },
    {
      id: 'electronics',
      name: 'Electronics',
      sub: 'Smartphones, Tablets, Fragile',
      icon: Cpu,
      color: 'sky',
    },
    {
      id: 'box',
      name: 'Box / Parcels',
      sub: 'Merchandise & larger boxes',
      icon: Box,
      color: 'purple',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitDelivery(
      {
        parcelCategory,
        recipientName,
        recipientPhone,
        packageWeightKg,
        specialInstructions,
        requireSignatureOtp,
      },
      totalLkr,
      courierVehicle
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-white font-heading">Naspick Flash Courier</h3>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded border border-emerald-500/30">
              PLACE-TO-PLACE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Send couriers and parcels quickly place to place anywhere in Sri Lanka with live tracking
          </p>
        </div>
      </div>

      {/* Place-to-Place Route Summary */}
      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            Place-to-Place Route
          </span>
          <span className="text-emerald-400 font-mono font-semibold">
            {distanceKm} km direct
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-900 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Pickup Place:</span>
            <p className="text-white font-medium truncate">{pickup.name}</p>
            <span className="text-[10px] text-slate-400">{pickup.city}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-rose-500/30">
            <span className="text-[10px] text-rose-400 font-bold block uppercase">Delivery Place:</span>
            <p className="text-white font-medium truncate">{dropoff.name}</p>
            <span className="text-[10px] text-slate-400">{dropoff.city}</span>
          </div>
        </div>
      </div>

      {/* Courier Vehicle Mode Chooser */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Select Courier Vehicle
        </label>
        <div className="grid grid-cols-3 gap-2">
          {courierVehicles.map((v) => {
            const isSelected = courierVehicle === v.id;
            return (
              <button
                type="button"
                key={v.id}
                onClick={() => setCourierVehicle(v.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{v.icon}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {v.badge}
                    </span>
                  </div>
                  <span className="font-bold text-xs block text-white">{v.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-2 mt-1">{v.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parcel Category Chooser */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Select Parcel Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = parcelCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setParcelCategory(cat.id as ParcelCategory)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs block leading-tight">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{cat.sub}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weight Slider */}
      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-300">Estimated Weight</span>
          <span className="text-xs font-bold text-emerald-400 font-mono">
            {packageWeightKg} kg
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="15"
          step="0.5"
          value={packageWeightKg}
          onChange={(e) => setPackageWeightKg(parseFloat(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>0.5 kg (Flyer)</span>
          <span>5 kg (Shoebox)</span>
          <span>15 kg (Carton)</span>
        </div>
      </div>

      {/* Recipient Details */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Recipient Contact in Sri Lanka
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="Recipient Full Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full py-2 pl-8 pr-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="Recipient Mobile (+94...)"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="w-full py-2 pl-8 pr-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <textarea
            rows={2}
            placeholder="Special Dropoff Notes (e.g. Unit number, Gate code, Security instructions)"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          ></textarea>
        </div>
      </div>

      {/* Safety & Delivery Options */}
      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200">Require 4-digit Delivery Handover OTP</span>
          </div>
          <input
            type="checkbox"
            checked={requireSignatureOtp}
            onChange={(e) => setRequireSignatureOtp(e.target.checked)}
            className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-200">Express Priority Dispatch (+LKR 150)</span>
          </div>
          <input
            type="checkbox"
            checked={expressDelivery}
            onChange={(e) => setExpressDelivery(e.target.checked)}
            className="rounded text-amber-500 focus:ring-0 cursor-pointer"
          />
        </label>
      </div>

      {/* Price Summary & CTA */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-slate-400">
            Courier Total ({distanceKm} km • {packageWeightKg} kg):
          </span>
          <span className="text-xl font-black text-emerald-400 font-heading">
            LKR {totalLkr.toLocaleString()}
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Dispatch Naspick Flash Courier</span>
        </button>
        <p className="text-center text-[10px] text-slate-500 mt-1.5">
          SMS tracking link automatically sent to recipient ({recipientPhone}).
        </p>
      </div>
    </form>
  );
};
