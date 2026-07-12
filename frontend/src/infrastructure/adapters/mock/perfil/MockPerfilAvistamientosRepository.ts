import avistamientos from '../../../../../../contracts/mocks/perfil/avistamientos.json';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { IObtenerAvistamientosPerfilPort } from '../../../../application/ports/IObtenerAvistamientosPerfilPort';

export class MockPerfilAvistamientosRepository implements IObtenerAvistamientosPerfilPort {
  async getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]> {
    return (avistamientos as IAvistamiento[]).filter(avistamiento => avistamiento.autorId === usuarioId);
  }
}