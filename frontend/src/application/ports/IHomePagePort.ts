export type HomePageCard = {
  id: string;
  fotoUrl: string;
  estado: string;
  height: number;
};

export interface IHomePagePort {
  getAvistamientos(): Promise<HomePageCard[]>;
}
