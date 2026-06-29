export interface IEspecialidad {
    categoria: string; // Ej: "Anfibios", "Aves"
    cantidadAciertos: number; // Sube +1 cuando la comunidad elige su nombre propuesto
    esExperto: boolean; // Pasa a 'true' automáticamente cuando cantidadAciertos >= 3
}

export interface IUsuario {
    id: string; // UUID de Supabase
    nombre: string;
    ubicacion: string;
    bio?: string; // Opcional (puede ser nulo)
    fotoPerfilUrl?: string;

    // Gamificación y Métricas
    especialidades: IEspecialidad[]; // Arreglo con los aciertos por categoría
    totalAvistamientos: number; // Cuántas publicaciones ha hecho

    // Red de Interés
    intereses: string[]; // Ej: ["#Selva", "#Aves", "#SapoMinero"] (Llenado en el onboarding o al unirse a proyectos)
    proyectosActivosIds: string[]; // IDs de los proyectos donde participa
}