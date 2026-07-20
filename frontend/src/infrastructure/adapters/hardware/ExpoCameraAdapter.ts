import { IMediaPickerPort } from '../../../application/ports/IMediaPickerPort';
import { CapturedMedia } from '../../../application/ports/CapturedMedia';
import { LocationService } from './LocationService';
import { MediaPickerService } from './MediaPickerService';
import { ImageCompressionService } from './ImageCompressionService';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export class ExpoCameraAdapter implements IMediaPickerPort {
  /**
   * Abre la cámara in-app personalizada para permitir múltiples fotos consecutivas.
   */
  async takePhoto(existingCount?: number): Promise<CapturedMedia[]> {
    const remainingSlots = 3 - (existingCount || 0);
    if (remainingSlots <= 0) {
      Alert.alert(
        'Límite de Fotos',
        'Ya has alcanzado el límite máximo de 3 fotos para este avistamiento.'
      );
      return [];
    }
    return await MediaPickerService.launchCamera({ mode: 'photo', maxAllowed: remainingSlots });
  }

  async takeBurst(count: number, existingCount?: number): Promise<CapturedMedia[]> {
    const remainingSlots = 3 - (existingCount || 0);
    if (remainingSlots <= 0) {
      Alert.alert(
        'Límite de Fotos',
        'Ya has alcanzado el límite máximo de 3 fotos para este avistamiento.'
      );
      return [];
    }
    return await MediaPickerService.launchCamera({ mode: 'burst', burstCount: count, maxAllowed: remainingSlots });
  }

  /**
   * Abre la biblioteca del dispositivo para seleccionar fotos (máximo 3 en total).
   */
  async pickFromGallery(multiple: boolean, existingCount?: number): Promise<CapturedMedia[]> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permiso de biblioteca de medios denegado.');
    }

    const currentCount = existingCount || 0;
    const remainingSlots = 3 - currentCount;

    if (remainingSlots <= 0) {
      Alert.alert(
        'Límite de Fotos',
        'Ya has alcanzado el límite máximo de 3 fotos para este avistamiento.'
      );
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: multiple && remainingSlots > 1,
      quality: 1.0,
      exif: true,
    });

    if (result.canceled || !result.assets) {
      return [];
    }

    // Regla de negocio: Máximo de fotos permitidas según el espacio restante
    if (result.assets.length > remainingSlots) {
      Alert.alert(
        'Límite de Selección',
        `Solo puedes seleccionar un máximo de ${remainingSlots} ${remainingSlots === 1 ? 'foto' : 'fotos'} para no superar el límite de 3 fotos por avistamiento.`
      );
      return [];
    }

    const processedMedia: CapturedMedia[] = [];

    for (const asset of result.assets) {
      const exifCoords = LocationService.parseExifGPS(asset.exif);
      // Comprimir la imagen usando el ImageCompressionService
      const compressedUri = await ImageCompressionService.compressImage(asset.uri);
      
      processedMedia.push({
        uri: compressedUri,
        latitude: exifCoords?.latitude,
        longitude: exifCoords?.longitude,
        exif: asset.exif,
      });
    }

    return processedMedia;
  }
}

