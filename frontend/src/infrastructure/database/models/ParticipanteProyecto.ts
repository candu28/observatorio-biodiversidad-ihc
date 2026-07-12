import { Model } from '@nozbe/watermelondb';
import { date, relation } from '@nozbe/watermelondb/decorators';

export default class ParticipanteProyecto extends Model {
  static table = 'participantes_proyecto';

  @date('created_at') createdAt!: number; // equivalente a fecha_union
  @date('updated_at') updatedAt!: number;

  @relation('proyectos', 'proyecto_id') proyecto!: any;
  @relation('usuarios', 'usuario_id') usuario!: any;
}
