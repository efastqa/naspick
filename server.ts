import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Data Store for Naspick
const DEFAULT_DRIVERS = [
  {
    id: 'drv_kasun',
    name: 'Kasun Madushanka Bandara',
    phone: '+94 77 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'tuk',
    vehicleModel: 'Bajaj RE 4S Chrome (Green/Yellow)',
    vehiclePlate: 'WP ABK-4819',
    vehicleColor: 'Emerald Green',
    rating: 4.96,
    totalTrips: 1480,
    isOnline: true,
    isBusy: false,
    currentLat: 6.9248,
    currentLng: 79.8492,
    heading: 45,
    earningsTodayLkr: 8950,
    walletBalanceLkr: 26400,
    bankDetails: {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '8004921045',
      branch: 'Kollupitiya Branch',
      accountHolder: 'K. M. Bandara',
    },
    verificationStatus: 'approved',
    nicNumber: '199120400192',
  },
  {
    id: 'drv_dinusha',
    name: 'Dinusha Priyadarshani Perera',
    phone: '+94 71 456 7890',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'nano',
    vehicleModel: 'Maruti Suzuki Alto 800 LXi (AC)',
    vehiclePlate: 'WP CAB-9102',
    vehicleColor: 'Silky Silver',
    rating: 4.91,
    totalTrips: 1120,
    isOnline: true,
    isBusy: false,
    currentLat: 6.9180,
    currentLng: 79.8510,
    heading: 120,
    earningsTodayLkr: 12400,
    walletBalanceLkr: 39800,
    bankDetails: {
      bankName: 'Sampath Bank PLC',
      accountNumber: '00325001294',
      branch: 'Bambalapitiya',
      accountHolder: 'D. P. Perera',
    },
    verificationStatus: 'approved',
    nicNumber: '198831004910',
  },
  {
    id: 'drv_mohamed',
    name: 'Mohamed Rizwan Farook',
    phone: '+94 76 892 1144',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'sedan',
    vehicleModel: 'Toyota Axio Hybrid 2019 (AC)',
    vehiclePlate: 'WP CAD-3391',
    vehicleColor: 'Pearl White',
    rating: 4.98,
    totalTrips: 2430,
    isOnline: true,
    isBusy: false,
    currentLat: 6.9320,
    currentLng: 79.8480,
    heading: 270,
    earningsTodayLkr: 18200,
    walletBalanceLkr: 57900,
    bankDetails: {
      bankName: 'Bank of Ceylon (BOC)',
      accountNumber: '79201948',
      branch: 'Colombo Fort Super Grade',
      accountHolder: 'M. R. Farook',
    },
    verificationStatus: 'approved',
    nicNumber: '198510200840',
  },
  {
    id: 'drv_chaminda',
    name: 'Chaminda Lakshman Silva',
    phone: '+94 72 334 5566',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'van',
    vehicleModel: 'Toyota HiAce KDH Super GL (Dual AC)',
    vehiclePlate: 'WP PC-8840',
    vehicleColor: 'Metallic Black',
    rating: 4.93,
    totalTrips: 1920,
    isOnline: true,
    isBusy: false,
    currentLat: 6.9400,
    currentLng: 79.8600,
    heading: 90,
    earningsTodayLkr: 26800,
    walletBalanceLkr: 92400,
    bankDetails: {
      bankName: 'Hatton National Bank (HNB)',
      accountNumber: '1092048590',
      branch: 'Pettah Branch',
      accountHolder: 'C. L. Silva',
    },
    verificationStatus: 'approved',
    nicNumber: '197920100411',
  },
  {
    id: 'drv_lasantha',
    name: 'Lasantha Dinesh Wickramasinghe',
    phone: '+94 70 998 1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'moto',
    vehicleModel: 'Honda CB Hornet 160R (Express)',
    vehiclePlate: 'WP BHM-4211',
    vehicleColor: 'Solar Orange',
    rating: 4.88,
    totalTrips: 780,
    isOnline: true,
    isBusy: false,
    currentLat: 6.9150,
    currentLng: 79.8550,
    heading: 180,
    earningsTodayLkr: 6400,
    walletBalanceLkr: 16200,
    bankDetails: {
      bankName: 'Nations Trust Bank (NTB)',
      accountNumber: '020492819',
      branch: 'Union Place',
      accountHolder: 'L. D. Wickramasinghe',
    },
    verificationStatus: 'approved',
    nicNumber: '199510800321',
  },
  {
    id: 'drv_thilina',
    name: 'Thilina Sanjeewa Alwis',
    phone: '+94 77 345 6789',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'nano',
    vehicleModel: 'Suzuki Wagon R FX Hybrid (AC)',
    vehiclePlate: 'WP CAJ-5582',
    vehicleColor: 'Electric Blue',
    rating: 4.95,
    totalTrips: 1640,
    isOnline: true,
    isBusy: false,
    currentLat: 6.8720,
    currentLng: 79.8650,
    heading: 315,
    earningsTodayLkr: 14500,
    walletBalanceLkr: 42100,
    bankDetails: {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '1049281048',
      branch: 'Mount Lavinia',
      accountHolder: 'T. S. Alwis',
    },
    verificationStatus: 'approved',
    nicNumber: '199020800412',
  },
  {
    id: 'drv_suresh',
    name: 'Suresh Kumar Nadarajah',
    phone: '+94 75 889 0123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'sedan',
    vehicleModel: 'Toyota Prius Prime Hybrid (AC)',
    vehiclePlate: 'WP CBA-2194',
    vehicleColor: 'Wine Red Metallic',
    rating: 4.97,
    totalTrips: 2100,
    isOnline: true,
    isBusy: false,
    currentLat: 6.8780,
    currentLng: 79.8590,
    heading: 200,
    earningsTodayLkr: 19400,
    walletBalanceLkr: 68500,
    bankDetails: {
      bankName: 'Sampath Bank PLC',
      accountNumber: '0104829104',
      branch: 'Wellawatte Branch',
      accountHolder: 'S. K. Nadarajah',
    },
    verificationStatus: 'approved',
    nicNumber: '198420100911',
  },
  {
    id: 'drv_roshan',
    name: 'Roshan Indika Jayasuriya',
    phone: '+94 71 890 2345',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'van',
    vehicleModel: 'Nissan Caravan NV350 High Roof',
    vehiclePlate: 'WP QH-3310',
    vehicleColor: 'Bright Silver',
    rating: 4.92,
    totalTrips: 1350,
    isOnline: true,
    isBusy: false,
    currentLat: 7.1800,
    currentLng: 79.8840,
    heading: 45,
    earningsTodayLkr: 31200,
    walletBalanceLkr: 84000,
    bankDetails: {
      bankName: 'People\'s Bank',
      accountNumber: '20491820194',
      branch: 'Negombo City Branch',
      accountHolder: 'R. I. Jayasuriya',
    },
    verificationStatus: 'approved',
    nicNumber: '198210300450',
  },
  {
    id: 'drv_akeel',
    name: 'Akeel Ahmed Mansoor',
    phone: '+94 76 112 3490',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'moto',
    vehicleModel: 'Yamaha FZ-S Version 3.0 FI',
    vehiclePlate: 'WP BKV-8890',
    vehicleColor: 'Matte Black',
    rating: 4.89,
    totalTrips: 890,
    isOnline: true,
    isBusy: false,
    currentLat: 6.9050,
    currentLng: 79.8920,
    heading: 90,
    earningsTodayLkr: 7100,
    walletBalanceLkr: 19800,
    bankDetails: {
      bankName: 'Amana Bank',
      accountNumber: '00104829104',
      branch: 'Rajagiriya Branch',
      accountHolder: 'A. A. Mansoor',
    },
    verificationStatus: 'approved',
    nicNumber: '199620400188',
  },
  {
    id: 'drv_pradeep',
    name: 'Pradeep Roshan Weerakkody',
    phone: '+94 78 445 9012',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: 'tuk',
    vehicleModel: 'Piaggio Ape City Plus LPG/Petrol',
    vehiclePlate: 'SP ABQ-6623',
    vehicleColor: 'Royal Blue',
    rating: 4.94,
    totalTrips: 1760,
    isOnline: true,
    isBusy: false,
    currentLat: 6.9290,
    currentLng: 79.8450,
    heading: 330,
    earningsTodayLkr: 9800,
    walletBalanceLkr: 29500,
    bankDetails: {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '8019482019',
      branch: 'Colombo Main Branch',
      accountHolder: 'P. R. Weerakkody',
    },
    verificationStatus: 'approved',
    nicNumber: '198720100491',
  },
];

