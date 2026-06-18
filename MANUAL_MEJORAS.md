# 📗 Manual de mejoras — Backend (F.E. Manager API)

Registro técnico de **todo lo modificado en el backend** respecto a la versión
original entregada por el profesor. El manual del **frontend** está en su propio
repositorio (`fe-manager-frontend`).

> **Filosofía de trabajo:** tocar lo mínimo imprescindible y no romper nada. En el
> backend el único cambio de código ha sido **documentar la API con Swagger**. La
> revisión de seguridad/lógica se entrega **documentada pero SIN aplicar** (ver
> apartado de auditoría), porque tocar la lógica del servidor exige decisión y pruebas.

---

## 1. Documentación de la API con Swagger / OpenAPI 3.0

La API no tenía documentación navegable. Ahora hay una documentación interactiva y
completa.

### Qué se hizo

- **Montaje en `index.js`**: se integran `swagger-jsdoc` y `swagger-ui-express` (ya
  figuraban en `package.json`, pero nada los usaba). Se exponen dos rutas nuevas:
  - `GET /api-docs` → interfaz visual (Swagger UI).
  - `GET /api-docs.json` → especificación OpenAPI en crudo (para Postman, Insomnia…).
- **`swagger/swagger.js` reescrito por completo** con la definición OpenAPI 3.0:
  - **13 schemas** reutilizables: `Company`, `Student`, `Teacher`, `FCT`, `Document`,
    `JobOffer`, `Review`, `Skill`, `Category`, `Action`, `Error`, `Perfil`,
    `LoginRequest`.
  - **2 esquemas de seguridad**: `cookieAuth` (cookie `jwt` httpOnly) y `bearerAuth`
    (token `Authorization: Bearer`).
  - **Respuestas reutilizables**: `401 Unauthorized`, `403 Forbidden`, `404 NotFound`.
  - **Parámetro reutilizable** `IdParam` (el `:id` de las rutas).
  - **16 tags** para agrupar los endpoints por módulo.
  - La URL del servidor se calcula desde el entorno (`USE_HTTPS`, `PUERTO`,
    `API_VERSION`), así el botón **"Try it out"** apunta a `https://localhost:3016/api/v2`.
- **Anotaciones `@swagger`** añadidas en los **16 archivos de rutas**, documentando en
  total **60 rutas (83 operaciones HTTP)** con sus parámetros, cuerpos, respuestas y
  permisos.

### Cobertura por módulo

| Módulo (tag) | Contenido |
|---|---|
| Auth | login, register-from-sao, complete-first-login, change-password, recuperación, logout, me, verify-email |
| Companies | listado, edición, actualización masiva de aptitudes y familias |
| Students | listado, edición, actualización masiva |
| Teachers / Administrators | listado y edición |
| FCT | gestión de convenios |
| Documents | subida, descarga, edición y borrado |
| Job Offers | CRUD completo |
| Reviews | CRUD + verificación + borrado masivo |
| Skills | CRUD + búsqueda + verificación masiva |
| Categories / Enums / Stats | consultas de apoyo |
| Actions | acciones de seguimiento con adjuntos |
| SAO | login y sincronización (empresas, profesorado, alumnado, FCTs) |
| Dummy | endpoints de prueba (solo desarrollo) |

### Verificación

- `GET /api-docs` carga la UI correctamente (comprobado en navegador).
- `GET /api-docs.json` devuelve un spec OpenAPI 3.0.0 válido: 60 rutas, 13 schemas,
  16 tags (todos declarados y usados, sin huérfanos).

---

## 2. Configuración del repositorio

- **`.gitignore` reforzado**: excluye `.env*`, `certs/`, `uploads/` y archivos del
  sistema, para que **nunca** se suban al repositorio credenciales (MongoDB, JWT, SMTP)
  ni certificados.
- **`README.md`** con instrucciones de instalación, uso de la API y resumen de la
  auditoría.

> La lógica de negocio del backend **no se ha modificado**: todo lo de este manual es
> documentación (Swagger) y configuración del repositorio.

---

## 3. Auditoría de bugs de lógica y seguridad (detectados — NO arreglados)

> Estos fallos se detectaron en una revisión a fondo del backend. **NO están
> corregidos**: se documentan como inventario pendiente para abordarlos de forma
> controlada (tocar la lógica requiere pruebas). Orden: de más grave a menos.

### 🔴 Críticos — abren la puerta a todo lo demás

1. **Login ficticio público que emite un token de administrador.**
   `routes/dummy.routes.js` expone `POST /api/v2/dummy/login` **sin autenticación**, y
   `controllers/dummy.controller.js` (`loginDummy`) genera un JWT real cogiendo el
   `profile` del cuerpo de la petición. *Consecuencia:* cualquiera, sin estar logueado,
   manda `{"profile":"ADMINISTRADOR"}`, recibe una cookie `jwt` válida y entra como
   administrador. Es un bypass total; este endpoint no debería existir en producción.

2. **El token de SAO se firma con datos que elige el cliente.**
   `controllers/sao.controller.js`: el `SAOtoken` se crea con el `profile` del cuerpo de
   la petición y con el **mismo secreto** que el token normal. *Consecuencia:* un usuario
   que pase el login SAO puede mandar `{"profile":"ADMINISTRADOR"}` y escalar a
   administrador. El token debería construirse desde el usuario autenticado, nunca del body.

