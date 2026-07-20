import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { ChevronLeft, MapPin, Users, Calendar, Plus, BookOpen, User, Leaf, X, Camera, Image as ImageIcon } from 'lucide-react-native';
import { LinearGradientSvg } from '../../src/presentation/components/ui/LinearGradientSvg';
import { BottomNav } from '../../src/presentation/components/ui/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, Pressable } from 'react-native';

import { ObtenerDetalleProyectoUseCase, ProyectoDetalleViewModel } from '../../src/application/useCases/ObtenerDetalleProyectoUseCase';
import { MockProyectoRepository } from '../../src/infrastructure/adapters/mock/proyecto/MockProyectoRepository';
import { CapturarMultimediaAvistamiento } from '../../src/application/useCases/CapturarMultimediaAvistamiento';
import { ExpoCameraAdapter } from '../../src/infrastructure/adapters/hardware/ExpoCameraAdapter';
import { AgregarAporteTareaUseCase } from '../../src/application/useCases/AgregarAporteTareaUseCase';
import { IAporteTarea } from '../../../contracts/types/IAporteTarea';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ProyectoDetalleViewModel | null>(null);

  const loadDetail = useCallback(async () => {
    try {
      const useCase = new ObtenerDetalleProyectoUseCase(new MockProyectoRepository());
      const result = await useCase.execute(id as string);
      setData(result);
    } catch (error) {
      console.error('Error loading project detail', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadDetail();
    }, [loadDetail])
  );

  if (isLoading) {
    return (
      <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4d7c0f" />
      </LinearGradientSvg>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text>Proyecto no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { proyecto, tareas } = data;

  return (
    <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={22} color="#1f2937" />
            </TouchableOpacity>
            <View style={styles.headerUser}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' }}
                style={styles.userAvatar}
              />
              <Text style={styles.userName}>Luis Candurin</Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Project Title Card */}
          <View style={styles.titleCard}>
            <View style={styles.titleHeader}>
              <View style={styles.projectIconContainer}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1596700813959-1e359a39e830?q=80&w=600&auto=format&fit=crop' }}
                  style={styles.projectImage}
                />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.projectTitle}>{proyecto.titulo}</Text>
                <Text style={styles.projectDesc}>{proyecto.descripcion}</Text>
              </View>
            </View>
            <View style={styles.speciesPill}>
              <Leaf size={12} color="#4d7c0f" />
              <Text style={styles.speciesPillText}>{proyecto.categoriasTaxonomicas[0] || 'Sapo Minero'}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Tareas de Colaboración</Text>

          {/* Tasks and Contributions */}
          {tareas.map((tarea) => (
            <View key={tarea.tareaId} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.miniAvatarContainer}>
                  <Text style={styles.miniAvatarText}>DH</Text>
                </View>
                <View style={styles.taskInfoContainer}>
                  <Text style={styles.contributorName}>DrHerpeto <Text style={styles.timeAgo}>· hace 3h</Text></Text>
                  <Text style={styles.taskCardTitle}>{tarea.tituloTarea}</Text>
                </View>
              </View>

              <View style={styles.taskActionRow}>
                <Text style={styles.taskStatusText}>
                  {tarea.aportes.length > 0
                    ? `${tarea.aportes.length} aportes realizados`
                    : 'Sin aportes todavía'}
                </Text>
                <TouchableOpacity
                  style={styles.smallAddButton}
                  onPress={() => router.push({
                    pathname: '/proyecto/tarea/[id]',
                    params: { id: tarea.tareaId, proyectoId: proyecto.id }
                  })}
                >
                  <Plus size={14} color="#ffffff" />
                  <Text style={styles.smallAddButtonText}>Ver aportes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Project Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Información del Proyecto</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <MapPin size={16} color="#927341" />
              </View>
              <View>
                <Text style={styles.infoLabel}>UBICACIÓN</Text>
                <Text style={styles.infoValue}>{proyecto.ubicacionGeografica}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Users size={16} color="#927341" />
              </View>
              <View>
                <Text style={styles.infoLabel}>PARTICIPANTES ACTIVOS</Text>
                <Text style={styles.infoValue}>{proyecto.cantidadParticipantes} miembros</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Calendar size={16} color="#927341" />
              </View>
              <View>
                <Text style={styles.infoLabel}>FECHA DE CREACIÓN</Text>
                <Text style={styles.infoValue}>
                  {new Date(proyecto.fechaInicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backLink: {
    color: '#4d7c0f',
    marginTop: 10,
    fontWeight: '700',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1f2937',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  titleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  titleHeader: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  bookIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f3f0e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#f3f0e8',
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  titleTextContainer: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  speciesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  speciesPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  miniAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfoContainer: {
    flex: 1,
  },
  taskCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
  },
  taskActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  taskStatusText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  miniAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  contributorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1f2937',
  },
  timeAgo: {
    fontWeight: '500',
    color: '#9ca3af',
    fontSize: 11,
  },
  smallAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4d7c0f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  smallAddButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginTop: 15,
    marginBottom: 30,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fdf3d1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1f2937',
  },
});