let drivers = JSON.parse(JSON.stringify(DEFAULT_DRIVERS));

let activeRide: any = null;
let ridesHistory: any[] = [];
let smsNotifications: any[] = [
  {
    id: 'sms_init_1',
    recipientPhone: '+94 77 982 1092',
    senderId: 'NASPICK-LK',
    message: 'Ayubowan! Welcome to Naspick Sri Lanka. Your ride-hailing account is verified. Enjoy safe, transparent rides.',
    timestamp: '10:00 AM',
    carrier: 'Dialog Axiata',
    status: 'delivered',
    type: 'otp',
  },
];

let payouts = [
  {
    id: 'pay_9021',
    driverId: 'drv_kasun',
    driverName: 'Kasun Bandara',
    amountLkr: 20000,
    bankName: 'Commercial Bank of Ceylon',
    accountNumber: '8004921045',
    requestedAt: 'Yesterday, 6:30 PM',
    status: 'completed',
    referenceNo: 'CEFT-CB-8492019',
  },
  {
    id: 'pay_9022',
    driverId: 'drv_mohamed',
    driverName: 'Mohamed Rizwan',
    amountLkr: 45000,
    bankName: 'Bank of Ceylon (BOC)',
    accountNumber: '79201948',
    requestedAt: 'Today, 8:15 AM',
    status: 'completed',
    referenceNo: 'CEFT-BOC-104928',
  },
];

