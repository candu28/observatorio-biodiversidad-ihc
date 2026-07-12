export type NombreCategoria = 'Aves' | 'Mamíferos' | 'Insectos' | 'Reptiles y Anfibios' | 'Peces y Vida Acuática' | 'Flora';

export interface ICategoriaTaxonomica {
    id: string; // UUID
    nombre: NombreCategoria | string;
}
