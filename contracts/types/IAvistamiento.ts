export type EstadoCertificacion = 'Pendiente' | 'Verificado';

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
    biomaId: string;
    categoriaId: string;

    // Consenso Comunitario
    estado: EstadoCertificacion;
    especieVerificadaId?: string;
    especieVerifNombre?: string;     // Ej: "Sapo Minero"
    especieVerifNombreCientifico?: string; // Ej: "Adelphobates minutus"
}