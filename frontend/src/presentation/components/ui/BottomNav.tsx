import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { Home, Plus, Map, Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { CapturarMultimediaAvistamiento } from '../../../application/useCases/CapturarMultimediaAvistamiento';
import { ExpoCameraAdapter } from '../../../infrastructure/adapters/hardware/ExpoCameraAdapter';

export function BottomNav() {
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleAction = async (type: 'photo' | 'gallery') => {
    try {
      const adapter = new ExpoCameraAdapter();
      const useCase = new CapturarMultimediaAvistamiento(adapter);

      let result: string[] = [];
      if (type === 'photo') {
        result = await useCase.execute({ type: 'photo' });
      } else if (type === 'gallery') {
        result = await useCase.execute({ type: 'gallery', multiple: true });
      }

      if (result.length > 0) {
        setSheetVisible(false);
        router.navigate({
          pathname: '/avistamiento',
          params: { photos: JSON.stringify(result) }
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error al capturar multimedia.');
      setSheetVisible(false);
    }
  };

  return (
    <>
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.navigate('/')}>
            <Home size={24} color="#4b5563" />
            <Text style={styles.navText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setSheetVisible(true)}>
            <Plus size={24} color="#4b5563" />
            <Text style={styles.navText}>Avistamiento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Map size={24} color="#4b5563" />
            <Text style={styles.navText}>Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheetVisible(false)}>
          <Pressable style={styles.sheetContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Nuevo Avistamiento</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 12,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
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
