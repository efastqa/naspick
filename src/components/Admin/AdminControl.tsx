import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sliders,
  UserPlus,
  RotateCcw,
  Search,
  Power,
  Lock,
  KeyRound,
  Save,
  Car,
  Check,
  Map as MapIcon,
  Banknote,
  ShieldCheck,
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
  onClearDrivers?: () => void;
  liveMapNode?: React.ReactNode;
}

type AdminTab = 'overview' | 'drivers' | 'surge' | 'map';

export const AdminControl: React.FC<AdminControlProps> = ({
  drivers,
  applications,
  onVerifyDriver,
  surgeMultiplier,
  onUpdateSurge,
  onOpenAddDriver,
  onResetDrivers,
  onClearDrivers,
  onToggleDriverStatus,
  onLockAdmin,
  adminPassword = 'naspick2026',
  onSaveAdminPassword,
  vehicleOptions,
  onUpdateVehiclePricing,
  onResetVehiclePricing,
  expresswayTollLkr = 300,
  onUpdateExpresswayToll,
  liveMapNode,
}) => {
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [fleetCityFilter, setFleetCityFilter] = useState<'all' | 'colombo' | 'kandy' | 'kurunegala' | 'negombo'>('all');
  const [fleetSearchQuery, setFleetSearchQuery] = useState('');
  const [showChangePassModal, setShowChangePassModal] = useState(false);

  // Pricing State
  const [localVehicles, setLocalVehicles] = useState<VehicleOption[]>(() =>
    vehicleOptions && vehicleOptions.length > 0 ? vehicleOptions : VEHICLE_OPTIONS
  );
  const [localExpresswayToll, setLocalExpresswayToll] = useState<number>(expresswayTollLkr);
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState<string>('');
  const [isPricingDirty, setIsPricingDirty] = useState(false);

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
    if (onUpdateVehiclePricing) onUpdateVehiclePricing(localVehicles);
    if (onUpdateExpresswayToll) onUpdateExpresswayToll(localExpresswayToll);
    setIsPricingDirty(false);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPricingSaveSuccess(`Rates saved and live for customers (${timeStr}).`);
    setTimeout(() => setPricingSaveSuccess(''), 6000);
  };

  const handleResetToStandards = () => {
    setLocalVehicles(VEHICLE_OPTIONS);
    setLocalExpresswayToll(300);
    if (onResetVehiclePricing) onResetVehiclePricing();
    if (onUpdateExpresswayToll) onUpdateExpresswayToll(300);
    setIsPricingDirty(false);
    setPricingSaveSuccess('Reset to Sri Lanka standard fares.');
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

  const seenFilteredIds = new Set<string>();
  const filteredDrivers = drivers.filter((drv) => {
    if (!drv || !drv.id || seenFilteredIds.has(drv.id)) return false;
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
    if (matchesCity && matchesSearch) {
      seenFilteredIds.add(drv.id);
      return true;
    }
    return false;
  });

  const totalGmvLkr = 584500;
  const platformRevenueLkr = Math.round(totalGmvLkr * 0.15);

  const hubBreakdown = [
    { name: 'Colombo Central Hub', areas: 'Fort · Galle Face · Port City', share: 45, fleet: 38, color: 'bg-emerald-500' },
    { name: 'Kandy Hill Capital', areas: 'Temple of Tooth · KCC', share: 25, fleet: 21, color: 'bg-amber-500' },
    { name: 'Kurunegala Wayamba', areas: 'Clock Tower · Transit', share: 16, fleet: 14, color: 'bg-sky-500' },
    { name: 'Negombo & Airport', areas: 'CMB Katunayake · Beach', share: 14, fleet: 12, color: 'bg-indigo-500' },
  ];

  return (
    <div
      id="admin-control-panel"
      className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-slate-900 dark:text-slate-100"
    >
      {/* Top Workspace Header */}
      <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading tracking-tight">
            Operations & Fleet Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sri Lanka HQ · {onlineDrivers.length} of {drivers.length} drivers online · {surgeMultiplier}x surge
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="change-admin-pass-btn"
            onClick={() => setShowChangePassModal(true)}
            className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Update Administrator Passkey"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Passkey</span>
          </button>

          {onLockAdmin && (
            <button
              type="button"
              id="lock-admin-btn"
              onClick={onLockAdmin}
              className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors"
              title="Lock Admin Panel & Return to Customer App"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Simple Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-xs sm:text-sm font-medium px-5 overflow-x-auto no-scrollbar gap-6">
        <button
          type="button"
          onClick={() => setAdminTab('overview')}
          className={`py-3 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            adminTab === 'overview'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('drivers')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            adminTab === 'drivers'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>Drivers & Approvals</span>
          <span className="text-xs text-slate-400 tabular-nums">({drivers.length})</span>
          {pendingApps.length > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded tabular-nums">
              {pendingApps.length} pending
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('surge')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            adminTab === 'surge'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>Fares & Surge</span>
          {isPricingDirty && (
            <span className="text-[11px] text-amber-500 font-semibold">· Unsaved</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('map')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            adminTab === 'map'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Live Map</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-5 space-y-6">
        {/* 1. OVERVIEW TAB */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Clean KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                  Today's Revenue
                </span>
                <span className="text-xl font-bold font-heading mt-1 block tabular-nums">
                  LKR {totalGmvLkr.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1 tabular-nums">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs yesterday
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                  Platform Net (15%)
                </span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-heading mt-1 block tabular-nums">
                  LKR {platformRevenueLkr.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                  Commission settled
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                  Online Fleet
                </span>
                <span className="text-xl font-bold font-heading mt-1 block tabular-nums">
                  {onlineDrivers.length} / {drivers.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                  Active on GPS
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                  Pending Approvals
                </span>
                <span className="text-xl font-bold font-heading mt-1 block tabular-nums text-amber-600 dark:text-amber-400">
                  {pendingApps.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                  Driver applications
                </span>
              </div>
            </div>

            {/* Quick Management Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {onOpenAddDriver && (
                <button
                  type="button"
                  onClick={onOpenAddDriver}
                  className="min-h-[40px] px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Driver</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setAdminTab('drivers')}
                className="min-h-[40px] px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Review Approvals ({pendingApps.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('surge')}
                className="min-h-[40px] px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Banknote className="w-4 h-4 text-emerald-500" />
                <span>Fares & Surge</span>
              </button>

              {drivers.length === 0 && onResetDrivers && (
                <button
                  type="button"
                  onClick={onResetDrivers}
                  className="min-h-[40px] px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>Load Sample Fleet</span>
                </button>
              )}
            </div>

            {/* Clean Regional Hub Breakdown (No Nested Cards) */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-heading">Regional Hub Coverage</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">4 Priority Hubs</span>
              </div>

              <div className="space-y-3">
                {hubBreakdown.map((hub) => (
                  <div key={hub.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold">{hub.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                          {hub.areas}
                        </span>
                      </div>
                      <span className="font-semibold tabular-nums">
                        {hub.share}% · {hub.fleet} vehicles
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${hub.color} rounded-full`} style={{ width: `${hub.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. DRIVERS & APPROVALS TAB */}
        {adminTab === 'drivers' && (
          <div className="space-y-6">
            {/* Pending Applications Section */}
            {pendingApps.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-heading">
                    Pending Driver Approvals ({pendingApps.length})
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Verify NIC, License & Plate before approval
                  </span>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
                  {pendingApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm">{app.fullName}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">
                            {app.phone}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                          NIC: <strong className="text-slate-800 dark:text-slate-200">{app.nic}</strong> ·
                          License: <strong className="text-slate-800 dark:text-slate-200">{app.licenseNumber}</strong> ·
                          {app.vehicleModel} (<span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{app.vehiclePlate}</span>) · {app.city}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onVerifyDriver(app.id, 'reject')}
                          className="min-h-[36px] px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:border-rose-500/50 hover:text-rose-500 rounded-lg font-semibold transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => onVerifyDriver(app.id, 'approve')}
                          className="min-h-[36px] px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registered Drivers Toolbar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search driver name, plate, or phone..."
                    value={fleetSearchQuery}
                    onChange={(e) => setFleetSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {onOpenAddDriver && (
                    <button
                      type="button"
                      id="admin-onboard-driver-btn"
                      onClick={onOpenAddDriver}
                      className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Driver</span>
                    </button>
                  )}

                  {onResetDrivers && (
                    <button
                      type="button"
                      id="admin-reset-fleet-btn"
                      onClick={onResetDrivers}
                      className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-medium transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                      <span>Load Sample</span>
                    </button>
                  )}

                  {onClearDrivers && drivers.length > 0 && (
                    <button
                      type="button"
                      id="admin-clear-fleet-btn"
                      onClick={onClearDrivers}
                      className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:text-rose-500 rounded-xl text-xs font-medium transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Simple City Hub Filter */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'All Hubs' },
                  { id: 'colombo', label: 'Colombo' },
                  { id: 'kandy', label: 'Kandy' },
                  { id: 'kurunegala', label: 'Kurunegala' },
                  { id: 'negombo', label: 'Negombo' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFleetCityFilter(c.id as typeof fleetCityFilter)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      fleetCityFilter === c.id
                        ? 'bg-emerald-500 text-slate-950 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Registered Drivers Table/List */}
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {filteredDrivers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                    <p>No drivers registered yet.</p>
                    {onResetDrivers && (
                      <button
                        type="button"
                        onClick={onResetDrivers}
                        className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                      >
                        Load sample Sri Lankan drivers
                      </button>
                    )}
                  </div>
                ) : (
                  filteredDrivers.map((drv) => {
                    const hubLabel = getDriverCityHub(drv);
                    return (
                      <div
                        key={drv.id}
                        className="p-3.5 bg-white dark:bg-slate-950/40 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={drv.avatar || '/naspick_logo.png'}
                            alt={drv.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-800 shrink-0"
                          />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm truncate">{drv.name}</span>
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                                {drv.vehiclePlate}
                              </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {drv.vehicleModel} · {drv.vehicleCategory.toUpperCase()} · {hubLabel} · ★ {drv.rating} · {drv.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right hidden sm:block tabular-nums">
                            <span className="font-semibold block">
                              Today: LKR {drv.earningsTodayLkr.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              Wallet: LKR {drv.walletBalanceLkr.toLocaleString()} · {drv.totalTrips} trips
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-semibold ${
                                drv.isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                              }`}
                            >
                              {drv.isOnline ? (drv.isBusy ? 'On Trip' : 'Online') : 'Offline'}
                            </span>

                            {onToggleDriverStatus && (
                              <button
                                type="button"
                                onClick={() => onToggleDriverStatus(drv.id, !drv.isOnline)}
                                title={drv.isOnline ? 'Switch Offline' : 'Switch Online'}
                                className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border transition-colors ${
                                  drv.isOnline
                                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <Power className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. FARES & SURGE TAB */}
        {adminTab === 'surge' && (
          <div className="space-y-6">
            {/* Save / Reset Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold font-heading">Fare Rates & Surge Control</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Changes apply immediately to rider booking estimates once saved.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  id="admin-reset-pricing-btn"
                  onClick={handleResetToStandards}
                  className="min-h-[38px] px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Standards</span>
                </button>

                <button
                  type="button"
                  id="admin-save-pricing-btn"
                  onClick={handleSavePricing}
                  className="min-h-[38px] px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {pricingSaveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{pricingSaveSuccess}</span>
              </div>
            )}

            {/* Surge Multiplier + Expressway Toll */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold">Dynamic Surge Multiplier</span>
                  </div>
                  <span className="text-lg font-bold text-amber-500 tabular-nums">{surgeMultiplier}x</span>
                </div>

                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={surgeMultiplier}
                  onChange={(e) => onUpdateSurge(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Standard', val: 1.0 },
                    { label: 'Peak', val: 1.3 },
                    { label: 'Monsoon', val: 1.6 },
                    { label: 'High Demand', val: 2.0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => onUpdateSurge(preset.val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors tabular-nums ${
                        surgeMultiplier === preset.val
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {preset.label} ({preset.val}x)
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3">
                <span className="text-xs font-bold block">Expressway Toll (LKR)</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Rs.</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={localExpresswayToll}
                    onChange={(e) => {
                      setLocalExpresswayToll(Math.max(0, parseInt(e.target.value) || 0));
                      setIsPricingDirty(true);
                    }}
                    className="w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none tabular-nums"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickFuelAdjustment(10)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300 text-[11px] font-semibold"
                  >
                    +10% Fuel Adj
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFuelAdjustment(-10)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold"
                  >
                    -10% Promo
                  </button>
                </div>
              </div>
            </div>

            {/* Per-Vehicle Tariff Cards */}
            <div className="space-y-3">
              {localVehicles.map((veh) => {
                const calcSampleTrip = (km: number, mins: number, toll = 0) => {
                  const subtotal = (veh.baseFareLkr + km * veh.perKmLkr + mins * veh.perMinLkr) * surgeMultiplier;
                  const platformFee = Math.round(subtotal * 0.1);
                  return Math.max(veh.baseFareLkr, Math.round(subtotal + platformFee + toll));
                };

                const cityCost5km = calcSampleTrip(5, 15, 0);
                const airportCost34km = calcSampleTrip(34, 30, localExpresswayToll);

                return (
                  <div
                    key={veh.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Car className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-bold text-sm">{veh.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {veh.capacity} seats {veh.ac ? '· AC' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        Est. 5 km: <strong className="text-emerald-600 dark:text-emerald-400">Rs. {cityCost5km.toLocaleString()}</strong> ·
                        Airport (34 km): <strong className="text-sky-600 dark:text-sky-400">Rs. {airportCost34km.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          Base Fare (LKR)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={veh.baseFareLkr}
                          onChange={(e) => handlePriceFieldChange(veh.id, 'baseFareLkr', parseInt(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          Per km (LKR)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={veh.perKmLkr}
                          onChange={(e) => handlePriceFieldChange(veh.id, 'perKmLkr', parseInt(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          Per minute (LKR)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={veh.perMinLkr}
                          onChange={(e) => handlePriceFieldChange(veh.id, 'perMinLkr', parseInt(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isPricingDirty && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>You have unsaved fare updates.</span>
                </div>
                <button
                  type="button"
                  onClick={handleSavePricing}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  Save Rates
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. LIVE MAP TAB */}
        {adminTab === 'map' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-heading">Live Fleet Map</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time driver positions across Colombo, Kandy, Kurunegala, and Negombo
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {onlineDrivers.length} Online
              </span>
            </div>

            {liveMapNode ? (
              liveMapNode
            ) : (
              <div className="h-[420px] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-500">
                Live fleet map unavailable.
              </div>
            )}
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
