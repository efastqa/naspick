import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Car, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Camera, 
  UploadCloud, 
  ShieldCheck, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Building2, 
  Fuel, 
  Award, 
  PartyPopper,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { Driver, VehicleCategory } from '../../types';

interface DriverRegistrationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterDriver: (driver: Partial<Driver>) => void;
}

const PROVINCES = [
  { code: 'WP', name: 'Western Province (Colombo, Gampaha, Kalutara)' },
  { code: 'CP', name: 'Central Province (Kandy, Matale, Nuwara Eliya)' },
  { code: 'SP', name: 'Southern Province (Galle, Matara, Hambantota)' },
  { code: 'NW', name: 'North Western (Kurunegala, Puttalam)' },
  { code: 'NC', name: 'North Central (Anuradhapura, Polonnaruwa)' },
  { code: 'EP', name: 'Eastern Province (Trincomalee, Batticaloa)' },
  { code: 'NP', name: 'Northern Province (Jaffna, Vavuniya)' },
  { code: 'SG', name: 'Sabaragamuwa (Ratnapura, Kegalle)' },
  { code: 'UP', name: 'Uva Province (Badulla, Ella)' },
];

const SRI_LANKAN_BANKS = [
  'Commercial Bank of Ceylon',
  'Sampath Bank PLC',
  'Bank of Ceylon (BOC)',
  'Hatton National Bank (HNB)',
  'People\'s Bank',
  'Nations Trust Bank (NTB)',
  'Seylan Bank',
  'Amana Bank (Islamic Banking)',
  'DFCC Bank',
  'National Development Bank (NDB)',
];

const CITY_HUBS: Record<string, { lat: number; lng: number }> = {
  'Colombo Central / Fort': { lat: 6.9344, lng: 79.8428 },
  'Colombo 03 (Kollupitiya)': { lat: 6.9080, lng: 79.8510 },
  'Colombo 07 (Cinnamon Gardens)': { lat: 6.9060, lng: 79.8690 },
  'Negombo (Bandaranaike Airport)': { lat: 7.1808, lng: 79.8841 },
  'Kandy City Center': { lat: 7.2906, lng: 80.6337 },
  'Galle Fort & Unawatuna': { lat: 6.0329, lng: 80.2168 },
  'Kurunegala Town': { lat: 7.4863, lng: 80.3623 },
};

