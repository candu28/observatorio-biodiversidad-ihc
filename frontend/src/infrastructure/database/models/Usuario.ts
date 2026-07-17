import { Model } from '@nozbe/watermelondb';
import { field, text, date, children } from '@nozbe/watermelondb/decorators';
import { IUsuario } from '../../../../../contracts/types/IUsuario';

export default class Usuario extends Model implements IUsuario {
  static table = 'usuarios';

  @text('nombre') nombre!: string;
  @text('ubicacion') ubicacion!: string;
  @text('bio') bio?: string;
  @text('foto_perfil_url') fotoPerfilUrl?: string;

  @text('interes') _interes!: string;
  get interes(): string[] { return this._interes ? JSON.parse(this._interes) : []; }
  set interes(val: string[]) { this._interes = JSON.stringify(val); }

  @field('total_avistamientos') totalAvistamientos!: number;
  @field('total_aciertos_especies') totalAciertosEspecies?: number;

  @date('created_at') _createdAt!: number;
  get createdAt(): string { return new Date(this._createdAt).toISOString(); }
  set createdAt(val: string) { this._createdAt = new Date(val).getTime(); }

  @date('updated_at') updatedAt!: number;

  @children('avistamientos') avistamientos!: any;
  @children('proyectos') proyectos!: any;
  @children('participantes_proyecto') participaciones!: any;
}
