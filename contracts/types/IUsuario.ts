export interface IUsuario {
    id: string; // UUID de Supabase
    nombre: string;
    ubicacion: string;
    bio?: string; // Opcional (puede ser nulo)
    fotoPerfilUrl?: string;

    // Gamificación y Métricas
    totalAvistamientos: number; // Cuántas publicaciones ha hecho

    // Red de Interés
    intereses: string[]; // Ej: ["#Selva", "#Aves", "#SapoMinero"] (Llenado en el onboarding o al unirse a proyectos)
    proyectosAsociadosIds: string[]; // IDs de los proyectos donde participa
}