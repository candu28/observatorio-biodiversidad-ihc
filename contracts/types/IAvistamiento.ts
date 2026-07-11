import { IEspecie } from './IEspecie';

export type EstadoCertificacion = 'Pendiente' | 'Verificado';

export interface IComentario {
    id: string; // UUID
    autorId: string; // Relación con el Usuario
    contenido: string; // Texto del comentario
    fechaCreacion: string;
}

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
    categoriaTaxonomica: 'Aves' | 'Mamíferos' | 'Insectos' | 'Reptiles y Anfibios' | 'Peces y Vida Acuática' | 'Flora';

    // Consenso Comunitario
    estado: EstadoCertificacion;
    especieVerificada?: IEspecie; // Se enlaza directamente con el catálogo (la entidad IEspecie) al haber consenso



    // Interacción Comunitaria
    comentarios: IComentario[]; // Comentarios de distintos usuarios en el avistamiento
}