# F.E. Manager — Backend API

API REST del proyecto **F.E. Manager**, desarrollada en **Node.js + Express + Mongoose** para gestionar las prácticas en empresa (FCT) del IES Hermanos Amorós.

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| Base de datos | MongoDB Atlas (Mongoose 8) |
| Autenticación | JWT (httpOnly cookie) |
| Carga de ficheros | Multer + antivirus ClamAV (configurable) |
| Documentación | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| Logs | Morgan |
| Entorno | nodemon (desarrollo), HTTPS con certificados locales |

---

## Puesta en marcha

### 1. Requisitos previos

- Node.js ≥ 20
- MongoDB Atlas (o instancia local)
- Certificados SSL en `certs/` (ver `.env.example`)

### 2. Variables de entorno

Copia `.env.example` y rellena los valores:

```bash
cp .env.example .env.development
```

Variables necesarias:

```
PUERTO=3016
API_VERSION=v2
FRONTEND_URL=://localhost:5173
MONGODB_URI=<tu_cadena_de_conexion_atlas>
JWT_SECRET=<secreto_aleatorio_largo>
USE_HTTPS=1
HTTPS_KEY_SSL=certs/tu-certificado.key
HTTPS_CRT_SSL=certs/tu-certificado.crt
CORS_WHITE_LIST=["https://localhost:5173"]
NODEMAILER_ACTIVE=0
VIRUSCAN_CLAMSCAN_ACTIVE=0
```

### 3. Instalar dependencias y arrancar

```bash
npm install
npm run dev        # Arranca con nodemon en modo desarrollo
# o
npm start          # Producción
```

La API quedará disponible en: `https://localhost:3016/api/v2/`

---

## Documentación Swagger

Una vez arrancada la API, accede a:

```
https://localhost:3016/api-docs
```

La documentación cubre **60 rutas (83 operaciones HTTP)** organizadas en **16 módulos**:

| Módulo | Descripción |
|--------|------------|
| Auth | Login, registro, cambio de contraseña, recuperación |
| Companies | Listado y edición de empresas, actualización masiva de aptitudes/familias |
| Students | Listado y edición de alumnado, actualización masiva |
| Teachers | Listado y edición de profesorado |
| Admins | Gestión de administradores |
| FCTs | Gestión de convenios FCT |
| Documents | Subida, descarga y gestión de documentos adjuntos |
| JobOffers | Ofertas de empleo |
| Reviews | Valoraciones de empresas |
| Skills | Aptitudes/habilidades |
| Categories | Categorías/familias profesionales |
| Actions | Acciones de seguimiento |
| Stats | Estadísticas del dashboard |
| Enums | Enumeraciones del sistema |
| SAO | Sincronización con SAO FCT (sistema autonómico) |
| Dummy | Endpoints de prueba (solo desarrollo) |

---

## Estructura del proyecto

```
back-fctm-develop/
├── controllers/       # Lógica de cada módulo
├── middlewares/       # JWT, perfiles, upload, antivirus
├── models/            # Esquemas Mongoose
├── routes/            # Rutas Express + anotaciones Swagger
├── services/          # Servicios externos (SAO, email, etc.)
├── swagger/
│   └── swagger.js     # Configuración OpenAPI 3.0
├── utils/             # Utilidades compartidas
├── uploads/           # Ficheros subidos (excluido de git)
├── certs/             # Certificados SSL (excluido de git)
├── index.js           # Punto de entrada, montaje de rutas
└── serverLauncher.js  # Lanzador HTTPS/HTTP
```

---

## 📋 Registro de cambios respecto a la versión original

> Esta sección documenta **todo lo que se ha añadido o modificado** sobre la base
> que entregó el profesor. El cambio principal a nivel de código fue **documentar
> toda la API con Swagger**. Adicionalmente se realizó una **auditoría de seguridad
> y lógica** cuyos hallazgos se dejan **documentados pero NO corregidos** (ver más
> abajo), ya que tocar la lógica del backend requiere decisión y pruebas.

### 1. 📖 Documentación Swagger / OpenAPI 3.0 (NUEVO)

La API no tenía documentación navegable. Ahora cuenta con una documentación completa
e interactiva en `/api-docs`.

