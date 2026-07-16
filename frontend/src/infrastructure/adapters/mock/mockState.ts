import avistamientosJson from '../../../../../contracts/mocks/perfil/avistamientos.json';
import proyectosJson from '../../../../../contracts/mocks/perfil/proyectos.json';

import { IAvistamiento } from '../../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../../contracts/types/IProyecto';

// Variables globales mutables en memoria para simular una base de datos local
export let avistamientosEnMemoria: IAvistamiento[] = [...(avistamientosJson as IAvistamiento[])];
export let proyectosEnMemoria: IProyecto[] = [...(proyectosJson as IProyecto[])];

export const addAvistamientoEnMemoria = (avistamiento: IAvistamiento) => {
  // Lo añadimos al inicio para que aparezca primero
  avistamientosEnMemoria = [avistamiento, ...avistamientosEnMemoria];
};
