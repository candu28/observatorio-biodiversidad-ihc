import type { ISyncPort, SyncChanges } from '../ports/ISyncPort';
export declare class SyncWatermelonPushUseCase {
    private readonly syncPort;
    constructor(syncPort: ISyncPort);
    /**
     * Ejecuta la lógica para empujar los cambios de WatermelonDB hacia Supabase.
     */
    execute(changes: SyncChanges, userId: string): Promise<void>;
}
//# sourceMappingURL=SyncWatermelonPushUseCase.d.ts.map