import { database } from '../index';
import { ILocalProyectoRepository } from '../../../application/ports/ILocalProyectoRepository';
import { IProyecto } from '../../../../../contracts/types/IProyecto';
import { ITareaProyecto } from '../../../../../contracts/types/ITareaProyecto';
import { IAporteTarea } from '../../../../../contracts/types/IAporteTarea';
import ProyectoModel from '../models/Proyecto';
import TareaModel from '../models/TareaProyecto';
import AporteModel from '../models/AporteTarea';
import ParticipanteModel from '../models/ParticipanteProyecto';
import { Q } from '@nozbe/watermelondb';

export class LocalProyectoRepository implements ILocalProyectoRepository {
  
  async createProyecto(proyecto: IProyecto): Promise<void> {
    await database.write(async () => {
      await database.get<ProyectoModel>('proyectos').create(record => {
        record._raw.id = proyecto.id;
        record.creadorId = proyecto.creadorId;
        record.titulo = proyecto.titulo;
        record.descripcion = proyecto.descripcion;
        record.bioma = proyecto.bioma;
        record.categoriasTaxonomicas = proyecto.categoriasTaxonomicas;
        record.ubicacionGeografica = proyecto.ubicacionGeografica;
        record.fechaInicio = proyecto.fechaInicio;
        record.cantidadParticipantes = proyecto.cantidadParticipantes;
      });
    });
  }

  async getProyectos(): Promise<IProyecto[]> {
    return await database.get<ProyectoModel>('proyectos').query().fetch();
  }

  async addTarea(tarea: ITareaProyecto): Promise<void> {
    await database.write(async () => {
      await database.get<TareaModel>('tareas_proyecto').create(record => {
        record._raw.id = tarea.tareaId;
        record.proyectoId = tarea.proyectoId;
        record.tituloTarea = tarea.tituloTarea;
        record.descripcionInstrucciones = tarea.descripcionInstrucciones;
      });
    });
  }

  async getTareas(proyectoId: string): Promise<ITareaProyecto[]> {
    return await database.get<TareaModel>('tareas_proyecto')
      .query(Q.where('proyecto_id', proyectoId))
      .fetch();
  }

  async addAporte(aporte: IAporteTarea): Promise<void> {
    await database.write(async () => {
      await database.get<AporteModel>('aportes_tarea').create(record => {
        record._raw.id = aporte.aporteId;
        record.proyectoId = aporte.proyectoId;
        record.tareaId = aporte.tareaId;
        record.usuarioId = aporte.usuarioId;
        record.tipoMultimedia = aporte.tipoMultimedia;
        record.archivoUrl = aporte.archivoUrl;
        record.comentarioDescriptivo = aporte.comentarioDescriptivo;
        record.fechaAporte = aporte.fechaAporte;
      });
    });
  }

  async getAportes(tareaId: string): Promise<IAporteTarea[]> {
    return await database.get<AporteModel>('aportes_tarea')
      .query(Q.where('tarea_id', tareaId))
      .fetch();
  }

  async unirseAProyecto(proyectoId: string, usuarioId: string): Promise<void> {
    await database.write(async () => {
      await database.get<ParticipanteModel>('participantes_proyecto').create(record => {
        record.proyectoId = proyectoId;
        record.usuarioId = usuarioId;
      });
    });
  }
}
