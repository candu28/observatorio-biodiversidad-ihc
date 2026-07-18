import { IAporteTarea } from '../../../../contracts/types/IAporteTarea';
import { ILocalProyectoRepository } from '../ports/ILocalProyectoRepository';

export class AgregarAporteTareaUseCase {
  constructor(private readonly proyectoRepository: ILocalProyectoRepository) {}

  async execute(aporte: IAporteTarea): Promise<void> {
    await this.proyectoRepository.addAporte(aporte);
  }
}
