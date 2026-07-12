import { IUsuario } from '../../../../contracts/types/IUsuario';

export interface IObtenerPerfilUsuarioPort {
  getUsuarioActual(): Promise<IUsuario | null>;
}