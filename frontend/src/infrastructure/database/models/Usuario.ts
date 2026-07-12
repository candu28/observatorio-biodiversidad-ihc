import { Model } from '@nozbe/watermelondb';
import { field, text, date, children } from '@nozbe/watermelondb/decorators';

export default class Usuario extends Model {
  static table = 'usuarios';

  @text('nombre') nombre!: string;
  @text('ubicacion') ubicacion!: string;
  @text('bio') bio?: string;
  @text('foto_perfil_url') fotoPerfilUrl?: string;
  @text('interes') interes!: string; // JSON string
  @field('total_avistamientos') totalAvistamientos!: number;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  @children('avistamientos') avistamientos!: any;
  @children('proyectos') proyectosCreados!: any;
  @children('participantes_proyecto') participaciones!: any;
}
