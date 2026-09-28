import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navigation/Navbar';
import { SriLankaMap } from './components/Map/SriLankaMap';
import { RiderBookingPanel } from './components/Rider/RiderBookingPanel';
import { TripRatingModal } from './components/Rider/TripRatingModal';
import { TripHistoryModal } from './components/Rider/TripHistoryModal';
import { TripReceiptModal } from './components/Rider/TripReceiptModal';
import { LostItemModal } from './components/Rider/LostItemModal';
import { ShareTripModal } from './components/Rider/ShareTripModal';
import { DriverDashboard } from './components/Driver/DriverDashboard';
import { AddDriverModal } from './components/Driver/AddDriverModal';
import { AdminControl } from './components/Admin/AdminControl';
import { AdminPasswordModal } from './components/Admin/AdminPasswordModal';
import { SmsNotificationDrawer } from './components/Notifications/SmsNotificationDrawer';
import { PageSettingsModal } from './components/Common/PageSettingsModal';
import { OfflineIndicator } from './components/Common/OfflineIndicator';
import { CustomerAuthModal } from './components/Customer/CustomerAuthModal';
import { SRI_LANKA_LOCATIONS, VEHICLE_OPTIONS } from './data/mockLocations';
import { INITIAL_DRIVERS, INITIAL_PAYOUTS, INITIAL_DRIVER_APPLICATIONS } from './data/mockDrivers';
import { INITIAL_TRIP_HISTORY } from './data/mockTripHistory';
import { INITIAL_CUSTOMER_USER } from './utils/locationUtils';
import { 
  LocationPoint, 
  Driver, 
  Ride, 
  SmsNotification, 
  PushNotification, 
  DriverPayout, 
  DriverApplication, 
  VehicleCategory, 
  VehicleOption,
  Language, 
  DeviceViewMode, 
  AppSettings, 
  CustomerUser,
  CityHubId,
  PRIMARY_SAFETY_CONTACT, 
  PRIMARY_SAFETY_CONTACT_INTL 
} from './types';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Tablet, 
  Smartphone, 
  Monitor, 
  ShieldCheck,
  Map as MapIcon,
  Car,
  User,
  Lock,
  MessageSquare,
  Layers,
  Compass
} from 'lucide-react';

let uniqueEventIdCounter = 0;
const createUniqueEventId = (prefix: string) => {
  uniqueEventIdCounter += 1;
  return `${prefix}_${Date.now()}_${uniqueEventIdCounter}_${Math.random().toString(36).slice(2, 7)}`;
};

