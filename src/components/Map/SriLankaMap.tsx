import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Layers, 
  Plus, 
  Minus, 
  RotateCcw, 
  Flame, 
  ShieldCheck, 
  Radio,
  LocateFixed,
  Car,
  Crosshair
} from 'lucide-react';
import { LocationPoint, Driver, Ride, CityHubId, DriverPickupTracking } from '../../types';

interface SriLankaMapProps {
  pickup: LocationPoint;
  dropoff: LocationPoint;
  intermediateStops?: LocationPoint[];
  activeRide: Ride | null;
  drivers: Driver[];
  userRole: 'rider' | 'driver' | 'admin';
  onSelectPickup?: (point: LocationPoint) => void;
  onSelectDropoff?: (point: LocationPoint) => void;
  selectedCityHub?: CityHubId;
  onSelectCityHub?: (hub: CityHubId) => void;
  pickupTracking?: DriverPickupTracking | null;
  onToggleFollowDriver?: () => void;
  isFollowDriverActive?: boolean;
}

export const SriLankaMap: React.FC<SriLankaMapProps> = ({
  pickup,
  dropoff,
  intermediateStops = [],
  activeRide,
  drivers,
  userRole,
  selectedCityHub = 'all',
  onSelectCityHub,
  pickupTracking,
  onToggleFollowDriver,
  isFollowDriverActive = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  const [showTraffic, setShowTraffic] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Animated driver position on the map
  const [driverPosPercent, setDriverPosPercent] = useState(0);
  const [showDriverHeading, setShowDriverHeading] = useState(true);

  // Real-time animation loop along route
  useEffect(() => {
    if (activeRide && (activeRide.status === 'arriving' || activeRide.status === 'in_progress')) {
      const interval = setInterval(() => {
        setDriverPosPercent((prev) => {
          if (prev >= 1) return 0.05;
          return prev + 0.015;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setDriverPosPercent(0);
    }
  }, [activeRide?.status]);

  // When city hub changes, gently adjust pan & zoom
  useEffect(() => {
    if (selectedCityHub === 'galle') {
      setZoom(1.35);
      setPanOffset({ x: 20, y: -130 });
    } else if (selectedCityHub === 'colombo') {
      setZoom(1.35);
      setPanOffset({ x: 80, y: -60 });
    } else if (selectedCityHub === 'kandy') {
      setZoom(1.35);
      setPanOffset({ x: -100, y: 10 });
    } else if (selectedCityHub === 'kurunegala') {
      setZoom(1.35);
      setPanOffset({ x: -40, y: 70 });
    } else if (selectedCityHub === 'negombo') {
      setZoom(1.35);
      setPanOffset({ x: 70, y: 30 });
    } else {
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [selectedCityHub]);

  // Handle map panning with mouse and touch
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = {
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Geographic Bounding Box covering Galle, Colombo, Negombo, Kurunegala, and Kandy:
  // Latitudes: 5.92 (Galle / Mirissa south coast) to 7.68 (Kurunegala north)
  // Longitudes: 79.68 (Negombo/Colombo west coast waters) to 80.95 (Kandy east hills)
  const minLat = 5.92;
  const maxLat = 7.68;
  const minLng = 79.68;
  const maxLng = 80.95;

  const projectCoord = (lat: number, lng: number) => {
    const clampedLat = Math.min(Math.max(lat, minLat), maxLat);
    const clampedLng = Math.min(Math.max(lng, minLng), maxLng);

    const x = 90 + ((clampedLng - minLng) / (maxLng - minLng)) * 620;
    const y = 90 + ((maxLat - clampedLat) / (maxLat - minLat)) * 430;

    return { x, y };
  };

  const pickupPoint = projectCoord(pickup.lat, pickup.lng);
  const dropoffPoint = projectCoord(dropoff.lat, dropoff.lng);

  // Key Target City Anchors projected onto SVG
  const colomboCenter = projectCoord(6.9271, 79.8612);
  const galleCenter = projectCoord(6.0535, 80.2210);
  const kandyCenter = projectCoord(7.2936, 80.6385);
  const kurunegalaCenter = projectCoord(7.4863, 80.3623);
  const negomboCenter = projectCoord(7.2083, 79.8358);
  const airportCenter = projectCoord(7.1808, 79.8841);

  // Check if driver is en route to pickup
  const isApproachingPickup = Boolean(
    activeRide && (activeRide.status === 'accepted' || activeRide.status === 'arriving')
  );

  // Initial driver origin: offset by ~1.6km from pickup so movement to pickup is clearly visible on map
  const driverOriginLat = activeRide?.driver?.currentLat && Math.abs(activeRide.driver.currentLat - pickup.lat) > 0.003
    ? activeRide.driver.currentLat
    : pickup.lat + 0.013;
  const driverOriginLng = activeRide?.driver?.currentLng && Math.abs(activeRide.driver.currentLng - pickup.lng) > 0.003
    ? activeRide.driver.currentLng
    : pickup.lng - 0.014;
  const driverOriginPoint = projectCoord(driverOriginLat, driverOriginLng);

  // Real-time progress (from pickupTracking or local animation)
  const currentProgress = pickupTracking ? pickupTracking.progressPercent : driverPosPercent;

  // Driver SVG coordinate:
  // If approaching pickup, moves from driverOriginPoint towards pickupPoint!
  // If in_progress trip, moves from pickupPoint towards dropoffPoint!
  const currentDriverPoint = isApproachingPickup
    ? {
        x: driverOriginPoint.x + (pickupPoint.x - driverOriginPoint.x) * currentProgress,
        y: driverOriginPoint.y + (pickupPoint.y - driverOriginPoint.y) * currentProgress,
      }
    : {
        x: pickupPoint.x + (dropoffPoint.x - pickupPoint.x) * currentProgress,
        y: pickupPoint.y + (dropoffPoint.y - pickupPoint.y) * currentProgress,
      };

  // Route vector angle in degrees (screen coordinate system: 0 deg = East, 90 deg = South)
  const targetPoint = isApproachingPickup ? pickupPoint : dropoffPoint;
  const startPoint = isApproachingPickup ? driverOriginPoint : pickupPoint;
  const routeDeltaX = targetPoint.x - startPoint.x;
  const routeDeltaY = targetPoint.y - startPoint.y;
  const routeAngleDeg = Math.round((Math.atan2(routeDeltaY, routeDeltaX) * 180) / Math.PI);
  const effectiveDriverHeading = (routeAngleDeg + 360) % 360;

  // Auto-follow driver with camera when enabled
  useEffect(() => {
    if (isFollowDriverActive && isApproachingPickup && currentDriverPoint.x && currentDriverPoint.y) {
      const targetPanX = Math.round((400 - currentDriverPoint.x) * 0.45);
      const targetPanY = Math.round((300 - currentDriverPoint.y) * 0.45);
      setPanOffset({ x: targetPanX, y: targetPanY });
    }
  }, [currentDriverPoint.x, currentDriverPoint.y, isFollowDriverActive, isApproachingPickup]);

  // Cardinal direction helper
  const getCompassDirection = (deg: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
    return directions[index];
  };

  return (
    <div 
      id="sri-lanka-interactive-map"
      className={`relative w-full h-full min-h-[300px] sm:min-h-[360px] md:min-h-[440px] bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing rounded-2xl border border-slate-800 shadow-2xl ${
        isDragging ? 'touch-none' : 'touch-pan-y'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Background Cartography & Road Network */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.25s ease-out',
        }}
      >
        <defs>
          {/* Ocean Gradient */}
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={mapMode === 'streets' ? '#04101e' : '#020617'} />
            <stop offset="100%" stopColor={mapMode === 'streets' ? '#081d33' : '#090d16'} />
          </linearGradient>

          {/* Land Mass Gradient */}
          <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={mapMode === 'streets' ? '#0c1a24' : '#111827'} />
            <stop offset="100%" stopColor={mapMode === 'streets' ? '#09151e' : '#0b0f19'} />
          </linearGradient>

          {/* Glowing Route Line */}
          <linearGradient id="routeGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Expressway Line Gradient */}
          <linearGradient id="expresswayGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          {/* Driver Heading Cone Gradient */}
          <linearGradient id="driver-heading-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="60%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
          </linearGradient>

          {/* Traffic Heat Patterns */}
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Indian Ocean Backdrop */}
        <rect width="800" height="600" fill="url(#oceanGrad)" />

        {/* Western & Southern Coastline & Sri Lanka Landmass Outline */}
        <path
          d="M 120 0 C 135 100 150 180 158 240 C 168 320 220 420 340 500 C 440 540 600 520 800 500 L 800 0 Z"
          fill="url(#landGrad)"
          stroke="#1e293b"
          strokeWidth="1.5"
        />

        {/* Negombo Lagoon Water Body */}
        <ellipse cx={negomboCenter.x - 8} cy={negomboCenter.y + 8} rx="14" ry="24" fill="#0369a1" opacity="0.45" />

        {/* Beira Lake (Colombo) */}
        <ellipse cx={colomboCenter.x + 8} cy={colomboCenter.y - 4} rx="10" ry="6" fill="#0369a1" opacity="0.4" />

        {/* Kandy Lake (Bogambara Wewa) */}
        <ellipse cx={kandyCenter.x - 2} cy={kandyCenter.y + 4} rx="12" ry="7" fill="#0369a1" opacity="0.5" />

        {/* Kurunegala Lake (Wewa Ruma) */}
        <ellipse cx={kurunegalaCenter.x + 6} cy={kurunegalaCenter.y + 4} rx="13" ry="8" fill="#0369a1" opacity="0.45" />

        {/* Kelani River Waterway from Kandy Foothills to Colombo Mouth */}
        <path
          d={`M ${colomboCenter.x} ${colomboCenter.y - 15} Q 320 380 460 350 T ${kandyCenter.x - 30} ${kandyCenter.y + 15}`}
          fill="none"
          stroke="#075985"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* ================= MAJOR HIGHWAYS & EXPRESSWAYS ================= */}

        {/* E01 Southern Expressway: Colombo ⇄ Dodangoda ⇄ Galle */}
        <path
          d={`M ${colomboCenter.x + 8} ${colomboCenter.y + 10} Q ${colomboCenter.x + 20} ${(colomboCenter.y + galleCenter.y) / 2} ${galleCenter.x} ${galleCenter.y - 12}`}
          fill="none"
          stroke="#0d9488"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="6 3"
        />

        {/* E03 Colombo - Katunayake Airport Expressway */}
        <path
          d={`M ${colomboCenter.x + 6} ${colomboCenter.y - 25} Q 180 340 ${airportCenter.x} ${airportCenter.y} L ${negomboCenter.x} ${negomboCenter.y}`}
          fill="none"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="6 3"
        />

        {/* Central Expressway & A1 Highway: Colombo ⇄ Mirigama ⇄ Kurunegala */}
        <path
          d={`M ${colomboCenter.x + 10} ${colomboCenter.y - 25} Q 320 300 ${kurunegalaCenter.x} ${kurunegalaCenter.y}`}
          fill="none"
          stroke="#475569"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* A1 Highway: Colombo ⇄ Ambepussa ⇄ Kandy (Temple of the Tooth Route) */}
        <path
          d={`M ${colomboCenter.x + 15} ${colomboCenter.y - 15} Q 380 350 ${kandyCenter.x} ${kandyCenter.y}`}
          fill="none"
          stroke="#475569"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* A10 Highway: Kurunegala ⇄ Kandy (Wayamba - Central Corridor) */}
        <path
          d={`M ${kurunegalaCenter.x} ${kurunegalaCenter.y} Q 540 180 ${kandyCenter.x} ${kandyCenter.y}`}
          fill="none"
          stroke="#334155"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* A6 Highway: Kurunegala ⇄ Negombo */}
        <path
          d={`M ${kurunegalaCenter.x} ${kurunegalaCenter.y} Q 320 200 ${negomboCenter.x} ${negomboCenter.y}`}
          fill="none"
          stroke="#334155"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Galle Road & Marine Drive (Colombo South A2) */}
        <path
          d={`M ${colomboCenter.x} ${colomboCenter.y} L 205 520 L 215 590`}
          fill="none"
          stroke="#475569"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Real-time Traffic Heatmap Layer */}
        {showTraffic && (
          <g opacity="0.65">
            {/* Colombo Fort / Maradana rush hour */}
            <path
              d={`M ${colomboCenter.x - 5} ${colomboCenter.y - 12} L ${colomboCenter.x + 10} ${colomboCenter.y + 8}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Fast-flowing E03 Katunayake Expressway */}
            <path
              d={`M ${colomboCenter.x + 8} ${colomboCenter.y - 45} L ${airportCenter.x - 5} ${airportCenter.y + 15}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Kandy Dalada Veediya & Lake Round Moderate Traffic */}
            <path
              d={`M ${kandyCenter.x - 15} ${kandyCenter.y} L ${kandyCenter.x + 12} ${kandyCenter.y}`}
              fill="none"
              stroke="#eab308"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Kurunegala Clock Tower Junction */}
            <path
              d={`M ${kurunegalaCenter.x - 12} ${kurunegalaCenter.y} L ${kurunegalaCenter.x + 12} ${kurunegalaCenter.y}`}
              fill="none"
              stroke="#eab308"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* ================= DRIVER PICKUP APPROACH PATH (LIVE TRACKING TO PICKUP) ================= */}
        {isApproachingPickup && (
          <g id="driver-pickup-approach-route">
            {/* Glow underlay */}
            <path
              d={`M ${driverOriginPoint.x} ${driverOriginPoint.y} Q ${(driverOriginPoint.x + pickupPoint.x) / 2 - 15} ${(driverOriginPoint.y + pickupPoint.y) / 2 + 15} ${pickupPoint.x} ${pickupPoint.y}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.3"
              filter="url(#glowEffect)"
            />
            {/* Animated dashed green approach path */}
            <path
              d={`M ${driverOriginPoint.x} ${driverOriginPoint.y} Q ${(driverOriginPoint.x + pickupPoint.x) / 2 - 15} ${(driverOriginPoint.y + pickupPoint.y) / 2 + 15} ${pickupPoint.x} ${pickupPoint.y}`}
              fill="none"
              stroke="#34d399"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="animate-[dash_1.2s_linear_infinite]"
            />
            {/* Midpoint Distance Badge */}
            <g transform={`translate(${(driverOriginPoint.x + pickupPoint.x) / 2 - 15}, ${(driverOriginPoint.y + pickupPoint.y) / 2 + 15})`}>
              <rect x="-48" y="-10" width="96" height="20" rx="10" fill="#022c22" stroke="#10b981" strokeWidth="1.2" />
              <text x="0" y="3.5" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">
                {pickupTracking ? `${pickupTracking.distanceMeters}m to Pickup` : 'Approach to Pickup'}
              </text>
            </g>
          </g>
        )}

        {/* ================= ACTIVE TRIP ROUTE POLYLINE ================= */}
        <g>
          {intermediateStops.length > 0 ? (
            <>
              {intermediateStops.map((stop, idx) => {
                const stopPoint = projectCoord(stop.lat, stop.lng);
                const prevPoint = idx === 0 ? pickupPoint : projectCoord(intermediateStops[idx - 1].lat, intermediateStops[idx - 1].lng);
                return (
                  <path
                    key={`stop_segment_${stop.id}`}
                    d={`M ${prevPoint.x} ${prevPoint.y} Q ${(prevPoint.x + stopPoint.x) / 2 + 15} ${(prevPoint.y + stopPoint.y) / 2 - 15} ${stopPoint.x} ${stopPoint.y}`}
                    fill="none"
                    stroke="url(#routeGlow)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                    className="animate-[dash_1.5s_linear_infinite]"
                  />
                );
              })}
              {(() => {
                const lastStop = intermediateStops[intermediateStops.length - 1];
                const lastStopPoint = projectCoord(lastStop.lat, lastStop.lng);
                return (
                  <path
                    d={`M ${lastStopPoint.x} ${lastStopPoint.y} Q ${(lastStopPoint.x + dropoffPoint.x) / 2 + 15} ${(lastStopPoint.y + dropoffPoint.y) / 2 - 15} ${dropoffPoint.x} ${dropoffPoint.y}`}
                    fill="none"
                    stroke="url(#routeGlow)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                    className="animate-[dash_1.5s_linear_infinite]"
                  />
                );
              })()}
            </>
          ) : (
            <>
              {/* Direct Polyline glow */}
              <path
                d={`M ${pickupPoint.x} ${pickupPoint.y} Q ${(pickupPoint.x + dropoffPoint.x) / 2 + 20} ${(pickupPoint.y + dropoffPoint.y) / 2 - 20} ${dropoffPoint.x} ${dropoffPoint.y}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.25"
                filter="url(#glowEffect)"
              />
              <path
                d={`M ${pickupPoint.x} ${pickupPoint.y} Q ${(pickupPoint.x + dropoffPoint.x) / 2 + 20} ${(pickupPoint.y + dropoffPoint.y) / 2 - 20} ${dropoffPoint.x} ${dropoffPoint.y}`}
                fill="none"
                stroke="url(#routeGlow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="8 4"
                className="animate-[dash_1.5s_linear_infinite]"
              />
            </>
          )}
        </g>

        {/* ================= PRIMARY FOCUS HUB BADGES ON MAP ================= */}
        {/* GALLE HUB (UNESCO DUTCH FORT & SOUTH COAST) */}
        <g 
          transform={`translate(${galleCenter.x}, ${galleCenter.y})`} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onSelectCityHub?.('galle'); }}
        >
          <circle cx="0" cy="0" r="26" fill="#14b8a6" opacity="0.18" />
          <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#14b8a6" strokeWidth="2.5" />
          <text x="0" y="3.5" textAnchor="middle" fill="#14b8a6" fontSize="9" fontWeight="bold">G</text>
          <rect x="-35" y="15" width="70" height="19" rx="4" fill="#090d16" stroke="#14b8a6" strokeWidth="1" opacity="0.95" />
          <text x="0" y="28" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            GALLE
          </text>
        </g>

        {/* COLOMBO HUB */}
        <g 
          transform={`translate(${colomboCenter.x}, ${colomboCenter.y})`} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onSelectCityHub?.('colombo'); }}
        >
          <circle cx="0" cy="0" r="26" fill="#10b981" opacity="0.15" />
          <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
          <text x="0" y="3.5" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">C</text>
          <rect x="-40" y="15" width="80" height="19" rx="4" fill="#090d16" stroke="#10b981" strokeWidth="1" opacity="0.95" />
          <text x="0" y="28" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            COLOMBO
          </text>
        </g>

        {/* KANDY HUB */}
        <g 
          transform={`translate(${kandyCenter.x}, ${kandyCenter.y})`} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onSelectCityHub?.('kandy'); }}
        >
          <circle cx="0" cy="0" r="26" fill="#f59e0b" opacity="0.15" />
          <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
          <text x="0" y="3.5" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">K</text>
          <rect x="-35" y="15" width="70" height="19" rx="4" fill="#090d16" stroke="#f59e0b" strokeWidth="1" opacity="0.95" />
          <text x="0" y="28" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            KANDY
          </text>
        </g>

        {/* KURUNEGALA HUB */}
        <g 
          transform={`translate(${kurunegalaCenter.x}, ${kurunegalaCenter.y})`} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onSelectCityHub?.('kurunegala'); }}
        >
          <circle cx="0" cy="0" r="26" fill="#8b5cf6" opacity="0.15" />
          <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2.5" />
          <text x="0" y="3.5" textAnchor="middle" fill="#8b5cf6" fontSize="9" fontWeight="bold">KG</text>
          <rect x="-46" y="15" width="92" height="19" rx="4" fill="#090d16" stroke="#8b5cf6" strokeWidth="1" opacity="0.95" />
          <text x="0" y="28" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            KURUNEGALA
          </text>
        </g>

        {/* NEGOMBO & AIRPORT HUB */}
        <g 
          transform={`translate(${negomboCenter.x}, ${negomboCenter.y})`} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onSelectCityHub?.('negombo'); }}
        >
          <circle cx="0" cy="0" r="26" fill="#06b6d4" opacity="0.15" />
          <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
          <text x="0" y="3.5" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="bold">N</text>
          <rect x="-38" y="15" width="76" height="19" rx="4" fill="#090d16" stroke="#06b6d4" strokeWidth="1" opacity="0.95" />
          <text x="0" y="28" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            NEGOMBO
          </text>
        </g>

        {/* Bandaranaike Airport Tag */}
        <g transform={`translate(${airportCenter.x}, ${airportCenter.y})`}>
          <rect x="-32" y="-20" width="64" height="14" rx="3" fill="#0369a1" opacity="0.85" />
          <text x="0" y="-10" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
            ✈ CMB AIRPORT
          </text>
        </g>

        {/* Water & Ocean text */}
        <text x="75" y="280" fill="#38bdf8" opacity="0.35" fontSize="10" fontWeight="bold" transform="rotate(-90 75 280)">
          INDIAN OCEAN
        </text>

        {/* INTERMEDIATE WAYPOINT STOPS */}
        {intermediateStops.map((stop, sIdx) => {
          const sPoint = projectCoord(stop.lat, stop.lng);
          return (
            <g key={`marker_stop_${stop.id}`} transform={`translate(${sPoint.x}, ${sPoint.y})`}>
              <circle cx="0" cy="0" r="14" fill="#38bdf8" opacity="0.2" className="animate-pulse" />
              <circle cx="0" cy="0" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                {sIdx + 1}
              </text>
              <rect x="-45" y="-30" width="90" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="-18" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
                STOP {sIdx + 1}: {stop.name.slice(0, 12)}
              </text>
            </g>
          );
        })}

        {/* DRIVERS / FLEET ACROSS COLOMBO, KANDY, KURUNEGALA, NEGOMBO */}
        {drivers.map((drv) => {
          const pos = projectCoord(drv.currentLat, drv.currentLng);
          const isAssigned = activeRide?.driver?.id === drv.id;
          if (isAssigned) return null;

          return (
            <g
              key={drv.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              className="cursor-pointer transition-transform hover:scale-125"
            >
              {drv.isOnline && (
                <circle cx="0" cy="0" r="14" fill="#10b981" opacity="0.2" />
              )}
              <circle
                cx="0"
                cy="0"
                r="9"
                fill={drv.vehicleCategory === 'tuk' ? '#047857' : '#0f172a'}
                stroke={drv.vehicleCategory === 'tuk' ? '#fbbf24' : '#10b981'}
                strokeWidth="2"
              />
              {drv.vehicleCategory === 'tuk' ? (
                <path d="M -4 2 L -2 -3 L 2 -3 L 4 2 Z" fill="#fbbf24" />
              ) : (
                <rect x="-3.5" y="-2.5" width="7" height="5" rx="1.5" fill="#ffffff" />
              )}
            </g>
          );
        })}

        {/* PICKUP PIN */}
        <g transform={`translate(${pickupPoint.x}, ${pickupPoint.y})`}>
          <circle cx="0" cy="0" r="18" fill="#10b981" opacity="0.25" className="animate-ping" />
          <circle cx="0" cy="0" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill="#064e3b" />
          
          <rect x="-60" y="-34" width="120" height="20" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.2" />
          <text x="0" y="-21" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
            PICKUP: {pickup.name.slice(0, 16)}
          </text>
        </g>

        {/* DROPOFF PIN */}
        <g transform={`translate(${dropoffPoint.x}, ${dropoffPoint.y})`}>
          <circle cx="0" cy="0" r="18" fill="#ef4444" opacity="0.25" className="animate-ping" />
          <circle cx="0" cy="0" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill="#ffffff" />

          <rect x="-60" y="-34" width="120" height="20" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1.2" />
          <text x="0" y="-21" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">
            DROPOFF: {dropoff.name.slice(0, 16)}
          </text>
        </g>

        {/* ASSIGNED DRIVER ANIMATED VEHICLE WITH HEADING DISPLAY */}
        {activeRide && (
          <g
            transform={`translate(${currentDriverPoint.x}, ${currentDriverPoint.y})`}
            className="transition-all duration-300"
          >
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="24" fill="#10b981" opacity="0.2" className="animate-ping" />
            
            {/* Heading Cone / Beam (Visible when showDriverHeading is active) */}
            {showDriverHeading && (
              <g transform={`rotate(${effectiveDriverHeading})`} opacity="0.85">
                {/* Direction cone gradient beam */}
                <path
                  d="M 0 0 L -22 -44 A 48 48 0 0 1 22 -44 Z"
                  fill="url(#driver-heading-gradient)"
                  className="transition-transform duration-300"
                />
                {/* Arrow pointer indicator */}
                <polygon
                  points="0,-36 -6,-24 6,-24"
                  fill="#34d399"
                  stroke="#022c22"
                  strokeWidth="1"
                />
              </g>
            )}

            {/* Vehicle Base & Outer Ring */}
            <circle cx="0" cy="0" r="14" fill="#064e3b" stroke="#34d399" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="10" fill="#022c22" />

            {/* Rotating Vehicle Icon aligned to Driver Heading */}
            <g transform={showDriverHeading ? `rotate(${effectiveDriverHeading})` : undefined} className="transition-transform duration-300">
              {activeRide.vehicleCategory === 'tuk' ? (
                <g transform="translate(-6, -6) scale(0.6)">
                  <rect x="2" y="2" width="16" height="16" rx="3" fill="#eab308" />
                  <rect x="4" y="4" width="12" height="6" rx="1" fill="#022c22" />
                  <circle cx="5" cy="18" r="2" fill="#fff" />
                  <circle cx="15" cy="18" r="2" fill="#fff" />
                </g>
              ) : (
                <Car className="w-3.5 h-3.5 text-emerald-400 -translate-x-1.5 -translate-y-1.5" />
              )}
            </g>

            {/* Plate Tag and Heading Degrees Badge */}
            <g transform="translate(0, 24)">
              <rect x="-48" y="-9" width="96" height="18" rx="4" fill="#022c22" stroke="#10b981" strokeWidth="1" />
              <text x="0" y="3.5" textAnchor="middle" fill="#34d399" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                {activeRide.driver?.vehiclePlate || 'WP ABK-4819'}
              </text>
            </g>

            {/* Interactive/Visible Heading Compass Tag (Top of Marker) */}
            {showDriverHeading && (
              <g transform="translate(0, -22)">
                <rect x="-34" y="-8" width="68" height="15" rx="3.5" fill="#091410" stroke="#34d399" strokeWidth="0.9" opacity="0.95" />
                <text x="0" y="2.5" textAnchor="middle" fill="#6ee7b7" fontSize="7" fontWeight="bold" fontFamily="monospace">
                  🧭 {effectiveDriverHeading}° {getCompassDirection(effectiveDriverHeading)}
                </text>
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Map Floating HUD Controls - Top Left */}
      <div className="absolute top-2.5 left-2.5 max-w-[calc(100%-60px)] sm:max-w-none flex flex-col gap-1.5 z-10 pointer-events-none">
        {/* Active GPS Lock Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-[10px] sm:text-xs font-medium text-slate-200 shadow-xl pointer-events-auto self-start">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-emerald-400 truncate">Sri Lanka Focus Corridor</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">Colombo • Kandy • Kurunegala • Negombo</span>
        </div>

        {/* Interactive Quick Target City Hub Jump Buttons */}
        {onSelectCityHub && (
          <div className="flex items-center gap-1 p-1 bg-slate-900/95 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg text-[10px] sm:text-[11px] overflow-x-auto max-w-full pointer-events-auto scrollbar-none">
            <span className="px-1.5 text-slate-400 text-[10px] font-semibold flex items-center gap-1 flex-shrink-0">
              <Crosshair className="w-3 h-3 text-emerald-400" />
              <span>Target:</span>
            </span>

            <button
              type="button"
              onClick={() => onSelectCityHub('all')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all flex-shrink-0 ${
                selectedCityHub === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              All Hubs
            </button>

            <button
              type="button"
              onClick={() => onSelectCityHub('colombo')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
                selectedCityHub === 'colombo'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🏙️ Colombo</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCityHub('kandy')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
                selectedCityHub === 'kandy'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🛕 Kandy</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCityHub('kurunegala')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
                selectedCityHub === 'kurunegala'
                  ? 'bg-purple-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🐘 Kurunegala</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCityHub('negombo')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
                selectedCityHub === 'negombo'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>✈️ Negombo</span>
            </button>
          </div>
        )}

        {/* Turn-by-Turn Navigation Overlay */}
        {activeRide && activeRide.status === 'in_progress' && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-950/90 border border-emerald-500/40 rounded-xl backdrop-blur-md shadow-xl text-xs text-white max-w-xs animate-in fade-in pointer-events-auto">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold flex-shrink-0">
              <Navigation className="w-3.5 h-3.5 rotate-45" />
            </div>
            <div>
              <p className="font-bold text-emerald-300 text-[11px]">In 450m, Continue on Highway</p>
              <p className="text-[10px] text-slate-300 truncate">
                Connecting {pickup.city} to {dropoff.city}
              </p>
            </div>
          </div>
        )}

        {/* Live Driver Heading Status HUD (Visible when ride accepted/active) */}
        {activeRide && activeRide.driver && showDriverHeading && (
          <div 
            id="driver-heading-hud"
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-950/90 border border-emerald-500/50 rounded-xl backdrop-blur-md shadow-xl text-xs text-white max-w-xs animate-in fade-in pointer-events-auto"
          >
            <div className="relative w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Compass className="w-4 h-4" style={{ transform: `rotate(${effectiveDriverHeading}deg)` }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-emerald-300 text-[11px] tracking-tight">Driver Heading:</span>
                <span className="font-mono font-bold text-white text-[11px] px-1.5 py-0.2 bg-emerald-950 rounded border border-emerald-500/40">
                  {effectiveDriverHeading}° {getCompassDirection(effectiveDriverHeading)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {activeRide.driver.name} • {activeRide.driver.vehiclePlate}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Map Tools on the Right */}
      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
        {/* Toggle Driver Heading Option (Interactive Map Control) */}
        {activeRide && (
          <button
            id="map-toggle-heading"
            onClick={() => setShowDriverHeading(!showDriverHeading)}
            className={`p-2 rounded-xl border transition-all shadow-lg backdrop-blur-md ${
              showDriverHeading
                ? 'bg-emerald-500/25 border-emerald-500/80 text-emerald-400 shadow-emerald-950/50'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={showDriverHeading ? 'Driver Heading Enabled (Click to Hide)' : 'Show Driver Heading on Map'}
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Satellite / Streets Toggle */}
        <button
          id="map-toggle-satellite"
          onClick={() => setMapMode(mapMode === 'streets' ? 'satellite' : 'streets')}
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition-all shadow-lg backdrop-blur-md"
          title="Toggle Satellite/Streets"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>

        {/* Live Traffic Toggle */}
        <button
          id="map-toggle-traffic"
          onClick={() => setShowTraffic(!showTraffic)}
          className={`p-2 rounded-xl border transition-all shadow-lg backdrop-blur-md ${
            showTraffic
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-400'
              : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Toggle Traffic Heatmap"
        >
          <Flame className="w-3.5 h-3.5" />
        </button>

        {/* Zoom In */}
        <button
          id="map-zoom-in"
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-lg backdrop-blur-md"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Out */}
        <button
          id="map-zoom-out"
          onClick={() => setZoom((z) => Math.max(0.75, z - 0.2))}
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-lg backdrop-blur-md"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Reset / Center */}
        <button
          id="map-recenter"
          onClick={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
            if (onSelectCityHub) onSelectCityHub('all');
          }}
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-lg backdrop-blur-md"
          title="Recenter Map"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Map Status Strip */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 border border-slate-800 rounded-lg text-[10px] sm:text-[11px] text-slate-300 backdrop-blur-md pointer-events-auto shadow-lg max-w-[85%] truncate">
          <LocateFixed className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">
            Tracking <strong className="text-white">{drivers.filter((d) => d.isOnline).length} Active Drivers</strong> across Colombo, Kandy, Kurunegala & Negombo
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 border border-slate-800 rounded-lg text-[10px] text-slate-400 backdrop-blur-md pointer-events-auto">
          <span>Central Express & E03 Integrated</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Live GPS Telemetry</span>
        </div>
      </div>
    </div>
  );
};
