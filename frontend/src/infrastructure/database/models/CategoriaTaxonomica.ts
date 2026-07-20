import { Model } from '@nozbe/watermelondb';
import { text, date, children } from '@nozbe/watermelondb/decorators';
import { ICategoriaTaxonomica, NombreCategoria } from '../../../../../contracts/types/ICategoriaTaxonomica';

export default class CategoriaTaxonomica extends Model implements ICategoriaTaxonomica {
  static table = 'categorias_taxonomicas';

  @text('nombre') nombre!: NombreCategoria | string;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @children('especies') especies!: any;
  @children('avistamientos') avistamientos!: any;
}
