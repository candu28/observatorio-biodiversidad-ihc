import { Model } from '@nozbe/watermelondb';
import { text, date, relation } from '@nozbe/watermelondb/decorators';

export default class ParticipanteProyecto extends Model {
  static table = 'participantes_proyecto';

  @text('proyecto_id') proyectoId!: string;
  @text('usuario_id') usuarioId!: string;

  @date('created_at') createdAt!: number; // equivalente a fecha_union
  @date('updated_at') updatedAt!: number;

  @relation('proyectos', 'proyecto_id') proyecto!: any;
  @relation('usuarios', 'usuario_id') usuario!: any;
}
