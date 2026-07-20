export interface IEspecie {
    id: string; // UUID
    nombreComun?: string;
    nombreCientifico: string;
    categoriaId: string; // UUID relacion a Categorias_Taxonomicas
    bioma?: string;
    totalObservaciones: number;
}
