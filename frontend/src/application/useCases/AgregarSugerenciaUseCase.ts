import { ILocalAvistamientoRepository } from '../ports/ILocalAvistamientoRepository';
import { IPerfilPort } from '../ports/IPerfilPort';
import { ISugerenciaEspecie } from '../../../../contracts/types/ISugerenciaEspecie';

export class AgregarSugerenciaUseCase {
  constructor(
    private readonly avistamientoRepo: ILocalAvistamientoRepository,
    private readonly perfilRepo: IPerfilPort
  ) {}

  async execute(avistamientoId: string, sugerenciaTexto: string): Promise<void> {
    const usuario = await this.perfilRepo.getUsuarioActual();
    if (!usuario) throw new Error('Usuario no logueado');

    const nuevaSugerencia: ISugerenciaEspecie = {
      avistamientoId,
      usuarioId: usuario.id,
      nombrePropuesto: sugerenciaTexto,
      votosAFavor: 1,
      votosEnContra: 0,
      usuariosInteraccionIds: [usuario.id],
    };

    await this.avistamientoRepo.addSugerencia(nuevaSugerencia);
    
    // Asignar puntos por contribuir
    await this.perfilRepo.actualizarPuntos(usuario.id, 5);
  }
}
