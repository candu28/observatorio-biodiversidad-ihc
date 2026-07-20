import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../infrastructure/database';
import { ISyncService } from '../ports/ISyncService';

/**
 * Caso de Uso responsable de sincronizar los datos locales de SQLite
 * con la base de datos central (PostgreSQL/Supabase) en la nube.
 * Se invoca cuando el dispositivo detecta conexión a internet.
 */
export class SincronizarNubeUseCase {
  
  // Inyección de dependencias: Le pasamos el servicio que hace el fetch real.
  constructor(private syncService: ISyncService) {}

  async execute(): Promise<void> {
    console.log('Iniciando sincronización Offline-First...');
    
    try {
      await synchronize({
        database,
        
        // --- FASE 1: PULL (Bajar de la nube) ---
        pullChanges: async ({ lastPulledAt }) => {
          const response = await this.syncService.pullChanges(lastPulledAt ?? null);
          return {
            changes: response.changes,
            timestamp: response.timestamp,
          };
        },
        
        // --- FASE 2: PUSH (Subir a la nube) ---
        pushChanges: async ({ changes, lastPulledAt }) => {
          await this.syncService.pushChanges(changes, lastPulledAt);
        },
        
        // Configuración adicional requerida por WatermelonDB
        migrationsEnabledAtVersion: 1,
      });
      
      console.log('✅ Sincronización completada exitosamente.');
    } catch (error) {
      console.error('❌ Error crítico en la sincronización:', error);
      throw new Error('Fallo la sincronización con el servidor.');
    }
  }
}
