import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  roleRider: string;
  roleDriver: string;
  roleAdmin: string;
  whereTo: string;
  whereToSub: string;
  pickupLocation: string;
  destination: string;
  addStop: string;
  stop: string;
  removeStop: string;
  popular: string;
  chooseFleet: string;
  estimatedDistance: string;
  minsAway: string;
  seats: string;
  ac: string;
  promoCodePlaceholder: string;
  apply: string;
  paymentMethod: string;
  cashToDriver: string;
  visaMaster: string;
  payhereGateway: string;
  lankaQrGenie: string;
  viewBreakdown: string;
  hideBreakdown: string;
  total: string;
  confirmRide: string;
  findingDriver: string;
  driverConfirmed: string;
  driverArriving: string;
  tripInProgress: string;
  rideOtp: string;
  emergencySos: string;
  shareTrip: string;
  chatWithDriver: string;
  callDriver: string;
  cancelRide: string;
  tabRides: string;
  tabDelivery: string;
  tabRentals: string;
  tabTours: string;
  scheduleForLater: string;
  scheduleRide: string;
  airportTransfer: string;
  flightNumber: string;
  flightPlaceholder: string;
  useExpressway: string;
  splitFare: string;
  splitWith: string;
  perPerson: string;
  sendSplitWhatsapp: string;
  safetyContactTitle: string;
  trustedContact: string;
  routeDeviationMonitored: string;
  parcelCategory: string;
  documents: string;
  foodMeals: string;
  electronics: string;
  boxes: string;
  recipientName: string;
  recipientPhone: string;
  deliveryInstructions: string;
  confirmDelivery: string;
  hourlyPackages: string;
  hoursIncluded: string;
  kmIncluded: string;
  bookRental: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'Naspick Sri Lanka',
    tagline: 'Reliable Rides & Flash Delivery Across Sri Lanka',
    roleRider: 'Rider',
    roleDriver: 'Driver Partner',
    roleAdmin: 'Admin Control',
    whereTo: 'Where to in Sri Lanka?',
    whereToSub: 'Reliable instant pickups across Colombo & suburbs',
    pickupLocation: 'Pickup Location',
    destination: 'Destination',
    addStop: '+ Add Intermediate Stop',
    stop: 'Stop',
    removeStop: 'Remove',
    popular: 'Popular',
    chooseFleet: 'Choose Sri Lankan Fleet',
    estimatedDistance: 'Est. Distance',
    minsAway: 'mins away',
    seats: 'seats',
    ac: 'AC',
    promoCodePlaceholder: 'PROMO CODE (E.G. AYUBOWAN)',
    apply: 'Apply',
    paymentMethod: 'Select Payment Method',
    cashToDriver: 'Cash to Driver',
    visaMaster: 'Visa / Mastercard',
    payhereGateway: 'PayHere Gateway',
    lankaQrGenie: 'LankaQR / Genie',
    viewBreakdown: 'View Transparent Fare Breakdown',
    hideBreakdown: 'Hide Breakdown',
    total: 'Total',
    confirmRide: 'Confirm',
    findingDriver: 'Finding Closest Driver...',
    driverConfirmed: 'Driver Confirmed',
    driverArriving: 'Driver Arriving at Pickup',
    tripInProgress: 'Trip In Progress',
    rideOtp: 'Ride OTP',
    emergencySos: 'Emergency SOS (119)',
    shareTrip: 'Share Live Trip Link',
    chatWithDriver: 'Chat with Driver',
    callDriver: 'Call Driver',
    cancelRide: 'Cancel Ride',
    tabRides: 'Rides',
    tabDelivery: 'Flash Courier',
    tabRentals: 'Hourly Rentals',
    tabTours: 'Tourist Tours',
    scheduleForLater: 'Book for Later / Airport',
    scheduleRide: 'Schedule Pickup',
    airportTransfer: 'CMB Airport Transfer',
    flightNumber: 'Flight Number (Optional)',
    flightPlaceholder: 'e.g. UL 504 / EK 651',
    useExpressway: 'Include Expressway (E03 / E01) Toll',
    splitFare: 'Split Fare with Friends',
    splitWith: 'Split between',
    perPerson: 'per person',
    sendSplitWhatsapp: 'Share via WhatsApp',
    safetyContactTitle: 'Primary Trusted Safety Contact',
    trustedContact: 'Trusted Contact: 0775260765',
    routeDeviationMonitored: 'Route Protected • 24/7 Security Operations',
    parcelCategory: 'Parcel Category',
    documents: 'Documents / Legal',
    foodMeals: 'Food & Meals',
    electronics: 'Electronics / Fragile',
    boxes: 'Box & Merchandise',
    recipientName: 'Recipient Full Name',
    recipientPhone: 'Recipient Phone (+94)',
    deliveryInstructions: 'Delivery Instructions',
    confirmDelivery: 'Confirm Flash Courier',
    hourlyPackages: 'Hourly & Day Rental Packages',
    hoursIncluded: 'Hours',
    kmIncluded: 'km included',
    bookRental: 'Book Chauffeur Rental',
  },
  si: {
    appName: 'නැස්පික් ශ්‍රී ලංකා',
    tagline: 'ශ්‍රී ලංකාව පුරා විශ්වාසනීය ප්‍රවාහන සහ පාර්සල් සේවය',
    roleRider: 'මගියා',
    roleDriver: 'රියදුරු හවුල්කරු',
    roleAdmin: 'පරිපාලක පාලනය',
    whereTo: 'ශ්‍රී ලංකාවේ කොහේද යන්නේ?',
    whereToSub: 'කොළඹ සහ තදාසන්න ප්‍රදේශවල විශ්වාසදායක ක්ෂණික සේවය',
    pickupLocation: 'ආරම්භක ස්ථානය (Pickup)',
    destination: 'ගමනාන්තය (Destination)',
    addStop: '+ අතරමැදි නැවතුමක් එක්කරන්න',
    stop: 'නැවතුම',
    removeStop: 'ඉවත්කරන්න',
    popular: 'ජනප්‍රිය',
    chooseFleet: 'ශ්‍රී ලංකා වාහන පෙළ තෝරන්න',
    estimatedDistance: 'දළ දුර',
    minsAway: 'මිනිත්තු දුරින්',
    seats: 'ආසන',
    ac: 'වායුසමනය (AC)',
    promoCodePlaceholder: 'ප්‍රවර්ධන කේතය (උදා: AYUBOWAN)',
    apply: 'භාවිතා කරන්න',
    paymentMethod: 'ගෙවීම් ක්‍රමය තෝරන්න',
    cashToDriver: 'රියදුරුට මුදල් (Cash)',
    visaMaster: 'Visa / Mastercard',
    payhereGateway: 'PayHere ද්වාරය',
    lankaQrGenie: 'ලංකා QR / Genie',
    viewBreakdown: 'ගාස්තු විස්තරය බලන්න',
    hideBreakdown: 'විස්තරය සඟවන්න',
    total: 'මුළු මුදල',
    confirmRide: 'තහවුරු කරන්න',
    findingDriver: 'ළඟම රියදුරු සොයමින්...',
    driverConfirmed: 'රියදුරු තහවුරු විය',
    driverArriving: 'රියදුරු පැමිණෙමින් සිටී',
    tripInProgress: 'ගමන සිදුවෙමින් පවතී',
    rideOtp: 'ආරක්ෂක OTP',
    emergencySos: 'හදිසි ආධාර (119)',
    shareTrip: 'සජීවී ගමන් සබැඳිය බෙදාගන්න',
    chatWithDriver: 'රියදුරු සමඟ කතාබස්',
    callDriver: 'රියදුරු අමතන්න',
    cancelRide: 'ගමන අවලංගු කරන්න',
    tabRides: 'ගමන් (Rides)',
    tabDelivery: 'ෆ්ලෑෂ් පාර්සල් (Delivery)',
    tabRentals: 'පැය කුලියට (Rentals)',
    tabTours: 'සංචාරක ගමන් (Tours)',
    scheduleForLater: 'පසුවට වෙන්කරන්න / ගුවන් තොටුපළ',
    scheduleRide: 'වේලාව වෙන්කරන්න',
    airportTransfer: 'කටුනායක ගුවන් තොටුපළ ගමන',
    flightNumber: 'ගුවන් යානා අංකය',
    flightPlaceholder: 'උදා: UL 504 / EK 651',
    useExpressway: 'අධිවේගී මාර්ග ගාස්තු එක්කරන්න (E03 / E01)',
    splitFare: 'මිතුරන් සමඟ ගාස්තුව බෙදාගන්න',
    splitWith: 'බෙදාගන්නා ගණන',
    perPerson: 'එක් අයෙකුට',
    sendSplitWhatsapp: 'WhatsApp මගින් යවන්න',
    safetyContactTitle: 'ප්‍රධාන විශ්වාසවන්ත ආරක්ෂක අංකය',
    trustedContact: 'විශ්වාසවන්ත අංකය: 0775260765',
    routeDeviationMonitored: 'මාර්ගය ආරක්ෂිතයි • 24/7 කොළඹ ආරක්ෂක මධ්‍යස්ථානය',
    parcelCategory: 'පාර්සල් වර්ගය',
    documents: 'ලිපි ලේඛන (Documents)',
    foodMeals: 'ආහාර පාන (Food)',
    electronics: 'ඉලෙක්ට්‍රොනික / බිඳෙනසුලු',
    boxes: 'පෙට්ටි / බඩු භාණ්ඩ',
    recipientName: 'ලබන්නාගේ නම',
    recipientPhone: 'ලබන්නාගේ දුරකථන අංකය (+94)',
    deliveryInstructions: 'භාරදීමේ උපදෙස්',
    confirmDelivery: 'පාර්සල් ගමන තහවුරු කරන්න',
    hourlyPackages: 'පැය සහ දින කුලී පැකේජ',
    hoursIncluded: 'පැය',
    kmIncluded: 'කි.මී. ඇතුළත්',
    bookRental: 'රියදුරු සහිත කුලී රථය වෙන්කරන්න',
  },
  ta: {
    appName: 'நாஸ்பிக் இலங்கை',
    tagline: 'இலங்கை முழுவதும் நம்பகமான சவாரிகள் மற்றும் பொதி விநியோகம்',
    roleRider: 'பயணி',
    roleDriver: 'சாரதி பங்காளர்',
    roleAdmin: 'நிர்வாகக் கட்டுப்பாடு',
    whereTo: 'இலங்கையில் எங்கு செல்ல வேண்டும்?',
    whereToSub: 'கொழும்பு மற்றும் புறநகர்ப் பகுதிகளில் உடனடி சவாரிகள்',
    pickupLocation: 'ஏறும் இடம் (Pickup)',
    destination: 'இலக்கு (Destination)',
    addStop: '+ இடைப்பட்ட நிறுத்தத்தைச் சேர்க்கவும்',
    stop: 'நிறுத்தம்',
    removeStop: 'நீக்கு',
    popular: 'பிரபலம்',
    chooseFleet: 'வாகன வகையைத் தேர்ந்தெடுக்கவும்',
    estimatedDistance: 'தோராய தூரம்',
    minsAway: 'நிமிட தூரத்தில்',
    seats: 'இருக்கைகள்',
    ac: 'குளிரூட்டி (AC)',
    promoCodePlaceholder: 'தள்ளுபடி குறியீடு (எ.கா: AYUBOWAN)',
    apply: 'பயன்படுத்து',
    paymentMethod: 'பணம் செலுத்தும் முறை',
    cashToDriver: 'சாரதிக்கு ரொக்கப் பணம்',
    visaMaster: 'Visa / Mastercard',
    payhereGateway: 'PayHere நுழைவாயில்',
    lankaQrGenie: 'லங்கா QR / Genie',
    viewBreakdown: 'கட்டண விவரத்தைப் பார்க்கவும்',
    hideBreakdown: 'விவரத்தை மறை',
    total: 'மொத்தம்',
    confirmRide: 'உறுதிசெய்க',
    findingDriver: 'அருகிலுள்ள சாரதியைத் தேடுகிறது...',
    driverConfirmed: 'சாரதி உறுதிசெய்யப்பட்டார்',
    driverArriving: 'சாரதி வந்தடைகிறார்',
    tripInProgress: 'பயணம் தொடர்கிறது',
    rideOtp: 'பாதுகாப்பு OTP',
    emergencySos: 'அவசர உதவி (119)',
    shareTrip: 'நேரலை சவாரி இணைப்பைப் பகிரவும்',
    chatWithDriver: 'சாரதியுடன் உரையாடு',
    callDriver: 'சாரதியை அழைக்கவும்',
    cancelRide: 'சவாரியை ரத்துசெய்',
    tabRides: 'சவாரிகள் (Rides)',
    tabDelivery: 'பொதி விநியோகம் (Delivery)',
    tabRentals: 'மணித்தியால வாடகை (Rentals)',
    tabTours: 'சுற்றுலாப் பயணங்கள் (Tours)',
    scheduleForLater: 'முன்பதிவு / விமான நிலையம்',
    scheduleRide: 'நேரத்தை முன்பதிவு செய்',
    airportTransfer: 'விமான நிலைய பரிமாற்றம்',
    flightNumber: 'விமான எண் (விருப்பத்தேர்வு)',
    flightPlaceholder: 'எ.கா: UL 504 / EK 651',
    useExpressway: 'நெடுஞ்சாலைக் கட்டணத்தைச் சேர் (E03 / E01)',
    splitFare: 'நண்பர்களுடன் கட்டணத்தைப் பிரித்துக் கொள்க',
    splitWith: 'பிரித்துக் கொள்ளும் நபர்கள்',
    perPerson: 'ஒரு நபருக்கு',
    sendSplitWhatsapp: 'WhatsApp மூலம் அனுப்பு',
    safetyContactTitle: 'முதன்மை நம்பகமான தொடர்பு எண்',
    trustedContact: 'பாதுகாப்பு எண்: 0775260765',
    routeDeviationMonitored: 'பாதை பாதுகாப்பானது • 24/7 பாதுகாப்பு கண்காணிப்பு',
    parcelCategory: 'பொதி வகை',
    documents: 'ஆவணங்கள் (Documents)',
    foodMeals: 'உணவு வகைகள்',
    electronics: 'மின்னணு / உடையக்கூடியவை',
    boxes: 'பெட்டிகள் மற்றும் பொருட்கள்',
    recipientName: 'பெறுநரின் முழுப் பெயர்',
    recipientPhone: 'பெறுநரின் தொலைபேசி எண் (+94)',
    deliveryInstructions: 'விநியோகக் குறிப்புகள்',
    confirmDelivery: 'பொதி விநியோகத்தை உறுதிசெய்',
    hourlyPackages: 'மணித்தியால மற்றும் நாள் வாடகைத் திட்டங்கள்',
    hoursIncluded: 'மணித்தியாலங்கள்',
    kmIncluded: 'கி.மீ உள்ளடங்கியது',
    bookRental: 'சாரதியுடன் வாடகை வாகனத்தை முன்பதிவு செய்',
  },
};

