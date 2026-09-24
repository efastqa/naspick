import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Clock, 
  Users, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Info, 
  Flame, 
  KeyRound,
  X,
  Calendar,
  Plane,
  Plus,
  Trash2,
  Share2,
  Package,
  Layers,
  ArrowRight,
  Send,
  Check,
  ArrowUpDown,
  User,
  Home,
  Briefcase,
  RefreshCw,
  Crosshair,
  Compass
} from 'lucide-react';
import { 
  LocationPoint, 
  VehicleCategory, 
  Ride, 
  VehicleOption, 
  Language, 
  BookingServiceMode,
  DeliveryDetails,
  CustomerUser,
  CustomerSavedPlace,
  PRIMARY_SAFETY_CONTACT,
  PRIMARY_SAFETY_CONTACT_INTL
} from '../../types';
import { 
  SRI_LANKA_LOCATIONS, 
  VEHICLE_OPTIONS, 
  FOCUS_HUBS, 
  POPULAR_TARGET_ROUTES, 
  PopularTargetRoute, 
  calculateDistanceKm, 
  calculateFare 
} from '../../data/mockLocations';
import { TRANSLATIONS, RENTAL_PACKAGES } from '../../data/translations';
import { detectBrowserLocation, createGpsLocationPoint, savedPlaceToLocationPoint } from '../../utils/locationUtils';
import { LankaQrModal } from '../Payment/LankaQrModal';
import { LiveTrackingSafetyModal } from '../Safety/LiveTrackingSafetyModal';
import { DriverRiderChatModal } from '../Chat/DriverRiderChatModal';
import { AudioCallModal } from '../Chat/AudioCallModal';
import { DeliveryForm } from '../Delivery/DeliveryForm';

interface RiderBookingPanelProps {
  pickup: LocationPoint;
  dropoff: LocationPoint;
  intermediateStops?: LocationPoint[];
  onSelectPickup: (loc: LocationPoint) => void;
  onSelectDropoff: (loc: LocationPoint) => void;
  onAddStop?: (loc: LocationPoint) => void;
  onRemoveStop?: (index: number) => void;
  activeRide: Ride | null;
  onRequestRide: (rideData: {
    vehicleCategory: VehicleCategory;
    paymentMethod: 'cash' | 'card' | 'payhere' | 'lankaqr';
    fare: any;
    riderPhone: string;
    isScheduled?: boolean;
    scheduledTime?: string;
    flightNumber?: string;
    includeExpressway?: boolean;
    intermediateStops?: LocationPoint[];
    splitWithCount?: number;
    serviceMode?: BookingServiceMode;
    deliveryDetails?: DeliveryDetails;
    rentalPackageId?: string;
  }) => void;
  onCancelRide: () => void;
  surgeMultiplier: number;
  language?: Language;
  onSendSms?: (phone: string, text: string) => void;
  selectedCityHub?: 'all' | 'colombo' | 'kandy' | 'kurunegala' | 'negombo';
  onSelectCityHub?: (hub: 'all' | 'colombo' | 'kandy' | 'kurunegala' | 'negombo') => void;
  vehicleOptions?: VehicleOption[];
  expresswayTollLkr?: number;
  customerUser?: CustomerUser | null;
  onOpenCustomerAuth?: () => void;
}

