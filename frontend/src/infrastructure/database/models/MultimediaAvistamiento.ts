import { Model } from '@nozbe/watermelondb';
import { field, relation, readonly, date } from '@nozbe/watermelondb/decorators';

export default class MultimediaAvistamiento extends Model {
  static table = 'multimedia_avistamientos';

  @relation('avistamientos', 'avistamiento_id') avistamiento: any;
  @field('archivo_url') archivoUrl!: string;
  @field('tipo_multimedia') tipoMultimedia!: string;

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
