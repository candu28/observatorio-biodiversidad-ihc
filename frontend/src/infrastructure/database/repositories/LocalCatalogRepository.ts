import { database } from '../index';
import { ILocalCatalogRepository } from '../../../application/ports/ILocalCatalogRepository';
import { IBioma } from '../../../../../contracts/types/IBioma';
import { ICategoriaTaxonomica } from '../../../../../contracts/types/ICategoriaTaxonomica';
import { IEspecie } from '../../../../../contracts/types/IEspecie';
import BiomaModel from '../models/Bioma';
import CategoriaModel from '../models/CategoriaTaxonomica';
import EspecieModel from '../models/Especie';
import { Q } from '@nozbe/watermelondb';

export class LocalCatalogRepository implements ILocalCatalogRepository {
  async getAllBiomas(): Promise<IBioma[]> {
    return await database.get<BiomaModel>('biomas').query().fetch();
  }

  async getAllCategorias(): Promise<ICategoriaTaxonomica[]> {
    return await database.get<CategoriaModel>('categorias_taxonomicas').query().fetch();
  }

  async getAllEspecies(): Promise<IEspecie[]> {
    return await database.get<EspecieModel>('especies').query().fetch();
  }

  async getEspeciesByCategoria(categoriaId: string): Promise<IEspecie[]> {
    return await database.get<EspecieModel>('especies').query(
      Q.where('categoria_id', categoriaId)
    ).fetch();
  }
}
