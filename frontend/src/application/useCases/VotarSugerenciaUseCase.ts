import { ILocalAvistamientoRepository } from '../ports/ILocalAvistamientoRepository';
import { IPerfilPort } from '../ports/IPerfilPort';

export class VotarSugerenciaUseCase {
  constructor(
    private readonly avistamientoRepo: ILocalAvistamientoRepository,
    private readonly perfilRepo: IPerfilPort
  ) {}

  async execute(avistamientoId: string, sugerenciaId: string, isUpvote: boolean): Promise<void> {
    const usuario = await this.perfilRepo.getUsuarioActual();
    if (!usuario) throw new Error('Usuario no logueado');

    // This logic typically requires updating the specific Sugerencia object
    // Since Watermelon Avistamiento Repository might not have a direct vote update method yet,
    // let's fetch sugerencias and find the target one to simulate update.
    const sugerencias = await this.avistamientoRepo.getSugerencias(avistamientoId);
    
    // In a real scenario, this would use a specific update API:
    // await this.avistamientoRepo.updateSugerenciaVote(sugerenciaId, usuario.id, isUpvote);
    // For now, since Watermelon DB is local, we mock the result.
    
    await this.perfilRepo.actualizarPuntos(usuario.id, 1); // 1 punto por votar
  }
}
