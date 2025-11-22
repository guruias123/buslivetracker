import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

// Remove MaterialIcons completely and use only emoji fallbacks
const MaterialIconComponent = null;

type LatLng = { latitude: number; longitude: number };
type Stop = { name: string; coords: LatLng; order: number };
type BusInfo = { id: string; label: string; coords: LatLng; status: string; lastUpdated: number; pinColor?: string | number };

interface TimelineListViewProps {
  stops: Stop[];
  buses: Record<string, BusInfo>;
  onClose: () => void;
  currentLocation?: LatLng | null;
  nextStop?: Stop | null;
  eta?: string | null;
  progress?: number;
  onGoToUserLocation?: () => void;
}

export default function TimelineListView({ stops, buses, onClose, currentLocation, nextStop, eta, progress, onGoToUserLocation }: TimelineListViewProps) {
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

  // Helper: Estimate ETA (simple, based on distance and avg speed)
  function estimateEta(from: LatLng, to: LatLng) {
    const dist = haversine(from, to); // meters
    const avgSpeed = 30 * 1000 / 3600; // 30 km/h in m/s
    const seconds = dist / avgSpeed;
    if (seconds < 60) return `${Math.round(seconds)} sec`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    return `${Math.round(seconds / 3600)} hr`;
  }

  // Find closest stop index to currentLocation
  let closestIdx = 0;
  if (currentLocation) {
    let minDist = Infinity;
    stops.forEach((stop, idx) => {
      const dist = haversine(currentLocation, stop.coords);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tracking Timeline</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
      {/* Next stop, ETA, and progress bar */}
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.sectionTitle}>Next Stop: {nextStop ? nextStop.name : 'N/A'}</Text>
        <Text style={styles.etaText}>ETA: {eta || 'N/A'}</Text>
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, { width: `${Math.round((progress ?? 0) * 100)}%` }]} />
          <Text style={styles.progressText}>{Math.round((progress ?? 0) * 100)}%</Text>
        </View>
      </View>
      <ScrollView style={styles.timelineScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.timelineCol}>
          {stops.map((stop: Stop, idx: number) => {
            let eta = '';
            if (currentLocation) {
              eta = estimateEta(currentLocation, stop.coords);
            }
            const isCompleted = idx < closestIdx;
            const isCurrent = idx === closestIdx;
            return (
              <View key={stop.name} style={styles.timelineItemV}>
                <View style={styles.iconWrapV}>
                  {/* Custom styled circular icons */}
                  {isCompleted ? (
                    <View style={[styles.circleIcon, { backgroundColor: '#4CAF50' }]}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                  ) : isCurrent ? (
                    <View style={[styles.circleIcon, { backgroundColor: '#1976D2' }]}>
                      <View style={styles.innerDot} />
                    </View>
                  ) : (
                    <View style={[styles.circleIcon, { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#BDBDBD' }]} />
                  )}
                </View>
                <View style={styles.textWrapV}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.etaText}>{eta ? `ETA: ${eta}` : ''}</Text>
                </View>
                {/* Vertical connector except last */}
                {idx < stops.length - 1 && <View style={styles.connectorV} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
      {/* Floating current location button for user mode */}
      {onGoToUserLocation && (
        <TouchableOpacity
          style={styles.locationBtn}
          onPress={onGoToUserLocation}
        >
          {/* Custom location icon */}
          <View style={styles.locationIcon}>
            <Text style={styles.locationText}>📍</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1976D2', marginBottom: 4 },
  progressBarWrap: { height: 18, backgroundColor: '#e3eaf2', borderRadius: 10, overflow: 'hidden', marginTop: 4, marginBottom: 4, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cfd8dc' },
  progressBar: { height: 18, backgroundColor: '#43cea2', borderRadius: 10 },
  progressText: { fontSize: 12, color: '#1976D2', fontWeight: 'bold', marginLeft: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1976D2' },
  closeBtn: { backgroundColor: '#F44336', padding: 8, borderRadius: 6 },
  closeText: { color: '#fff', fontWeight: 'bold' },
  timelineScroll: { flexGrow: 0, paddingVertical: 12 },
  timelineCol: { flexDirection: 'column', alignItems: 'center', paddingVertical: 8 },
  timelineItemV: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 48, marginVertical: 8, position: 'relative' },
  iconWrapV: { marginRight: 12, marginTop: 2, alignItems: 'center', justifyContent: 'center', height: 36 },
  textWrapV: { flex: 1 },
  stopName: { fontSize: 15, fontWeight: 'bold', color: '#212121', textAlign: 'left' },
  etaText: { fontSize: 13, color: '#1976D2', marginTop: 2, textAlign: 'left' },
  connectorV: { position: 'absolute', left: 15, top: 40, width: 4, height: 30, backgroundColor: '#BDBDBD', zIndex: -1, borderRadius: 2 },
  // New custom icon styles
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  checkMark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  locationIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 20,
  },
  locationBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e3eaf2',
    zIndex: 99
  }
});
