import { IMediaPickerPort } from '../../../application/ports/IMediaPickerPort';
import { MediaPickerService } from './MediaPickerService';
import * as ImagePicker from 'expo-image-picker';

export class ExpoCameraAdapter implements IMediaPickerPort {
  /**
   * Abre la cámara en modo foto única tras verificar y solicitar permisos.
   */
  async takePhoto(): Promise<string[]> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permiso de cámara denegado. No se puede capturar la foto.');
    }
    return MediaPickerService.launchCamera({ mode: 'photo' });
  }

  /**
   * Abre la cámara en modo ráfaga tras verificar y solicitar permisos.
   */
  async takeBurst(count: number): Promise<string[]> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permiso de cámara denegado. No se puede iniciar la ráfaga.');
    }
    return MediaPickerService.launchCamera({ mode: 'burst', burstCount: count });
  }

  /**
   * Abre la biblioteca del dispositivo para seleccionar fotos.
   */
  async pickFromGallery(multiple: boolean): Promise<string[]> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permiso de biblioteca de medios denegado.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: multiple,
      quality: 1.0, // Calidad máxima para el reconocimiento de especies
    });

    if (result.canceled) {
      return [];
    }

    return result.assets.map((asset) => asset.uri);
  }
}
