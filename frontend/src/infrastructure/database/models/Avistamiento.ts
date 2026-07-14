import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation, children } from '@nozbe/watermelondb/decorators';
import { IAvistamiento } from '../../../../../contracts/types/IAvistamiento';
import type { EstadoCertificacion } from '../../../../../contracts/types/IAvistamiento';


export default class Avistamiento extends Model implements IAvistamiento {
  static table = 'avistamientos';

  @field('numero_publicacion') numeroPublicacion!: number;
  @text('autor_id') autorId!: string;
  @text('foto_url') fotoUrl!: string;
  @text('descripcion_experiencia') descripcionExperiencia!: string;
  @field('latitud') latitud!: number;
  @field('longitud') longitud!: number;
  @text('ubicacion_texto') ubicacionTexto!: string;
  @text('bioma_id') biomaId!: string;
  @text('categoria_id') categoriaId!: string;
  @text('estado') estado!: EstadoCertificacion;
  @text('especie_verificada_id') especieVerificadaId?: string;
  @text('especie_verif_nombre') especieVerifNombre?: string;
  @text('especie_verif_nombre_cientifico') especieVerifNombreCientifico?: string;

  @date('created_at') _createdAt!: number;
  get fechaCreacion(): string { return new Date(this._createdAt).toISOString(); }
  set fechaCreacion(val: string) { this._createdAt = new Date(val).getTime(); }

  @date('updated_at') updatedAt!: number;

  @relation('usuarios', 'autor_id') autor!: any;
  @relation('biomas', 'bioma_id') bioma!: any;
  @relation('categorias_taxonomicas', 'categoria_id') categoria!: any;

  @children('comentarios_avistamiento') comentarios!: any;
  @children('sugerencias_especie') sugerencias!: any;
  @children('proyectos_avistamientos') proyectos!: any;
}
