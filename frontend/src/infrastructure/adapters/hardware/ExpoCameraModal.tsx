import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  Zap,
  ZapOff,
  Camera,
  RefreshCw,
  Check,
  Image as ImageIcon,
  Trash2,
  Sliders,
} from 'lucide-react-native';
import { MediaPickerService, CameraOptions } from './MediaPickerService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MediaPickerContextType = {
  showCamera: (options: CameraOptions) => Promise<string[]>;
};

const MediaPickerContext = createContext<MediaPickerContextType | undefined>(undefined);

export const useMediaPickerUI = () => {
  const context = useContext(MediaPickerContext);
  if (!context) {
    throw new Error('useMediaPickerUI debe ser utilizado dentro de un MediaPickerProvider');
  }
  return context;
};

export const MediaPickerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'photo' | 'burst'>('photo');
  const [burstCount, setBurstCount] = useState(5);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [zoom, setZoom] = useState(0); // Rango de 0 a 1
  const [capturing, setCapturing] = useState(false);
  const [burstProgress, setBurstProgress] = useState(0);
  const [screenBlink, setScreenBlink] = useState(false);

  const cameraRef = useRef<any>(null);
  const resolverRef = useRef<((value: string[]) => void) | null>(null);

  // Registrar el manejador en el servicio
  useEffect(() => {
    MediaPickerService.registerHandler(async (options) => {
      setMode(options.mode);
      if (options.mode === 'burst' && options.burstCount) {
        setBurstCount(options.burstCount);
      }
      setCapturedPhotos([]);
      setZoom(0);
      setVisible(true);

      return new Promise<string[]>((resolve) => {
        resolverRef.current = resolve;
      });
    });

    return () => {
      MediaPickerService.unregisterHandler();
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (resolverRef.current) {
      resolverRef.current([]); // Cancelar devuelve un arreglo vacío
      resolverRef.current = null;
    }
  };

  const handleConfirm = () => {
    setVisible(false);
    if (resolverRef.current) {
      resolverRef.current(capturedPhotos);
      resolverRef.current = null;
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((prev) => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  };

  // Disparar flash visual en pantalla
  const triggerBlink = () => {
    setScreenBlink(true);
    setTimeout(() => setScreenBlink(false), 80);
  };

  // Capturar una sola foto
  const captureSingle = async (): Promise<string | null> => {
    if (!cameraRef.current) return null;
    try {
      triggerBlink();
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1.0, // Calidad máxima para detalles de biodiversidad
        skipProcessing: false,
      });
      return photo.uri;
    } catch (error) {
      console.error('Error capturando foto:', error);
      return null;
    }
  };

  // Orquestar captura (Foto única o Ráfaga)
  const handleCapture = async () => {
    if (capturing) return;
    setCapturing(true);

    try {
      if (mode === 'photo') {
        const uri = await captureSingle();
        if (uri) {
          setCapturedPhotos((prev) => [...prev, uri]);
        }
      } else {
        // Modo ráfaga
        const burstUris: string[] = [];
        setBurstProgress(0);

        for (let i = 0; i < burstCount; i++) {
          setBurstProgress(i + 1);
          const uri = await captureSingle();
          if (uri) {
            burstUris.push(uri);
            setCapturedPhotos((prev) => [...prev, uri]);
          }
          // Pequeño intervalo para la ráfaga
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la captura.');
    } finally {
      setCapturing(false);
      setBurstProgress(0);
    }
  };

  // Abrir galería desde el modal
  const handleOpenGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso Denegado', 'Se necesita acceso a la galería para seleccionar fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: mode === 'burst',
        quality: 1.0,
      });

      if (!result.canceled) {
        const newUris = result.assets.map((asset) => asset.uri);
        setCapturedPhotos((prev) => [...prev, ...newUris]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la galería.');
    }
  };

  const removePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper para mostrar nivel de zoom de forma amigable (e.g. 1.0x, 2.0x, 5.0x, 8.0x)
  const getZoomLabel = () => {
    // Escala lineal aproximada para visualización
    const zoomMultiplier = 1 + zoom * 7;
    return `${zoomMultiplier.toFixed(1)}x`;
  };

  return (
    <MediaPickerContext.Provider value={{ showCamera: MediaPickerService.launchCamera }}>
      {children}

      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClose}
      >
        <View style={styles.container}>
          {/* Contenedor principal de la cámara */}
          <View style={styles.camera}>
            {/* Cámara Viewport por detrás */}
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing={facing}
              flash={flash}
              zoom={zoom}
              ref={cameraRef}
            />

            {/* Blink de captura */}
            {screenBlink && <View style={styles.blinkOverlay} />}

            {/* Controles superiores (Glassmorphism simulado con opacidad) */}
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.topButton} onPress={handleClose}>
                <X size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modeIndicator}
                onPress={() => setMode(prev => prev === 'photo' ? 'burst' : 'photo')}
                disabled={capturing}
              >
                <Text style={styles.modeText}>
                  {mode === 'photo' ? 'FOTO ÚNICA' : `RÁFAGA 5x ${burstProgress > 0 ? `(${burstProgress}/5)` : ''}`}
                </Text>
              </TouchableOpacity>

              <View style={styles.topRightControls}>
                <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
                  {flash === 'off' ? (
                    <ZapOff size={20} color="#9ca3af" />
                  ) : (
                    <Zap size={20} color={flash === 'on' ? '#f59e0b' : '#34d399'} />
                  )}
                  <Text style={styles.buttonSubtext}>
                    {flash === 'off' ? 'Off' : flash === 'on' ? 'On' : 'Auto'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.topButton} onPress={toggleFacing}>
                  <RefreshCw size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Controles de Zoom en el lateral derecho */}
            <View style={styles.zoomContainer}>
              <Text style={styles.zoomLabel}>{getZoomLabel()}</Text>
              {[0, 0.15, 0.5, 0.85].map((level, idx) => {
                const multipliers = ['1x', '2x', '5x', '8x'];
                const isActive = Math.abs(zoom - level) < 0.05;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.zoomButton, isActive && styles.zoomButtonActive]}
                    onPress={() => setZoom(level)}
                  >
                    <Text style={[styles.zoomText, isActive && styles.zoomTextActive]}>
                      {multipliers[idx]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Indicador de proceso de ráfaga */}
            {capturing && mode === 'burst' && (
              <View style={styles.burstProgressOverlay}>
                <ActivityIndicator size="large" color="#4d7c0f" />
                <Text style={styles.burstProgressText}>
                  Capturando ráfaga... {burstProgress} de {burstCount}
                </Text>
              </View>
            )}

            {/* Carrusel inferior de fotos capturadas antes del control */}
            <View style={styles.previewCarouselContainer}>
              {capturedPhotos.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.previewCarousel}
                >
                  {capturedPhotos.map((uri, idx) => (
                    <View key={idx} style={styles.thumbnailWrapper}>
                       <Image source={{ uri }} style={styles.thumbnail} />
                      <TouchableOpacity
                        style={styles.deleteThumbnail}
                        onPress={() => removePhoto(idx)}
                      >
                        <Trash2 size={12} color="#fff" />
                      </TouchableOpacity>
                      <View style={styles.photoIndexBadge}>
                        <Text style={styles.photoIndexText}>{idx + 1}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          {/* Panel inferior de disparador y galería */}
          <View style={styles.bottomPanel}>
            {/* Botón de galería */}
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenGallery}>
              <View style={styles.actionButtonInner}>
                <ImageIcon size={22} color="#4b5563" />
                <Text style={styles.actionButtonText}>Galería</Text>
              </View>
            </TouchableOpacity>

            {/* Botón de captura principal */}
            <TouchableOpacity
              style={[
                styles.shutterButton,
                mode === 'burst' && styles.shutterBurst,
                capturing && styles.shutterCapturing,
              ]}
              onPress={handleCapture}
              disabled={capturing}
            >
              <View
                style={[
                  styles.shutterInner,
                  mode === 'burst' && styles.shutterInnerBurst,
                  capturing && styles.shutterInnerCapturing,
                ]}
              >
                {capturing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : mode === 'burst' ? (
                  <Sliders size={24} color="#7c2d12" />
                ) : (
                  <Camera size={26} color="#4d7c0f" />
                )}
              </View>
            </TouchableOpacity>

            {/* Botón de aceptar / terminar */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                capturedPhotos.length === 0 && styles.actionButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={capturedPhotos.length === 0}
            >
              <View style={[styles.actionButtonInner, capturedPhotos.length > 0 && styles.actionButtonActive]}>
                <Check size={22} color={capturedPhotos.length > 0 ? '#fff' : '#9ca3af'} />
                <Text
                  style={[
                    styles.actionButtonText,
                    capturedPhotos.length > 0 && styles.actionButtonTextActive,
                  ]}
                >
                  Aceptar ({capturedPhotos.length})
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </MediaPickerContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? 45 : 20,
  },
  blinkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 99,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSubtext: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: -2,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 12,
  },
  modeIndicator: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  zoomContainer: {
    position: 'absolute',
    right: 16,
    top: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  zoomLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  zoomButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonActive: {
    backgroundColor: '#4d7c0f',
  },
  zoomText: {
    color: '#ccc',
    fontSize: 10,
    fontWeight: '700',
  },
  zoomTextActive: {
    color: '#fff',
  },
  burstProgressOverlay: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  burstProgressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewCarouselContainer: {
    height: 100,
    justifyContent: 'center',
  },
  previewCarousel: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: 'center',
  },
  thumbnailWrapper: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  deleteThumbnail: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIndexBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    borderRadius: 6,
  },
  photoIndexText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  bottomPanel: {
    height: 130,
    backgroundColor: '#fffcf8',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#f2e8cf',
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  shutterButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#4d7c0f',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  shutterBurst: {
    borderColor: '#c2410c',
  },
  shutterCapturing: {
    borderColor: '#9ca3af',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f3d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInnerBurst: {
    backgroundColor: '#ffedd5',
  },
  shutterInnerCapturing: {
    backgroundColor: '#f3f4f6',
  },
  actionButton: {
    width: 90,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonInner: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    gap: 4,
    minWidth: 80,
  },
  actionButtonActive: {
    backgroundColor: '#4d7c0f',
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  actionButtonTextActive: {
    color: '#fff',
  },
});