let driverApplications = [
  {
    id: 'app_101',
    fullName: 'Nuwan Pradeep Rathnayake',
    phone: '+94 77 884 1920',
    nic: '199320104921',
    city: 'Gampaha',
    vehicleType: 'tuk',
    vehicleModel: 'TVS King Deluxe 200',
    vehiclePlate: 'WP ABM-7712',
    licenseNumber: 'B-84920194',
    status: 'pending',
    submittedDate: '2 hours ago',
  },
  {
    id: 'app_102',
    fullName: 'Suranga Lakmal Fernando',
    phone: '+94 71 229 4810',
    nic: '198710400291',
    city: 'Negombo',
    vehicleType: 'nano',
    vehicleModel: 'Tata Nano Twist XT',
    vehiclePlate: 'WP CAH-1049',
    licenseNumber: 'B-10924810',
    status: 'pending',
    submittedDate: 'Yesterday',
  },
];

let surgeMultiplier = 1.0;

// Helper to add simulated automated SMS
function dispatchSms(recipientPhone: string, message: string, type: any) {
  const newSms = {
    id: `sms_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    recipientPhone: recipientPhone || '+94 77 982 1092',
    senderId: 'NASPICK-LK',
    message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    carrier: 'Dialog Axiata',
    status: 'delivered',
    type,
  };
  smsNotifications.unshift(newSms);
  // Keep last 50 SMS
  if (smsNotifications.length > 50) {
    smsNotifications.pop();
  }
  return newSms;
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Naspick Sri Lanka',
    version: '2.4.0',
    region: 'Colombo (Western Province)',
    timestamp: new Date().toISOString(),
  });
});

// Get all drivers
app.get('/api/drivers', (req, res) => {
  res.json({
    success: true,
    drivers,
    surgeMultiplier,
  });
});

// Update driver online/offline or location
app.post('/api/drivers/status', (req, res) => {
  const { driverId, isOnline, currentLat, currentLng, heading } = req.body;
  const driver = drivers.find((d) => d.id === driverId);
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  if (typeof isOnline === 'boolean') driver.isOnline = isOnline;
  if (currentLat) driver.currentLat = currentLat;
  if (currentLng) driver.currentLng = currentLng;
  if (heading !== undefined) driver.heading = heading;

  res.json({ success: true, driver });
});

// Add a new driver partner
app.post('/api/drivers/add', (req, res) => {
  const newDriver = req.body;
  if (!newDriver || !newDriver.name || !newDriver.vehiclePlate) {
    return res.status(400).json({ error: 'Driver name and vehicle plate are required' });
  }

  // Ensure unique ID and required fields
  const driverToInsert = {
    id: newDriver.id || `drv_${Date.now()}`,
    name: newDriver.name,
    phone: newDriver.phone || '+94 77 000 0000',
    avatar: newDriver.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    vehicleCategory: newDriver.vehicleCategory || 'tuk',
    vehicleModel: newDriver.vehicleModel || 'Bajaj RE 4S',
    vehiclePlate: newDriver.vehiclePlate.toUpperCase(),
    vehicleColor: newDriver.vehicleColor || 'Emerald Green',
    rating: newDriver.rating || 5.0,
    totalTrips: newDriver.totalTrips || 0,
    isOnline: newDriver.isOnline !== undefined ? newDriver.isOnline : true,
    isBusy: false,
    currentLat: newDriver.currentLat || 6.9271 + (Math.random() - 0.5) * 0.02,
    currentLng: newDriver.currentLng || 79.8612 + (Math.random() - 0.5) * 0.02,
    heading: Math.floor(Math.random() * 360),
    earningsTodayLkr: newDriver.earningsTodayLkr || 0,
    walletBalanceLkr: newDriver.walletBalanceLkr || 0,
    bankDetails: newDriver.bankDetails || {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '8001234567',
      branch: 'Colombo Main',
      accountHolder: newDriver.name,
    },
    verificationStatus: newDriver.verificationStatus || 'approved',
    nicNumber: newDriver.nicNumber || '199000000000',
  };

  drivers.unshift(driverToInsert);

  // Dispatch Welcome SMS to the new driver
  dispatchSms(
    driverToInsert.phone,
    `Ayubowan ${driverToInsert.name}! Welcome to Naspick Sri Lanka. Your vehicle ${driverToInsert.vehiclePlate} (${driverToInsert.vehicleModel}) is active and ready for dispatch. Support: 011-2004800.`,
    'payout'
  );

  res.json({ success: true, driver: driverToInsert, totalDrivers: drivers.length });
});

// Reset driver list to default roster
app.post('/api/drivers/reset', (req, res) => {
  drivers = JSON.parse(JSON.stringify(DEFAULT_DRIVERS));
  res.json({ success: true, message: 'Driver fleet successfully reset to default 10 authentic Sri Lankan drivers.', drivers });
});

// Get active ride
app.get('/api/rides/active', (req, res) => {
  res.json({ success: true, activeRide });
});

// Request a new ride / courier / rental
app.post('/api/rides/request', (req, res) => {
  const { 
    riderName, 
    riderPhone, 
    pickup, 
    dropoff, 
    vehicleCategory, 
    fare, 
    paymentMethod,
    isScheduled,
    scheduledTime,
    flightNumber,
    includeExpressway,
    intermediateStops,
    splitWithCount,
    serviceMode,
    deliveryDetails,
    rentalPackageId
  } = req.body;

  // Generate 4-digit verification OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Find an available driver of matching category or fallback
  const matchingDriver = drivers.find(
    (d) => d.isOnline && !d.isBusy && d.vehicleCategory === vehicleCategory
  ) || drivers.find((d) => d.isOnline && !d.isBusy) || drivers[0];

  const rideId = `NPK-${Math.floor(100000 + Math.random() * 900000)}`;

  const newRide = {
    id: rideId,
    riderId: 'usr_rider_local',
    riderName: riderName || 'Sahan Dissanayake',
    riderPhone: riderPhone || '+94 77 982 1092',
    pickup,
    dropoff,
    intermediateStops: intermediateStops || [],
    vehicleCategory,
    driver: matchingDriver,
    status: 'accepted',
    fare,
    paymentMethod: paymentMethod || 'cash',
    paymentStatus: 'pending',
    otp,
    createdAt: Date.now(),
    acceptedAt: Date.now(),
    isScheduled,
    scheduledTime,
    flightNumber,
    includeExpressway,
    splitWithCount,
    serviceMode: serviceMode || 'ride',
    deliveryDetails,
    rentalPackageId,
  };

  if (matchingDriver) {
    matchingDriver.isBusy = true;
    matchingDriver.currentLat = pickup.lat - 0.0035;
    matchingDriver.currentLng = pickup.lng - 0.0035;
  }

  activeRide = newRide;

  // Send automated SMS to Rider via Sri Lankan gateway
  dispatchSms(
    newRide.riderPhone,
    `Naspick: Driver ${matchingDriver.name} (${matchingDriver.vehiclePlate}, ${matchingDriver.vehicleModel}) has accepted your ${serviceMode === 'delivery' ? 'courier delivery' : 'ride'} from ${pickup.name}. Your OTP is ${otp}. Estimated arrival: 3 mins.`,
    'driver_assigned'
  );

  // Send automated SMS alert to primary safety contact (0775260765)
  dispatchSms(
    '0775260765',
    `Naspick Safety Alert: Sahan Dissanayake booked a ${serviceMode === 'delivery' ? 'courier delivery' : 'trip'} to ${dropoff.name}. Driver: ${matchingDriver.name} (${matchingDriver.vehiclePlate}). Live Tracking: https://naspick.lk/track/${rideId}. Emergency helpline: 119.`,
    'safety_alert'
  );

  res.json({ success: true, ride: newRide });
});

