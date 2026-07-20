export interface SyncChanges {
    [tableName: string]: {
        created: any[];
        updated: any[];
        deleted: string[];
    };
}
export interface ISyncPort {
    /**
     * Obtiene todos los cambios desde un timestamp dado.
     * @param lastPulledAt El timestamp (en milisegundos) de la última sincronización. Si es 0 o null, trae todo.
     * @param userId El ID del usuario solicitante, extraído del token JWT.
     */
    pullChanges(lastPulledAt: number, userId: string): Promise<{
        changes: SyncChanges;
        timestamp: number;
    }>;
    /**
     * Aplica los cambios recibidos desde el cliente usando la estrategia Last Write Wins.
     * @param changes El objeto de cambios a procesar.
     * @param userId El ID del usuario solicitante, extraído del token JWT.
     */
    pushChanges(changes: SyncChanges, userId: string): Promise<void>;
}
//# sourceMappingURL=ISyncPort.d.ts.map