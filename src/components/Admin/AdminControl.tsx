import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Car, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  DollarSign, 
  Activity, 
  FileText, 
  Radio,
  Clock,
  Sparkles,
  UserPlus,
  RotateCcw,
  Search,
  Filter,
  Power,
  Lock,
  KeyRound,
  MapPin,
  Save,
  Fuel,
  Tag,
  Check,
  Banknote,
  ArrowRight,
  Info
} from 'lucide-react';
import { DriverApplication, Driver, VehicleCategory, VehicleOption } from '../../types';
import { VEHICLE_OPTIONS } from '../../data/mockLocations';
import { ChangeAdminPasswordModal } from './ChangeAdminPasswordModal';

interface AdminControlProps {
  drivers: Driver[];
  applications: DriverApplication[];
  onVerifyDriver: (applicationId: string, action: 'approve' | 'reject') => void;
  surgeMultiplier: number;
  onUpdateSurge: (multiplier: number) => void;
  onOpenAddDriver?: () => void;
  onResetDrivers?: () => void;
  onToggleDriverStatus?: (driverId: string, isOnline: boolean) => void;
  onLockAdmin?: () => void;
  adminPassword?: string;
  onSaveAdminPassword?: (newPass: string) => void;
  vehicleOptions?: VehicleOption[];
  onUpdateVehiclePricing?: (updated: VehicleOption[]) => void;
  onResetVehiclePricing?: () => void;
  expresswayTollLkr?: number;
  onUpdateExpresswayToll?: (toll: number) => void;
}