export const DriverRegistrationWizardModal: React.FC<DriverRegistrationWizardModalProps> = ({
  isOpen,
  onClose,
  onRegisterDriver,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSuccessComplete, setIsSuccessComplete] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  // Step 1: Personal Details (Blank for real driver live onboarding)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+94 7');
  const [nicNumber, setNicNumber] = useState('');
  const [cityHub, setCityHub] = useState('Colombo Central / Fort');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(true);

  // Step 2: Vehicle Information
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('tuk');
  const [vehicleModel, setVehicleModel] = useState('');
  const [province, setProvince] = useState('WP');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleYear, setVehicleYear] = useState('2022');
  const [vehicleColor, setVehicleColor] = useState('');
  const [hasAc, setHasAc] = useState(false);
  const [eligibleServices, setEligibleServices] = useState<string[]>(['ride', 'delivery']);

  // Step 3: Document Verification (Simulated instant validation)
  const [documentsUploaded, setDocumentsUploaded] = useState({
    licenseFront: true,
    licenseBack: true,
    revenueLicense: true,
    insuranceCard: true,
    policeClearance: true,
  });

  // Step 4: Banking & Payouts
  const [bankName, setBankName] = useState('Commercial Bank of Ceylon');
  const [accountNumber, setAccountNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [payoutSchedule, setPayoutSchedule] = useState<'instant' | 'weekly'>('instant');

  if (!isOpen) return null;

  // Preset Auto-fill helpers for instant testing
  const handleApplyPreset = (type: 'tuk' | 'sedan' | 'van' | 'moto') => {
    if (type === 'tuk') {
      setName('Nuwan Pradeep Weerasinghe');
      setPhone('+94 77 982 4410');
      setNicNumber('199320401928');
      setVehicleCategory('tuk');
      setProvince('WP');
      setPlateNumber('ABY-7734');
      setVehicleModel('Bajaj RE 4S 205cc Twin-Spark');
      setVehicleYear('2022');
      setVehicleColor('Emerald Green & Island Gold');
      setCityHub('Colombo Central / Fort');
      setBankName('Commercial Bank of Ceylon');
      setAccountNumber('8019482014');
      setBranch('Colombo Fort');
      setAccountHolder('Nuwan Pradeep Weerasinghe');
      setHasAc(false);
      setEligibleServices(['ride', 'delivery']);
      setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');
    } else if (type === 'sedan') {
      setName('Sanjeewa Kumara Dissanayake');
      setPhone('+94 71 884 1029');
      setNicNumber('198610400199');
      setVehicleCategory('sedan');
      setProvince('WP');
      setPlateNumber('CAD-8812');
      setVehicleModel('Toyota Premio 1.8G Executive');
      setVehicleYear('2021');
      setVehicleColor('Pearl White Metallic');
      setCityHub('Negombo (Bandaranaike Airport)');
      setBankName('Sampath Bank PLC');
      setAccountNumber('00425001928');
      setBranch('Airport Super Branch');
      setAccountHolder('Sanjeewa Kumara Dissanayake');
      setHasAc(true);
      setEligibleServices(['ride', 'tour', 'rental']);
      setAvatarUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150');
    } else if (type === 'van') {
      setName('Sunil Shantha Jayawardena');
      setPhone('+94 72 449 0182');
      setNicNumber('197820100941');
      setVehicleCategory('van');
      setProvince('WP');
      setPlateNumber('PC-9018');
      setVehicleModel('Toyota HiAce KDH 201 Super GL 9-Seater');
      setVehicleYear('2023');
      setVehicleColor('Diamond Silver Metallic');
      setCityHub('Galle Fort & Unawatuna');
      setBankName('Bank of Ceylon (BOC)');
      setAccountNumber('79204918');
      setBranch('Galle Bazaar');
      setAccountHolder('Sunil Shantha Jayawardena');
      setHasAc(true);
      setEligibleServices(['ride', 'tour', 'rental']);
      setAvatarUrl('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150');
    } else if (type === 'moto') {
      setName('Dinesh Roshan Perera');
      setPhone('+94 76 112 9081');
      setNicNumber('199830104812');
      setVehicleCategory('moto');
      setProvince('WP');
      setPlateNumber('BHW-4190');
      setVehicleModel('Yamaha FZ-S 150cc Courier Edition');
      setVehicleYear('2023');
      setVehicleColor('Matte Blue & Neon');
      setCityHub('Colombo 03 (Kollupitiya)');
      setBankName('Hatton National Bank (HNB)');
      setAccountNumber('1048201948');
      setBranch('Kollupitiya');
      setAccountHolder('Dinesh Roshan Perera');
      setHasAc(false);
      setEligibleServices(['delivery']);
      setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
    }
  };

  const handleToggleService = (srv: string) => {
    setEligibleServices((prev) => 
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleFinalSubmit = () => {
    setValidationError('');
    if (!name.trim()) {
      setValidationError('Please enter your full legal name in Step 1');
      setCurrentStep(1);
      return;
    }
    if (!plateNumber.trim()) {
      setValidationError('Please enter your vehicle license plate number in Step 2');
      setCurrentStep(2);
      return;
    }

    const fullPlate = `${province} ${plateNumber.trim().toUpperCase()}`;
    const hubCoords = CITY_HUBS[cityHub] || { lat: 6.9344, lng: 79.8428 };
    const defaultModel = 
      vehicleCategory === 'tuk' ? 'Bajaj RE 4S' :
      vehicleCategory === 'nano' ? 'Suzuki Wagon R' :
      vehicleCategory === 'van' ? 'Toyota HiAce KDH' :
      vehicleCategory === 'moto' ? 'Yamaha FZ 150cc' : 'Toyota Prius';

    const newDriver: Partial<Driver> = {
      id: `drv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      phone: phone.trim() || '+94 77 123 4567',
      avatar: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      vehicleCategory,
      vehicleModel: `${vehicleModel.trim() || defaultModel} ${hasAc ? '(AC)' : ''}`.trim(),
      vehiclePlate: fullPlate,
      vehicleColor: vehicleColor.trim() || (vehicleCategory === 'tuk' ? 'Emerald Green' : 'White'),
      rating: 5.0,
      totalTrips: 0,
      isOnline: true,
      isBusy: false,
      currentLat: hubCoords.lat + (Math.random() - 0.5) * 0.008,
      currentLng: hubCoords.lng + (Math.random() - 0.5) * 0.008,
      heading: Math.floor(Math.random() * 360),
      earningsTodayLkr: 0,
      walletBalanceLkr: 5000, // LKR 5,000 Welcome fuel credit bonus!
      nicNumber: nicNumber.trim() || '199000000000',
      verificationStatus: 'approved',
      bankDetails: {
        bankName,
        accountNumber: accountNumber.trim() || '8001234567',
        branch: branch.trim() || 'Main Branch',
        accountHolder: accountHolder.trim() || name.trim(),
      },
    };

    onRegisterDriver(newDriver);
    setIsSuccessComplete(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="driver-registration-wizard-card"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Naspick Captain Portal
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[9px] rounded-full uppercase">
                  Fast Onboarding
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                Driver Partner Self-Service Registration
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Fill helper */}
        {!isSuccessComplete && (
          <div className="bg-slate-950/70 px-4 py-2 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Fill Demo Profile:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleApplyPreset('tuk')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  vehicleCategory === 'tuk'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                🛺 Tuk Captain
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('sedan')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  vehicleCategory === 'sedan'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                🚗 Sedan Chauffeur
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('van')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  vehicleCategory === 'van'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                🚐 KDH Tour Van
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('moto')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  vehicleCategory === 'moto'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                🏍️ Courier Rider
              </button>
            </div>
          </div>
        )}

        {/* Step Progress Tracker */}
        {!isSuccessComplete && (
          <div className="p-3 bg-slate-950/40 border-b border-slate-800 px-4 sm:px-6">
            <div className="flex items-center justify-between relative">
              {[
                { num: 1, label: 'Personal', icon: UserCheck },
                { num: 2, label: 'Vehicle', icon: Car },
                { num: 3, label: 'Documents', icon: FileText },
                { num: 4, label: 'Bank Payout', icon: CreditCard },
                { num: 5, label: 'Review & Go', icon: Award },
              ].map((step) => {
                const Icon = step.icon;
                const isPassed = currentStep > step.num;
                const isCurrent = currentStep === step.num;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setCurrentStep(step.num)}
                    className="flex flex-col items-center gap-1 group focus:outline-none z-10"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950 shadow-lg scale-105'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        isCurrent ? 'text-white' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {validationError && !isSuccessComplete && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-2xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
              <button
                type="button"
                onClick={() => setValidationError('')}
                className="text-rose-400 hover:text-rose-200"
              >
                ✕
              </button>
            </div>
          )}

          {isSuccessComplete ? (
            /* Celebration Screen */
            <div className="text-center py-6 sm:py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
                <PartyPopper className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full uppercase">
                  Application Approved & Fleet Activated
                </span>
                <h3 className="text-2xl font-black text-white font-heading mt-2">
                  Ayubowan, Captain {name}!
                </h3>
                <p className="text-slate-300 text-xs max-w-md mx-auto leading-relaxed">
                  Your vehicle <strong className="text-white font-mono">{province} {plateNumber}</strong> is now registered to Naspick Sri Lanka. We have credited <strong className="text-emerald-400">LKR 5,000 Welcome Fuel Bonus</strong> into your driver wallet!
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Platform Commission:</span>
                  <span className="font-extrabold text-emerald-400">5.0% Guaranteed Flat</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Operating City Hub:</span>
                  <span className="font-bold text-white">{cityHub}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Direct Deposit Bank:</span>
                  <span className="font-bold text-white">{bankName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Driver Radar Status:</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Online & Ready for Trips
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full max-w-md py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl shadow-xl transition-all text-sm"
                >
                  Enter Driver Cockpit Dashboard →
                </button>
              </div>
            </div>
          ) : currentStep === 1 ? (
            /* STEP 1: PERSONAL & CONTACT */
            <div className="space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Join over 12,000 verified driver captains across Sri Lanka. Please provide your legal details matching your National Identity Card (NIC).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nuwan Pradeep Weerasinghe"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Mobile Phone Number (Driver Login) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 7X XXX XXXX"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    {phoneOtpVerified && (
                      <span className="absolute right-2.5 top-2 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded">
                        SMS Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    National Identity Card (NIC / Passport) *
                  </label>
                  <input
                    type="text"
                    value={nicNumber}
                    onChange={(e) => setNicNumber(e.target.value)}
                    placeholder="12-digit new NIC or 9-digit+V"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Primary Base / City Hub *
                  </label>
                  <select
                    value={cityHub}
                    onChange={(e) => setCityHub(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    {Object.keys(CITY_HUBS).map((hub) => (
                      <option key={hub} value={hub}>
                        {hub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <span className="font-bold text-white block text-xs">Captain Profile Photo</span>
                    <span className="text-slate-400 text-[10px]">Visible to passengers during ride</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
                  >
                    Avatar 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
                  >
                    Avatar 2
                  </button>
                </div>
              </div>
            </div>
          ) : currentStep === 2 ? (
            /* STEP 2: VEHICLE & FLEET CATEGORY */
            <div className="space-y-4">
              <label className="text-slate-300 font-bold block text-[11px]">
                Select Vehicle Category *
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'tuk', name: 'Tuk-Tuk', icon: '🛺', sub: '3-Wheeler' },
                  { id: 'nano', name: 'Nano / Mini', icon: '🚗', sub: 'Hatchback' },
                  { id: 'sedan', name: 'Sedan Prime', icon: '🚘', sub: 'AC Luxury' },
                  { id: 'van', name: 'KDH Van', icon: '🚐', sub: '7-12 Seats' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setVehicleCategory(item.id as VehicleCategory);
                      if (item.id === 'tuk') {
                        setVehicleModel('Bajaj RE 4S 205cc');
                        setHasAc(false);
                      } else if (item.id === 'nano') {
                        setVehicleModel('Suzuki Wagon R FX Hybrid');
                        setHasAc(true);
                      } else if (item.id === 'sedan') {
                        setVehicleModel('Toyota Premio 1.8G / Prius');
                        setHasAc(true);
                      } else if (item.id === 'van') {
                        setVehicleModel('Toyota HiAce KDH 201');
                        setHasAc(true);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      vehicleCategory === item.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{item.icon}</span>
                    <strong className="text-xs block text-white">{item.name}</strong>
                    <span className="text-[10px] text-slate-500">{item.sub}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Vehicle Make & Model *
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Toyota Prius / Bajaj RE"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Registration License Plate Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-20 px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-xs"
                    >
                      {PROVINCES.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="CAD-9921"
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase font-bold placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Vehicle Color & Manufacturing Year
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={vehicleColor}
                      onChange={(e) => setVehicleColor(e.target.value)}
                      placeholder="Emerald Green"
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      placeholder="2022"
                      className="w-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAc}
                      onChange={(e) => setHasAc(e.target.checked)}
                      className="rounded accent-emerald-500 w-4 h-4"
                    />
                    <span className="text-slate-200 font-bold text-xs">
                      Air Conditioned Vehicle (AC Tariff)
                    </span>
                  </label>
                </div>
              </div>

              {/* Service Types Enabled for this driver */}
              <div className="space-y-1.5 pt-1">
                <span className="text-slate-300 font-bold block text-[11px]">
                  Services You Wish to Accept:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ride', label: '🚗 City Rides' },
                    { id: 'delivery', label: '📦 Flash Courier' },
                    { id: 'tour', label: '🌴 Tourist Tours' },
                    { id: 'rental', label: '⏱️ Hourly Rental' },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                        eligibleServices.includes(s.id)
                          ? 'bg-slate-950 border-emerald-500 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={eligibleServices.includes(s.id)}
                        onChange={() => handleToggleService(s.id)}
                        className="rounded accent-emerald-500"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : currentStep === 3 ? (
            /* STEP 3: DOCUMENT VERIFICATION */
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">
                    Instant Document Scanner (DMT Sri Lanka)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    All required permits pre-verified for testing
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full uppercase">
                  Verified 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    title: 'Driving License (Front & Back)',
                    desc: 'DMT Class B / G endorsement',
                    verified: documentsUploaded.licenseFront,
                  },
                  {
                    title: 'Vehicle Revenue License',
                    desc: 'Valid emission & provincial road tax',
                    verified: documentsUploaded.revenueLicense,
                  },
                  {
                    title: 'Comprehensive Insurance Card',
                    desc: 'Third-party passenger coverage',
                    verified: documentsUploaded.insuranceCard,
                  },
                  {
                    title: 'Police Clearance / Grama Niladhari',
                    desc: 'Clean criminal record check',
                    verified: documentsUploaded.policeClearance,
                  },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white text-xs block">{doc.title}</strong>
                        <span className="text-slate-400 text-[10px]">{doc.desc}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[9px] rounded-md uppercase">
                      Ready
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl text-center space-y-1">
                <UploadCloud className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="text-slate-300 text-[11px] font-bold">
                  Snap or upload additional documents anytime
                </p>
                <p className="text-slate-500 text-[10px]">
                  Supports JPG, PNG, and PDF (Max 15MB)
                </p>
              </div>
            </div>
          ) : currentStep === 4 ? (
            /* STEP 4: BANK ACCOUNT & PAYOUTS */
            <div className="space-y-4">
              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your ride earnings and customer card tips are deposited directly via <strong>LankaClear CEFT</strong>. No deductions, zero bank transfer fees!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Select Bank Name *
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SRI_LANKAN_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="8019482014"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Colombo Fort"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block text-[11px]">
                    Account Holder Name (Must match NIC) *
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Nuwan Pradeep Weerasinghe"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-slate-300 font-bold block text-[11px]">
                  Preferred Payout Frequency:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutSchedule('instant')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      payoutSchedule === 'instant'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <strong className="block text-white text-xs">⚡ Instant Daily CEFT</strong>
                    <span className="text-[10px] text-slate-400">Cashout anytime with 1 tap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutSchedule('weekly')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      payoutSchedule === 'weekly'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <strong className="block text-white text-xs">📅 Weekly Auto-Transfer</strong>
                    <span className="text-[10px] text-slate-400">Every Monday morning</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 5: REVIEW & ACTIVATE */
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                    Captain Welcome Contract
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded-full uppercase">
                    5% Flat Fee
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white">
                  Ready to go live on the Naspick Radar, {name}!
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  By tapping Activate, you agree to provide safe, polite rides across Sri Lanka. You keep 95% of every ride fare, plus 100% of all customer tips.
                </p>
              </div>

              {/* Summary Overview Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="text-slate-400">Registered Driver:</span>
                  <span className="font-bold text-white">{name} ({phone})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="text-slate-400">Vehicle Registered:</span>
                  <span className="font-bold text-emerald-400">{province} {plateNumber} · {vehicleModel}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="text-slate-400">Active City Hub:</span>
                  <span className="font-bold text-white">{cityHub}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="text-slate-400">Payout Account:</span>
                  <span className="font-bold text-white">{bankName} ({accountNumber})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Initial Fuel Bonus:</span>
                  <span className="font-extrabold text-amber-400">+ LKR 5,000 Credit</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        {!isSuccessComplete && (
          <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3 sm:px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-500 hover:text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                Step {currentStep} of 5
              </span>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="px-4 sm:px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-complete-driver-registration"
                  onClick={handleFinalSubmit}
                  className="px-5 sm:px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Activate Partner Account</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
