import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';

export interface IMapPort {
  getAvistamientos(params?: { categoryName?: string; online?: boolean }): Promise<IAvistamiento[]>;
}
