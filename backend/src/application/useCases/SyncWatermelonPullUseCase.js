"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncWatermelonPullUseCase = void 0;
class SyncWatermelonPullUseCase {
    syncPort;
    constructor(syncPort) {
        this.syncPort = syncPort;
    }
    /**
     * Ejecuta la lógica para extraer los cambios de Supabase para WatermelonDB.
     */
    async execute(lastPulledAt, userId) {
        if (!userId) {
            throw new Error('Unauthorized');
        }
        return await this.syncPort.pullChanges(lastPulledAt, userId);
    }
}
exports.SyncWatermelonPullUseCase = SyncWatermelonPullUseCase;
//# sourceMappingURL=SyncWatermelonPullUseCase.js.map