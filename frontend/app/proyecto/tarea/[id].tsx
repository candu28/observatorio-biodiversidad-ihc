import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronLeft, Plus, X, Camera, Image as ImageIcon, MessageSquare, Calendar } from 'lucide-react-native';
import { LinearGradientSvg } from '../../../src/presentation/components/ui/LinearGradientSvg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MockProyectoRepository } from '../../../src/infrastructure/adapters/mock/proyecto/MockProyectoRepository';
import { CapturarMultimediaAvistamiento } from '../../../src/application/useCases/CapturarMultimediaAvistamiento';
import { ExpoCameraAdapter } from '../../../src/infrastructure/adapters/hardware/ExpoCameraAdapter';
import { AgregarAporteTareaUseCase, AgregarAporteTareaInput } from '../../../src/application/useCases/AgregarAporteTareaUseCase';
import { IAporteTarea } from '../../../../contracts/types/IAporteTarea';
import { ITareaProyecto } from '../../../../contracts/types/ITareaProyecto';

export default function TaskDetailScreen() {
  const { id, proyectoId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [tarea, setTarea] = useState<ITareaProyecto | null>(null);
  const [aportes, setAportes] = useState<IAporteTarea[]>([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const repository = new MockProyectoRepository();

  const loadTaskDetail = async () => {
    try {
      const tareas = await repository.getTareas(proyectoId as string);
      const foundTarea = tareas.find(t => t.tareaId === id);
      if (foundTarea) {
        setTarea(foundTarea);
        const taskAportes = await repository.getAportes(id as string);
        setAportes(taskAportes);
      }
    } catch (error) {
      console.error('Error loading task detail', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTaskDetail();
  }, [id, proyectoId]);

  const handleAction = async (type: 'photo' | 'gallery') => {
    if (!tarea) return;

    try {
      const adapter = new ExpoCameraAdapter();
      const captureUseCase = new CapturarMultimediaAvistamiento(adapter);

      let result: string[] = [];
      if (type === 'photo') {
        result = await captureUseCase.execute({ type: 'photo' });
      } else if (type === 'gallery') {
        result = await captureUseCase.execute({ type: 'gallery', multiple: false });
      }

      if (result.length > 0) {
        const addAporteUseCase = new AgregarAporteTareaUseCase(repository);

        const input: AgregarAporteTareaInput = {
          proyectoId: proyectoId as string,
          tareaId: tarea.tareaId,
          usuarioId: 'user-123', // Hardcoded for mock purposes (Auth layer would provide this)
          tipoMultimedia: 'imagen',
          archivoUrl: result[0],
          comentarioDescriptivo: 'Aporte desde la aplicación', // This could come from an input field in the future
        };

        await addAporteUseCase.execute(input);

        Alert.alert('Éxito', 'Tu aporte ha sido registrado correctamente.');
        setSheetVisible(false);

        // Refresh data
        void loadTaskDetail();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error al procesar el aporte.');
      setSheetVisible(false);
    }
  };

  if (isLoading) {
    return (
      <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4d7c0f" />
      </LinearGradientSvg>
    );
  }

  if (!tarea) {
    return (
      <View style={styles.errorContainer}>
        <Text>Tarea no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>

        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerLabel}>TAREA</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.taskInfoCard}>
            <Text style={styles.taskDesc}>{tarea.descripcionInstrucciones}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aportes de la comunidad</Text>
            <Text style={styles.countPill}>{aportes.length}</Text>
          </View>

          {aportes.length > 0 ? (
            <View style={styles.aportesGrid}>
              {aportes.map((aporte) => (
                <TouchableOpacity
                  key={aporte.aporteId}
                  style={styles.aporteCard}
                  onPress={() => setSelectedImage(aporte.archivoUrl)}
                  activeOpacity={0.9}
                >
                  <View style={styles.aporteHeader}>
                    <View style={styles.userCircle}>
                      <Text style={styles.userInitial}>U</Text>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName} numberOfLines={1}>Participante</Text>
                      <Text style={styles.aporteDate}>
                        {new Date(aporte.fechaAporte).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Image source={{ uri: aporte.archivoUrl }} style={styles.aporteImage} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <ImageIcon size={32} color="#9ca3af" />
              </View>
              <Text style={styles.emptyText}>No hay aportes todavía.</Text>
              <Text style={styles.emptySubtext}>Sé el primero en colaborar con esta tarea.</Text>
            </View>
          )}

        </ScrollView>

        <TouchableOpacity style={styles.floatingButton} onPress={() => setSheetVisible(true)}>
          <Plus size={24} color="#ffffff" />
          <Text style={styles.floatingButtonText}>Agregar aporte</Text>
        </TouchableOpacity>

        {/* Full Image Modal */}
        <Modal visible={!!selectedImage} transparent animationType="fade" onRequestClose={() => setSelectedImage(null)}>
          <Pressable style={styles.fullImageBackdrop} onPress={() => setSelectedImage(null)}>
            <TouchableOpacity
              style={styles.closeFullImage}
              onPress={() => setSelectedImage(null)}
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </Modal>

        {/* Bottom Sheet Modal */}
        <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setSheetVisible(false)}>
            <Pressable style={styles.sheetContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Nuevo Aporte</Text>
                <TouchableOpacity onPress={() => setSheetVisible(false)} style={styles.closeButton}>
                  <X size={20} color="#7a6e5b" />
                </TouchableOpacity>
              </View>

              <View style={styles.sheetOptions}>
                <TouchableOpacity style={styles.sheetOptionCard} onPress={() => handleAction('photo')}>
                  <View style={styles.optionIconCircle}>
                    <Camera size={24} color="#4d7c0f" />
                  </View>
                  <View style={styles.optionTexts}>
                    <Text style={styles.optionTitle}>Tomar Fotografía</Text>
                    <Text style={styles.optionDesc}>Usa la cámara interactiva (soporta ráfaga)</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.sheetOptionCard, { borderBottomWidth: 0 }]} onPress={() => handleAction('gallery')}>
                  <View style={[styles.optionIconCircle, { backgroundColor: '#eff6ff' }]} >
                    <ImageIcon size={24} color="#1d4ed8" />
                  </View>
                  <View style={styles.optionTexts}>
                    <Text style={styles.optionTitle}>Subir desde la Galería</Text>
                    <Text style={styles.optionDesc}>Selecciona fotos guardadas en tu equipo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

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
    paddingVertical: 10,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1f2937',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  taskInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    marginBottom: 20,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#4d7c0f',
  },
  taskDesc: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1f2937',
  },
  countPill: {
    backgroundColor: '#4d7c0f',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  aportesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  aporteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    width: '48%', // Reduced size (~20% smaller than full width)
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  aporteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  userCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitial: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1f2937',
  },
  aporteDate: {
    fontSize: 9,
    color: '#9ca3af',
  },
  aporteImage: {
    width: '100%',
    height: 120, // Reduced height for the 20% smaller feel
    borderRadius: 10,
  },
  fullImageBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeFullImage: {
    position: 'absolute',
    top: 50,
    right: 25,
    zIndex: 10,
    padding: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4b5563',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4d7c0f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  floatingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  // Modal Styles
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#fffdf8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 15,
    elevation: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d2418',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f2ead9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetOptions: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0e3c4',
    overflow: 'hidden',
  },
  sheetOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0e3c4',
  },
  optionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTexts: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#271f13',
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 12,
    color: '#8a7a5d',
  },
});
