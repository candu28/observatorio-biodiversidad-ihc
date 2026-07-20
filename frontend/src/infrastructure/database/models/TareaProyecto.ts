import { Model } from '@nozbe/watermelondb';
import { text, date, relation, children } from '@nozbe/watermelondb/decorators';
import { ITareaProyecto } from '../../../../../contracts/types/ITareaProyecto';

export default class TareaProyecto extends Model implements ITareaProyecto {
  static table = 'tareas_proyecto';

  get tareaId(): string { return this.id; }
  
  @text('proyecto_id') proyectoId!: string;
  @text('titulo_tarea') tituloTarea!: string;
  @text('descripcion_instrucciones') descripcionInstrucciones!: string;

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('proyectos', 'proyecto_id') proyecto!: any;
  @children('aportes_tarea') aportes!: any;
}
