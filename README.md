🌿 GUAYA - Observatorio de Biodiversidad de la Guayana Venezolana

Aplicación móvil multiplataforma (Android, iOS y Web) para la exploración y registro de la biodiversidad en la Guayana Venezolana.

📱 Vistas e Interfaz (UI/UX)
El diseño visual está estrictamente inspirado en el patrón asíncrono de Pinterest, adaptando una paleta cromática orgánica y flujos de diálogo validados bajo el modelo mental del usuario.


## 🛠️ Tecnologías Principales

- **Frontend:** React Native, Expo SDK 54, Expo Router, SQLite (Local), Lucide Icons.
- **Backend:** Node.js, Express, Supabase (Cloud DB).
- **IA/Data:** Google Gemini 1.5 Pro (Identificación preliminar), iNaturalist API (Validación Biológica).

---

## 📂 Estructura del Proyecto
El proyecto está diseñado bajo los principios de la **Arquitectura Hexagonal (Puertos y Adaptadores)**, garantizando que el núcleo de negocio sea independiente de las interfaces de usuario, bases de datos o APIs externas.

```markdown
### 📱 Frontend: Model-View + Hexagonal (React Native / Expo)
Ubicado en la carpeta `/frontend`. Combina el patrón de presentación visual (Model-View/MVVM) con los principios de la Arquitectura Hexagonal aislando los servicios externos.

```plaintext
/frontend
├── app/                    # Expo Router (Rutas de UI)
├── assets/                 # Recursos estáticos (Imágenes, Iconos)
├── src/
│   ├── application/        # Casos de Uso (Lógica de aplicación del lado del cliente)
│   ├── domain/             # Entidades locales y Puertos (Interfaces de lo que necesita la app)
│   ├── infrastructure/     # Adaptadores Secundarios (Llamadas a API, SQLite local, Hardware/Cámara)
│   └── presentation/       # Capa de Presentación (Model-View)
│       ├── components/     # Componentes visuales puros (UI) y de características
│       └── viewModels/     # Gestores de estado (Conectan la UI con los Casos de Uso)
├── package.json            # Dependencias del Frontend
└── tsconfig.json           # Configuración de TypeScript
```

### ⚙️ Backend: Arquitectura Hexagonal Pura (Node.js)
Ubicado en la carpeta `/backend`. El corazón del sistema no sabe si está conectado a una API REST, a un bot o a una base de datos específica.

```plaintext
/backend
├── src/
│   ├── application/        # Casos de Uso (ej: Registrar Avistamiento, Calcular Aciertos)
│   ├── domain/             # El Núcleo: Entidades, Reglas de Negocio y Puertos (in/out)
│   └── infrastructure/     # El Borde: Adaptadores que conectan el exterior con el núcleo
│       ├── controllers/    # Adaptadores Primarios (Endpoints REST Express)
│       └── adapters/       # Adaptadores Secundarios (Supabase, Gemini API, iNaturalist)
├── .env                    # Variables de entorno
└── package.json            # Dependencias del servidor
```

## 🚀 Instalación y Ejecución

Sigue estos pasos para clonar, instalar las dependencias y levantar el entorno de desarrollo local.

### 1. Requisitos Previos
Asegúrate de tener instalados los siguientes componentes en tu sistema operativo:
* **Node.js** (Versión LTS recomendada)
* **pnpm** (Administrador de paquetes rápido y eficiente)
* Aplicación **Expo Go** instalada en tu dispositivo móvil (disponible en iOS y Android).

### 2. Instalación de Dependencias
Abre tu terminal, navega hasta la carpeta del `frontend` (o la raíz del monorepo si usas workspaces) y ejecuta el siguiente comando:
```bash
pnpm install
```

### 3. Ejecución del Servidor de Desarrollo
Para inicializar el bundler de Expo, limpiar la caché y levantar el servidor local de Metro, introduce el siguiente comando dentro de la carpeta `/frontend`:
```bash
pnpm start -c
```
*Una vez iniciado, escanea el código QR que aparece en la terminal usando Expo Go (Android) o la aplicación de Cámara (iOS) para ver la app en tu teléfono.*
```
