import { Model } from '@nozbe/watermelondb';
import { text, date, children } from '@nozbe/watermelondb/decorators';

export default class Bioma extends Model {
  static table = 'biomas';

  @text('nombre') nombre!: string;
  @text('descripcion') descripcion?: string;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @children('avistamientos') avistamientos!: any;
}