- **Montaje en `index.js`**: integración de `swagger-jsdoc` y `swagger-ui-express`
  (ambas ya estaban en `package.json` pero no se usaban). Se exponen:
  - `/api-docs` → interfaz visual de Swagger UI.
  - `/api-docs.json` → especificación OpenAPI en crudo (para importar en Postman, etc.).
- **Especificación central** en `swagger/swagger.js` (reescrito por completo):
  - Título, descripción y servidores leídos desde variables de entorno.
  - **13 schemas reutilizables**: Company, Student, Teacher, FCT, Document, JobOffer,
    Review, Skill, Category, Action, Error, Perfil, LoginRequest.
  - **Esquemas de seguridad**: `cookieAuth` (cookie `jwt`) y `bearerAuth` (token).
  - **Respuestas reutilizables**: 401 Unauthorized, 403 Forbidden, 404 NotFound.
  - **Parámetro reutilizable**: `IdParam` (el `:id` de las rutas).
  - **16 etiquetas (tags)** para agrupar los endpoints por módulo.
- **Anotaciones `@swagger`** añadidas en los **16 archivos de rutas**, cubriendo en
  total **60 rutas (83 operaciones HTTP)** documentadas con sus parámetros, cuerpos
  de petición, respuestas y permisos requeridos.

| Módulo | Endpoints documentados (resumen) |
|--------|----------------------------------|
| Auth | login, register-from-sao, complete-first-login, change-password, recuperación, logout, me, verify-email |
| Companies | listado, edición, actualización masiva de aptitudes y familias |
| Students | listado, edición, actualización masiva |
| Teachers / Admins | listado y edición |
| FCTs | listado y edición de convenios |
| Documents | subida, descarga, edición y borrado |
| JobOffers | CRUD completo de ofertas |
| Reviews | CRUD + verificación + borrado masivo |
| Skills | CRUD + búsqueda + verificación masiva |
| Categories / Enums / Stats | consultas de apoyo |
| Actions | acciones de seguimiento con adjuntos |
| SAO | login y sincronización (empresas, profesorado, alumnado, FCTs) |
| Dummy | endpoints de prueba (solo desarrollo) |

### 2. 🔒 Auditoría de seguridad y lógica (documentada, NO corregida)