export default function App() {
  const [currentRole, setCurrentRole] = useState<'rider' | 'driver' | 'admin'>('rider');
  const [language, setLanguage] = useState<Language>('en');
  const [pickup, setPickup] = useState<LocationPoint>(SRI_LANKA_LOCATIONS[0]); // Galle Face Green
  const [dropoff, setDropoff] = useState<LocationPoint>(SRI_LANKA_LOCATIONS[1]); // Fort Railway Station
  const [intermediateStops, setIntermediateStops] = useState<LocationPoint[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [selectedDriverId, setSelectedDriverId] = useState<string>(INITIAL_DRIVERS[0]?.id || 'drv_1');
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState<boolean>(false);
  const [payouts, setPayouts] = useState<DriverPayout[]>(INITIAL_PAYOUTS);
  const [applications, setApplications] = useState<DriverApplication[]>(INITIAL_DRIVER_APPLICATIONS);
  const [surgeMultiplier, setSurgeMultiplier] = useState<number>(1.0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    deviceViewMode: 'web',
    currency: 'LKR',
    language: 'en',
    soundAlertsEnabled: true,
    lowDataMode: false,
    highContrastMap: false,
  });
  const [showSmsDrawer, setShowSmsDrawer] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [completedRideForRating, setCompletedRideForRating] = useState<Ride | null>(null);

  // Focus City Hub Selection (Galle, Colombo, Kandy, Kurunegala, Negombo)
  const [selectedCityHub, setSelectedCityHub] = useState<CityHubId>('all');
  const [mobileTab, setMobileTab] = useState<'panel' | 'map' | 'split'>('split');

  const handleSelectCityHub = (hub: CityHubId) => {
    setSelectedCityHub(hub);
    if (hub === 'galle') {
      const p = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_galle_fort');
      const d = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_unawatuna_beach');
      if (p && d) {
        setPickup(p);
        setDropoff(d);
      }
    } else if (hub === 'kandy') {
      const p = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_kandy_station');
      const d = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_kandy_tooth');
      if (p && d) {
        setPickup(p);
        setDropoff(d);
      }
    } else if (hub === 'kurunegala') {
      const p = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_kurunegala_clock');
      const d = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_kurunegala_rock');
      if (p && d) {
        setPickup(p);
        setDropoff(d);
      }
    } else if (hub === 'negombo') {
      const p = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_airport_cmb');
      const d = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_negombo_beach');
      if (p && d) {
        setPickup(p);
        setDropoff(d);
      }
    } else if (hub === 'colombo') {
      const p = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_galle_face');
      const d = SRI_LANKA_LOCATIONS.find((l) => l.id === 'loc_lotus_tower');
      if (p && d) {
        setPickup(p);
        setDropoff(d);
      }
    }
  };

  // Admin Control Panel Password Protection
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('naspick_admin_password') || 'naspick2026';
    } catch {
      return 'naspick2026';
    }
  });

  const handleSaveAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    try {
      localStorage.setItem('naspick_admin_password', newPass);
    } catch {}
  };

  // Dynamic Vehicle Tariff Pricing & Expressway Toll State (Configurable by Admin)
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>(() => {
    try {
      const saved = localStorage.getItem('naspick_vehicle_pricing');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return VEHICLE_OPTIONS;
  });

  const [expresswayTollLkr, setExpresswayTollLkr] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('naspick_expressway_toll');
      if (saved) return Number(saved);
    } catch {}
    return 300;
  });

  const handleUpdateVehiclePricing = (updated: VehicleOption[]) => {
    setVehicleOptions(updated);
    try {
      localStorage.setItem('naspick_vehicle_pricing', JSON.stringify(updated));
    } catch {}
  };

  const handleResetVehiclePricing = () => {
    setVehicleOptions(VEHICLE_OPTIONS);
    try {
      localStorage.removeItem('naspick_vehicle_pricing');
    } catch {}
  };

  const handleUpdateExpresswayToll = (toll: number) => {
    setExpresswayTollLkr(toll);
    try {
      localStorage.setItem('naspick_expressway_toll', String(toll));
    } catch {}
  };

  // Customer Account & Live Location Integration State
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('naspick_customer_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_CUSTOMER_USER;
  });
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState<boolean>(false);

  const handleCustomerLogin = (user: CustomerUser, detectedLocation?: LocationPoint) => {
    setCustomerUser(user);
    try {
      localStorage.setItem('naspick_customer_user', JSON.stringify(user));
    } catch {}

    // Integrate login location directly to booking pickup
    if (detectedLocation) {
      setPickup(detectedLocation);
      addSms(
        user.phone,
        `Naspick Welcome: Signed in successfully. Your live GPS pickup has been locked to ${detectedLocation.name} (${detectedLocation.city}). Enjoy your 1-tap ride booking!`,
        'driver_arriving'
      );
    } else {
      addSms(
        user.phone,
        `Naspick Welcome: Signed in as ${user.name}. Your VIP account is active with ${user.rewardPoints} reward points.`,
        'driver_arriving'
      );
    }
  };

  const handleCustomerLogout = () => {
    if (customerUser) {
      const loggedOutUser: CustomerUser = {
        ...customerUser,
        isLoggedIn: false,
      };
      setCustomerUser(loggedOutUser);
      try {
        localStorage.setItem('naspick_customer_user', JSON.stringify(loggedOutUser));
      } catch {}
    }
  };

  // Passenger Past Trips & Activity History State
  const [pastTrips, setPastTrips] = useState<Ride[]>(() => {
    try {
      const saved = localStorage.getItem('naspick_past_trips');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_TRIP_HISTORY;
  });
  const [showTripHistoryModal, setShowTripHistoryModal] = useState<boolean>(false);
  const [selectedReceiptRide, setSelectedReceiptRide] = useState<Ride | null>(null);
  const [selectedLostItemRide, setSelectedLostItemRide] = useState<Ride | null>(null);
  const [showShareTripModal, setShowShareTripModal] = useState<boolean>(false);

  const handleRebookTrip = (trip: Ride) => {
    setPickup(trip.pickup);
    setDropoff(trip.dropoff);
    if (trip.intermediateStops && trip.intermediateStops.length > 0) {
      setIntermediateStops(trip.intermediateStops);
    } else {
      setIntermediateStops([]);
    }
    setCurrentRole('rider');
    triggerPush('Route Loaded', `Re-booking route to ${trip.dropoff.name}`);
    addSms(
      customerUser?.phone || '+94 77 982 1092',
      `Naspick 1-Tap Rebook: Loaded route ${trip.pickup.name} -> ${trip.dropoff.name}. Confirm your vehicle to request driver!`,
      'trip_started'
    );
  };

  const handleSubmitLostItem = (report: {
    rideId: string;
    itemType: string;
    description: string;
    contactPhone: string;
    driverPhone: string;
    driverName: string;
  }) => {
    addSms(
      report.driverPhone,
      `URGENT NASPICK ALERT: Passenger on trip ${report.rideId} reported a lost item (${report.itemType.toUpperCase()} - ${report.description}). Please inspect vehicle and call passenger at ${report.contactPhone}.`,
      'safety_alert'
    );
    addSms(
      report.contactPhone,
      `Naspick Lost & Found: Ticket logged for your lost ${report.itemType}. Driver ${report.driverName} has been alerted via urgent SMS. 24/7 Helpline: 077 526 0765.`,
      'safety_alert'
    );
    triggerPush('Lost Item Report Sent', `Driver ${report.driverName} has been notified via priority SMS.`);
  };

  const handleSelectRole = (role: 'rider' | 'driver' | 'admin') => {
    if (role === 'admin') {
      if (!isAdminAuthenticated) {
        setShowAdminPasswordModal(true);
        return;
      }
    }
    setCurrentRole(role);
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthenticated(true);
    setShowAdminPasswordModal(false);
    setCurrentRole('admin');
  };

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentRole('rider');
  };

  // SMS and Push list
  const [smsList, setSmsList] = useState<SmsNotification[]>([
    {
      id: 'sms_welcome',
      recipientPhone: '+94 77 982 1092',
      senderId: 'NASPICK-LK',
      message: 'Ayubowan! Welcome to Naspick Sri Lanka. Connect with nearby tuk-tuks, cabs, and vans with real-time GPS tracking and transparent LKR fares.',
      timestamp: 'Just now',
      carrier: 'Dialog Axiata',
      status: 'delivered',
      type: 'otp',
    },
  ]);

  const [pushList, setPushList] = useState<PushNotification[]>([
    {
      id: 'push_1',
      title: 'Ayubowan to Naspick',
      body: 'Get Rs. 250 off your first tuk or car ride with promo code AYUBOWAN.',
      timestamp: '1 min ago',
      read: false,
      type: 'info',
    },
  ]);

  // Sync with backend API
  useEffect(() => {
    fetch('/api/drivers')
      .then((res) => res.json())
      .then((data) => {
        if (data.drivers) setDrivers(data.drivers);
        if (data.surgeMultiplier) setSurgeMultiplier(data.surgeMultiplier);
      })
      .catch(() => {
        // Fallback to local state if fetch fails
      });

    fetch('/api/rides/active')
      .then((res) => res.json())
      .then((data) => {
        if (data.activeRide) setActiveRide(data.activeRide);
      })
      .catch(() => {});

    fetch('/api/notifications/sms')
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications && data.notifications.length > 0) {
          setSmsList((prev) => {
            const seen = new Set<string>();
            const result: SmsNotification[] = [];
            for (const item of [...data.notifications, ...prev]) {
              const itemId = item.id || createUniqueEventId('sms');
              if (!seen.has(itemId)) {
                seen.add(itemId);
                result.push({ ...item, id: itemId });
              }
            }
            return result;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Dispatch local push alert
  const triggerPush = (title: string, body: string) => {
    const id = createUniqueEventId('push');
    const newPush: PushNotification = {
      id,
      title,
      body,
      timestamp: 'Just now',
      read: false,
      type: 'info',
    };
    setPushList((prev) => [newPush, ...prev.filter((p) => p.id !== id)]);
  };

  // Add SMS locally
  const addSms = (phone: string, msg: string, type: any) => {
    const id = createUniqueEventId('sms');
    const newSms: SmsNotification = {
      id,
      recipientPhone: phone || '+94 77 982 1092',
      senderId: 'NASPICK-LK',
      message: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      carrier: 'Dialog Axiata',
      status: 'delivered',
      type,
    };
    setSmsList((prev) => [newSms, ...prev.filter((s) => s.id !== id)]);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.language && newSettings.language !== language) {
        setLanguage(newSettings.language);
      }
      return updated;
    });
  };

  const playAudioChime = (freq = 587.33) => {
    if (!settings.soundAlertsEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {}
  };

  // Stop management
  const handleAddIntermediateStop = (stop: LocationPoint) => {
    if (intermediateStops.length < 2) {
      setIntermediateStops((prev) => [...prev, stop]);
    }
  };

  const handleRemoveIntermediateStop = (index: number) => {
    setIntermediateStops((prev) => prev.filter((_, i) => i !== index));
  };

  // Rider Requests a Ride / Courier / Rental
  const handleRequestRide = async (rideData: {
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
    serviceMode?: any;
    deliveryDetails?: any;
    rentalPackageId?: string;
  }) => {
    try {
      const res = await fetch('/api/rides/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riderName: 'Sahan Dissanayake',
          riderPhone: rideData.riderPhone,
          pickup,
          dropoff,
          vehicleCategory: rideData.vehicleCategory,
          fare: rideData.fare,
          paymentMethod: rideData.paymentMethod,
          isScheduled: rideData.isScheduled,
          scheduledTime: rideData.scheduledTime,
          flightNumber: rideData.flightNumber,
          includeExpressway: rideData.includeExpressway,
          intermediateStops: rideData.intermediateStops || intermediateStops,
          splitWithCount: rideData.splitWithCount,
          serviceMode: rideData.serviceMode,
          deliveryDetails: rideData.deliveryDetails,
          rentalPackageId: rideData.rentalPackageId,
        }),
      });
      const data = await res.json();
      if (data.ride) {
        const enrichedRide: Ride = {
          ...data.ride,
          intermediateStops: rideData.intermediateStops || intermediateStops,
          isScheduled: rideData.isScheduled,
          scheduledTime: rideData.scheduledTime,
          flightNumber: rideData.flightNumber,
          includeExpressway: rideData.includeExpressway,
          splitWithCount: rideData.splitWithCount,
          serviceMode: rideData.serviceMode || 'ride',
          deliveryDetails: rideData.deliveryDetails,
          rentalPackageId: rideData.rentalPackageId,
        };
        setActiveRide(enrichedRide);
        triggerPush(
          rideData.serviceMode === 'delivery'
            ? 'Flash Courier Booked'
            : rideData.serviceMode === 'tour'
            ? 'Tourist Tour Booked'
            : 'Ride Confirmed',
          `Driver ${enrichedRide.driver?.name} is on the way.`
        );
        addSms(
          rideData.riderPhone,
          `Naspick: Driver ${enrichedRide.driver?.name} (${enrichedRide.driver?.vehiclePlate}, ${enrichedRide.driver?.vehicleModel}) accepted your request. Share OTP ${enrichedRide.otp} to start.`,
          'driver_assigned'
        );
        // Automated Safety SMS to User's Primary Emergency Contact (0775260765)
        addSms(
          PRIMARY_SAFETY_CONTACT,
          `Naspick Safety Alert: Sahan Dissanayake booked a ride to ${dropoff.name}. Driver: ${enrichedRide.driver?.name} (${enrichedRide.driver?.vehiclePlate}). Live Tracking: https://naspick.lk/track/${enrichedRide.id}. Emergency helpline: 119.`,
          'safety_alert'
        );
      }
    } catch (e) {
      // Local fallback
      const mockDriver = drivers[0];
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const localRide: Ride = {
        id: `NPK-${Math.floor(100000 + Math.random() * 900000)}`,
        riderId: 'usr_1',
        riderName: 'Sahan Dissanayake',
        riderPhone: rideData.riderPhone,
        pickup,
        dropoff,
        intermediateStops: rideData.intermediateStops || intermediateStops,
        vehicleCategory: rideData.vehicleCategory,
        driver: mockDriver,
        status: 'accepted',
        fare: rideData.fare,
        paymentMethod: rideData.paymentMethod,
        paymentStatus: 'pending',
        otp,
        createdAt: Date.now(),
        isScheduled: rideData.isScheduled,
        scheduledTime: rideData.scheduledTime,
        flightNumber: rideData.flightNumber,
        includeExpressway: rideData.includeExpressway,
        splitWithCount: rideData.splitWithCount,
        serviceMode: rideData.serviceMode || 'ride',
        deliveryDetails: rideData.deliveryDetails,
        rentalPackageId: rideData.rentalPackageId,
      };
      setActiveRide(localRide);
      playAudioChime(659.25);
      triggerPush(
        rideData.serviceMode === 'delivery'
          ? 'Flash Courier Booked'
          : rideData.serviceMode === 'tour'
          ? 'Tourist Tour Booked'
          : 'Ride Confirmed',
        `Driver ${mockDriver.name} is on the way.`
      );
      addSms(
        rideData.riderPhone,
        `Naspick: Driver ${mockDriver.name} (${mockDriver.vehiclePlate}) accepted your request. Share OTP ${otp} to begin.`,
        'driver_assigned'
      );
      // Automated Safety SMS to User's Primary Emergency Contact (0775260765)
      addSms(
        PRIMARY_SAFETY_CONTACT,
        `Naspick Safety Alert: Sahan Dissanayake booked a trip to ${dropoff.name}. Driver: ${mockDriver.name} (${mockDriver.vehiclePlate}). Live Tracking: https://naspick.lk/track/${localRide.id}. Emergency helpline: 119.`,
        'safety_alert'
      );
    }
  };

  // Driver Accepts Ride
  const handleDriverAccept = () => {
    if (activeRide) {
      setActiveRide({
        ...activeRide,
        status: 'accepted',
      });
      triggerPush('Driver Accepted', 'Driver is on the way to pickup point.');
    }
  };

  // Driver Arrives at Pickup
  const handleDriverArrived = async () => {
    try {
      const res = await fetch('/api/rides/arrived', { method: 'POST' });
      const data = await res.json();
      if (data.ride) {
        setActiveRide(data.ride);
        playAudioChime(784.00);
        triggerPush('Driver Arrived', `Your driver has arrived at ${activeRide?.pickup.name}`);
        addSms(
          activeRide?.riderPhone || '+94 77 982 1092',
          `Naspick: Your driver ${activeRide?.driver?.name} has arrived at ${activeRide?.pickup.name}. Please meet at vehicle ${activeRide?.driver?.vehiclePlate}. Share OTP ${activeRide?.otp} to begin.`,
          'driver_arrived'
        );
      }
    } catch (e) {
      if (activeRide) {
        setActiveRide({ ...activeRide, status: 'arriving' });
      }
    }
  };

  // Driver Starts Ride
  const handleDriverStart = async (otp: string) => {
    try {
      const res = await fetch('/api/rides/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (data.ride) {
        setActiveRide(data.ride);
        triggerPush('Trip Started', `En route to ${activeRide?.dropoff.name}`);
        addSms(
          activeRide?.riderPhone || '+94 77 982 1092',
          `Naspick: Trip started to ${activeRide?.dropoff.name}. Track live route. Have a safe journey!`,
          'trip_started'
        );
      }
    } catch (e) {
      if (activeRide) {
        setActiveRide({ ...activeRide, status: 'in_progress' });
      }
    }
  };

  // Driver Completes Ride
  const handleDriverComplete = async () => {
    try {
      const res = await fetch('/api/rides/complete', { method: 'POST' });
      const data = await res.json();
      if (data.ride) {
        setCompletedRideForRating(data.ride);
        setShowRatingModal(true);
        setActiveRide(null);
        // Persist to past trips history
        setPastTrips((prev) => {
          const updated = [data.ride, ...prev.filter((r) => r.id !== data.ride.id)];
          try {
            localStorage.setItem('naspick_past_trips', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        playAudioChime(880.00);
        triggerPush('Trip Completed', `Total LKR ${data.ride.fare.totalLkr.toLocaleString()} paid.`);
        addSms(
          data.ride.riderPhone || '+94 77 982 1092',
          `Naspick e-Receipt: Trip to ${data.ride.dropoff.name} completed. Total: LKR ${data.ride.fare.totalLkr.toLocaleString()} (${data.ride.paymentMethod.toUpperCase()}). View e-Receipt in Activity tab.`,
          'trip_completed'
        );
      }
    } catch (e) {
      if (activeRide) {
        const completedLocal: Ride = { ...activeRide, status: 'completed', completedAt: Date.now() };
        setCompletedRideForRating(completedLocal);
        setShowRatingModal(true);
        setActiveRide(null);
        setPastTrips((prev) => {
          const updated = [completedLocal, ...prev.filter((r) => r.id !== completedLocal.id)];
          try {
            localStorage.setItem('naspick_past_trips', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    }
  };

  // Cancel Ride
  const handleCancelRide = async () => {
    try {
      await fetch('/api/rides/cancel', { method: 'POST' });
    } catch (e) {}
    setActiveRide(null);
    triggerPush('Ride Cancelled', 'Your ride has been cancelled.');
  };

  // Rate Ride & Tip
  const handleSubmitRating = async (rating: number, review: string, tipLkr: number) => {
    try {
      await fetch('/api/rides/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review, tipLkr }),
      });
      if (tipLkr > 0 && completedRideForRating?.driver) {
        addSms(
          completedRideForRating.driver.phone,
          `Naspick Partner: You received a passenger tip of LKR ${tipLkr} for your 5-star service! Keep up the great driving.`,
          'payout'
        );
      }
    } catch (e) {}
    setShowRatingModal(false);
    setCompletedRideForRating(null);
    triggerPush('Rating Submitted', 'Thank you for helping keep the Naspick community trusted!');
  };

  // Driver Payout
  const handleRequestPayout = async (amountLkr: number, bankName: string, accountNumber: string) => {
    const targetDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0] || INITIAL_DRIVERS[0];
    try {
      const res = await fetch('/api/drivers/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: targetDriver.id,
          amountLkr,
          bankName,
          accountNumber,
        }),
      });
      const data = await res.json();
      if (data.payout) {
        setPayouts((prev) => [data.payout, ...prev]);
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === targetDriver.id ? { ...d, walletBalanceLkr: data.currentBalance } : d
          )
        );
        addSms(
          targetDriver.phone,
          `Naspick Finance: Instant payout of LKR ${amountLkr.toLocaleString()} transferred via LankaClear CEFT to ${bankName} (${accountNumber.slice(-4)}). Ref: ${data.payout.referenceNo}.`,
          'payout'
        );
      }
    } catch (e) {
      // Local fallback
      const newPayout: DriverPayout = {
        id: createUniqueEventId('pay'),
        driverId: targetDriver.id,
        driverName: targetDriver.name,
        amountLkr,
        bankName,
        accountNumber,
        requestedAt: 'Just now',
        status: 'completed',
        referenceNo: `CEFT-LK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };
      setPayouts((prev) => [newPayout, ...prev]);
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === targetDriver.id
            ? { ...d, walletBalanceLkr: Math.max(0, d.walletBalanceLkr - amountLkr) }
            : d
        )
      );
    }
  };

  // Toggle Driver Online
  const handleToggleOnline = async (isOnline: boolean) => {
    const targetDriverId = selectedDriverId || drivers[0]?.id;
    try {
      await fetch('/api/drivers/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: targetDriverId, isOnline }),
      });
    } catch (e) {}
    setDrivers((prev) =>
      prev.map((d) => (d.id === targetDriverId ? { ...d, isOnline } : d))
    );
  };

  // Toggle Any Driver Status
  const handleToggleDriverStatus = async (driverId: string, isOnline: boolean) => {
    try {
      await fetch('/api/drivers/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, isOnline }),
      });
    } catch (e) {}
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, isOnline } : d))
    );
  };

  // Onboard New Driver
  const handleAddDriver = async (newDriverData: Partial<Driver>) => {
    try {
      const res = await fetch('/api/drivers/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriverData),
      });
      const data = await res.json();
      if (data.driver) {
        setDrivers((prev) => [data.driver, ...prev]);
        setSelectedDriverId(data.driver.id);
        triggerPush('Driver Onboarded', `${data.driver.name} joined the Naspick fleet.`);
        addSms(
          data.driver.phone,
          `Ayubowan ${data.driver.name}! Your Naspick Driver Partner account has been activated. Plate: ${data.driver.vehiclePlate}. Go online to receive trip requests!`,
          'driver_assigned'
        );
      }
    } catch (e) {
      const fallbackId = createUniqueEventId('drv');
      const fullDriver: Driver = {
        id: fallbackId,
        name: newDriverData.name || 'New Driver Partner',
        phone: newDriverData.phone || '+94 77 123 4567',
        avatar: newDriverData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        rating: 5.0,
        totalTrips: 0,
        isOnline: true,
        isBusy: false,
        vehicleCategory: (newDriverData.vehicleCategory as VehicleCategory) || 'sedan',
        vehicleModel: newDriverData.vehicleModel || 'Toyota Prius',
        vehiclePlate: newDriverData.vehiclePlate || 'WP CAB-1122',
        vehicleColor: newDriverData.vehicleColor || 'White',
        currentLat: newDriverData.currentLat || 6.9271,
        currentLng: newDriverData.currentLng || 79.8612,
        heading: newDriverData.heading || 90,
        earningsTodayLkr: 0,
        walletBalanceLkr: newDriverData.walletBalanceLkr || 5000,
        nicNumber: newDriverData.nicNumber || '199218204123',
        verificationStatus: newDriverData.verificationStatus || 'approved',
        bankDetails: {
          bankName: newDriverData.bankDetails?.bankName || 'Commercial Bank of Ceylon',
          accountNumber: newDriverData.bankDetails?.accountNumber || '8004921045',
          branch: newDriverData.bankDetails?.branch || 'Colombo 03',
          accountHolder: newDriverData.bankDetails?.accountHolder || (newDriverData.name || 'Driver Partner'),
        },
      };
      setDrivers((prev) => [fullDriver, ...prev]);
      setSelectedDriverId(fallbackId);
      triggerPush('Driver Onboarded', `${fullDriver.name} added to Naspick fleet.`);
    }
    setIsAddDriverModalOpen(false);
  };

  // Reset Driver Fleet to 10 Sri Lankan Drivers
  const handleResetDrivers = async () => {
    try {
      const res = await fetch('/api/drivers/reset', { method: 'POST' });
      const data = await res.json();
      if (data.drivers) {
        setDrivers(data.drivers);
        setSelectedDriverId(data.drivers[0]?.id || 'drv_1');
        triggerPush('Fleet Reset', 'Driver list successfully restored to 10 verified Sri Lankan drivers.');
        addSms(
          PRIMARY_SAFETY_CONTACT,
          'Naspick Fleet System: Default fleet roster of 10 Sri Lankan drivers successfully reloaded.',
          'payout'
        );
      }
    } catch (e) {
      setDrivers(INITIAL_DRIVERS);
      setSelectedDriverId(INITIAL_DRIVERS[0]?.id || 'drv_1');
    }
  };

  // Admin Verify Driver Application
  const handleVerifyDriver = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/verify-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, action }),
      });
      const data = await res.json();
      if (data.application) {
        setApplications((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a))
        );
      }
      // Refresh drivers
      const drvRes = await fetch('/api/drivers');
      const drvData = await drvRes.json();
      if (drvData.drivers) setDrivers(drvData.drivers);
    } catch (e) {
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a))
      );
    }
  };

  // Admin Update Surge
  const handleUpdateSurge = async (multiplier: number) => {
    setSurgeMultiplier(multiplier);
    try {
      await fetch('/api/admin/surge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiplier }),
      });
    } catch (e) {}
  };

  // Active driver resolution
  const activeDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0] || INITIAL_DRIVERS[0];

  // Render the core active role panel
  const renderRolePanel = () => {
    switch (currentRole) {
      case 'rider':
        return (
          <RiderBookingPanel
            pickup={pickup}
            dropoff={dropoff}
            intermediateStops={intermediateStops}
            onSelectPickup={setPickup}
            onSelectDropoff={setDropoff}
            onAddStop={handleAddIntermediateStop}
            onRemoveStop={handleRemoveIntermediateStop}
            activeRide={activeRide}
            onRequestRide={handleRequestRide}
            onCancelRide={handleCancelRide}
            surgeMultiplier={surgeMultiplier}
            language={language}
            onSendSms={(phone, text) => addSms(phone, text, 'safety_alert')}
            selectedCityHub={selectedCityHub}
            onSelectCityHub={handleSelectCityHub}
            vehicleOptions={vehicleOptions}
            expresswayTollLkr={expresswayTollLkr}
            customerUser={customerUser}
            onOpenCustomerAuth={() => setIsCustomerAuthModalOpen(true)}
            onOpenTripHistory={() => setShowTripHistoryModal(true)}
            onOpenShareTrip={() => setShowShareTripModal(true)}
            onOpenReceipt={(r) => setSelectedReceiptRide(r)}
            onReportLostItem={(r) => setSelectedLostItemRide(r)}
            pastTripsCount={pastTrips.length}
            lastTrip={pastTrips[0] || null}
            onRebookTrip={handleRebookTrip}
          />
        );
      case 'driver':
        return (
          <DriverDashboard
            driver={activeDriver}
            activeRide={activeRide}
            onToggleOnline={(isOnline) => handleToggleOnline(isOnline)}
            onAcceptRide={handleDriverAccept}
            onArrivedAtPickup={handleDriverArrived}
            onStartRide={handleDriverStart}
            onCompleteRide={handleDriverComplete}
            onRequestPayout={handleRequestPayout}
            payouts={payouts}
            allDrivers={drivers}
            onSelectDriver={setSelectedDriverId}
            onOpenAddDriver={() => setIsAddDriverModalOpen(true)}
            onResetDrivers={handleResetDrivers}
          />
        );
      case 'admin':
        if (!isAdminAuthenticated) {
          return (
            <div className="flex flex-col items-center justify-center h-full min-h-[420px] p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-bold text-white font-heading">Admin Control Center Protected</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Driver license verification, surge pricing overrides, and platform financial data require master administrator authentication.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  id="unlock-admin-gate-btn"
                  onClick={() => setShowAdminPasswordModal(true)}
                  className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter Administrator Passkey</span>
                </button>
                <button
                  onClick={() => setCurrentRole('rider')}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                >
                  Return to Rider
                </button>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Default Master Key: <span className="font-mono text-slate-400 font-bold">{adminPassword}</span>
              </p>
            </div>
          );
        }
        return (
          <AdminControl
            drivers={drivers}
            applications={applications}
            onVerifyDriver={handleVerifyDriver}
            surgeMultiplier={surgeMultiplier}
            onUpdateSurge={handleUpdateSurge}
            onOpenAddDriver={() => setIsAddDriverModalOpen(true)}
            onResetDrivers={handleResetDrivers}
            onToggleDriverStatus={handleToggleDriverStatus}
            onLockAdmin={handleLockAdmin}
            adminPassword={adminPassword}
            onSaveAdminPassword={handleSaveAdminPassword}
            vehicleOptions={vehicleOptions}
            onUpdateVehiclePricing={handleUpdateVehiclePricing}
            onResetVehiclePricing={handleResetVehiclePricing}
            expresswayTollLkr={expresswayTollLkr}
            onUpdateExpresswayToll={handleUpdateExpresswayToll}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        isAdminAuthenticated={isAdminAuthenticated}
        deviceViewMode={settings.deviceViewMode}
        onSelectDeviceViewMode={(mode) => handleUpdateSettings({ deviceViewMode: mode })}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSmsDrawer={() => setShowSmsDrawer(true)}
        unreadSmsCount={smsList.length}
        language={language}
        onSelectLanguage={(lang) => {
          setLanguage(lang);
          handleUpdateSettings({ language: lang });
        }}
        customerUser={customerUser}
        onOpenCustomerAuth={() => setIsCustomerAuthModalOpen(true)}
        onOpenTripHistory={() => setShowTripHistoryModal(true)}
        pastTripsCount={pastTrips.length}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-5 flex flex-col pb-24 lg:pb-5">
        {/* VIEWPORT MODE 1: MOBILE SMARTPHONE SIMULATOR */}
        {settings.deviceViewMode === 'mobile' && (
          <div className="flex-1 flex items-center justify-center py-2 sm:py-4">
            <div className="w-full max-w-[420px] h-[calc(100vh-90px)] sm:h-[820px] bg-slate-900 border-0 sm:border-[10px] border-slate-800 rounded-2xl sm:rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-0 sm:ring-1 ring-slate-700/60 flex flex-col overflow-hidden relative">
              {/* Smartphone Status Bar & Dynamic Island (Desktop Preview Only) */}
              <div className="hidden sm:flex h-10 bg-slate-950 px-6 items-center justify-between text-[11px] font-bold text-slate-300 select-none z-30">
                <span>09:41</span>
                {/* Dynamic Island Pill */}
                <div className="w-24 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[8px] text-slate-400 font-mono">NASPICK LK</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Signal className="w-3 h-3 text-slate-300" />
                  <Wifi className="w-3 h-3 text-slate-300" />
                  <Battery className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

              {/* Mobile Content Scroll Area */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Embedded Mini Map in Mobile Header with comfortable height */}
                <div className="h-64 sm:h-72 w-full flex-shrink-0">
                  <SriLankaMap
                    pickup={pickup}
                    dropoff={dropoff}
                    intermediateStops={intermediateStops}
                    activeRide={activeRide}
                    drivers={drivers}
                    userRole={currentRole}
                    selectedCityHub={selectedCityHub}
                    onSelectCityHub={handleSelectCityHub}
                  />
                </div>

                {/* Mobile Screen Body */}
                <div className="flex-1 overflow-y-auto bg-slate-900">
                  {renderRolePanel()}
                </div>
              </div>

              {/* Mobile Bottom Home Bar Indicator (Desktop Preview Only) */}
              <div className="hidden sm:flex h-5 bg-slate-950 items-center justify-center">
                <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* VIEWPORT MODE 2: TABLET (TAB) SIMULATOR (iPad / Galaxy Tab) */}
        {settings.deviceViewMode === 'tablet' && (
          <div className="flex-1 flex items-center justify-center py-2 sm:py-4">
            <div className="w-full max-w-[820px] h-full sm:h-[860px] bg-slate-900 border-2 sm:border-[14px] border-slate-800 rounded-2xl sm:rounded-[38px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] ring-1 ring-slate-700/60 flex flex-col overflow-hidden relative">
              {/* Tablet Top Bezel with Front Camera & Ambient Sensor */}
              <div className="h-7 bg-slate-950 px-6 flex items-center justify-between text-[11px] font-bold text-slate-300 select-none z-30 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span>09:41</span>
                  <span className="text-[10px] text-slate-500 font-mono">NASPICK TAB</span>
                </div>
                {/* Front Camera Lens Dot */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-emerald-500/80"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Signal className="w-3 h-3 text-slate-300" />
                  <Wifi className="w-3 h-3 text-slate-300" />
                  <span className="text-[10px] text-slate-400">98%</span>
                  <Battery className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

              {/* Tablet Screen Body (Balanced 2-Column Responsive Layout) */}
              <div className="flex-1 overflow-hidden p-3 bg-slate-950/60 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 overflow-hidden">
                  {/* Tablet Left: Map & Route View */}
                  <div className="md:col-span-6 flex flex-col h-full overflow-hidden rounded-2xl border border-slate-800">
                    <div className="flex-1 min-h-[300px]">
                      <SriLankaMap
                        pickup={pickup}
                        dropoff={dropoff}
                        intermediateStops={intermediateStops}
                        activeRide={activeRide}
                        drivers={drivers}
                        userRole={currentRole}
                        selectedCityHub={selectedCityHub}
                        onSelectCityHub={handleSelectCityHub}
                      />
                    </div>
                  </div>

                  {/* Tablet Right: Scrollable Role Panel */}
                  <div className="md:col-span-6 flex flex-col h-full overflow-y-auto pr-1">
                    {renderRolePanel()}
                  </div>
                </div>
              </div>

              {/* Tablet Bottom Bezel with Home Indicator */}
              <div className="h-5 bg-slate-950 flex items-center justify-center border-t border-slate-800/80">
                <div className="w-40 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* VIEWPORT MODE 3: FULL WEB DESKTOP FLUID VIEW */}
        {settings.deviceViewMode === 'web' && (
          <div className="flex flex-col flex-1">
            {/* Mobile View Segmented Switcher (Screens < lg) */}
            <div className="lg:hidden flex items-center justify-between p-2 sm:p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl mb-3 shadow-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="truncate">
                  {selectedCityHub === 'all' ? 'Sri Lanka Radar' : `${selectedCityHub.toUpperCase()} Hub`}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-bold">
                <button
                  id="mobile-tab-booking"
                  onClick={() => setMobileTab('panel')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    mobileTab === 'panel'
                      ? 'bg-emerald-500 text-slate-950 shadow font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Panel
                </button>
                <button
                  id="mobile-tab-map"
                  onClick={() => setMobileTab('map')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                    mobileTab === 'map'
                      ? 'bg-emerald-500 text-slate-950 shadow font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MapIcon className="w-3 h-3" />
                  <span>Map</span>
                </button>
                <button
                  id="mobile-tab-split"
                  onClick={() => setMobileTab('split')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    mobileTab === 'split'
                      ? 'bg-emerald-500 text-slate-950 shadow font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
              {/* Left Column: Interactive Map & Live Navigation Engine (7 Cols) */}
              <div 
                className={`lg:col-span-7 flex flex-col gap-3 ${
                  mobileTab === 'panel' ? 'hidden lg:flex' : 'flex'
                } ${mobileTab === 'map' ? 'min-h-[480px] h-[calc(100vh-230px)]' : 'min-h-[300px] sm:min-h-[440px]'}`}
              >
                <div className="flex-1 h-full min-h-[280px] sm:min-h-[400px]">
                  <SriLankaMap
                    pickup={pickup}
                    dropoff={dropoff}
                    intermediateStops={intermediateStops}
                    activeRide={activeRide}
                    drivers={drivers}
                    userRole={currentRole}
                    selectedCityHub={selectedCityHub}
                    onSelectCityHub={handleSelectCityHub}
                  />
                </div>

                {/* Quick Sri Lankan Telemetry Strip */}
                <div className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Target Focus Hub: <strong className="text-slate-200 uppercase">{selectedCityHub}</strong> (Colombo • Kandy • Kurunegala • Negombo)</span>
                  </div>
                  <div>
                    <span>Currency: <strong className="text-emerald-400">{settings.currency}</strong></span>
                  </div>
                  <div className="hidden sm:block">
                    <span>Telecom SMS: <strong className="text-slate-200">Dialog 4G / Mobitel</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Role Panel (Rider / Driver Partner / Admin) (5 Cols) */}
              <div 
                className={`lg:col-span-5 flex flex-col h-full ${
                  mobileTab === 'map' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                {renderRolePanel()}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Quick-Access Bar (Screens < lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="flex items-center justify-around">
          <button
            id="mobile-nav-rider"
            onClick={() => {
              handleSelectRole('rider');
              setMobileTab('panel');
            }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-all min-h-[44px] justify-center ${
              currentRole === 'rider' && mobileTab !== 'map'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Book</span>
          </button>

          <button
            id="mobile-nav-map"
            onClick={() => setMobileTab('map')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-all min-h-[44px] justify-center ${
              mobileTab === 'map'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <MapIcon className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span>Live Map</span>
          </button>

          <button
            id="mobile-nav-driver"
            onClick={() => {
              handleSelectRole('driver');
              setMobileTab('panel');
            }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-all min-h-[44px] justify-center ${
              currentRole === 'driver' && mobileTab !== 'map'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Driver</span>
          </button>

          <button
            id="mobile-nav-admin"
            onClick={() => {
              handleSelectRole('admin');
              setMobileTab('panel');
            }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-all min-h-[44px] justify-center ${
              currentRole === 'admin' && mobileTab !== 'map'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAdminAuthenticated ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
            <span>Admin</span>
          </button>

          <button
            id="mobile-nav-sms"
            onClick={() => setShowSmsDrawer(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-all min-h-[44px] justify-center relative"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              {smsList.length > 0 && (
                <span className="absolute -top-1 -right-1.5 px-1 py-0.2 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full">
                  {smsList.length}
                </span>
              )}
            </div>
            <span>Alerts</span>
          </button>
        </div>
      </nav>

      {/* Page & Device Settings Modal */}
      <PageSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Network Resilience Offline Mode Alert */}
      <OfflineIndicator />

      {/* Trip Rating & Review Modal */}
      {showRatingModal && completedRideForRating && (
        <TripRatingModal
          ride={completedRideForRating}
          onSubmitRating={handleSubmitRating}
          onClose={() => {
            setShowRatingModal(false);
            setCompletedRideForRating(null);
          }}
        />
      )}

      {/* Automated SMS & Push Notification Drawer */}
      <SmsNotificationDrawer
        isOpen={showSmsDrawer}
        onClose={() => setShowSmsDrawer(false)}
        smsList={smsList}
        pushList={pushList}
      />

      {/* Driver Onboarding Modal */}
      <AddDriverModal
        isOpen={isAddDriverModalOpen}
        onClose={() => setIsAddDriverModalOpen(false)}
        onAddDriver={handleAddDriver}
      />

      {/* Admin Passkey Authentication Modal */}
      <AdminPasswordModal
        isOpen={showAdminPasswordModal}
        onClose={() => setShowAdminPasswordModal(false)}
        onAuthenticated={handleAdminAuthenticated}
        savedPassword={adminPassword}
      />

      {/* Customer VIP Account, Login & Live GPS Integration Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthModalOpen}
        onClose={() => setIsCustomerAuthModalOpen(false)}
        customerUser={customerUser}
        onLogin={handleCustomerLogin}
        onLogout={handleCustomerLogout}
        onSelectLocation={(loc) => {
          setPickup(loc);
          setIsCustomerAuthModalOpen(false);
          addSms(
            customerUser?.phone || '+94 77 982 1092',
            `Naspick Trip Sync: Pickup set to ${loc.name} (${loc.city}).`,
            'driver_arriving'
          );
        }}
      />

      {/* Trip History & Activity Drawer Modal */}
      <TripHistoryModal
        isOpen={showTripHistoryModal}
        onClose={() => setShowTripHistoryModal(false)}
        trips={pastTrips}
        onRebookTrip={handleRebookTrip}
        onOpenReceipt={(ride) => setSelectedReceiptRide(ride)}
        onReportLostItem={(ride) => setSelectedLostItemRide(ride)}
      />

      {/* Official Tax e-Receipt / Invoice Modal */}
      <TripReceiptModal
        isOpen={selectedReceiptRide !== null}
        onClose={() => setSelectedReceiptRide(null)}
        ride={selectedReceiptRide}
      />

      {/* Report Lost Item Modal */}
      <LostItemModal
        isOpen={selectedLostItemRide !== null}
        onClose={() => setSelectedLostItemRide(null)}
        ride={selectedLostItemRide}
        onSubmitReport={handleSubmitLostItem}
      />

      {/* Live Share Trip Modal (WhatsApp / SMS) */}
      <ShareTripModal
        isOpen={showShareTripModal}
        onClose={() => setShowShareTripModal(false)}
        ride={activeRide}
        onSendSmsToContact={(phone, text) => addSms(phone, text, 'safety_alert')}
      />
    </div>
  );
}

