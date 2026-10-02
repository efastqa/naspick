import React, { useState } from 'react';
import { 
  X, 
  Plane, 
  Search, 
  Clock, 
  MapPin, 
  Car, 
  ArrowRight, 
  ShieldCheck, 
  Luggage, 
  Sparkles,
  DollarSign,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { CMBFlight, CurrencyMode, LocationPoint, VehicleCategory } from '../../types';
import { CMB_SCHEDULED_FLIGHTS } from '../../data/mockFlights';
import { formatPrice } from '../../utils/currencyUtils';

interface CMBFlightTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyMode;
  onSelectFlightForPickup: (flight: CMBFlight) => void;
}

export const CMBFlightTrackerModal: React.FC<CMBFlightTrackerModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectFlightForPickup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'landed' | 'active'>('all');

  if (!isOpen) return null;

  const filteredFlights = CMB_SCHEDULED_FLIGHTS.filter((fl) => {
    const matchesSearch = 
      fl.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fl.originCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fl.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fl.originCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'landed') return fl.status === 'Landed';
    if (selectedFilter === 'active') return fl.status === 'On Time' || fl.status === 'Approaching' || fl.status === 'Delayed';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="cmb-flight-tracker-modal"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-950 to-sky-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
                  Katunayake International (CMB)
                </span>
                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold text-[9px] rounded-full uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                  Live Radar
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                Bandaranaike Airport Flight Tracker & Pickup
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Airport Highway & Meet & Greet Banner */}
        <div className="bg-slate-950/70 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Chauffeur Meet & Greet at <strong>Terminal 1 Arrivals Gate</strong> with nameboard.</span>
          </div>
          <span className="text-[11px] text-sky-400 font-mono font-semibold">
            ⚡ E03 Airport Expressway Included
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by flight number (e.g. UL 504, EK 650) or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedFilter === 'all' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Flights
            </button>
            <button
              onClick={() => setSelectedFilter('landed')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedFilter === 'landed' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛬 Landed
            </button>
            <button
              onClick={() => setSelectedFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedFilter === 'active' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              ✈️ Approaching
            </button>
          </div>
        </div>

        {/* Flight Cards List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 text-xs">
          {filteredFlights.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Plane className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>No flights found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredFlights.map((flight) => {
              const isLanded = flight.status === 'Landed';
              const isDelayed = flight.status === 'Delayed';

              return (
                <div
                  key={flight.id}
                  className="p-3.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm text-white px-2 py-0.5 bg-slate-900 border border-slate-700 rounded-lg">
                        {flight.flightNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        {flight.airline}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isLanded
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isDelayed
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                        }`}
                      >
                        {flight.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-white">
                        {flight.originCity} ({flight.originCode})
                      </span>
                      <span>→</span>
                      <span className="text-sky-300 font-semibold">Colombo CMB</span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
                        <Clock className="w-3 h-3 text-slate-400" />
                        ETA: <strong>{flight.estimatedTime}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {flight.terminal} • {flight.gate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Luggage className="w-3 h-3 text-amber-400" />
                        {flight.baggageBelt}
                      </span>
                      <span className="text-slate-500">
                        Aircraft: {flight.aircraft}
                      </span>
                    </div>
                  </div>

                  {/* Transfer Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">Airport Transfer</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {formatPrice(7800, currency, true)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectFlightForPickup(flight)}
                      className="py-2 px-3.5 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Book Pickup</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Notice */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Driver monitors your actual flight landing time to adjust pickup automatically.</span>
          </span>
          <span className="font-mono text-slate-500 hidden sm:inline">
            Airport Code: CMB / VCBI
          </span>
        </div>
      </div>
    </div>
  );
};