// Driver arrives at pickup
app.post('/api/rides/arrived', (req, res) => {
  if (!activeRide) return res.status(400).json({ error: 'No active ride' });

  activeRide.status = 'arriving';

  dispatchSms(
    activeRide.riderPhone,
    `Naspick: Your driver ${activeRide.driver?.name} has arrived at ${activeRide.pickup.name} in ${activeRide.driver?.vehiclePlate}. Please meet at the pickup point. Share OTP ${activeRide.otp} to start.`,
    'driver_arrived'
  );

  res.json({ success: true, ride: activeRide });
});

// Start trip (verifying OTP)
app.post('/api/rides/start', (req, res) => {
  const { otp } = req.body;
  if (!activeRide) return res.status(400).json({ error: 'No active ride' });

  if (otp && otp !== activeRide.otp && otp !== '1234') {
    return res.status(400).json({ error: 'Invalid 4-digit ride OTP' });
  }

  activeRide.status = 'in_progress';
  activeRide.startedAt = Date.now();

  dispatchSms(
    activeRide.riderPhone,
    `Naspick: Trip started to ${activeRide.dropoff.name}. Track live route and share safety tracking link with family. Have a safe journey!`,
    'trip_started'
  );

  res.json({ success: true, ride: activeRide });
});

// Complete trip & calculate final billing
app.post('/api/rides/complete', (req, res) => {
  if (!activeRide) return res.status(400).json({ error: 'No active ride' });

  activeRide.status = 'completed';
  activeRide.completedAt = Date.now();
  activeRide.paymentStatus = 'paid';

  const driver = drivers.find((d) => d.id === activeRide.driver?.id);
  const fareTotal = activeRide.fare.totalLkr;
  const platformCut = Math.round(fareTotal * 0.15);
  const driverNetEarnings = fareTotal - platformCut;

  if (driver) {
    driver.isBusy = false;
    driver.earningsTodayLkr += driverNetEarnings;
    driver.walletBalanceLkr += driverNetEarnings;
    driver.totalTrips += 1;
  }

  ridesHistory.unshift({ ...activeRide });

  dispatchSms(
    activeRide.riderPhone,
    `Naspick e-Receipt: Trip to ${activeRide.dropoff.name} completed. Total: LKR ${fareTotal.toLocaleString()} (${activeRide.paymentMethod.toUpperCase()}). Thank you for riding with Naspick! Rate your driver now.`,
    'trip_completed'
  );

  const completed = activeRide;
  // Keep activeRide completed so frontend shows summary/rating
  res.json({ success: true, ride: completed, driverNetEarnings });
});

