import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type Route = { name: string; stops: any[] };
type Props = {
  routes: Route[];
  onSelectRoute: (routeName: string) => void;
};

export default function RoutesPage({ routes, onSelectRoute }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Route</Text>
      <ScrollView>
        {routes.map((route) => (
          <TouchableOpacity key={route.name} style={styles.routeBtn} onPress={() => onSelectRoute(route.name)}>
            <Text style={styles.routeText}>{route.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  routeBtn: { backgroundColor: '#2196F3', padding: 16, borderRadius: 8, marginBottom: 12 },
  routeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
