import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { ITareaProyecto } from '../../../../../../contracts/types/ITareaProyecto';
import { IAporteTarea } from '../../../../../../contracts/types/IAporteTarea';
import { ILocalProyectoRepository } from '../../../../application/ports/ILocalProyectoRepository';
import {
  proyectosEnMemoria,
  tareasEnMemoria,
  aportesEnMemoria,
  addProyectoEnMemoria,
  addTareaEnMemoria,
  addAporteEnMemoria
} from '../mockState';

export class MockProyectoRepository implements ILocalProyectoRepository {
  async createProyecto(proyecto: IProyecto): Promise<void> {
    addProyectoEnMemoria(proyecto);
  }

  async getProyectos(): Promise<IProyecto[]> {
    return proyectosEnMemoria;
  }

  async addTarea(tarea: ITareaProyecto): Promise<void> {
    addTareaEnMemoria(tarea);
  }

  async getTareas(proyectoId: string): Promise<ITareaProyecto[]> {
    return tareasEnMemoria.filter(t => t.proyectoId === proyectoId);
  }

  async addAporte(aporte: IAporteTarea): Promise<void> {
    addAporteEnMemoria(aporte);
  }

  async getAportes(tareaId: string): Promise<IAporteTarea[]> {
    return aportesEnMemoria.filter(a => a.tareaId === tareaId);
  }

  async unirseAProyecto(proyectoId: string, usuarioId: string): Promise<void> {
    // Mock implementation: could update cantidadParticipantes in memory if needed
    const proyecto = proyectosEnMemoria.find(p => p.id === proyectoId);
    if (proyecto) {
      proyecto.cantidadParticipantes += 1;
    }
  }
}
