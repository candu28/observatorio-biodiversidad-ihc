import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';
import { ILocalAvistamientoRepository } from '../ports/ILocalAvistamientoRepository';
import { IPerfilPort } from '../ports/IPerfilPort';

export type CrearAvistamientoInput = {
  especieVerifNombre: string;
  notas: string;
  ubicacion: string;
  fotoUrl: string; // La foto principal
  fotosExtra?: string[];
};

export class RegistrarAvistamientoUseCase {
  constructor(
    private readonly avistamientoRepo: ILocalAvistamientoRepository,
    private readonly perfilPort: IPerfilPort
  ) {}

  async execute(input: CrearAvistamientoInput): Promise<void> {
    const usuario = await this.perfilPort.getUsuarioActual();
    
    if (!usuario) {
      throw new Error('Debe iniciar sesión para registrar un avistamiento.');
    }

    const nuevoAvistamiento: IAvistamiento = {
      id: Math.random().toString(36).substring(2, 10),
      numeroPublicacion: Date.now(),
      autorId: usuario.id,
      estado: 'Pendiente',
      fechaCreacion: new Date().toISOString(),
      especieVerifNombre: input.especieVerifNombre,
      fotoUrl: input.fotoUrl,
      descripcionExperiencia: input.notas,
      latitud: 0,
      longitud: 0,
      ubicacionTexto: input.ubicacion,
      biomaId: '',
      categoriaId: '',
    };

    await this.avistamientoRepo.createAvistamiento(nuevoAvistamiento);
  }
}
