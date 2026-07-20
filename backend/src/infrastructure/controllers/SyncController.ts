import type { Request, Response } from 'express';
import { Router } from 'express';
import { SyncWatermelonPullUseCase } from '../../application/useCases/SyncWatermelonPullUseCase';
import { SyncWatermelonPushUseCase } from '../../application/useCases/SyncWatermelonPushUseCase';
import { SupabaseSyncAdapter } from '../adapters/supabase/SupabaseSyncAdapter';

export const syncRouter = Router();

/**
 * Helper para extraer el JWT de los headers.
 */
function extractToken(req: Request): string {
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

syncRouter.get('/pull', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    // Para simplificar, pasamos el token al adaptador. El adaptador configurará Supabase con este token.
    const adapter = new SupabaseSyncAdapter(token);
    const pullUseCase = new SyncWatermelonPullUseCase(adapter);

    const lastPulledAt = req.query.last_pulled_at ? parseInt(req.query.last_pulled_at as string, 10) : 0;
    
    // Aquí el token actúa como "userId" para validar en RLS.
    const result = await pullUseCase.execute(lastPulledAt, token);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error in GET /sync/pull:', error);
    res.status(401).json({ error: error.message });
  }
});

syncRouter.post('/push', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const adapter = new SupabaseSyncAdapter(token);
    const pushUseCase = new SyncWatermelonPushUseCase(adapter);

    const changes = req.body;
    
    if (!changes) {
      return res.status(400).json({ error: 'No changes provided' });
    }

    await pushUseCase.execute(changes, token);
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in POST /sync/push:', error);
    res.status(500).json({ error: error.message });
  }
});
