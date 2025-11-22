// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 20,
    paddingBottom: 12,
    backgroundColor: '#1976D2',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 64,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: '#1565C0',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: 400,
    justifyContent: 'flex-end',
    // gap removed, not supported in RN
  },
  startBtn: {
    backgroundColor: '#43cea2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginRight: 4,
    shadowColor: '#43cea2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
    minWidth: 90,
  },
  stopBtn: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginLeft: 4,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
    minWidth: 90,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  map: {
    flex: 1,
    minHeight: 320,
    borderRadius: 18,
    margin: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e3eaf2',
  },
  stopMarker: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#1976D2',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
    minHeight: 28,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  stopMarkerText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  busMarker: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#43cea2',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
    shadowColor: '#43cea2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  busMarkerText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottom: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 8,
    marginTop: -10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1976D2',
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  progressBarWrap: {
    height: 22,
    backgroundColor: '#e3eaf2',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cfd8dc',
  },
  progressBar: {
    height: 22,
    backgroundColor: '#43cea2', // fallback to solid color, gradient not supported in RN StyleSheet
    borderRadius: 12,
  },
  progressText: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  stopsList: {
    maxHeight: 140,
    marginBottom: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f4f7fa',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  stopName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976D2',
    letterSpacing: 0.2,
  },
  busName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#43cea2',
    letterSpacing: 0.2,
  },
  small: {
    fontSize: 13,
    color: '#757575',
  },
  noBus: {
    fontSize: 15,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 10,
  },
});
// App.tsx — REST RTDB + OSRM routed polyline + driver-hidden-local-bus behavior
import React, { useEffect, useRef, useState } from "react";
import TimelineListView from "./TimelineListView";
import RoutesPage from "./RoutesPage";
import BusesPage from "./BusesPage";
import Geolocation from '@react-native-community/geolocation';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ScrollView,
  StatusBar,
} from "react-native";
import MapView, { Marker, Polyline, Region, UrlTile } from "react-native-maps";

type LatLng = { latitude: number; longitude: number };
type Stop = { name: string; coords: LatLng; order: number };
type BusInfo = { id: string; label: string; coords: LatLng; status: string; lastUpdated: number; pinColor?: string | number };

// ============ CONFIG ============
const DB_URL = "https://livebustracker-b4094-default-rtdb.firebaseio.com"; // your RTDB base URL (no trailing .json)
const TRIP_ID = "tirupati_route";
// If true, this device will automatically start driving (simulated) on app load.
const AUTO_START_DRIVER = false; // change to true if you want immediate auto-start
// OSRM endpoint - public demo (rate-limited). Self-host for production.
const OSRM_ENDPOINT = "https://router.project-osrm.org";

// Single custom route only
const ROUTES: { name: string; stops: Stop[] }[] = [
  {
    name: "Custom Route",
    stops: [
      { name: "First Stop", coords: { latitude: 13.536249571017056, longitude: 79.30546333953458 }, order: 0 },
      { name: "Second Stop", coords: { latitude: 13.545327924387143, longitude: 79.30531765820187 }, order: 1 },
    ],
  },
];

// helper
function lerp(a: LatLng, b: LatLng, t: number): LatLng {
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  };
}

// bus id is unique per device
const BUS_ID = `bus_${Math.floor(Math.random() * 10000)}`;
const BUS_LABEL = `Driver ${BUS_ID}`;

// REST helpers
async function rtdbGet(path: string) {
  const url = `${DB_URL}${path}.json`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}
async function rtdbPut(path: string, value: any) {
  const url = `${DB_URL}${path}.json`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`);
  return res.json();
}
async function rtdbPatch(path: string, value: any) {
  const url = `${DB_URL}${path}.json`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`PATCH ${url} failed: ${res.status}`);
  return res.json();
}
// delete node (set null)
async function rtdbDelete(path: string) {
  const url = `${DB_URL}${path}.json`;
  const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(null) });
  if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.status}`);
  return res.json();
}

