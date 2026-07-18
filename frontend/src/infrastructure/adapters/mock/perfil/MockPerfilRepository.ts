// @ts-ignore
const dbMockData = require('../../../../../../contracts/mocks/dbMockData.json');

import { IUsuario } from '../../../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { IPerfilPort } from '../../../../application/ports/IPerfilPort';

export class MockPerfilRepository implements IPerfilPort {
  async getUsuarioActual(): Promise<IUsuario | null> {
    const usuarios = (dbMockData as any).usuarios || [];
    return (usuarios[0] || null) as IUsuario | null;
  }

  async getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]> {
    const avistamientos = (dbMockData as any).avistamientos || [];
    return (avistamientos as IAvistamiento[]).filter((av: any) => av.autor_id === usuarioId || av.autorId === usuarioId);
  }

  async getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]> {
    const proyectos = (dbMockData as any).proyectos || [];
    return (proyectos as IProyecto[]).filter((p: any) => p.creador_id === usuarioId || p.creadorId === usuarioId);
  }
}
