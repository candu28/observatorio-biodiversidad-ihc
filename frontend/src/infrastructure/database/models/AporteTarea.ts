import { Model } from '@nozbe/watermelondb';
import { text, date, relation } from '@nozbe/watermelondb/decorators';

export default class AporteTarea extends Model {
  static table = 'aportes_tarea';

  @text('tipo_multimedia') tipoMultimedia!: string;
  @text('archivo_url') archivoUrl!: string;
  @text('comentario_descriptivo') comentarioDescriptivo!: string;

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('proyectos', 'proyecto_id') proyecto!: any;
  @relation('tareas_proyecto', 'tarea_id') tarea!: any;
  @relation('usuarios', 'usuario_id') usuario!: any;
}
