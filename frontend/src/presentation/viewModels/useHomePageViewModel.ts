import { useState, useEffect, useMemo } from 'react';
import { ObtenerHomePageUseCase } from '../../application/useCases/ObtenerHomePageUseCase';
import { ObtenerProyectosUseCase } from '../../application/useCases/ObtenerProyectosUseCase';
import { ObtenerCategoriasUseCase } from '../../application/useCases/ObtenerCategoriasUseCase';

import { MockHomePageRepository } from '../../infrastructure/adapters/mock/homepage/MockHomePageRepository';
import { MockProyectoRepository } from '../../infrastructure/adapters/mock/proyecto/MockProyectoRepository';
import { MockCategoriaRepository } from '../../infrastructure/adapters/mock/MockCategoriaRepository';

import { HomePageCard } from '../../application/ports/IHomePagePort';
import { IProyecto } from '../../../../contracts/types/IProyecto';
import { IEspecie } from '../../../../contracts/types/IEspecie';
import { ICategoriaTaxonomica } from '../../../../contracts/types/ICategoriaTaxonomica';

export function useHomePageViewModel() {
  const [data, setData] = useState<HomePageCard[]>([]);
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [especies, setEspecies] = useState<IEspecie[]>([]);
  const [categorias, setCategorias] = useState<ICategoriaTaxonomica[]>([]);
  
  // Track by ID instead of string name. null means 'Todo'
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Instantiate Use Cases with Adapters here (ViewModel is the composition root)
        const homePageUseCase = new ObtenerHomePageUseCase(new MockHomePageRepository());
        const proyectosUseCase = new ObtenerProyectosUseCase(new MockProyectoRepository());
        const categoriasUseCase = new ObtenerCategoriasUseCase(new MockCategoriaRepository());

        // Run fetches concurrently for better performance
        const [homeResult, projectsData, categoriasData] = await Promise.all([
          homePageUseCase.execute(),
          proyectosUseCase.execute(),
          categoriasUseCase.execute(),
        ]);

        setData(homeResult.avistamientos);
        setEspecies(homeResult.especies);
        setProyectos(projectsData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const filteredSpecies = useMemo(() => {
    if (!activeCategoryId) {
      return especies;
    }
    return especies.filter((species) => species.categoriaId === activeCategoryId);
  }, [activeCategoryId, especies]);

  return {
    data,
    proyectos,
    categorias,
    activeCategoryId,
    setActiveCategoryId,
    filteredSpecies,
    isLoading,
  };
}