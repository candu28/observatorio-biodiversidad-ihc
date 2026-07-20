import { IUsuario } from '../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../contracts/types/IProyecto';

export interface IPerfilPort {
  getUsuarioActual(): Promise<IUsuario | null>;
  getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]>;
  getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]>;
}
