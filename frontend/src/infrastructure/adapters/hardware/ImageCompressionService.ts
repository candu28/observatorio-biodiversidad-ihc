import * as ImageManipulator from 'expo-image-manipulator';

export class ImageCompressionService {
  /**
   * Comprime y redimensiona una imagen local para optimizar el peso antes de subirla.
   * Redimensiona a un ancho de 1200px (manteniendo aspect ratio) y calidad 80%.
   */
  static async compressImage(uri: string): Promise<string> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return result.uri;
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
      return uri; // En caso de error, retorna la URI original para no romper el flujo
    }
  }
}
