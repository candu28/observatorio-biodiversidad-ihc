import { Model } from '@nozbe/watermelondb';
import { text, date, children } from '@nozbe/watermelondb/decorators';

export default class CategoriaTaxonomica extends Model {
  static table = 'categorias_taxonomicas';

  @text('nombre') nombre!: string;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @children('especies') especies!: any;
  @children('avistamientos') avistamientos!: any;
}
