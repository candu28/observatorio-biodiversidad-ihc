export interface IMensajeChat {
    id: string; // UUID
    avistamientoIdRef: string; // Chat amarrado contextualmente a un post (IAvistamiento.id)
    emisorId: string; // Quién escribe (IUsuario.id)
    receptorId: string; // Quién recibe (IUsuario.id)
    contenidoTexto: string; // Cuerpo del mensaje privado
    fechaEnvio: string; // Timestamp de ordenación temporal
}