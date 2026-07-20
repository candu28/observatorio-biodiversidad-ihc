import { HomePageCard, IHomePagePort } from '../ports/IHomePagePort';
import { IEspecie } from '../../../../contracts/types/IEspecie';

export type HomePageViewModel = {
  avistamientos: HomePageCard[];
  especies: IEspecie[]; // <-- Add this
  filters: string[];
};

export class ObtenerHomePageUseCase {
  constructor(private readonly homePagePort: IHomePagePort) {}

  async execute(usuarioId?: string): Promise<HomePageViewModel> {
    const [avistamientos, especies] = await Promise.all([
      this.homePagePort.getAvistamientos(usuarioId),
      this.homePagePort.getEspecies()
    ]);

    return {
      avistamientos,
      especies,
      filters: ['Todo', 'Especies', 'Proyectos'],
    };
  }
}