import { NombreCategoria } from './ICategoriaTaxonomica';

export interface IPuntoCalor {
    latitude: number;  // Debe llamarse en inglés para que la librería lo entienda directo
    longitude: number;
    weight: number;
    categoriaTaxonomica: NombreCategoria; // Enum NombreCategoria
    especieVerificadaId?: string; // Permitir filtrar el mapa de calor por una especie en específico
}