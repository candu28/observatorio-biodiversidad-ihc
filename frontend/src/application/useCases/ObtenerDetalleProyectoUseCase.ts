import { IProyecto } from '../../../../contracts/types/IProyecto';
import { ITareaProyecto } from '../../../../contracts/types/ITareaProyecto';
import { IAporteTarea } from '../../../../contracts/types/IAporteTarea';
import { ILocalProyectoRepository } from '../ports/ILocalProyectoRepository';

export interface ProyectoDetalleViewModel {
  proyecto: IProyecto;
  tareas: (ITareaProyecto & { aportes: IAporteTarea[] })[];
}

export class ObtenerDetalleProyectoUseCase {
  constructor(private readonly proyectoRepository: ILocalProyectoRepository) {}

  async execute(proyectoId: string): Promise<ProyectoDetalleViewModel | null> {
    const proyectos = await this.proyectoRepository.getProyectos();
    const proyecto = proyectos.find(p => p.id === proyectoId);

    if (!proyecto) return null;

    const tareas = await this.proyectoRepository.getTareas(proyectoId);

    const tareasConAportes = await Promise.all(
      tareas.map(async (tarea) => {
        const aportes = await this.proyectoRepository.getAportes(tarea.tareaId);
        return {
          ...tarea,
          aportes
        };
      })
    );

    return {
      proyecto,
      tareas: tareasConAportes
    };
  }
}
