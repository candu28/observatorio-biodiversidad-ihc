import { Model } from '@nozbe/watermelondb';
import { field, text, date, children, relation } from '@nozbe/watermelondb/decorators';
import { IProyecto } from '../../../../../contracts/types/IProyecto';
import type { NombreBioma } from '../../../../../contracts/types/IBioma';
import { NombreCategoria } from '../../../../../contracts/types/ICategoriaTaxonomica';

export default class Proyecto extends Model implements IProyecto {
  static table = 'proyectos';

  @text('creador_id') creadorId!: string;
  @text('titulo') titulo!: string;
  @text('descripcion') descripcion!: string;
  @text('bioma') bioma!: NombreBioma;
  @text('ubicacion_geografica') ubicacionGeografica!: string;
  
  @text('categorias_taxonomicas') _categoriasTaxonomicas!: string; // JSON
  get categoriasTaxonomicas(): NombreCategoria[] { return this._categoriasTaxonomicas ? JSON.parse(this._categoriasTaxonomicas) : []; }
  set categoriasTaxonomicas(val: NombreCategoria[]) { this._categoriasTaxonomicas = JSON.stringify(val); }

  @date('fecha_inicio') _fechaInicio!: number;
  get fechaInicio(): string { return new Date(this._fechaInicio).toISOString(); }
  set fechaInicio(val: string) { this._fechaInicio = new Date(val).getTime(); }

  @field('cantidad_participantes') cantidadParticipantes!: number;

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('usuarios', 'creador_id') creador!: any;

  @children('tareas_proyecto') tareas!: any;
  @children('participantes_proyecto') participantes!: any;
}
