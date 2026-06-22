# BG Invoice — Frontend

> Sistema de facturación con gestión de productos, clientes, usuarios, facturas y configuración de empresa. Este repositorio contiene el **frontend** de la aplicación, construido con **Angular 17**. El backend (.NET 10) está en [`victorguillen20/pruebaBGBack`](https://github.com/victorguillen20/pruebaBGBack).


| Pantalla | Descripción | Archivo sugerido |
|---|---|---|
| Login | Pantalla de inicio de sesión |<img width="1918" height="1126" alt="imagen" src="https://github.com/user-attachments/assets/830c4a6a-8921-4f01-991b-e81fb99b381a" />|
| Dashboard | Panel principal con métricas | <img width="1915" height="1123" alt="imagen" src="https://github.com/user-attachments/assets/409ce91b-dd32-468d-802e-f47e3344da34" />|
| Lista de facturas | Tabla con búsqueda, filtros, paginación y acciones (incluido el botón de descarga de PDF) |<img width="1918" height="1123" alt="imagen" src="https://github.com/user-attachments/assets/49cfd4c0-1316-41e1-ac91-90122d3e90fe" />|
| Nueva factura | Dialog de creación con editor de líneas |<img width="1915" height="1123" alt="imagen" src="https://github.com/user-attachments/assets/6576c620-9cec-4373-acdd-564b1a9c375c" />|
| Factura en PDF | PDF generado al hacer click en descargar (vista en el browser) |<img width="1918" height="1126" alt="imagen" src="https://github.com/user-attachments/assets/ce5b86f4-60fe-4614-b122-bb765b05404d" />|
| Lista de clientes | Tabla con filtro de activos y acciones |<img width="1912" height="1123" alt="imagen" src="https://github.com/user-attachments/assets/4c141df3-5347-43e5-94f2-5fad59bcb2fe" />|
| Lista de productos | Tabla con código auto-generado al crear |<img width="1918" height="1126" alt="imagen" src="https://github.com/user-attachments/assets/e754e4c2-2d04-48d4-b8b6-0ac83a3b6ac8" />|
| Nuevo producto | Dialog con código deshabilitado y auto-generado |<img width="1918" height="1126" alt="imagen" src="https://github.com/user-attachments/assets/5dc36477-d962-4df3-ad69-bf771b738eba" />|
| Lista de usuarios | Tabla con acciones (sólo admin) |<img width="1918" height="1123" alt="imagen" src="https://github.com/user-attachments/assets/2715a8f0-0ce3-4964-8d1f-f73bf7726479" />|
| Configuración | Página de config de empresa con upload de logo |<img width="1918" height="1134" alt="imagen" src="https://github.com/user-attachments/assets/04aa459b-1a90-453c-82c1-c4d750c0d6af" />|

## 🚀 Tech Stack

- **Framework**: Angular 17 (standalone components, signals, functional APIs)
- **UI**: Angular Material 17
- **Lenguaje**: TypeScript 5 (strict mode, nullable enabled)
- **Estado**: Signal-based (sin NgRx, sin RxJS para estado local)
- **HTTP**: RxJS Observables
- **Forms**: Reactive Forms
- **Auth**: JWT en `localStorage` con interceptor funcional
- **Build**: `@angular/build` (esbuild)
- **Testing**: Karma + Jasmine
- **Linting**: ESLint + `@angular-eslint`
- **Pipes**: Currency pipe custom (`bgCurrency`) para formato `$1.234,56`

---

## 🏛️ Arquitectura

### Visión general

La aplicación sigue una **arquitectura modular por features** con **separación clara de responsabilidades** en tres capas:

```
┌─────────────────────────────────────────────────────────┐
│  presentation layer (features/*)                          │
│  Componentes standalone, templates, dialogs               │
└────────────┬────────────────────────────────────────────┘
             │ usa (inyección de dependencias)
┌────────────▼────────────────────────────────────────────┐
│  service layer (core/api/*)                              │
│  Servicios que consumen la API REST del backend          │
└────────────┬────────────────────────────────────────────┘
             │ llama
┌────────────▼────────────────────────────────────────────┐
│  API backend (pruebaBGBack)                              │
│  .NET 10 + Clean Architecture + EF Core + SQLite          │
└─────────────────────────────────────────────────────────┘
```

Cada feature (clientes, productos, facturas, etc.) es **autocontenida**: tiene sus propios componentes, páginas, modelos y diálogos, sin acoplarse a otras features.

### Decisiones arquitectónicas clave

#### 1. Standalone Components (sin NgModules)

Angular 17 permite componentes **standalone** que se importan directamente, sin necesidad de declarar un `NgModule`. Esta decisión se tomó porque:

- **Menos boilerplate**: no hay que mantener archivos `.module.ts` por feature
- **Tree-shaking mejorado**: solo se incluye el código de las features que se usan
- **Lazy loading más simple**: cada feature se carga bajo demanda con `loadComponent`
- **Mejor DX**: el grafo de dependencias es explícito en cada componente (`imports: [...]`)

#### 2. Signals en lugar de NgRx o BehaviorSubject

Angular 17 introdujo las **Signals** como primitiva de reactividad. Esta decisión se basó en:

- **Simplicidad**: no requiere un store global complejo, ni setup de efectos, ni selectores memoizados
- **Rendimiento**: las signals solo re-renderizan los componentes que las consumen
- **Interop con RxJS**: las signals se pueden convertir a observables y viceversa (`toSignal`, `toObservable`) cuando hace falta
- **Suficiente para esta app**: la mayoría del estado es local a un componente o se comparte vía servicio singleton. No se necesita un store global sofisticado

#### 3. Feature-based modular structure

Cada feature tiene su propia carpeta en `src/app/features/` con esta estructura:

```
features/customers/
├── pages/
│   ├── customer-list/        # Página principal (tabla)
│   ├── customer-form-dialog/  # Dialog de crear/editar
│   └── customer-delete-dialog/  # Dialog de confirmar eliminación
├── utils/
│   └── customer-format.ts    # Helpers específicos de la feature
└── models/                   # Tipos específicos (si los hay)
```

Esta decisión se tomó porque:
- **Cohesión alta**: todo lo relacionado con clientes vive en un solo lugar
- **Bajo acoplamiento**: borrar una feature es tan simple como borrar su carpeta
- **Onboarding rápido**: un dev nuevo puede entender toda la feature leyendo un solo directorio
- **Testeable**: cada feature se puede testear de forma aislada

#### 4. Service-per-controller pattern

Para cada controlador del backend hay un servicio Angular con la misma forma. Ejemplo:

```typescript
// Backend: CustomersController tiene GET, POST, PUT, DELETE
// Frontend: CustomersService tiene search(), getById(), create(), update(), delete()
```

**Un servicio por feature, no un servicio gigante.** Esto facilita:
- Inyección de dependencias específica por feature
- Mocking en tests
- Tree-shaking (si no usás `customers`, el servicio no se incluye)

#### 5. Functional interceptors y guards

A partir de Angular 15, los interceptors y guards pueden ser **funciones** en lugar de clases. Esta decisión se tomó porque:

- **Tree-shakable**: si no se usan, no se incluyen en el bundle
- **Más simples**: una función pura vs una clase con un método
- **Más testeables**: funciones puras son fáciles de mockear
- **Estilo moderno**: es el patrón recomendado por el equipo de Angular

#### 6. Componentes reutilizables en `shared/`

Componentes que se usan en múltiples features viven en `src/app/shared/`:

- **`PaginatedTable<T>`**: tabla con paginación, búsqueda y acciones, genérica por tipo
- **`LoadingSpinnerComponent`**: spinner de carga
- **`ErrorBannerComponent`**: banner de error con retry
- **`bgCurrency` pipe**: formato de moneda localizado

---

## 🎨 Patrones de diseño aplicados

| Patrón | Dónde se aplica | Por qué |
|---|---|---|
| **Singleton** | Services con `providedIn: 'root'` | Una sola instancia por app, sin providers manuales |
| **Repository** | `CustomersService`, `ProductsService`, etc. | Abstraen la API REST, los componentes no saben de HTTP |
| **Facade** | Los mismos services | Exponen una API simple al componente, ocultan complejidad |
| **Dependency Injection** | Constructor de componentes y servicios | Desacopla, facilita testing |
| **Observer** | RxJS para HTTP, Signals para estado local | Reactividad según el caso de uso |
| **Composite** | Composición de componentes (Card > Header + Content + Actions) | Reutilización de UI |
| **Strategy** | Validadores de formularios (Validators.required, email, custom) | Algoritmos intercambiables |
| **Factory** | Angular DI en sí mismo | Crea instancias según dependencias |
| **Module** | Feature folders como módulos lógicos | Encapsulación |

---

## 📐 Principios aplicados

### SOLID

- **S — Single Responsibility**: cada componente y servicio tiene una sola razón para cambiar. Ejemplo: `CustomerListComponent` solo renderiza la tabla, `CustomerFormDialogComponent` solo edita un cliente.
- **O — Open/Closed**: la app es extensible por composición (nuevas features se agregan sin modificar las existentes).
- **L — Liskov Substitution**: las interfaces (ej. `CustomerResponse`) son contratos estables que el backend puede cambiar sin romper el frontend.
- **I — Interface Segregation**: cada service expone solo los métodos que necesita (no hay un `ApiService` gigante con 50 métodos).
- **D — Dependency Inversion**: los componentes dependen de abstracciones (services) inyectadas, no de concreciones.

### Otras buenas prácticas

- **DRY**: componentes reutilizables en `shared/`, lógica común en utils por feature.
- **KISS**: preferimos la solución más simple que funcione. Signals > NgRx para nuestro caso.
- **YAGNI**: no agregamos features especulativas. Cada feature que está, es porque el usuario la pidió.
- **Separation of Concerns**: UI (templates), lógica (TS del componente), datos (services) están separados.
- **Convention over Configuration**: seguimos las convenciones de Angular (sufijos `.component.ts`, `.service.ts`, carpetas `pages/`, `core/`, `shared/`).
- **No comments in code**: el código se autoexplica. Los nombres son documentación.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── app.component.ts        # Componente raíz (router-outlet)
│   ├── app.config.ts           # Configuración de la app (providers, routing)
│   ├── app.routes.ts           # Rutas top-level
│   │
│   ├── core/                   # Servicios singleton, guards, interceptors
│   │   ├── api/                # Un servicio por controlador del backend
│   │   │   ├── customers.service.ts
│   │   │   ├── products.service.ts
│   │   │   ├── invoices.service.ts
│   │   │   ├── users.service.ts
│   │   │   ├── company-config.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── api.types.ts    # Tipos compartidos (PagedResult, etc.)
│   │   ├── auth/               # Estado de auth, guards
│   │   └── interceptors/       # Interceptors funcionales (JWT, errors)
│   │
│   ├── shared/                 # Componentes, pipes reutilizables
│   │   ├── paginated-table/    # Tabla genérica
│   │   ├── loading-spinner/
│   │   ├── error-banner/
│   │   └── pipes/
│   │       └── bg-currency.pipe.ts
│   │
│   ├── features/               # Una carpeta por feature
│   │   ├── customers/
│   │   │   ├── pages/
│   │   │   │   ├── customer-list/
│   │   │   │   ├── customer-form-dialog/
│   │   │   │   └── customer-delete-dialog/
│   │   │   ├── utils/
│   │   │   │   └── customer-format.ts   # Normalización identificación/teléfono
│   │   │   └── models/
│   │   ├── products/
│   │   │   ├── pages/
│   │   │   │   ├── product-list/
│   │   │   │   ├── product-form-dialog/
│   │   │   │   └── product-delete-dialog/
│   │   │   └── utils/
│   │   │       └── product-code.ts       # Generador de código auto
│   │   ├── invoices/
│   │   │   └── pages/
│   │   │       ├── invoice-list/
│   │   │       ├── invoice-form-dialog/  # Con editor de líneas
│   │   │       ├── invoice-cancel-dialog/
│   │   │       └── invoice-detail-dialog/
│   │   ├── users/
│   │   │   └── pages/
│   │   │       ├── user-list/
│   │   │       ├── user-form-dialog/
│   │   │       ├── user-change-password-dialog/
│   │   │       └── user-delete-dialog/
│   │   └── company-config/
│   │       └── pages/
│   │           └── company-config/        # Config + upload de logo
│   │
│   └── layouts/
│       └── shell/              # Layout con sidebar para rutas autenticadas
│
├── assets/                     # Recursos estáticos
├── environments/                # environment.ts (dev) y environment.prod.ts (prod)
│   ├── environment.ts
│   └── environment.prod.ts     # ← apiUrl apunta a producción
├── styles.scss                 # Estilos globales
└── main.ts                     # Entry point
```

---

## 🛠️ Setup local

### Prerrequisitos

- Node.js 20+ (recomendado LTS)
- npm 10+
- Backend corriendo en `http://localhost:5000` (ver repo [`pruebaBGBack`](https://github.com/victorguillen20/pruebaBGBack))

### Pasos

```bash
# 1. Clonar el repo
git clone https://github.com/victorguillen20/pruebaBGFront.git
cd pruebaBGFront

# 2. Instalar dependencias
npm install

# 3. Levantar el dev server
npm start

# 4. Abrir en el browser
# http://localhost:4200

# 5. Login
# Usuario: admin
# Contraseña: Admin123!
```

El dev server hace **auto-reload** cuando cambiás archivos. Los errores se muestran en la consola del browser y en la terminal.

---

## 🏗️ Build de producción

```bash
npm run build
```

Output: `dist/bg-invoice-frontend/browser/`

Este directorio contiene el bundle final optimizado (tree-shaken, minified, con hashes para cache-busting).

Para servir localmente:
```bash
npx http-server dist/bg-invoice-frontend/browser -p 8080
```

---

## 🧪 Tests

```bash
# Correr todos los tests (en watch mode)
npm test

# Correr una vez (CI mode)
npm test -- --watch=false

# Correr con coverage
npm test -- --watch=false --code-coverage
```
<img width="1357" height="727" alt="imagen" src="https://github.com/user-attachments/assets/7192290e-88e4-4dfc-a180-4355f4a81a36" />

Cobertura actual: **91 tests pasando** al momento de la última actualización.

---

## 🚀 Deploy

El frontend está deployado en **Render Static Site**:

| Recurso | URL |
|---|---|
| **Frontend (este repo)** | `https://bg-invoice-frontend.onrender.com` |
| **Backend** | `https://pruebabgback.onrender.com` |

### Deploy automático

Cada push a `main` dispara un build y deploy automático en Render. No hay pipeline manual.

### Configuración en Render

| Campo | Valor |
|---|---|
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist/bg-invoice-frontend/browser` |
| Branch | `main` |

### Rewrite rule (importante para SPA)

Como Angular es una SPA, todas las rutas deben redirigir a `index.html`. En Render:

1. Static Site → **Redirects/Rewrites**
2. Source: `/*`
3. Destination: `/index.html`
4. Action: **Rewrite**

## 📚 Convenciones del proyecto

- **Conventional Commits**: feat, fix, chore, etc. con scope (ej: `feat(customers): add CRUD`)
- **Sin comentarios en código**: el código se explica solo
- **Conventional file naming**: `*.component.ts`, `*.service.ts`, `*.pipe.ts`, `*.spec.ts`
- **Standalone everything**: no hay `NgModule` salvo donde es estrictamente necesario
- **Signals para estado local**: RxJS solo para HTTP


