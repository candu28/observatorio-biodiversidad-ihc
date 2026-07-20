import { ICategoriaRepository } from '../../../application/ports/ICategoriaRepository';
import { ICategoriaTaxonomica } from '../../../../../contracts/types/ICategoriaTaxonomica';

// Statically import your central mock data database
import dbMockData from '../../../../../contracts/mocks/dbMockData.json';

export class MockCategoriaRepository implements ICategoriaRepository {
  async obtenerCategorias(): Promise<ICategoriaTaxonomica[]> {
    // Simulating network/file-read delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Pull directly from your mock database configuration
    const rawCategories = dbMockData.categorias_taxonomicas || [];

    // Map the database structure securely to your domain contract type
    return rawCategories.map((cat: any) => ({
      id: cat.id,
      nombre: cat.nombre, // If your JSON uses 'nombre_categoria' or similar, change the mapping here
    }));
  }
}