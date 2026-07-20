import { SyncDatabaseChangeSet } from '@nozbe/watermelondb/sync';

export interface ISyncService {
  /**
   * Pide a la nube los cambios que han ocurrido desde `lastPulledAt`.
   * @param lastPulledAt Timestamp del último pull exitoso.
   * @returns Los cambios que WatermelonDB aplicará localmente y un nuevo timestamp del servidor.
   */
  pullChanges(lastPulledAt: number | null): Promise<{ changes: SyncDatabaseChangeSet, timestamp: number }>;

  /**
   * Empuja a la nube todos los cambios que se crearon localmente en modo offline.
   * @param changes El objeto de cambios (creados, actualizados, borrados) generado por WatermelonDB.
   * @param lastPulledAt Timestamp del último pull exitoso.
   */
  pushChanges(changes: SyncDatabaseChangeSet, lastPulledAt: number): Promise<void>;
}
