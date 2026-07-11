export interface IEspecie {
    id: string; // UUID único o puede ser el mismo nombre científico formateado (ej: harpia-harpyja)
    nombreComun?: string; // Ej: "Águila Arpía"
    nombreCientifico: string; // Ej: "Harpia harpyja"


    // Filtro para búsquedas
    categoriaTaxonomica: 'Aves' | 'Mamíferos' | 'Insectos' | 'Reptiles y Anfibios' | 'Peces y Vida Acuática' | 'Flora';

    // Estadísticas Globales del Observatorio
    totalObservaciones: number; // Incrementa en +1 cuando un avistamiento es Verificado y validado como esta especie

    // Opcional: Para métricas y gamificación del dashboard
    ultimoAvistamientoId?: string; // Relación (IAvistamiento.id) para saber dónde se vio por última vez
    ultimaFechaAvistamiento?: string; // ISO 8601
}
