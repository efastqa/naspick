import { LocationPoint, VehicleOption, CityHubId, TouristTourPackage } from '../types';

export interface FocusHub {
  id: CityHubId;
  name: string;
  sinhalaName: string;
  tamilName: string;
  tagline: string;
  badge: string;
  icon: string;
  center: { lat: number; lng: number };
  popularLandmarkIds: string[];
}

export const FOCUS_HUBS: FocusHub[] = [
  {
    id: 'all',
    name: 'All Focus Hubs',
    sinhalaName: 'සියලු නගර',
    tamilName: 'அனைத்து நகரங்கள்',
    tagline: 'Colombo, Kandy, Kurunegala, Negombo & Galle',
    badge: 'Islandwide Network',
    icon: '🇱🇰',
    center: { lat: 7.0000, lng: 80.1000 },
    popularLandmarkIds: ['loc_galle_face', 'loc_kandy_tooth', 'loc_kurunegala_rock', 'loc_airport_cmb', 'loc_galle_fort'],
  },
  {
    id: 'colombo',
    name: 'Colombo',
    sinhalaName: 'කොළඹ',
    tamilName: 'கொழும்பு',
    tagline: 'Capital, Port City, Shopping & Coastal Life',
    badge: 'Commercial Hub',
    icon: '🏙️',
    center: { lat: 6.9271, lng: 79.8612 },
    popularLandmarkIds: ['loc_galle_face', 'loc_fort_station', 'loc_lotus_tower', 'loc_one_galle_face', 'loc_bmich'],
  },
  {
    id: 'galle',
    name: 'Galle',
    sinhalaName: 'ගාල්ල',
    tamilName: 'காலி',
    tagline: 'UNESCO Dutch Fort, Unawatuna Beach & Southern Expressway',
    badge: 'Southern Tourism Hub',
    icon: '🏰',
    center: { lat: 6.0535, lng: 80.2210 },
    popularLandmarkIds: ['loc_galle_fort', 'loc_unawatuna_beach', 'loc_galle_stadium', 'loc_galle_station', 'loc_mirissa_beach'],
  },
  {
    id: 'kandy',
    name: 'Kandy',
    sinhalaName: 'මහනුවර',
    tamilName: 'கண்டி',
    tagline: 'Sacred Hill Capital, Dalada Maligawa & Lake',
    badge: 'Cultural Capital',
    icon: '🛕',
    center: { lat: 7.2936, lng: 80.6385 },
    popularLandmarkIds: ['loc_kandy_tooth', 'loc_kandy_city_centre', 'loc_peradeniya_gardens', 'loc_kandy_station'],
  },
  {
    id: 'kurunegala',
    name: 'Kurunegala',
    sinhalaName: 'කුරුණෑගල',
    tamilName: 'குருநாகல்',
    tagline: 'Elephant Rock, Clock Tower & Wayamba Transit',
    badge: 'Central Transit Hub',
    icon: '🐘',
    center: { lat: 7.4863, lng: 80.3623 },
    popularLandmarkIds: ['loc_kurunegala_rock', 'loc_kurunegala_clock', 'loc_kurunegala_bus', 'loc_kurunegala_lake'],
  },
  {
    id: 'negombo',
    name: 'Negombo',
    sinhalaName: 'මීගමුව',
    tamilName: 'நீர்கொழும்பு',
    tagline: 'CMB Airport Gateway, Golden Beach & Dutch Fort',
    badge: 'Airport & Tourist Hub',
    icon: '✈️',
    center: { lat: 7.2083, lng: 79.8358 },
    popularLandmarkIds: ['loc_airport_cmb', 'loc_negombo_beach', 'loc_negombo_fort', 'loc_st_marys_negombo'],
  },
];

export interface PopularTargetRoute {
  id: string;
  title: string;
  subtitle: string;
  category: 'intercity' | 'airport' | 'tourism' | 'express';
  pickupId: string;
  dropoffId: string;
  recommendedVehicleId: 'tuk' | 'nano' | 'sedan' | 'van';
  highlightTag: string;
  estimatedKm: number;
  tollRequired?: boolean;
}

