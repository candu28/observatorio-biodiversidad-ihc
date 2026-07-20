import { ILocalAvistamientoRepository } from '../ports/ILocalAvistamientoRepository';
import { IPerfilPort } from '../ports/IPerfilPort';
import { IAvistamiento } from '../../../../contracts/types/IAvistamiento';
import { IComentarioAvistamiento } from '../../../../contracts/types/IComentarioAvistamiento';
import { ISugerenciaEspecie } from '../../../../contracts/types/ISugerenciaEspecie';

export type DetalleAvistamientoViewModel = {
  _rawItem: any; // For backward compatibility in UI temporarily
  id: string;
  categoria: string;
  nombreComun: string;
  nombreCientifico: string;
  verificada: boolean;
  fotoUrl: string;
  ubicacionTexto: string;
  observadorOriginal: { nombre: string };
  expertoTop: string;
  totalObservaciones: string;
  especieId: string;
  identificaciones: any[];
  comentarios: any[];
};

export class ObtenerDetalleAvistamientoUseCase {
  constructor(
    private readonly avistamientoRepo: ILocalAvistamientoRepository,
    private readonly perfilRepo: IPerfilPort
  ) {}

  async execute(id: string): Promise<DetalleAvistamientoViewModel> {
    const a = await this.avistamientoRepo.getAvistamientoById(id);
    if (!a) throw new Error('Avistamiento no encontrado');

    const comentariosRaw = await this.avistamientoRepo.getComentarios(id);
    const sugerenciasRaw = await this.avistamientoRepo.getSugerencias(id);

    // Map sugerencias to 'identificaciones' format for UI
    const identificaciones = sugerenciasRaw.map((s, idx) => ({
      id: s.nombrePropuesto + idx,
      usuario: 'Usuario', // Would fetch user details ideally
      iniciales: 'U',
      color: '#6366f1',
      tiempo: 'recientemente',
      isTop: s.votosAFavor > 10,
      comentario: s.nombrePropuesto,
      votosUp: s.votosAFavor,
      votosDown: s.votosEnContra,
      userVote: null, // Depending on user interaction
    }));

    // Map comentarios to UI format
    const comentarios = comentariosRaw.map((c, idx) => ({
      id: c.comentarioId,
      usuario: 'Usuario',
      texto: c.contenido,
      tiempo: new Date(c.fechaCreacion || '').toLocaleDateString(),
    }));

    const categoryMap: Record<string, string> = {
      '11111111-1111-1111-1111-111111111111': 'ANFIBIOS',
      '22222222-2222-2222-2222-222222222222': 'PLANTAS',
      '33333333-3333-3333-3333-333333333333': 'AVES',
      '44444444-4444-4444-4444-444444444444': 'MAMÍFEROS',
      '55555555-5555-5555-5555-555555555555': 'REPTILES',
      '66666666-6666-6666-6666-666666666666': 'INSECTOS',
      '77777777-7777-7777-7777-777777777777': 'HONGOS',
    };

    return {
      _rawItem: a,
      id: a.id,
      categoria: a.categoriaId ? categoryMap[a.categoriaId] || 'ESPECIE' : 'ESPECIE',
      nombreComun: a.especieVerifNombre || 'Desconocido',
      nombreCientifico: a.especieVerifNombreCientifico || 'Desconocido',
      verificada: a.estado === 'Verificado',
      fotoUrl: a.fotoUrl || 'https://images.unsplash.com/photo-1550977186-b484af8a264a?q=80&w=800',
      ubicacionTexto: a.ubicacionTexto || 'Desconocida',
      observadorOriginal: {
        nombre: 'Usuario', // Would fetch user ideally
      },
      expertoTop: 'Comunidad',
      totalObservaciones: '-',
      especieId: a.especieVerificadaId || '',
      identificaciones,
      comentarios,
    };
  }
}
