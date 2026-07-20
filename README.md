🌿 GUAYA - Observatorio de Biodiversidad de la Guayana Venezolana

Aplicación móvil multiplataforma (Android, iOS y Web) para la exploración y registro de la biodiversidad en la Guayana Venezolana.

📱 Vistas e Interfaz (UI/UX)
El diseño visual está estrictamente inspirado en el patrón asíncrono de Pinterest, adaptando una paleta cromática orgánica y flujos de diálogo validados bajo el modelo mental del usuario.


## 🛠️ Tecnologías Principales

- **Frontend:** React Native, Expo SDK 54, Expo Router, SQLite (Local), Lucide Icons.
- **Backend:** Node.js, Express, Supabase (Cloud DB).

---

## 📂 Estructura del Proyecto
El proyecto está diseñado bajo los principios de la **Arquitectura Hexagonal (Puertos y Adaptadores)** y **Domain-Driven Design (DDD)**, garantizando que el núcleo de negocio sea independiente de las interfaces de usuario, bases de datos o APIs externas.

```plaintext
/
├── contracts/              # Shared: Interfaces puras y tipos compartidos (La única fuente de verdad)
├── backend/                # Motor de Sincronización (Node.js/Express o Supabase Edge Functions)
└── frontend/               # Aplicación Móvil (React Native + Expo + WatermelonDB Offline-First)
    ├── app/                # Expo Router (Rutas de UI)
    └── src/
        ├── application/    # Lógica de Negocio Orquestada
        │   ├── ports/      # Puertos Abstractos (Interfaces de repositorios para inversión de dependencia)
        │   └── useCases/   # Casos de Uso (ej: SincronizarNube)
        ├── infrastructure/ # Adaptadores Secundarios (Implementaciones concretas del mundo real)
        │   └── database/   # Persistencia Local (WatermelonDB)
        │       ├── models/       # Modelos (Mapean estrictamente a los contratos)
        │       └── repositories/ # Repositorios Maestros (Adaptadores a los Puertos que manejan transacciones atómicas)
        └── presentation/   # Capa Visual (Model-View)
            └── components/ # Componentes UI puros
```

## 🚀 Instalación y Ejecución

Sigue estos pasos para clonar, instalar las dependencias y levantar el entorno de desarrollo local.

### 1. Requisitos Previos
Asegúrate de tener instalados los siguientes componentes en tu sistema operativo:
* **Node.js** (Versión LTS recomendada)
* **pnpm** (Administrador de paquetes rápido y eficiente)
* Aplicación **Expo Go** instalada en tu dispositivo móvil (disponible en iOS y Android).

### 2. Instalación de Dependencias Base
Abre tu terminal, navega hasta la carpeta del `frontend` y ejecuta el siguiente comando para descargar las librerías base (como React Navigation, Expo Router, etc):
```bash
pnpm install
```

### 3. Instalación de Plugins Nativos (WatermelonDB)
Dado que el proyecto utiliza el patrón *Offline-First* con **WatermelonDB**, requiere componentes nativos de SQLite y Babel. Asegúrate de instalar/verificar las dependencias críticas de base de datos antes de iniciar:
```bash
pnpm add @nozbe/watermelondb
pnpm add -D @babel/plugin-proposal-decorators
```
*(Asegúrate de que tu `babel.config.js` y `tsconfig.json` estén configurados para soportar decoradores, requerimiento estricto de WatermelonDB).*

### 4. Ejecución del Servidor de Desarrollo
Para inicializar el bundler de Expo, limpiar la caché y levantar el servidor local de Metro, introduce el siguiente comando dentro de la carpeta `/frontend`:
```bash
pnpm start -c
```
*Una vez iniciado, escanea el código QR que aparece en la terminal usando Expo Go (Android) o la aplicación de Cámara (iOS) para ver la app en tu teléfono.*