export const POPULAR_TARGET_ROUTES: PopularTargetRoute[] = [
  {
    id: 'route_cmb_kandy',
    title: 'Colombo Fort ⇄ Kandy City',
    subtitle: 'Temple of Tooth & Central Hills via A1 / Central Expressway',
    category: 'intercity',
    pickupId: 'loc_fort_station',
    dropoffId: 'loc_kandy_tooth',
    recommendedVehicleId: 'sedan',
    highlightTag: 'Top Intercity Ride',
    estimatedKm: 116,
    tollRequired: true,
  },
  {
    id: 'route_cmb_airport',
    title: 'Colombo City ⇄ CMB Airport',
    subtitle: 'Fast 25-min transit via E03 Katunayake Expressway',
    category: 'airport',
    pickupId: 'loc_one_galle_face',
    dropoffId: 'loc_airport_cmb',
    recommendedVehicleId: 'sedan',
    highlightTag: 'E03 Expressway Flight Transfer',
    estimatedKm: 34,
    tollRequired: true,
  },
  {
    id: 'route_cmb_kurunegala',
    title: 'Colombo ⇄ Kurunegala',
    subtitle: 'Elephant Rock & Wayamba commercial gateway via Mirigama Express',
    category: 'intercity',
    pickupId: 'loc_lotus_tower',
    dropoffId: 'loc_kurunegala_clock',
    recommendedVehicleId: 'sedan',
    highlightTag: 'Central Highway Express',
    estimatedKm: 94,
    tollRequired: true,
  },
  {
    id: 'route_negombo_kandy',
    title: 'Negombo Beach ⇄ Kandy',
    subtitle: 'Direct airport-coast to hill country cultural corridor',
    category: 'tourism',
    pickupId: 'loc_negombo_beach',
    dropoffId: 'loc_kandy_tooth',
    recommendedVehicleId: 'van',
    highlightTag: 'Scenic Tourist Corridor',
    estimatedKm: 104,
    tollRequired: false,
  },
  {
    id: 'route_kurunegala_kandy',
    title: 'Kurunegala ⇄ Kandy',
    subtitle: 'Direct transit between Wayamba & Central province',
    category: 'intercity',
    pickupId: 'loc_kurunegala_bus',
    dropoffId: 'loc_kandy_city_centre',
    recommendedVehicleId: 'nano',
    highlightTag: 'Direct Highway Transit',
    estimatedKm: 42,
    tollRequired: false,
  },
  {
    id: 'route_negombo_colombo',
    title: 'Negombo Beach ⇄ Colombo Port City',
    subtitle: 'Quick beach to city center travel',
    category: 'express',
    pickupId: 'loc_negombo_beach',
    dropoffId: 'loc_galle_face',
    recommendedVehicleId: 'sedan',
    highlightTag: 'Coastal Express',
    estimatedKm: 38,
    tollRequired: true,
  },
  {
    id: 'route_cmb_galle_fort',
    title: 'Colombo ⇄ Galle Dutch Fort',
    subtitle: 'Fast 1 hr 15 min trip via E01 Southern Expressway',
    category: 'express',
    pickupId: 'loc_galle_face',
    dropoffId: 'loc_galle_fort',
    recommendedVehicleId: 'sedan',
    highlightTag: 'E01 Southern Highway Direct',
    estimatedKm: 122,
    tollRequired: true,
  },
  {
    id: 'route_airport_galle',
    title: 'CMB Airport ⇄ Galle Fort & Unawatuna',
    subtitle: 'Direct express transfer via E03 & E01 Highway link',
    category: 'airport',
    pickupId: 'loc_airport_cmb',
    dropoffId: 'loc_unawatuna_beach',
    recommendedVehicleId: 'van',
    highlightTag: 'Tourist VIP Flight Transfer',
    estimatedKm: 154,
    tollRequired: true,
  },
  {
    id: 'route_galle_mirissa',
    title: 'Galle Fort ⇄ Mirissa & Weligama Surf',
    subtitle: 'Scenic coastal drive, stilt fishermen & whale watching',
    category: 'tourism',
    pickupId: 'loc_galle_fort',
    dropoffId: 'loc_mirissa_beach',
    recommendedVehicleId: 'tuk',
    highlightTag: 'Coastal Safari & Whale Watching',
    estimatedKm: 32,
    tollRequired: false,
  },
];

