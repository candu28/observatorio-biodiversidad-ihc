import { ICategoriaRepository } from '../ports/ICategoriaRepository';
import { ICategoriaTaxonomica } from '../../../../contracts/types/ICategoriaTaxonomica';

export class ObtenerCategoriasUseCase {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async execute(): Promise<ICategoriaTaxonomica[]> {
    return await this.categoriaRepository.obtenerCategorias();
  }
}