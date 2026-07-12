import { Model } from '@nozbe/watermelondb';
import { date, relation } from '@nozbe/watermelondb/decorators';

export default class ProyectoAvistamiento extends Model {
  static table = 'proyectos_avistamientos';

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('proyectos', 'proyecto_id') proyecto!: any;
  @relation('avistamientos', 'avistamiento_id') avistamiento!: any;
}