export const SRI_LANKA_LOCATIONS: LocationPoint[] = [
  // ==================== COLOMBO ====================
  {
    id: 'loc_galle_face',
    name: 'Galle Face Green & Promenade',
    address: 'Galle Main Road, Colombo 03',
    city: 'Colombo',
    lat: 6.9271,
    lng: 79.8458,
    popularTag: 'Popular Oceanfront',
  },
  {
    id: 'loc_fort_station',
    name: 'Colombo Fort Railway Station',
    address: 'Station Road, Fort, Colombo 01',
    city: 'Colombo',
    lat: 6.9344,
    lng: 79.8519,
    popularTag: 'Intercity Rail Hub',
  },
  {
    id: 'loc_lotus_tower',
    name: 'Colombo Lotus Tower',
    address: 'D.R. Wijewardena Mawatha, Colombo 10',
    city: 'Colombo',
    lat: 6.9298,
    lng: 79.8580,
    popularTag: 'City Landmark',
  },
  {
    id: 'loc_one_galle_face',
    name: 'One Galle Face Mall & Shangri-La',
    address: '1A Centre Road, Colombo 02',
    city: 'Colombo',
    lat: 6.9234,
    lng: 79.8465,
    popularTag: 'Shopping & Dining',
  },
  {
    id: 'loc_bmich',
    name: 'BMICH Convention Center',
    address: 'Bauddhaloka Mawatha, Colombo 07',
    city: 'Colombo',
    lat: 6.9015,
    lng: 79.8735,
    popularTag: 'Convention Center',
  },
  {
    id: 'loc_independence_sq',
    name: 'Independence Memorial Hall',
    address: 'Independence Avenue, Cinnamon Gardens, Colombo 07',
    city: 'Colombo',
    lat: 6.9042,
    lng: 79.8679,
    popularTag: 'Heritage Landmark',
  },
  {
    id: 'loc_majestic_city',
    name: 'Majestic City & Marine Drive',
    address: '10 Station Road, Bambalapitiya, Colombo 04',
    city: 'Colombo',
    lat: 6.8942,
    lng: 79.8549,
    popularTag: 'Commercial Hub',
  },
  {
    id: 'loc_mount_lavinia',
    name: 'Mount Lavinia Beach & Hotel',
    address: 'Hotel Road, Mount Lavinia, Dehiwala',
    city: 'Colombo',
    lat: 6.8344,
    lng: 79.8631,
    popularTag: 'Coastal Leisure',
  },

  // ==================== KANDY ====================
  {
    id: 'loc_kandy_tooth',
    name: 'Sri Dalada Maligawa (Temple of the Tooth)',
    address: 'Sri Dalada Veediya, Kandy Central',
    city: 'Kandy',
    lat: 7.2936,
    lng: 80.6413,
    popularTag: 'Sacred World Heritage',
  },
  {
    id: 'loc_kandy_city_centre',
    name: 'Kandy City Centre (KCC) & Lake Round',
    address: '5 Dalada Veediya, Kandy 20000',
    city: 'Kandy',
    lat: 7.2915,
    lng: 80.6358,
    popularTag: 'Kandy Shopping & Downtown',
  },
  {
    id: 'loc_peradeniya_gardens',
    name: 'Royal Botanical Gardens, Peradeniya',
    address: 'Peradeniya Road, Kandy District',
    city: 'Kandy',
    lat: 7.2718,
    lng: 80.5954,
    popularTag: 'Top Tourist Attraction',
  },
  {
    id: 'loc_kandy_station',
    name: 'Kandy Railway Station',
    address: 'William Gopallawa Mawatha, Kandy',
    city: 'Kandy',
    lat: 7.2905,
    lng: 80.6305,
    popularTag: 'Main Line Train Hub',
  },
  {
    id: 'loc_hanthana_range',
    name: 'Hanthana Mountain View & Tea Museum',
    address: 'Hanthana Estate Road, Kandy',
    city: 'Kandy',
    lat: 7.2620,
    lng: 80.6320,
    popularTag: 'Scenic Hill View',
  },

  // ==================== KURUNEGALA ====================
  {
    id: 'loc_kurunegala_rock',
    name: 'Ethagala (Elephant Rock) & Samadhi Buddha',
    address: 'Ethagala Access Road, Kurunegala',
    city: 'Kurunegala',
    lat: 7.4895,
    lng: 80.3660,
    popularTag: 'Historic Rock Summit',
  },
  {
    id: 'loc_kurunegala_clock',
    name: 'Kurunegala Clock Tower & Central Bazaar',
    address: 'Central Intersection, Dambulla Road, Kurunegala',
    city: 'Kurunegala',
    lat: 7.4863,
    lng: 80.3623,
    popularTag: 'Town Center & Market',
  },
  {
    id: 'loc_kurunegala_bus',
    name: 'Kurunegala Central Bus Stand & Railway',
    address: 'Malkaduwawa Road, Kurunegala',
    city: 'Kurunegala',
    lat: 7.4820,
    lng: 80.3600,
    popularTag: 'Wayamba Transit Hub',
  },
  {
    id: 'loc_kurunegala_lake',
    name: 'Kurunegala Lake Round (Wewa Ruma)',
    address: 'Lake Circular Road, Kurunegala',
    city: 'Kurunegala',
    lat: 7.4815,
    lng: 80.3705,
    popularTag: 'Scenic Lake Promenade',
  },
  {
    id: 'loc_welagedara_stadium',
    name: 'Welagedara Stadium',
    address: 'Negombo Road, Kurunegala',
    city: 'Kurunegala',
    lat: 7.4780,
    lng: 80.3540,
    popularTag: 'Sports Complex',
  },

  // ==================== NEGOMBO ====================
  {
    id: 'loc_airport_cmb',
    name: 'Bandaranaike Int\'l Airport (CMB)',
    address: 'Airport Expressway Access Road, Katunayake',
    city: 'Negombo',
    lat: 7.1808,
    lng: 79.8841,
    popularTag: 'International Airport',
  },
  {
    id: 'loc_negombo_beach',
    name: 'Negombo Beach Road & Lewis Place',
    address: 'Lewis Place, Kudapaduwa, Negombo',
    city: 'Negombo',
    lat: 7.2285,
    lng: 79.8436,
    popularTag: 'Tourist Beach Strip',
  },
  {
    id: 'loc_negombo_fort',
    name: 'Negombo Dutch Fort & Fishing Lagoon',
    address: 'Customs Road, Negombo Lagoon',
    city: 'Negombo',
    lat: 7.2070,
    lng: 79.8330,
    popularTag: 'Historic Dutch Port',
  },
  {
    id: 'loc_st_marys_negombo',
    name: 'St. Mary\'s Grand Church & Grand Street',
    address: 'Grand Street, Negombo Town',
    city: 'Negombo',
    lat: 7.2120,
    lng: 79.8390,
    popularTag: 'Architectural Landmark',
  },
  {
    id: 'loc_kochchikade',
    name: 'Kochchikade Beach & Commercial Junction',
    address: 'Chilaw-Colombo Main Road, Kochchikade',
    city: 'Negombo',
    lat: 7.2650,
    lng: 79.8550,
    popularTag: 'Northern Coastal Gateway',
  },

  // ==================== GALLE & SOUTHERN COAST ====================
  {
    id: 'loc_galle_fort',
    name: 'Galle Dutch Fort, Ramparts & Lighthouse',
    address: 'Church Street & Rampart Street, Galle Fort 80000',
    city: 'Galle',
    lat: 6.0270,
    lng: 80.2170,
    popularTag: 'UNESCO World Heritage',
  },
  {
    id: 'loc_unawatuna_beach',
    name: 'Unawatuna Beach & Coral Reefs',
    address: 'Yaddehimulla Road, Unawatuna, Galle',
    city: 'Galle',
    lat: 6.0100,
    lng: 80.2490,
    popularTag: 'Turquoise Bay & Surfing',
  },
  {
    id: 'loc_galle_stadium',
    name: 'Galle International Cricket Stadium',
    address: 'Colombo-Galle Main Road, Galle',
    city: 'Galle',
    lat: 6.0370,
    lng: 80.2160,
    popularTag: 'Historic Oceanfront Stadium',
  },
  {
    id: 'loc_galle_station',
    name: 'Galle Central Railway & Bus Terminal',
    address: 'Station Road, Galle Downtown',
    city: 'Galle',
    lat: 6.0395,
    lng: 80.2140,
    popularTag: 'Southern Transit Junction',
  },
  {
    id: 'loc_mirissa_beach',
    name: 'Mirissa Beach & Whale Watching Pier',
    address: 'Harbour Road, Mirissa, Southern Province',
    city: 'Galle',
    lat: 5.9480,
    lng: 80.4550,
    popularTag: 'Blue Whale & Dolphin Safari',
  },
  {
    id: 'loc_bentota_resort',
    name: 'Bentota River Lagoon & Water Sports',
    address: 'National Holiday Resort, Bentota',
    city: 'Galle',
    lat: 6.4250,
    lng: 79.9980,
    popularTag: 'Water Sports & River Safari',
  },
  {
    id: 'loc_hikkaduwa_beach',
    name: 'Hikkaduwa Marine Sanctuary & Coral Reef',
    address: 'Galle Road, Hikkaduwa',
    city: 'Galle',
    lat: 6.1390,
    lng: 80.1010,
    popularTag: 'Sea Turtles & Snorkeling',
  },
];

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'tuk',
    name: 'Naspick Tuk (Three-Wheeler)',
    tagline: 'Authentic Sri Lankan swift street ride',
    capacity: 3,
    iconName: 'tuk',
    baseFareLkr: 150,
    perKmLkr: 95,
    perMinLkr: 5,
    etaMins: 2,
    ac: false,
    image: '/assets/tuk.png',
    popular: true,
  },
  {
    id: 'nano',
    name: 'Naspick Nano / Budget Cab',
    tagline: 'Affordable compact AC hatchbacks (Alto / Wagon R)',
    capacity: 4,
    iconName: 'car',
    baseFareLkr: 220,
    perKmLkr: 130,
    perMinLkr: 7,
    etaMins: 4,
    ac: true,
    image: '/assets/nano.png',
  },
  {
    id: 'sedan',
    name: 'Naspick Sedan / Premier',
    tagline: 'Comfortable sedans (Prius, Axio, Grace AC)',
    capacity: 4,
    iconName: 'car',
    baseFareLkr: 320,
    perKmLkr: 165,
    perMinLkr: 9,
    etaMins: 5,
    ac: true,
    image: '/assets/sedan.png',
    popular: true,
  },
  {
    id: 'van',
    name: 'Naspick Van / KDH',
    tagline: 'Spacious 6-10 passenger van for airport & long distance',
    capacity: 8,
    iconName: 'bus',
    baseFareLkr: 600,
    perKmLkr: 240,
    perMinLkr: 12,
    etaMins: 7,
    ac: true,
    image: '/assets/van.png',
  },
  {
    id: 'moto',
    name: 'Naspick Moto / Zip',
    tagline: 'Fastest solo commute through city rush',
    capacity: 1,
    iconName: 'bike',
    baseFareLkr: 100,
    perKmLkr: 60,
    perMinLkr: 3,
    etaMins: 2,
    ac: false,
    image: '/assets/moto.png',
  },
];

