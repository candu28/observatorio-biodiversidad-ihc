import { IUsuario } from '../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../contracts/types/IProyecto';

export interface IPerfilPort {
  getUsuarioActual(): Promise<IUsuario | null>;
  createUsuario(usuario: IUsuario): Promise<void>;
  updateUsuario(usuarioId: string, data: Partial<IUsuario>): Promise<void>;
  getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]>;
  getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]>;
  registrarInteres(usuarioId: string, avistamientoId: string): Promise<void>;
  actualizarPuntos(usuarioId: string, puntos: number): Promise<void>;
}