Se revisó el backend a fondo y se detectaron 16 fallos de lógica/seguridad. **No se
han corregido** a propósito (decisión acordada): se listan aquí y en
`MANUAL_MEJORAS.md` como inventario pendiente, ordenados de más grave a menos. Ver el
detalle completo en la sección [Seguridad — Auditoría](#seguridad--auditoría).

### 3. 🧹 Configuración del repositorio

- **`.gitignore` reforzado**: ahora excluye `.env*`, `certs/`, `uploads/` y archivos
  del sistema, para que **nunca se suban credenciales** (MongoDB, JWT, SMTP) ni
  certificados al repositorio.
- **`README.md`** con instalación, documentación de la API y esta auditoría.

> ⚠️ La lógica de negocio del backend **no se ha modificado**. Todo el trabajo de
> este apartado es documentación (Swagger) y configuración del repo.

---

## Seguridad — Auditoría

> ⚠️ Los siguientes puntos están **documentados pero NO corregidos** en esta versión.
> Se recomienda abordarlos antes de un despliegue en producción. Orden: de más grave
> a menos. (Detección: revisión a fondo del backend.)

### 🔴 Críticos

1. **Login ficticio público que emite token de administrador** — `POST /api/v2/dummy/login`
   (`routes/dummy.routes.js`) está sin autenticación y genera un JWT real tomando el
   `profile` del cuerpo de la petición. Cualquiera puede mandar `{"profile":"ADMINISTRADOR"}`
   y entrar como administrador. No debería existir en producción.

2. **El token SAO se firma con datos que elige el cliente** — `controllers/sao.controller.js`:
   el `SAOtoken` se crea con el `profile` del body y el mismo secreto que el token normal.
   Permite escalar a administrador. Debería construirse desde el usuario autenticado.

3. **Endpoints de sincronización SAO sin protección** — `routes/sao.routes.js`: las rutas
   `/companies`, `/teachers`, `/students`, `/fcts` y sus `_sinc` tienen el middleware de
   autenticación comentado (`//TEMPORAL`). Cualquiera puede disparar sincronizaciones masivas.

### 🟠 Altos

4. **CRUD de aptitudes y stats sin proteger** — `routes/skill.routes.js` y
   `routes/stats.routes.js`: varias rutas (incluido `DELETE`) no llevan `protect`.

5. **Path traversal en documentos** — `controllers/document.controller.js`: la URL del
   documento se guarda sin filtrar y la descarga no sanea `../`. Permite leer ficheros
   del servidor (p. ej. `../../../etc/passwd`).

6. **Errores de producción mostrados al cliente** — `middlewares/errorHandler.mw.js`: la
   condición `if (NODE_ENV !== 'development') sendErrorDev()` está **invertida**; en
   producción se filtran trazas internas.

7. **Mass assignment al registrar desde SAO** — `services/auth.service.js`: se vuelca el
   cuerpo entero al crear el usuario, permitiendo inyectar campos no previstos.

8. **Inyección de regex / ReDoS en el buscador de aptitudes** — `services/skill.service.js`:
   `$regex` con texto del cliente sin escapar, en ruta pública. Una búsqueda maliciosa
   puede bloquear el servidor.

### 🟡 Medios

9. **Clave de cifrado escrita en el código** — `utils/crypto.js`: el secreto está fijo en
   el repositorio; debería venir de una variable de entorno.

10. **Enumeración de emails** — `services/auth.service.js`: la recuperación de contraseña
    responde distinto si el email existe (200) o no (404). Debería responder siempre igual.

11. **La sincronización de F.E. no actualiza campos puestos a vacío** —
    `models/fctManager.model.js`: el filtro descarta valores "falsy" (`''`, `0`), dejando
    datos desincronizados. El mismo bug ya está corregido en `userManager.model.js`.

12. **Deduplicación calculada pero no usada en la inserción masiva** —
    `models/userManager.model.js`: se construye `cleanInsertList` deduplicado pero
    `insertMany` usa la lista cruda; un `SAO_id` repetido puede perder un registro.

13. **Actualización masiva de aptitudes de alumnos sin filtrar por perfil** —
    `services/student.service.js`: `updateMany` sin filtrar por `SAO_profile:"ALUMNO"`
    (la versión de empresas sí lo hace).

14. **Paginación de SAO rota con listados de una sola página** — `services/sao.service.js`:
    `Math.max(...[])` devuelve `-Infinity` y se sincronizan 0 registros.

15. **El control de acceso a documentos no distingue la acción** —
    `middlewares/authorizeDocument.mw.js`: el parámetro `action` se recibe pero no se usa;
    un perfil con permiso de lectura puede también editar.

16. **Posible doble respuesta al crear el token** — `middlewares/jwt.mw.js`: en el `catch`,
    tras `next(new AppError(...))` falta el `return` (riesgo de `ERR_HTTP_HEADERS_SENT`).

### 🔵 Bajos / endurecimiento

- `controllers/auth.controller.js` — el `logout` borra la cookie con atributos que en HTTP
  local no coinciden con la original (la sesión puede no cerrarse).
- `services/company.service.js` — `getById` no valida que el `id` sea un ObjectId válido
  (un id mal formado da 500 en vez de 400/404).
- `index.js` — no hay `helmet` ni límite de peticiones (rate-limit), ni siquiera en login.

> El detalle ampliado de cada punto (con números de línea) está en
> [`MANUAL_MEJORAS.md`](./MANUAL_MEJORAS.md), incluido en este repositorio.

---

## Endpoints principales

```
POST   /api/v2/auth/login
GET    /api/v2/companies
GET    /api/v2/students
GET    /api/v2/teachers
GET    /api/v2/fcts
GET    /api/v2/documents
GET    /api/v2/joboffers
GET    /api/v2/reviews
GET    /api/v2/skills
GET    /api/v2/stats
GET    /api/v2/enums
POST   /api/v2/sao/login
```

---

## Credenciales de ejemplo

No se incluyen en el repositorio. Consulta con el administrador del sistema o usa el endpoint `/dummy/login` en desarrollo para obtener un JWT de prueba.

---

## Licencia

Proyecto académico — IES Hermanos Amorós · 2DAW · Curso 2025-2026.
