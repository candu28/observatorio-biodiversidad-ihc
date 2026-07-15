import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Camera, Image as ImageIcon, Sparkles, Trash2, Plus } from 'lucide-react-native';
import { CapturarMultimediaAvistamiento } from '../../../../application/useCases/CapturarMultimediaAvistamiento';
import { ExpoCameraAdapter } from '../../../../infrastructure/adapters/hardware/ExpoCameraAdapter';

type CameraWidgetProps = {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
};

export default function CameraWidget({ photos, onPhotosChange }: CameraWidgetProps) {
  const [burstCount, setBurstCount] = useState<number>(5);

  const handleAction = async (type: 'photo' | 'burst' | 'gallery') => {
    try {
      const adapter = new ExpoCameraAdapter();
      const useCase = new CapturarMultimediaAvistamiento(adapter);

      let result: string[] = [];

      if (type === 'photo') {
        result = await useCase.execute({ type: 'photo' });
      } else if (type === 'burst') {
        // Validar si supera el límite de 10 fotos sumando las existentes
        if (photos.length + burstCount > 10) {
          Alert.alert(
            'Límite Excedido',
            `No puedes tener más de 10 fotos por avistamiento. Actualmente tienes ${photos.length}.`
          );
          return;
        }
        result = await useCase.execute({ type: 'burst', count: burstCount });
      } else if (type === 'gallery') {
        const multiple = photos.length < 10;
        result = await useCase.execute({ type: 'gallery', multiple });
      }

      if (result.length > 0) {
        const totalPhotos = [...photos, ...result];
        if (totalPhotos.length > 10) {
          Alert.alert(
            'Límite Excedido',
            'Se han filtrado algunas fotos para no superar el límite máximo de 10 fotos.'
          );
          onPhotosChange(totalPhotos.slice(0, 10));
        } else {
          onPhotosChange(totalPhotos);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error al capturar multimedia.');
    }
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Evidencia Fotográfica ({photos.length}/10)</Text>

      {/* Botones de acción principales */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => handleAction('photo')}>
          <View style={styles.iconCircle}>
            <Camera size={22} color="#4d7c0f" />
          </View>
          <Text style={styles.actionTitle}>Tomar Foto</Text>
          <Text style={styles.actionDesc}>Captura única</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => handleAction('gallery')}>
          <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
            <ImageIcon size={22} color="#1d4ed8" />
          </View>
          <Text style={styles.actionTitle}>Subir Galería</Text>
          <Text style={styles.actionDesc}>Desde el dispositivo</Text>
        </TouchableOpacity>
      </View>

      {/* Control del Modo Ráfaga */}
      <View style={styles.burstCard}>
        <View style={styles.burstHeader}>
          <View style={styles.burstTitleContainer}>
            <Sparkles size={18} color="#c2410c" />
            <Text style={styles.burstTitle}>Modo Ráfaga Rápida</Text>
          </View>
          <Text style={styles.burstDesc}>Para fauna en movimiento</Text>
        </View>

        <View style={styles.burstControls}>
          {/* Selector del número de fotos */}
          <View style={styles.selectorContainer}>
            {[3, 5, 10].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.selectorButton, burstCount === num && styles.selectorButtonActive]}
                onPress={() => setBurstCount(num)}
              >
                <Text style={[styles.selectorText, burstCount === num && styles.selectorTextActive]}>
                  {num} Fs
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botón de ráfaga */}
          <TouchableOpacity style={styles.burstTrigger} onPress={() => handleAction('burst')}>
            <Camera size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.burstTriggerText}>Capturar Ráfaga</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Visualización de las fotos seleccionadas */}
      {photos.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoList}
        >
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
          {photos.length < 10 && (
            <TouchableOpacity style={styles.addMoreCard} onPress={() => handleAction('photo')}>
              <Plus size={24} color="#8c7651" />
              <Text style={styles.addMoreText}>Añadir</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay fotos seleccionadas aún.</Text>
          <Text style={styles.emptySubtext}>Captura o selecciona imágenes del entorno natural.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f2e8cf',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#342a1a',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#efe2c5',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#271f13',
  },
  actionDesc: {
    fontSize: 10,
    color: '#9a8968',
    marginTop: 2,
    textAlign: 'center',
  },
  burstCard: {
    backgroundColor: '#fffbf0',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  burstHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  burstTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  burstTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7c2d12',
  },
  burstDesc: {
    fontSize: 9,
    color: '#c2410c',
    fontWeight: '600',
  },
  burstControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 3,
  },
  selectorButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
  },
  selectorButtonActive: {
    backgroundColor: '#ea580c',
  },
  selectorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  selectorTextActive: {
    color: '#fff',
  },
  burstTrigger: {
    flexDirection: 'row',
    backgroundColor: '#ea580c',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  burstTriggerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  photoList: {
    paddingVertical: 4,
    gap: 12,
  },
  photoContainer: {
    width: 84,
    height: 84,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#eadbbd',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexBadge: {
    position: 'absolute',
    bottom: 3,
    left: 3,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 5,
    borderRadius: 6,
  },
  indexText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  addMoreCard: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: '#fffaf2',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c3b195',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addMoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8c7651',
  },
  emptyContainer: {
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#efe2c5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  emptyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7a6e5b',
  },
  emptySubtext: {
    fontSize: 9,
    color: '#a1937e',
    marginTop: 2,
    textAlign: 'center',
  },
});
