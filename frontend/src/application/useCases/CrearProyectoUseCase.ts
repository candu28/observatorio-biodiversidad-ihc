import { IProyecto } from '../../../../contracts/types/IProyecto';
import { ITareaProyecto } from '../../../../contracts/types/ITareaProyecto';
import { ILocalProyectoRepository } from '../ports/ILocalProyectoRepository';

interface CrearProyectoRequest {
  proyecto: IProyecto;
  tareas: ITareaProyecto[];
}

export class CrearProyectoUseCase {
  constructor(private readonly proyectoRepository: ILocalProyectoRepository) {}

  async execute(request: CrearProyectoRequest): Promise<void> {
    const { proyecto, tareas } = request;

    // 1. Guardar el proyecto
    await this.proyectoRepository.createProyecto(proyecto);

    // 2. Guardar las tareas asociadas
    for (const tarea of tareas) {
      await this.proyectoRepository.addTarea(tarea);
    }
  }
}
