import { IMapPort } from '../ports/IMapPort';
import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';

export class ObtenerMapaUseCase {
  constructor(private readonly mapPort: IMapPort) {}

  async execute(params?: { categoryName?: string; online?: boolean }): Promise<IAvistamiento[]> {
    return await this.mapPort.getAvistamientos(params);
  }
}
