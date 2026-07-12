import { Model } from '@nozbe/watermelondb';
import { field, text, date, children, relation } from '@nozbe/watermelondb/decorators';

export default class Proyecto extends Model {
  static table = 'proyectos';

  @text('titulo') titulo!: string;
  @text('descripcion') descripcion!: string;
  @text('bioma') bioma!: string;
  @text('categorias_taxonomicas') categoriasTaxonomicas!: string; // JSON
  @text('ubicacion_geografica') ubicacionGeografica!: string;
  @date('fecha_inicio') fechaInicio!: number;
  @field('cantidad_participantes') cantidadParticipantes!: number;

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('usuarios', 'creador_id') creador!: any;

  @children('tareas_proyecto') tareas!: any;
  @children('participantes_proyecto') participantes!: any;
}
