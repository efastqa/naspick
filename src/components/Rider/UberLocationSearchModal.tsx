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
  Navigation
} from 'lucide-react';
import { LocationPoint, CustomerUser, CustomerSavedPlace } from '../../types';
import { SRI_LANKA_LOCATIONS, calculateDistanceKm } from '../../data/mockLocations';
import { savedPlaceToLocationPoint } from '../../utils/locationUtils';

interface UberLocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  placeholder?: string;
  currentPoint: LocationPoint;
  onSelectLocation: (loc: LocationPoint) => void;
  onDetectGps?: () => void;
  isDetectingGps?: boolean;
  customerUser?: CustomerUser | null;
  mode: 'pickup' | 'dropoff' | 'stop';
}

export const UberLocationSearchModal: React.FC<UberLocationSearchModalProps> = ({
  isOpen,
  onClose,
  title,
  placeholder = 'Where to?',
  currentPoint,
  onSelectLocation,
  onDetectGps,
  isDetectingGps = false,
  customerUser,
  mode,
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[640px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-${mode === 'pickup' ? 'full bg-emerald-400' : 'sm bg-white'} inline-block`}></span>
              <h3 className="text-base font-bold text-white font-heading">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
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
          {/* Quick Action: Live Device GPS (Available for Pickup) */}
          {mode === 'pickup' && onDetectGps && (
            <button
              type="button"
              onClick={() => {
                onDetectGps();
                onClose();
              }}
              disabled={isDetectingGps}
              className="w-full p-3 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Crosshair className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-300">
                    Use Current Device Location (GPS)
                  </p>
                  <p className="text-xs text-slate-400">
                    {isDetectingGps ? 'Locking live satellite coordinates...' : 'Auto-detect via browser geolocation'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
            </button>
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
                    onClose();
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
                      <p className="text-xs font-bold text-white group-hover:text-amber-300">
                        {sp.label}: {sp.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                        {sp.address}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}
            </div>
          )}

          {/* Filtered Locations List */}
          <div className="py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
              {searchQuery ? `Matching Locations (${filteredLocations.length})` : 'Popular Destinations'}
            </span>

            {filteredLocations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No location matches "{searchQuery}". Try searching for Colombo, Kandy, Galle, or Airport.
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = currentPoint.id === loc.id;
                const isAirport = loc.id === 'loc_airport_cmb';
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all group ${
                      isSelected
                        ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                        : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isAirport 
                          ? 'bg-sky-500/20 text-sky-400' 
                          : isSelected 
                          ? 'bg-emerald-500 text-slate-950 font-bold' 
                          : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                      }`}>
                        {isAirport ? (
                          <Plane className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                            {loc.name}
                          </p>
                          {loc.popularTag && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded border border-slate-700">
                              {loc.popularTag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {loc.address} · <strong className="text-slate-300">{loc.city}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {loc.city}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] text-emerald-400 font-bold">Selected</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
