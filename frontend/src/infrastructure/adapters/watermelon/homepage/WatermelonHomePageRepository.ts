import { database } from '../../../database';
import { IHomePagePort, HomePageCard } from '../../../../application/ports/IHomePagePort';
import { IEspecie } from '../../../../../../contracts/types/IEspecie';
import { Q } from '@nozbe/watermelondb';
import Avistamiento from '../../../database/models/Avistamiento';
import Especie from '../../../database/models/Especie';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class WatermelonHomePageRepository implements IHomePagePort {
  
  async getAvistamientos(usuarioId?: string): Promise<HomePageCard[]> {
    const avistamientos = await database.collections.get<Avistamiento>('avistamientos').query(
      Q.sortBy('created_at', Q.desc)
    ).fetch();
    
    let especiesFavoritas: string[] = [];
    if (usuarioId) {
      try {
        const { default: Usuario } = require('../../../database/models/Usuario');
        const usuario = await database.collections.get<any>('usuarios').find(usuarioId);
        const intereses = usuario.interes || []; // avistamiento IDs
        
        // Find which species these avistamientos belong to
        const likedAvistamientos = avistamientos.filter(a => intereses.includes(a.id));
        especiesFavoritas = likedAvistamientos
          .map(a => a.especieVerificadaId || a.especieVerifNombre)
          .filter(Boolean) as string[];
      } catch (e) {
        console.warn('Could not fetch user likes for personalization', e);
      }
    }

    const mapAvistamiento = (a: Avistamiento) => ({
      id: a.id,
      fotoUrl: a.fotoUrl || 'https://images.unsplash.com/photo-1550977186-b484af8a264a?q=80&w=800',
      estado: a.estado,
      height: Math.floor(Math.random() * (250 - 150 + 1) + 150),
      title: a.especieVerifNombre || 'Desconocido',
      _especieId: a.especieVerificadaId || a.especieVerifNombre
    });

    let mapped = avistamientos.map(mapAvistamiento);

    if (especiesFavoritas.length > 0) {
      mapped.sort((a, b) => {
        const aFav = a._especieId && especiesFavoritas.includes(a._especieId) ? 1 : 0;
        const bFav = b._especieId && especiesFavoritas.includes(b._especieId) ? 1 : 0;
        return bFav - aFav; // Sort favorites first
      });
    }

    return mapped.map(({ _especieId, ...rest }) => rest);
  }

  async getEspecies(): Promise<IEspecie[]> {
    const especies = await database.collections.get<Especie>('especies').query(
      Q.sortBy('nombre_comun', Q.asc)
    ).fetch();

    return especies.map(e => ({
      id: e.id,
      nombreComun: e.nombreComun,
      nombreCientifico: e.nombreCientifico,
      categoriaId: e.categoriaId,
      totalObservaciones: e.totalObservaciones,
    }));
  }
  
  observeAvistamientos(usuarioId?: string): Observable<HomePageCard[]> {
    return database.collections.get<Avistamiento>('avistamientos').query(
      Q.sortBy('created_at', Q.desc)
    ).observe().pipe(
      map(avistamientos => {
        const mapAvistamiento = (a: Avistamiento) => ({
          id: a.id,
          fotoUrl: a.fotoUrl || 'https://images.unsplash.com/photo-1550977186-b484af8a264a?q=80&w=800',
          estado: a.estado,
          height: Math.floor(Math.random() * (250 - 150 + 1) + 150),
          title: a.especieVerifNombre || 'Desconocido',
          _especieId: a.especieVerificadaId || a.especieVerifNombre
        });

        return avistamientos.map(mapAvistamiento).map(({ _especieId, ...rest }) => rest);
      })
    );
  }

  observeEspecies(): Observable<IEspecie[]> {
    return database.collections.get<Especie>('especies').query(
      Q.sortBy('nombre_comun', Q.asc)
    ).observe().pipe(
      map(especies => especies.map(e => ({
        id: e.id,
        nombreComun: e.nombreComun,
        nombreCientifico: e.nombreCientifico,
        categoriaId: e.categoriaId,
        totalObservaciones: e.totalObservaciones,
      })))
    );
  }

  observeAvistamientosPorBioma(bioma: string): Observable<HomePageCard[]> {
    return database.collections.get<Avistamiento>('avistamientos').query(
      Q.where('bioma_id', bioma),
      Q.where('estado', 'Verificado'),
      Q.sortBy('created_at', Q.desc)
    ).observe().pipe(
      map(avistamientos => avistamientos.map(a => ({
        id: a.id,
        fotoUrl: a.fotoUrl || 'https://images.unsplash.com/photo-1550977186-b484af8a264a?q=80&w=800',
        estado: a.estado,
        height: Math.floor(Math.random() * (250 - 150 + 1) + 150),
        title: a.especieVerifNombre || 'Desconocido',
      })))
    );
  }

  observeAvistamientosPorCategoria(categoria: string): Observable<HomePageCard[]> {
    return database.collections.get<Avistamiento>('avistamientos').query(
      Q.where('categoria_id', categoria),
      Q.where('estado', 'Verificado'),
      Q.sortBy('created_at', Q.desc)
    ).observe().pipe(
      map(avistamientos => avistamientos.map(a => ({
        id: a.id,
        fotoUrl: a.fotoUrl || 'https://images.unsplash.com/photo-1550977186-b484af8a264a?q=80&w=800',
        estado: a.estado,
        height: Math.floor(Math.random() * (250 - 150 + 1) + 150),
        title: a.especieVerifNombre || 'Desconocido',
      })))
    );
  }
}
