import type { ISyncPort, SyncChanges } from '../ports/ISyncPort';
export declare class SyncWatermelonPullUseCase {
    private readonly syncPort;
    constructor(syncPort: ISyncPort);
    /**
     * Ejecuta la lógica para extraer los cambios de Supabase para WatermelonDB.
     */
    execute(lastPulledAt: number, userId: string): Promise<{
        changes: SyncChanges;
        timestamp: number;
    }>;
}
//# sourceMappingURL=SyncWatermelonPullUseCase.d.ts.map