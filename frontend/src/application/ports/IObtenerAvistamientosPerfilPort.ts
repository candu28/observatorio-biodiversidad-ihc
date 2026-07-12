import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';

export interface IObtenerAvistamientosPerfilPort {
  getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]>;
}