export const RENTAL_PACKAGES = [
  {
    id: 'rent_2h',
    title: 'Colombo Quick Business Run',
    hours: 2,
    kmIncluded: 20,
    baseFareLkr: 2800,
    extraPerKmLkr: 120,
    description: 'Perfect for quick banking, embassy visits, or shopping errands with waiting driver.',
    recommendedVehicle: 'sedan',
  },
  {
    id: 'rent_4h',
    title: 'Colombo City Tour & Shopping',
    hours: 4,
    kmIncluded: 40,
    baseFareLkr: 4800,
    extraPerKmLkr: 125,
    description: 'Visit One Galle Face, Lotus Tower, Independence Square, and Pettah with ease.',
    recommendedVehicle: 'sedan',
  },
  {
    id: 'rent_8h',
    title: 'Full Day Western Province Exploration',
    hours: 8,
    kmIncluded: 80,
    baseFareLkr: 8900,
    extraPerKmLkr: 135,
    description: 'Chauffeur-driven executive ride for full day meetings, Mount Lavinia & Negombo.',
    recommendedVehicle: 'sedan',
  },
  {
    id: 'rent_12h_kandy',
    title: 'Kandy Hill Country Day Excursion',
    hours: 12,
    kmIncluded: 220,
    baseFareLkr: 19500,
    extraPerKmLkr: 150,
    description: 'Day tour to Temple of the Tooth, Peradeniya Botanical Gardens, and tea factories.',
    recommendedVehicle: 'van',
  },
];
