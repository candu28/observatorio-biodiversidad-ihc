import { Model } from '@nozbe/watermelondb';
import { text, date, relation } from '@nozbe/watermelondb/decorators';

export default class ProyectoAvistamiento extends Model {
  static table = 'proyectos_avistamientos';

  @text('proyecto_id') proyectoId!: string;
  @text('avistamiento_id') avistamientoId!: string;

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('proyectos', 'proyecto_id') proyecto!: any;
  @relation('avistamientos', 'avistamiento_id') avistamiento!: any;
}