export const AdminControl: React.FC<AdminControlProps> = ({
  drivers,
  applications,
  onVerifyDriver,
  surgeMultiplier,
  onUpdateSurge,
  onOpenAddDriver,
  onResetDrivers,
  onToggleDriverStatus,
  onLockAdmin,
  adminPassword = 'naspick2026',
  onSaveAdminPassword,
  vehicleOptions,
  onUpdateVehiclePricing,
  onResetVehiclePricing,
  expresswayTollLkr = 300,
  onUpdateExpresswayToll,
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'verification' | 'surge' | 'fleet'>('overview');
  const [fleetCategoryFilter, setFleetCategoryFilter] = useState<'all' | VehicleCategory>('all');
  const [fleetCityFilter, setFleetCityFilter] = useState<'all' | 'colombo' | 'kandy' | 'kurunegala' | 'negombo'>('all');
  const [fleetSearchQuery, setFleetSearchQuery] = useState('');
  const [showChangePassModal, setShowChangePassModal] = useState(false);

  // Pricing State for Admin Price Updates
  const [localVehicles, setLocalVehicles] = useState<VehicleOption[]>(() => {
    return vehicleOptions && vehicleOptions.length > 0 ? vehicleOptions : VEHICLE_OPTIONS;
  });
  const [localExpresswayToll, setLocalExpresswayToll] = useState<number>(expresswayTollLkr);
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState<string>('');
  const [isPricingDirty, setIsPricingDirty] = useState(false);

  // Synchronize when external props change
  useEffect(() => {
    if (vehicleOptions && vehicleOptions.length > 0 && !isPricingDirty) {
      setLocalVehicles(vehicleOptions);
    }
  }, [vehicleOptions, isPricingDirty]);

  useEffect(() => {
    if (expresswayTollLkr !== undefined && !isPricingDirty) {
      setLocalExpresswayToll(expresswayTollLkr);
    }
  }, [expresswayTollLkr, isPricingDirty]);

  const handlePriceFieldChange = (
    categoryId: VehicleCategory,
    field: 'baseFareLkr' | 'perKmLkr' | 'perMinLkr',
    value: number
  ) => {
    const num = Math.max(0, isNaN(value) ? 0 : value);
    setLocalVehicles((prev) =>
      prev.map((v) => (v.id === categoryId ? { ...v, [field]: num } : v))
    );
    setIsPricingDirty(true);
    setPricingSaveSuccess('');
  };

  const handleQuickFuelAdjustment = (percentage: number) => {
    setLocalVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        perKmLkr: Math.round(v.perKmLkr * (1 + percentage / 100)),
      }))
    );
    setIsPricingDirty(true);
    setPricingSaveSuccess('');
  };

  const handleSavePricing = () => {
    if (onUpdateVehiclePricing) {
      onUpdateVehiclePricing(localVehicles);
    }
    if (onUpdateExpresswayToll) {
      onUpdateExpresswayToll(localExpresswayToll);
    }
    setIsPricingDirty(false);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPricingSaveSuccess(`Rates successfully updated & live for riders at ${timeStr}`);
    setTimeout(() => setPricingSaveSuccess(''), 6000);
  };

  const handleResetToStandards = () => {
    setLocalVehicles(VEHICLE_OPTIONS);
    setLocalExpresswayToll(300);
    if (onResetVehiclePricing) {
      onResetVehiclePricing();
    }
    if (onUpdateExpresswayToll) {
      onUpdateExpresswayToll(300);
    }
    setIsPricingDirty(false);
    setPricingSaveSuccess('Reset to Sri Lanka standard regulatory rates');
    setTimeout(() => setPricingSaveSuccess(''), 5000);
  };

  const getDriverCityHub = (drv: Driver): 'colombo' | 'kandy' | 'kurunegala' | 'negombo' => {
    if (drv.currentLat > 7.4) return 'kurunegala';
    if (drv.currentLat > 7.23 && drv.currentLng > 80.4) return 'kandy';
    if (drv.currentLat > 7.15 && drv.currentLng < 80.0) return 'negombo';
    return 'colombo';
  };

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const onlineDrivers = drivers.filter((d) => d.isOnline);

  const filteredDrivers = drivers.filter((drv) => {
    const matchesCategory = fleetCategoryFilter === 'all' || drv.vehicleCategory === fleetCategoryFilter;
    const hub = getDriverCityHub(drv);
    const matchesCity = fleetCityFilter === 'all' || hub === fleetCityFilter;
    const q = fleetSearchQuery.toLowerCase();
    const matchesSearch = 
      !fleetSearchQuery ||
      drv.name.toLowerCase().includes(q) ||
      drv.vehiclePlate.toLowerCase().includes(q) ||
      drv.vehicleModel.toLowerCase().includes(q) ||
      drv.phone.includes(q) ||
      hub.includes(q);
    return matchesCategory && matchesCity && matchesSearch;
  });

  // Sri Lanka Platform Financials (LKR)
  const totalGmvLkr = 584500;
  const platformRevenueLkr = Math.round(totalGmvLkr * 0.15); // 15% commission

  return (
    <div id="admin-control-panel" className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Admin Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-white text-base font-heading">Naspick Command Center</h3>
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold rounded border border-rose-500/30">
              ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Sri Lanka Operations • Colombo Regional HQ</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="change-admin-pass-btn"
            onClick={() => setShowChangePassModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Update Administrator Passkey"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Passkey</span>
          </button>

          {onLockAdmin && (
            <button
              id="lock-admin-btn"
              onClick={onLockAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-colors"
              title="Lock Admin Control Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SMS Live</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/40 text-xs font-semibold px-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setAdminTab('overview')}
          className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            adminTab === 'overview'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => setAdminTab('verification')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'verification'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Driver Partner Verification</span>
          {pendingApps.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full">
              {pendingApps.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setAdminTab('surge')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'surge'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Fare Rates & Dynamic Surge</span>
          {isPricingDirty && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Unsaved changes" />
          )}
        </button>
        <button
          onClick={() => setAdminTab('fleet')}
          className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
            adminTab === 'fleet'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Fleet Radar ({drivers.length})
        </button>
      </div>

      {/* Admin Body Content */}
      <div className="p-5 flex-1 overflow-y-auto">
        {/* OVERVIEW TAB */}
        {adminTab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Today's GMV (LKR)
                </span>
                <span className="text-xl font-black text-white font-heading mt-1 block">
                  LKR {totalGmvLkr.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% vs yesterday
                </span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Platform Net (15%)
                </span>
                <span className="text-xl font-black text-emerald-400 font-heading mt-1 block">
                  LKR {platformRevenueLkr.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Auto-settled to Naspick</span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Fleet (Online)
                </span>
                <span className="text-xl font-black text-white font-heading mt-1 block">
                  {onlineDrivers.length} / {drivers.length}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                  92% GPS Radar coverage
                </span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Customer Satisfaction
                </span>
                <span className="text-xl font-black text-amber-400 font-heading mt-1 block">
                  4.93 ★
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Across 1,240 reviews</span>
              </div>
            </div>

            {/* Live Operational Health */}
            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Target Hub Operations & Distribution
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  4 Active Priority Hubs
                </span>
              </div>
              
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span>🏙️</span>
                      <strong>Colombo Central Hub</strong> (Fort, Galle Face, Port City)
                    </span>
                    <span className="font-bold text-white">45% of volume • 38 Fleet</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span>🛕</span>
                      <strong>Kandy Sacred Hill Capital</strong> (Temple of Tooth, KCC)
                    </span>
                    <span className="font-bold text-white">25% of volume • 21 Fleet</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span>🐘</span>
                      <strong>Kurunegala Wayamba Hub</strong> (Elephant Rock, Transit)
                    </span>
                    <span className="font-bold text-white">16% of volume • 14 Fleet</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span>✈️</span>
                      <strong>Negombo Coastal & Airport Hub</strong> (CMB, Lewis Place)
                    </span>
                    <span className="font-bold text-white">14% of volume • 12 Fleet</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION QUEUE TAB */}
        {adminTab === 'verification' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h4 className="text-sm font-bold text-white font-heading">
                  Driver Partner Document Approvals
                </h4>
                <p className="text-xs text-slate-400">
                  Verify Sri Lankan National Identity Card (NIC), Driving License, and Vehicle Revenue
                </p>
              </div>
            </div>

            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{app.fullName}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">
                      {app.phone}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : app.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px] pt-1">
                    <span>
                      NIC: <strong className="text-slate-200">{app.nic}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      License: <strong className="text-slate-200">{app.licenseNumber}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Vehicle: <strong className="text-slate-200">{app.vehicleModel}</strong> (
                      <strong className="text-emerald-400 font-mono">{app.vehiclePlate}</strong>)
                    </span>
                    <span>•</span>
                    <span>City: {app.city}</span>
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onVerifyDriver(app.id, 'reject')}
                      className="py-2 px-3 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 rounded-xl font-semibold transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onVerifyDriver(app.id, 'approve')}
                      className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Partner</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SURGE & FARE RATES ENGINE TAB */}
        {adminTab === 'surge' && (
          <div className="flex flex-col gap-5">
            {/* Top Toolbar: Save, Reset & Status Indicator */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white font-heading flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-400" />
                    <span>Sri Lanka Platform Fare Rates & Surge Control</span>
                  </h4>
                  {isPricingDirty && (
                    <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded-full animate-pulse">
                      Unsaved Changes
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Configure official flag-drop base fares, per-kilometer tariffs, and per-minute waiting charges across Colombo, Kandy, Kurunegala, and Negombo. Saved changes take effect immediately on rider booking panels.
                </p>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
                <button
                  type="button"
                  id="admin-reset-pricing-btn"
                  onClick={handleResetToStandards}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Reset to official standard regulatory benchmarks"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset to Standards</span>
                </button>

                <button
                  type="button"
                  id="admin-save-pricing-btn"
                  onClick={handleSavePricing}
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                    isPricingDirty
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 ring-2 ring-emerald-400/50 animate-bounce'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Pricing Changes</span>
                </button>
              </div>
            </div>

            {/* Success Notification Banner */}
            {pricingSaveSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-xs text-emerald-200 shadow-sm animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold">{pricingSaveSuccess}</span>
              </div>
            )}

            {/* Real-Time Dynamic Surge Engine Card */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Real-Time Surge Multiplier Engine</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Controls demand multiplier during tropical monsoon downpours, evening Galle Road traffic, and peak weekend spikes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Surge:</span>
                  <span className="text-2xl font-black text-amber-400 font-heading">
                    {surgeMultiplier}x
                  </span>
                </div>
              </div>

              {/* Slider */}
              <div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={surgeMultiplier}
                  onChange={(e) => onUpdateSurge(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
                  <span>1.0x (Standard Fares)</span>
                  <span>1.3x (Galle Rd Peak)</span>
                  <span>1.6x (Heavy Rain)</span>
                  <span>2.0x (Friday Monsoon)</span>
                  <span>2.5x (Extreme Spike)</span>
                </div>
              </div>

              {/* Quick Weather & Demand Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: 'Normal Weather', val: 1.0, icon: '☀️' },
                  { label: 'Galle Rd Peak', val: 1.3, icon: '🚗' },
                  { label: 'Colombo Monsoon', val: 1.6, icon: '🌧️' },
                  { label: 'Friday Night Rush', val: 2.0, icon: '⚡' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onUpdateSurge(preset.val)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors border flex items-center gap-1.5 ${
                      surgeMultiplier === preset.val
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label} ({preset.val}x)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions & Highway Surcharge Configuration Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Quick Bulk Tariffs Adjustment */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Bulk Tariff Revisions</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">One-tap adjusts per-km across all 5 fleets</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFuelAdjustment(10)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>+10% Fuel Price Hike</span>
                    <span className="text-[10px] text-amber-400/80">(CPC / LIOC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFuelAdjustment(5)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    +5% Tariff Index
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFuelAdjustment(-10)}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    -10% Off-Peak Promotional Rate
                  </button>
                </div>
              </div>

              {/* Expressway Toll Preset */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-sky-400" />
                    <span>Expressway Toll (LKR)</span>
                  </h4>
                  <span className="text-[10px] text-sky-400 font-mono">E03 / Central</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Rs.</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={localExpresswayToll}
                    onChange={(e) => {
                      setLocalExpresswayToll(Math.max(0, parseInt(e.target.value) || 0));
                      setIsPricingDirty(true);
                    }}
                    className="w-24 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-2.5 py-1 text-xs text-white font-mono font-bold focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400">per highway gate</span>
                </div>
              </div>
            </div>

            {/* Fleet Category Price Editor Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400" />
                  <span>Category Tariff Rate Cards (Live Rates)</span>
                </h4>
                <span className="text-xs text-slate-400">
                  Total Fleets: <strong>{localVehicles.length} Categories</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {localVehicles.map((veh) => {
                  // Calculate live preview benchmark trip costs based on CURRENT edited rates
                  const calcSampleTrip = (km: number, mins: number, toll: number = 0) => {
                    const base = veh.baseFareLkr;
                    const dist = Math.round(km * veh.perKmLkr);
                    const time = Math.round(mins * veh.perMinLkr);
                    const subtotal = (base + dist + time) * surgeMultiplier;
                    const platformFee = Math.round(subtotal * 0.10);
                    return Math.max(veh.baseFareLkr, Math.round(subtotal + platformFee + toll));
                  };

                  const cityCost5km = calcSampleTrip(5, 15, 0);
                  const airportCost35km = calcSampleTrip(34, 30, localExpresswayToll);
                  const kandyCost116km = calcSampleTrip(116, 170, localExpresswayToll);

                  return (
                    <div
                      key={veh.id}
                      className="p-4 bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 rounded-xl space-y-3 transition-colors shadow-sm"
                    >
                      {/* Card Header: Category Name & Specs */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            veh.id === 'tuk'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-emerald-400 border border-slate-700'
                          }`}>
                            {veh.id === 'tuk' ? (
                              <span className="font-extrabold text-xs tracking-tighter text-amber-300 font-heading">TUK</span>
                            ) : (
                              <Car className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-bold text-white font-heading">{veh.name}</h5>
                              <span className="px-2 py-0.2 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                                {veh.capacity} Seats {veh.ac ? '• AC' : ''}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{veh.tagline}</p>
                          </div>
                        </div>

                        {/* Benchmark previews summary */}
                        <div className="flex items-center gap-2 text-[11px] bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
                          <span className="text-slate-400 font-medium">Estimated:</span>
                          <span className="text-emerald-400 font-bold font-mono">5km: Rs. {cityCost5km.toLocaleString()}</span>
                          <span className="text-slate-600">|</span>
                          <span className="text-sky-400 font-bold font-mono">Airport: Rs. {airportCost35km.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* 3 Editable Tariff Input Columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Base Fare */}
                        <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Base Fare (Flag Drop)
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500 font-bold">LKR</span>
                            <input
                              type="number"
                              min="0"
                              step="10"
                              value={veh.baseFareLkr}
                              onChange={(e) => handlePriceFieldChange(veh.id, 'baseFareLkr', parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 rounded px-2 py-1 text-xs text-white font-mono font-bold focus:outline-none"
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">Starting meter cost</span>
                        </div>

                        {/* Per KM Rate */}
                        <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Per Kilometer Rate
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500 font-bold">LKR</span>
                            <input
                              type="number"
                              min="0"
                              step="5"
                              value={veh.perKmLkr}
                              onChange={(e) => handlePriceFieldChange(veh.id, 'perKmLkr', parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 rounded px-2 py-1 text-xs text-white font-mono font-bold focus:outline-none"
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">Charged per road km</span>
                        </div>

                        {/* Per Minute Rate */}
                        <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Per Minute Waiting / Traffic
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500 font-bold">LKR</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={veh.perMinLkr}
                              onChange={(e) => handlePriceFieldChange(veh.id, 'perMinLkr', parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 rounded px-2 py-1 text-xs text-white font-mono font-bold focus:outline-none"
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">Wait time & slow congestion</span>
                        </div>
                      </div>

                      {/* Route Benchmarks Footer */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <div className="flex items-center gap-3">
                          <span>🏙️ Colombo City (5 km): <strong className="text-slate-200">Rs. {cityCost5km}</strong></span>
                          <span>✈️ CMB Airport via E03 (34 km): <strong className="text-slate-200">Rs. {airportCost35km}</strong></span>
                          <span className="hidden md:inline">🛕 Kandy Corridor (116 km): <strong className="text-slate-200">Rs. {kandyCost116km}</strong></span>
                        </div>
                        <span className="text-[10px] text-slate-500">Includes 10% platform fee</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Save Reminder Bar */}
            {isPricingDirty && (
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-xs text-amber-200 font-medium">
                    You have unsaved pricing updates. Remember to save changes so riders see the new fares!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSavePricing}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Rates Now</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* FLEET RADAR TAB */}
        {adminTab === 'fleet' && (
          <div className="flex flex-col gap-3">
            {/* Top Toolbar: Search, Add Driver & Reset */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by driver name, plate (e.g. WP ABK), or phone..."
                  value={fleetSearchQuery}
                  onChange={(e) => setFleetSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                {onOpenAddDriver && (
                  <button
                    id="admin-onboard-driver-btn"
                    onClick={onOpenAddDriver}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Onboard Driver</span>
                  </button>
                )}

                {onResetDrivers && (
                  <button
                    id="admin-reset-fleet-btn"
                    onClick={onResetDrivers}
                    title="Reset Driver Fleet to 10 Authentic Sri Lankan Drivers"
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 rounded-xl text-xs transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* City Hub Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Hub:</span>
              </span>
              {[
                { id: 'all', label: 'All Hubs' },
                { id: 'colombo', label: '🏙️ Colombo' },
                { id: 'kandy', label: '🛕 Kandy' },
                { id: 'kurunegala', label: '🐘 Kurunegala' },
                { id: 'negombo', label: '✈️ Negombo' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFleetCityFilter(c.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all whitespace-nowrap border ${
                    fleetCityFilter === c.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-slate-500" />
                <span>Vehicle:</span>
              </span>
              {[
                { id: 'all', label: 'All Fleet' },
                { id: 'tuk', label: 'Tuk-Tuk' },
                { id: 'nano', label: 'Nano / Mini' },
                { id: 'sedan', label: 'Sedan' },
                { id: 'van', label: 'Van' },
                { id: 'moto', label: 'Moto' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFleetCategoryFilter(c.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all whitespace-nowrap border ${
                    fleetCategoryFilter === c.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Status Summary Counter */}
            <div className="flex items-center justify-between text-xs px-1 text-slate-400">
              <span className="font-semibold">
                Showing {filteredDrivers.length} of {drivers.length} registered partners
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {onlineDrivers.length} Live on GPS Radar
              </span>
            </div>

            {/* Drivers List */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredDrivers.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">No driver partners found matching your search filter.</p>
                </div>
              ) : (
                filteredDrivers.map((drv) => (
                  <div
                    key={drv.id}
                    className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 rounded-xl flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={drv.avatar}
                          alt={drv.name}
                          className="w-11 h-11 rounded-full object-cover border border-emerald-500 shadow-sm"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 ${
                            drv.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                          }`}
                        ></span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{drv.name}</span>
                          <span className="px-1.5 py-0.5 bg-slate-900 font-mono text-[10px] text-emerald-400 border border-slate-700 rounded font-bold">
                            {drv.vehiclePlate}
                          </span>
                          <span className="px-1.5 py-0.5 bg-emerald-950/80 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/30 uppercase">
                            {drv.vehicleCategory}
                          </span>
                          <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${
                            getDriverCityHub(drv) === 'kandy'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                              : getDriverCityHub(drv) === 'kurunegala'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                              : getDriverCityHub(drv) === 'negombo'
                              ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          }`}>
                            {getDriverCityHub(drv) === 'kandy'
                              ? '🛕 Kandy'
                              : getDriverCityHub(drv) === 'kurunegala'
                              ? '🐘 Kurunegala'
                              : getDriverCityHub(drv) === 'negombo'
                              ? '✈️ Negombo'
                              : '🏙️ Colombo'}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{drv.vehicleModel}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">★ {drv.rating}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-mono">{drv.phone}</span>
                        </p>

                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                          <span>NIC: {drv.nicNumber}</span>
                          <span>•</span>
                          <span>Bank: {drv.bankDetails?.bankName.split(' ')[0]}</span>
                          <span>•</span>
                          <span className="text-emerald-400/90 font-medium">Police Cleared</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            drv.isOnline
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${drv.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                          {drv.isOnline ? (drv.isBusy ? 'ON TRIP' : 'ONLINE') : 'OFFLINE'}
                        </span>

                        {onToggleDriverStatus && (
                          <button
                            onClick={() => onToggleDriverStatus(drv.id, !drv.isOnline)}
                            title={drv.isOnline ? 'Switch Offline' : 'Switch Online'}
                            className={`p-1 rounded-lg border transition-colors ${
                              drv.isOnline
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="text-right text-[11px]">
                        <span className="text-slate-400 block">
                          Today: <strong className="text-emerald-400 font-bold">LKR {drv.earningsTodayLkr.toLocaleString()}</strong>
                        </span>
                        <span className="text-slate-500 text-[10px] block">
                          Wallet: LKR {drv.walletBalanceLkr.toLocaleString()} ({drv.totalTrips} trips)
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <ChangeAdminPasswordModal
        isOpen={showChangePassModal}
        onClose={() => setShowChangePassModal(false)}
        currentPassword={adminPassword}
        onSavePassword={(newPass) => {
          if (onSaveAdminPassword) onSaveAdminPassword(newPass);
        }}
      />
    </div>
  );
};
