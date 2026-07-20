import { IMapPort } from '../../../application/ports/IMapPort';
import { IAvistamiento } from '../../../../../contracts/types/IAvistamiento';
// Mapeos estáticos de categorías a sus IDs UUID locales correspondientes
const CATEGORY_ID_MAP: Record<string, string> = {
  'Anfibios': '11111111-1111-1111-1111-111111111111',
  'Plantas': '22222222-2222-2222-2222-222222222222',
  'Aves': '33333333-3333-3333-3333-333333333333',
  'Mamíferos': '44444444-4444-4444-4444-444444444444',
  'Reptiles': '55555555-5555-5555-5555-555555555555',
  'Insectos': '66666666-6666-6666-6666-666666666666',
  'Hongos': '77777777-7777-7777-7777-777777777777',
};

// Mapeo inverso de ID UUID a nombre de categoría local
const ID_TO_CATEGORY_NAME: Record<string, string> = {
  '11111111-1111-1111-1111-111111111111': 'Anfibios',
  '22222222-2222-2222-2222-222222222222': 'Plantas',
  '33333333-3333-3333-3333-333333333333': 'Aves',
  '44444444-4444-4444-4444-444444444444': 'Mamíferos',
  '55555555-5555-5555-5555-555555555555': 'Reptiles',
  '66666666-6666-6666-6666-666666666666': 'Insectos',
  '77777777-7777-7777-7777-777777777777': 'Hongos',
};

// Mapeo de categorías locales a los nombres del taxón icónico de iNaturalist
const CATEGORY_TO_ICONIC_TAXON: Record<string, string> = {
  'Mamíferos': 'Mammalia',
  'Aves': 'Aves',
  'Anfibios': 'Amphibia',
  'Reptiles': 'Reptilia',
  'Insectos': 'Insecta',
  'Plantas': 'Plantae',
  'Hongos': 'Fungi',
};

// Mapeo del taxón icónico de iNaturalist a IDs UUID locales
const ICONIC_TAXON_TO_CATEGORY_ID: Record<string, string> = {
  'Mammalia': '44444444-4444-4444-4444-444444444444',
  'Aves': '33333333-3333-3333-3333-333333333333',
  'Amphibia': '11111111-1111-1111-1111-111111111111',
  'Reptilia': '55555555-5555-5555-5555-555555555555',
  'Insecta': '66666666-6666-6666-6666-666666666666',
  'Plantae': '22222222-2222-2222-2222-222222222222',
  'Fungi': '77777777-7777-7777-7777-777777777777',
};

export class HybridMapRepository implements IMapPort {
  async getAvistamientos(params?: { categoryName?: string; online?: boolean }): Promise<IAvistamiento[]> {
    const isOnline = params?.online ?? false;
    const categoryName = params?.categoryName || 'Todo';

    if (isOnline) {
      try {
        return await this.fetchFromINaturalist(categoryName);
      } catch (error) {
        console.warn('Fallo en la llamada a iNaturalist API. Realizando fallback a la base de datos local:', error);
        return this.fetchFromLocal(categoryName);
      }
    } else {
      return this.fetchFromLocal(categoryName);
    }
  }

  private async fetchFromLocal(categoryName: string): Promise<IAvistamiento[]> {
    try {
      const { database } = require('../watermelon/database');
      let queryArgs: any[] = [];
      
      if (categoryName && categoryName !== 'Todo') {
        const categoryId = CATEGORY_ID_MAP[categoryName];
        if (categoryId) {
          const { Q } = require('@nozbe/watermelondb');
          queryArgs.push(Q.where('categoria_id', categoryId));
        }
      }

      const { Q } = require('@nozbe/watermelondb');
      queryArgs.push(Q.where('estado', 'Verificado'));

      const avistamientos = await database.get('avistamientos').query(...queryArgs).fetch();
      
      return avistamientos.map((a: any) => ({
        id: a.id,
        numeroPublicacion: a.numeroPublicacion,
        autorId: a.autorId,
        fotoUrl: a.fotoUrl,
        descripcionExperiencia: a.descripcionExperiencia,
        latitud: a.latitud,
        longitud: a.longitud,
        ubicacionTexto: a.ubicacionTexto,
        fechaCreacion: a.fechaCreacion,
        biomaId: a.biomaId,
        categoriaId: a.categoriaId,
        estado: a.estado,
        especieVerificadaId: a.especieVerificadaId,
        especieVerifNombre: a.especieVerifNombre,
        especieVerifNombreCientifico: a.especieVerifNombreCientifico,
      }));
    } catch (e) {
      console.warn('Error fetching from WatermelonDB in map', e);
      return [];
    }
  }

