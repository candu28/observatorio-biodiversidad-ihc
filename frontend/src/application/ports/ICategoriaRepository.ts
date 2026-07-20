import { ICategoriaTaxonomica } from '../../../../contracts/types/ICategoriaTaxonomica';

export interface ICategoriaRepository {
  obtenerCategorias(): Promise<ICategoriaTaxonomica[]>;
}