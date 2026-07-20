import type { ISyncPort, SyncChanges } from '../ports/ISyncPort';

export class SyncWatermelonPushUseCase {
  constructor(private readonly syncPort: ISyncPort) { }

  /**
   * Ejecuta la lógica para empujar los cambios de WatermelonDB hacia Supabase.
   */
  async execute(changes: SyncChanges, userId: string): Promise<void> {
    if (!userId) {
      throw new Error('Unauthorized');
    }
    await this.syncPort.pushChanges(changes, userId);
  }
}
