import { IUsuario } from '../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../contracts/types/IProyecto';
import { IPerfilPort } from '../ports/IPerfilPort';

export type PerfilAvistamientoCard = {
  id: string;
  titulo: string;
  subtitulo: string;
  imagenUrl: string;
};

export type PerfilParticipacionCard = {
  id: string;
  titulo: string;
  fecha: string;
  imagenUrl: string;
};

const imagenesParticipacion = [
  'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=180&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=180&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=180&auto=format&fit=crop',
];

function mapAvistamiento(avistamiento: IAvistamiento): PerfilAvistamientoCard {
  return {
    id: avistamiento.id,
    titulo: avistamiento.especieVerifNombre ?? 'Avistamiento',
    subtitulo: avistamiento.estado,
    imagenUrl: avistamiento.fotoUrl,
  };
}

function mapParticipacion(proyecto: IProyecto, index: number): PerfilParticipacionCard {
  const fecha = new Date(proyecto.fechaInicio);
  const formattedDate = fecha.toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    id: proyecto.id,
    titulo: proyecto.titulo,
    fecha: `Desde: ${formattedDate}`,
    imagenUrl: imagenesParticipacion[index % imagenesParticipacion.length],
  };
}

export class ObtenerPerfilUseCase {
  constructor(private readonly perfilPort: IPerfilPort) {}

  async execute() {
    const usuario = await this.perfilPort.getUsuarioActual();

    if (!usuario) {
      throw new Error('No se encontró un usuario para mostrar el perfil.');
    }

    const [avistamientos, proyectos] = await Promise.all([
      this.perfilPort.getAvistamientosPorUsuario(usuario.id),
      this.perfilPort.getProyectosPorUsuario(usuario.id),
    ]);

    return {
      usuario,
      avistamientos: avistamientos.slice(0, 2).map(mapAvistamiento),
      participaciones: proyectos.slice(0, 3).map(mapParticipacion),
    };
  }
}