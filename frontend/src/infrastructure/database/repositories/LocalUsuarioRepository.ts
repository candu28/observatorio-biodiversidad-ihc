import { ILocalUsuarioRepository } from '../../../application/ports/ILocalUsuarioRepository';
import { IUsuario } from '../../../../../contracts/types/IUsuario';
import { database } from '../index'; 
import UsuarioModel from '../models/Usuario';

/**
 * Adaptador de Infraestructura para el Agregado de Usuario.
 */
export class LocalUsuarioRepository implements ILocalUsuarioRepository {
  
  async getUsuarioById(id: string): Promise<IUsuario | null> {
    try {
      const usuarioRecord = await database.get<UsuarioModel>('usuarios').find(id);
      return usuarioRecord; // Gracias a que implementa IUsuario, esto es 100% válido y limpio
    } catch (error) {
      return null;
    }
  }

  async getAllUsuarios(): Promise<IUsuario[]> {
    return await database.get<UsuarioModel>('usuarios').query().fetch();
  }

  async saveUsuario(usuario: IUsuario): Promise<void> {
    await database.write(async () => {
      await database.get<UsuarioModel>('usuarios').create(record => {
        record._raw.id = usuario.id;
        record.nombre = usuario.nombre;
        record.ubicacion = usuario.ubicacion;
        record.bio = usuario.bio;
        record.fotoPerfilUrl = usuario.fotoPerfilUrl;
        record.interes = usuario.interes;
        record.totalAvistamientos = usuario.totalAvistamientos;
        record.createdAt = usuario.createdAt;
      });
    });
  }
}
