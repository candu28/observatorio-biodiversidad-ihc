import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Plus, Map } from 'lucide-react-native';
import { router } from 'expo-router';

export function BottomNav() {
  return (
    <View style={styles.bottomNavWrapper}>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.navigate('/')}>
          <Home size={24} color="#4b5563" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.navigate('/avistamiento')}>
          <Plus size={24} color="#4b5563" />
          <Text style={styles.navText}>Avistamiento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Map size={24} color="#4b5563" />
          <Text style={styles.navText}>Mapa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 12,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
});
