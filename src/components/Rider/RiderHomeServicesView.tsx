import React from 'react';
import { 
  Car, 
  Package, 
  Palmtree, 
  Layers, 
  Search, 
  MapPin, 
  Crosshair, 
  RefreshCw, 
  Sparkles, 
  ChevronRight, 
  History, 
  ShieldCheck, 
  Clock, 
  Navigation,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  LocationPoint, 
  CustomerUser, 
  BookingServiceMode, 
  Ride 
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
  onOpenDriverWizard,
}) => {
  // 5 Top Popular Sri Lanka Quick Destinations
  const quickDestinations = [
    {
      id: 'loc_airport_cmb',
      name: 'Bandaranaike Airport (CMB)',
      city: 'Negombo',
      tag: 'Airport',
      icon: '✈️',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_airport_cmb'),
    },
    {
      id: 'loc_colombo_fort',
      name: 'Colombo Fort Station',
      city: 'Colombo',
      tag: 'Transit',
      icon: '🚆',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_colombo_fort'),
    },
    {
      id: 'loc_galle_fort',
      name: 'Galle Dutch Fort',
      city: 'Galle',
      tag: 'Heritage',
      icon: '🏰',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_galle_fort'),
    },
    {
      id: 'loc_kandy_tooth',
      name: 'Temple of the Tooth',
      city: 'Kandy',
      tag: 'Cultural',
      icon: '🛕',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_kandy_tooth'),
    },
    {
      id: 'loc_galle_face',
      name: 'Galle Face Green',
      city: 'Colombo',
      tag: 'Coastal',
      icon: '🌊',
      loc: SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_galle_face'),
    },
  ];

  const userName = customerUser?.name ? customerUser.name.split(' ')[0] : 'Rider';

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-5 space-y-5 bg-slate-950">
      {/* 1. Welcome & Greeting Banner */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Ayubowan {customerUser?.isLoggedIn ? `· ${userName}` : ''}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
            Where can we take you?
          </h2>
        </div>
        {surgeMultiplier > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>{surgeMultiplier}x Surge</span>
          </div>
        )}
      </div>

      {/* 2. Current Location (Pickup) Bar */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Current Location (Pickup)
            </span>
            <p className="text-xs font-bold text-white truncate mt-0.5">
              {pickup.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {pickup.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onDetectGps}
            disabled={isDetectingGps}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-xl transition-colors border border-slate-700/80"
            title="Locate via GPS"
          >
            {isDetectingGps ? (
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onChooseCurrentLocation}
            className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
          >
            Change
          </button>
        </div>
      </div>

      {/* 3. Primary 4 Services Grid: Rides, Flash Courier, Tourist Tours, Hourly Rental */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Choose Service
          </span>
          <span className="text-[10px] text-slate-500">Tap to start booking</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Card 1: Rides */}
          <button
            type="button"
            id="home-service-rides"
            onClick={() => onSelectService('ride')}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/60 transition-all text-left group shadow-lg flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[9px] rounded-full uppercase">
                Popular
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm sm:text-base font-black text-white font-heading group-hover:text-emerald-300 transition-colors">
                Rides
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                Tuk, Nano Cab, Sedan & Van
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-2">
              <span>Book Ride · 2 Steps</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 2: Flash Courier */}
          <button
            type="button"
            id="home-service-delivery"
            onClick={() => onSelectService('delivery')}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/60 transition-all text-left group shadow-lg flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5 text-sky-400" />
              </div>
              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold text-[9px] rounded-full uppercase">
                Fast
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm sm:text-base font-black text-white font-heading group-hover:text-sky-300 transition-colors">
                Flash Courier
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                Parcels & documents with OTP
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-sky-400 mt-2">
              <span>Send Package · 2 Steps</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 3: Tourist Tours */}
          <button
            type="button"
            id="home-service-tours"
            onClick={() => onSelectService('tour')}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/60 transition-all text-left group shadow-lg flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Palmtree className="w-5 h-5 text-amber-400" />
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[9px] rounded-full uppercase">
                Day Tours
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm sm:text-base font-black text-white font-heading group-hover:text-amber-300 transition-colors">
                Tourist Tours
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                Galle Fort, Sigiriya, Kandy, Ella
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 mt-2">
              <span>Explore Packages · 2 Steps</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 4: Hourly Rental */}
          <button
            type="button"
            id="home-service-rentals"
            onClick={() => onSelectService('rental')}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/60 transition-all text-left group shadow-lg flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold text-[9px] rounded-full uppercase">
                Chauffeur
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm sm:text-base font-black text-white font-heading group-hover:text-purple-300 transition-colors">
                Hourly Rental
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                Car & driver with unlimited stops
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-400 mt-2">
              <span>View Rates · 2 Steps</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. Uber-Style Big "Where to?" Search Bar */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Search Destination
        </span>
        <button
          type="button"
          id="home-where-to-search-btn"
          onClick={() => onSelectService('ride')}
          className="w-full p-4 bg-slate-900/90 hover:bg-slate-900 border border-slate-700/90 hover:border-emerald-500/70 rounded-2xl text-left transition-all shadow-xl flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 group-hover:text-emerald-400 flex items-center justify-center transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Where to?
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                Search Colombo, Kandy, Galle, Airport, Railway...
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-emerald-500 text-slate-300 group-hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1">
            <span>Choose Location</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* 5. Quick Destinations Horizontal Strip */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Popular Destinations
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {quickDestinations.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.loc) {
                  onSelectDestinationDirect(item.loc);
                }
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group flex items-center gap-2"
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{item.city}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Past Activity & 1-Tap Re-book Quick Banner */}
      {lastTrip && onRebookTrip && (
        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0">
              <History className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Recent Trip</span>
              <p className="text-xs font-bold text-white truncate">
                {lastTrip.pickup.name} → {lastTrip.dropoff.name}
              </p>
              <p className="text-[10px] font-mono text-emerald-400">
                LKR {lastTrip.fare.totalLkr.toLocaleString()} · {lastTrip.vehicleCategory.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRebookTrip(lastTrip)}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex-shrink-0"
          >
            Rebook
          </button>
        </div>
      )}

      {/* 7. Earn with Naspick Driver Partner Card */}
      {onOpenDriverWizard && (
        <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Drive & Earn</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded">5% Flat Fee</span>
              </div>
              <p className="text-xs font-bold text-white truncate">Register Your Tuk, Car or Van</p>
              <p className="text-[10px] text-slate-400 truncate">Earn up to LKR 180,000/mo + daily LankaClear CEFT cashouts</p>
            </div>
          </div>
          <button
            type="button"
            id="home-register-driver-btn"
            onClick={onOpenDriverWizard}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex-shrink-0 active:scale-95"
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Safety & Islandwide Trust Badge */}
      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DMT Sri Lanka Verified Fleet</span>
        </span>
        {onOpenTripHistory && (
          <button
            type="button"
            onClick={onOpenTripHistory}
            className="hover:text-emerald-400 font-semibold transition-colors"
          >
            View Activity ({pastTripsCount})
          </button>
        )}
      </div>
    </div>
  );
};
