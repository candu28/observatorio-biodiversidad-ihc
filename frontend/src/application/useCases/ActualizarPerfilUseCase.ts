import { IPerfilPort } from '../ports/IPerfilPort';

export class ActualizarPerfilUseCase {
  constructor(private readonly perfilRepository: IPerfilPort) {}

  async execute(id: string, nombre: string, bio: string, fotoUrl: string): Promise<void> {
    const usuario = await this.perfilRepository.getUsuarioActual();
    
    // In a real DB, we would do a specific update
    // Since we don't have a specific edit profile method yet in IPerfilPort,
    // we assume the repository handles it internally or we add it to the port.
    // For this mock, we'll try to find the Watermelon profile and update it.
    try {
      const { database } = require('../../../infrastructure/adapters/watermelon/database');
      const { default: Usuario } = require('../../../infrastructure/adapters/watermelon/database/models/Usuario');
      
      await database.write(async () => {
        const userToUpdate = await database.collections.get('usuarios').find(id);
        await userToUpdate.update((u: any) => {
          if (nombre) u.nombre = nombre;
          if (bio) u.bio = bio;
          if (fotoUrl) u.fotoPerfilUrl = fotoUrl;
        });
      });
    } catch (e) {
      console.error('Error updating user', e);
    }
  }
}
