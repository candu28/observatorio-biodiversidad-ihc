import perfilUsuario from '../../../../../../contracts/mocks/perfil/usuario.json';
import avistamientos from '../../../../../../contracts/mocks/perfil/avistamientos.json';
import proyectos from '../../../../../../contracts/mocks/perfil/proyectos.json';

import { IUsuario } from '../../../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { IPerfilPort } from '../../../../application/ports/IPerfilPort';

export class MockPerfilRepository implements IPerfilPort {
  async getUsuarioActual(): Promise<IUsuario | null> {
    return perfilUsuario as IUsuario;
  }

  async getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]> {
    return (avistamientos as IAvistamiento[]).filter(avistamiento => avistamiento.autorId === usuarioId);
  }

  async getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]> {
    return (proyectos as IProyecto[]).filter(proyecto => proyecto.creadorId === usuarioId);
  }
}
