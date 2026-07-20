export interface IUsuario {
    id: string; // UUID
    nombre: string;
    ubicacion: string;
    bio?: string;
    fotoPerfilUrl?: string;
    interes: string[]; // TEXT[]
    totalAvistamientos: number;
    totalAciertosEspecies?: number; // Puede ser opcional temporalmente para no quebrar otras cosas
    createdAt: string; // TIMESTAMP
}