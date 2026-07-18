// @ts-ignore
const dbMockData = require('../../../../../../contracts/mocks/dbMockData.json');

import { HomePageCard, IHomePagePort } from '../../../../application/ports/IHomePagePort';

export class MockHomePageRepository implements IHomePagePort {
  async getAvistamientos(): Promise<HomePageCard[]> {
    const raw = (dbMockData as any);
    const avistamientos = raw.avistamientos || [];
    const multimedia = raw.multimedia_avistamientos || [];

    const cards: HomePageCard[] = (avistamientos as any[]).map((a) => {
      const fotoFromField = a.foto_url || a.fotoUrl || null;
      const media = multimedia.find((m: any) => m.avistamiento_id === a.id || m.avistamiento_id === a.id);
      const archivo = media?.archivo_url || null;
      const fotoUrl = fotoFromField || archivo || 'https://images.unsplash.com/photo-1550977186-b484af8a264a?q=80&w=800';

      // provide a reasonable height for masonry layout
      const height = Math.floor(180 + Math.abs(hashCode(a.id || String(Math.random()))) % 260);

      return {
        id: a.id,
        fotoUrl,
        estado: a.estado || 'Pendiente',
        height,
      } as HomePageCard;
    });

    console.log('[MockHomePageRepository] returning cards:', cards.length);
    return cards;
  }
}

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}
