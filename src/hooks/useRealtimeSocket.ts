import { useEffect, useRef, useState, useCallback } from 'react';
import { Driver, Ride, DriverPickupTracking, RealtimeTelemetryUpdate } from '../types';

export interface UseRealtimeSocketOptions {
  userRole: 'rider' | 'driver' | 'admin';
  driverId?: string;
  onRideRequested?: (ride: Ride) => void;
  onRideAccepted?: (ride: Ride) => void;
  onRideArrived?: (ride: Ride, geofenceTriggered?: boolean) => void;
  onRideStarted?: (ride: Ride) => void;
  onRideCompleted?: (ride: Ride, netEarnings?: number) => void;
  onRideCancelled?: (message: string) => void;
  onDriverLocationUpdated?: (update: RealtimeTelemetryUpdate) => void;
}

export function useRealtimeSocket({
  userRole,
  driverId,
  onRideRequested,
  onRideAccepted,
  onRideArrived,
  onRideStarted,
  onRideCompleted,
  onRideCancelled,
  onDriverLocationUpdated,
}: UseRealtimeSocketOptions) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(18);
  const [packetsCount, setPacketsCount] = useState<number>(0);
  const [liveTelemetry, setLiveTelemetry] = useState<DriverPickupTracking | null>(null);
  const [isDeviceGpsActive, setIsDeviceGpsActive] = useState<boolean>(false);
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const pingTimestampRef = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);
  const simIntervalRef = useRef<number | null>(null);

  // Keep callback refs fresh
  const onRideRequestedRef = useRef(onRideRequested);
  onRideRequestedRef.current = onRideRequested;
  const onRideAcceptedRef = useRef(onRideAccepted);
  onRideAcceptedRef.current = onRideAccepted;
  const onRideArrivedRef = useRef(onRideArrived);
  onRideArrivedRef.current = onRideArrived;
  const onRideStartedRef = useRef(onRideStarted);
  onRideStartedRef.current = onRideStarted;
  const onRideCompletedRef = useRef(onRideCompleted);
  onRideCompletedRef.current = onRideCompleted;
  const onRideCancelledRef = useRef(onRideCancelled);
  onRideCancelledRef.current = onRideCancelled;
  const onDriverLocationUpdatedRef = useRef(onDriverLocationUpdated);
  onDriverLocationUpdatedRef.current = onDriverLocationUpdated;

  // Send message over WebSocket
  const sendMessage = useCallback((type: string, data?: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify({ type, data, timestamp: Date.now() }));
        setPacketsCount((c) => c + 1);
        return true;
      } catch (err) {
        console.error('Failed to send WebSocket message:', err);
      }
    }
    return false;
  }, []);

  // Broadcast driver GPS position
  const broadcastLocation = useCallback(
    (lat: number, lng: number, heading: number = 0, speedKmH: number = 30) => {
      if (!driverId) return;
      sendMessage('driver:location_update', {
        driverId,
        lat,
        lng,
        heading,
        speedKmH,
        isOnline: true,
        isBusy: true,
      });
    },
    [driverId, sendMessage]
  );

  // Connect to WebSocket server
  const connectSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        // Measure latency
        pingTimestampRef.current = performance.now();
        ws.send(JSON.stringify({ type: 'telemetry:ping', timestamp: Date.now() }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          setPacketsCount((c) => c + 1);

          if (msg.type === 'telemetry:pong') {
            const rtt = Math.round(performance.now() - pingTimestampRef.current);
            if (rtt > 0 && rtt < 1000) setLatencyMs(rtt);
            return;
          }

          if (msg.type === 'driver:location_updated') {
            const data = msg.data;
            if (data?.telemetry) {
              setLiveTelemetry(data.telemetry);
            }
            if (onDriverLocationUpdatedRef.current && data) {
              onDriverLocationUpdatedRef.current(data);
            }
          }

          if (msg.type === 'ride:requested' && onRideRequestedRef.current) {
            onRideRequestedRef.current(msg.data?.ride);
          }

          if (msg.type === 'ride:accepted' && onRideAcceptedRef.current) {
            onRideAcceptedRef.current(msg.data?.ride);
          }

          if (msg.type === 'ride:arrived' && onRideArrivedRef.current) {
            onRideArrivedRef.current(msg.data?.ride, msg.data?.geofenceTriggered);
          }

          if (msg.type === 'ride:started' && onRideStartedRef.current) {
            onRideStartedRef.current(msg.data?.ride);
          }

          if (msg.type === 'ride:completed' && onRideCompletedRef.current) {
            onRideCompletedRef.current(msg.data?.ride, msg.data?.driverNetEarnings);
          }

          if (msg.type === 'ride:cancelled' && onRideCancelledRef.current) {
            onRideCancelledRef.current(msg.data?.message || 'Ride cancelled');
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Auto-reconnect after 2 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connectSocket();
        }, 2000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.error('Failed to create WebSocket instance:', e);
    }
  }, []);

  // Periodic heartbeat ping to measure round-trip latency
  useEffect(() => {
    connectSocket();

    const pingInterval = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        pingTimestampRef.current = performance.now();
        socketRef.current.send(JSON.stringify({ type: 'telemetry:ping', timestamp: Date.now() }));
      }
    }, 15000);

    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectSocket]);

  // Real Hardware GPS Watcher via Geolocation API
  const startDeviceGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsError(null);
    setIsDeviceGpsActive(true);

    let lastLat = 0;
    let lastLng = 0;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading, speed } = position.coords;

        // Calculate heading if not provided by device sensor
        let calculatedHeading = heading || 0;
        if (!heading && lastLat !== 0) {
          const dy = latitude - lastLat;
          const dx = longitude - lastLng;
          calculatedHeading = Math.round((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        }

        lastLat = latitude;
        lastLng = longitude;
        const speedKmH = speed ? Math.round(speed * 3.6) : 28;

        broadcastLocation(latitude, longitude, calculatedHeading, speedKmH);
      },
      (error) => {
        console.warn('Device GPS watch error:', error.message);
        setGpsError(error.message);
        setIsDeviceGpsActive(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
  }, [broadcastLocation]);

  const stopDeviceGps = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsDeviceGpsActive(false);
  }, []);

  // Simulated GPS drive patrol along Sri Lanka road routes (for testing & live demos)
  const startSimulatedGpsDrive = useCallback(
    (startLat: number = 6.9271, startLng: number = 79.8612, targetLat: number = 6.9344, targetLng: number = 79.8428) => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);

      setIsSimulatingGps(true);
      let step = 0;
      const totalSteps = 40;

      simIntervalRef.current = window.setInterval(() => {
        step++;
        const progress = (step % totalSteps) / totalSteps;
        // Interpolate along route with slight road curve
        const curLat = startLat + (targetLat - startLat) * progress + Math.sin(progress * Math.PI) * 0.002;
        const curLng = startLng + (targetLng - startLng) * progress;

        const dy = targetLat - startLat;
        const dx = targetLng - startLng;
        const angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        const speed = 32 + Math.round(Math.sin(step) * 8); // 24 to 40 km/h

        broadcastLocation(curLat, curLng, angle, speed);
      }, 1000);
    },
    [broadcastLocation]
  );

  const stopSimulatedGpsDrive = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setIsSimulatingGps(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDeviceGps();
      stopSimulatedGpsDrive();
    };
  }, [stopDeviceGps, stopSimulatedGpsDrive]);

  return {
    isConnected,
    latencyMs,
    packetsCount,
    liveTelemetry,
    isDeviceGpsActive,
    isSimulatingGps,
    gpsError,
    startDeviceGps,
    stopDeviceGps,
    startSimulatedGpsDrive,
    stopSimulatedGpsDrive,
    broadcastLocation,
    sendMessage,
  };
}
