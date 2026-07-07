export interface ISugerenciaEspecie {
    id: string; // UUID
    avistamientoId: string; // Publicación asociada (IAvistamiento.id)
    usuarioProponenteId: string; // Quién sugiere (IUsuario.id)
    nombreCientificoPropuesto: string; // Nombre propuesto por el usuario
    votosAFavor: number; // Contador acumulado de likes
    votosEnContra: number; // Contador acumulado de dislikes
    usuariosInteraccionIds: string[]; // Lista para evitar doble voto (+1/-1) por persona
}