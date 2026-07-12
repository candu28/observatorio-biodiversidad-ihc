import perfilUsuario from '../../../../../../contracts/mocks/perfil/usuario.json';
import { IUsuario } from '../../../../../../contracts/types/IUsuario';
import { IObtenerPerfilUsuarioPort } from '../../../../application/ports/IObtenerPerfilUsuarioPort';

export class MockPerfilUsuarioRepository implements IObtenerPerfilUsuarioPort {
  async getUsuarioActual(): Promise<IUsuario | null> {
    return perfilUsuario as IUsuario;
  }
}