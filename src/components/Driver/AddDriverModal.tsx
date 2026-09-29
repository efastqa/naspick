import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Car, 
  Phone, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Sparkles,
  CheckCircle2,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { Driver, VehicleCategory } from '../../types';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDriver: (driver: Partial<Driver>) => void;
}

const SRI_LANKAN_PROVINCES = [
  { code: 'WP', name: 'Western Province (Colombo/Gampaha/Kalutara)' },
  { code: 'CP', name: 'Central Province (Kandy/Matale/Nuwara Eliya)' },
  { code: 'SP', name: 'Southern Province (Galle/Matara/Hambantota)' },
  { code: 'NW', name: 'North Western Province (Kurunegala/Puttalam)' },
  { code: 'NC', name: 'North Central Province (Anuradhapura/Polonnaruwa)' },
  { code: 'EP', name: 'Eastern Province (Trincomalee/Batticaloa)' },
  { code: 'NP', name: 'Northern Province (Jaffna/Vavuniya)' },
  { code: 'SG', name: 'Sabaragamuwa Province (Ratnapura/Kegalle)' },
  { code: 'UP', name: 'Uva Province (Badulla/Monaragala)' },
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
];

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Colombo 03 (Kollupitiya)': { lat: 6.9080, lng: 79.8510 },
  'Colombo 07 (Cinnamon Gardens)': { lat: 6.9060, lng: 79.8690 },
  'Colombo 01 (Fort / Port City)': { lat: 6.9344, lng: 79.8428 },
  'Colombo 04 (Bambalapitiya)': { lat: 6.8920, lng: 79.8560 },
  'Dehiwala / Mount Lavinia': { lat: 6.8380, lng: 79.8700 },
  'Rajagiriya / Sri Jayawardenepura': { lat: 6.9090, lng: 79.8970 },
  'Negombo (Bandaranaike Airport)': { lat: 7.1808, lng: 79.8841 },
  'Kandy City Center': { lat: 7.2906, lng: 80.6337 },
  'Galle Fort (Southern Coast)': { lat: 6.0329, lng: 80.2168 },
};

