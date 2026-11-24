import React from 'react';
import { 
  X, 
  Car, 
  Package, 
  Plane, 
  Clock, 
  Palmtree, 
  Navigation, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Flame,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { BookingServiceMode, LocationPoint } from '../../types';
import { SRI_LANKA_LOCATIONS } from '../../data/mockLocations';

interface UberServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: BookingServiceMode) => void;
  onOpenFlightTracker?: () => void;
  onSelectDestination?: (loc: LocationPoint) => void;
  theme?: 'dark' | 'light';
  surgeMultiplier?: number;
}

export const UberServicesModal: React.FC<UberServicesModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  onOpenFlightTracker,
  onSelectDestination,
  theme = 'dark',
  surgeMultiplier = 1.0,
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const servicesList = [
    {
      id: 'ride',
      title: 'City Rides',
      tagline: 'Tuk-Tuk, Nano Cab, Sedan & Van for instant door-to-door trips',
      mode: 'ride' as BookingServiceMode,
      icon: Car,
      badge: 'Popular',
      color: 'emerald',
      cta: 'Book Ride',
    },
    {
      id: 'delivery',
      title: 'Flash Courier Delivery',
      tagline: 'Instant parcel, key & document delivery with recipient OTP verification',
      mode: 'delivery' as BookingServiceMode,
      icon: Package,
      badge: 'Fast OTP',
      color: 'sky',
      cta: 'Send Package',
    },
    {
      id: 'airport',
      title: 'Airport CMB Express',
      tagline: 'Katunayake Expressway (E03) terminal pickups & flight tracker',
      mode: 'ride' as BookingServiceMode,
      icon: Plane,
      badge: 'Highway AC',
      color: 'indigo',
      cta: 'Airport Transfer',
      isFlightTracker: true,
    },
    {
      id: 'tour',
      title: 'Islandwide Tourist Tours',
      tagline: 'Curated day tours to Galle Fort, Kandy Tooth Relic & Sigiriya',
      mode: 'tour' as BookingServiceMode,
      icon: Palmtree,
      badge: 'Day Tours',
      color: 'amber',
      cta: 'Explore Tours',
    },
    {
      id: 'rental',
      title: 'Hourly City Rental',
      tagline: 'Dedicated vehicle & chauffeur on-demand for 2, 4, or 8 hours',
      mode: 'rental' as BookingServiceMode,
      icon: Clock,
      badge: 'Chauffeur',
      color: 'teal',
      cta: 'Rent Hourly',
    },
    {
      id: 'intercity',
      title: 'Intercity Expressway',
      tagline: 'Colombo ⇄ Galle (E01) & Colombo ⇄ Kandy highway corridor',
      mode: 'ride' as BookingServiceMode,
      icon: Navigation,
      badge: 'Intercity',
      color: 'emerald',
      cta: 'Highway Trip',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-colors border ${
          isLight 
            ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-slate-300/50' 
            : 'bg-slate-950 border-slate-800 text-slate-100 shadow-black/80'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black font-heading tracking-tight">
                Services
              </h2>
              {surgeMultiplier > 1 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/30">
                  <Flame className="w-3 h-3" />
                  {surgeMultiplier}x
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Go anywhere or get anything delivered across Sri Lanka
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Services List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {servicesList.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    if (svc.isFlightTracker && onOpenFlightTracker) {
                      onOpenFlightTracker();
                    } else {
                      onSelectService(svc.mode);
                    }
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between group shadow-sm hover:shadow-md relative overflow-hidden ${
                    isLight 
                      ? 'bg-white hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-400' 
                      : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {svc.badge}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-black text-sm font-heading group-hover:text-emerald-500 transition-colors">
                      {svc.title}
                    </h3>
                    <p className={`text-[11px] line-clamp-2 mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {svc.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 mt-3 pt-2 border-t border-slate-800/40">
                    <span>{svc.cta}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Hub Transfer Shortcuts */}
          <div className="pt-2">
            <span className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Popular Direct Destinations
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Bandaranaike Airport (CMB)', locId: 'loc_airport_cmb', icon: '✈️' },
                { name: 'Colombo Fort Station', locId: 'loc_colombo_fort', icon: '🚆' },
                { name: 'Galle Dutch Fort', locId: 'loc_galle_fort', icon: '🏰' },
                { name: 'Temple of the Tooth (Kandy)', locId: 'loc_kandy_tooth', icon: '🛕' },
              ].map((dest) => (
                <button
                  key={dest.locId}
                  type="button"
                  onClick={() => {
                    const found = SRI_LANKA_LOCATIONS.find((l) => l.id === dest.locId);
                    if (found && onSelectDestination) {
                      onSelectDestination(found);
                    }
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-colors ${
                    isLight 
                      ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className="text-base">{dest.icon}</span>
                  <span className="truncate">{dest.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
