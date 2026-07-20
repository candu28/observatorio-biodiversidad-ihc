import { Model } from '@nozbe/watermelondb';
import { text, date, relation } from '@nozbe/watermelondb/decorators';
import { IAporteTarea } from '../../../../../contracts/types/IAporteTarea';

export default class AporteTarea extends Model implements IAporteTarea {
  static table = 'aportes_tarea';

  get aporteId(): string { return this.id; }
  
  @text('proyecto_id') proyectoId!: string;
  @text('tarea_id') tareaId!: string;
  @text('usuario_id') usuarioId!: string;

  @text('tipo_multimedia') tipoMultimedia!: 'Foto' | 'Video' | 'Audio';
  @text('archivo_url') archivoUrl!: string;
  @text('comentario_descriptivo') comentarioDescriptivo!: string;

  @date('created_at') _createdAt!: number;
  get fechaAporte(): string { return new Date(this._createdAt).toISOString(); }
  set fechaAporte(val: string) { this._createdAt = new Date(val).getTime(); }

  @date('updated_at') updatedAt!: number;

  @relation('proyectos', 'proyecto_id') proyecto!: any;
  @relation('tareas_proyecto', 'tarea_id') tarea!: any;
  @relation('usuarios', 'usuario_id') usuario!: any;
}
