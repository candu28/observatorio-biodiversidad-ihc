import { database } from '../../../database';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { IComentarioAvistamiento } from '../../../../../../contracts/types/IComentarioAvistamiento';
import { ISugerenciaEspecie } from '../../../../../../contracts/types/ISugerenciaEspecie';
import { ILocalAvistamientoRepository } from '../../../../application/ports/ILocalAvistamientoRepository';
import Avistamiento from '../../../database/models/Avistamiento';
import ComentarioAvistamiento from '../../../database/models/ComentarioAvistamiento';
import SugerenciaEspecie from '../../../database/models/SugerenciaEspecie';
import { Q } from '@nozbe/watermelondb';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class WatermelonAvistamientoRepository implements ILocalAvistamientoRepository {
  async createAvistamiento(avistamiento: IAvistamiento): Promise<void> {
    await database.write(async () => {
      await database.collections.get<Avistamiento>('avistamientos').create(a => {
        a._raw.id = avistamiento.id;
        a.numeroPublicacion = avistamiento.numeroPublicacion;
        a.autorId = avistamiento.autorId;
        a.fotoUrl = avistamiento.fotoUrl;
        a.descripcionExperiencia = avistamiento.descripcionExperiencia;
        a.latitud = avistamiento.latitud;
        a.longitud = avistamiento.longitud;
        a.ubicacionTexto = avistamiento.ubicacionTexto;
        a.biomaId = avistamiento.biomaId;
        a.categoriaId = avistamiento.categoriaId;
        a.estado = avistamiento.estado as any;
      });
    });
  }

  async getAvistamientos(): Promise<IAvistamiento[]> {
    const avistamientos = await database.collections.get<Avistamiento>('avistamientos').query().fetch();
    return avistamientos.map(a => this.mapAvistamiento(a));
  }

  async getAvistamientoById(id: string): Promise<IAvistamiento | null> {
    try {
      const a = await database.collections.get<Avistamiento>('avistamientos').find(id);
      return this.mapAvistamiento(a);
    } catch {
      return null;
    }
  }

  observeAvistamientoById(id: string): Observable<IAvistamiento | null> {
    return database.collections.get<Avistamiento>('avistamientos')
      .findAndObserve(id)
      .pipe(map(a => (a ? this.mapAvistamiento(a) : null)));
  }

  async addComentario(comentario: IComentarioAvistamiento): Promise<void> {
    await database.write(async () => {
      await database.collections.get<ComentarioAvistamiento>('comentarios_avistamiento').create(c => {
        c._raw.id = comentario.comentarioId;
        c.avistamientoId = comentario.avistamientoId;
        c.autorId = comentario.autorId;
        c.contenido = comentario.contenido;
      });
    });
  }

  async getComentarios(avistamientoId: string): Promise<IComentarioAvistamiento[]> {
    const comments = await database.collections.get<ComentarioAvistamiento>('comentarios_avistamiento').query(
      Q.where('avistamiento_id', avistamientoId)
    ).fetch();
    return comments.map(c => ({
      comentarioId: c.id,
      avistamientoId: c.avistamientoId,
      autorId: c.autorId,
      contenido: c.contenido,
      fechaCreacion: c.fechaCreacion,
    }));
  }

  async addSugerencia(sugerencia: ISugerenciaEspecie): Promise<void> {
    await database.write(async () => {
      await database.collections.get<SugerenciaEspecie>('sugerencias_especie').create(s => {
        s.avistamientoId = sugerencia.avistamientoId;
        s.usuarioId = sugerencia.usuarioId;
        s.nombrePropuesto = sugerencia.nombrePropuesto;
        s.votosAFavor = sugerencia.votosAFavor;
        s.votosEnContra = sugerencia.votosEnContra;
        s.usuariosInteraccionIds = sugerencia.usuariosInteraccionIds;
      });
    });
  }

  async getSugerencias(avistamientoId: string): Promise<ISugerenciaEspecie[]> {
    const sugerencias = await database.collections.get<SugerenciaEspecie>('sugerencias_especie').query(
      Q.where('avistamiento_id', avistamientoId)
    ).fetch();
    return sugerencias.map(s => ({
      avistamientoId: s.avistamientoId,
      usuarioId: s.usuarioId,
      nombrePropuesto: s.nombrePropuesto,
      votosAFavor: s.votosAFavor,
      votosEnContra: s.votosEnContra,
      usuariosInteraccionIds: s.usuariosInteraccionIds,
    }));
  }

  private mapAvistamiento(a: Avistamiento): IAvistamiento {
    return {
      id: a.id,
      numeroPublicacion: a.numeroPublicacion,
      autorId: a.autorId,
      fotoUrl: a.fotoUrl,
      descripcionExperiencia: a.descripcionExperiencia,
      latitud: a.latitud,
      longitud: a.longitud,
      ubicacionTexto: a.ubicacionTexto,
      biomaId: a.biomaId,
      categoriaId: a.categoriaId,
      estado: a.estado as any,
      fechaCreacion: a.fechaCreacion,
      especieVerificadaId: a.especieVerificadaId || undefined,
      especieVerifNombre: a.especieVerifNombre || undefined,
      especieVerifNombreCientifico: a.especieVerifNombreCientifico || undefined,
    };
  }
}