  private async fetchFromINaturalist(categoryName: string): Promise<IAvistamiento[]> {
    // Parámetros de la región Guayana
    const paramsObj: Record<string, string> = {
      swlat: '1.0',
      swlng: '-68.0',
      nelat: '10.0',
      nelng: '-60.0',
      per_page: '80', // Límite razonable para rendimiento
      quality_grade: 'research', // Solo traer verificados (Grado de investigación)
      // Solicitamos campos específicos en iNaturalist v2
      fields: 'id,observed_on,quality_grade,description,place_guess,location,geojson,user,photos,taxon',
    };

    if (categoryName && categoryName !== 'Todo') {
      const iconicTaxon = CATEGORY_TO_ICONIC_TAXON[categoryName];
      if (iconicTaxon) {
        paramsObj.iconic_taxa = iconicTaxon;
      }
    }

    const queryString = new URLSearchParams(paramsObj).toString();
    const url = `https://api.inaturalist.org/v2/observations?${queryString}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la llamada a iNaturalist: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const results = json.results || [];

    return results.map((obs: any) => this.mapInaturalistToAvistamiento(obs));
  }

  private mapInaturalistToAvistamiento(obs: any): IAvistamiento {
    // 1. Extraer latitud y longitud
    let lat = 8.2970; // Coordenada por defecto (UCAB Guayana)
    let lon = -62.7120;

    if (obs.geojson && obs.geojson.coordinates) {
      lon = obs.geojson.coordinates[0];
      lat = obs.geojson.coordinates[1];
    } else if (obs.latitude !== undefined && obs.longitude !== undefined) {
      lat = obs.latitude;
      lon = obs.longitude;
    } else if (obs.location) {
      const parts = obs.location.split(',');
      if (parts.length === 2) {
        lat = parseFloat(parts[0]);
        lon = parseFloat(parts[1]);
      }
    }

    // 2. Mapear categoría
    const iconicTaxonName = obs.taxon?.iconic_taxon_name || '';
    const categoriaId = ICONIC_TAXON_TO_CATEGORY_ID[iconicTaxonName] || '33333333-3333-3333-3333-333333333333'; // Por defecto Aves

    // 3. Mapear estado
    const estado = obs.quality_grade === 'research' ? 'Verificado' : 'Pendiente';

    // 4. Mapear fotos
    let fotoUrl = 'https://images.unsplash.com/photo-1472962914349-0943509e4a3d?q=80&w=150&auto=format&fit=crop';
    if (obs.photos && obs.photos.length > 0) {
      const p = obs.photos[0];
      fotoUrl = p.url || p.square_url || p.medium_url || fotoUrl;
    } else if (obs.taxon?.default_photo?.medium_url) {
      fotoUrl = obs.taxon.default_photo.medium_url;
    } else if (obs.taxon?.default_photo?.square_url) {
      fotoUrl = obs.taxon.default_photo.square_url;
    }

    // Convertir a HTTPS y mejorar resolución
    if (fotoUrl.startsWith('http://')) {
      fotoUrl = fotoUrl.replace('http://', 'https://');
    }
    if (fotoUrl.includes('static.inaturalist.org/photos')) {
      fotoUrl = fotoUrl.replace('/square.', '/medium.').replace('/small.', '/medium.');
    }

    return {
      id: obs.id?.toString() || Math.random().toString(),
      numeroPublicacion: obs.id || Math.floor(Math.random() * 100000),
      autorId: obs.user?.id?.toString() || 'anonymous',
      fotoUrl,
      descripcionExperiencia: obs.description || `Avistamiento de ${obs.taxon?.preferred_common_name || obs.taxon?.name || 'especie desconocida'}.`,
      latitud: lat,
      longitud: lon,
      ubicacionTexto: obs.place_guess || 'Región Guayana, Venezuela',
      fechaCreacion: obs.observed_on || obs.created_at || new Date().toISOString(),
      biomaId: '2e6b0a8f-2877-4b77-a8bf-1234567890ab', // Selva Tropical por defecto
      categoriaId,
      estado,
      especieVerificadaId: obs.taxon?.id?.toString(),
      especieVerifNombre: obs.taxon?.preferred_common_name || obs.taxon?.name,
      especieVerifNombreCientifico: obs.taxon?.name,
    };
  }
}
