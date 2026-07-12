import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { mySchema } from './schema';

import Usuario from './models/Usuario';
import Avistamiento from './models/Avistamiento';
import Proyecto from './models/Proyecto';

import Bioma from './models/Bioma';
import CategoriaTaxonomica from './models/CategoriaTaxonomica';
import Especie from './models/Especie';
import ComentarioAvistamiento from './models/ComentarioAvistamiento';
import SugerenciaEspecie from './models/SugerenciaEspecie';
import TareaProyecto from './models/TareaProyecto';
import AporteTarea from './models/AporteTarea';
import ParticipanteProyecto from './models/ParticipanteProyecto';
import ProyectoAvistamiento from './models/ProyectoAvistamiento';

// Configuramos el adaptador local de SQLite
const adapter = new SQLiteAdapter({
  schema: mySchema,
  // (opcional pero recomendado) 
  // migrations, 
  jsi: true, // Habilita el JSI para que SQLite vuele en React Native
  onSetUpError: error => {
    console.error('Error inicializando la base de datos', error);
  }
});

// Instanciamos la base de datos global de Watermelon
export const database = new Database({
  adapter,
  modelClasses: [
    Usuario,
    Avistamiento,
    Proyecto,
    Bioma,
    CategoriaTaxonomica,
    Especie,
    ComentarioAvistamiento,
    SugerenciaEspecie,
    TareaProyecto,
    AporteTarea,
    ParticipanteProyecto,
    ProyectoAvistamiento,
  ],
});
