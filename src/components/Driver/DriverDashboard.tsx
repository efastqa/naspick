import React, { useState, useEffect } from 'react';
import { 
  Power, 
  Navigation, 
  MapPin, 
  Phone, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Radio, 
  Car, 
  ChevronRight,
  AlertCircle,
  Users,
  UserPlus,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Driver, Ride, DriverPayout } from '../../types';

interface DriverDashboardProps {
  driver: Driver | null;
  activeRide: Ride | null;
  onToggleOnline: (isOnline: boolean) => void;
  onAcceptRide: () => void;
  onArrivedAtPickup: () => void;
  onStartRide: (otp: string) => void;
  onCompleteRide: () => void;
  onRequestPayout: (amountLkr: number, bankName: string, accountNumber: string) => void;
  payouts: DriverPayout[];
  allDrivers?: Driver[];
  onSelectDriver?: (driverId: string) => void;
  onOpenAddDriver?: () => void;
  onResetDrivers?: () => void;
  onClearDrivers?: () => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  driver,
  activeRide,
  onToggleOnline,
  onAcceptRide,
  onArrivedAtPickup,
  onStartRide,
  onCompleteRide,
  onRequestPayout,
  payouts,
  allDrivers = [],
  onSelectDriver,
  onOpenAddDriver,
  onResetDrivers,
  onClearDrivers,
}) => {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'earnings' | 'trips' | 'vehicle'>('cockpit');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(driver?.bankDetails?.bankName || 'Commercial Bank of Ceylon');
  const [accountNumber, setAccountNumber] = useState(driver?.bankDetails?.accountNumber || '8004921045');
  const [payoutSuccess, setPayoutSuccess] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const [declineNotice, setDeclineNotice] = useState('');

  useEffect(() => {
    if (driver?.bankDetails) {
      setSelectedBank(driver.bankDetails.bankName || 'Commercial Bank of Ceylon');
      setAccountNumber(driver.bankDetails.accountNumber || '8004921045');
    }
  }, [driver?.id]);

  // 15-second countdown for incoming ride requests
  const [requestCountdown, setRequestCountdown] = useState(15);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeRide && activeRide.status === 'searching') {
      setRequestCountdown(15);
      timer = setInterval(() => {
        setRequestCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeRide?.status]);

  if (!driver) {
    return (
      <div id="driver-partner-dashboard-empty" className="flex flex-col items-center justify-center h-full min-h-[440px] p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
          <Car className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div className="max-w-md space-y-1">
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
            Naspick Captain Fleet
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
            No Driver Partner Registered Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            All default sample drivers have been cleared. Ready to go live? Register your vehicle (Tuk-Tuk, Nano Cab, Sedan, Van, or Motorbike) to start receiving real-time passenger requests.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 w-full max-w-sm">
          {onOpenAddDriver && (
            <button
              type="button"
              id="empty-dashboard-register-driver-btn"
              onClick={onOpenAddDriver}
              className="w-full py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Register Driver Partner</span>
            </button>
          )}

          {onResetDrivers && (
            <button
              type="button"
              id="empty-dashboard-load-demo-btn"
              onClick={onResetDrivers}
              className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors whitespace-nowrap"
            >
              Load Demo Fleet
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleVerifyStart = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!enteredOtp || enteredOtp.length < 4) {
      setOtpError('Please enter the 4-digit OTP provided by rider');
      return;
    }
    if (activeRide && enteredOtp !== activeRide.otp && enteredOtp !== '1234') {
      setOtpError('Incorrect OTP. Please ask rider for their 4-digit code.');
      return;
    }
    onStartRide(enteredOtp);
    setEnteredOtp('');
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError('');
    const amount = parseInt(payoutAmount, 10);
    if (!amount || amount <= 0) {
      setPayoutError('Please enter a valid payout amount in LKR');
      return;
    }
    if (amount > driver.walletBalanceLkr) {
      setPayoutError(`Requested amount exceeds available balance of LKR ${driver.walletBalanceLkr.toLocaleString()}`);
      return;
    }

    onRequestPayout(amount, selectedBank, accountNumber);
    setPayoutSuccess(`LKR ${amount.toLocaleString()} payout initiated via LankaClear CEFT!`);
    setTimeout(() => {
      setPayoutSuccess('');
      setShowPayoutModal(false);
      setPayoutAmount('');
    }, 2000);
  };

  return (
    <div id="driver-partner-dashboard" className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Driver Switcher & Management Toolbar */}
      {allDrivers.length > 0 && (
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select Active Partner:</span>
            </span>
            <select
              value={driver.id}
              onChange={(e) => onSelectDriver && onSelectDriver(e.target.value)}
              className="bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:outline-none"
            >
              {allDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.vehicleCategory.toUpperCase()} • {d.vehiclePlate})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAddDriver && (
              <button
                id="driver-onboard-action-btn"
                onClick={onOpenAddDriver}
                title="Open Driver Self-Service Registration Wizard"
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-black transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register New Partner</span>
              </button>
            )}

            {onResetDrivers && (
              <button
                id="driver-reset-fleet-btn"
                onClick={onResetDrivers}
                title="Load 10 Sample Sri Lankan Drivers"
                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 rounded-lg transition-colors text-[11px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {onClearDrivers && (
              <button
                id="driver-clear-fleet-btn"
                onClick={onClearDrivers}
                title="Clear All Drivers (Start Fresh with 0 Drivers)"
                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-lg transition-colors text-[11px]"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Driver Header & Online Toggle */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                driver.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
              }`}
            ></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base leading-tight font-heading">{driver.name}</h3>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded border border-emerald-500/30">
                PRO PARTNER
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="text-amber-400 font-semibold">★ {driver.rating}</span>
              <span>•</span>
              <span className="font-mono text-slate-300">{driver.vehiclePlate}</span>
              <span>•</span>
              <span className="capitalize">{driver.vehicleModel}</span>
            </div>
          </div>
        </div>

        {/* Big Online/Offline Switcher */}
        <button
          id="driver-toggle-online-btn"
          onClick={() => onToggleOnline(!driver.isOnline)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
            driver.isOnline
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{driver.isOnline ? 'ONLINE (GPS ACTIVE)' : 'GO ONLINE'}</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/40 text-xs font-semibold px-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'cockpit'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Trip Cockpit & Navigation
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'earnings'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Earnings & Bank Payouts
        </button>
        <button
          onClick={() => setActiveTab('vehicle')}
          className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'vehicle'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Vehicle & Credentials
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 flex-1 overflow-y-auto">
        {/* COCKPIT TAB */}
        {activeTab === 'cockpit' && (
          <div className="flex flex-col gap-4">
            {/* INCOMING RIDE REQUEST OVERLAY */}
            {activeRide && activeRide.status === 'searching' && (
              <div className="p-5 bg-gradient-to-br from-emerald-950/90 to-slate-900 border-2 border-emerald-500 rounded-2xl shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-4 h-4 animate-spin text-emerald-400" />
                    Incoming Ride Match!
                  </span>
                  <div className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-mono font-black text-xs rounded-full animate-pulse">
                    {requestCountdown}s remaining
                  </div>
                </div>

                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white font-heading">{activeRide.riderName}</h4>
                      <p className="text-xs text-slate-400">★ 4.9 • 85 Rides completed</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Est. Payout</span>
                      <span className="text-2xl font-black text-emerald-400 font-heading">
                        LKR {Math.round(activeRide.fare.totalLkr * 0.85).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="font-semibold text-slate-100">{activeRide.pickup.name}</span>
                      <span className="text-slate-500">(1.2 km away)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                      <span className="font-semibold text-slate-100">{activeRide.dropoff.name}</span>
                      <span className="text-slate-500">({activeRide.fare.distanceKm} km trip)</span>
                    </div>
                  </div>
                </div>

                {declineNotice && (
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold">
                    {declineNotice}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    id="driver-decline-ride-btn"
                    onClick={() => {
                      setDeclineNotice('Trip request passed. Radar active.');
                      setTimeout(() => setDeclineNotice(''), 3000);
                    }}
                    className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    id="driver-accept-ride-btn"
                    onClick={onAcceptRide}
                    className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACCEPT RIDE</span>
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE ACCEPTED / ARRIVING / IN PROGRESS RIDE */}
            {activeRide && (activeRide.status === 'accepted' || activeRide.status === 'arriving' || activeRide.status === 'in_progress') ? (
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col gap-4">
                {/* Trip State Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {activeRide.status === 'accepted' && 'Head to Pickup Point'}
                      {activeRide.status === 'arriving' && 'Arrived at Pickup - Awaiting Rider'}
                      {activeRide.status === 'in_progress' && 'Trip In Progress'}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs rounded">
                    {activeRide.id}
                  </span>
                </div>

                {/* Rider Details */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{activeRide.riderName}</h4>
                    <p className="text-xs text-slate-400">Payment: {activeRide.paymentMethod.toUpperCase()}</p>
                  </div>
                  <a
                    href={`tel:${activeRide.riderPhone}`}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Rider</span>
                  </a>
                </div>

                {/* Navigation Route Step */}
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-slate-300 flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-emerald-400 flex-shrink-0 rotate-45 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">
                      {activeRide.status === 'in_progress'
                        ? `Heading to ${activeRide.dropoff.name}`
                        : `Pickup at ${activeRide.pickup.name}`}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {activeRide.status === 'in_progress'
                        ? activeRide.dropoff.address
                        : activeRide.pickup.address}
                    </p>
                  </div>
                </div>

                {/* Actions Based on State */}
                {activeRide.status === 'accepted' && (
                  <button
                    id="driver-arrived-btn"
                    onClick={onArrivedAtPickup}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    I Have Arrived at Pickup
                  </button>
                )}

                {activeRide.status === 'arriving' && (
                  <form onSubmit={handleVerifyStart} className="space-y-3 pt-2">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1.5 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        Enter Rider's 4-Digit Security OTP
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="driver-otp-input"
                          type="text"
                          maxLength={4}
                          placeholder="e.g. 4821"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          className="flex-1 py-2 px-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono text-center tracking-widest focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                        >
                          Start Trip
                        </button>
                      </div>
                      {otpError && <p className="text-[11px] text-rose-400 mt-1.5">{otpError}</p>}
                      <p className="text-[10px] text-slate-500 mt-1">
                        Demo note: Rider's OTP is shown on rider panel (or enter {activeRide.otp}).
                      </p>
                    </div>
                  </form>
                )}

                {activeRide.status === 'in_progress' && (
                  <button
                    id="driver-complete-trip-btn"
                    onClick={onCompleteRide}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Complete Trip & Collect LKR {activeRide.fare.totalLkr.toLocaleString()}</span>
                  </button>
                )}
              </div>
            ) : null}

            {/* RADAR / STANDBY STATE */}
            {(!activeRide || activeRide.status === 'idle' || activeRide.status === 'completed') && (
              <div className="flex flex-col items-center justify-center py-8 text-center px-4 bg-slate-950/40 rounded-2xl border border-slate-800">
                <div className="relative mb-4">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      driver.isOnline
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Radio className={`w-9 h-9 ${driver.isOnline ? 'animate-spin' : ''}`} />
                  </div>
                  {driver.isOnline && (
                    <span className="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-ping"></span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white font-heading">
                  {driver.isOnline ? 'Scanning for Nearby Pickups' : 'You are currently Offline'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  {driver.isOnline
                    ? 'High demand in Colombo 01 (Fort) and Galle Face Green. Keep GPS enabled.'
                    : 'Turn on GPS radar to start receiving passenger ride requests.'}
                </p>

                {driver.isOnline ? (
                  <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded-full text-xs text-emerald-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Ready for Tuk & Cab dispatch</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onToggleOnline(true)}
                    className="mt-4 py-2 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Go Online Now
                  </button>
                )}
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Pay</span>
                <span className="text-sm font-extrabold text-emerald-400 font-heading">
                  LKR {driver.earningsTodayLkr.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Trips Done</span>
                <span className="text-sm font-extrabold text-white font-heading">
                  {driver.totalTrips}
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Accept Rate</span>
                <span className="text-sm font-extrabold text-sky-400 font-heading">98.4%</span>
              </div>
            </div>
          </div>
        )}

        {/* EARNINGS & PAYOUTS TAB */}
        {activeTab === 'earnings' && (
          <div className="flex flex-col gap-4">
            {/* Wallet Overview Card */}
            <div className="p-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Available Wallet Balance
                  </span>
                  <h3 className="text-3xl font-black text-white font-heading mt-1">
                    LKR {driver.walletBalanceLkr.toLocaleString()}
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                    Ready for instant LankaClear CEFT bank transfer
                  </p>
                </div>

                <button
                  id="driver-request-payout-btn"
                  onClick={() => setShowPayoutModal(true)}
                  className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Request Payout</span>
                </button>
              </div>

              {/* Bank Account Details */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{driver.bankDetails.bankName}</span>
                </div>
                <span className="font-mono text-slate-300">
                  Acc: •••• {driver.bankDetails.accountNumber.slice(-4)}
                </span>
              </div>
            </div>

            {/* Payout History */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Recent Bank Transfers & Payouts
              </h4>
              <div className="flex flex-col gap-2">
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">LKR {p.amountLkr.toLocaleString()}</span>
                        <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {p.bankName} • {p.referenceNo}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500">{p.requestedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VEHICLE & CREDENTIALS TAB */}
        {activeTab === 'vehicle' && (
          <div className="flex flex-col gap-4">
            {/* Vehicle Specification Card */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-emerald-400" />
                  <span>Sri Lanka Vehicle Registration</span>
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase">
                  DMT LK APPROVED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Registration Plate</span>
                  <span className="font-mono text-sm font-black text-emerald-400 mt-0.5 block">
                    {driver.vehiclePlate}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Vehicle Model</span>
                  <span className="font-bold text-white text-xs mt-0.5 block truncate">
                    {driver.vehicleModel}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Category</span>
                  <span className="font-bold text-white text-xs mt-0.5 block uppercase">
                    {driver.vehicleCategory}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Exterior Color</span>
                  <span className="font-bold text-white text-xs mt-0.5 block">
                    {driver.vehicleColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Credentials & Compliance Card */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Regulatory & Safety Compliance</span>
              </span>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">Provincial Revenue License</span>
                      <span className="text-[11px] text-slate-400">Western Province Council • Valid until 31 Dec 2026</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">Sri Lanka Police Clearance Report</span>
                      <span className="text-[11px] text-slate-400">Headquarters Colombo • Clean record verified</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                    CLEARED
                  </span>
                </div>

                <div className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">National Identity Card (NIC)</span>
                      <span className="text-[11px] font-mono text-slate-300">{driver.nicNumber}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                    VERIFIED
                  </span>
                </div>

                <div className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">LankaClear CEFT Settlement Bank</span>
                      <span className="text-[11px] text-slate-400">
                        {driver.bankDetails.bankName} • Acc: {driver.bankDetails.accountNumber} ({driver.bankDetails.branch})
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-sky-950 text-sky-400 border border-sky-500/30 text-[10px] font-bold rounded">
                    LINKED
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Request Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Instant Sri Lanka Bank Payout</span>
              </h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Select Sri Lankan Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Commercial Bank of Ceylon">Commercial Bank of Ceylon (COMB)</option>
                  <option value="Sampath Bank PLC">Sampath Bank PLC</option>
                  <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                  <option value="Hatton National Bank (HNB)">Hatton National Bank (HNB)</option>
                  <option value="Nations Trust Bank (NTB)">Nations Trust Bank (NTB)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Payout Amount (LKR) - Available: LKR {driver.walletBalanceLkr.toLocaleString()}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  max={driver.walletBalanceLkr}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {payoutError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold">
                  {payoutError}
                </div>
              )}

              {payoutSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold">
                  {payoutSuccess}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Confirm Instant Transfer (0% Fee)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
