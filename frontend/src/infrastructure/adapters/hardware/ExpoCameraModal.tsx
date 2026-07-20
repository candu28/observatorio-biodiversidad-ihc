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
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  Zap,
  ZapOff,
  Camera as CameraIcon,
  RefreshCw,
  Check,
  Image as ImageIcon,
  Trash2,
  Sliders,
} from 'lucide-react-native';
import { MediaPickerService, CameraOptions } from './MediaPickerService';
import { CapturedMedia } from '../../../application/ports/CapturedMedia';
import { LocationService, LocationCoords } from './LocationService';
import { ImageCompressionService } from './ImageCompressionService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MediaPickerContextType = {
  showCamera: (options: CameraOptions) => Promise<CapturedMedia[]>;
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
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedMedia[]>([]);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [zoom, setZoom] = useState(0); // Rango de 0 a 1
  const [capturing, setCapturing] = useState(false);
  const [burstProgress, setBurstProgress] = useState(0);
  const [screenBlink, setScreenBlink] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const [compressing, setCompressing] = useState(false);
  const [maxAllowed, setMaxAllowed] = useState(3);

  const cameraRef = useRef<any>(null);
  const resolverRef = useRef<((value: CapturedMedia[]) => void) | null>(null);
  const sessionLocationRef = useRef<LocationCoords | null>(null);

  // Pre-cargar la ubicación en segundo plano al abrir la cámara
  const requestLocationInBackground = async () => {
    try {
      const coords = await LocationService.requestAndGetCurrentLocation();
      sessionLocationRef.current = coords;
    } catch (e) {
      console.error('Error al pre-obtener ubicación en segundo plano:', e);
    }
  };

  // Registrar el manejador en el servicio
  useEffect(() => {
    MediaPickerService.registerHandler(async (options) => {
      try {
        // Solicitar permisos de cámara
        const permResult = await requestPermission();
        if (!permResult || !permResult.granted) {
          Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para tomar fotografías.');
          return [];
        }

        setMode(options.mode);
        if (options.mode === 'burst' && options.burstCount) {
          setBurstCount(options.burstCount);
        }
        setMaxAllowed(options.maxAllowed ?? 3);
      } catch (err) {
        Alert.alert('Error', 'No se pudo solicitar el permiso de la cámara.');
        return [];
      }
      setCapturedPhotos([]);
      setZoom(0);
      setVisible(true);

      // Pre-obtener ubicación para tomar fotos rápidamente sin delay del GPS
      requestLocationInBackground();

      return new Promise<CapturedMedia[]>((resolve) => {
        resolverRef.current = resolve;
      });
    });

    return () => {
      MediaPickerService.unregisterHandler();
    };
  }, [requestPermission]);

  const handleClose = () => {
    setVisible(false);
    if (resolverRef.current) {
      resolverRef.current([]); // Cancelar devuelve un arreglo vacío
      resolverRef.current = null;
    }
  };

  // Confirmar y subir las fotos capturadas
  const handleConfirm = async () => {
    if (capturedPhotos.length === 0) return;
    setCompressing(true);

    try {
      const selectedMedia = capturedPhotos.slice(0, maxAllowed);
      const compressedMediaList: CapturedMedia[] = [];

      for (const item of selectedMedia) {
        const compressedUri = await ImageCompressionService.compressImage(item.uri);
        compressedMediaList.push({
          ...item,
          uri: compressedUri,
        });
      }

      setVisible(false);

      if (resolverRef.current) {
        resolverRef.current(compressedMediaList);
        resolverRef.current = null;
      }
    } catch (error) {
      console.error('Error al procesar/comprimir fotos:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar las fotos para subir.');
    } finally {
      setCompressing(false);
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

  // Capturar una sola foto de forma rápida (usa ubicación pre-cargada)
  const captureSingle = async (): Promise<CapturedMedia | null> => {
    if (!cameraRef.current) return null;
    try {
      triggerBlink();
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1.0, // Calidad alta (se comprime después de elegir)
        skipProcessing: false,
        exif: true,
      });

      const exifCoords = LocationService.parseExifGPS(photo.exif);
      const deviceCoords = sessionLocationRef.current;

      return {
        uri: photo.uri,
        latitude: exifCoords?.latitude ?? deviceCoords?.latitude,
        longitude: exifCoords?.longitude ?? deviceCoords?.longitude,
        exif: photo.exif,
      };
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
        const media = await captureSingle();
        if (media) {
          setCompressing(true);
          try {
            const compressedUri = await ImageCompressionService.compressImage(media.uri);
            const finalMedia = { ...media, uri: compressedUri };
            
            setVisible(false);
            if (resolverRef.current) {
              resolverRef.current([finalMedia]);
              resolverRef.current = null;
            }
          } catch(e) {
            console.error(e);
          } finally {
            setCompressing(false);
          }
        }
      } else {
        // Modo ráfaga
        const burstUris: CapturedMedia[] = [];
        setBurstProgress(0);

        for (let i = 0; i < burstCount; i++) {
          setBurstProgress(i + 1);
          const media = await captureSingle();
          if (media) {
            burstUris.push(media);
            setCapturedPhotos((prev) => [...prev, media]);
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

      if (maxAllowed <= 0) {
        Alert.alert('Límite de Fotos', 'Ya has alcanzado el límite máximo de 3 fotos para este avistamiento.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: maxAllowed > 1,
        quality: 1.0,
        exif: true,
      });

      if (!result.canceled && result.assets) {
        // Regla de negocio: Máximo de fotos permitidas según el espacio restante
        if (result.assets.length > maxAllowed) {
          Alert.alert(
            'Límite de Selección',
            `Solo puedes seleccionar un máximo de ${maxAllowed} ${maxAllowed === 1 ? 'foto' : 'fotos'} de la galería.`
          );
          return;
        }

        const newMedia = result.assets.map((asset) => {
          const exifCoords = LocationService.parseExifGPS(asset.exif);
          return {
            uri: asset.uri,
            latitude: exifCoords?.latitude,
            longitude: exifCoords?.longitude,
            exif: asset.exif,
          };
        });

        setCompressing(true);
        try {
          const compressedMediaList: CapturedMedia[] = [];
          for (const item of newMedia) {
            const compressedUri = await ImageCompressionService.compressImage(item.uri);
            compressedMediaList.push({ ...item, uri: compressedUri });
          }
          
          setVisible(false);
          if (resolverRef.current) {
            resolverRef.current(compressedMediaList);
            resolverRef.current = null;
          }
        } catch (e) {
          console.error('Error procesando fotos de galería:', e);
        } finally {
          setCompressing(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la galería.');
    }
  };

  const removePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const getZoomLabel = () => {
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
            {/* ── VIEWPORT DE LA CÁMARA ── */}
            <View style={styles.cameraContainer}>
              <View style={styles.camera}>
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  facing={facing}
                  flash={flash}
                  zoom={zoom}
                  ref={cameraRef}
                />

                {screenBlink && <View style={styles.blinkOverlay} />}

                {/* Controles superiores */}
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

                {/* Info de ayuda en pantalla */}
                <View style={styles.infoOverlay}>
                  <Text style={styles.infoText}>Puedes capturar cuantas fotos quieras consecutivamente.</Text>
                </View>

                {/* Controles de Zoom */}
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

                {capturing && mode === 'burst' && (
                  <View style={styles.burstProgressOverlay}>
                    <ActivityIndicator size="large" color="#4d7c0f" />
                    <Text style={styles.burstProgressText}>
                      Capturando ráfaga... {burstProgress} de {burstCount}
                    </Text>
                  </View>
                )}

                {/* Carrusel inferior de fotos capturadas */}
                <View style={styles.previewCarouselContainer}>
                  {capturedPhotos.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.previewCarousel}
                    >
                      {capturedPhotos.map((media, idx) => (
                        <View key={idx} style={styles.thumbnailWrapper}>
                          <Image source={{ uri: media.uri }} style={styles.thumbnail} />
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
                <TouchableOpacity style={styles.actionButton} onPress={handleOpenGallery}>
                  <View style={styles.actionButtonInner}>
                    <ImageIcon size={22} color="#4b5563" />
                    <Text style={styles.actionButtonText}>Galería</Text>
                  </View>
                </TouchableOpacity>

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
                      <CameraIcon size={26} color="#4d7c0f" />
                    )}
                  </View>
                </TouchableOpacity>

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
  cameraContainer: {
    flex: 1,
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
  infoOverlay: {
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  infoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  zoomContainer: {
    position: 'absolute',
    right: 16,
    top: '25%',
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

  /* ── ESTILOS PANTALLA DE SELECCIÓN ── */
  selectionContainer: {
    flex: 1,
    backgroundColor: '#fdf8ee',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    justifyContent: 'space-between',
  },
  selectionHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2e8cf',
  },
  selectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#342a1a',
  },
  selectionSubtitle: {
    fontSize: 12,
    color: '#6b5b3e',
    marginTop: 6,
    lineHeight: 16,
  },
  gridContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: (SCREEN_WIDTH - 44) / 3,
    height: (SCREEN_WIDTH - 44) / 3,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: '#eae3d2',
  },
  gridItemSelected: {
    borderColor: '#4d7c0f',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 5,
  },
  checkBadgeActive: {
    backgroundColor: '#4d7c0f',
    borderColor: '#4d7c0f',
  },
  checkBadgeInactive: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: '#fff',
  },
  gridDeleteButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  compressingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253, 248, 238, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  compressingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#4d7c0f',
    fontWeight: '700',
    textAlign: 'center',
  },
  selectionBottomPanel: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f2e8cf',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelSelectionButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#b5a98a',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelSelectionText: {
    color: '#6b5b3e',
    fontSize: 14,
    fontWeight: '700',
  },
  confirmSelectionButton: {
    flex: 1.2,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4d7c0f',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4d7c0f',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  confirmSelectionButtonDisabled: {
    backgroundColor: '#a3b899',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmSelectionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});

