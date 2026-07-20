import { ILocalAvistamientoRepository } from '../ports/ILocalAvistamientoRepository';
import { IPerfilPort } from '../ports/IPerfilPort';
import { IComentarioAvistamiento } from '../../../../contracts/types/IComentarioAvistamiento';

export class AgregarComentarioUseCase {
  constructor(
    private readonly avistamientoRepo: ILocalAvistamientoRepository,
    private readonly perfilRepo: IPerfilPort
  ) {}

  async execute(avistamientoId: string, texto: string): Promise<void> {
    const usuario = await this.perfilRepo.getUsuarioActual();
    if (!usuario) throw new Error('Usuario no logueado');

    const nuevoComentario: IComentarioAvistamiento = {
      comentarioId: Date.now().toString(),
      avistamientoId,
      autorId: usuario.id,
      contenido: texto,
      fechaCreacion: new Date().toISOString(),
    };

    await this.avistamientoRepo.addComentario(nuevoComentario);
    
    // Asignar puntos por comentar
    await this.perfilRepo.actualizarPuntos(usuario.id, 2);
  }
}