// Calculate Haversine distance with real-world road curvature factor for Sri Lanka
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const crowDistance = R * c;

  // Road factor in Sri Lanka is ~1.25 for highway / hill-country paths
  const roadFactor = crowDistance > 30 ? 1.25 : 1.15;
  const estimatedRoadKm = crowDistance * roadFactor;

  return Math.max(1.5, parseFloat(estimatedRoadKm.toFixed(1)));
}

// Calculate fare in Sri Lankan Rupees (LKR)
export function calculateFare(
  vehicle: VehicleOption,
  distanceKm: number,
  surgeMultiplier: number = 1.0,
  discountLkr: number = 0
) {
  // Estimated travel duration considering Sri Lanka traffic and highways
  const speedKmh = distanceKm > 50 ? 45 : 28;
  const estimatedMinutes = Math.max(6, Math.round((distanceKm / speedKmh) * 60));

  const baseFare = vehicle.baseFareLkr;
  const distanceFare = Math.round(distanceKm * vehicle.perKmLkr);
  const timeFare = Math.round(estimatedMinutes * vehicle.perMinLkr);
  const subtotal = (baseFare + distanceFare + timeFare) * surgeMultiplier;
  const platformFee = Math.round(subtotal * 0.10);
  const totalLkr = Math.max(vehicle.baseFareLkr, Math.round(subtotal + platformFee - discountLkr));

  return {
    baseFare,
    distanceFare,
    timeFare,
    surgeMultiplier,
    discountLkr,
    platformFee,
    totalLkr,
    distanceKm,
    estimatedMinutes,
  };
}

