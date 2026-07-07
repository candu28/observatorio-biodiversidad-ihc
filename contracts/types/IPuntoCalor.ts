export interface IPuntoCalor {
    latitude: number;  // Debe llamarse en inglés para que la librería lo entienda directo
    longitude: number;
    weight: number;    // Entre 1 y 100. (Ej: 1 avistamiento = 1. Si son 5 avistamientos pegados, weight = 5)
}