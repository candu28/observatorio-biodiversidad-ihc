import type { ISyncPort, SyncChanges } from '../ports/ISyncPort';

export class SyncWatermelonPullUseCase {
  constructor(private readonly syncPort: ISyncPort) {}

  /**
   * Ejecuta la lógica para extraer los cambios de Supabase para WatermelonDB.
   */
  async execute(lastPulledAt: number, userId: string): Promise<{ changes: SyncChanges; timestamp: number }> {
    if (!userId) {
      throw new Error('Unauthorized');
    }
    return await this.syncPort.pullChanges(lastPulledAt, userId);
  }
}
