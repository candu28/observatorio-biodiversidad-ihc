import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Home, Map, Plus, Sparkles, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { PerfilViewModel } from '../../../../application/useCases/ObtenerPerfilUseCase';

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

function ExpertRow({ title, subtitle, points, imageUrl }: { title: string; subtitle: string; points: number; imageUrl: string }) {
  return (
    <View style={styles.expertRow}>
      <Image source={{ uri: imageUrl }} style={styles.expertThumb} />
      <View style={styles.expertText}>
        <Text style={styles.expertTitle}>{title}</Text>
        <Text style={styles.expertSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.expertPoints}>
        <Star size={14} color="#9c6b1f" fill="#9c6b1f" />
        <Text style={styles.expertPointsText}>{points}</Text>
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
  profile: PerfilViewModel;
};

export default function ProfileScreen({ profile }: ProfileScreenProps) {

  return (
    <LinearGradient colors={['#f7f0df', '#f4ecd7', '#f7f0df']} style={styles.container}>
      <View style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#6b5b3e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.personalizeButton} onPress={() => {}}>
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

            <View style={styles.levelPill}>
              <Sparkles size={14} color="#5b7d2a" />
              <Text style={styles.levelText}>{profile.nivel}</Text>
            </View>

            <View style={styles.statsRow}>
              <StatCard value={String(profile.usuario.totalAvistamientos)} label="Avistamientos" />
              <StatCard value={String(profile.puntos)} label="Puntos" />
            </View>
          </View>

          <SectionHeader title="Avistamientos" />
          <View style={styles.sightsGrid}>
            {profile.avistamientos.map(item => (
              <SightCard
                key={item.id}
                title={item.titulo}
                subtitle={item.subtitulo}
                imageUrl={item.imagenUrl}
              />
            ))}
          </View>

          <SectionHeader title="Experto en" />
          <View style={styles.expertsList}>
            {profile.expertos.map(item => (
              <ExpertRow
                key={item.id}
                title={item.titulo}
                subtitle={item.subtitulo}
                points={item.puntos}
                imageUrl={item.imagenUrl}
              />
            ))}
          </View>

          <SectionHeader title="Participa en" />
          <View style={styles.participationList}>
            {profile.participaciones.map(item => (
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
    </LinearGradient>
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
  levelPill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e7f0d8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bfd090',
  },
  levelText: {
    color: '#4f6e1f',
    fontSize: 13,
    fontWeight: '700',
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
  expertsList: {
    gap: 10,
  },
  expertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffaf1',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#efe1bf',
  },
  expertThumb: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 10,
  },
  expertText: {
    flex: 1,
  },
  expertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2f2417',
  },
  expertSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#8a7652',
  },
  expertPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expertPointsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9c6b1f',
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
});