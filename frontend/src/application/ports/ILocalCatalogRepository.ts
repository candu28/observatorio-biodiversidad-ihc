import { IBioma } from '../../../../contracts/types/IBioma';
import { ICategoriaTaxonomica } from '../../../../contracts/types/ICategoriaTaxonomica';
import { IEspecie } from '../../../../contracts/types/IEspecie';

export interface ILocalCatalogRepository {
  getAllBiomas(): Promise<IBioma[]>;
  getAllCategorias(): Promise<ICategoriaTaxonomica[]>;
  getAllEspecies(): Promise<IEspecie[]>;
  getEspeciesByCategoria(categoriaId: string): Promise<IEspecie[]>;
}
