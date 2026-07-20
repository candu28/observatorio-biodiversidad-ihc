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
  TextInput,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronLeft, CheckCircle2, ThumbsUp, ThumbsDown, Binoculars, Award, Compass, BookOpen, Users, ChevronRight, Plus, Grid, Leaf } from 'lucide-react-native';
import { LinearGradientSvg } from '../../src/presentation/components/ui/LinearGradientSvg';
import { BottomNav } from '../../src/presentation/components/ui/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WatermelonAvistamientoRepository } from '../../src/infrastructure/adapters/watermelon/avistamiento/WatermelonAvistamientoRepository';
import { WatermelonPerfilRepository } from '../../src/infrastructure/adapters/watermelon/perfil/WatermelonPerfilRepository';
import { ObtenerDetalleAvistamientoUseCase } from '../../src/application/useCases/ObtenerDetalleAvistamientoUseCase';
import { AgregarSugerenciaUseCase } from '../../src/application/useCases/AgregarSugerenciaUseCase';
import { AgregarComentarioUseCase } from '../../src/application/useCases/AgregarComentarioUseCase';
import { VotarSugerenciaUseCase } from '../../src/application/useCases/VotarSugerenciaUseCase';

export default function SightingDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [newSightingText, setNewSightingText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const [data, setData] = useState<any>(null);

  const fetchDetalles = async () => {
    setIsLoading(true);
    try {
      const avistamientoRepo = new WatermelonAvistamientoRepository();
      const perfilRepo = new WatermelonPerfilRepository();
      const useCase = new ObtenerDetalleAvistamientoUseCase(avistamientoRepo, perfilRepo);
      
      const detalle = await useCase.execute(id as string);
      setData(detalle);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalles();
  }, [id]);

  const handleVote = async (commentId: string, type: 'up' | 'down') => {
    try {
      const avistamientoRepo = new WatermelonAvistamientoRepository();
      const perfilRepo = new WatermelonPerfilRepository();
      const useCase = new VotarSugerenciaUseCase(avistamientoRepo, perfilRepo);
      await useCase.execute(id as string, commentId, type === 'up');
      fetchDetalles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSighting = async () => {
    const trimmed = newSightingText.trim();
    if (!trimmed) return;

    try {
      const avistamientoRepo = new WatermelonAvistamientoRepository();
      const perfilRepo = new WatermelonPerfilRepository();
      const useCase = new AgregarSugerenciaUseCase(avistamientoRepo, perfilRepo);
      await useCase.execute(id as string, trimmed);
      setNewSightingText('');
      fetchDetalles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async () => {
    const trimmed = newCommentText.trim();
    if (!trimmed) return;

    try {
      const avistamientoRepo = new WatermelonAvistamientoRepository();
      const perfilRepo = new WatermelonPerfilRepository();
      const useCase = new AgregarComentarioUseCase(avistamientoRepo, perfilRepo);
      await useCase.execute(id as string, trimmed);
      setNewCommentText('');
      fetchDetalles();
    } catch (e) {
      console.error(e);
    }
  };


  if (isLoading) {
    return (
      <LinearGradientSvg colors={['#f7f0df', '#f4ecd7', '#f7f0df']} style={styles.loaderContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#4d7c0f" />
      </LinearGradientSvg>
    );
  }

  return (
    <LinearGradientSvg colors={['#f7f0df', '#f4ecd7', '#f7f0df']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
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
          <View style={styles.headerActionsContainer}>
            {data.verificada && (
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={12} color="#15803d" />
                <Text style={styles.verifiedText}>Verificada</Text>
              </View>
            )}
          </View>
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
            </View>

            {/* Bioma Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Leaf size={14} color="#7fa579" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>BIOMA</Text>
              </View>
              <Text style={styles.cardValue}>{data.bioma || 'Selva tropical'}</Text>
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
            </View>

            {/* Comments List */}
            {data.identificaciones.map((item: any, index: number) => (
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
                  <TouchableOpacity style={styles.voteButtonUp} onPress={() => handleVote(item.id, 'up')}>
                    <ThumbsUp size={14} color="#15803d" />
                    <Text style={styles.voteTextUp}>{item.votosUp}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.voteButtonDown} onPress={() => handleVote(item.id, 'down')}>
                    <ThumbsDown size={14} color="#b45309" />
                    <Text style={styles.voteTextDown}>{item.votosDown}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.addSightingSection}>
              <Text style={styles.addSectionLabel}>Agregar sugerencia de la especie</Text>
              <View style={styles.addCommentRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Agregar sugerencia de la especie"
                  placeholderTextColor="#9ca3af"
                  value={newSightingText}
                  onChangeText={setNewSightingText}
                  multiline
                />
                <TouchableOpacity style={styles.addCommentButton} onPress={handleAddSighting}>
                  <Text style={styles.addCommentButtonText}>Añadir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.publicCommentsSection}>
            <View style={styles.communityHeader}>
              <View>
                <Text style={styles.sectionTitle}>Comentarios ({data.comentarios.length})</Text>
              </View>
            </View>

            {data.comentarios.length > 0 ? (
              data.comentarios.map((comment: any) => (
                <View key={comment.id} style={styles.commentListItem}>
                  <View style={[styles.avatar, { width: 28, height: 28, borderRadius: 14, backgroundColor: '#c4c4c8' }]}>
                    <Text style={[styles.avatarText, { fontSize: 10 }]}>{(comment.usuario || 'U').split(' ').map((s: any) => s[0]).slice(0, 2).join('')}</Text>
                  </View>
                  <View style={styles.commentTextBlock}>
                    <Text style={styles.commentAuthor}>{comment.usuario}</Text>
                    <Text style={styles.commentTextSmall}>{comment.texto}</Text>
                  </View>
                  <Text style={styles.timeText}>{comment.tiempo}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyCommentsText}>Aún no hay comentarios en esta publicación.</Text>
            )}

            <View style={styles.addCommentSection}>
              <Text style={styles.addSectionLabel}>Agregar comentario</Text>
              <View style={styles.addCommentRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Agregar comentario"
                  placeholderTextColor="#9ca3af"
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                  multiline
                />
                <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
                  <Text style={styles.addCommentButtonText}>Añadir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Ubicación Section */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Ubicación del avistamiento</Text>
          <TouchableOpacity 
            style={styles.mapContainer} 
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/mapa', params: { filterId: data.id } })}
          >
            <Image source={{ uri: data.fotoUrl }} style={styles.mapImage} blurRadius={10} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }]}>
              <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#f97316', shadowColor: '#f97316', shadowOpacity: 1, shadowRadius: 10, shadowOffset: {width:0,height:0} }} />
            </View>
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayTextLeft}>{data.ubicacionTexto}</Text>
              <Text style={styles.mapOverlayTextRight}>Toca para ver el mapa de calor</Text>
            </View>
          </TouchableOpacity>

          {/* Proyectos Section */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Proyectos relacionados</Text>
          <View style={styles.projectList}>
            <TouchableOpacity style={styles.projectCard}>
              <View style={styles.projectIconContainer}>
                <BookOpen size={16} color="#71717a" />
              </View>
              <View style={styles.projectTextContainer}>
                <Text style={styles.projectTitle}>Alimentación del Minero</Text>
                <View style={styles.projectParticipants}>
                  <Users size={12} color="#71717a" />
                  <Text style={styles.projectParticipantsText}>47 participantes</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#a1a1aa" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.projectCard}>
              <View style={styles.projectIconContainer}>
                <BookOpen size={16} color="#71717a" />
              </View>
              <View style={styles.projectTextContainer}>
                <Text style={styles.projectTitle}>Respiración del Minero</Text>
                <View style={styles.projectParticipants}>
                  <Users size={12} color="#71717a" />
                  <Text style={styles.projectParticipantsText}>23 participantes</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#a1a1aa" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.projectCard}>
              <View style={styles.projectIconContainer}>
                <BookOpen size={16} color="#71717a" />
              </View>
              <View style={styles.projectTextContainer}>
                <Text style={styles.projectTitle}>Reproducción del Minero</Text>
                <View style={styles.projectParticipants}>
                  <Users size={12} color="#71717a" />
                  <Text style={styles.projectParticipantsText}>112 participantes</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#a1a1aa" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.projectCard, styles.createProjectCard]}
              onPress={() => router.push({
                pathname: '/crear-proyecto',
                params: {
                  especieNombre: data.nombreComun,
                  especieCientifico: data.nombreCientifico,
                  especieFoto: data.fotoUrl
                }
              })}
            >
              <View style={[styles.projectIconContainer, styles.createProjectIconContainer]}>
                <Plus size={16} color="#065f46" />
              </View>
              <View style={styles.projectTextContainer}>
                <Text style={[styles.projectTitle, styles.createProjectTitle]}>Crear nuevo proyecto</Text>
              </View>
              <ChevronRight size={16} color="#065f46" />
            </TouchableOpacity>
          </View>

          {/* Botón Principal */}
          {data.especieId ? (
            <TouchableOpacity
              style={styles.allObsButton}
              onPress={() => router.push({ pathname: '/observaciones/[especieId]', params: { especieId: data.especieId } })}
            >
              <Grid size={16} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.allObsButtonText}>Ver todas las observaciones de la especie</Text>
            </TouchableOpacity>
          ) : null}

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
    paddingRight: 10,
  },
  headerActionsContainer: {
    alignItems: 'flex-end',
    gap: 8,
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
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  createProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4d7c0f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  createProjectText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
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
    justifyContent: 'flex-start',
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
    marginBottom: 0,
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
  commentsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  commentsToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  commentsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3',
  },
  commentListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  commentTextBlock: {
    marginLeft: 8,
    flex: 1,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1f2937',
  },
  commentTextSmall: {
    fontSize: 13,
    color: '#52525b',
  },
  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e6e9',
    marginRight: 8,
  },
  addCommentButton: {
    backgroundColor: '#4d7c0f',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addCommentButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  publicCommentsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginTop: 16,
    marginBottom: 16,
  },
  addSightingSection: {
    marginTop: 16,
  },
  addCommentSection: {
    marginTop: 16,
  },
  addSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  emptyCommentsText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },

  mapContainer: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mapOverlayTextLeft: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1f2937',
  },
  mapOverlayTextRight: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  projectList: {
    gap: 12,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 16,
    padding: 14,
  },
  createProjectCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#6ee7b7',
  },
  projectIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginRight: 12,
  },
  createProjectIconContainer: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  projectTextContainer: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  createProjectTitle: {
    color: '#065f46',
    fontWeight: '800',
  },
  projectParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  projectParticipantsText: {
    fontSize: 11,
    color: '#71717a',
  },
  allObsButton: {
    flexDirection: 'row',
    backgroundColor: '#1f4316',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  allObsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