export const TOURIST_TOUR_PACKAGES: TouristTourPackage[] = [
  {
    id: 'tour_galle_south',
    title: 'Galle Fort & Southern Coast Explorer',
    tagline: 'UNESCO 17th Century Dutch Ramparts, Lighthouse, Sea Turtles & Unawatuna',
    destinationHub: 'Galle & Southern Coast',
    duration: 'Full Day (8-10 Hours)',
    kmEstimated: 240,
    highlights: [
      'Galle Dutch Fort UNESCO Citadel & Ramparts Walk',
      'Historic 1939 Galle Lighthouse & Bastions',
      'Unawatuna Beach, Jungle Beach & Japanese Peace Pagoda',
      'Madu River Mangrove Boat Safari & Cinnamon Island',
      'Kosgoda Sea Turtle Conservation Project',
      'Traditional Southern Stilt Fishermen photography'
    ],
    recommendedVehicle: 'sedan',
    baseFareLkr: 28500,
    baseFareUsd: 95,
    pickupSuggestedId: 'loc_galle_face',
    dropoffSuggestedId: 'loc_galle_fort',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&auto=format&fit=crop&q=80',
    badge: '★ Most Popular Tour',
    inclusions: [
      'Dedicated AC Sedan / Van with English-Speaking Chauffeur Guide',
      'All E01 Southern Expressway Highway Tolls Included',
      'Free Onboard High-Speed 4G Wi-Fi',
      'Complimentary Chilled Ceylon Bottled Water',
      'Flexible Photo Stops along Coastal Coconut Groves'
    ]
  },
  {
    id: 'tour_kandy_tea',
    title: 'Sacred Kandy, Tea Plantations & Ramboda',
    tagline: 'Temple of the Tooth, Royal Botanical Gardens & Scenic Mist-Covered Hills',
    destinationHub: 'Kandy & Central Highlands',
    duration: 'Full Day (10-12 Hours)',
    kmEstimated: 260,
    highlights: [
      'Sri Dalada Maligawa (Temple of the Sacred Tooth Relic)',
      'Peradeniya Royal Botanical Gardens (Giant Bamboo & Orchids)',
      'Scenic Kandy Lake & Upper Lake Panoramic Viewpoint',
      'Ceylon Working Tea Factory & Tea Tasting Experience',
      'Ramboda Falls & Kadugannawa Highway Pass',
      'Batik & Gem Heritage Workshops'
    ],
    recommendedVehicle: 'sedan',
    baseFareLkr: 32000,
    baseFareUsd: 105,
    pickupSuggestedId: 'loc_galle_face',
    dropoffSuggestedId: 'loc_kandy_tooth',
    image: 'https://images.unsplash.com/photo-1588258524675-c61919a794b6?w=600&auto=format&fit=crop&q=80',
    badge: 'Cultural Heritage',
    inclusions: [
      'Chilled AC Deluxe Vehicle with Experienced Hill Driver',
      'Central Expressway Tolls & Mountain Road Handling',
      'Free Mineral Water & Umbrella In-Car Assistance',
      'Curated Tea Tasting & Ceylon Cinnamon Tea'
    ]
  },
  {
    id: 'tour_sigiriya_triangle',
    title: 'Sigiriya Lion Rock & Dambulla Cave Odyssey',
    tagline: 'UNESCO 5th-century Sky Palace fortress and ancient golden cave temple',
    destinationHub: 'Cultural Triangle',
    duration: 'Full Day (12-14 Hours)',
    kmEstimated: 340,
    highlights: [
      'Climb the 5th-Century Sigiriya Lion Rock Citadel',
      'Sigiriya Mirror Wall & Frescoes of Celestial Maidens',
      'Dambulla Royal Cave Temple & Golden Buddha Statue',
      'Minneriya Wild Elephant Gathering Safari corridor',
      'Authentic Village Bullock Cart & Lake Catamaran Ride'
    ],
    recommendedVehicle: 'van',
    baseFareLkr: 39500,
    baseFareUsd: 130,
    pickupSuggestedId: 'loc_airport_cmb',
    dropoffSuggestedId: 'loc_kandy_tooth',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600&auto=format&fit=crop&q=80',
    badge: 'UNESCO Wonder',
    inclusions: [
      'Spacious AC Van / KDH with High Clearance for Safari roads',
      'Professional Multilingual Tour Chauffeur',
      'Express Highway Tolls & Fuel Included',
      'Binoculars for Elephant & Bird Watching'
    ]
  },
  {
    id: 'tour_mirissa_surf_safari',
    title: 'Southern Surf, Mirissa Whales & Yala Safari',
    tagline: 'Blue Whales, Weligama Surf Bays, Tangalle Beaches & Leopard Wilderness',
    destinationHub: 'Galle & Deep South',
    duration: 'Multi-Day or Extended Day (14 Hours)',
    kmEstimated: 320,
    highlights: [
      'Mirissa Harbor Blue Whale & Spinner Dolphin Boat Excursion',
      'Weligama Bay Beginner Surf Lesson & Board Racks',
      'Coconut Tree Hill & Secret Beach Viewpoint',
      'Yala National Park 4x4 Leopard & Sloth Bear Safari Entrance',
      'Galle Fort Sunset ramparts cocktail stop'
    ],
    recommendedVehicle: 'van',
    baseFareLkr: 44000,
    baseFareUsd: 145,
    pickupSuggestedId: 'loc_galle_fort',
    dropoffSuggestedId: 'loc_mirissa_beach',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=80',
    badge: 'Wildlife & Surf',
    inclusions: [
      'Spacious KDH Van with Surfboard Roof Rack & Luggage Space',
      'Southern Expressway (E01) all sections included',
      'Cooler Box with Chilled Beverages',
      'Direct coordination with Whale Boat Captains'
    ]
  },
  {
    id: 'tour_airport_vip_transfer',
    title: 'Airport CMB ⇄ Galle / Kandy VIP Meet & Greet',
    tagline: 'Personalized arrival hall meet & greet, luggage porter & express highway transfer',
    destinationHub: 'Islandwide Direct Transit',
    duration: 'Direct Express Transit (1.5 - 2.5 Hours)',
    kmEstimated: 155,
    highlights: [
      'Chauffeur waiting at CMB Arrival Terminal with Custom Name Placard',
      'Flight Delay Monitoring & Zero Waiting Charges',
      'Luggage Assistance & Baggage Trolley Escort',
      'Direct Transit via E03 & E01 Expressways to Galle Fort / Kandy',
      'SIM Card & Currency Exchange assistance at terminal'
    ],
    recommendedVehicle: 'sedan',
    baseFareLkr: 22500,
    baseFareUsd: 75,
    pickupSuggestedId: 'loc_airport_cmb',
    dropoffSuggestedId: 'loc_galle_fort',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
    badge: 'Airport Priority',
    inclusions: [
      'All Expressway Highway Tolls Included',
      'Flight Delay Guarantee & Free 90 Min Airport Wait Time',
      'Air Conditioned Luxury Sedan / Van',
      'Bottled Ceylon Water & In-car phone charger'
    ]
  },
  {
    id: 'tour_custom_islandwide',
    title: 'Custom "Travel Anywhere in Sri Lanka" Itinerary',
    tagline: 'Tailor your own dream journey across any towns, beaches, and tea hills in Sri Lanka',
    destinationHub: 'Islandwide (You Choose)',
    duration: 'Custom Duration (Flexible Hours / Days)',
    kmEstimated: 200,
    highlights: [
      'Complete freedom: Choose any pickup and dropoff points across Sri Lanka',
      'Stop whenever you want for scenic photography, coconuts & street food',
      'Dedicated Chauffeur stays with you throughout your journey',
      'Support for surfboards, hiking gear, and family child seats',
      'Expert local insights on hidden waterfalls and secret viewpoints'
    ],
    recommendedVehicle: 'sedan',
    baseFareLkr: 25000,
    baseFareUsd: 82,
    pickupSuggestedId: 'loc_galle_face',
    dropoffSuggestedId: 'loc_galle_fort',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    badge: '100% Flexible',
    inclusions: [
      'Dedicated Chauffeur Guide for the Entire Route',
      'Fuel & Highway Tolls Included for selected route',
      'Unlimited photo stops & restaurant breaks',
      'WhatsApp Live Driver Location link'
    ]
  }
];

