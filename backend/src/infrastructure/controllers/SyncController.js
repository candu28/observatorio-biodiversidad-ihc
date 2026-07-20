"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRouter = void 0;
const express_1 = require("express");
const SyncWatermelonPullUseCase_1 = require("../../application/useCases/SyncWatermelonPullUseCase");
const SyncWatermelonPushUseCase_1 = require("../../application/useCases/SyncWatermelonPushUseCase");
const SupabaseSyncAdapter_1 = require("../adapters/supabase/SupabaseSyncAdapter");
exports.syncRouter = (0, express_1.Router)();
/**
 * Helper para extraer el JWT de los headers.
 */
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No valid authorization header found');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('No token provided');
    }
    return token;
}
exports.syncRouter.get('/pull', async (req, res) => {
    try {
        const token = extractToken(req);
        // Para simplificar, pasamos el token al adaptador. El adaptador configurará Supabase con este token.
        const adapter = new SupabaseSyncAdapter_1.SupabaseSyncAdapter(token);
        const pullUseCase = new SyncWatermelonPullUseCase_1.SyncWatermelonPullUseCase(adapter);
        const lastPulledAt = req.query.last_pulled_at ? parseInt(req.query.last_pulled_at, 10) : 0;
        // Aquí el token actúa como "userId" para validar en RLS.
        const result = await pullUseCase.execute(lastPulledAt, token);
        res.json(result);
    }
    catch (error) {
        console.error('Error in GET /sync/pull:', error);
        res.status(401).json({ error: error.message });
    }
});
exports.syncRouter.post('/push', async (req, res) => {
    try {
        const token = extractToken(req);
        const adapter = new SupabaseSyncAdapter_1.SupabaseSyncAdapter(token);
        const pushUseCase = new SyncWatermelonPushUseCase_1.SyncWatermelonPushUseCase(adapter);
        const changes = req.body;
        if (!changes) {
            return res.status(400).json({ error: 'No changes provided' });
        }
        await pushUseCase.execute(changes, token);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error in POST /sync/push:', error);
        res.status(500).json({ error: error.message });
    }
});
//# sourceMappingURL=SyncController.js.map