import { IMediaPickerPort } from '../ports/IMediaPickerPort';
import { CapturedMedia } from '../ports/CapturedMedia';

export type CapturarMultimediaInput =
  | { type: 'photo'; existingCount?: number }
  | { type: 'burst'; count: number; existingCount?: number }
  | { type: 'gallery'; multiple: boolean; existingCount?: number };

export class CapturarMultimediaAvistamiento {
  constructor(private readonly mediaPickerPort: IMediaPickerPort) {}

  /**
   * Ejecuta el caso de uso para capturar o seleccionar fotos.
   * Valida las reglas de negocio y delega en el puerto de hardware.
   */
  async execute(input: CapturarMultimediaInput): Promise<CapturedMedia[]> {
    let photos: CapturedMedia[] = [];

    switch (input.type) {
      case 'photo':
        photos = await this.mediaPickerPort.takePhoto(input.existingCount);
        break;

      case 'burst':
        // Regla de negocio: Ráfaga máxima de 10 fotos
        if (input.count > 10) {
          throw new Error('No se pueden capturar más de 10 fotos por ráfaga.');
        }
        if (input.count <= 0) {
          throw new Error('La ráfaga debe incluir al menos 1 foto.');
        }
        photos = await this.mediaPickerPort.takeBurst(input.count, input.existingCount);
        break;

      case 'gallery':
        photos = await this.mediaPickerPort.pickFromGallery(input.multiple, input.existingCount);
        break;

      default:
        throw new Error('Tipo de entrada multimedia no válido.');
    }

    // Regla de negocio: Un avistamiento no puede tener más de 3 fotos en total
    const totalCount = (input.existingCount || 0) + photos.length;
    if (totalCount > 3) {
      throw new Error('Un avistamiento no puede contener más de 3 fotos en total.');
    }

    return photos;
  }
}
