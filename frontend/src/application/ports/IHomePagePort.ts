import { IEspecie } from "../../../../contracts/types/IEspecie";

export type HomePageCard = {
  id: string;
  fotoUrl: string;
  estado: string;
  height: number;
  title?: string;
};

import { Observable } from 'rxjs';

export interface IHomePagePort {
  getAvistamientos(usuarioId?: string): Promise<HomePageCard[]>;
  getEspecies(): Promise<IEspecie[]>;
  observeAvistamientos(usuarioId?: string): Observable<HomePageCard[]>;
  observeEspecies(): Observable<IEspecie[]>;
}
