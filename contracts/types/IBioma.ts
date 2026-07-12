export type NombreBioma = 'Selva Tropical' | 'Sabana' | 'Tepuyes';

export interface IBioma {
    id: string; // UUID
    nombre: NombreBioma | string;
    descripcion?: string;
}
