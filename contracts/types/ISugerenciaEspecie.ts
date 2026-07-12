export interface ISugerenciaEspecie {
    avistamientoId: string; // UUID
    usuarioId: string; // UUID
    nombrePropuesto: string;
    votosAFavor: number;
    votosEnContra: number;
    usuariosInteraccionIds: string[]; // UUID[]
}