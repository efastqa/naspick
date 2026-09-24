import { LocationPoint, CustomerUser, CustomerSavedPlace } from '../types';
import { SRI_LANKA_LOCATIONS, calculateDistanceKm } from '../data/mockLocations';

export interface GeolocationResult {
  success: boolean;
  lat: number;
  lng: number;
  accuracy?: number;
  errorMessage?: string;
  nearestLocation?: LocationPoint;
  distanceToNearestKm?: number;
}

/**
 * Detect user's current GPS position via browser Geolocation API
 */
export async function detectBrowserLocation(): Promise<GeolocationResult> {
  if (!navigator.geolocation) {
    return {
      success: false,
      lat: 6.9271,
      lng: 79.8612,
      errorMessage: 'Geolocation is not supported by your browser.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const nearest = findNearestSriLankaLocation(latitude, longitude);

        resolve({
          success: true,
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          nearestLocation: nearest.location,
          distanceToNearestKm: nearest.distanceKm,
        });
      },
      (error) => {
        let msg = 'Could not retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'GPS location is currently unavailable on this device.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please try again.';
            break;
        }
        resolve({
          success: false,
          lat: 6.9271,
          lng: 79.8612,
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Finds the nearest known landmark / hub in Sri Lanka
 */
export function findNearestSriLankaLocation(lat: number, lng: number): { location: LocationPoint; distanceKm: number } {
  let closest = SRI_LANKA_LOCATIONS[0];
  let minDistance = calculateDistanceKm(lat, lng, closest.lat, closest.lng);

  for (const loc of SRI_LANKA_LOCATIONS) {
    const dist = calculateDistanceKm(lat, lng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  return {
    location: closest,
    distanceKm: parseFloat(minDistance.toFixed(1)),
  };
}

/**
 * Creates a valid LocationPoint object from live GPS coordinates
 */
export function createGpsLocationPoint(lat: number, lng: number, accuracyMeters?: number): LocationPoint {
  const nearest = findNearestSriLankaLocation(lat, lng);
  const city = nearest.location.city || 'Colombo';

  return {
    id: `loc_gps_${Date.now()}`,
    name: '📍 My Current Location',
    address: `Live GPS: Near ${nearest.location.name}, ${city} (±${accuracyMeters || 15}m)`,
    city: city,
    lat: lat,
    lng: lng,
    popularTag: 'Live GPS',
  };
}

/**
 * Converts a saved place into a LocationPoint
 */
export function savedPlaceToLocationPoint(saved: CustomerSavedPlace): LocationPoint {
  return {
    id: `saved_${saved.id}`,
    name: `${saved.label}: ${saved.name}`,
    address: saved.address,
    city: saved.city,
    lat: saved.lat,
    lng: saved.lng,
    popularTag: saved.label,
  };
}

export const INITIAL_CUSTOMER_USER: CustomerUser = {
  id: 'cust_94779821',
  name: 'Kasun Perera',
  phone: '+94 77 982 1092',
  email: 'kasun.perera@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  isLoggedIn: true,
  memberSince: 'March 2024',
  tier: 'Gold VIP',
  rewardPoints: 480,
  savedPlaces: [
    {
      id: 'saved_home',
      label: 'Home',
      name: 'Kollupitiya Residence',
      address: '42 Galle Road, Colombo 03',
      city: 'Colombo',
      lat: 6.9080,
      lng: 79.8510,
    },
    {
      id: 'saved_work',
      label: 'Work',
      name: 'World Trade Center (WTC)',
      address: 'Echelon Square, Colombo 01',
      city: 'Colombo',
      lat: 6.9333,
      lng: 79.8436,
    },
    {
      id: 'saved_airport',
      label: 'Airport',
      name: 'Bandaranaike Intl Airport (CMB)',
      address: 'Airport Expressway Access, Katunayake',
      city: 'Negombo',
      lat: 7.1808,
      lng: 79.8841,
    },
  ],
  lastLoginLocation: {
    lat: 6.9271,
    lng: 79.8612,
    placeName: 'Galle Face Green, Colombo',
    cityName: 'Colombo',
    timestamp: Date.now(),
    source: 'gps',
  },
};