export const AddDriverModal: React.FC<AddDriverModalProps> = ({
  isOpen,
  onClose,
  onAddDriver,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+94 7');
  const [nicNumber, setNicNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('tuk');
  const [province, setProvince] = useState('WP');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [cityHub, setCityHub] = useState('Colombo 03 (Kollupitiya)');
  const [bankName, setBankName] = useState('Commercial Bank of Ceylon');
  const [accountNumber, setAccountNumber] = useState('');
  const [isOnlineImmediately, setIsOnlineImmediately] = useState(true);
  const [hasAc, setHasAc] = useState(false);
  const [isPoliceVerified, setIsPoliceVerified] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Preset Auto-fill helpers for instant demonstration
  const handleApplyPreset = (type: 'tuk' | 'sedan' | 'nano' | 'van') => {
    if (type === 'tuk') {
      setName('Nuwan Pradeep Weerasinghe');
      setPhone('+94 77 982 4410');
      setNicNumber('199320401928');
      setLicenseNumber('B-84920194');
      setVehicleCategory('tuk');
      setProvince('WP');
      setPlateNumber('ABY-7734');
      setVehicleModel('Bajaj RE 4S 205cc (Petrol)');
      setVehicleColor('Emerald Green & Island Gold');
      setCityHub('Colombo 03 (Kollupitiya)');
      setBankName('Commercial Bank of Ceylon');
      setAccountNumber('8019482014');
      setHasAc(false);
    } else if (type === 'sedan') {
      setName('Sanjeewa Kumara Dissanayake');
      setPhone('+94 71 884 1029');
      setNicNumber('198610400199');
      setLicenseNumber('B-79201948');
      setVehicleCategory('sedan');
      setProvince('WP');
      setPlateNumber('CAD-8812');
      setVehicleModel('Toyota Premio 1.8G Executive (AC)');
      setVehicleColor('Pearl White');
      setCityHub('Colombo 07 (Cinnamon Gardens)');
      setBankName('Sampath Bank PLC');
      setAccountNumber('00425001928');
      setHasAc(true);
    } else if (type === 'nano') {
      setName('Roshani Malkanthi Silva');
      setPhone('+94 76 345 8891');
      setNicNumber('199460100234');
      setLicenseNumber('B-66291042');
      setVehicleCategory('nano');
      setProvince('WP');
      setPlateNumber('CAJ-3019');
      setVehicleModel('Suzuki Wagon R FX Hybrid (AC)');
      setVehicleColor('Silky Silver Metallic');
      setCityHub('Rajagiriya / Sri Jayawardenepura');
      setBankName('Hatton National Bank (HNB)');
      setAccountNumber('1048201948');
      setHasAc(true);
    } else if (type === 'van') {
      setName('Sunil Shantha Jayawardena');
      setPhone('+94 72 449 0182');
      setNicNumber('197820100941');
      setLicenseNumber('C-55829104');
      setVehicleCategory('van');
      setProvince('WP');
      setPlateNumber('PC-9018');
      setVehicleModel('Toyota HiAce KDH 201 Super GL 9-Seater');
      setVehicleColor('Metallic Black');
      setCityHub('Negombo (Bandaranaike Airport)');
      setBankName('Bank of Ceylon (BOC)');
      setAccountNumber('79204918');
      setHasAc(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter Driver Full Name');
      return;
    }

    const fullPlate = `${province} ${plateNumber.trim().toUpperCase()}`;
    const coords = CITY_COORDINATES[cityHub] || { lat: 6.9271, lng: 79.8612 };

    const newDriver: Partial<Driver> = {
      id: `drv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      phone: phone.trim(),
      avatar:
        vehicleCategory === 'tuk'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : vehicleCategory === 'moto'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      vehicleCategory,
      vehicleModel: `${vehicleModel} ${hasAc ? '(AC)' : ''}`.trim(),
      vehiclePlate: fullPlate,
      vehicleColor,
      rating: 5.0,
      totalTrips: 1,
      isOnline: isOnlineImmediately,
      isBusy: false,
      currentLat: coords.lat + (Math.random() - 0.5) * 0.008,
      currentLng: coords.lng + (Math.random() - 0.5) * 0.008,
      heading: Math.floor(Math.random() * 360),
      earningsTodayLkr: 0,
      walletBalanceLkr: 5000, // Welcome fuel bonus credit
      bankDetails: {
        bankName,
        accountNumber: accountNumber || '8004921000',
        branch: cityHub.split(' ')[0],
        accountHolder: name,
      },
      verificationStatus: isPoliceVerified ? 'approved' : 'pending',
      nicNumber: nicNumber || '199020400192',
    };

    onAddDriver(newDriver);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="add-driver-modal-card"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header with Naspick LK Brand & Close */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-heading">Onboard Driver Partner</h3>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-black rounded-md uppercase">
                  NASPICK LK
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Register new driver to the active fleet with live GPS radar tracking</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Bar for Quick Demonstration */}
        <div className="bg-slate-950/50 px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Auto-Fill Sample:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleApplyPreset('tuk')}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-bold transition-all text-[11px]"
            >
              + Tuk-Tuk
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('nano')}
              className="px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg font-bold transition-all text-[11px]"
            >
              + Wagon R / Nano
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('sedan')}
              className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold transition-all text-[11px]"
            >
              + Sedan Executive
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('van')}
              className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg font-bold transition-all text-[11px]"
            >
              + KDH Airport Van
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {submitted && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Driver Onboarded Successfully!</p>
                <p className="text-xs text-emerald-400/90">Added to live radar and ready for passenger dispatch.</p>
              </div>
            </div>
          )}

          {/* Section 1: Driver Personal Details */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              1. Personal Identification
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Madushanka Bandara"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number (Sri Lanka +94) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+94 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  NIC / National ID Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 199120400192 or 882019481V"
                  value={nicNumber}
                  onChange={(e) => setNicNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Driving License Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. B-84920194"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vehicle & Category Selection */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              2. Vehicle Category & Plate
            </span>

            {/* Category Selector Cards */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[
                { id: 'tuk', name: 'Tuk-Tuk', sub: '3-Wheel' },
                { id: 'nano', name: 'Nano / Mini', sub: 'Budget AC' },
                { id: 'sedan', name: 'Sedan', sub: 'Executive' },
                { id: 'van', name: 'Van', sub: '6-8 Seats' },
                { id: 'moto', name: 'Moto', sub: 'Express' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setVehicleCategory(cat.id as VehicleCategory)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    vehicleCategory === cat.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-extrabold">{cat.name}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{cat.sub}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Province Code
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                  {SRI_LANKAN_PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} - {p.name.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  License Number Plate *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABK-4819"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono font-bold uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Emerald Green, Pearl White"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vehicle Make & Model Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toyota Axio Hybrid 2019"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasAc}
                    onChange={(e) => setHasAc(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span>Air Conditioned (AC) Cabin</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPoliceVerified}
                    onChange={(e) => setIsPoliceVerified(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span className="text-emerald-400">Police Cleared</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Operating Hub & Bank Details */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              3. Operating Base City & LankaClear CEFT Payout
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Operating Hub / City
                </label>
                <select
                  value={cityHub}
                  onChange={(e) => setCityHub(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                  {Object.keys(CITY_COORDINATES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  CEFT Payout Bank
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                  {SRI_LANKAN_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8004921045"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Live Status Switch */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <span className="text-xs font-bold text-white block">Activate On Live Radar Immediately</span>
                <span className="text-[11px] text-slate-400">Driver will broadcast coordinates on map and be available for ride booking</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOnlineImmediately}
                onChange={(e) => setIsOnlineImmediately(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Driver Onboarding</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
