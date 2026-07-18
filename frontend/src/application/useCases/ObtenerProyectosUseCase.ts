import { IProyecto } from '../../../../contracts/types/IProyecto';
import { ILocalProyectoRepository } from '../ports/ILocalProyectoRepository';

export class ObtenerProyectosUseCase {
  constructor(private readonly proyectoRepository: ILocalProyectoRepository) {}

  async execute(): Promise<IProyecto[]> {
    return await this.proyectoRepository.getProyectos();
  }
}