// OSRM route fetch
async function osrmRouteForStops(stops: Stop[]) {
  // OSRM expects lon,lat pairs separated by ';'
  const coords = stops.map((s) => `${s.coords.longitude},${s.coords.latitude}`).join(";");
  const url = `${OSRM_ENDPOINT}/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM route failed: ${res.status}`);
  const json = await res.json();
  if (!json.routes || !json.routes[0] || !json.routes[0].geometry) throw new Error("No route geometry returned");
  // geometry.coordinates is [lon,lat] pairs
  const coordsLonLat: [number, number][] = json.routes[0].geometry.coordinates;
  return coordsLonLat.map(([lon, lat]) => ({ latitude: lat, longitude: lon } as LatLng));
}

// ============ APP ============
export default function App(): React.ReactElement {
  // ...existing code...
  const [showTimeline, setShowTimeline] = useState<boolean>(false);
  const [page, setPage] = useState<'mode' | 'routes' | 'buses' | 'main'>('mode');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  // Use selected route's stops (after selectedRoute is defined)
  const ROUTE_STOPS: Stop[] = React.useMemo(() => {
    const routeObj = ROUTES.find(r => r.name === selectedRoute);
    return routeObj ? routeObj.stops : ROUTES[0].stops;
  }, [selectedRoute]);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  // For driver: track real device location
  const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  // ...existing code...
  // ...existing code...
  // top-level hooks (stable order)
  const [buses, setBuses] = useState<Record<string, BusInfo>>({});
  const [isDriving, setIsDriving] = useState<boolean>(AUTO_START_DRIVER);
  const [tripLoaded, setTripLoaded] = useState<boolean>(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [routeCoords, setRouteCoords] = useState<LatLng[] | null>(null);
  const [routeLoading, setRouteLoading] = useState<boolean>(true);
  const [routeIsFallback, setRouteIsFallback] = useState<boolean>(false);
  const [localIsDriver, setLocalIsDriver] = useState<boolean>(AUTO_START_DRIVER);
  const [mode, setMode] = useState<'driver' | 'user' | null>(null); // null = not selected
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null); // for user mode
  const [eta, setEta] = useState<string | null>(null); // ETA for next stop
  const [nextStop, setNextStop] = useState<Stop | null>(null); // Next stop for selected bus/driver
  const [progress, setProgress] = useState<number>(0); // Progress along route (0-1)
  const mapRef = useRef<MapView | null>(null);
  const pollRef = useRef<number | null>(null);
  const writeTimerRef = useRef<number | null>(null);
  const simIndexRef = useRef<number>(0);
  // Track user location in user mode (must be after 'mode' declaration)
  useEffect(() => {
    let watchId: number | null = null;
    if (mode === 'user') {
      watchId = Geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ latitude, longitude });
        },
        (err) => {
          // ignore errors
        },
        { enableHighAccuracy: true, distanceFilter: 5, interval: 1000, fastestInterval: 1000 }
      ) as unknown as number;
    }
    return () => {
      if (watchId !== null) Geolocation.clearWatch(watchId);
    };
  }, [mode]);
  // Initial region: center on driver's location if available, else first stop
  const initialRegion: Region = driverLocation
    ? {
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : {
        latitude: ROUTE_STOPS[0].coords.latitude,
        longitude: ROUTE_STOPS[0].coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
  // Helper: Haversine distance (meters)
  function haversine(a: LatLng, b: LatLng) {
    const R = 6371000;
    const dLat = (b.latitude - a.latitude) * Math.PI / 180;
    const dLon = (b.longitude - a.longitude) * Math.PI / 180;
    const lat1 = a.latitude * Math.PI / 180;
    const lat2 = b.latitude * Math.PI / 180;
    const x = dLat / 2;
    const y = dLon / 2;
    const a2 = Math.sin(x) * Math.sin(x) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(y) * Math.sin(y);
    return 2 * R * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));
  }

  // Helper: Find next stop and progress for a given location
  function getNextStopAndProgress(location: LatLng) {
    let closestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < ROUTE_STOPS.length; i++) {
      const dist = haversine(location, ROUTE_STOPS[i].coords);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    }
    // Next stop is next in order, unless at last
    const nextIdx = Math.min(closestIdx + 1, ROUTE_STOPS.length - 1);
    const next = ROUTE_STOPS[nextIdx];
    // Progress: fraction of stops completed
    const progress = closestIdx / (ROUTE_STOPS.length - 1);
    return { next, progress, closestIdx };
  }

  // Helper: Estimate ETA (simple, based on distance and avg speed)
  function estimateEta(from: LatLng, to: LatLng) {
    const dist = haversine(from, to); // meters
    const avgSpeed = 30 * 1000 / 3600; // 30 km/h in m/s
    const seconds = dist / avgSpeed;
    if (seconds < 60) return `${Math.round(seconds)} sec`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    return `${Math.round(seconds / 3600)} hr`;
  }
  // Update ETA, next stop, and progress for driver/user
  useEffect(() => {
    let location: LatLng | null = null;
    if (mode === 'driver' && localIsDriver && driverLocation) {
      location = driverLocation;
    } else if (mode === 'user' && selectedBusId && buses[selectedBusId]) {
      location = buses[selectedBusId].coords;
    }
    if (location) {
      const { next, progress: prog } = getNextStopAndProgress(location);
      setNextStop(next);
      setProgress(prog);
      setEta(estimateEta(location, next.coords));
    } else {
      setNextStop(null);
      setProgress(0);
      setEta(null);
    }
  }, [mode, localIsDriver, driverLocation, selectedBusId, buses]);

  // get runtime permission on Android
  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        try {
          const res = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
          const ok =
            res["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED &&
            res["android.permission.ACCESS_COARSE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED;
          setHasLocationPermission(ok);
        } catch (e) {
          console.warn("Permission error:", e);
          setHasLocationPermission(false);
        }
      } else {
        setHasLocationPermission(true);
      }
    })();
  }, []);

  // fetch OSRM route once on mount (unconditionally)
  useEffect(() => {
    let mounted = true;
    setRouteLoading(true);
    setRouteIsFallback(false);
    (async () => {
      try {
        const rc = await osrmRouteForStops(ROUTE_STOPS);
        if (mounted) {
          setRouteCoords(rc);
          setRouteLoading(false);
          setRouteIsFallback(false);
          console.log("OSRM route points:", rc.length);
        }
      } catch (e) {
        console.warn("OSRM route fetch failed:", e);
        // fallback: build simple interpolated path from stops (still better than single-line edges)
        const fallback: LatLng[] = [];
        for (let i = 0; i < ROUTE_STOPS.length - 1; i++) {
          const a = ROUTE_STOPS[i].coords;
          const b = ROUTE_STOPS[i + 1].coords;
          const steps = 25;
          for (let s = 0; s < steps; s++) {
            fallback.push(lerp(a, b, s / steps));
          }
        }
        if (mounted) {
          setRouteCoords(fallback);
          setRouteLoading(false);
          setRouteIsFallback(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // create trip metadata (REST) - idempotent
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const path = `/trips/${TRIP_ID}`;
        const snap = await rtdbGet(path);
        if (!snap) {
          await rtdbPut(path, {
            routeName: "Chandragiri → Tirupati",
            stops: ROUTE_STOPS.map((s) => ({ name: s.name, lat: s.coords.latitude, lon: s.coords.longitude, order: s.order })),
            createdAt: Date.now(),
          });
          if (mounted) console.log("Trip metadata created (REST).");
        } else {
          if (mounted) console.log("Trip metadata exists.");
        }
      } catch (e) {
        console.warn("Trip metadata REST error:", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Poll DB for buses every 1s (REST GET)
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const path = `/trips/${TRIP_ID}/buses`;
        const val = await rtdbGet(path);
        const normalized: Record<string, BusInfo> = {};
        if (val) {
          Object.keys(val).forEach((k) => {
            const b = val[k] || {};
            const lat = Number(b?.coords?.lat);
            const lon = Number(b?.coords?.lon);
            // For current device in driver mode, always use driverLocation if available
            let coords;
            if (mode === 'driver' && localIsDriver && k === BUS_ID && driverLocation) {
              coords = driverLocation;
            } else {
              coords = Number.isFinite(lat) && Number.isFinite(lon) ? { latitude: lat, longitude: lon } : ROUTE_STOPS[0].coords;
            }
            normalized[k] = {
              id: b?.id ?? k,
              label: b?.label ?? `Bus ${k}`,
              coords,
              status: b?.status ?? "unknown",
              lastUpdated: b?.lastUpdated ?? 0,
              pinColor: b?.pinColor,
            };
          });
        }
        if (active) {
          setBuses(normalized);
          setTripLoaded(true);
        }
      } catch (e) {
        // ignore transient network issues silently
      }
    };
    poll();
    pollRef.current = setInterval(poll, 1000) as unknown as number;
    return () => {
      active = false;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, []);

  // Driver simulation: write positions to DB using REST every 1s but hide local marker if localIsDriver
  useEffect(() => {
    // Clean up previous writer
    if (writeTimerRef.current) {
      clearInterval(writeTimerRef.current);
      writeTimerRef.current = null;
    }
    if (!isDriving || mode !== 'driver') return;

    // Start real device location tracking
    const watchId = Geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setDriverLocation({ latitude, longitude });
        // Write to DB
        const path = `/trips/${TRIP_ID}/buses/${BUS_ID}`;
        await rtdbPut(path, {
          id: BUS_ID,
          label: BUS_LABEL,
          coords: { lat: latitude, lon: longitude },
          status: "in_transit",
          lastUpdated: Date.now(),
        });
      },
      (err) => {
        console.warn('Geolocation error:', err);
      },
      { enableHighAccuracy: true, distanceFilter: 5, interval: 1000, fastestInterval: 1000 }
    );

    return () => {
      Geolocation.clearWatch(watchId);
      if (writeTimerRef.current) clearInterval(writeTimerRef.current);
      writeTimerRef.current = null;
    };
  }, [isDriving, mode]);

  // Only center map when page changes to 'main' or when a bus is selected, not on every bus poll
  useEffect(() => {
    if (!mapRef.current || !mapReady || page !== 'main') return;
    // In user mode, center on selected bus only when selectedBusId changes
    if (mode === 'user' && selectedBusId && buses[selectedBusId]) {
      const bus = buses[selectedBusId];
      const region: Region = {
        latitude: bus.coords.latitude,
        longitude: bus.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setTimeout(() => {
        try {
          mapRef.current?.animateToRegion(region, 800);
        } catch (e) {}
      }, 500);
      return;
    }
    // In driver mode, center on own bus only when page changes to main
    if (mode === 'driver' && localIsDriver && buses[BUS_ID]) {
      const bus = buses[BUS_ID];
      const region: Region = {
        latitude: bus.coords.latitude,
        longitude: bus.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setTimeout(() => {
        try {
          mapRef.current?.animateToRegion(region, 800);
        } catch (e) {}
      }, 500);
      return;
    }
    // Default: center on first bus only when page changes to main
    const first = Object.values(buses)[0];
    if (!first) return;
    const region: Region = {
      latitude: first.coords.latitude,
      longitude: first.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setTimeout(() => {
      try {
        mapRef.current?.animateToRegion(region, 800);
      } catch (e) {}
    }, 500);
  }, [mapReady, page, selectedBusId, mode, localIsDriver]);

  // Start driving: mark localIsDriver (so local device hides its own marker) and start simulation writing
  const startDriving = async () => {
    try {
      setLocalIsDriver(true);
      setIsDriving(true);
      Alert.alert("Trip started", "Other devices will now see the bus live.");
    } catch (e) {
      console.error("Start Trip REST error:", e);
      Alert.alert("Error starting trip", String(e));
    }
  };

  // Stop driving: mark stopped and remove DB entry (so other devices will not see it)
  const stopDriving = async () => {
    try {
      const path = `/trips/${TRIP_ID}/buses/${BUS_ID}`;
      // remove bus from DB (so active count reduces)
      await rtdbDelete(path);
      setIsDriving(false);
      setLocalIsDriver(false);
      Alert.alert("Trip stopped", "Bus removed from live list.");
    } catch (e) {
      console.warn("stop REST error:", e);
    }
  };

  // render helpers
  const renderBusList = () => {
    const arr = Object.values(buses).sort((a, b) => b.lastUpdated - a.lastUpdated);
    if (arr.length === 0) return <Text style={styles.noBus}>No live cars yet.</Text>;
    // In user mode, allow selecting a bus to track
    if (mode === 'user') {
      return arr.map((b) => (
        <TouchableOpacity key={b.id} style={styles.listRow} onPress={() => setSelectedBusId(b.id)}>
          <Text style={styles.busName}>• {b.label}</Text>
          <Text style={styles.subText}>{b.coords.latitude.toFixed(5)}, {b.coords.longitude.toFixed(5)}</Text>
          <Text style={styles.small}>Status: {b.status} • {Math.round((Date.now() - b.lastUpdated) / 1000)}s ago</Text>
          {selectedBusId === b.id && <Text style={[styles.small, { color: '#1976D2' }]}>Tracking this bus</Text>}
        </TouchableOpacity>
      ));
    }
    // In driver mode, just show info
    return arr.map((b) => (
      <View key={b.id} style={styles.listRow}>
        <Text style={styles.busName}>• {b.label}</Text>
        <Text style={styles.subText}>{b.coords.latitude.toFixed(5)}, {b.coords.longitude.toFixed(5)}</Text>
        <Text style={styles.small}>Status: {b.status} • {Math.round((Date.now() - b.lastUpdated) / 1000)}s ago</Text>
      </View>
    ));
  };

  // Decide polyline coords: use routeCoords if available else stops
  // Always use OSRM route if available
  const polylineCoords = routeCoords && routeCoords.length > 0 ? routeCoords : ROUTE_STOPS.map((s) => s.coords);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      {/* Mode selector screen */}
      {page === 'mode' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24 }}>Select Mode</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => setPage('routes')}>
            <Text style={styles.btnText}>Driver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#1976D2', marginTop: 16 }]} onPress={() => { setMode('user'); setPage('main'); }}>
            <Text style={styles.btnText}>User</Text>
          </TouchableOpacity>
        </View>
      )}

      {page === 'routes' && (
          <RoutesPage 
            routes={ROUTES}
            onSelectRoute={(routeName: string) => {
              setSelectedRoute(routeName);
              setPage('buses');
            }} 
          />
      )}

      {page === 'buses' && (
        <BusesPage 
          buses={Object.values(buses).map(b => ({ id: b.id, label: b.label, route: selectedRoute ?? undefined }))}
          route={selectedRoute ?? undefined}
          onSelectBus={(bus: any) => {
            setSelectedBus(bus);
            setSelectedBusId(bus.id);
            setMode('driver');
            setPage('main');
          }}
        />
      )}
      {page === 'main' && mode !== null && (
        // USER MODE: show active buses page if no bus selected
        mode === 'user' && !selectedBusId ? (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.topBar}>
              <Text style={styles.title}>Active Buses</Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.stopBtn, { backgroundColor: '#757575' }]} onPress={() => {
                  setMode(null);
                  setSelectedBusId(null);
                  setSelectedBus(null);
                  setPage('mode');
                }}>
                  <Text style={styles.btnText}>Change Mode</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottom}>
              <Text style={styles.sectionTitle}>🚌 Active Buses ({Object.keys(buses).length})</Text>
              <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                {renderBusList()}
              </ScrollView>
            </View>
          </View>
        ) : (
          // USER MODE: after bus selected, show full screen map at top, buttons below
          <React.Fragment>
            <View style={styles.topBar}>
              <Text style={styles.title}>Tracking Bus</Text>
            </View>
            {/* Driver action buttons below header */}
            {mode === 'driver' && (
              <View style={[styles.buttons, { marginHorizontal: 20, marginTop: 12, marginBottom: 4, flexWrap: 'wrap' }]}> 
                {!isDriving ? (
                  <TouchableOpacity style={styles.startBtn} onPress={startDriving}>
                    <Text style={styles.btnText}>Start Trip</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.stopBtn} onPress={stopDriving}>
                    <Text style={styles.btnText}>Stop Trip</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.stopBtn, { marginLeft: 8, backgroundColor: '#757575' }]} onPress={() => {
                  setMode(null);
                  setSelectedBusId(null);
                  setSelectedBus(null);
                  setPage('mode');
                }}>
                  <Text style={styles.btnText}>Change Mode</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={[styles.buttons, { marginHorizontal: 20, marginTop: mode === 'driver' ? 0 : 12, marginBottom: 4, flexWrap: 'wrap' }]}> 
              <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#1976D2', marginRight: 8 }]} onPress={() => setShowTimeline((v) => !v)}>
                <Text style={styles.btnText}>{showTimeline ? 'Hide Timeline' : 'Show Timeline'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.startBtn} onPress={() => setSelectedBusId(null)}>
                <Text style={styles.btnText}>Change Bus</Text>
              </TouchableOpacity>
            </View>
            {showTimeline ? (
              <TimelineListView
                stops={ROUTE_STOPS}
                buses={buses}
                onClose={() => setShowTimeline(false)}
                currentLocation={userLocation}
                nextStop={nextStop}
                eta={eta}
                progress={progress}
                onGoToUserLocation={() => {
                  if (userLocation && mapRef.current) {
                    mapRef.current.animateToRegion({
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }, 600);
                  }
                }}
              />
            ) : (
              <React.Fragment>
                <MapView
                  ref={(r) => { mapRef.current = r; }}
                  style={styles.map}
                  initialRegion={initialRegion}
                  mapType="standard"
                  onMapReady={() => setMapReady(true)}
                >
                  <UrlTile urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />
                  {routeLoading && (
                    <View style={{ position: 'absolute', top: 20, left: 0, right: 0, alignItems: 'center', zIndex: 99 }}>
                      <Text style={{ backgroundColor: '#fff', padding: 8, borderRadius: 8, color: '#1976D2', fontWeight: 'bold' }}>Loading route...</Text>
                    </View>
                  )}
                  {/* Show only the remaining route as blue line for driver, erase traveled portion */}
                  {mode === 'driver' && isDriving && driverLocation ? (
                    (() => {
                      // Find closest point on polyline to driverLocation
                      let closestIdx = 0;
                      let minDist = Infinity;
                      for (let i = 0; i < polylineCoords.length; i++) {
                        const dist = haversine(driverLocation, polylineCoords[i]);
                        if (dist < minDist) {
                          minDist = dist;
                          closestIdx = i;
                        }
                      }
                      // Show only the remaining route from the next point onward
                      const remainingCoords = polylineCoords.slice(closestIdx + 1);
                      return remainingCoords.length > 1 ? (
                        <Polyline
                          coordinates={remainingCoords}
                          strokeWidth={5}
                          strokeColor={routeIsFallback ? '#757575' : '#2196F3'}
                          lineCap="round"
                          lineJoin="round"
                          {...(routeIsFallback ? { lineDashPattern: [10, 10] } : {})}
                        />
                      ) : null;
                    })()
                  ) : (
                    <Polyline
                      coordinates={polylineCoords}
                      strokeWidth={5}
                      strokeColor={routeIsFallback ? '#757575' : '#2196F3'}
                      lineCap="round"
                      lineJoin="round"
                      {...(routeIsFallback ? { lineDashPattern: [10, 10] } : {})}
                    />
                  )}
                  {ROUTE_STOPS.map((s) => (
                    <Marker key={s.name} coordinate={s.coords} title={s.name}>
                      <View style={styles.stopMarker}><Text style={styles.stopMarkerText}>{s.order + 1}</Text></View>
                    </Marker>
                  ))}
                  {/* Always show driver marker for current device in driver mode if location available */}
                  {mode === 'driver' && driverLocation && (
                    <Marker coordinate={driverLocation} title="You (Driver)">
                      <View style={[styles.busMarker, { borderColor: '#43cea2' }]}><Text style={styles.busMarkerText}>🧑‍✈️</Text></View>
                    </Marker>
                  )}
                  {/* Show selected bus marker for user mode */}
                  {mode === 'user' && selectedBusId && buses[selectedBusId] && (
                    <Marker coordinate={buses[selectedBusId].coords} title={buses[selectedBusId].label}>
                      <View style={styles.busMarker}><Text style={styles.busMarkerText}>🚌</Text></View>
                    </Marker>
                  )}
                  {/* Show user marker in user mode */}
                  {mode === 'user' && userLocation && (
                    <Marker coordinate={userLocation} title="You (User)">
                      <View style={[styles.busMarker, { borderColor: '#1976D2' }]}><Text style={styles.busMarkerText}>🧑</Text></View>
                    </Marker>
                  )}
                </MapView>
                {/* Removed route stops, next stop, ETA, and progress from main page */}
              </React.Fragment>
            )}
          </React.Fragment>
        )
      )}
    </SafeAreaView>
  );
}
