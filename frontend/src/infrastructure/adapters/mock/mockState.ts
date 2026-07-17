import dbMockData from '../../../../../contracts/mocks/dbMockData.json';

import { IAvistamiento } from '../../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../../contracts/types/IProyecto';
import { ITareaProyecto } from '../../../../../contracts/types/ITareaProyecto';
import { IAporteTarea } from '../../../../../contracts/types/IAporteTarea';

// Mapeo de datos del JSON centralizado a los tipos de la aplicación
const initialAvistamientos: IAvistamiento[] = dbMockData.avistamientos.map(a => ({
  id: a.id,
  numeroPublicacion: a.numero_publicacion,
  autorId: a.autor_id,
  fotoUrl: a.foto_url,
  descripcionExperiencia: a.descripcion_experiencia,
  latitud: a.latitud,
  longitud: a.longitud,
  ubicacionTexto: a.ubicacion_texto,
  fechaCreacion: a.created_at,
  biomaId: a.bioma_id,
  categoriaId: a.categoria_id,
  estado: a.estado as any,
  especieVerificadaId: a.especie_verificada_id || undefined,
  especieVerifNombre: a.especie_verif_nombre || undefined,
  especieVerifNombreCientifico: a.especie_verif_nombre_cientifico || undefined,
}));

const initialProyectos: IProyecto[] = dbMockData.proyectos.map(p => ({
  id: p.id,
  creadorId: p.creador_id,
  titulo: p.titulo,
  descripcion: p.descripcion,
  bioma: p.bioma as any,
  categoriasTaxonomicas: [], // Se podría inferir de proyectos_avistamientos o dejar vacío si el JSON no lo tiene directo
  ubicacionGeografica: p.ubicacion_geografica,
  fechaInicio: p.created_at,
  cantidadParticipantes: p.cantidad_participantes,
}));

const initialTareas: ITareaProyecto[] = dbMockData.tareas_proyecto.map(t => ({
  proyectoId: t.proyecto_id,
  tareaId: t.tarea_id,
  tituloTarea: t.titulo_tarea,
  descripcionInstrucciones: t.descripcion_instrucciones,
}));

const initialAportes: IAporteTarea[] = dbMockData.aportes_tarea.map(ap => ({
  proyectoId: ap.proyecto_id,
  tareaId: ap.tarea_id,
  aporteId: ap.aporte_id,
  usuarioId: ap.usuario_id,
  tipoMultimedia: ap.tipo_multimedia as any,
  archivoUrl: ap.archivo_url,
  comentarioDescriptivo: ap.comentario_descriptivo,
  fechaAporte: ap.created_at,
}));

// Variables globales mutables en memoria para simular una base de datos local
export let avistamientosEnMemoria: IAvistamiento[] = [...initialAvistamientos];
export let proyectosEnMemoria: IProyecto[] = [...initialProyectos];
export let tareasEnMemoria: ITareaProyecto[] = [...initialTareas];
export let aportesEnMemoria: IAporteTarea[] = [...initialAportes];

export const addAvistamientoEnMemoria = (avistamiento: IAvistamiento) => {
  avistamientosEnMemoria = [avistamiento, ...avistamientosEnMemoria];
};

export const addProyectoEnMemoria = (proyecto: IProyecto) => {
  proyectosEnMemoria = [proyecto, ...proyectosEnMemoria];
};

export const addTareaEnMemoria = (tarea: ITareaProyecto) => {
  tareasEnMemoria = [...tareasEnMemoria, tarea];
};

export const addAporteEnMemoria = (aporte: IAporteTarea) => {
  aportesEnMemoria = [aporte, ...aportesEnMemoria];
};
