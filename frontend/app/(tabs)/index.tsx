import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf-outline" size={24} color="#155d65" />
          <Text style={styles.logoText}>guaya</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#155d65" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
            <Text style={[styles.filterText, styles.filterTextActive]}>Todo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Biomas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Avistamientos</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Content Area Placeholder */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            [ Espacio para TarjetaAvistamiento ]
          </Text>
          <Text style={styles.placeholderSubtext}>
            Aquí irán los componentes de tarjetas cuando el equipo los desarrolle.
          </Text>
        </View>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            [ Espacio para TarjetaAvistamiento ]
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAFBF7', // Fondo verde menta claro
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#155d65',
    marginLeft: 5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#ccc',
  },
  filtersContainer: {
    paddingBottom: 15,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#388B92', 
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#155d65',
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  placeholderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  placeholderText: {
    color: '#155d65',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  placeholderSubtext: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  }
});
