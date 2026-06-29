export type EstadoCertificacion = 'Casual' | 'Verificado';

export interface IAvistamiento {
    id: string; // Para el 'occurrenceID' de Darwin Core
    numeroPublicacion: number; // Folio o número secuencial
    autorId: string; // Relación con el Usuario

    // Multimedia y Experiencia
    fotoUrl: string; // Para el 'associatedMedia' de Darwin Core
    descripcionExperiencia: string;

    // Datos Geográficos (SIG / Mapa de Calor / Darwin Core)
    latitud: number; // decimalLatitude
    longitud: number; // decimalLongitude
    ubicacionTexto: string; // Ej: "Parque La Llovizna"
    fechaCreacion: string; // eventDate (ISO 8601)

    // Filtros de Taxonomía y Ecosistema
    bioma: 'Selva' | 'Sabana' | 'Tepuyes';
    categoriaTaxonomica: 'Aves' | 'Mamíferos' | 'Insectos' | 'Reptiles y Anfibios' | 'Acuáticos' | 'Flora';

    // Consenso Comunitario
    estado: EstadoCertificacion;
    especieGanadoraNombre?: string; // Nulo al inicio. Se llena cuando hay consenso ('scientificName')
}