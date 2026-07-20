import { IMapPort } from '../../../../application/ports/IMapPort';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { avistamientosEnMemoria } from '../mockState';

export class MockMapRepository implements IMapPort {
  async getAvistamientos(): Promise<IAvistamiento[]> {
    return avistamientosEnMemoria;
  }
}
