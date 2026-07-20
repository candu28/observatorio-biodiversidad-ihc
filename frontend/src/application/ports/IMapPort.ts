import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';

export interface IMapPort {
  getAvistamientos(): Promise<IAvistamiento[]>;
}
