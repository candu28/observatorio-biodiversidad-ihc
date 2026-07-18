# Alineación con Arquitectura Hexagonal y Reglas de Negocio

Tras revisar las pautas de tu compañero, he evaluado la implementación actual y propongo un plan para asegurar que el código cumpla estrictamente con la arquitectura de puertos y adaptadores (Clean Architecture) y que las reglas de negocio estén en los Casos de Uso.

## Evaluación Actual

| Capa | Estado | Observación |
| :--- | :--- | :--- |
| **Contratos (Entidades)** | ✅ Cumple | Se usan `IAporteTarea`, `IProyecto`, etc., definidos en `/contracts`. |
| **Casos de Uso (Aplicación)** | ⚠️ Mejora | El caso de uso `AgregarAporteTarea` es muy simple. Faltan las reglas de validación que mencionó tu compañero. |
| **Puertos (Interfaces)** | ✅ Cumple | `ILocalProyectoRepository` y `IMediaPickerPort` definen los contratos. |
| **Infraestructura (Adaptadores)** | ✅ Cumple | Los repositorios mock y adaptadores de hardware (Expo) están correctamente aislados. |
| **Presentación (UI)** | ⚠️ Mejora | Los componentes de UI están instanciando directamente los adaptadores. |

## Plan de Mejora

### 1. Fortalecer Casos de Uso (Reglas de Negocio)

Moveremos las validaciones de "qué debe tener un aporte" (foto obligatoria, comentario, etc.) del componente de UI al Caso de Uso, tal como pidió tu compañero.

#### [AgregarAporteTareaUseCase.ts](file:///C:/Users/Lenovo/Desktop/observatorio-biodiversidad-ihc/frontend/src/application/useCases/AgregarAporteTareaUseCase.ts)

- **Reglas a implementar:**
    - Validar que el `archivoUrl` (foto) sea obligatorio.
    - Validar que el `usuarioId` esté presente.
    - Validar que el `comentarioDescriptivo` no esté vacío y cumpla con una longitud mínima.
    - Generar el `aporteId` y la `fechaAporte` dentro del Caso de Uso para que la UI no tenga esa responsabilidad.

### 2. Desacoplar Presentación

Refactorizaremos las pantallas de UI para que dependan de la lógica de negocio en lugar de instanciar detalles de infraestructura.

#### [tarea/[id].tsx](file:///C:/Users/Lenovo/Desktop/observatorio-biodiversidad-ihc/frontend/app/proyecto/tarea/[id].tsx)

- Simplificar la creación del objeto `aporte` en la UI, delegando la validación y completitud del objeto al Caso de Uso.

## Verification Plan

### Manual Verification
- **Validación de Reglas:** Intentar subir un aporte con datos incompletos (ej. sin comentario) y verificar que el Caso de Uso lance un error capturado por la UI.
- **Persistencia:** Confirmar que los aportes válidos sigan guardándose correctamente en el Repositorio Mock.