3. **Endpoints de sincronización con SAO sin protección.**
   `routes/sao.routes.js`: las rutas `/companies`, `/teachers`, `/students`, `/fcts` y sus
   `_sinc` tienen el middleware de autenticación **comentado** ("TEMPORAL").
   *Consecuencia:* cualquiera puede disparar sincronizaciones masivas sin estar logueado.

### 🟠 Altos — seguridad

4. **CRUD de aptitudes y stats sin proteger.** `routes/skill.routes.js`: `GET /search`,
   `POST /`, `PATCH /:id` y `DELETE /:id` no llevan `protect`; un anónimo puede crear,
   editar o **borrar** aptitudes. Lo mismo en `routes/stats.routes.js`.

5. **Path traversal en documentos.** `controllers/document.controller.js`: la URL del
   documento se guarda sin filtrar y la descarga hace `path.join(__dirname,'..', ...)`
   sin sanear `../`. *Consecuencia:* leer ficheros del servidor (`../../../etc/passwd`).

6. **Errores de producción mostrados al cliente.** `middlewares/errorHandler.mw.js`: la
   condición `if (NODE_ENV !== 'development') sendErrorDev()` está **invertida**; en
   producción se filtran trazas internas y en desarrollo se ocultan.

7. **Mass assignment al registrar desde SAO.** `services/auth.service.js`: se vuelca el
   cuerpo entero al crear el usuario, permitiendo inyectar campos no previstos
   (p. ej. `SAO_profile:"ADMINISTRADOR"`).

8. **Inyección de regex / ReDoS en el buscador de aptitudes.** `services/skill.service.js`:
   `{ $regex: termino, $options:"i" }` con texto del cliente sin escapar, en ruta pública
   y sin límite de peticiones. Una búsqueda como `(a+)+$` bloquea el servidor.

### 🟡 Medios

9. **Clave de cifrado escrita en el código.** `utils/crypto.js`: el secreto está fijo en
   el repositorio; debería venir de una variable de entorno.

10. **Enumeración de emails.** `services/auth.service.js` (recuperación de contraseña):
    responde distinto si el email existe (200) o no (404). Debería responder siempre igual.

11. **La sincronización de F.E. no actualiza campos puestos a vacío.**
    `models/fctManager.model.js`: el filtro descarta valores "falsy" (`''`, `0`), dejando
    datos desincronizados. El mismo bug ya está corregido en `models/userManager.model.js`.

12. **Deduplicación calculada pero no usada en la inserción masiva.**
    `models/userManager.model.js`: se construye `cleanInsertList` deduplicado pero
    `insertMany` usa la lista cruda; un `SAO_id` repetido puede perder un registro.

13. **Actualización masiva de aptitudes de alumnos sin filtrar por perfil.**
    `services/student.service.js`: `updateMany({ _id: { $in: ids } }, ...)` sin filtrar por
    `SAO_profile:"ALUMNO"` (la versión de empresas sí lo hace).

14. **Paginación de SAO rota con listados de una sola página.** `services/sao.service.js`:
    `Math.max(...[])` devuelve `-Infinity` y se sincronizan 0 registros aunque existan.

15. **El control de acceso a documentos no distingue la acción.**
    `middlewares/authorizeDocument.mw.js`: el parámetro `action` ("read"/"update"…) se
    recibe pero no se usa; un perfil con permiso de lectura puede también editar.

16. **Posible doble respuesta al crear el token.** `middlewares/jwt.mw.js`: en el `catch`,
    tras `next(new AppError(...))` falta el `return` (riesgo de `ERR_HTTP_HEADERS_SENT`).

### 🔵 Bajos / endurecimiento

- `controllers/auth.controller.js` — el `logout` borra la cookie con atributos
  (`secure:true, sameSite:"none"`) que en HTTP local no coinciden con la original, por lo
  que la sesión puede no cerrarse.
- `services/company.service.js` — `getById` no valida que el `id` sea un ObjectId válido
  (un id mal formado da 500 en vez de 400/404).
- `index.js` — no hay `helmet` ni límite de peticiones (rate-limit), ni siquiera en login
  o recuperación de contraseña (atacables por fuerza bruta).

---

## 4. Notas de despliegue y entorno

- **Producción (dominios distintos)**: la cookie `jwt` ya está preparada para cross-site
  (`secure: true, sameSite: "none"`). No hay que cambiar nada en ese aspecto.
- **Certificado local**: el de `certs/` es autofirmado; el navegador puede bloquear las
  llamadas a `https://localhost:3016`. Workaround: visitar una vez
  `https://localhost:3016/api/v2/dummy` y aceptar el aviso. Solución recomendada:
  regenerar con `mkcert localhost 127.0.0.1` y sustituir los dos ficheros de `certs/`.
- **CORS**: durante el desarrollo se añadió temporalmente `https://localhost:5174` a la
  lista blanca (para comparar con el front original). Conviene quitarlo cuando ya no se
  use (está en `.env`, que no se versiona).

---

Proyecto académico — IES Hermanos Amorós · 2DAW · Curso 2025-2026.
