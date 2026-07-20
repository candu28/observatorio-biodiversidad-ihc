import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { Camera, Image as ImageIcon, Trash2, Plus, X } from 'lucide-react-native';
import { CapturarMultimediaAvistamiento } from '../../../../application/useCases/CapturarMultimediaAvistamiento';
import { ExpoCameraAdapter } from '../../../../infrastructure/adapters/hardware/ExpoCameraAdapter';
import { CapturedMedia } from '../../../../application/ports/CapturedMedia';

type CameraWidgetProps = {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  onLocationCaptured?: (latitude: number, longitude: number, source: 'GPS del Dispositivo' | 'Datos EXIF') => void;
};

export default function CameraWidget({ photos, onPhotosChange, onLocationCaptured }: CameraWidgetProps) {
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleAction = async (type: 'photo' | 'gallery') => {
    if (photos.length >= 3) {
      Alert.alert(
        'Límite de Fotos',
        'Ya has alcanzado el límite máximo de 3 fotos para este avistamiento.'
      );
      setSheetVisible(false);
      return;
    }

    setSheetVisible(false); // IMPORTANTE: Cerrar este modal primero para evitar conflictos de múltiples modales en Android

    // Pequeño delay para que el modal actual se cierre por completo antes de abrir el Modal de la Cámara
    setTimeout(async () => {
      try {
        const adapter = new ExpoCameraAdapter();
        const useCase = new CapturarMultimediaAvistamiento(adapter);

        let result: CapturedMedia[] = [];
        if (type === 'photo') {
          result = await useCase.execute({ type: 'photo', existingCount: photos.length });
        } else if (type === 'gallery') {
          const multiple = photos.length < 2;
          result = await useCase.execute({ type: 'gallery', multiple, existingCount: photos.length });
        }

      if (result.length > 0) {
        const newUris = result.map((item) => item.uri);
        const totalPhotos = [...photos, ...newUris];

        // Buscar si alguna de las fotos agregadas tiene coordenadas válidas
        if (onLocationCaptured) {
          const itemWithCoords = result.find(
            (item) => item.latitude !== undefined && item.longitude !== undefined
          );
          if (
            itemWithCoords &&
            itemWithCoords.latitude !== undefined &&
            itemWithCoords.longitude !== undefined
          ) {
            const hasExifGPS =
              !!itemWithCoords.exif &&
              (itemWithCoords.exif.GPSLatitude !== undefined ||
                itemWithCoords.exif.latitude !== undefined);
            const source = (type === 'gallery' || hasExifGPS) ? 'Datos EXIF' : 'GPS del Dispositivo';
            onLocationCaptured(itemWithCoords.latitude, itemWithCoords.longitude, source);
          }
        }

        if (totalPhotos.length > 3) {
          Alert.alert(
            'Límite Excedido',
            'Se han filtrado algunas fotos para no superar el límite máximo de 3 fotos por avistamiento.'
          );
          onPhotosChange(totalPhotos.slice(0, 3));
        } else {
          onPhotosChange(totalPhotos);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error al capturar multimedia.');
    }
    }, 300); // 300ms de delay
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.widgetTitle}>Evidencia Fotográfica *</Text>
        <Text style={styles.limitText}>
          {photos.length === 0 
            ? 'Máximo 3 fotos' 
            : `${photos.length} de 3 seleccionadas`}
        </Text>
      </View>

      {photos.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoList}>
          {photos.map((uri, idx) => (
            <View key={idx} style={styles.photoContainer}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity style={styles.deleteBadge} onPress={() => removePhoto(idx)}>
                <Trash2 size={12} color="#fff" />
              </TouchableOpacity>
              <View style={styles.indexBadge}>
                <Text style={styles.indexText}>{idx + 1}</Text>
              </View>
            </View>
          ))}
          {photos.length < 3 && (
            <TouchableOpacity style={styles.addMoreCard} onPress={() => setSheetVisible(true)}>
              <Plus size={24} color="#8c7651" />
              <Text style={styles.addMoreText}>Añadir</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <TouchableOpacity style={styles.emptyContainer} onPress={() => setSheetVisible(true)}>
          <Camera size={28} color="#8c7651" style={{ marginBottom: 8 }} />
          <Text style={styles.emptyText}>Agregar Evidencia Fotográfica</Text>
          <Text style={styles.emptySubtext}>Añade fotos desde tu cámara o galería</Text>
        </TouchableOpacity>
      )}

      {/* Bottom Sheet Modal */}
      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheetVisible(false)}>
          <Pressable style={styles.sheetContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Agregar Evidencia</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  widgetTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b5425',
  },
  limitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8c7651',
  },
  photoList: {
    paddingVertical: 8,
    gap: 12,
  },
  photoContainer: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#eadbbd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  indexText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addMoreCard: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 250, 242, 0.8)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c3b195',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addMoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8c7651',
  },
  emptyContainer: {
    height: 120,
    backgroundColor: '#fffdf9',
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c3b195',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#342a1a',
  },
  emptySubtext: {
    fontSize: 11,
    color: '#8a7a5d',
    marginTop: 4,
    textAlign: 'center',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscurecido
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
