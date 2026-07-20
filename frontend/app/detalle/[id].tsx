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
import { ChevronLeft, CheckCircle2, ThumbsUp, ThumbsDown, Binoculars, Award, Compass, BookOpen, Users, ChevronRight, Plus, Grid } from 'lucide-react-native';
// Require JSON with ts-ignore to avoid missing module/type declaration errors
// @ts-ignore
const dbMockData = require('../../../contracts/mocks/dbMockData.json');
import { LinearGradientSvg } from '../../src/presentation/components/ui/LinearGradientSvg';
import { BottomNav } from '../../src/presentation/components/ui/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SightingDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<any>(() => {
    let rawItem = (dbMockData.avistamientos as any[]).find(a => a.id === id);
    if (!rawItem) {
      rawItem = dbMockData.avistamientos[0];
    }


    if (!rawItem._identificacionesUiMock) {
      rawItem._identificacionesUiMock = [
        {
          id: '1', usuario: 'Luis Ferrer', iniciales: 'LF', color: '#6366f1', tiempo: 'hace 30min', isTop: true,
          comentario: 'Confirmado. Es el Dendrobates leucomelas, inconfundible por su patrón amarillo-negro. Especie endémica de la Guayana venezolana.', votosUp: 100, votosDown: 3, userVote: null,
        },
        {
          id: '2', usuario: 'Cambur', iniciales: 'CA', color: '#b45309', tiempo: 'hace 12h', isTop: false,
          comentario: 'Podría ser una especie hermana. El patrón de las bandas negras parece ligeramente diferente al leucomelas típico.', votosUp: 8, votosDown: 45, userVote: null,
        },
        {
          id: '3', usuario: 'DrHerpeto', iniciales: 'DH', color: '#15803d', tiempo: 'hace 2d', isTop: true,
          comentario: 'El patrón es definitivamente D. leucomelas. He analizado 318 registros de esta especie en la región del Caura.', votosUp: 234, votosDown: 1, userVote: null,
        },
      ];
    }

    const autor = (dbMockData.usuarios as any[]).find(u => u.id === rawItem.autor_id) || { nombre: 'Desconocido' };
    const categoriaObj = (dbMockData.categorias_taxonomicas as any[]).find(c => c.id === rawItem.categoria_id);
    const comentarios = Array.isArray(rawItem.comentarios)
      ? rawItem.comentarios.map((comment: any, index: number) => ({
        id: comment.id || `comment-${index + 1}`,
        usuario: comment.usuario || 'Usuario',
        texto: comment.texto || comment.contenido || '',
        tiempo: comment.tiempo || 'recientemente',
      }))
      : [];

    return {
      _rawItem: rawItem,
      id: rawItem.id,
      categoria: categoriaObj ? categoriaObj.nombre.toUpperCase() : 'ANFIBIOS',
      nombreComun: rawItem.especie_verif_nombre || 'Desconocido',
      nombreCientifico: rawItem.especie_verif_nombre_cientifico || 'Desconocido',
      verificada: rawItem.estado === 'Verificado',
      fotoUrl: rawItem.foto_url || 'https://images.unsplash.com/photo-1550977186-b484af8a264a?q=80&w=800',
      ubicacionTexto: rawItem.ubicacion_texto || 'Desconocida',
      observadorOriginal: {
        nombre: autor.nombre,
      },
      expertoTop: 'DrHerpeto',
      totalObservaciones: '1847',
      especieId: rawItem.especie_verificada_id || '',
      identificaciones: rawItem._identificacionesUiMock,
      comentarios,
    };
  });

  const handleVote = (commentId: string, type: 'up' | 'down') => {
    // Simulate per-user single vote behavior (toggle and switch)
    const currentUserId = (dbMockData.usuarios as any[])[0]?.id || 'local-user';
    setData((prev: any) => {
      const updatedIdentificaciones = prev.identificaciones.map((item: any) => {
        if (item.id !== commentId) return item;

        const prevVote = item.userVote || null; // 'up' | 'down' | null
        let votosUp = item.votosUp ?? 0;
        let votosDown = item.votosDown ?? 0;
        let newVote = prevVote;

        if (prevVote === type) {
          // toggle off
          if (type === 'up') votosUp = Math.max(0, votosUp - 1);
          else votosDown = Math.max(0, votosDown - 1);
          newVote = null;
        } else {
          // switch or add
          if (prevVote === 'up') votosUp = Math.max(0, votosUp - 1);
          if (prevVote === 'down') votosDown = Math.max(0, votosDown - 1);
          if (type === 'up') votosUp += 1;
          if (type === 'down') votosDown += 1;
          newVote = type;
        }

        const updatedItem = { ...item, votosUp, votosDown, userVote: newVote };
        return updatedItem;
      });

      if (prev._rawItem) {
        prev._rawItem._identificacionesUiMock = updatedIdentificaciones;
      }

      return { ...prev, identificaciones: updatedIdentificaciones };
    });
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
          </View>

          <View style={styles.publicCommentsSection}>
            <View style={styles.communityHeader}>
              <View>
                <Text style={styles.sectionTitle}>Comentarios ({data.comentarios.length})</Text>
                <Text style={styles.sectionSubtitle}>Mensajes de la publicación general</Text>
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
          </View>

          {/* Ubicación Section */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Ubicación del avistamiento</Text>
          <View style={styles.mapContainer}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' }} style={styles.mapImage} />
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayTextLeft}>Bolívar, VE</Text>
              <Text style={styles.mapOverlayTextRight}>Satélite</Text>
            </View>
          </View>

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

            <TouchableOpacity style={[styles.projectCard, styles.createProjectCard]}>
              <View style={[styles.projectIconContainer, styles.createProjectIconContainer]}>
                <Plus size={16} color="#15803d" />
              </View>
              <View style={styles.projectTextContainer}>
                <Text style={[styles.projectTitle, styles.createProjectTitle]}>Crear nuevo proyecto</Text>
              </View>
              <ChevronRight size={16} color="#15803d" />
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
    backgroundColor: '#1f4316',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addCommentButtonText: {
    color: '#fff',
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
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
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
    color: '#166534',
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
