import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, CheckCircle2, Mail, ThumbsUp, ThumbsDown, Binoculars, Award, Compass } from 'lucide-react-native';
import { LinearGradientSvg } from '../../src/presentation/components/ui/LinearGradientSvg';
import { BottomNav } from '../../src/presentation/components/ui/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SightingDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Mock data simulation based on the design
  const data = {
    id: id,
    categoria: 'ANFIBIOS',
    nombreComun: 'Sapo Minero',
    nombreCientifico: 'Dendrobates leucomelas',
    verificada: true,
    fotoUrl: 'https://images.unsplash.com/photo-1550977186-b484af8a264a?q=80&w=800&auto=format&fit=crop', // yellow dart frog
    observadorOriginal: {
      nombre: 'Delgadillo',
      tieneMensaje: true,
    },
    expertoTop: 'DrHerpeto',
    totalObservaciones: '1847',
    identificaciones: [
      {
        id: '1',
        usuario: 'Luis Ferrer',
        iniciales: 'LF',
        color: '#6366f1', // Indigo
        tiempo: 'hace 30min',
        isTop: true,
        comentario: 'Confirmado. Es el Dendrobates leucomelas, inconfundible por su patrón amarillo-negro. Especie endémica de la Guayana venezolana.',
        votosUp: 100,
        votosDown: 3,
      },
      {
        id: '2',
        usuario: 'Cambur',
        iniciales: 'CA',
        color: '#b45309', // Amber/Brown
        tiempo: 'hace 12h',
        isTop: false,
        comentario: 'Podría ser una especie hermana. El patrón de las bandas negras parece ligeramente diferente al leucomelas típico.',
        votosUp: 8,
        votosDown: 45,
      },
      {
        id: '3',
        usuario: 'DrHerpeto',
        iniciales: 'DH',
        color: '#15803d', // Green
        tiempo: 'hace 2d',
        isTop: true,
        comentario: 'Concuerdo con Luis. Las variaciones de bandas son comunes dentro de la misma especie dependiendo de la localidad.',
        votosUp: 45,
        votosDown: 0,
      },
    ],
  };

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4d7c0f" />
      </LinearGradientSvg>
    );
  }

  return (
    <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.categoryText}>{data.categoria}</Text>
            <Text style={styles.commonNameText}>{data.nombreComun}</Text>
            <Text style={styles.scientificNameText}>{data.nombreCientifico}</Text>
          </View>
          {data.verificada && (
            <View style={styles.verifiedBadge}>
              <CheckCircle2 size={12} color="#15803d" />
              <Text style={styles.verifiedText}>Verificada</Text>
            </View>
          )}
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Photo */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: data.fotoUrl }} style={styles.mainImage} />
          </View>

          {/* Info Cards Row */}
          <View style={styles.cardsRow}>
            {/* Observer Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Binoculars size={14} color="#927341" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>AVISTADO POR</Text>
              </View>
              <Text style={styles.cardValue}>{data.observadorOriginal.nombre}</Text>
              {data.observadorOriginal.tieneMensaje && (
                <TouchableOpacity style={styles.messageButton}>
                  <Mail size={12} color="#927341" />
                  <Text style={styles.messageText}>Mensaje</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Top Expert Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Award size={14} color="#7fa579" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>OBSERVADOR TOP</Text>
              </View>
              <Text style={styles.cardValue}>{data.expertoTop}</Text>
            </View>

            {/* Total Observations Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Compass size={14} color="#b58d52" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>TOTAL OBS.</Text>
              </View>
              <Text style={styles.cardValue}>{data.totalObservaciones}</Text>
            </View>
          </View>

          {/* Community ID Section */}
          <View style={styles.communitySection}>
            <View style={styles.communityHeader}>
              <View>
                <Text style={styles.sectionTitle}>Identificaciones de la Comunidad</Text>
                <Text style={styles.sectionSubtitle}>{data.identificaciones.length} identificaciones acumuladas</Text>
              </View>
              <View style={styles.dotsIndicator}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={[styles.dot, styles.dotActive]} />
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>

            {/* Comments List */}
            {data.identificaciones.map((item, index) => (
              <View key={item.id} style={[styles.commentItem, index > 0 && styles.commentBorder]}>
                
                <View style={styles.commentHeader}>
                  <View style={styles.userInfoRow}>
                    <View style={[styles.avatar, { backgroundColor: item.color }]}>
                      <Text style={styles.avatarText}>{item.iniciales}</Text>
                    </View>
                    <Text style={styles.userName}>{item.usuario}</Text>
                    <Text style={styles.timeText}>· {item.tiempo}</Text>
                  </View>
                  {item.isTop && (
                    <View style={styles.topBadge}>
                      <Award size={10} color="#b45309" />
                      <Text style={styles.topBadgeText}>Top</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.commentText}>{item.comentario}</Text>
                
                <View style={styles.votesRow}>
                  <TouchableOpacity style={styles.voteButtonUp}>
                    <ThumbsUp size={14} color="#15803d" />
                    <Text style={styles.voteTextUp}>{item.votosUp}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.voteButtonDown}>
                    <ThumbsDown size={14} color="#b45309" />
                    <Text style={styles.voteTextDown}>{item.votosDown}</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ))}
          </View>

        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    </LinearGradientSvg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginTop: 5,
  },
  headerTitleContainer: {
    flex: 1,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 2,
  },
  commonNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 2,
  },
  scientificNameText: {
    fontSize: 12,
    color: '#8c7a5f',
    fontStyle: 'italic',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 4,
    marginTop: 5,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 120, // Space for absolute bottom nav
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  cardIcon: {
    opacity: 0.7,
  },
  cardTitle: {
    fontSize: 8,
    fontWeight: '800',
    color: '#71717a',
    flexShrink: 1,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 4,
    marginTop: 'auto',
  },
  messageText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },
  communitySection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#71717a',
  },
  dotsIndicator: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e4e4e7',
  },
  dotActive: {
    backgroundColor: '#d97706',
  },
  commentItem: {
    paddingVertical: 16,
  },
  commentBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  timeText: {
    fontSize: 11,
    color: '#a1a1aa',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 3,
  },
  topBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400e',
  },
  commentText: {
    fontSize: 13,
    color: '#52525b',
    lineHeight: 18,
    marginBottom: 12,
  },
  votesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  voteButtonUp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 6,
  },
  voteTextUp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  voteButtonDown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 6,
  },
  voteTextDown: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
});
