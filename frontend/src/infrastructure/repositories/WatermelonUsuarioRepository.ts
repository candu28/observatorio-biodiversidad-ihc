import { IUsuarioRepository } from '../../application/ports/IUsuarioRepository';
import { IUsuario } from '../../../../contracts/types/IUsuario';
import { database } from '../database/index'; // Importación explícita del index
import UsuarioModel from '../database/models/Usuario';

/**
 * Adaptador impulsado (Driven Adapter) que implementa el puerto usando WatermelonDB.
 */
export class WatermelonUsuarioRepository implements IUsuarioRepository {
  
  async getUsuarioById(id: string): Promise<IUsuario | null> {
    try {
      const usuarioRecord = await database.get<UsuarioModel>('usuarios').find(id);
      return this.mapToDomain(usuarioRecord);
    } catch (error) {
      return null; // Si no lo encuentra, Watermelon lanza error
    }
  }

  async getAllUsuarios(): Promise<IUsuario[]> {
    const records = await database.get<UsuarioModel>('usuarios').query().fetch();
    return records.map(record => this.mapToDomain(record));
  }

  async saveUsuario(usuario: IUsuario): Promise<void> {
    await database.write(async () => {
      await database.get<UsuarioModel>('usuarios').create(record => {
        // En Watermelon no podemos setear el ID manualmente en create a menos que desactivemos la generación de IDs,
        // pero para sincronización offline usualmente se usa un UUID pregenerado.
        record._raw.id = usuario.id; 
        record.nombre = usuario.nombre;
        record.ubicacion = usuario.ubicacion;
        record.bio = usuario.bio;
        record.fotoPerfilUrl = usuario.fotoPerfilUrl;
        record.interes = JSON.stringify(usuario.interes);
        record.totalAvistamientos = usuario.totalAvistamientos;
      });
    });
  }

  // Mapper de la entidad de Infraestructura (Watermelon) a la Entidad de Dominio Pura (Contratos)
  private mapToDomain(record: UsuarioModel): IUsuario {
    return {
      id: record.id,
      nombre: record.nombre,
      ubicacion: record.ubicacion,
      bio: record.bio || undefined,
      fotoPerfilUrl: record.fotoPerfilUrl || undefined,
      interes: record.interes ? JSON.parse(record.interes) : [],
      totalAvistamientos: record.totalAvistamientos,
      createdAt: new Date(record.createdAt).toISOString(),
    };
  }
}