export const RiderBookingPanel: React.FC<RiderBookingPanelProps> = ({
  pickup,
  dropoff,
  intermediateStops = [],
  onSelectPickup,
  onSelectDropoff,
  onAddStop,
  onRemoveStop,
  activeRide,
  onRequestRide,
  onCancelRide,
  surgeMultiplier,
  language = 'en',
  onSendSms,
  selectedCityHub = 'all',
  onSelectCityHub,
  vehicleOptions,
  expresswayTollLkr = 300,
  customerUser,
  onOpenCustomerAuth,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const activeVehicleOptions = vehicleOptions && vehicleOptions.length > 0 ? vehicleOptions : VEHICLE_OPTIONS;

  // Active service mode tab: 'ride' | 'delivery' | 'rental'
  const [serviceMode, setServiceMode] = useState<BookingServiceMode>('ride');

  // Core Booking State
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('tuk');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'payhere' | 'lankaqr'>('cash');
  const [riderPhone, setRiderPhone] = useState(customerUser?.phone || '+94 77 982 1092');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [showFareBreakdown, setShowFareBreakdown] = useState(false);

  // Live GPS Location Detection
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (customerUser?.phone) {
      setRiderPhone(customerUser.phone);
    }
  }, [customerUser?.phone]);

  const handleDetectGpsLocation = async () => {
    setIsDetectingGps(true);
    setGpsStatusMessage('Locating your GPS position in Sri Lanka...');
    try {
      const geo = await detectBrowserLocation();
      if (geo.success) {
        const point = createGpsLocationPoint(geo.lat, geo.lng, geo.accuracy);
        onSelectPickup(point);
        setGpsStatusMessage(`📍 Synced to GPS: Near ${geo.nearestLocation?.name || 'Colombo'} (±${geo.accuracy || 15}m)`);
        setTimeout(() => setGpsStatusMessage(null), 4500);
      } else {
        setGpsStatusMessage(geo.errorMessage || 'GPS unavailable');
        setTimeout(() => setGpsStatusMessage(null), 4500);
      }
    } catch {
      setGpsStatusMessage('Location request timed out');
      setTimeout(() => setGpsStatusMessage(null), 4500);
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Scheduled / Airport Transfer
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState('Tomorrow, 04:30 AM');
  const [flightNumber, setFlightNumber] = useState('');
  const [isAirportTrip, setIsAirportTrip] = useState(dropoff.city === 'Katunayake' || dropoff.name.includes('Airport'));

  // Expressway Toll Toggle
  const [includeExpressway, setIncludeExpressway] = useState(false);

  // Split Fare Calculator
  const [showSplitFare, setShowSplitFare] = useState(false);
  const [splitRidersCount, setSplitRidersCount] = useState(2);
  const [splitShared, setSplitShared] = useState(false);

  // Selected Rental Package
  const [selectedRental, setSelectedRental] = useState(RENTAL_PACKAGES[0]);

  // Easy Opinions & Quick-Pick Priority Filter: 'all' | 'budget' | 'fastest' | 'comfort' | 'group'
  const [easyOpinion, setEasyOpinion] = useState<'all' | 'budget' | 'fastest' | 'comfort' | 'group'>('all');

  const handleSwapLocations = () => {
    const temp = pickup;
    onSelectPickup(dropoff);
    onSelectDropoff(temp);
  };

  const handleSelectOpinion = (op: 'all' | 'budget' | 'fastest' | 'comfort' | 'group') => {
    setEasyOpinion(op);
    if (op === 'budget') {
      setSelectedCategory('tuk');
    } else if (op === 'fastest') {
      const fastest = [...activeVehicleOptions].sort((a, b) => a.etaMins - b.etaMins)[0];
      if (fastest) setSelectedCategory(fastest.id);
    } else if (op === 'comfort') {
      setSelectedCategory('sedan');
    } else if (op === 'group') {
      setSelectedCategory('van');
    }
  };

  const handleSelectPopularRoute = (route: PopularTargetRoute) => {
    const pickLoc = SRI_LANKA_LOCATIONS.find((l) => l.id === route.pickupId);
    const dropLoc = SRI_LANKA_LOCATIONS.find((l) => l.id === route.dropoffId);
    if (pickLoc && dropLoc) {
      onSelectPickup(pickLoc);
      onSelectDropoff(dropLoc);
      if (route.tollRequired) {
        setIncludeExpressway(true);
      }
      setSelectedCategory(route.recommendedVehicleId);
      if (onSelectCityHub) {
        onSelectCityHub('all');
      }
    }
  };

  // Modal Dialogs State
  const [showLankaQrModal, setShowLankaQrModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAudioCallModal, setShowAudioCallModal] = useState(false);

  // Calculate Cumulative Route Distance (Pickup -> Intermediate Stops -> Dropoff)
  let totalDistanceKm = 0;
  if (intermediateStops.length > 0) {
    let prev = pickup;
    intermediateStops.forEach((stop) => {
      totalDistanceKm += calculateDistanceKm(prev.lat, prev.lng, stop.lat, stop.lng);
      prev = stop;
    });
    totalDistanceKm += calculateDistanceKm(prev.lat, prev.lng, dropoff.lat, dropoff.lng);
  } else {
    totalDistanceKm = calculateDistanceKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
  }
  totalDistanceKm = parseFloat(totalDistanceKm.toFixed(1));

  // Expressway toll calculation: E03 Katunayake / Central Expressway
  const tollFee = includeExpressway ? expresswayTollLkr : 0;

  const selectedVehicle = activeVehicleOptions.find((v) => v.id === selectedCategory) || activeVehicleOptions[0];
  const calculatedFare = calculateFare(selectedVehicle, totalDistanceKm, surgeMultiplier, appliedDiscount);
  
  // Adjusted fare with expressway toll
  const fare = {
    ...calculatedFare,
    expresswayTollLkr: tollFee,
    totalLkr: calculatedFare.totalLkr + tollFee,
  };

  // Promo code verification
  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'AYUBOWAN') {
      setAppliedDiscount(250);
      setPromoSuccess('Ayubowan promo applied! Rs. 250 off your ride.');
    } else if (code === 'NASPICK10') {
      const discount = Math.round(fare.totalLkr * 0.1);
      setAppliedDiscount(discount);
      setPromoSuccess('10% discount applied!');
    } else if (code === '') {
      setAppliedDiscount(0);
    } else {
      setPromoError('Invalid promo code. Try "AYUBOWAN" or "NASPICK10"');
    }
  };

  // Intermediate stop helper
  const handleAddIntermediateStop = () => {
    if (intermediateStops.length >= 2) return;
    const available = SRI_LANKA_LOCATIONS.filter(
      (l) => l.id !== pickup.id && l.id !== dropoff.id && !intermediateStops.some((s) => s.id === l.id)
    );
    if (available.length > 0 && onAddStop) {
      onAddStop(available[0]);
    }
  };

  // Submit Ride Request
  const handleProceedBooking = () => {
    if (paymentMethod === 'lankaqr') {
      setShowLankaQrModal(true);
      return;
    }
    dispatchBooking();
  };

  const dispatchBooking = () => {
    onRequestRide({
      vehicleCategory: selectedCategory,
      paymentMethod,
      fare,
      riderPhone,
      isScheduled,
      scheduledTime: isScheduled ? scheduledDateTime : undefined,
      flightNumber: flightNumber || undefined,
      includeExpressway,
      intermediateStops,
      splitWithCount: showSplitFare ? splitRidersCount : undefined,
      serviceMode,
    });
  };

  // Submit Delivery Request
  const handleDeliverySubmit = (details: DeliveryDetails, totalDeliveryLkr: number) => {
    onRequestRide({
      vehicleCategory: 'moto',
      paymentMethod: 'cash',
      fare: {
        baseFare: 220,
        distanceFare: totalDeliveryLkr - 220,
        timeFare: 0,
        surgeMultiplier: 1.0,
        discountLkr: 0,
        platformFee: Math.round(totalDeliveryLkr * 0.1),
        totalLkr: totalDeliveryLkr,
        distanceKm: totalDistanceKm,
        estimatedMinutes: Math.round(totalDistanceKm * 2.5),
      },
      riderPhone,
      serviceMode: 'delivery',
      deliveryDetails: details,
    });
  };

  // Submit Rental Request
  const handleRentalSubmit = () => {
    onRequestRide({
      vehicleCategory: selectedRental.recommendedVehicle as any,
      paymentMethod,
      fare: {
        baseFare: selectedRental.baseFareLkr,
        distanceFare: 0,
        timeFare: 0,
        surgeMultiplier: 1.0,
        discountLkr: 0,
        platformFee: Math.round(selectedRental.baseFareLkr * 0.12),
        totalLkr: selectedRental.baseFareLkr,
        distanceKm: selectedRental.kmIncluded,
        estimatedMinutes: selectedRental.hours * 60,
      },
      riderPhone,
      serviceMode: 'rental',
      rentalPackageId: selectedRental.id,
    });
  };

  return (
    <div
      id="rider-booking-panel"
      className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* ---------------- ACTIVE RIDE COCKPIT ---------------- */}
      {activeRide && activeRide.status !== 'idle' && activeRide.status !== 'completed' ? (
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Header Status */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {activeRide.status === 'searching' && t.findingDriver}
                {activeRide.status === 'accepted' && t.driverConfirmed}
                {activeRide.status === 'arriving' && t.driverArriving}
                {activeRide.status === 'in_progress' && t.tripInProgress}
              </span>
              <h3 className="text-lg font-bold text-white font-heading mt-0.5">
                {activeRide.serviceMode === 'delivery'
                  ? 'Naspick Flash Delivery'
                  : activeRide.status === 'in_progress'
                  ? 'En Route to Destination'
                  : 'Your Naspick Ride'}
              </h3>
            </div>

            {/* Ride Security OTP Badge */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">{t.rideOtp}</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-300 font-mono font-bold text-sm shadow-inner">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeRide.otp}</span>
              </div>
            </div>
          </div>

          {/* Delivery Recipient Banner if delivery mode */}
          {activeRide.deliveryDetails && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Recipient ({activeRide.deliveryDetails.parcelCategory.toUpperCase()})
                </span>
                <p className="font-bold text-white mt-0.5">{activeRide.deliveryDetails.recipientName}</p>
                <p className="text-[11px] text-slate-400">{activeRide.deliveryDetails.recipientPhone}</p>
              </div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded font-mono text-xs font-bold">
                {activeRide.deliveryDetails.packageWeightKg} kg
              </span>
            </div>
          )}

          {/* Driver Card with Interactive Actions */}
          {activeRide.driver && (
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeRide.driver.avatar}
                  alt={activeRide.driver.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-white text-base leading-tight">{activeRide.driver.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300">
                    <span className="flex items-center text-amber-400 font-semibold">
                      ★ {activeRide.driver.rating}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">{activeRide.driver.totalTrips} rides</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-800 text-emerald-300 border border-slate-700 font-mono font-bold text-xs rounded">
                      {activeRide.driver.vehiclePlate}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                      {activeRide.driver.vehicleModel}
                    </span>
                    {activeRide.driver.heading !== undefined && (
                      <span 
                        id="driver-card-heading-tag"
                        className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold rounded"
                        title={`Driver is currently heading ${activeRide.driver.heading}° on the live map`}
                      >
                        <Compass className="w-3 h-3 text-emerald-400 animate-spin-slow" />
                        <span>{activeRide.driver.heading}°</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Audio Call & Interactive In-App Chat */}
              <div className="flex items-center gap-2">
                <button
                  id="driver-call-trigger-btn"
                  onClick={() => setShowAudioCallModal(true)}
                  className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-colors shadow-sm"
                  title="Masked Call to Driver"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  id="driver-chat-trigger-btn"
                  onClick={() => setShowChatModal(true)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition-colors shadow-sm"
                  title="Chat with Driver"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          )}

          {/* Primary Safety Contact Bar (0775260765) */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Trusted Safety Contact
                </p>
                <p className="text-xs font-bold text-white font-mono">{PRIMARY_SAFETY_CONTACT_INTL}</p>
              </div>
            </div>
            <button
              id="live-safety-modal-trigger-btn"
              onClick={() => setShowSafetyModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Live</span>
            </button>
          </div>

          {/* Multi-Stop Route Path Display */}
          <div className="p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col gap-2 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Pickup</p>
                <p className="text-slate-200 font-semibold truncate">{activeRide.pickup.name}</p>
              </div>
            </div>

            {activeRide.intermediateStops && activeRide.intermediateStops.map((st, i) => (
              <div key={st.id} className="flex items-start gap-2.5 pl-0.5">
                <div className="w-2 h-2 rounded-full bg-sky-400 mt-1 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sky-400 text-[10px] uppercase font-bold">Stop {i + 1}</p>
                  <p className="text-slate-300 font-medium truncate">{st.name}</p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Destination</p>
                <p className="text-slate-200 font-semibold truncate">{activeRide.dropoff.name}</p>
              </div>
            </div>
          </div>

          {/* Fare Summary & Payment */}
          <div className="flex items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
            <div>
              <p className="text-slate-400 text-[11px]">Total Fare</p>
              <p className="text-lg font-bold text-white font-heading">
                LKR {activeRide.fare.totalLkr.toLocaleString()}
              </p>
              {activeRide.splitWithCount && activeRide.splitWithCount > 1 && (
                <p className="text-[10px] text-emerald-400 font-semibold">
                  Split between {activeRide.splitWithCount} riders (LKR {Math.round(activeRide.fare.totalLkr / activeRide.splitWithCount).toLocaleString()} each)
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 font-semibold rounded-lg text-xs uppercase flex items-center gap-1.5">
                {activeRide.paymentMethod === 'cash' ? (
                  <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                )}
                {activeRide.paymentMethod}
              </span>
            </div>
          </div>

          {/* Safety & SOS Strip */}
          <div className="flex items-center gap-2 pt-1">
            <button
              id="rider-sos-button"
              onClick={() => setShowSafetyModal(true)}
              className="flex-1 py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Emergency SOS (119)</span>
            </button>
            <button
              id="rider-cancel-button"
              onClick={onCancelRide}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              {t.cancelRide}
            </button>
          </div>
        </div>
      ) : (
        /* ---------------- PRE-BOOKING INTERFACE ---------------- */
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Service Navigation Tabs: Rides | Flash Courier | Hourly Rentals */}
          <div className="flex items-center bg-slate-950/90 border-b border-slate-800 p-1.5 gap-1">
            <button
              id="tab-rides"
              onClick={() => setServiceMode('ride')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                serviceMode === 'ride'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>{t.tabRides}</span>
            </button>

            <button
              id="tab-delivery"
              onClick={() => setServiceMode('delivery')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                serviceMode === 'delivery'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t.tabDelivery}</span>
            </button>

            <button
              id="tab-rentals"
              onClick={() => setServiceMode('rental')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                serviceMode === 'rental'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.tabRentals}</span>
            </button>
          </div>

          {/* TAB 1: FLASH COURIER MODE */}
          {serviceMode === 'delivery' && (
            <DeliveryForm
              pickup={pickup}
              dropoff={dropoff}
              onSelectPickup={onSelectPickup}
              onSelectDropoff={onSelectDropoff}
              onSubmitDelivery={handleDeliverySubmit}
            />
          )}

          {/* TAB 2: HOURLY / DAY RENTALS MODE */}
          {serviceMode === 'rental' && (
            <div className="p-5 flex flex-col gap-4 overflow-y-auto">
              <div>
                <h3 className="text-lg font-extrabold text-white font-heading">{t.hourlyPackages}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chauffeur-driven executive car or van waiting exclusively for you.
                </p>
              </div>

              <div className="space-y-2.5">
                {RENTAL_PACKAGES.map((pkg) => {
                  const isSelected = selectedRental.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedRental(pkg)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 shadow-md'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{pkg.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mt-1">
                            <span>{pkg.hours} {t.hoursIncluded}</span>
                            <span>•</span>
                            <span>{pkg.kmIncluded} {t.kmIncluded}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-white font-heading">
                            LKR {pkg.baseFareLkr.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            +{pkg.extraPerKmLkr} LKR/extra km
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">{pkg.description}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleRentalSubmit}
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{t.bookRental} ({selectedRental.title})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 3: REGULAR RIDES & MULTI-STOP BOOKING */}
          {serviceMode === 'ride' && (
            <div className="p-5 flex flex-col gap-4 overflow-y-auto">
              {/* Header Title & Surge Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white font-heading">{t.whereTo}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t.whereToSub}</p>
                </div>
                {surgeMultiplier > 1 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{surgeMultiplier}x Surge Active</span>
                  </div>
                )}
              </div>

              {/* Customer Account & Live Location Integration Bar */}
              {customerUser?.isLoggedIn ? (
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={customerUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                        alt={customerUser.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900"></span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{customerUser.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex-shrink-0">
                          {customerUser.tier}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {customerUser.phone} • {customerUser.rewardPoints} Naspick Pts
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCustomerAuth}
                    className="px-2.5 py-1 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-lg font-semibold flex items-center gap-1 transition-colors flex-shrink-0"
                  >
                    <Navigation className="w-3 h-3" />
                    <span className="hidden sm:inline">My Places & GPS</span>
                    <span className="sm:hidden">Places</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">Sign In for 1-Tap Booking</p>
                      <p className="text-[10px] text-slate-300 truncate">Auto-sync live GPS pickup location & SMS alerts.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCustomerAuth}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex-shrink-0"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Focus City Hubs Selector (Colombo, Kandy, Kurunegala, Negombo) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Target Focus Hubs
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Colombo • Kandy • Kurunegala • Negombo
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {FOCUS_HUBS.map((hub) => {
                    const isSelected = (selectedCityHub || 'all') === hub.id;
                    return (
                      <button
                        key={hub.id}
                        type="button"
                        onClick={() => {
                          if (onSelectCityHub) onSelectCityHub(hub.id);
                        }}
                        className={`p-1.5 rounded-xl border text-left transition-all flex flex-col items-center sm:items-start justify-center ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-base sm:text-sm">{hub.icon}</span>
                        <span className="text-[11px] font-bold truncate max-w-full">
                          {hub.name.split(' ')[0]}
                        </span>
                        <span className="hidden sm:inline text-[9px] text-slate-500 truncate">
                          {hub.sinhalaName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Target Routes (Intercity & Express Corridor) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Popular Target Routes
                  </span>
                  <span className="text-[10px] text-slate-500">1-Tap Load Route</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {POPULAR_TARGET_ROUTES.map((route) => (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => handleSelectPopularRoute(route)}
                      className="flex-shrink-0 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 transition-all text-left group w-52 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                            {route.highlightTag}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">
                            {route.estimatedKm} km
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {route.title}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {route.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 mt-2 text-[10px]">
                        <span className="text-slate-400 capitalize flex items-center gap-1">
                          <Car className="w-3 h-3 text-sky-400" />
                          {route.recommendedVehicleId}
                        </span>
                        <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5">
                          Select <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Route Box (Pickup, Intermediate Stops, Dropoff) */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col gap-3">
                {/* Pickup Point */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {t.pickupLocation}
                      </label>
                      <button
                        type="button"
                        id="auto-detect-gps-pickup-btn"
                        onClick={handleDetectGpsLocation}
                        disabled={isDetectingGps}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                        title="Use device GPS location"
                      >
                        {isDetectingGps ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                        ) : (
                          <Crosshair className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>{isDetectingGps ? 'Locating...' : 'Use My GPS'}</span>
                      </button>
                    </div>
                    {gpsStatusMessage && (
                      <p className="text-[10px] text-emerald-300 font-mono mt-0.5 animate-in fade-in truncate">
                        {gpsStatusMessage}
                      </p>
                    )}
                    <select
                      id="rider-select-pickup"
                      value={pickup.id}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.startsWith('saved_') && customerUser?.savedPlaces) {
                          const saved = customerUser.savedPlaces.find((s) => `saved_${s.id}` === val);
                          if (saved) onSelectPickup(savedPlaceToLocationPoint(saved));
                          return;
                        }
                        const found = SRI_LANKA_LOCATIONS.find((l) => l.id === val);
                        if (found) onSelectPickup(found);
                      }}
                      className="w-full bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer py-1"
                    >
                      {/* Customer Saved Places Group */}
                      {customerUser?.isLoggedIn && customerUser.savedPlaces && customerUser.savedPlaces.length > 0 && (
                        <optgroup label="⭐ My Saved Places" className="bg-slate-900 text-amber-400 font-bold">
                          {customerUser.savedPlaces.map((sp) => (
                            <option key={`pick_saved_${sp.id}`} value={`saved_${sp.id}`} className="bg-slate-900 text-white font-normal">
                              {sp.label}: {sp.name} ({sp.city})
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Live GPS Option if active */}
                      {pickup.popularTag === 'Live GPS' && (
                        <optgroup label="📍 Detected Device Location" className="bg-slate-900 text-emerald-400 font-bold">
                          <option value={pickup.id} className="bg-slate-900 text-emerald-300 font-bold">
                            {pickup.name} ({pickup.city})
                          </option>
                        </optgroup>
                      )}

                      <optgroup label="🏙️ Colombo (Capital & Port City)" className="bg-slate-900 text-emerald-400 font-bold">
                        {SRI_LANKA_LOCATIONS.filter((l) => l.city === 'Colombo').map((loc) => (
                          <option key={`pick_${loc.id}`} value={loc.id} className="bg-slate-900 text-white font-normal">
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🛕 Kandy (Sacred Hill Capital & Lake)" className="bg-slate-900 text-amber-400 font-bold">
                        {SRI_LANKA_LOCATIONS.filter((l) => l.city === 'Kandy').map((loc) => (
                          <option key={`pick_${loc.id}`} value={loc.id} className="bg-slate-900 text-white font-normal">
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🐘 Kurunegala (Elephant Rock & Wayamba)" className="bg-slate-900 text-purple-400 font-bold">
                        {SRI_LANKA_LOCATIONS.filter((l) => l.city === 'Kurunegala').map((loc) => (
                          <option key={`pick_${loc.id}`} value={loc.id} className="bg-slate-900 text-white font-normal">
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="✈️ Negombo (CMB Airport & Golden Beach)" className="bg-slate-900 text-sky-400 font-bold">
                        {SRI_LANKA_LOCATIONS.filter((l) => l.city === 'Negombo').map((loc) => (
                          <option key={`pick_${loc.id}`} value={loc.id} className="bg-slate-900 text-white font-normal">
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Intermediate Stops if added */}
                {intermediateStops.map((stop, idx) => (
                  <div key={stop.id} className="flex items-center gap-3 pl-1 bg-slate-900/60 p-2 rounded-lg border border-sky-500/20">
                    <div className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block">
                        {t.stop} {idx + 1}
                      </span>
                      <p className="text-xs text-slate-200 font-medium truncate">{stop.name}</p>
                    </div>
                    {onRemoveStop && (
                      <button
                        type="button"
                        onClick={() => onRemoveStop(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title={t.removeStop}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Intermediate Stop Button (Multi-Stop Route) */}
                {intermediateStops.length < 2 && (
                  <div className="pl-11">
                    <button
                      type="button"
                      id="add-intermediate-stop-btn"
                      onClick={handleAddIntermediateStop}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.addStop}</span>
                    </button>
                  </div>
                )}

                {/* Quick Swap Button */}
                <div className="relative flex items-center justify-center my-0.5">
                  <div className="w-full h-[1px] bg-slate-800"></div>
                  <button
                    type="button"
                    id="swap-pickup-dropoff-btn"
                    onClick={handleSwapLocations}
                    className="absolute px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all shadow-sm"
                    title="Swap Pickup & Destination"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span>Swap Route</span>
                  </button>
                </div>

                {/* Destination Dropoff */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t.destination}
                    </label>
                    <select
                      id="rider-select-dropoff"
                      value={dropoff.id}
                      onChange={(e) => {
                        const found = SRI_LANKA_LOCATIONS.find((l) => l.id === e.target.value);
                        if (found) onSelectDropoff(found);
                      }}
                      className="w-full bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer py-1"
                    >
                      <optgroup label="🏙️ Colombo (Capital & Port City)" className="bg-slate-900 text-emerald-400 font-bold">
                        {SRI_LANKA_LOCATIONS.filter((l) => l.city === 'Colombo').map((loc) => (
                          <option key={`drop_${loc.id}`} value={loc.id} className="bg-slate-900 text-white font-normal">
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🛕 Kandy (Sacred Hill Capital & Lake)" className="bg-slate-900 text-amber-400 font-bold">
                        {SRI_LANKA_LOCATIONS.filter((l) => l.city === 'Kandy').map((loc) => (
                          <option key={`drop_${loc.id}`} value={loc.id} className="bg-slate-900 text-white font-normal">
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🐘 Kurunegala (Elephant Rock & Wayamba)" className="bg-slate-900 text-purple-400 font-bold">
                        {SRI_LANKA_LOCATIONS.filter((l) => l.city === 'Kurunegala').map((loc) => (
                          <option key={`drop_${loc.id}`} value={loc.id} className="bg-slate-900 text-white font-normal">
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="✈️ Negombo (CMB Airport & Golden Beach)" className="bg-slate-900 text-sky-400 font-bold">
                        {SRI_LANKA_LOCATIONS.filter((l) => l.city === 'Negombo').map((loc) => (
                          <option key={`drop_${loc.id}`} value={loc.id} className="bg-slate-900 text-white font-normal">
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Popular Landmarks (Filtered by Selected Hub) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[11px] text-slate-400 flex-shrink-0 mr-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  Popular:
                </span>
                {(selectedCityHub && selectedCityHub !== 'all'
                  ? SRI_LANKA_LOCATIONS.filter((l) => l.city.toLowerCase() === selectedCityHub.toLowerCase())
                  : SRI_LANKA_LOCATIONS.filter((l) => l.popularTag)
                ).slice(0, 7).map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => onSelectDropoff(loc)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors border flex items-center gap-1 ${
                      dropoff.id === loc.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span>{loc.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-slate-400 opacity-80 font-normal">({loc.city})</span>
                  </button>
                ))}
              </div>

              {/* Advance Booking & Airport Transfer Toggle */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white">{t.scheduleForLater}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {isScheduled && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                          Pickup Time
                        </label>
                        <input
                          type="text"
                          value={scheduledDateTime}
                          onChange={(e) => setScheduledDateTime(e.target.value)}
                          className="w-full py-1.5 px-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                          {t.flightNumber}
                        </label>
                        <div className="relative">
                          <Plane className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            placeholder={t.flightPlaceholder}
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            className="w-full py-1.5 pl-8 pr-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white uppercase placeholder:text-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 block">
                      ✓ Driver assigned 30 mins before departure with flight delay tracking.
                    </span>
                  </div>
                )}
              </div>

              {/* Expressway Toll Toggle */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <span className="text-slate-200 font-semibold">{t.useExpressway}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Airport E03 / Southern E01 fast track (+LKR 300)
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeExpressway}
                    onChange={(e) => setIncludeExpressway(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Fleet Selection Carousel */}
              <div>
                {/* Easy Opinions / 1-Tap Priority Filter Bar */}
                <div className="mb-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Easy Options for Vehicle Pick</span>
                    </span>
                    <span className="text-[10px] text-slate-400">1-Tap Filter</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    <button
                      type="button"
                      id="opinion-budget"
                      onClick={() => handleSelectOpinion('budget')}
                      className={`p-2 rounded-lg border font-semibold flex items-center gap-1.5 transition-all text-left ${
                        easyOpinion === 'budget'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base leading-none">⚡</span>
                      <div>
                        <span className="block font-bold">Lowest Fare</span>
                        <span className="text-[9px] text-slate-400 block">Tuk & Moto</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="opinion-fastest"
                      onClick={() => handleSelectOpinion('fastest')}
                      className={`p-2 rounded-lg border font-semibold flex items-center gap-1.5 transition-all text-left ${
                        easyOpinion === 'fastest'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base leading-none">⏱️</span>
                      <div>
                        <span className="block font-bold">Fastest ETA</span>
                        <span className="text-[9px] text-slate-400 block">Nearest Driver</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="opinion-comfort"
                      onClick={() => handleSelectOpinion('comfort')}
                      className={`p-2 rounded-lg border font-semibold flex items-center gap-1.5 transition-all text-left ${
                        easyOpinion === 'comfort'
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base leading-none">❄️</span>
                      <div>
                        <span className="block font-bold">AC Comfort</span>
                        <span className="text-[9px] text-slate-400 block">Cool Air Car</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="opinion-group"
                      onClick={() => handleSelectOpinion('group')}
                      className={`p-2 rounded-lg border font-semibold flex items-center gap-1.5 transition-all text-left ${
                        easyOpinion === 'group'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 ring-1 ring-purple-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base leading-none">👥</span>
                      <div>
                        <span className="block font-bold">Family / Van</span>
                        <span className="text-[9px] text-slate-400 block">4 to 7 Seats</span>
                      </div>
                    </button>
                  </div>

                  {easyOpinion !== 'all' && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Filtered for: <strong className="uppercase">{easyOpinion}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectOpinion('all')}
                        className="text-[10px] text-slate-400 hover:text-white underline"
                      >
                        Reset to show all ({activeVehicleOptions.length})
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {t.chooseFleet}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {t.estimatedDistance}: <strong className="text-white">{totalDistanceKm} km</strong>
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {activeVehicleOptions.filter((veh) => {
                    if (easyOpinion === 'budget') return veh.id === 'tuk' || veh.id === 'moto';
                    if (easyOpinion === 'comfort') return veh.ac;
                    if (easyOpinion === 'group') return veh.capacity >= 4;
                    return true;
                  }).map((veh) => {
                    const isSelected = selectedCategory === veh.id;
                    const vehFare = calculateFare(veh, totalDistanceKm, surgeMultiplier, appliedDiscount);
                    const vehTotal = vehFare.totalLkr + tollFee;
                    const opinionTag = 
                      veh.id === 'tuk' ? '⚡ Lowest Fare' :
                      veh.id === 'moto' ? '⏱️ Solo Express' :
                      veh.id === 'nano' ? '❄️ Budget AC' :
                      veh.id === 'sedan' ? '⭐ Premium AC' :
                      veh.id === 'van' ? '👥 7 Seats & Bags' : '';

                    return (
                      <button
                        key={veh.id}
                        id={`vehicle-option-${veh.id}`}
                        onClick={() => setSelectedCategory(veh.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-500/50'
                            : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              veh.id === 'tuk'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-emerald-400 border border-slate-700'
                            }`}
                          >
                            {veh.id === 'tuk' ? (
                              <span className="font-extrabold text-sm tracking-tighter text-amber-300 font-heading">
                                TUK
                              </span>
                            ) : (
                              <Car className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-xs md:text-sm">{veh.name}</span>
                              {opinionTag && (
                                <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-300 text-[9px] font-bold rounded border border-emerald-500/30">
                                  {opinionTag}
                                </span>
                              )}
                              {veh.popular && !opinionTag && (
                                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded border border-emerald-500/30">
                                  POPULAR
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-emerald-400" />
                                {veh.etaMins} {t.minsAway}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {veh.capacity} {t.seats}
                              </span>
                              {veh.ac && (
                                <>
                                  <span>•</span>
                                  <span className="text-sky-400 font-semibold text-[10px]">{t.ac}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Fare in LKR */}
                        <div className="text-right">
                          <span className="text-sm font-bold text-white font-heading block">
                            LKR {vehTotal.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {Math.round(veh.perKmLkr)} LKR/km
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Split Fare Calculator with Friends */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">{t.splitFare}</span>
                  </div>
                  <button
                    onClick={() => setShowSplitFare(!showSplitFare)}
                    className="text-[11px] font-semibold text-emerald-400 hover:underline"
                  >
                    {showSplitFare ? 'Hide' : 'Calculate'}
                  </button>
                </div>

                {showSplitFare && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t.splitWith}:</span>
                      <div className="flex items-center gap-1">
                        {[2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() => setSplitRidersCount(num)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                              splitRidersCount === num
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-300">Each rider pays:</span>
                      <span className="font-extrabold text-emerald-400 text-sm font-heading">
                        LKR {Math.round(fare.totalLkr / splitRidersCount).toLocaleString()} {t.perPerson}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Hey! Let's split our Naspick ride from ${pickup.name} to ${dropoff.name}. Total: LKR ${fare.totalLkr}, our share is LKR ${Math.round(
                          fare.totalLkr / splitRidersCount
                        )} each.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{t.sendSplitWhatsapp}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="rider-promo-input"
                    type="text"
                    placeholder={t.promoCodePlaceholder}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full py-2 pl-3 pr-8 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white uppercase placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {appliedDiscount > 0 && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 top-2.5" />
                  )}
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  {t.apply}
                </button>
              </div>
              {promoSuccess && <p className="text-[11px] text-emerald-400 font-medium -mt-2">{promoSuccess}</p>}
              {promoError && <p className="text-[11px] text-rose-400 font-medium -mt-2">{promoError}</p>}

              {/* Payment Method Selector (PayHere, Cash, Card, LankaQR) */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {t.paymentMethod}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="pay-method-cash"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>{t.cashToDriver}</span>
                  </button>

                  <button
                    id="pay-method-card"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-sky-400" />
                    <span>{t.visaMaster}</span>
                  </button>

                  <button
                    id="pay-method-payhere"
                    onClick={() => setPaymentMethod('payhere')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      paymentMethod === 'payhere'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded bg-amber-500 text-slate-950 font-bold text-[8px] flex items-center justify-center">
                      P
                    </div>
                    <span>{t.payhereGateway}</span>
                  </button>

                  <button
                    id="pay-method-lankaqr"
                    onClick={() => {
                      setPaymentMethod('lankaqr');
                      setShowLankaQrModal(true);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      paymentMethod === 'lankaqr'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded bg-emerald-600 text-white font-bold text-[8px] flex items-center justify-center">
                      QR
                    </div>
                    <span>{t.lankaQrGenie}</span>
                  </button>
                </div>
              </div>

              {/* Fare Summary & Request CTA */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <button
                    onClick={() => setShowFareBreakdown(!showFareBreakdown)}
                    className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px] underline decoration-slate-600"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showFareBreakdown ? t.hideBreakdown : t.viewBreakdown}</span>
                  </button>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 mr-1">{t.total}:</span>
                    <span className="text-lg font-black text-white font-heading">
                      LKR {fare.totalLkr.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Breakdown Accordion */}
                {showFareBreakdown && (
                  <div className="p-3 mb-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] space-y-1.5 text-slate-300 animate-in fade-in">
                    <div className="flex justify-between">
                      <span>Base Fare ({selectedVehicle.name})</span>
                      <span>LKR {fare.baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance ({totalDistanceKm} km × LKR {selectedVehicle.perKmLkr})</span>
                      <span>LKR {fare.distanceFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Time ({fare.estimatedMinutes} mins)</span>
                      <span>LKR {fare.timeFare}</span>
                    </div>
                    {includeExpressway && (
                      <div className="flex justify-between text-sky-400">
                        <span>Expressway Toll (E03 / E01)</span>
                        <span>+LKR 300</span>
                      </div>
                    )}
                    {surgeMultiplier > 1 && (
                      <div className="flex justify-between text-amber-400">
                        <span>Peak Rush Surcharge ({surgeMultiplier}x)</span>
                        <span>+{Math.round((fare.totalLkr - fare.baseFare) * (surgeMultiplier - 1))} LKR</span>
                      </div>
                    )}
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Promo Code Discount</span>
                        <span>-LKR {appliedDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500 text-[10px] pt-1 border-t border-slate-800">
                      <span>Platform safety & automated SMS fees included</span>
                      <span>✓</span>
                    </div>
                  </div>
                )}

                {/* Main CTA */}
                <button
                  id="rider-confirm-book-button"
                  onClick={handleProceedBooking}
                  className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>
                    {t.confirmRide} {selectedVehicle.name.split(' ')[1]}
                    {isScheduled ? ` (${scheduledDateTime})` : ''}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[10px] text-slate-500 mt-2">
                  SMS alerts sent to contact {PRIMARY_SAFETY_CONTACT} & your device with OTP security.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LankaQR Modal */}
      <LankaQrModal
        isOpen={showLankaQrModal}
        onClose={() => setShowLankaQrModal(false)}
        amountLkr={fare.totalLkr}
        rideId={`NPK-${Math.floor(100000 + Math.random() * 900000)}`}
        onPaymentSuccess={() => {
          setPaymentMethod('lankaqr');
          dispatchBooking();
        }}
      />

      {/* Advanced Safety Shield Modal with Contact 0775260765 */}
      <LiveTrackingSafetyModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        rideId={activeRide?.id || 'NPK-729104'}
        pickup={pickup}
        dropoff={dropoff}
        driver={activeRide?.driver}
        onSendSmsToContact={onSendSms}
      />

      {/* In-App Driver Chat Modal */}
      {activeRide && activeRide.driver && (
        <DriverRiderChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          driver={activeRide.driver}
          onStartCall={() => setShowAudioCallModal(true)}
        />
      )}

      {/* Masked Audio Call Modal */}
      {activeRide && activeRide.driver && (
        <AudioCallModal
          isOpen={showAudioCallModal}
          onClose={() => setShowAudioCallModal(false)}
          driver={activeRide.driver}
        />
      )}
    </div>
  );
};
