import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Leaf, Search, MessageCircle, Heart, Home, Plus, Map, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mocks basados en la estructura IAvistamiento / ISugerenciaEspecie
const MOCK_AVISTAMIENTOS_LEFT = [
  {
    id: '1',
    fotoUrl: 'https://images.unsplash.com/photo-1596700813959-1e359a39e830?q=80&w=600&auto=format&fit=crop', // Rana dardo amarillo
    estado: 'Verificada',
    height: 250,
  },
  {
    id: '2',
    fotoUrl: 'https://images.unsplash.com/photo-1550508682-1c605cc947b1?q=80&w=600&auto=format&fit=crop', // Plumas de guacamaya / pájaro
    estado: 'Verificando',
    height: 180,
  },
  {
    id: '3',
    fotoUrl: 'https://images.unsplash.com/photo-1518554203487-172e2cfc2ff3?q=80&w=600&auto=format&fit=crop', // Rana dorada
    estado: 'Verificada',
    height: 200,
  },
];

const MOCK_AVISTAMIENTOS_RIGHT = [
  {
    id: '4',
    fotoUrl: 'https://images.unsplash.com/photo-1629813295847-a8a474c3eb7d?q=80&w=600&auto=format&fit=crop', // Mono araguato / aullador
    estado: 'Verificada',
    height: 180,
  },
  {
    id: '5',
    fotoUrl: 'https://images.unsplash.com/photo-1582200780216-43b67484dfbc?q=80&w=600&auto=format&fit=crop', // Flor tropical / cayena
    estado: 'Verificando',
    height: 280,
  },
  {
    id: '6',
    fotoUrl: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=600&auto=format&fit=crop', // Selva
    estado: 'Verificado',
    height: 150,
  },
];

const MOCK_FILTERS = ['Todo', 'Especies', 'Proyectos'];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('Todo');

  const renderCard = (item: any) => (
    <View key={item.id} style={[styles.card, { height: item.height }]}>
      <Image source={{ uri: item.fotoUrl }} style={styles.cardImage} />
      
      {/* Top Overlay */}
      <View style={styles.cardOverlay}>
        <View style={styles.statusPill}>
          <CheckCircle2 size={12} color="#15803d" />
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
        <TouchableOpacity style={styles.heartButton}>
          <Heart size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#fdf7e3', '#fdf3d1', '#e8f3d6', '#e0ecd1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Leaf size={28} color="#4d7c0f" strokeWidth={2.5} />
            <Text style={styles.logoText}>guaya</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={20} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MessageCircle size={20} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/perfil')}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {MOCK_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Masonry Grid */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        >
          <View style={styles.masonryColumn}>
            {MOCK_AVISTAMIENTOS_LEFT.map(renderCard)}
          </View>
          <View style={styles.masonryColumn}>
            {MOCK_AVISTAMIENTOS_RIGHT.map(renderCard)}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavWrapper}>
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Home size={24} color="#4b5563" />
              <Text style={styles.navText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Plus size={24} color="#4b5563" />
              <Text style={styles.navText}>Avistamiento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Map size={24} color="#4b5563" />
              <Text style={styles.navText}>Mapa</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  filtersContainer: {
    marginVertical: 15,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  filterPillActive: {
    backgroundColor: '#4d7c0f',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 100, // Espacio para el bottom nav
  },
  masonryColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3, // Shadow for android
    shadowColor: '#000', // Shadow for ios
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  heartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    // Blur effect shadow
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
