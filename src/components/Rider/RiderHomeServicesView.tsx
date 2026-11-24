import React from 'react';
import {
  Car,
  Package,
  Palmtree,
  Clock,
  Search,
  MapPin,
  Crosshair,
  RefreshCw,
  ChevronRight,
  History,
  Plane,
  Flame,
} from 'lucide-react';
import {
  LocationPoint,
  CustomerUser,
  BookingServiceMode,
  Ride,
} from '../../types';
import { SRI_LANKA_LOCATIONS } from '../../data/mockLocations';

interface RiderHomeServicesViewProps {
  pickup: LocationPoint;
  onDetectGps: () => void;
  isDetectingGps: boolean;
  customerUser?: CustomerUser | null;
  onSelectService: (mode: BookingServiceMode, triggerDestinationSearch?: boolean) => void;
  onChooseCurrentLocation: () => void;
  onSelectDestinationDirect: (loc: LocationPoint) => void;
  onOpenTripHistory?: () => void;
  pastTripsCount?: number;
  lastTrip?: Ride | null;
  onRebookTrip?: (trip: Ride) => void;
  surgeMultiplier: number;
  onOpenDriverWizard?: () => void;
  onOpenFlightTracker?: () => void;
}

export const RiderHomeServicesView: React.FC<RiderHomeServicesViewProps> = ({
  pickup,
  onDetectGps,
  isDetectingGps,
  customerUser,
  onSelectService,
  onChooseCurrentLocation,
  onSelectDestinationDirect,
  onOpenTripHistory,
  pastTripsCount = 0,
  lastTrip,
  onRebookTrip,
  surgeMultiplier,
  onOpenFlightTracker,
}) => {
  const quickDestinations = [
    {
      id: 'loc_airport_cmb',
      name: 'Bandaranaike Airport (CMB)',
      subtitle: 'Katunayake · Airport',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_airport_cmb'),
    },
    {
      id: 'loc_colombo_fort',
      name: 'Colombo Fort Station',
      subtitle: 'Colombo 01 · Transit',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_colombo_fort'),
    },
    {
      id: 'loc_galle_fort',
      name: 'Galle Dutch Fort',
      subtitle: 'Galle · Heritage',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_galle_fort'),
    },
    {
      id: 'loc_kandy_tooth',
      name: 'Temple of the Tooth',
      subtitle: 'Kandy · Cultural',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_kandy_tooth'),
    },
  ];

  const firstName = customerUser?.isLoggedIn && customerUser?.name
    ? customerUser.name.split(' ')[0]
    : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-5 space-y-5 bg-slate-950">
      {/* 1. Simple Greeting & Surge Notice (only if active) */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Ayubowan{firstName ? `, ${firstName}` : ''}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight">
            Where can we take you?
          </h2>
        </div>
        {surgeMultiplier > 1 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 whitespace-nowrap">
            <Flame className="w-3.5 h-3.5" />
            <span className="tabular-nums">{surgeMultiplier}x demand</span>
          </div>
        )}
      </div>

      {/* 2. Prominent "Where to?" Primary Search Bar */}
      <button
        type="button"
        id="home-where-to-search-btn"
        onClick={() => onSelectService('ride')}
        className="w-full px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/60 rounded-2xl text-left transition-colors flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">Where to?</p>
            <p className="text-xs text-slate-400 truncate">
              Enter destination in Colombo, Kandy, Galle or Airport
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* 3. Current Pickup Row */}
      <div className="px-3.5 py-2.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              From: {pickup.name}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{pickup.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onDetectGps}
            disabled={isDetectingGps}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
            title="Use current GPS location"
            aria-label="Use current GPS location"
          >
            {isDetectingGps ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Crosshair className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onChooseCurrentLocation}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 transition-colors"
          >
            Change
          </button>
        </div>
      </div>

      {/* 4. Clean 4-Service Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-400">Services</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            id="home-service-rides"
            onClick={() => onSelectService('ride')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-colors text-left flex flex-col gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Rides</p>
              <p className="text-xs text-slate-400 truncate">Tuk, Cab & Van</p>
            </div>
          </button>

          <button
            type="button"
            id="home-service-delivery"
            onClick={() => onSelectService('delivery')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-colors text-left flex flex-col gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Courier</p>
              <p className="text-xs text-slate-400 truncate">Same-day parcels</p>
            </div>
          </button>

          <button
            type="button"
            id="home-service-tours"
            onClick={() => onSelectService('tour')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-colors text-left flex flex-col gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Tours</p>
              <p className="text-xs text-slate-400 truncate">Galle, Kandy, Ella</p>
            </div>
          </button>

          <button
            type="button"
            id="home-service-rentals"
            onClick={() => onSelectService('rental')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-colors text-left flex flex-col gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Hourly</p>
              <p className="text-xs text-slate-400 truncate">Car with driver</p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Recent Trip Rebook (if available) */}
      {lastTrip && onRebookTrip && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <History className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {lastTrip.pickup.name} → {lastTrip.dropoff.name}
              </p>
              <p className="text-[11px] text-slate-400 tabular-nums">
                Recent · LKR {lastTrip.fare.totalLkr.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRebookTrip(lastTrip)}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shrink-0"
          >
            Rebook
          </button>
        </div>
      )}

      {/* 6. Popular Destinations List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400">Popular Destinations</h3>
          {onOpenFlightTracker && (
            <button
              type="button"
              id="home-airport-tracker-banner"
              onClick={onOpenFlightTracker}
              className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <Plane className="w-3.5 h-3.5" />
              <span>CMB Flight Tracker</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
          {quickDestinations.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.loc) onSelectDestinationDirect(item.loc);
              }}
              className="w-full px-3.5 py-2.5 hover:bg-slate-800/60 text-left transition-colors flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 7. Quiet Activity Shortcut */}
      {onOpenTripHistory && (
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Verified Sri Lanka Fleet</span>
          <button
            type="button"
            onClick={onOpenTripHistory}
            className="text-emerald-400 hover:underline font-medium tabular-nums"
          >
            Past Trips ({pastTripsCount})
          </button>
        </div>
      )}
    </div>
  );
};