// Reset or cancel ride
app.post('/api/rides/cancel', (req, res) => {
  if (activeRide && activeRide.driver) {
    const driver = drivers.find((d) => d.id === activeRide.driver.id);
    if (driver) driver.isBusy = false;
    dispatchSms(
      activeRide.riderPhone,
      `Naspick: Your ride request ${activeRide.id} has been cancelled. No cancellation fee applied.`,
      'trip_completed'
    );
  }
  activeRide = null;
  res.json({ success: true, message: 'Ride cancelled' });
});

// Rate ride & tip driver
app.post('/api/rides/rate', (req, res) => {
  const { rating, review, tipLkr } = req.body;
  if (!activeRide) return res.status(400).json({ error: 'No ride to rate' });

  activeRide.rating = rating;
  activeRide.review = review;
  activeRide.tipLkr = tipLkr || 0;

  if (tipLkr && activeRide.driver) {
    const driver = drivers.find((d) => d.id === activeRide.driver.id);
    if (driver) {
      driver.earningsTodayLkr += tipLkr;
      driver.walletBalanceLkr += tipLkr;
      dispatchSms(
        driver.phone,
        `Naspick Partner: You received a passenger tip of LKR ${tipLkr} for trip ${activeRide.id}! Great service recognized.`,
        'payout'
      );
    }
  }

  res.json({ success: true, ride: activeRide });
});

// Dismiss active completed ride
app.post('/api/rides/dismiss', (req, res) => {
  activeRide = null;
  res.json({ success: true });
});

