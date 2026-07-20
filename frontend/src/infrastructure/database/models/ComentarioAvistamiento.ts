import { Model } from '@nozbe/watermelondb';
import { text, date, relation } from '@nozbe/watermelondb/decorators';
import { IComentarioAvistamiento } from '../../../../../contracts/types/IComentarioAvistamiento';

export default class ComentarioAvistamiento extends Model implements IComentarioAvistamiento {
  static table = 'comentarios_avistamiento';

  get comentarioId(): string { return this.id; }
  
  @text('avistamiento_id') avistamientoId!: string;
  @text('autor_id') autorId!: string;
  @text('contenido') contenido!: string;
  
  @date('created_at') _createdAt!: number;
  get fechaCreacion(): string { return new Date(this._createdAt).toISOString(); }
  set fechaCreacion(val: string) { this._createdAt = new Date(val).getTime(); }

  @date('updated_at') updatedAt!: number;

  @relation('avistamientos', 'avistamiento_id') avistamiento!: any;
  @relation('usuarios', 'autor_id') autor!: any;
}
