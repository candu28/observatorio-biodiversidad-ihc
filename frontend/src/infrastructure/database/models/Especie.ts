import { Model } from '@nozbe/watermelondb';
import { field, text, date, children, relation } from '@nozbe/watermelondb/decorators';

export default class Especie extends Model {
  static table = 'especies';

  @text('nombre_comun') nombreComun?: string;
  @text('nombre_cientifico') nombreCientifico!: string;
  @field('total_observaciones') totalObservaciones!: number;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('categorias_taxonomicas', 'categoria_id') categoria!: any;
  @children('avistamientos') avistamientos!: any;
}
