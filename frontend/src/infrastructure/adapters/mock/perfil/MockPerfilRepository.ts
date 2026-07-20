
// @ts-ignore
const dbMockData = require('../../../../../../contracts/mocks/dbMockData.json');
import { IUsuario } from '../../../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { IPerfilPort } from '../../../../application/ports/IPerfilPort';
import { avistamientosEnMemoria, proyectosEnMemoria } from '../mockState';

export class MockPerfilRepository implements IPerfilPort {
  async getUsuarioActual(): Promise<IUsuario | null> {
    const usuarios = (dbMockData as any).usuarios || [];
    return (usuarios[0] || null) as IUsuario | null;
  }

  async getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]> {
    return avistamientosEnMemoria.filter(av => av.autorId === usuarioId);
  }

  async getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]> {
    return proyectosEnMemoria.filter(p => p.creadorId === usuarioId);
  }

  async registrarInteres(usuarioId: string, avistamientoId: string): Promise<void> {
    // Mock implementation: could save to in-memory state if we wanted to display it
    console.log(`Usuario ${usuarioId} registró interés en avistamiento ${avistamientoId}`);
  }
}
