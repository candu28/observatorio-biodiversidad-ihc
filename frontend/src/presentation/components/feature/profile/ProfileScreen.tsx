import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ChevronLeft, ChevronRight, Home, Map, Plus, Sparkles, Star, X } from 'lucide-react-native';
import { router } from 'expo-router';

const colorOptions = [
  { id: 'guaya', label: 'Guaya', color: '#7d7a2a' },
  { id: 'jade', label: 'Jade', color: '#1b7f5c' },
  { id: 'oceano', label: 'Océano', color: '#1f4f8b' },
  { id: 'violeta', label: 'Violeta', color: '#6b1f8f' },
  { id: 'coral', label: 'Coral', color: '#b2472a' },
  { id: 'rosa', label: 'Rosa', color: '#9a1f64' },
];

import { LinearGradientSvg } from '../../ui/LinearGradientSvg';

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionAction}>Mostrar todo</Text>
    </View>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SightCard({ title, subtitle, imageUrl }: { title: string; subtitle: string; imageUrl: string }) {
  return (
    <View style={styles.sightCard}>
      <Image source={{ uri: imageUrl }} style={styles.sightImage} />
      <View style={styles.sightOverlay}>
        <View style={styles.sightBadge}>
          <Sparkles size={12} color="#4d7c0f" />
        </View>
      </View>
      <View style={styles.sightCaption}>
        <Text style={styles.sightTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.sightSubtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
    </View>
  );
}

function ParticipationRow({ title, date, imageUrl }: { title: string; date: string; imageUrl: string }) {
  return (
    <View style={styles.participationRow}>
      <Image source={{ uri: imageUrl }} style={styles.participationThumb} />
      <View style={styles.participationText}>
        <Text style={styles.participationTitle}>{title}</Text>
        <Text style={styles.participationDate}>{date}</Text>
      </View>
      <ChevronRight size={18} color="#8c6b3e" />
    </View>
  );
}

type ProfileScreenProps = {
  profile: any;
};

export default function ProfileScreen({ profile }: ProfileScreenProps) {
  const [personalizeVisible, setPersonalizeVisible] = useState(false);

  return (
    <LinearGradientSvg colors={['#f7f0df', '#f4ecd7', '#f7f0df']} style={styles.container}>
      <View style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#6b5b3e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.personalizeButton} onPress={() => setPersonalizeVisible(true)}>
            <Sparkles size={14} color="#7b5c26" />
            <Text style={styles.personalizeText}>Personalizar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: profile.usuario.fotoPerfilUrl ?? '' }} style={styles.avatar} />
            </View>

            <Text style={styles.name}>{profile.usuario.nombre}</Text>
            <Text style={styles.subtitle}>{profile.usuario.ubicacion}</Text>
            <Text style={styles.bio}>{profile.usuario.bio}</Text>

            <View style={styles.statsRow}>
              <StatCard value={String(profile.usuario.totalAvistamientos)} label="Avistamientos" />
              <StatCard value={String(profile.puntos)} label="Puntos" />
            </View>
          </View>

          <SectionHeader title="Avistamientos" />
          <View style={styles.sightsGrid}>
            {profile.avistamientos.map((item: any) => (
              <SightCard
                key={item.id}
                title={item.titulo}
                subtitle={item.subtitulo}
                imageUrl={item.imagenUrl}
              />
            ))}
          </View>

          <SectionHeader title="Participa en" />
          <View style={styles.participationList}>
            {profile.participaciones.map((item: any) => (
              <ParticipationRow
                key={item.id}
                title={item.titulo}
                date={item.fecha}
                imageUrl={item.imagenUrl}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNavWrap}>
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.bottomNavItem}>
              <Home size={22} color="#7a6440" />
              <Text style={styles.bottomNavLabel}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomNavItem}>
              <Plus size={22} color="#7a6440" />
              <Text style={styles.bottomNavLabel}>Avistamiento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomNavItem}>
              <Map size={22} color="#7a6440" />
              <Text style={styles.bottomNavLabel}>Mapa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal visible={personalizeVisible} transparent animationType="fade" onRequestClose={() => setPersonalizeVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPersonalizeVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Personalizar interfaz</Text>
                <Text style={styles.modalSubtitle}>Elige un color de acento</Text>
              </View>

              <Pressable style={styles.modalCloseButton} onPress={() => setPersonalizeVisible(false)}>
                <X size={16} color="#7c6a4c" />
              </Pressable>
            </View>

            <View style={styles.colorGrid}>
              {colorOptions.map(option => (
                <Pressable key={option.id} style={styles.colorOption} onPress={() => {}}>
                  <View style={[styles.colorCircle, { backgroundColor: option.color }]}>
                    <View style={styles.colorInner} />
                  </View>
                  <Text style={styles.colorLabel}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradientSvg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
    marginTop:28,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff7e9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  personalizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 18,
    backgroundColor: '#fff7e9',
    borderWidth: 1,
    borderColor: '#ead8b3',
  },
  personalizeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b5425',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 12,
  },
  avatarWrapper: {
    width: 92,
    height: 92,
    borderRadius: 46,
    padding: 3,
    backgroundColor: '#fff7e9',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  name: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '800',
    color: '#342a1a',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    color: '#7d6a4e',
  },
  bio: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#8a7a5d',
    textAlign: 'center',
    paddingHorizontal: 14,
  },

  statsRow: {
    marginTop: 18,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  statCard: {
    alignItems: 'center',
    minWidth: 92,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#271f13',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#907a54',
  },
  sectionHeader: {
    marginTop: 22,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2f2417',
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#967646',
  },
  sightsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  sightCard: {
    flex: 1,
    height: 176,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 9,
    elevation: 2,
  },
  sightImage: {
    width: '100%',
    height: '100%',
  },
  sightOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  sightBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sightCaption: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
  },
  sightTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sightSubtitle: {
    marginTop: 2,
    color: '#f5f1e7',
    fontSize: 11,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  participationList: {
    gap: 10,
  },
  participationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffaf1',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#efe1bf',
  },
  participationThumb: {
    width: 42,
    height: 42,
    borderRadius: 14,
    marginRight: 10,
  },
  participationText: {
    flex: 1,
  },
  participationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2f2417',
  },
  participationDate: {
    marginTop: 3,
    fontSize: 12,
    color: '#8c7651',
  },
  bottomNavWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff7eb',
    borderRadius: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#eadbbd',
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: 3,
  },
  bottomNavLabel: {
    fontSize: 11,
    color: '#7a6440',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(44, 35, 18, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 28,
    backgroundColor: '#fffdf8',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#f0e3c4',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d2418',
  },
  modalSubtitle: {
    marginTop: 5,
    fontSize: 12,
    color: '#9a8968',
  },
  modalCloseButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f2ead9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  colorOption: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#efe2c5',
    backgroundColor: '#fffaf2',
  },
  colorCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  colorInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3c3122',
  },
});