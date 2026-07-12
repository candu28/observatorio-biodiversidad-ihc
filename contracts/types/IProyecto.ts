import { NombreBioma } from './IBioma';
import { NombreCategoria } from './ICategoriaTaxonomica';

export interface IProyecto {
    id: string; // UUID
    creadorId: string; // UUID
    titulo: string;
    descripcion: string;
    bioma: NombreBioma;
    categoriasTaxonomicas: NombreCategoria[]; // Especies/Categorías que aborda el proyecto
    ubicacionGeografica: string;
    fechaInicio: string; // TIMESTAMP
    cantidadParticipantes: number;
}