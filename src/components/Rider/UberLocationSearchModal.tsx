import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Home, 
  Briefcase, 
  Star, 
  X, 
  Clock, 
  Plane, 
  Building2, 
  Sparkles,
  ChevronRight,
  Navigation,
  CheckCircle2,
  Car,
  Package,
  Palmtree,
  ArrowLeft
} from 'lucide-react';
import { LocationPoint, CustomerUser, CustomerSavedPlace, BookingServiceMode } from '../../types';
import { SRI_LANKA_LOCATIONS, calculateDistanceKm } from '../../data/mockLocations';
import { savedPlaceToLocationPoint } from '../../utils/locationUtils';

interface UberLocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placeholder?: string;
  currentPoint: LocationPoint;
  pickupPoint?: LocationPoint;
  onSelectLocation: (loc: LocationPoint) => void;
  onDetectGps?: () => void;
  isDetectingGps?: boolean;
  customerUser?: CustomerUser | null;
  mode: 'pickup' | 'dropoff' | 'stop';
  serviceMode?: BookingServiceMode;
  onBackToPickup?: () => void;
}

export const UberLocationSearchModal: React.FC<UberLocationSearchModalProps> = ({
  isOpen,
  onClose,
  title,
  placeholder,
  currentPoint,
  pickupPoint,
  onSelectLocation,
  onDetectGps,
  isDetectingGps = false,
  customerUser,
  mode,
  serviceMode = 'ride',
  onBackToPickup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Unique cities from locations
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    SRI_LANKA_LOCATIONS.forEach((l) => set.add(l.city));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered locations based on query and city filter
  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SRI_LANKA_LOCATIONS.filter((loc) => {
      // City filter
      if (selectedCityFilter !== 'all' && loc.city !== selectedCityFilter) {
        return false;
      }
      if (!q) return true;
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        (loc.popularTag && loc.popularTag.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCityFilter]);

  if (!isOpen) return null;

  const serviceLabels: Record<BookingServiceMode, { label: string; icon: React.ReactNode; color: string }> = {
    ride: { label: 'Rides', icon: <Car className="w-3.5 h-3.5" />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    delivery: { label: 'Flash Courier', icon: <Package className="w-3.5 h-3.5" />, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    tour: { label: 'Tourist Tours', icon: <Palmtree className="w-3.5 h-3.5" />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    rental: { label: 'Hourly Rental', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  };

  const activeServiceBadge = serviceLabels[serviceMode] || serviceLabels.ride;

  const modalTitle = title || (
    mode === 'pickup'
      ? 'Step 1 of 2: Set Current Location (Pickup)'
      : mode === 'dropoff'
      ? 'Step 2 of 2: Where to? Set Destination'
      : 'Set Stop Location'
  );

  const searchPlaceholder = placeholder || (
    mode === 'pickup'
      ? 'Search pickup address, hotel, station...'
      : 'Where to? Search destination, airport, beach...'
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[660px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Search Bar and Steps Badge */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {mode === 'dropoff' && onBackToPickup && (
                <button
                  type="button"
                  onClick={onBackToPickup}
                  className="p-1 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Back to Pickup Location"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-400" />
                </button>
              )}
              <span className={`w-2.5 h-2.5 rounded-${mode === 'pickup' ? 'full bg-emerald-400' : 'sm bg-emerald-400'} inline-block animate-pulse`}></span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${activeServiceBadge.color}`}>
                    {activeServiceBadge.icon}
                    <span>{activeServiceBadge.label}</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {mode === 'pickup' ? 'Step 1 of 2' : mode === 'dropoff' ? 'Step 2 of 2' : 'Intermediate Stop'}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white font-heading mt-0.5">{modalTitle}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Breadcrumb strip if in Dropoff mode to show confirmed pickup */}
          {mode === 'dropoff' && pickupPoint && (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl mb-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                <span className="text-slate-400 text-[11px]">From Pickup:</span>
                <span className="font-bold text-white truncate max-w-[190px]">{pickupPoint.name}</span>
              </div>
              {onBackToPickup && (
                <button
                  type="button"
                  onClick={onBackToPickup}
                  className="text-[11px] font-bold text-emerald-400 hover:underline flex-shrink-0 ml-2"
                >
                  Change
                </button>
              )}
            </div>
          )}

          {/* Search Input Box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full py-3 pl-10 pr-9 bg-slate-800/90 hover:bg-slate-800 text-white placeholder:text-slate-400 text-sm font-medium rounded-xl border border-slate-700/80 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
            {availableCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCityFilter(city)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCityFilter === city
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {city === 'all' ? 'All Island' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 sm:p-3 space-y-1">
          {/* STEP 1 SPECIAL: 1-Tap Confirm Current Location & Advance to Destination */}
          {mode === 'pickup' && (
            <div className="pb-2 space-y-2">
              {/* Option A: Quick Confirm Current Preset Location */}
              <button
                type="button"
                id="modal-confirm-current-location-btn"
                onClick={() => {
                  onSelectLocation(currentPoint);
                }}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-between text-left transition-all group shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">
                        Use Current Location
                      </span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-bold">
                        1-Tap Next
                      </span>
                    </div>
                    <p className="text-sm font-black text-white group-hover:text-emerald-300 truncate mt-0.5">
                      {currentPoint.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {currentPoint.address || currentPoint.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 flex-shrink-0 pl-2">
                  <span className="hidden sm:inline">Choose Destination</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option B: Live GPS Device Detection */}
              {onDetectGps && (
                <button
                  type="button"
                  id="modal-detect-gps-btn"
                  onClick={async () => {
                    if (onDetectGps) {
                      await onDetectGps();
                    }
                    onSelectLocation(currentPoint);
                  }}
                  disabled={isDetectingGps}
                  className="w-full p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      <Crosshair className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-emerald-300">
                        Detect Live GPS Location
                      </p>
                      <p className="text-xs text-slate-400">
                        {isDetectingGps ? 'Locking live satellite coordinates...' : 'Pin exact GPS position and proceed'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
                </button>
              )}
            </div>
          )}

          {/* Quick Action: Saved Places (Home, Work, etc.) */}
          {customerUser?.isLoggedIn && customerUser.savedPlaces && customerUser.savedPlaces.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                Saved Places
              </span>
              {customerUser.savedPlaces.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => {
                    onSelectLocation(savedPlaceToLocationPoint(sp));
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center flex-shrink-0">
                      {sp.label.toLowerCase().includes('home') ? (
                        <Home className="w-4 h-4" />
                      ) : sp.label.toLowerCase().includes('work') ? (
                        <Briefcase className="w-4 h-4" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-emerald-300">
                        {sp.label}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[280px]">
                        {sp.address}, {sp.city}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
                </button>
              ))}
            </div>
          )}

          {/* Location Results List */}
          <div className="py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
              {searchQuery ? `Search Results (${filteredLocations.length})` : 'Popular Locations in Sri Lanka'}
            </span>

            {filteredLocations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No locations matching "{searchQuery}". Try Colombo, Kandy, Galle, Airport...
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isCurrent = currentPoint.id === loc.id;

                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      onSelectLocation(loc);
                    }}
                    className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all group ${
                      isCurrent
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCurrent
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : loc.popularTag === 'Airport'
                            ? 'bg-sky-500/20 text-sky-400'
                            : loc.popularTag === 'Transit'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400'
                        }`}
                      >
                        {loc.popularTag === 'Airport' ? (
                          <Plane className="w-4 h-4" />
                        ) : loc.popularTag === 'Transit' ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white group-hover:text-emerald-300 truncate">
                            {loc.name}
                          </p>
                          {loc.popularTag && (
                            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 text-[9px] font-bold rounded">
                              {loc.popularTag}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {loc.address} · <span className="text-slate-300 font-medium">{loc.city}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 pl-2">
                      <span className="text-[11px] text-slate-500 group-hover:text-emerald-400 font-semibold">
                        Select
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Bottom Footer with Helpful Guidance */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>
              {mode === 'pickup' 
                ? 'After setting current location, you will choose destination' 
                : 'Selecting destination will calculate live fares & vehicles'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
