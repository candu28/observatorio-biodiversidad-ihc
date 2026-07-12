import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation } from '@nozbe/watermelondb/decorators';

export default class SugerenciaEspecie extends Model {
  static table = 'sugerencias_especie';

  @text('nombre_propuesto') nombrePropuesto!: string;
  @field('votos_a_favor') votosAFavor!: number;
  @field('votos_en_contra') votosEnContra!: number;
  @text('usuarios_interaccion_ids') usuariosInteraccionIds!: string; // JSON Array

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('avistamientos', 'avistamiento_id') avistamiento!: any;
  @relation('usuarios', 'usuario_id') usuario!: any;
}
