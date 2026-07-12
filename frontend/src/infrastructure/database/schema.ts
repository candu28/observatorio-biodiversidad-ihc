import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'usuarios',
      columns: [
        { name: 'nombre', type: 'string' },
        { name: 'ubicacion', type: 'string' },
        { name: 'bio', type: 'string', isOptional: true },
        { name: 'foto_perfil_url', type: 'string', isOptional: true },
        { name: 'interes', type: 'string' }, // Guardado como JSON stringificado
        { name: 'total_avistamientos', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'biomas',
      columns: [
        { name: 'nombre', type: 'string' },
        { name: 'descripcion', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'categorias_taxonomicas',
      columns: [
        { name: 'nombre', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'especies',
      columns: [
        { name: 'nombre_comun', type: 'string', isOptional: true },
        { name: 'nombre_cientifico', type: 'string' },
        { name: 'categoria_id', type: 'string', isIndexed: true },
        { name: 'total_observaciones', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'avistamientos',
      columns: [
        { name: 'numero_publicacion', type: 'number' },
        { name: 'autor_id', type: 'string', isIndexed: true },
        { name: 'foto_url', type: 'string' },
        { name: 'descripcion_experiencia', type: 'string' },
        { name: 'latitud', type: 'number' },
        { name: 'longitud', type: 'number' },
        { name: 'ubicacion_texto', type: 'string' },
        { name: 'bioma_id', type: 'string', isIndexed: true },
        { name: 'categoria_id', type: 'string', isIndexed: true },
        { name: 'estado', type: 'string' },
        { name: 'especie_verificada_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'especie_verif_nombre', type: 'string', isOptional: true },
        { name: 'especie_verif_nombre_cientifico', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'comentarios_avistamiento',
      columns: [
        { name: 'avistamiento_id', type: 'string', isIndexed: true },
        { name: 'autor_id', type: 'string', isIndexed: true },
        { name: 'contenido', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'sugerencias_especie',
      columns: [
        { name: 'avistamiento_id', type: 'string', isIndexed: true },
        { name: 'usuario_id', type: 'string', isIndexed: true },
        { name: 'nombre_propuesto', type: 'string' },
        { name: 'votos_a_favor', type: 'number' },
        { name: 'votos_en_contra', type: 'number' },
        { name: 'usuarios_interaccion_ids', type: 'string' }, // JSON stringificado
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'proyectos',
      columns: [
        { name: 'creador_id', type: 'string', isIndexed: true },
        { name: 'titulo', type: 'string' },
        { name: 'descripcion', type: 'string' },
        { name: 'bioma', type: 'string' },
        { name: 'ubicacion_geografica', type: 'string' },
        { name: 'cantidad_participantes', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'tareas_proyecto',
      columns: [
        { name: 'proyecto_id', type: 'string', isIndexed: true },
        { name: 'titulo_tarea', type: 'string' },
        { name: 'descripcion_instrucciones', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'aportes_tarea',
      columns: [
        { name: 'proyecto_id', type: 'string', isIndexed: true },
        { name: 'tarea_id', type: 'string', isIndexed: true },
        { name: 'usuario_id', type: 'string', isIndexed: true },
        { name: 'tipo_multimedia', type: 'string' },
        { name: 'archivo_url', type: 'string' },
        { name: 'comentario_descriptivo', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'proyectos_avistamientos',
      columns: [
        { name: 'proyecto_id', type: 'string', isIndexed: true },
        { name: 'avistamiento_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'participantes_proyecto',
      columns: [
        { name: 'proyecto_id', type: 'string', isIndexed: true },
        { name: 'usuario_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' }, // Funciona como fecha_union
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
