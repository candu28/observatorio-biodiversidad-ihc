import { IUsuario } from '../../../../contracts/types/IUsuario';

/**
 * Puerto (Interfaz) que define qué operaciones podemos hacer con un Usuario.
 * La UI solo conocerá esta interfaz, NO a WatermelonDB.
 */
export interface IUsuarioRepository {
  getUsuarioById(id: string): Promise<IUsuario | null>;
  getAllUsuarios(): Promise<IUsuario[]>;
  saveUsuario(usuario: IUsuario): Promise<void>;
}
