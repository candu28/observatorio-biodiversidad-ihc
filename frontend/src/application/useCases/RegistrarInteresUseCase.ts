import { IPerfilPort } from '../ports/IPerfilPort';

export class RegistrarInteresUseCase {
  constructor(private readonly perfilRepository: IPerfilPort) {}

  async execute(avistamientoId: string, userId: string = 'mock-user-1'): Promise<void> {
    await this.perfilRepository.registrarInteres(userId, avistamientoId);
  }
}
