import { database } from '../../../database';
import { ILocalProyectoRepository } from '../../../../application/ports/ILocalProyectoRepository';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { Q } from '@nozbe/watermelondb';
import Proyecto from '../../../database/models/Proyecto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class WatermelonProyectoRepository implements ILocalProyectoRepository {
  async getProyectos(): Promise<IProyecto[]> {
    const proyectos = await database.collections.get<Proyecto>('proyectos').query(
      Q.sortBy('created_at', Q.desc)
    ).fetch();

    return proyectos.map(p => ({
      id: p.id,
      creadorId: p.creadorId,
      titulo: p.titulo,
      descripcion: p.descripcion,
      bioma: p.bioma,
      categoriasTaxonomicas: p.categoriasTaxonomicas,
      ubicacionGeografica: p.ubicacionGeografica,
      fechaInicio: p.fechaInicio,
      cantidadParticipantes: p.cantidadParticipantes,
    }));
  }

  async getProyectoById(id: string): Promise<IProyecto | null> {
    try {
      const p = await database.collections.get<Proyecto>('proyectos').find(id);
      return {
        id: p.id,
        creadorId: p.creadorId,
        titulo: p.titulo,
        descripcion: p.descripcion,
        bioma: p.bioma,
        categoriasTaxonomicas: p.categoriasTaxonomicas,
        ubicacionGeografica: p.ubicacionGeografica,
        fechaInicio: p.fechaInicio,
        cantidadParticipantes: p.cantidadParticipantes,
      };
    } catch {
      return null;
    }
  }

  observeProyectos(): Observable<IProyecto[]> {
    return database.collections.get<Proyecto>('proyectos').query(
      Q.sortBy('created_at', Q.desc)
    ).observe().pipe(
      map(proyectos => proyectos.map(p => ({
        id: p.id,
        creadorId: p.creadorId,
        titulo: p.titulo,
        descripcion: p.descripcion,
        bioma: p.bioma,
        categoriasTaxonomicas: p.categoriasTaxonomicas,
        ubicacionGeografica: p.ubicacionGeografica,
        fechaInicio: p.fechaInicio,
        cantidadParticipantes: p.cantidadParticipantes,
      })))
    );
  }

  async createProyecto(proyecto: IProyecto): Promise<void> {
    await database.write(async () => {
      await database.get<Proyecto>('proyectos').create(p => {
        p._raw.id = proyecto.id;
        p.creadorId = proyecto.creadorId;
        p.titulo = proyecto.titulo;
        p.descripcion = proyecto.descripcion;
        p.bioma = proyecto.bioma;
        p.categoriasTaxonomicas = proyecto.categoriasTaxonomicas || [];
        p.ubicacionGeografica = proyecto.ubicacionGeografica;
        p.fechaInicio = proyecto.fechaInicio;
        p.cantidadParticipantes = proyecto.cantidadParticipantes;
      });
    });
  }

  async addTarea(tarea: any): Promise<void> {
    await database.write(async () => {
      await database.get<any>('tareas_proyecto').create((t: any) => {
        t._raw.id = tarea.tareaId;
        t.proyectoId = tarea.proyectoId;
        t.tituloTarea = tarea.tituloTarea;
        t.descripcionInstrucciones = tarea.descripcionInstrucciones;
      });
    });
  }

  async getTareas(proyectoId: string): Promise<any[]> {
    const tareas = await database.get<any>('tareas_proyecto')
      .query(Q.where('proyecto_id', proyectoId))
      .fetch();
      
    return tareas.map((t: any) => ({
      tareaId: t.id,
      proyectoId: t.proyectoId,
      tituloTarea: t.tituloTarea,
      descripcionInstrucciones: t.descripcionInstrucciones,
    }));
  }

  async addAporte(aporte: any): Promise<void> {
    await database.write(async () => {
      await database.get<any>('aportes_tarea').create((a: any) => {
        a._raw.id = aporte.aporteId;
        a.proyectoId = aporte.proyectoId;
        a.tareaId = aporte.tareaId;
        a.usuarioId = aporte.usuarioId;
        a.tipoMultimedia = aporte.tipoMultimedia;
        a.archivoUrl = aporte.archivoUrl;
        a.comentarioDescriptivo = aporte.comentarioDescriptivo;
      });
    });
  }

  async getAportes(tareaId: string): Promise<any[]> {
    const aportes = await database.get<any>('aportes_tarea')
      .query(Q.where('tarea_id', tareaId))
      .fetch();
      
    return aportes.map((a: any) => ({
      aporteId: a.id,
      proyectoId: a.proyectoId,
      tareaId: a.tareaId,
      usuarioId: a.usuarioId,
      tipoMultimedia: a.tipoMultimedia,
      archivoUrl: a.archivoUrl,
      comentarioDescriptivo: a.comentarioDescriptivo,
      fechaAporte: new Date(a._raw.created_at).toISOString(),
    }));
  }

  async unirseAProyecto(proyectoId: string, usuarioId: string): Promise<void> {
    await database.write(async () => {
      // 1. Añadir el registro a participantes_proyecto
      const participantes = database.get<any>('participantes_proyecto');
      const alreadyJoined = await participantes.query(
        Q.where('proyecto_id', proyectoId),
        Q.where('usuario_id', usuarioId)
      ).fetch();
      
      if (alreadyJoined.length === 0) {
        await participantes.create((p: any) => {
          p.proyectoId = proyectoId;
          p.usuarioId = usuarioId;
        });
        
        // 2. Actualizar conteo en proyecto
        const proyecto = await database.get<Proyecto>('proyectos').find(proyectoId);
        await proyecto.update(p => {
          p.cantidadParticipantes = (p.cantidadParticipantes || 0) + 1;
        });
      }
    });
  }
}
