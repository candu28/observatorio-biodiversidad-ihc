import proyectos from '../../../../../../contracts/mocks/perfil/proyectos.json';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { IObtenerProyectosPerfilPort } from '../../../../application/ports/IObtenerProyectosPerfilPort';

export class MockPerfilProyectosRepository implements IObtenerProyectosPerfilPort {
  async getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]> {
    return (proyectos as IProyecto[]).filter(proyecto => proyecto.creadorId === usuarioId);
  }
}