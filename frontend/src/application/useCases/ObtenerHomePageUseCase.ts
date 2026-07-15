import { HomePageCard, IHomePagePort } from '../ports/IHomePagePort';

export type HomePageViewModel = {
  avistamientos: HomePageCard[];
  filters: string[];
};

export class ObtenerHomePageUseCase {
  constructor(private readonly homePagePort: IHomePagePort) {}

  async execute(): Promise<HomePageViewModel> {
    const avistamientos = await this.homePagePort.getAvistamientos();

    return {
      avistamientos,
      filters: ['Todo', 'Especies', 'Proyectos'],
    };
  }
}
