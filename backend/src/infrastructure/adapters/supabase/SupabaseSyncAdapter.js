"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseSyncAdapter = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
// Mapeo de tablas locales (WatermelonDB) a tablas remotas (Supabase)
const tableMap = {
    usuarios: 'usuarios',
    biomas: 'biomas',
    categorias_taxonomicas: 'categorias_taxonomicas',
    especies: 'especies',
    avistamientos: 'avistamientos',
    multimedia_avistamientos: 'multimedia_avistamiento', // singular en Supabase
    comentarios_avistamiento: 'comentarios_avistamiento',
    sugerencias_especie: 'sugerencias_especie',
    proyectos: 'proyectos',
    tareas_proyecto: 'tareas_proyecto',
    aportes_tarea: 'aportes_tarea',
    proyectos_avistamientos: 'proyectos_avistamientos',
    participantes_proyecto: 'participantes_proyecto',
};
// Todas las tablas que vamos a sincronizar
const tablesToSync = Object.keys(tableMap);
class SupabaseSyncAdapter {
    supabase;
    constructor(userToken) {
        const supabaseUrl = process.env.SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            },
        });
    }
    async pullChanges(lastPulledAt, userId) {
        const changes = {};
        const currentTimestamp = Date.now();
        const lastPulledDate = new Date(lastPulledAt).toISOString();
        for (const localTable of tablesToSync) {
            const remoteTable = tableMap[localTable];
            // Obtener creados o actualizados
            const { data: createdOrUpdated, error: fetchError } = await this.supabase
                .from(remoteTable)
                .select('*')
                .gt('updated_at', lastPulledDate)
                .is('deleted_at', null);
            if (fetchError) {
                throw new Error(`Error fetching ${remoteTable}: ${fetchError.message}`);
            }
            // Obtener borrados lógicamente
            const { data: deleted, error: deletedError } = await this.supabase
                .from(remoteTable)
                .select('id')
                .gt('deleted_at', lastPulledDate);
            if (deletedError) {
                throw new Error(`Error fetching deleted ${remoteTable}: ${deletedError.message}`);
            }
            // Filtrar created vs updated basado en created_at
            const created = [];
            const updated = [];
            for (const record of createdOrUpdated || []) {
                if (new Date(record.created_at).getTime() > lastPulledAt) {
                    created.push(record);
                }
                else {
                    updated.push(record);
                }
            }
            changes[localTable] = {
                created,
                updated,
                deleted: (deleted || []).map((r) => r.id),
            };
        }
        return { changes, timestamp: currentTimestamp };
    }
    async pushChanges(changes, userId) {
        for (const localTable of tablesToSync) {
            const tableChanges = changes[localTable];
            if (!tableChanges)
                continue;
            const remoteTable = tableMap[localTable];
            const { created, updated, deleted } = tableChanges;
            // 1. Manejar Creados
            if (created.length > 0) {
                const { error } = await this.supabase.from(remoteTable).insert(created);
                if (error) {
                    throw new Error(`Error inserting created into ${remoteTable}: ${error.message}`);
                }
            }
            // 2. Manejar Actualizados (Last Write Wins)
            for (const record of updated) {
                // Obtener la versión actual en la base de datos
                const { data: currentDbRecord, error: fetchError } = await this.supabase
                    .from(remoteTable)
                    .select('updated_at')
                    .eq('id', record.id)
                    .single();
                if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 es not found
                    throw new Error(`Error checking existing record in ${remoteTable}: ${fetchError.message}`);
                }
                if (currentDbRecord) {
                    const dbUpdatedAt = new Date(currentDbRecord.updated_at).getTime();
                    const clientUpdatedAt = new Date(record.updated_at).getTime();
                    // Last Write Wins
                    if (clientUpdatedAt > dbUpdatedAt) {
                        const { error: updateError } = await this.supabase
                            .from(remoteTable)
                            .update(record)
                            .eq('id', record.id);
                        if (updateError) {
                            throw new Error(`Error updating record in ${remoteTable}: ${updateError.message}`);
                        }
                    }
                }
            }
            // 3. Manejar Borrados Lógicos
            if (deleted.length > 0) {
                const deletedAt = new Date().toISOString();
                const { error } = await this.supabase
                    .from(remoteTable)
                    .update({ deleted_at: deletedAt })
                    .in('id', deleted);
                if (error) {
                    throw new Error(`Error soft-deleting in ${remoteTable}: ${error.message}`);
                }
            }
        }
    }
}
exports.SupabaseSyncAdapter = SupabaseSyncAdapter;
//# sourceMappingURL=SupabaseSyncAdapter.js.map