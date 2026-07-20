import { Model } from '@nozbe/watermelondb';
import { text, date, children } from '@nozbe/watermelondb/decorators';
import { IBioma, NombreBioma } from '../../../../../contracts/types/IBioma';

export default class Bioma extends Model implements IBioma {
  static table = 'biomas';

  @text('nombre') nombre!: NombreBioma | string;
  @text('descripcion') descripcion?: string;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @children('avistamientos') avistamientos!: any;
}
