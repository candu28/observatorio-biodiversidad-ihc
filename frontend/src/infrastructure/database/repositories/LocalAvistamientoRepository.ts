import { database } from '../index';
import { ILocalAvistamientoRepository } from '../../../application/ports/ILocalAvistamientoRepository';
import { IAvistamiento } from '../../../../../contracts/types/IAvistamiento';
import { IComentarioAvistamiento } from '../../../../../contracts/types/IComentarioAvistamiento';
import { ISugerenciaEspecie } from '../../../../../contracts/types/ISugerenciaEspecie';
import AvistamientoModel from '../models/Avistamiento';
import ComentarioModel from '../models/ComentarioAvistamiento';
import SugerenciaModel from '../models/SugerenciaEspecie';
import { Q } from '@nozbe/watermelondb';

export class LocalAvistamientoRepository implements ILocalAvistamientoRepository {
  
  async createAvistamiento(avistamiento: IAvistamiento): Promise<void> {
    await database.write(async () => {
      await database.get<AvistamientoModel>('avistamientos').create(record => {
        record._raw.id = avistamiento.id;
        record.numeroPublicacion = avistamiento.numeroPublicacion;
        record.autorId = avistamiento.autorId;
        record.fotoUrl = avistamiento.fotoUrl;
        record.descripcionExperiencia = avistamiento.descripcionExperiencia;
        record.latitud = avistamiento.latitud;
        record.longitud = avistamiento.longitud;
        record.ubicacionTexto = avistamiento.ubicacionTexto;
        record.biomaId = avistamiento.biomaId;
        record.categoriaId = avistamiento.categoriaId;
        record.estado = avistamiento.estado;
        if (avistamiento.especieVerificadaId) record.especieVerificadaId = avistamiento.especieVerificadaId;
        if (avistamiento.especieVerifNombre) record.especieVerifNombre = avistamiento.especieVerifNombre;
        if (avistamiento.especieVerifNombreCientifico) record.especieVerifNombreCientifico = avistamiento.especieVerifNombreCientifico;
        record.fechaCreacion = avistamiento.fechaCreacion;
      });
    });
  }

  async getAvistamientos(): Promise<IAvistamiento[]> {
    return await database.get<AvistamientoModel>('avistamientos').query().fetch();
  }

  async getAvistamientoById(id: string): Promise<IAvistamiento | null> {
    return null;
  }

  observeAvistamientoById(id: string): any {
    return null;
  }

  async addComentario(comentario: IComentarioAvistamiento): Promise<void> {
    await database.write(async () => {
      await database.get<ComentarioModel>('comentarios_avistamiento').create(record => {
        record._raw.id = comentario.comentarioId;
        record.avistamientoId = comentario.avistamientoId;
        record.autorId = comentario.autorId;
        record.contenido = comentario.contenido;
        record.fechaCreacion = comentario.fechaCreacion;
      });
    });
  }

  async getComentarios(avistamientoId: string): Promise<IComentarioAvistamiento[]> {
    return await database.get<ComentarioModel>('comentarios_avistamiento')
      .query(Q.where('avistamiento_id', avistamientoId))
      .fetch();
  }

  async addSugerencia(sugerencia: ISugerenciaEspecie): Promise<void> {
    await database.write(async () => {
      await database.get<SugerenciaModel>('sugerencias_especie').create(record => {
        record.avistamientoId = sugerencia.avistamientoId;
        record.usuarioId = sugerencia.usuarioId;
        record.nombrePropuesto = sugerencia.nombrePropuesto;
        record.votosAFavor = sugerencia.votosAFavor;
        record.votosEnContra = sugerencia.votosEnContra;
        record.usuariosInteraccionIds = sugerencia.usuariosInteraccionIds;
      });
    });
  }

  async getSugerencias(avistamientoId: string): Promise<ISugerenciaEspecie[]> {
    return await database.get<SugerenciaModel>('sugerencias_especie')
      .query(Q.where('avistamiento_id', avistamientoId))
      .fetch();
  }
}
