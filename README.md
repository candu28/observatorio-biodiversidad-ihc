🌿 Observatorio de Biodiversidad de la Guayana Venezolana

Aplicación móvil multiplataforma (Android, iOS y Web) para la exploración y registro de la biodiversidad en la Guayana Venezolana.

📱 Vistas e Interfaz (UI/UX)
El diseño visual está estrictamente inspirado en el patrón asíncrono de Pinterest, adaptando una paleta cromática orgánica y flujos de diálogo validados bajo el modelo mental del usuario.

Inicio (Home): Presenta el encabezado oficial de BioLife, pestañas de filtrado (pills) por biomas, widget climático en tiempo real y un carrusel horizontal de avistamientos recientes basado en la curaduría inicial de libros.

Escanear (Cámara IA): Interfaz nativa de la cámara que permite capturar fotos de la especie. Si hay conexión, procesa el pipeline de IA para reconocimiento taxonómico; si está en modo offline, almacena la captura localmente hasta recuperar red.

Mapa (Calor/SIG): Mapa interactivo integrado con capas que diferencian los biomas de Guayana y visualiza mediante puntos térmicos los avistamientos georreferenciados exactos.

Red de Interés: Feed dinámico (Estilo Masonry) con alturas alternadas donde la comunidad interactúa mediante likes, comentarios y reposts de avistamientos, alimentando un motor asíncrono de recomendaciones personalizadas.

Perfil: Panel del usuario con avatares personalizados, roles explícitos (Entusiasta o Validador/Experto), métricas de contribución y el histórico de capturas sincronizadas en SQLite.

🛠️ Tecnologías Principales
Frontend: React Native, Expo SDK 54, Expo Router, SQLite (Local), Lucide Icons.
Backend: Node.js, Express, Supabase (Cloud DB).
IA/Data: Google Gemini 1.5 Pro (Identificación), iNaturalist API (Validación Biológica).

📂 Estructura del Proyecto

El proyecto está dividido en un ecosistema móvil (Frontend) y un servidor de lógica de negocio (Backend).

📱 Frontend: MVC Adaptado (React Native / Expo)
Ubicado principalmente en la raíz y en la carpeta `/src`. Basado en un modelo de componentes donde la lógica se separa de la interfaz.

```plaintext
/
├── app/                    # Expo Router (Rutas y Navegación)
│   ├── (tabs)/             # Pestañas principales (Inicio, Cámara, Mapa)
│   └── _layout.tsx         # Layout principal y proveedores de contexto
├── assets/                 # Recursos estáticos (Imágenes, Fuentes, Iconos)
├── src/
│   ├── controllers/        # Controladores (Custom Hooks como useCamera, useNetwork)
│   ├── models/             # Lógica de Datos (SQLite, NetworkContext, Mocks)
│   ├── types/              # Definiciones de TypeScript y Interfaces
│   ├── utils/              # Helpers (Formateadores, constantes, validaciones UI)
│   └── views/              # Interfaz de Usuario (UI)
│       ├── components/     # Componentes atómicos (Tarjetas, Botones, Header)
│       └── screens/        # Lógica visual de pantallas completas
├── package.json            # Dependencias del Frontend
└── tsconfig.json           # Configuración de TypeScript

⚙️ Backend: Arquitectura por Capas (Node.js)
Ubicado en la carpeta /backend. Diseñado para escalar y separar las integraciones de IA de la base de datos.
/backend
├── src/
│   ├── routes/             # Definición de Endpoints HTTP (Express)
│   ├── controllers/        # Validación de peticiones y orquestación
│   ├── services/           # Lógica de Negocio (Pipeline de IA, Filtro Híbrido)
│   ├── repositories/       # Acceso a Datos (Consultas puras a Supabase)
│   ├── integrations/       # Adaptadores Externos (Gemini 1.5 Pro, iNaturalist)
│   └── utils/              # Utilidades compartidas y manejo de errores
├── .env                    # Variables de entorno (API Keys de Gemini/Supabase)
└── package.json            # Dependencias del servidor



Notas adicionales para el README:
- Frontend MVC: La Vista (dentro de `src/views`) solo renderiza. El Controlador (`src/controllers`) maneja la lógica de permisos y cámara. El Modelo (`src/models`) gestiona el estado de red y la base de datos local.
- Backend por Capas: Cada capa solo puede comunicarse con la que tiene inmediatamente debajo (Controller -> Service -> Repository).


🚀 Instalación y Ejecución
Sigue estos pasos para clonar, instalar las dependencias y levantar el entorno de desarrollo local en tu máquina.

1. Requisitos Previos
Asegúrate de tener instalados los siguientes componentes en tu sistema operativo:

Node.js (Versión LTS recomendada)

npm o yarn

Aplicación Expo Go instalada en tu dispositivo móvil (disponible en Google Play Store y Apple App Store).

2. Instalación de Dependencias
Abre tu terminal, navega hasta la carpeta raíz de la aplicación y ejecuta el comando de instalación de paquetes: npm install

3. Ejecución del Servidor de Desarrollo
Para inicializar el bundler de Expo y levantar el servidor local de Metro, introduce el siguiente comando: npm start/npx expo start

4. Sincronización con el Teléfono Móvil
Para visualizar la aplicación en tiempo real en tu celular, comprueba que tu PC y tu dispositivo móvil se encuentren conectados exactamente a la misma red Wi-Fi:

En iOS (iPhone): Abre la aplicación de la cámara nativa del teléfono, apunta al código QR generado en la terminal y toca el enlace amarillo para abrir el proyecto dentro de la app de Expo Go.

En Android: Abre la aplicación de Expo Go previamente descargada y presiona el botón interactivo superior que indica "Scan QR Code" para escanear el código de la pantalla.