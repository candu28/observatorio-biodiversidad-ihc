export interface ITareaProyecto {
    id: string;
    proyectoId: string; // IProyecto.id
    tituloTarea: string; // Ej: "Registro de Cantos"
    descripcionInstrucciones: string; // Ej: "Grabar audio en formato nativo al amanecer"
}

export interface IAporteTarea {
    id: string;
    tareaId: string; // ITareaProyecto.id
    usuarioAportadorId: string; // IUsuario.id
    tipoMultimedia: 'Foto' | 'Video' | 'Audio'; // Soporte multilateral de archivos
    archivoUrl: string; // Almacenamiento en Supabase Storage
    comentarioDescriptivo: string; // Explicación de lo que subió
    fechaAporte: string;
}