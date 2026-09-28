import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Receipt, 
  HelpCircle, 
  Calendar, 
  MapPin, 
  Car, 
  Clock, 
  ChevronRight, 
  Package, 
  Compass, 
  Star,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import { Ride, LocationPoint } from '../../types';

interface TripHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Ride[];
  onRebookTrip: (trip: Ride) => void;
  onOpenReceipt: (trip: Ride) => void;
  onReportLostItem: (trip: Ride) => void;
}

export const TripHistoryModal: React.FC<TripHistoryModalProps> = ({
  isOpen,
  onClose,
  trips,
  onRebookTrip,
  onOpenReceipt,
  onReportLostItem,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'ride' | 'courier' | 'tour'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTrips = trips.filter((t) => {
    if (filterType !== 'all') {
      const mode = t.serviceMode || 'ride';
      if (mode !== filterType) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPickup = t.pickup.name.toLowerCase().includes(q) || (t.pickup.city && t.pickup.city.toLowerCase().includes(q));
      const matchDropoff = t.dropoff.name.toLowerCase().includes(q) || (t.dropoff.city && t.dropoff.city.toLowerCase().includes(q));
      const matchDriver = t.driver?.name.toLowerCase().includes(q) || t.driver?.vehiclePlate.toLowerCase().includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      return matchPickup || matchDropoff || matchDriver || matchId;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white font-heading">
              Your Trips & Activity
            </h3>
            <p className="text-xs text-slate-400">
              {trips.length} past rides & deliveries across Sri Lanka
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-3 sm:px-5 sm:py-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2 flex-wrap">
          {/* Service Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({trips.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('ride')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'ride'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rides
            </button>
            <button
              type="button"
              onClick={() => setFilterType('courier')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'courier'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Courier
            </button>
            <button
              type="button"
              onClick={() => setFilterType('tour')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'tour'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tours
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[140px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route or driver..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Trips List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-900/60">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">No trips found</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Book your first tuk-tuk or cab across Colombo, Galle, Kandy, or Negombo with 1 tap.
              </p>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const tripDate = new Date(trip.completedAt || trip.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const tripTime = new Date(trip.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={trip.id}
                  className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl transition-all space-y-3 shadow-md"
                >
                  {/* Top Meta Line */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded font-bold uppercase">
                        {trip.serviceMode || 'Ride'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {tripDate} · {tripTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white font-heading">
                        LKR {trip.fare.totalLkr.toLocaleString()}
                      </span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded uppercase">
                        {trip.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Route Track */}
                  <div className="space-y-1.5 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></div>
                      <span className="text-slate-300 font-medium truncate">{trip.pickup.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm bg-white flex-shrink-0"></div>
                      <span className="text-slate-200 font-bold truncate">{trip.dropoff.name}</span>
                    </div>
                  </div>

                  {/* Driver & Vehicle Summary */}
                  {trip.driver && (
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={trip.driver.avatar}
                          alt={trip.driver.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700"
                        />
                        <span className="font-semibold text-slate-200">{trip.driver.name}</span>
                        <span className="font-mono text-emerald-400 font-bold text-[11px]">
                          {trip.driver.vehiclePlate}
                        </span>
                      </div>
                      {trip.rating && (
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{trip.rating}.0</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {/* e-Receipt */}
                      <button
                        type="button"
                        onClick={() => onOpenReceipt(trip)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                        <span>e-Receipt</span>
                      </button>

                      {/* Report Lost Item */}
                      <button
                        type="button"
                        onClick={() => onReportLostItem(trip)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Left a phone or umbrella in vehicle?"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Lost Item?</span>
                      </button>
                    </div>

                    {/* 1-Tap Rebook CTA */}
                    <button
                      type="button"
                      onClick={() => {
                        onRebookTrip(trip);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rebook</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>All past receipts are tax-compliant and downloadable anytime.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
