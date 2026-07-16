import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { IComentarioAvistamiento } from '../../../../../../contracts/types/IComentarioAvistamiento';
import { ISugerenciaEspecie } from '../../../../../../contracts/types/ISugerenciaEspecie';
import { ILocalAvistamientoRepository } from '../../../../application/ports/ILocalAvistamientoRepository';
import { addAvistamientoEnMemoria, avistamientosEnMemoria } from '../mockState';

export class MockAvistamientoRepository implements ILocalAvistamientoRepository {
  async createAvistamiento(avistamiento: IAvistamiento): Promise<void> {
    addAvistamientoEnMemoria(avistamiento);
  }

  async getAvistamientos(): Promise<IAvistamiento[]> {
    return avistamientosEnMemoria;
  }
  
  async addComentario(comentario: IComentarioAvistamiento): Promise<void> {
    // Implementación mock vacía
  }

  async getComentarios(avistamientoId: string): Promise<IComentarioAvistamiento[]> {
    return [];
  }

  async addSugerencia(sugerencia: ISugerenciaEspecie): Promise<void> {
    // Implementación mock vacía
  }

  async getSugerencias(avistamientoId: string): Promise<ISugerenciaEspecie[]> {
    return [];
  }
}
