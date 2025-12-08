# 📚 Manual de PsiFirm App - Dashboard Admin Gratuito

## Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Cómo Funciona](#cómo-funciona)
6. [Componentes Principales](#componentes-principales)
7. [Contextos (Context API)](#contextos-context-api)
8. [Hooks Personalizados](#hooks-personalizados)
9. [Sistema de Temas](#sistema-de-temas)
10. [Navegación y Rutas](#navegación-y-rutas)
11. [Mejores Prácticas](#mejores-prácticas)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

**PsiFirm App** es un dashboard administrativo moderno y profesional construido con **Next.js 16** y **React 19**. Es un template gratuito diseñado para proporcionar una interfaz administrativa completa con características como:

- 📊 Gráficos interactivos (ApexCharts)
- 📅 Calendario integrado (FullCalendar)
- 🗺️ Mapas de vectores
- 📋 Tablas avanzadas
- 🎨 Sistema de tema claro/oscuro
- 📱 Diseño totalmente responsivo
- ✅ Validación de formularios
- 🎪 Componentes UI reutilizables

### Versión Actual
- **Nombre del Proyecto**: free-nextjs-admin-dashboard
- **Versión**: 2.0.2
- **Estado**: Privado

---

## 🛠️ Tecnologías Utilizadas

### Framework Principal
- **Next.js 16.0.3** - Framework React fullstack con SSR/SSG
- **React 19.2.0** - Librería de UI
- **TypeScript 5.9.3** - Tipado estático para JavaScript

### Estilos y UI
- **Tailwind CSS 4.1.17** - Framework CSS utility-first
- **Tailwind Forms 0.5.10** - Componentes de formularios con Tailwind
- **PostCSS 8.5.6** - Procesador CSS

### Gráficos y Visualización
- **ApexCharts 4.7.0** - Librería de gráficos interactivos
- **React ApexCharts 1.8.0** - Wrapper de React para ApexCharts
- **JSVectorMap - Mapas** - Mapas de vectores interactivos

### Componentes Especializados
- **FullCalendar 6.1.19** - Calendario interactivo
  - `@fullcalendar/core`
  - `@fullcalendar/daygrid`
  - `@fullcalendar/timegrid`
  - `@fullcalendar/list`
  - `@fullcalendar/react`
  - `@fullcalendar/interaction`

### Utilidades
- **react-dnd 16.0.1** - Drag and drop
- **react-dropzone 14.3.8** - Zona de descarga de archivos
- **swiper 11.2.10** - Carrusel/slider
- **flatpickr 4.6.13** - Selector de fechas
- **Tailwind Merge 2.6.0** - Utilitario para combinar clases Tailwind

### Herramientas de Desarrollo
- **ESLint 9.39.1** - Linter de código
- **@svgr/webpack 8.1.0** - Importer SVG como componentes React

---

## 📁 Estructura del Proyecto

```
psifirm-app/
├── public/                    # Archivos estáticos
│   └── images/               # Imágenes del proyecto
│       ├── brand/
│       ├── cards/
│       ├── carousel/
│       ├── chat/
│       ├── country/
│       ├── error/
│       ├── grid-image/
│       ├── icons/
│       ├── logo/
│       ├── product/
│       ├── shape/
│       ├── task/
│       ├── user/
│       └── video-thumb/
│
├── src/
│   ├── app/                  # App Router (Next.js 13+)
│   │   ├── globals.css       # Estilos globales
│   │   ├── layout.tsx        # Layout raíz
│   │   ├── not-found.tsx     # Página 404
│   │   ├── (admin)/          # Grupo de rutas admin
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx      # Dashboard principal
│   │   │   └── (others-pages)/
│   │   │       ├── (chart)/          # Ejemplos de gráficos
│   │   │       ├── (forms)/          # Ejemplos de formularios
│   │   │       ├── (tables)/         # Ejemplos de tablas
│   │   │       ├── blank/            # Página en blanco
│   │   │       ├── calendar/         # Calendario
│   │   │       └── profile/          # Perfil de usuario
│   │   │
│   │   ├── (ui-elements)/    # Componentes UI
│   │   │   ├── alerts/
│   │   │   ├── avatars/
│   │   │   ├── badge/
│   │   │   ├── buttons/
│   │   │   ├── images/
│   │   │   ├── modals/
│   │   │   └── videos/
│   │   │
│   │   └── (full-width-pages)/ # Páginas a pantalla completa
│   │       ├── (auth)/         # Autenticación
│   │       │   ├── signin/
│   │       │   └── signup/
│   │       └── (error-pages)/
│   │           └── error-404/
│   │
│   ├── components/            # Componentes React reutilizables
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── calendar/          # Calendario
│   │   ├── charts/            # Gráficos
│   │   ├── common/            # Componentes compartidos
│   │   ├── ecommerce/         # Componentes de e-commerce
│   │   ├── example/           # Ejemplos de componentes
│   │   ├── form/              # Componentes de formularios
│   │   ├── header/            # Encabezado
│   │   ├── tables/            # Tablas
│   │   ├── ui/                # Componentes UI básicos
│   │   ├── user-profile/      # Perfil de usuario
│   │   └── videos/            # Componentes de video
│   │
│   ├── context/               # Context API
│   │   ├── SidebarContext.tsx # Estado de la barra lateral
│   │   └── ThemeContext.tsx   # Estado del tema (dark/light)
│   │
│   ├── hooks/                 # Hooks personalizados
│   │   ├── useGoBack.ts       # Navegar atrás
│   │   └── useModal.ts        # Gestión de modales
│   │
│   ├── icons/                 # Componentes de iconos
│   │   └── index.tsx
│   │
│   ├── layout/                # Componentes de layout
│   │   ├── AppHeader.tsx      # Encabezado de la app
│   │   ├── AppSidebar.tsx     # Barra lateral
│   │   ├── Backdrop.tsx       # Fondo modal
│   │   └── SidebarWidget.tsx  # Widget de la barra lateral
│   │
│   └── svg.d.ts               # Declaración de tipos para SVG
│
├── eslint.config.mjs          # Configuración ESLint
├── next.config.ts             # Configuración Next.js
├── next-env.d.ts              # Tipos Next.js
├── package.json               # Dependencias del proyecto
├── postcss.config.js          # Configuración PostCSS
├── prettier.config.js         # Configuración Prettier
├── tsconfig.json              # Configuración TypeScript
└── README.md                  # Documentación

```

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- **Node.js**: v16 o superior
- **npm** o **yarn**: Gestor de paquetes

### Pasos de Instalación

1. **Clonar el repositorio** (si no está ya descargado)
   ```bash
   git clone <repository-url>
   cd psifirm-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o si usas yarn
   yarn install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o si usas yarn
   yarn dev
   ```
   El proyecto estará disponible en `http://localhost:3000`

4. **Compilar para producción**
   ```bash
   npm run build
   npm run start
   ```

5. **Ejecutar linting**
   ```bash
   npm run lint
   ```

---

## 🔄 Cómo Funciona

### Arquitectura General

```
┌─────────────────────────────────────────────┐
│         BROWSER (Cliente)                   │
├─────────────────────────────────────────────┤
│  React Components (Interactividad)          │
│  - Componentes UI                           │
│  - Context API (Tema, Sidebar)             │
│  - Hooks Personalizados                    │
└──────────────┬──────────────────────────────┘
               │
               │ Next.js SSR/CSR
               │
┌──────────────▼──────────────────────────────┐
│         SERVIDOR (Node.js)                  │
├─────────────────────────────────────────────┤
│  - App Router (Rutas dinámicas)             │
│  - Layout System                           │
│  - Static/Dynamic Rendering                │
└─────────────────────────────────────────────┘
```

### Flujo de Carga de Página

1. **Usuario accede a una URL** (ej: `/admin/calendar`)
2. **Next.js resuelve la ruta** usando el App Router
3. **Se carga el layout raíz** (`src/app/layout.tsx`)
4. **Se cargan los providers** (ThemeProvider, SidebarProvider)
5. **Se renderiza el componente de página**
6. **React hidrata los componentes** en el cliente
7. **Se aplica la lógica interactiva** (Contextos, Hooks)

---

## 🧩 Componentes Principales

### 1. **ThemeProvider** (`src/context/ThemeContext.tsx`)
Gestiona el tema claro/oscuro de la aplicación.

**Características:**
- Almacena la preferencia en `localStorage`
- Aplica clase "dark" al elemento HTML
- Proporciona función `toggleTheme()`

**Uso:**
```tsx
import { useTheme } from '@/context/ThemeContext';

export function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Cambiar a {theme === 'light' ? 'oscuro' : 'claro'}
    </button>
  );
}
```

### 2. **SidebarProvider** (`src/context/SidebarContext.tsx`)
Gestiona el estado de la barra lateral (expandida/colapsada, mobile, etc).

**Características:**
- Detecta automáticamente tamaño de pantalla
- Maneja estado expandido/colapsado
- Maneja aperturas/cierres en móvil
- Gestiona submenús y items activos

**Uso:**
```tsx
import { useSidebar } from '@/context/SidebarContext';

export function MyComponent() {
  const { 
    isExpanded, 
    toggleSidebar, 
    isMobileOpen,
    toggleMobileSidebar 
  } = useSidebar();
  
  return (
    <button onClick={toggleSidebar}>
      {isExpanded ? 'Contraer' : 'Expandir'}
    </button>
  );
}
```

### 3. **AppSidebar** (`src/layout/AppSidebar.tsx`)
Barra lateral navegable con menú principal.

**Características:**
- Menú colapsable
- Submenús anidados
- Enlaces de navegación
- Indicador del item activo

### 4. **AppHeader** (`src/layout/AppHeader.tsx`)
Encabezado principal con:
- Logo
- Buscador
- Dropdown de notificaciones
- Dropdown de usuario
- Botón de toggle de tema

### 5. **Componentes de Gráficos** (`src/components/charts/`)
**LineChartOne** y **BarChartOne** - Gráficos interactivos con ApexCharts

```tsx
import LineChartOne from '@/components/charts/line/LineChartOne';

export default function Page() {
  return <LineChartOne />;
}
```

### 6. **Componentes de Formulario** (`src/components/form/`)
- `Form.tsx` - Wrapper de formulario
- `Input` - Campos de entrada
- `Select.tsx` - Selector dropdown
- `MultiSelect.tsx` - Múltiples opciones
- `date-picker.tsx` - Selector de fecha

---

## 🎨 Contextos (Context API)

### ThemeContext

```tsx
type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};
```

**Localización:** `src/context/ThemeContext.tsx`

**Funcionalidad:**
- Lee tema guardado en `localStorage`
- Mantiene sincronización entre pestañas
- Aplica clases CSS dinámicamente

### SidebarContext

```tsx
type SidebarContextType = {
  isExpanded: boolean;          // ¿Sidebar expandido?
  isMobileOpen: boolean;        // ¿Menú móvil abierto?
  isHovered: boolean;           // ¿Sidebar en hover?
  activeItem: string | null;    // Item activo
  openSubmenu: string | null;   // Submenú abierto
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (val: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
};
```

**Localización:** `src/context/SidebarContext.tsx`

**Funcionalidad:**
- Detecta cambios de tamaño de pantalla
- Cierra menú en dispositivos móviles automáticamente
- Gestiona animaciones y transiciones

---

## 🪝 Hooks Personalizados

### useModal (`src/hooks/useModal.ts`)
Gestiona el estado de modales/diálogos.

**Interfaz:**
```tsx
const { 
  isOpen, 
  openModal, 
  closeModal, 
  toggleModal 
} = useModal(initialState);
```

**Ejemplo:**
```tsx
export default function MyComponent() {
  const { isOpen, openModal, closeModal } = useModal(false);
  
  return (
    <>
      <button onClick={openModal}>Abrir Modal</button>
      {isOpen && (
        <Modal onClose={closeModal}>
          Contenido del modal
        </Modal>
      )}
    </>
  );
}
```

### useGoBack (`src/hooks/useGoBack.ts`)
Proporciona navegación hacia atrás.

```tsx
const goBack = useGoBack();

return <button onClick={goBack}>Volver</button>;
```

---

## 🌙 Sistema de Temas

### Cómo Funciona

1. **Detección de Preferencia:**
   - Se lee `localStorage` en el cliente
   - Si no existe, usa "light" por defecto

2. **Aplicación de Clase:**
   - Tema "light": no agrega clase
   - Tema "dark": agrega clase `dark` a `<html>`

3. **Estilos Tailwind:**
   - Usa modificador `dark:` para estilos oscuros
   - Ejemplo: `dark:bg-gray-900` (fondo gris oscuro en modo dark)

### Ejemplo de Uso

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Contenido que cambia de tema
</div>
```

---

## 🗺️ Navegación y Rutas

### Estructura de Rutas (App Router)

```
/ (raíz)
├── /admin
│   ├── / (dashboard principal)
│   └── (others-pages)
│       ├── (chart)
│       ├── (forms)
│       ├── (tables)
│       ├── blank
│       ├── calendar
│       └── profile
├── (ui-elements)
│   ├── alerts
│   ├── avatars
│   ├── badge
│   ├── buttons
│   ├── images
│   ├── modals
│   └── videos
└── (full-width-pages)
    ├── (auth)
    │   ├── signin
    │   └── signup
    └── (error-pages)
        └── error-404
```

### Cómo Funciona el Enrutamiento

**Next.js 13+ App Router:**
- Cada carpeta = posible ruta
- `page.tsx` = componente de página
- `layout.tsx` = layout de esa rama
- `(parenthesis)` = rutas agrupadas (no afectan URL)

**Ejemplo de Navegación:**
```tsx
import Link from 'next/link';

export default function Home() {
  return (
    <Link href="/admin/calendar">
      Ir al calendario
    </Link>
  );
}
```

---

## 🛡️ Mejores Prácticas

### 1. **Componentes Client-Side vs Server-Side**

**Servidor (por defecto):**
```tsx
// src/app/page.tsx
export default function Page() {
  // Acceso a base de datos, variables secretas, etc.
  return <div>Contenido</div>;
}
```

**Cliente (con "use client"):**
```tsx
"use client";
import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clics: {count}
    </button>
  );
}
```

### 2. **Uso de Context API**

```tsx
// ✅ BIEN: Usar useContext en componentes cliente
"use client";
import { useTheme } from '@/context/ThemeContext';

export function ThemedComponent() {
  const { theme } = useTheme();
  return <div>Tema actual: {theme}</div>;
}
```

### 3. **Importaciones con @**

```tsx
// ✅ BIEN: Usar alias
import { Button } from '@/components/ui/button';

// ❌ EVITAR: Rutas relativas largas
import { Button } from '../../../components/ui/button';
```

### 4. **Componentes Responsivos**

```tsx
// ✅ BIEN: Usar Tailwind breakpoints
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  {/* Contenido */}
</div>
```

### 5. **Typing Correcto**

```tsx
// ✅ BIEN: Interfaces claras
interface CardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export function Card({ title, description, onClick }: CardProps) {
  return <div onClick={onClick}>{title}</div>;
}
```

---

## 🔧 Troubleshooting

### Problema: El tema no se guarda al recargar

**Solución:**
- Asegurate que `ThemeProvider` está en `layout.tsx`
- Verifica que localStorage está disponible en el cliente
- Abre DevTools → Application → LocalStorage

### Problema: Sidebar se comporta extraño en móvil

**Solución:**
- El contexto detecta el tamaño automáticamente
- Verifica `@media (max-width: 768px)` en CSS
- Limpia el cache del navegador

### Problema: Los gráficos no aparecen

**Solución:**
- Verifica que ApexCharts está instalado: `npm list apexcharts`
- Asegurate que el componente tiene datos
- Revisa la consola del navegador para errores

### Problema: Estilos Tailwind no aplican

**Solución:**
```bash
# Limpia el cache de Next.js
rm -rf .next

# Reinstala dependencias
npm install

# Ejecuta en desarrollo nuevamente
npm run dev
```

### Problema: Error de TypeScript en componentes

**Solución:**
```bash
# Verifica tipos
npx tsc --noEmit

# Actualiza types
npm install --save-dev @types/react @types/node
```

---

## 📊 Diagrama de Flujo de Datos

```
┌─────────────────────────────────────────────────────┐
│           LAYOUT RAÍZ (layout.tsx)                  │
│        ┌─────────────────────────────┐             │
│        │  ThemeProvider              │             │
│        │  └─ toggleTheme()           │             │
│        │  └─ theme (light/dark)      │             │
│        │     ┌──────────────────────┐│             │
│        │     │ SidebarProvider      ││             │
│        │     │ └─ isExpanded        ││             │
│        │     │ └─ activeItem        ││             │
│        │     │ └─ openSubmenu       ││             │
│        │     │   ┌────────────────┐ ││             │
│        │     │   │ AppSidebar     │ ││             │
│        │     │   │ AppHeader      │ ││             │
│        │     │   │ Main Content   │ ││             │
│        │     │   │                │ ││             │
│        │     │   │ Gráficos       │ ││             │
│        │     │   │ Tablas         │ ││             │
│        │     │   │ Formularios    │ ││             │
│        │     │   │ Calendario     │ ││             │
│        │     │   └────────────────┘ ││             │
│        │     └──────────────────────┘│             │
│        └─────────────────────────────┘             │
└─────────────────────────────────────────────────────┘
```

---

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [ApexCharts Docs](https://apexcharts.com/docs)
- [FullCalendar Docs](https://fullcalendar.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 🤝 Contribuir al Proyecto

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Realiza cambios y commitea: `git commit -m "Añadir nueva funcionalidad"`
3. Haz push: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

---

## 📄 Licencia

Ver archivo `LICENSE` en la raíz del proyecto.

---

**Última actualización:** 5 de diciembre de 2025

**Versión del Manual:** 1.0

---

## Resumen Rápido

| Aspecto | Detalle |
|---------|---------|
| **Framework** | Next.js 16 + React 19 |
| **Estilos** | Tailwind CSS 4 |
| **Gráficos** | ApexCharts |
| **Lenguaje** | TypeScript |
| **Estado Management** | Context API |
| **Almacenamiento** | localStorage |
| **Diseño** | Responsive, Mobile-first |
| **Temas** | Light/Dark |
| **Componentes** | 50+ componentes reutilizables |

---

**¿Preguntas?** Revisa los archivos de configuración o la documentación oficial de cada librería.
