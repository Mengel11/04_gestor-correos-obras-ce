# Gestor de obras del Consejo Editorial

Aplicación web para gestionar obras, autores, revisores y miembros del Consejo Editorial (CE) de la UAM. Permite dar seguimiento al flujo editorial de cada obra: verificación de clasificación, asignación de revisores, revisiones y decisión final.

## Características

- **Gestión de obras** — listado, alta, edición y eliminación (solo administrador).
- **Catálogos** — autores, revisores y miembros del CE.
- **Detalle de obra** — flujo por etapas con plazos, asignación de revisores y decisión final.
- **Autenticación por roles** — administrador (escritura) y miembro del CE (solo lectura).
- **Interfaz responsive** — navegación con menú principal, mensajes de retroalimentación y diálogos de confirmación.

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| [React 19](https://react.dev/) | Interfaz de usuario |
| [Vite 8](https://vite.dev/) | Entorno de desarrollo y build |
| [React Router 7](https://reactrouter.com/) | Rutas y navegación |
| [Firebase Auth](https://firebase.google.com/docs/auth) | Autenticación |
| [Cloud Firestore](https://firebase.google.com/docs/firestore) | Base de datos (backend provisional) |
| CSS Modules | Estilos por componente |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- Proyecto en [Firebase Console](https://console.firebase.google.com/) con **Authentication** (Email/Password) y **Firestore** habilitados

## Inicio rápido

### 1. Clonar e instalar

```bash
git clone https://github.com/Mengel11/04_gestor-correos-obras-ce.git
cd 04_gestor-correos-obras-ce
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las credenciales de tu proyecto Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

> **Importante:** el archivo `.env` ya está incluido en `.gitignore`.

### 3. Configurar Firebase Auth

En Firebase Authentication (Email/Password) crea al menos estos usuarios:

| Correo | Contraseña |
|--------|------------|
| `admin@gestor-ce.local` | `admin123` |
| `miembro@gestor-ce.local` | `miembro123` |

Firebase solo requiere correo y contraseña. En la pantalla de login de la app se escribe un **usuario corto** (`admin` o `miembro`); internamente se convierte al correo correspondiente (ver sección [Usuarios de prueba](#usuarios-de-prueba)).

### 4. Reglas de Firestore

En [Firebase Console](https://console.firebase.google.com/), abre tu proyecto → **Build** → **Firestore Database** → pestaña **Reglas**. Sustituye el contenido del editor por el siguiente código y pulsa **Publicar**:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Estas reglas permiten lectura y escritura solo a usuarios autenticados. Son adecuadas para desarrollo; en producción conviene restringirlas según rol o colección.

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre la URL que muestre Vite (por defecto `http://localhost:5173`).

## Usuarios de prueba

Credenciales para iniciar sesión **en la aplicación** (campo «Usuario», no el correo completo):

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| `admin` | `admin123` | Administrador | CRUD completo, acceso a Miembros CE y detalle de obra |
| `miembro` | `miembro123` | Miembro CE | Solo lectura en Obras, Autores y Revisores |

Estos usuarios deben existir también en Firebase Auth con el correo `usuario@gestor-ce.local` (por ejemplo, `admin` → `admin@gestor-ce.local`).

## Rutas de la aplicación

| Ruta | Pantalla | Acceso |
|------|----------|--------|
| `/login` | Inicio de sesión | Público |
| `/` | Listado de obras | Autenticado |
| `/autores` | Catálogo de autores | Autenticado |
| `/revisores` | Catálogo de revisores | Autenticado |
| `/miembros-ce` | Miembros del Consejo Editorial | Solo administrador |
| `/obras/:obraId` | Detalle y flujo editorial de una obra | Solo administrador |

## Estructura del proyecto

```
04_gestor-correos-obras-ce/
├── public/                  # Archivos estáticos (favicon, iconos)
├── src/
│   ├── App.jsx              # Definición de rutas
│   ├── main.jsx             # Punto de entrada y providers globales
│   ├── firebaseConfig.js    # Conexión a Firebase (lee variables .env)
│   ├── index.css            # Estilos globales
│   ├── components/          # Componentes compartidos
│   │   ├── Layout.jsx       # Cabecera, navegación, pie de página
│   │   ├── RequireAuth.jsx  # Protección de rutas por autenticación/rol
│   │   └── Iconos.jsx       # Iconos SVG reutilizables
│   ├── context/             # Estado global (React Context)
│   │   ├── Auth.jsx         # Sesión, roles, login/logout
│   │   ├── Confirmar.jsx    # Diálogos de confirmación
│   │   └── Retroalimentacion.jsx  # Mensajes toast de éxito/error
│   ├── pages/               # Pantallas organizadas por módulo
│   │   ├── Login/
│   │   ├── Obras/
│   │   ├── Autores/
│   │   ├── Revisores/
│   │   ├── MiembrosCE/
│   │   └── DetallesObra/    # Flujo editorial por etapas
│   ├── services/            # Capa de acceso a datos (ver sección siguiente)
│   └── utils/               # Utilidades (fechas, validaciones, lógica de obras)
├── index.html
├── package.json
└── vite.config.js
```

Cada pantalla en `pages/` sigue una convención interna:

```
pages/NombreModulo/
├── NombreModulo.jsx         # Página principal
├── components/              # Componentes usados en ese módulo
└── styles/                  # CSS Modules del módulo
```

## Arquitectura y capa de servicios

Los componentes de la interfaz **no acceden a Firebase directamente** (excepto la configuración central en `firebaseConfig.js`). Toda la comunicación con datos pasa por `src/services/`:

| Archivo | Responsabilidad | Colección Firestore |
|---------|-----------------|---------------------|
| `authService.js` | Login, logout, sesión, roles | Firebase Auth |
| `obrasService.js` | CRUD de obras | `obras` |
| `autoresService.js` | CRUD de autores | `autores` |
| `revisoresService.js` | CRUD de revisores | `revisores` |
| `miembrosCEService.js` | CRUD de miembros del CE | `miembrosCE` |

Esta capa es el **punto de integración** con un backend propio: al reemplazar Firebase por una API REST, solo hay que modificar los archivos en `src/services/` manteniendo las mismas funciones exportadas y la misma forma de los objetos devueltos. Los componentes en `pages/` no deberían requerir cambios.

### Contextos globales

| Hook | Propósito |
|------|-----------|
| `useAuth()` | Usuario actual, `esAdmin`, `puedeEscribir`, `iniciarSesion`, `cerrarSesion` |
| `useRetroalimentacion()` | Mostrar mensajes de éxito o error |
| `useConfirmar()` | Pedir confirmación antes de acciones destructivas |

## Flujo editorial de una obra

Tras registrar una obra, el administrador avanza por seis etapas secuenciales en el detalle de la obra: verificación de clasificación, plazos y asignación de revisores, plazos y seguimiento de revisiones, y decisión final. El estado se persiste en Firestore.

Para el flujo completo paso a paso, roles, tabla de correos futuros y estado del proyecto, consulta [docs/GUIA-FUNCIONAL.md](docs/GUIA-FUNCIONAL.md).

## Documentación

| Documento | Audiencia | Contenido |
|-----------|-----------|-----------|
| [GUIA-FUNCIONAL.md](docs/GUIA-FUNCIONAL.md) | María del Carmen, equipo | Flujo de uso, roles, correos futuros, estado del proyecto |
| [REFERENCIA-COMPONENTES.md](docs/REFERENCIA-COMPONENTES.md) | Equipo técnico | Qué hace cada página y componente |
| [INTEGRACION-BACKEND.md](docs/INTEGRACION-BACKEND.md) | Mauricio | Modelos de datos, auth y endpoints sugeridos |

## Equipo

| Persona | Rol |
|---------|-----|
| Miguel Ángel Hernández Ortiz | Frontend |
| Mauricio | Backend |
| María del Carmen | Asesora |

Repositorio: [github.com/Mengel11/04_gestor-correos-obras-ce](https://github.com/Mengel11/04_gestor-correos-obras-ce)

## Licencia

Proyecto privado — uso académico (UAM).
