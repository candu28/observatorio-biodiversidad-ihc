export interface ISugerencia {
    id: string;
    avistamientoId: string; // A qué publicación pertenece
    usuarioProponenteId: string; // Quién sugirió el nombre (Para darle el "Acierto" si gana)

    nombrePropuesto: string; // Ej: "Dendrobates leucomelas"
    votosAcuerdo: number; // Votos positivos de la comunidad
    votosDesacuerdo: number; // Votos negativos

    // Lista de IDs de usuarios que ya votaron (para que el frontend bloquee doble voto)
    usuariosQueVotaronIds: string[];
}