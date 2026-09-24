import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Navigation, 
  X, 
  LogOut, 
  ArrowRight, 
  KeyRound, 
  Compass, 
  Home, 
  Briefcase, 
  Heart, 
  RefreshCw, 
  AlertCircle, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { CustomerUser, LocationPoint, CustomerSavedPlace } from '../../types';
import { detectBrowserLocation, createGpsLocationPoint, savedPlaceToLocationPoint } from '../../utils/locationUtils';
import { SRI_LANKA_LOCATIONS } from '../../data/mockLocations';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerUser: CustomerUser | null;
  onLogin: (user: CustomerUser, detectedLocation?: LocationPoint) => void;
  onLogout: () => void;
  onSelectPickup?: (location: LocationPoint) => void;
  onSendSms?: (phone: string, text: string) => void;
  initialPrompt?: string;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  customerUser,
  onLogin,
  onLogout,
  onSelectPickup,
  onSendSms,
  initialPrompt,
}) => {
  const [authMethod, setAuthMethod] = useState<'otp' | 'google' | 'profile'>('otp');
  const [phoneInput, setPhoneInput] = useState('+94 77 982 1092');
  const [nameInput, setNameInput] = useState('Kasun Perera');
  const [emailInput, setEmailInput] = useState('kasun.perera@gmail.com');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('4819');
  const [autoDetectLocation, setAutoDetectLocation] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'signin' | 'saved_places'>('signin');

  if (!isOpen) return null;

  // Detect Mobile Network Carrier in Sri Lanka
  const getCarrier = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.includes('77') || clean.includes('76')) return 'Dialog Axiata';
    if (clean.includes('71') || clean.includes('70')) return 'Mobitel';
    if (clean.includes('78') || clean.includes('72')) return 'Hutch';
    if (clean.includes('75')) return 'Airtel';
    return 'Dialog / Mobitel';
  };

  const handleSendOtp = () => {
    if (phoneInput.trim().length < 9) {
      setAuthError('Please enter a valid Sri Lankan mobile phone number.');
      return;
    }
    setAuthError('');
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);

    if (onSendSms) {
      onSendSms(
        phoneInput,
        `Naspick Customer Security: Your 1-tap booking verification code is ${randomOtp}. Valid for 5 minutes. Do not share.`
      );
    }
  };

  const handleCompleteLogin = async (overrideName?: string, overrideEmail?: string) => {
    setIsDetectingLocation(true);
    setLocationStatusMessage('Authenticating and syncing your live Sri Lanka location...');

    let detectedPoint: LocationPoint | undefined;

    if (autoDetectLocation) {
      try {
        const geo = await detectBrowserLocation();
        if (geo.success) {
          detectedPoint = createGpsLocationPoint(geo.lat, geo.lng, geo.accuracy);
          setLocationStatusMessage(`GPS Location verified: Near ${geo.nearestLocation?.name || 'Colombo'}`);
        } else {
          // Fallback to Colombo Fort / Galle Face
          detectedPoint = SRI_LANKA_LOCATIONS[0];
          setLocationStatusMessage('Defaulting to Colombo Central Hub');
        }
      } catch (err) {
        detectedPoint = SRI_LANKA_LOCATIONS[0];
      }
    }

    const newUser: CustomerUser = {
      id: customerUser?.id || `cust_${Date.now()}`,
      name: overrideName || nameInput || 'Valued Customer',
      phone: phoneInput || '+94 77 982 1092',
      email: overrideEmail || emailInput || 'customer@naspick.lk',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      isLoggedIn: true,
      memberSince: customerUser?.memberSince || 'September 2026',
      tier: 'Gold VIP',
      rewardPoints: customerUser?.rewardPoints || 350,
      savedPlaces: customerUser?.savedPlaces || [
        {
          id: 'p_home',
          label: 'Home',
          name: 'Kollupitiya Residence',
          address: '42 Galle Road, Colombo 03',
          city: 'Colombo',
          lat: 6.9080,
          lng: 79.8510,
        },
        {
          id: 'p_work',
          label: 'Work',
          name: 'World Trade Center (WTC)',
          address: 'Echelon Square, Colombo 01',
          city: 'Colombo',
          lat: 6.9333,
          lng: 79.8436,
        },
        {
          id: 'p_fav',
          label: 'Airport',
          name: 'Bandaranaike Intl Airport (CMB)',
          address: 'Katunayake Expressway Gate, Negombo',
          city: 'Negombo',
          lat: 7.1808,
          lng: 79.8841,
        },
      ],
      lastLoginLocation: detectedPoint
        ? {
            lat: detectedPoint.lat,
            lng: detectedPoint.lng,
            placeName: detectedPoint.name,
            cityName: detectedPoint.city,
            timestamp: Date.now(),
            source: 'gps',
          }
        : undefined,
    };

    setIsDetectingLocation(false);
    onLogin(newUser, detectedPoint);
    onClose();
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '1234') {
      setAuthError('Incorrect OTP code. Please check your SMS drawer or click "Auto-fill Code".');
      return;
    }
    setAuthError('');
    handleCompleteLogin();
  };

  const handleApplySavedPlace = (place: CustomerSavedPlace) => {
    if (onSelectPickup) {
      const loc = savedPlaceToLocationPoint(place);
      onSelectPickup(loc);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient strip */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-heading">
                  {customerUser?.isLoggedIn ? 'Customer Profile & Location' : 'Customer Sign In'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instant 1-Tap Booking
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {initialPrompt || 'Access live GPS auto-detection, saved places, and automated SMS tracking'}
              </p>
            </div>
          </div>

          <button
            id="close-customer-auth-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* If already logged in, show Profile and Saved Locations */}
          {customerUser?.isLoggedIn ? (
            <div className="space-y-4">
              {/* Member Card */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={customerUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                      alt={customerUser.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-slate-950 font-bold" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{customerUser.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        {customerUser.tier}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{customerUser.phone}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{customerUser.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Naspick Points</span>
                  <span className="text-lg font-black text-amber-400 font-heading">
                    {customerUser.rewardPoints} pts
                  </span>
                  <span className="text-[9px] text-emerald-400 block">✓ Active Account</span>
                </div>
              </div>

              {/* Login Location Status Banner */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Live Customer Location Integration</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsDetectingLocation(true);
                      const geo = await detectBrowserLocation();
                      if (geo.success && onSelectPickup) {
                        const point = createGpsLocationPoint(geo.lat, geo.lng, geo.accuracy);
                        onSelectPickup(point);
                        setLocationStatusMessage(`Updated pickup to live GPS: Near ${geo.nearestLocation?.name}`);
                      }
                      setIsDetectingLocation(false);
                    }}
                    disabled={isDetectingLocation}
                    className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                    <span>Sync Live GPS</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  {customerUser.lastLoginLocation ? (
                    <>
                      Logged in from <strong className="text-emerald-300">{customerUser.lastLoginLocation.placeName}</strong> ({customerUser.lastLoginLocation.cityName})
                    </>
                  ) : (
                    'Auto-syncs your Sri Lanka device coordinates directly to pickup location.'
                  )}
                </p>

                {locationStatusMessage && (
                  <p className="text-[11px] text-emerald-400 font-medium">{locationStatusMessage}</p>
                )}
              </div>

              {/* Saved Places */}
              <div>
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>My Saved Places (1-Tap Pickup)</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {customerUser.savedPlaces.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => handleApplySavedPlace(place)}
                      className="p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          {place.label === 'Home' && <Home className="w-3 h-3" />}
                          {place.label === 'Work' && <Briefcase className="w-3 h-3" />}
                          {place.label === 'Airport' && <Navigation className="w-3 h-3" />}
                          <span>{place.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 group-hover:text-emerald-300">Apply →</span>
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{place.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{place.address}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of this Device</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Return to Booking
                </button>
              </div>
            </div>
          ) : (
            /* Sign In State */
            <div className="space-y-4">
              {/* Quick Google One-Tap / Social Quick Login Banner */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick 1-Click Verification
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCompleteLogin('efastqa', 'efastqa@gmail.com')}
                    className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="truncate">Sign in with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCompleteLogin('Kasun Perera', 'kasun.perera@gmail.com')}
                    className="py-2.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demo Customer (Kasun)</span>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="w-full h-[1px] bg-slate-800"></div>
                <span className="absolute px-3 bg-slate-900 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Or Sign In via Sri Lanka Mobile
                </span>
              </div>

              {/* Sri Lanka Phone Number & OTP Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Mobile Phone Number (Dialog / Mobitel / Hutch / Airtel)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                        <span className="text-base">🇱🇰</span>
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl py-2.5 pl-16 pr-3 text-xs text-white font-mono font-medium focus:outline-none"
                      />
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex-shrink-0"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex-shrink-0"
                      >
                        Resend
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Carrier Detected: <strong className="text-emerald-400">{getCarrier(phoneInput)}</strong>
                  </span>
                </div>

                {/* OTP Verification Box */}
                {otpSent && (
                  <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Enter 4-Digit SMS Code</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(generatedOtp)}
                        className="text-[10px] text-emerald-400 hover:underline font-bold"
                      >
                        Auto-fill Code ({generatedOtp})
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="••••"
                        className="w-32 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl py-2 text-center text-base tracking-widest font-mono text-white font-bold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Simulation Note: OTP sent to top SMS Notification drawer.
                    </p>
                  </div>
                )}

                {/* Name and Email details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Kasun Perera"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Email (Trip Receipt)
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. name@gmail.com"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Critical Feature: Auto-Detect Live Location on Login Toggle */}
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Navigation className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0 animate-pulse" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Auto-Detect & Integrate Live Location</h5>
                      <p className="text-[11px] text-slate-300">
                        Automatically sets your device GPS coordinates as pickup point upon login for seamless booking.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={autoDetectLocation}
                      onChange={(e) => setAutoDetectLocation(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {authError && (
                  <div className="p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Sign In CTA */}
                <button
                  type="button"
                  id="submit-customer-signin-btn"
                  onClick={() => handleCompleteLogin()}
                  disabled={isDetectingLocation}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isDetectingLocation ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Detecting GPS Location & Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In & Sync Location</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
