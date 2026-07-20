import { CapturedMedia } from './CapturedMedia';

export interface IMediaPickerPort {
  /**
   * Abre la cámara para capturar una sola foto.
   * Promete retornar un arreglo con la ruta local de la imagen y metadatos.
   */
  takePhoto(existingCount?: number): Promise<CapturedMedia[]>;

  /**
   * Abre la cámara para capturar múltiples fotos en modo ráfaga.
   * @param count Número máximo de fotos a capturar de manera rápida.
   * Promete retornar un arreglo con las rutas locales de las imágenes capturadas y metadatos.
   */
  takeBurst(count: number, existingCount?: number): Promise<CapturedMedia[]>;

  /**
   * Abre la galería de fotos del dispositivo para seleccionar imágenes.
   * @param multiple Si se permite la selección múltiple de imágenes.
   * Promete retornar un arreglo con las rutas locales de las imágenes seleccionadas y metadatos.
   */
  pickFromGallery(multiple: boolean, existingCount?: number): Promise<CapturedMedia[]>;
}

