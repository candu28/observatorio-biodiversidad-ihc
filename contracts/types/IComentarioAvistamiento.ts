export interface IComentarioAvistamiento {
    avistamientoId: string; // UUID
    comentarioId: string; // UUID
    autorId: string; // UUID
    contenido: string;
    fechaCreacion: string; // TIMESTAMP
}
