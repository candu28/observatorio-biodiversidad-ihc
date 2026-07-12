import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation } from '@nozbe/watermelondb/decorators';
import { ISugerenciaEspecie } from '../../../../../contracts/types/ISugerenciaEspecie';

export default class SugerenciaEspecie extends Model implements ISugerenciaEspecie {
  static table = 'sugerencias_especie';

  @text('avistamiento_id') avistamientoId!: string;
  @text('usuario_id') usuarioId!: string;
  @text('nombre_propuesto') nombrePropuesto!: string;
  @field('votos_a_favor') votosAFavor!: number;
  @field('votos_en_contra') votosEnContra!: number;
  
  @text('usuarios_interaccion_ids') _usuariosInteraccionIds!: string; // JSON Array
  get usuariosInteraccionIds(): string[] { return this._usuariosInteraccionIds ? JSON.parse(this._usuariosInteraccionIds) : []; }
  set usuariosInteraccionIds(val: string[]) { this._usuariosInteraccionIds = JSON.stringify(val); }

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('avistamientos', 'avistamiento_id') avistamiento!: any;
  @relation('usuarios', 'usuario_id') usuario!: any;
}
