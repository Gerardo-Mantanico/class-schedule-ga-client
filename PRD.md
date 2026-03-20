# PRD — Cliente de planificación de horarios académicos (GA)

**Producto:** aplicación web (Next.js) para administrar cursos, espacios, docentes y generar/editar horarios académicos integrada con un backend que expone generación por algoritmos genéticos.  
**Repositorio:** `class-schedule-ga-client`  
**Versión del documento:** 1.0 · **Fecha:** marzo 2026  

---

## 1. Resumen ejecutivo

El sistema permite a instituciones educativas centralizar datos maestros (cursos, carreras, salones, docentes), cargar información en masa (CSV), configurar escenarios de horario y ejecutar la generación automática de horarios. Los resultados pueden revisarse, ajustarse manualmente y exportarse en reportes (PDF, imagen, Excel). La parte pública presenta la institución, convocatorias y congresos asociados.

Documentación de usuario externa: [Manual de usuario — Asignación de horarios CUNOC](https://scribehow.com/viewer/ASIGNACION_DE_HORARIOS_CUNOC__eoZd0tp9RDa6jjXwWROxIw).

---

## 2. Visión y objetivos

| Objetivo | Descripción |
|----------|-------------|
| **O1** | Reducir el tiempo de armado de horarios mediante configuración reutilizable y generación automática. |
| **O2** | Mantener un único lugar para datos académicos y restricciones (salones, jornadas, asignación curso–docente). |
| **O3** | Permitir corrección fina post-generación (tablero/calendario) sin perder trazabilidad respecto al escenario configurado. |
| **O4** | Facilitar comunicación institucional (home pública) y reporting para dirección académica. |

---

## 3. Usuarios y roles

- **Visitante:** navega la home pública (instituciones, áreas, convocatorias, congresos) sin autenticación.
- **Usuario autenticado:** accede según permisos del backend; el cliente protege rutas bajo `/admin` exigiendo token en cookie.
- **Administrador académico:** usa el panel para CRUD de maestros, configuración de horarios, generación y reportes.

*Nota:* la granularidad de roles (p. ej. solo lectura) depende del API; el cliente incluye componentes como `RequireRole` para alinear la UI con el backend.

---

## 4. Alcance funcional

### 4.1 Sitio público (`/home`)

- Presentación del producto (módulos, flujo de trabajo).
- Secciones de contenido: instituciones asociadas, áreas, convocatorias, congresos (datos vía API).
- Acceso a flujos de autenticación (inicio de sesión, registro).

### 4.2 Autenticación y cuenta

- Inicio de sesión (`/signin`) contra `NEXT_PUBLIC_API_URL` (`/auth/login`), persistencia de token y usuario.
- Registro (`/signup`) y verificación en dos pasos (`/twostepverification` / flujo asociado).
- Recuperación de contraseña (`/reset-password`).
- Perfil de usuario (tarjetas de información en componentes de perfil).
- Sesión demo opcional (token demo almacenado localmente, sin llamar al API para usuario actual).

### 4.3 Panel administrativo (`/admin/*`)

Rutas protegidas por middleware/proxy: sin `token` en cookies → redirección a `/signin` con `callbackUrl`.

| Módulo | Ruta | Propósito |
|--------|------|-----------|
| Dashboard | `/admin` | Punto de entrada con tarjetas de acceso a submódulos. |
| Cursos | `/admin/cursos` | Oferta académica, códigos, relación con carrera/semestre. |
| Carreras | `/admin/careers` | Catálogo de carreras. |
| Salones | `/admin/salones` | Capacidad, tipo, disponibilidad por jornada (mañana/tarde/ambas). |
| Docentes | `/admin/docentes` | Registro personal, horario base, preferencias. |
| Carga CSV | `/admin/carga-csv` | Importación masiva de datos para poblar o actualizar información. |
| Config. horarios | `/admin/configuracion-horarios` | Escenarios: periodos, slots, cursos en configuración, salones y docentes asignados al escenario, restricciones (fijos, laboratorio, etc.). |
| Horarios | `/admin/horarios` | Visualización/edición manual de horarios generados (p. ej. calendario, drag-and-drop según implementación). |
| Reportes | `/admin/reporte` | Reporte agregado con filtros (tipo mixto/curso/lab, año, semestre, carrera); exportación PDF, PNG y Excel. |

### 4.4 Generación de horarios (integración)

El cliente consume un servicio de generación (`schedule-generation.service`) que devuelve:

- Lista de horarios generados y metadatos (fitness, penalizaciones).
- Detalle con **slots** temporales e **ítems** (curso, sección, día, franja, salón, docente).
- **Advertencias** estructuradas (códigos, severidad, entidades relacionadas).

El modelo de datos en cliente incluye conceptos como: `typeOfSchedule` (MORNING | AFTERNOON | BOTH), tipos de salón (CLASS | LAB | BOTH), cursos fijos opcionales (`isFixed`, día/slot), y métricas de asignación (genes asignados vs requeridos, aulas/docentes sin asignar).

---

## 5. Requisitos funcionales (priorizados)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-01 | Un usuario sin sesión no puede acceder a `/admin` y es redirigido al login conservando la URL de retorno. | Must |
| RF-02 | Tras login válido, el usuario puede operar el panel según respuesta del API. | Must |
| RF-03 | CRUD o equivalente vía tablas genéricas para cursos, carreras, salones y docentes. | Must |
| RF-04 | Importación CSV con feedback de carga (errores/éxito según API). | Should |
| RF-05 | Crear/editar configuración de horario vinculando cursos, salones y docentes del escenario. | Must |
| RF-06 | Invocar generación de horario y mostrar resultado con advertencias y métricas de calidad. | Must |
| RF-07 | Editar asignaciones manualmente en la vista de horarios. | Should |
| RF-08 | Generar reportes filtrados y exportar a PDF, imagen y Excel. | Should |
| RF-09 | Home pública consume listados (instituciones, convocatorias, congresos) y maneja estados de carga y error. | Should |
| RF-10 | Tema claro/oscuro y layout responsive en áreas principales. | Could |

---

## 6. Requisitos no funcionales

| Área | Criterio |
|------|----------|
| **Rendimiento** | Paginación y tablas para listados grandes; evitar bloquear UI durante exportaciones pesadas (async + feedback). |
| **Seguridad** | Token solo en cookies/http según política del backend; no exponer secretos en el cliente; HTTPS en producción. |
| **Configuración** | URL del API vía `NEXT_PUBLIC_API_URL` (por defecto documentado en código como `http://localhost:3000`). |
| **Accesibilidad** | Controles con etiquetas, foco y patrones consistentes en formularios y navegación (objetivo de mejora continua). |
| **Mantenibilidad** | TypeScript, hooks reutilizables (`useCrud`, servicios por dominio), componentes de tabla/modal genéricos. |

---

## 7. Dependencias técnicas principales

- **Framework:** Next.js 16, React 19.
- **Estilos:** Tailwind CSS 4.
- **Calendario / horarios:** FullCalendar, react-dnd (edición manual).
- **Exportación:** jsPDF, html2canvas, xlsx, file-saver.
- **Gráficos:** ApexCharts (donde aplique en dashboards).
- **Backend:** API REST externa (autenticación, CRUD, generación GA); este repositorio es solo el cliente.

---

## 8. Fuera de alcance (este cliente)

- Implementación del algoritmo genético y persistencia en servidor (responsabilidad del backend).
- Notificaciones push o correo transaccional (salvo lo que exponga el API).
- Apps móviles nativas.

---

## 9. Métricas de éxito sugeridas

- Tiempo medio desde “configuración lista” hasta “primer horario generado aceptable”.
- Tasa de exportaciones de reporte sin error.
- Reducción de incidencias de solapamiento reportadas tras uso del módulo de horarios.
- Adopción: usuarios activos mensuales en `/admin`.

---

## 10. Glosario

| Término | Significado |
|---------|-------------|
| **Configuración de horario** | Escenario que agrupa cursos, salones y docentes con reglas para una corrida de generación. |
| **Slot** | Franja temporal discreta dentro del día (índice + hora inicio/fin). |
| **Fitness / penalización** | Indicadores del backend sobre calidad de la solución y restricciones violadas. |
| **GA** | Algoritmo genético (lado servidor) optimizando asignaciones. |

---

*Este PRD refleja el estado del código en el repositorio cliente; cualquier discrepancia con el despliegue real debe resolverse contra la documentación del API y los entornos (`NEXT_PUBLIC_*`).*
