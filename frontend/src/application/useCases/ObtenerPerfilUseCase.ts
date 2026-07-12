import { IUsuario } from '../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../contracts/types/IProyecto';
import { IObtenerPerfilUsuarioPort } from '../ports/IObtenerPerfilUsuarioPort';
import { IObtenerAvistamientosPerfilPort } from '../ports/IObtenerAvistamientosPerfilPort';
import { IObtenerProyectosPerfilPort } from '../ports/IObtenerProyectosPerfilPort';

export type PerfilAvistamientoCard = {
  id: string;
  titulo: string;
  subtitulo: string;
  imagenUrl: string;
};

export type PerfilExpertoCard = {
  id: string;
  titulo: string;
  subtitulo: string;
  puntos: number;
  imagenUrl: string;
};

export type PerfilParticipacionCard = {
  id: string;
  titulo: string;
  fecha: string;
  imagenUrl: string;
};

export type PerfilViewModel = {
  usuario: IUsuario;
  nivel: string;
  puntos: number;
  avistamientos: PerfilAvistamientoCard[];
  expertos: PerfilExpertoCard[];
  participaciones: PerfilParticipacionCard[];
};

const imagenesExpertos: Record<string, string> = {
  Aves: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
  Reptiles: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=300&auto=format&fit=crop',
  'Fauna silvestre': 'https://images.unsplash.com/photo-1549366021-9f761d040a94?q=80&w=300&auto=format&fit=crop',
};

const imagenesParticipacion = [
  'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=180&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=180&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=180&auto=format&fit=crop',
];

function calcularNivel(totalAvistamientos: number): string {
  if (totalAvistamientos >= 12) {
    return 'Nivel 5 · Guardián';
  }

  if (totalAvistamientos >= 8) {
    return 'Nivel 4 · Explorador';
  }

  if (totalAvistamientos >= 4) {
    return 'Nivel 3 · Observador';
  }

  return 'Nivel 1 · Inicio';
}

function mapAvistamiento(avistamiento: IAvistamiento): PerfilAvistamientoCard {
  return {
    id: avistamiento.id,
    titulo: avistamiento.especieVerifNombre ?? 'Avistamiento',
    subtitulo: avistamiento.estado,
    imagenUrl: avistamiento.fotoUrl,
  };
}

function mapExperto(usuario: IUsuario, index: number) {
  const interes = usuario.interes[index] ?? usuario.interes[0] ?? 'Fauna silvestre';

  return {
    id: `exp-${index}`,
    titulo: interes,
    subtitulo: index === 0 ? 'Categoría principal' : 'Interés secundario',
    puntos: Math.max(934, usuario.totalAvistamientos * 120 - index * 200),
    imagenUrl: imagenesExpertos[interes] ?? imagenesExpertos['Fauna silvestre'],
  } satisfies PerfilExpertoCard;
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
  constructor(
    private readonly usuarioPort: IObtenerPerfilUsuarioPort,
    private readonly avistamientosPort: IObtenerAvistamientosPerfilPort,
    private readonly proyectosPort: IObtenerProyectosPerfilPort,
  ) {}

  async execute(): Promise<PerfilViewModel> {
    const usuario = await this.usuarioPort.getUsuarioActual();

    if (!usuario) {
      throw new Error('No se encontró un usuario para mostrar el perfil.');
    }

    const [avistamientos, proyectos] = await Promise.all([
      this.avistamientosPort.getAvistamientosPorUsuario(usuario.id),
      this.proyectosPort.getProyectosPorUsuario(usuario.id),
    ]);

    return {
      usuario,
      nivel: calcularNivel(usuario.totalAvistamientos),
      puntos: usuario.totalAvistamientos * 42,
      avistamientos: avistamientos.slice(0, 2).map(mapAvistamiento),
      expertos: usuario.interes.slice(0, 2).map((_, index) => mapExperto(usuario, index)),
      participaciones: proyectos.slice(0, 3).map(mapParticipacion),
    };
  }
}