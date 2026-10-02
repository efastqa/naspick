import React, { useState } from 'react';
import { 
  Palmtree, 
  MapPin, 
  Clock, 
  Car, 
  Compass, 
  Wifi, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ChevronRight, 
  DollarSign, 
  Plane, 
  Waves, 
  Camera, 
  Navigation,
  Globe,
  Info
} from 'lucide-react';
import { TouristTourPackage, VehicleCategory, LocationPoint, CurrencyMode } from '../../types';
import { TOURIST_TOUR_PACKAGES, SRI_LANKA_LOCATIONS } from '../../data/mockLocations';

interface TouristTourExplorerProps {
  onBookTour: (tour: TouristTourPackage, pickupLoc: LocationPoint, dropoffLoc: LocationPoint) => void;
  currency?: CurrencyMode;
  onSelectCityHub?: (hub: 'all' | 'colombo' | 'kandy' | 'kurunegala' | 'negombo' | 'galle') => void;
}

export const TouristTourExplorer: React.FC<TouristTourExplorerProps> = ({
  onBookTour,
  currency = 'LKR',
  onSelectCityHub,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'galle' | 'kandy' | 'cultural' | 'wildlife' | 'airport'>('all');
  const [activeCurrency, setActiveCurrency] = useState<CurrencyMode>(currency);
  const [selectedTour, setSelectedTour] = useState<TouristTourPackage | null>(null);

  // Conversion rates (approximate for display)
  const currencyRates: Record<CurrencyMode, { symbol: string; rateFromLkr: number }> = {
    LKR: { symbol: 'LKR', rateFromLkr: 1 },
    USD: { symbol: '$', rateFromLkr: 1 / 302.5 },
    EUR: { symbol: '€', rateFromLkr: 1 / 328.0 },
    GBP: { symbol: '£', rateFromLkr: 1 / 394.0 },
    AUD: { symbol: 'A$', rateFromLkr: 1 / 198.5 },
  };

  const formatPrice = (lkrAmount: number) => {
    const { symbol, rateFromLkr } = currencyRates[activeCurrency];
    if (activeCurrency === 'LKR') {
      return `LKR ${lkrAmount.toLocaleString()}`;
    }
    const converted = Math.round(lkrAmount * rateFromLkr);
    return `${symbol} ${converted.toLocaleString()} ${activeCurrency}`;
  };

  const filteredTours = TOURIST_TOUR_PACKAGES.filter((tour) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'galle') return tour.destinationHub.toLowerCase().includes('galle');
    if (selectedFilter === 'kandy') return tour.destinationHub.toLowerCase().includes('kandy');
    if (selectedFilter === 'cultural') return tour.destinationHub.toLowerCase().includes('cultural');
    if (selectedFilter === 'wildlife') return tour.id.includes('mirissa') || tour.highlights.some(h => h.toLowerCase().includes('safari'));
    if (selectedFilter === 'airport') return tour.id.includes('airport');
    return true;
  });

  const handleBookNow = (tour: TouristTourPackage) => {
    const pickup = SRI_LANKA_LOCATIONS.find((l) => l.id === tour.pickupSuggestedId) || SRI_LANKA_LOCATIONS[0];
    const dropoff = SRI_LANKA_LOCATIONS.find((l) => l.id === tour.dropoffSuggestedId) || SRI_LANKA_LOCATIONS[1];
    
    if (tour.destinationHub.toLowerCase().includes('galle') && onSelectCityHub) {
      onSelectCityHub('galle');
    }
    
    onBookTour(tour, pickup, dropoff);
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto">
      {/* Hero Banner with Ceylon Island Atmosphere */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-sky-950 border border-emerald-500/30 p-4 sm:p-5 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
              <Palmtree className="w-3.5 h-3.5" />
              <span>Sri Lanka Tourism Verified</span>
            </span>

            {/* Currency Quick-Toggle for Tourists */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-[11px] font-bold">
              {(['LKR', 'USD', 'EUR', 'GBP'] as CurrencyMode[]).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setActiveCurrency(cur)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    activeCurrency === cur
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-heading leading-tight">
            Travel Anywhere in Sri Lanka
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
            Private chauffeur-driven day trips & multi-city tours across <strong>Galle Dutch Fort</strong>, beaches, tea hill country, ancient ruins & wildlife parks.
          </p>

          {/* Tourist Standard Inclusions Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>All Highway Tolls</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span>English Chauffeurs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Free 4G Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>No Haggling / Touts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            selectedFilter === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Tours ({TOURIST_TOUR_PACKAGES.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('galle')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            selectedFilter === 'galle'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🏰 Galle & South</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('kandy')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            selectedFilter === 'kandy'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🛕 Kandy & Tea Hills</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('cultural')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            selectedFilter === 'cultural'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🏛️ Sigiriya & Ancient</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('wildlife')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            selectedFilter === 'wildlife'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🐋 Whales & Safari</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('airport')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            selectedFilter === 'airport'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>✈️ Airport VIP</span>
        </button>
      </div>

      {/* Tour Cards Grid */}
      <div className="space-y-4">
        {filteredTours.map((tour) => {
          const isSelected = selectedTour?.id === tour.id;
          return (
            <div
              key={tour.id}
              className={`rounded-2xl border overflow-hidden transition-all bg-slate-950/70 ${
                isSelected
                  ? 'border-emerald-500 ring-1 ring-emerald-500/60 shadow-xl'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Tour Header & Image */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    {tour.badge}
                  </span>
                </div>

                {/* Duration Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-200 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tour.duration}</span>
                </div>

                {/* Title & Hub Overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tour.destinationHub}</span>
                    <span>•</span>
                    <span>{tour.kmEstimated} km circuit</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-heading leading-tight drop-shadow-md">
                    {tour.title}
                  </h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 flex flex-col gap-3">
                <p className="text-xs text-slate-300 italic">
                  "{tour.tagline}"
                </p>

                {/* Highlights Checklist */}
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    Tour Highlights Included:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                    {tour.highlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inclusions Strip */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                  {tour.inclusions.slice(0, 3).map((inc, i) => (
                    <span key={i} className="flex items-center gap-1 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{inc}</span>
                    </span>
                  ))}
                </div>

                {/* Price & Book Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                      Transparent All-Inclusive Rate:
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-emerald-400 font-heading">
                        {formatPrice(tour.baseFareLkr)}
                      </span>
                      {activeCurrency !== 'USD' && (
                        <span className="text-xs text-slate-500 font-mono">
                          (~${tour.baseFareUsd} USD)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookNow(tour)}
                    className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Book Tour Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Islandwide Custom Concierge Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Custom Tour Anywhere in Sri Lanka:</strong> Have a specific itinerary or multi-day journey? Simply choose any pickup and dropoff on the map or contact our 24/7 tourist helpline at <strong className="text-emerald-400">+94 77 526 0765</strong> via WhatsApp.
        </div>
      </div>
    </div>
  );
};
