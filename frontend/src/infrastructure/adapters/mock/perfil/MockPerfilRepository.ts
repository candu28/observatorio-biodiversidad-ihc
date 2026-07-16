import perfilUsuario from '../../../../../../contracts/mocks/perfil/usuario.json';
import { IUsuario } from '../../../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { IPerfilPort } from '../../../../application/ports/IPerfilPort';
import { avistamientosEnMemoria, proyectosEnMemoria } from '../mockState';

export class MockPerfilRepository implements IPerfilPort {
  async getUsuarioActual(): Promise<IUsuario | null> {
    return perfilUsuario as IUsuario;
  }

  async getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]> {
    return avistamientosEnMemoria.filter(avistamiento => avistamiento.autorId === usuarioId);
  }

  async getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]> {
    return proyectosEnMemoria.filter(proyecto => proyecto.creadorId === usuarioId);
  }
}
