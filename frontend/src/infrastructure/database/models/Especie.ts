import { Model } from '@nozbe/watermelondb';
import { field, text, date, children, relation } from '@nozbe/watermelondb/decorators';
import { IEspecie } from '../../../../../contracts/types/IEspecie';

export default class Especie extends Model implements IEspecie {
  static table = 'especies';

  @text('nombre_comun') nombreComun?: string;
  @text('nombre_cientifico') nombreCientifico!: string;
  @text('categoria_id') categoriaId!: string;
  @field('total_observaciones') totalObservaciones!: number;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('categorias_taxonomicas', 'categoria_id') categoria!: any;
  @children('avistamientos') avistamientos!: any;
}
