import { IProyecto } from '../../../../contracts/types/IProyecto';

export interface IObtenerProyectosPerfilPort {
  getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]>;
}