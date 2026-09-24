export type VehicleCategory = 'tuk' | 'nano' | 'sedan' | 'van' | 'moto';

export type Language = 'en' | 'si' | 'ta';

export type BookingServiceMode = 'ride' | 'delivery' | 'rental' | 'tour';

export type CityHubId = 'all' | 'colombo' | 'kandy' | 'kurunegala' | 'negombo' | 'galle';

export type ParcelCategory = 'documents' | 'food' | 'electronics' | 'box';

export interface TouristTourPackage {
  id: string;
  title: string;
  tagline: string;
  destinationHub: string;
  duration: string;
  kmEstimated: number;
  highlights: string[];
  recommendedVehicle: VehicleCategory;
  baseFareLkr: number;
  baseFareUsd: number;
  pickupSuggestedId: string;
  dropoffSuggestedId: string;
  image: string;
  badge: string;
  inclusions: string[];
}

export const PRIMARY_SAFETY_CONTACT = '0775260765';
export const PRIMARY_SAFETY_CONTACT_INTL = '+94 77 526 0765';

export interface VehicleOption {
  id: VehicleCategory;
  name: string;
  tagline: string;
  capacity: number;
  iconName: string;
  baseFareLkr: number;
  perKmLkr: number;
  perMinLkr: number;
  etaMins: number;
  ac: boolean;
  image: string;
  popular?: boolean;
}

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  popularTag?: string;
}

export type RideStatus = 
  | 'idle'
  | 'searching'
  | 'accepted'
  | 'arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface RideFareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  expresswayTollLkr?: number;
  surgeMultiplier: number;
  discountLkr: number;
  platformFee: number;
  totalLkr: number;
  distanceKm: number;
  estimatedMinutes: number;
}

export interface DeliveryDetails {
  parcelCategory: ParcelCategory;
  recipientName: string;
  recipientPhone: string;
  packageWeightKg: number;
  specialInstructions: string;
  requireSignatureOtp: boolean;
  deliveryProofPhoto?: string;
}

export interface RentalPackage {
  id: string;
  title: string;
  hours: number;
  kmIncluded: number;
  baseFareLkr: number;
  extraPerKmLkr: number;
  description: string;
  recommendedVehicle: VehicleCategory;
}

export interface ChatMessage {
  id: string;
  sender: 'rider' | 'driver' | 'system';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Ride {
  id: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  serviceMode?: BookingServiceMode;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  intermediateStops?: LocationPoint[];
  vehicleCategory: VehicleCategory;
  driver?: Driver;
  status: RideStatus;
  fare: RideFareBreakdown;
  paymentMethod: 'cash' | 'card' | 'payhere' | 'lankaqr';
  paymentStatus: 'pending' | 'paid';
  otp: string;
  createdAt: number;
  acceptedAt?: number;
  startedAt?: number;
  completedAt?: number;
  rating?: number;
  review?: string;
  tipLkr?: number;
  isScheduled?: boolean;
  scheduledTime?: string;
  flightNumber?: string;
  includeExpressway?: boolean;
  expresswayName?: string;
  deliveryDetails?: DeliveryDetails;
  rentalPackageId?: string;
  splitWithCount?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleCategory: VehicleCategory;
  vehicleModel: string;
  vehiclePlate: string; // e.g., "WP BCD-7192"
  vehicleColor: string;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  isBusy: boolean;
  currentLat: number;
  currentLng: number;
  heading: number; // degrees 0-360
  earningsTodayLkr: number;
  walletBalanceLkr: number;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    branch: string;
    accountHolder: string;
  };
  verificationStatus: 'approved' | 'pending' | 'rejected';
  nicNumber: string;
}

export interface DriverPayout {
  id: string;
  driverId: string;
  driverName: string;
  amountLkr: number;
  bankName: string;
  accountNumber: string;
  requestedAt: string;
  status: 'pending' | 'completed';
  referenceNo: string;
}

export interface SmsNotification {
  id: string;
  recipientPhone: string;
  senderId: string; // e.g. "NASPICK-LK"
  message: string;
  timestamp: string;
  carrier: 'Dialog Axiata' | 'Mobitel' | 'Hutch' | 'Airtel';
  status: 'delivered' | 'sent';
  type: 'otp' | 'driver_assigned' | 'driver_arrived' | 'trip_started' | 'trip_completed' | 'payout';
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface DriverApplication {
  id: string;
  fullName: string;
  phone: string;
  nic: string;
  city: string;
  vehicleType: VehicleCategory;
  vehicleModel: string;
  vehiclePlate: string;
  licenseNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

export type DeviceViewMode = 'web' | 'mobile' | 'tablet';

export type CurrencyMode = 'LKR' | 'USD' | 'EUR' | 'GBP';

export interface AppSettings {
  deviceViewMode: DeviceViewMode;
  currency: CurrencyMode;
  language: Language;
  soundAlertsEnabled: boolean;
  lowDataMode: boolean;
  highContrastMap: boolean;
}

export interface CustomerSavedPlace {
  id: string;
  label: 'Home' | 'Work' | 'Airport' | 'Favorite' | string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export interface CustomerLoginLocation {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  placeName: string;
  cityName: string;
  timestamp: number;
  source: 'gps' | 'hub' | 'manual';
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isLoggedIn: boolean;
  memberSince: string;
  tier: 'Standard' | 'Silver' | 'Gold VIP';
  rewardPoints: number;
  savedPlaces: CustomerSavedPlace[];
  lastLoginLocation?: CustomerLoginLocation;
}

