export type CameraOptions = {
  mode: 'photo' | 'burst';
  burstCount?: number;
};

export type CameraUIHandler = (options: CameraOptions) => Promise<string[]>;

export class MediaPickerService {
  private static handler: CameraUIHandler | null = null;

  /**
   * Registra el manejador de la interfaz de la cámara (normalmente un componente Modal).
   */
  public static registerHandler(handler: CameraUIHandler) {
    this.handler = handler;
  }

  /**
   * Desregistra el manejador de la cámara.
   */
  public static unregisterHandler() {
    this.handler = null;
  }

  /**
   * Dispara e inicializa la UI de la cámara para tomar fotos individuales o ráfagas.
   */
  public static async launchCamera(options: CameraOptions): Promise<string[]> {
    if (!this.handler) {
      throw new Error(
        'El manejador de la UI de la cámara no está registrado. Asegúrese de que MediaPickerProvider esté montado en la raíz.'
      );
    }
    return this.handler(options);
  }
}
