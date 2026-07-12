export interface IUsuario {
    id: string; // UUID
    nombre: string;
    ubicacion: string;
    bio?: string;
    fotoPerfilUrl?: string;
    interes: string[]; // TEXT[]
    totalAvistamientos: number;
    createdAt: string; // TIMESTAMP
}