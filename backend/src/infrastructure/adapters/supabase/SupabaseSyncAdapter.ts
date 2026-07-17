import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ISyncPort, SyncChanges } from '../../../application/ports/ISyncPort';

export class SupabaseSyncAdapter implements ISyncPort {
  private supabase: SupabaseClient;

  constructor(userToken: string) {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    });
  }

  async pullChanges(lastPulledAt: number, userId: string): Promise<{ changes: SyncChanges; timestamp: number }> {
    const changes: SyncChanges = {};
    const tablesToSync = ['usuarios', 'proyectos', 'avistamientos'];
    const currentTimestamp = Date.now();
    const lastPulledDate = new Date(lastPulledAt).toISOString();

    for (const table of tablesToSync) {
      // Obtener creados o actualizados
      const { data: createdOrUpdated, error: fetchError } = await this.supabase
        .from(table)
        .select('*')
        .gt('updated_at', lastPulledDate)
        .is('deleted_at', null);

      if (fetchError) {
        throw new Error(`Error fetching ${table}: ${fetchError.message}`);
      }

      // Obtener borrados lógicamente
      const { data: deleted, error: deletedError } = await this.supabase
        .from(table)
        .select('id')
        .gt('deleted_at', lastPulledDate);

      if (deletedError) {
        throw new Error(`Error fetching deleted ${table}: ${deletedError.message}`);
      }

      // Filtrar created vs updated basado en created_at
      const created = [];
      const updated = [];

      for (const record of createdOrUpdated || []) {
        if (new Date(record.created_at).getTime() > lastPulledAt) {
          created.push(record);
        } else {
          updated.push(record);
        }
      }

      changes[table] = {
        created,
        updated,
        deleted: (deleted || []).map((r) => r.id),
      };
    }

    return { changes, timestamp: currentTimestamp };
  }

  async pushChanges(changes: SyncChanges, userId: string): Promise<void> {
    const tablesToSync = ['usuarios', 'proyectos', 'avistamientos'];

    for (const table of tablesToSync) {
      const tableChanges = changes[table];
      if (!tableChanges) continue;

      const { created, updated, deleted } = tableChanges;

      // 1. Manejar Creados
      if (created.length > 0) {
        const { error } = await this.supabase.from(table).insert(created);
        if (error) {
          throw new Error(`Error inserting created into ${table}: ${error.message}`);
        }
      }

      // 2. Manejar Actualizados (Last Write Wins)
      for (const record of updated) {
        // Obtener la versión actual en la base de datos
        const { data: currentDbRecord, error: fetchError } = await this.supabase
          .from(table)
          .select('updated_at')
          .eq('id', record.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 es not found
          throw new Error(`Error checking existing record in ${table}: ${fetchError.message}`);
        }

        if (currentDbRecord) {
          const dbUpdatedAt = new Date(currentDbRecord.updated_at).getTime();
          const clientUpdatedAt = new Date(record.updated_at).getTime();

          // Last Write Wins
          if (clientUpdatedAt > dbUpdatedAt) {
            const { error: updateError } = await this.supabase
              .from(table)
              .update(record)
              .eq('id', record.id);

            if (updateError) {
              throw new Error(`Error updating record in ${table}: ${updateError.message}`);
            }
          }
        }
      }

      // 3. Manejar Borrados Lógicos
      if (deleted.length > 0) {
        const deletedAt = new Date().toISOString();
        const { error } = await this.supabase
          .from(table)
          .update({ deleted_at: deletedAt })
          .in('id', deleted);

        if (error) {
          throw new Error(`Error soft-deleting in ${table}: ${error.message}`);
        }
      }
    }
  }
}
