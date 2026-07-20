"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncWatermelonPushUseCase = void 0;
class SyncWatermelonPushUseCase {
    syncPort;
    constructor(syncPort) {
        this.syncPort = syncPort;
    }
    /**
     * Ejecuta la lógica para empujar los cambios de WatermelonDB hacia Supabase.
     */
    async execute(changes, userId) {
        if (!userId) {
            throw new Error('Unauthorized');
        }
        await this.syncPort.pushChanges(changes, userId);
    }
}
exports.SyncWatermelonPushUseCase = SyncWatermelonPushUseCase;
//# sourceMappingURL=SyncWatermelonPushUseCase.js.map