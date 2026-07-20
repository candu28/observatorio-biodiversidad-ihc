import { IProyecto } from '../../../../contracts/types/IProyecto';
import { ITareaProyecto } from '../../../../contracts/types/ITareaProyecto';
import { IAporteTarea } from '../../../../contracts/types/IAporteTarea';
import { Observable } from 'rxjs';

export interface ILocalProyectoRepository {
  // Proyectos
  createProyecto(proyecto: IProyecto): Promise<void>;
  getProyectos(): Promise<IProyecto[]>;
  observeProyectos(): Observable<IProyecto[]>;
  
  // Tareas (Parte del agregado de Proyecto)
  addTarea(tarea: ITareaProyecto): Promise<void>;
  getTareas(proyectoId: string): Promise<ITareaProyecto[]>;

  // Aportes (Parte del agregado de Proyecto)
  addAporte(aporte: IAporteTarea): Promise<void>;
  getAportes(tareaId: string): Promise<IAporteTarea[]>;
  
  // Participantes
  unirseAProyecto(proyectoId: string, usuarioId: string): Promise<void>;
}
