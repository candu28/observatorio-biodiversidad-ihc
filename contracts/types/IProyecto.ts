export interface IProyecto {
    id: string;
    titulo: string;
    descripcion: string;

    // Limitaciones del proyecto
    ubicacionLimite: string; // Ej: "Solo Upata" o "Gran Sabana"
    especiesInvolucradas: string[]; // Ej: ["Sapo Minero", "Rana de Cristal"]

    fechaInicio: string;
    creadorId: string; // Quién fundó el proyecto
    cantidadParticipantes: number;
}

export interface ITareaProyecto {
    id: string;
    proyectoId: string;
    titulo: string; // Ej: "Hábitos de alimentación"
    descripcion: string; // Ej: "Subir videos del sapo comiendo"
}

export interface IAporteTarea {
    id: string;
    tareaId: string;
    usuarioAportadorId: string;
    tipoMultimedia: 'Foto' | 'Video' | 'Audio';
    mediaUrl: string; // Foto, video o audio aportado a la tarea
    comentario: string;
    fechaAporte: string;
}