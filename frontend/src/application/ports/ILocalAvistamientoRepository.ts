import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';
import { IComentarioAvistamiento } from '../../../../contracts/types/IComentarioAvistamiento';
import { ISugerenciaEspecie } from '../../../../contracts/types/ISugerenciaEspecie';

export interface ILocalAvistamientoRepository {
  // Avistamientos
  createAvistamiento(avistamiento: IAvistamiento): Promise<void>;
  getAvistamientos(): Promise<IAvistamiento[]>;
  getAvistamientoById(id: string): Promise<IAvistamiento | null>;
  observeAvistamientoById(id: string): any;
  
  // Comentarios (Parte del agregado de Avistamiento)
  addComentario(comentario: IComentarioAvistamiento): Promise<void>;
  getComentarios(avistamientoId: string): Promise<IComentarioAvistamiento[]>;

  // Sugerencias (Parte del agregado de Avistamiento)
  addSugerencia(sugerencia: ISugerenciaEspecie): Promise<void>;
  getSugerencias(avistamientoId: string): Promise<ISugerenciaEspecie[]>;
}
