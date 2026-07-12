import { Model } from '@nozbe/watermelondb';
import { field, text, date, children, relation } from '@nozbe/watermelondb/decorators';

export default class Avistamiento extends Model {
  static table = 'avistamientos';

  @field('numero_publicacion') numeroPublicacion!: number;
  @text('foto_url') fotoUrl!: string;
  @text('descripcion_experiencia') descripcionExperiencia!: string;
  @field('latitud') latitud!: number;
  @field('longitud') longitud!: number;
  @text('ubicacion_texto') ubicacionTexto!: string;
  @text('estado') estado!: string;
  @text('especie_verif_nombre') especieVerifNombre?: string;
  @text('especie_verif_nombre_cientifico') especieVerifNombreCientifico?: string;

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @relation('usuarios', 'autor_id') autor!: any;
  @relation('biomas', 'bioma_id') bioma!: any;
  @relation('categorias_taxonomicas', 'categoria_id') categoria!: any;
  @relation('especies', 'especie_verificada_id') especieVerificada!: any;

  @children('comentarios_avistamiento') comentarios!: any;
  @children('sugerencias_especie') sugerencias!: any;
}
