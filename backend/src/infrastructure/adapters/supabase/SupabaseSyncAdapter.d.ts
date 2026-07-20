import type { ISyncPort, SyncChanges } from '../../../application/ports/ISyncPort';
export declare class SupabaseSyncAdapter implements ISyncPort {
    private supabase;
    constructor(userToken: string);
    pullChanges(lastPulledAt: number, userId: string): Promise<{
        changes: SyncChanges;
        timestamp: number;
    }>;
    pushChanges(changes: SyncChanges, userId: string): Promise<void>;
}
//# sourceMappingURL=SupabaseSyncAdapter.d.ts.map