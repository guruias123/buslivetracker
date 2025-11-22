import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export type BusOption = { id: string; label: string; route?: string };

type Props = {
  buses: BusOption[];
  route?: string;
  onSelectBus: (bus: BusOption) => void;
};

export default function BusesPage({ buses, route, onSelectBus }: Props) {
  // Filter buses by route if route is provided
  const filteredBuses = route ? buses.filter((bus) => bus.route === route) : buses;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Bus</Text>
      <ScrollView>
        {filteredBuses.length === 0 ? (
          <Text style={{ color: '#757575', fontSize: 16, marginTop: 20 }}>No buses available for this route.</Text>
        ) : (
          filteredBuses.map((bus) => (
            <TouchableOpacity key={bus.id} style={styles.busBtn} onPress={() => onSelectBus(bus)}>
              <Text style={styles.busText}>{bus.label}{bus.route ? ` (${bus.route})` : ''}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  busBtn: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, marginBottom: 12 },
  busText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