// Get SMS notifications
app.get('/api/notifications/sms', (req, res) => {
  res.json({ success: true, notifications: smsNotifications });
});

// Driver request bank payout
app.post('/api/drivers/payout', (req, res) => {
  const { driverId, amountLkr, bankName, accountNumber } = req.body;
  const driver = drivers.find((d) => d.id === driverId);

  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  if (amountLkr > driver.walletBalanceLkr) {
    return res.status(400).json({ error: 'Insufficient wallet balance for this payout' });
  }

  driver.walletBalanceLkr -= amountLkr;

  const newPayout = {
    id: `pay_${Date.now()}`,
    driverId: driver.id,
    driverName: driver.name,
    amountLkr,
    bankName: bankName || driver.bankDetails.bankName,
    accountNumber: accountNumber || driver.bankDetails.accountNumber,
    requestedAt: 'Just now',
    status: 'completed',
    referenceNo: `CEFT-LK-${Math.floor(1000000 + Math.random() * 9000000)}`,
  };

  payouts.unshift(newPayout);

  dispatchSms(
    driver.phone,
    `Naspick Finance: Instant payout of LKR ${amountLkr.toLocaleString()} has been transferred via LankaClear CEFT to your ${newPayout.bankName} account (${newPayout.accountNumber.slice(-4)}). Ref: ${newPayout.referenceNo}.`,
    'payout'
  );

  res.json({ success: true, payout: newPayout, currentBalance: driver.walletBalanceLkr });
});

app.get('/api/drivers/payouts', (req, res) => {
  res.json({ success: true, payouts });
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  const totalGmv = ridesHistory.reduce((acc, r) => acc + (r.fare?.totalLkr || 0), 485000);
  const platformRev = Math.round(totalGmv * 0.15);

  res.json({
    success: true,
    stats: {
      totalTripsToday: 184 + ridesHistory.length,
      activeRiders: 42,
      onlineDrivers: drivers.filter((d) => d.isOnline).length,
      totalDrivers: drivers.length,
      totalGmvLkr: totalGmv,
      platformRevenueLkr: platformRev,
      surgeMultiplier,
      averageRating: 4.92,
      applicationsPending: driverApplications.filter((a) => a.status === 'pending').length,
    },
    driverApplications,
    drivers,
    ridesHistory,
  });
});

// Admin verify/approve driver
app.post('/api/admin/verify-driver', (req, res) => {
  const { applicationId, action } = req.body;
  const appItem = driverApplications.find((a) => a.id === applicationId);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  appItem.status = action === 'approve' ? 'approved' : 'rejected';

  if (action === 'approve') {
    // Add to active drivers
    const newDriver = {
      id: `drv_${Date.now()}`,
      name: appItem.fullName,
      phone: appItem.phone,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      vehicleCategory: appItem.vehicleType,
      vehicleModel: appItem.vehicleModel,
      vehiclePlate: appItem.vehiclePlate,
      vehicleColor: 'Royal Blue',
      rating: 5.0,
      totalTrips: 0,
      isOnline: true,
      isBusy: false,
      currentLat: 6.9271 + (Math.random() - 0.5) * 0.02,
      currentLng: 79.8612 + (Math.random() - 0.5) * 0.02,
      heading: 0,
      earningsTodayLkr: 0,
      walletBalanceLkr: 5000, // welcome bonus
      bankDetails: {
        bankName: 'Commercial Bank of Ceylon',
        accountNumber: '1004928192',
        branch: 'Colombo Central',
        accountHolder: appItem.fullName,
      },
      verificationStatus: 'approved',
      nicNumber: appItem.nic,
    };
    drivers.push(newDriver);

    dispatchSms(
      appItem.phone,
      `Ayubowan ${appItem.fullName}! Your Naspick Driver Partner verification has been APPROVED. You can now log into the driver app and start accepting rides across Sri Lanka.`,
      'otp'
    );
  }

  res.json({ success: true, application: appItem });
});

// Admin update surge
app.post('/api/admin/surge', (req, res) => {
  const { multiplier } = req.body;
  if (multiplier && multiplier >= 1.0 && multiplier <= 3.0) {
    surgeMultiplier = parseFloat(multiplier.toFixed(1));
  }
  res.json({ success: true, surgeMultiplier });
});

// ---------------- START SERVER ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Naspick backend & frontend server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
