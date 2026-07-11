export interface IPuntoCalor {
    latitude: number;  // Debe llamarse en inglés para que la librería lo entienda directo
    longitude: number;
    weight: number;
    categoriaTaxonomica: 'Aves' | 'Mamíferos' | 'Insectos' | 'Reptiles y Anfibios' | 'Peces y Vida Acuática' | 'Flora';
}