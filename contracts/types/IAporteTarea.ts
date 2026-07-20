export interface IAporteTarea {
    proyectoId: string; // UUID
    tareaId: string; // UUID
    aporteId: string; // UUID
    usuarioId: string; // UUID
    tipoMultimedia: 'Foto' | 'Video' | 'Audio';
    archivoUrl: string;
    comentarioDescriptivo: string;
    fechaAporte: string; // TIMESTAMP
}
