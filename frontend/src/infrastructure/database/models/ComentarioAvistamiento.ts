import { Model } from '@nozbe/watermelondb';
import { text, date, relation } from '@nozbe/watermelondb/decorators';

export default class ComentarioAvistamiento extends Model {
  static table = 'comentarios_avistamiento';

  @text('contenido') contenido!: string;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('avistamientos', 'avistamiento_id') avistamiento!: any;
  @relation('usuarios', 'autor_id') autor!: any;
}
