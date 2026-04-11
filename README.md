# 🧭 BitSealer v1 — Documentación

## 📋 Descripción general

**BitSealer** es una plataforma web de sellado de tiempo sobre Bitcoin que permite a un usuario:

- registrarse e iniciar sesión de forma segura,
- subir un archivo sin almacenar su contenido como dato de negocio,
- calcular su huella criptográfica **SHA-256**,
- generar una prueba **OpenTimestamps (.ots)**,
- seguir el estado del sellado hasta su anclaje en Bitcoin,
- descargar tanto la prueba `.ots` como un **certificado PDF**.

La solución está planteada como una arquitectura modular compuesta por:

- un **frontend** en React para la experiencia de usuario,
- un **backend** en Spring Boot que gestiona autenticación, persistencia y orquestación,
- un **microservicio stamper** en FastAPI encargado de interactuar con OpenTimestamps,
- una **base de datos PostgreSQL** para usuarios, hashes y estados de sellado.

El resultado es una primera versión funcional enfocada en un flujo claro: **archivo → hash → proof .ots → seguimiento del sello → descarga de evidencias**.

---

## 🏗️ Arquitectura del proyecto

### Arquitectura general

```text
                ┌─────────────┐
                │  Frontend   │
                │    React    │
                └──────┬──────┘
                       │ HTTP
                       ▼
                ┌─────────────┐
                │   Backend   │
                │ Spring Boot │
                └──────┬──────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
 ┌─────────────┐              ┌─────────────┐
 │ PostgreSQL  │              │   Stamper   │
 │  Database   │              │   FastAPI   │
 └─────────────┘              └─────────────┘
                                      │
                                      ▼
                                 Bitcoin
                               (Timestamp)
```

### Patrón de diseño aplicado

[**Frontend**](https://github.com/BitSealer/bitsealer-frontend)
- Arquitectura basada en componentes con React.
- Rutas públicas y privadas.
- Gestión de autenticación mediante Context API + interceptores Axios.

[**Backend**](https://github.com/BitSealer/bitsealer-backend)
- API REST con Spring Boot.
- Separación por capas: `controller`, `service`, `repository`, `model`, `dto`, `security`.
- Seguridad stateless con JWT.
- Persistencia con Spring Data JPA + Flyway.

[**Stamper**](https://github.com/BitSealer/bitsealer-stamper)
- API ligera en FastAPI.
- Encapsula el uso del cliente CLI de OpenTimestamps.
- Expone operaciones de `stamp`, `upgrade`, `verify` y `health`.

**Base de datos**
- PostgreSQL como sistema relacional principal.
- Migraciones versionadas con Flyway.

---

## 🛠️ Tecnologías utilizadas

### Núcleo de la solución

- **Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS 4, Chart.js
- **Backend:** Java 17, Spring Boot 3.5, Spring Security, Spring Data JPA, Flyway
- **Base de datos:** PostgreSQL 14
- **Microservicio de sellado:** FastAPI, Uvicorn, OpenTimestamps Client
- **Contenedorización:** Docker, Docker Compose

### Seguridad

- **JWT** con **JJWT 0.12.5**
- **BCrypt** para hash de contraseñas
- **CORS** configurable por variables de entorno
- Control de acceso a recursos por usuario autenticado

### Testing y calidad

- **JUnit 5**
- **Mockito**
- **Spring Boot Test**
- **Testcontainers** para integración con PostgreSQL
- **ESLint** en frontend

### Librerías destacables

- `commons-codec` para SHA-256 en backend
- `pdfbox` para generación de certificados PDF
- `react-chartjs-2` y `chart.js` para visualización de datos

---

### Estructura de cada módulo

```text
bitsealer-backend/
├── src/main/java/com/bitsealer/
│   ├── config/               # Configuración general de la aplicación (beans, CORS, etc.)
│   ├── controller/           # Controladores REST: exponen los endpoints HTTP
│   ├── dto/                  # Objetos de transferencia de datos para requests y responses
│   ├── exception/            # Manejo centralizado de excepciones y errores personalizados
│   ├── mapper/               # Conversión entre entidades del dominio y DTOs
│   ├── model/                # Entidades JPA y modelos principales de la aplicación
│   ├── repository/           # Acceso a datos con Spring Data JPA
│   ├── security/jwt/         # Utilidades y filtros de seguridad basados en JWT
│   └── service/              # Lógica de negocio y orquestación de operaciones
├── src/main/resources/
│   ├── application.properties # Configuración principal de Spring Boot
│   └── db/migration/          # Migraciones Flyway para versionado de base de datos
├── src/test/java/com/bitsealer/ # Tests unitarios e integración del backend
├── Dockerfile                 # Imagen Docker del backend
├── pom.xml                    # Dependencias y configuración Maven
└── .env.example               # Variables de entorno de ejemplo
```

```text
bitsealer-frontend/
├── src/
│   ├── api/                  # Configuración de llamadas HTTP y servicios hacia el backend
│   ├── assets/               # Recursos estáticos como imágenes, iconos y estilos
│   ├── components/
│   │   ├── cards/            # Componentes visuales tipo tarjeta para métricas y resúmenes
│   │   ├── charts/           # Componentes de gráficas y visualización de datos
│   │   ├── forms/            # Formularios reutilizables de login, registro y subida de archivos
│   │   └── public/           # Componentes públicos accesibles sin autenticación
│   ├── context/              # Contextos globales de React para estado compartido
│   ├── hooks/                # Hooks personalizados para reutilizar lógica del frontend
│   ├── layout/               # Estructura común de la interfaz (navbar, sidebar, contenedores)
│   ├── pages/                # Páginas principales de la aplicación
│   ├── routes/               # Definición de rutas protegidas y públicas
│   └── routing/              # Lógica auxiliar de navegación y control de acceso
├── Dockerfile                # Imagen Docker del frontend
├── package.json              # Dependencias y scripts de Node.js
├── vite.config.js            # Configuración del entorno Vite
└── .env.example              # Variables de entorno de ejemplo
```

```text
bitsealer-stamper/
├── app/
│   ├── api/                  # Endpoints HTTP del microservicio de sellado
│   ├── core/                 # Configuración central y arranque interno del servicio
│   ├── schemas/              # Esquemas de validación de entrada y salida
│   ├── services/             # Lógica de sellado y comunicación con OpenTimestamps
│   └── utils/                # Utilidades auxiliares del microservicio
├── Dockerfile                # Imagen Docker del stamper
└── requirements.txt          # Dependencias Python del microservicio
```

---

## 🐳 Ejecución del sistema con Docker

Este repositorio funciona como **repositorio HUB** para ejecutar todo el sistema BitSealer utilizando Docker.

Para ejecutar la plataforma completa es necesario **clonar los tres módulos** y colocar el archivo `docker-compose.yml` y `.env` en la carpeta raíz. (Los encuentras en este repositorio).

### 📂 Estructura esperada

```text
bitsealer/
│
├── docker-compose.yml
├── .env
│
├── bitsealer-backend
├── bitsealer-frontend
└── bitsealer-stamper
```

### 📥 1. Clonar los repositorios

```bash
git clone https://github.com/BitSealer/bitsealer-backend
git clone https://github.com/BitSealer/bitsealer-frontend
git clone https://github.com/BitSealer/bitsealer-stamper
```

### ⚙️ 2. Crear archivo de configuración

Copiar `.env.example` como `.env` y configurar las variables necesarias:

```bash
cp .env.example .env
```

Este archivo centraliza la configuración para:

- PostgreSQL
- Backend Spring Boot
- Microservicio stamper
- Seguridad JWT
- Comunicación entre servicios

### 🐳 3. Construir y levantar el sistema

Desde la carpeta raíz:

```bash
docker compose build
docker compose up -d
```

### 🌐 Acceso a la aplicación

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8080`
- **Stamper API:** `http://localhost:8000`

### Servicios levantados

- PostgreSQL
- Backend API (Spring Boot)
- Microservicio Stamper (FastAPI)
- Frontend (React)

---

# [🔧 Backend — Spring Boot API](https://github.com/BitSealer/bitsealer-backend)

## 📌 Rol del backend dentro del sistema

El backend es el núcleo transaccional de BitSealer. Se encarga de:

- registrar y autenticar usuarios,
- proteger los endpoints mediante JWT,
- calcular y persistir hashes de archivos,
- crear y mantener el estado de los sellos,
- invocar al microservicio stamper para generar y actualizar pruebas OTS,
- exponer historial, detalle y descargas,
- generar certificados PDF descargables.

## 🧱 Stack del backend

- **Java 17**
- **Spring Boot 3.5.0**
- **Spring Web**
- **Spring Security**
- **Spring Data JPA**
- **Flyway**
- **PostgreSQL driver 42.7.3**
- **JJWT 0.12.5**
- **Apache Commons Codec 1.17.0**
- **Apache PDFBox 2.0.32**
- **JUnit 5 + Spring Boot Test + Spring Security Test**
- **Testcontainers 2.0.3**

## 🧭 Organización interna

### Paquetes principales

- `com.bitsealer.config` → configuración de seguridad, encoder y cliente REST
- `com.bitsealer.controller` → endpoints HTTP
- `com.bitsealer.dto` → contratos de entrada y salida
- `com.bitsealer.model` → entidades JPA
- `com.bitsealer.repository` → acceso a datos
- `com.bitsealer.service` → lógica de negocio
- `com.bitsealer.security.jwt` → utilidades JWT y filtro de autenticación
- `com.bitsealer.mapper` → conversión entidad → DTO

## 🗄️ Modelo de datos

### Tabla `users`
Representa a los usuarios autenticados del sistema.

Campos principales:
- `id`
- `username`
- `email`
- `password`
- `role`

### Tabla `file_hashes`
Guarda la evidencia lógica del archivo sellado.

Campos principales:
- `id`
- `sha256`
- `file_name`
- `created_at`
- `user_id`

### Tabla `file_stamps`
Guarda el estado técnico del sellado asociado a un hash.

Campos principales:
- `id`
- `file_hash_id`
- `status`
- `created_at`
- `sealed_at`
- `ots_proof`
- `last_checked_at`
- `next_check_at`
- `attempts`
- `txid`
- `last_error`

### Estados de sellado

El enum `StampStatus` define los estados:

- `PENDING` → se ha creado la solicitud pero aún no está anclada
- `ANCHORING` → ya existe rastro de anclaje / txid, pero no está finalizado
- `SEALED` → sellado completado
- `ERROR` → fallo técnico que requiere revisión o reintento

## 🧩 Migraciones Flyway

BitSealer usa migraciones versionadas en `src/main/resources/db/migration/`.

- `V1__init.sql` → tablas `users` y `file_hashes`
- `V2__create_file_stamps.sql` → tabla `file_stamps`
- `V3__file_stamps_polling_fields.sql` → campos para polling, backoff, txid y errores

Esto permite reproducir el esquema de base de datos sin depender de “magia” local ni del clásico “a mí en mi portátil sí me va”.

## 🔐 Seguridad del backend

### Autenticación

La seguridad está basada en JWT:

- el login devuelve `accessToken` y `refreshToken`,
- el filtro `JwtAuthFilter` inspecciona el header `Authorization: Bearer ...`,
- el usuario autenticado se resuelve mediante `CustomUserDetailsService`.

### Contraseñas

Las contraseñas se almacenan cifradas con **BCrypt** mediante `PasswordEncoder`.

### CORS

Los orígenes permitidos se configuran con:

```properties
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173}
```

### Rutas públicas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/stamps/callback`

El callback del stamper no usa JWT, sino un token propio por cabecera (`X-Stamp-Token`).

## 🔄 Flujo principal del backend

### 1. Registro / login

El usuario se registra o inicia sesión en:

- `POST /api/auth/register`
- `POST /api/auth/login`

La respuesta incluye:
- `accessToken`
- `refreshToken`
- `user`

### 2. Subida de archivo

El frontend envía el archivo a:

- `POST /api/files/upload`

El backend:

1. obtiene el usuario autenticado,
2. calcula el `SHA-256` del archivo,
3. crea un registro en `file_hashes`,
4. crea un sello en `file_stamps` con estado inicial `PENDING`,
5. llama al microservicio stamper para obtener el `.ots`,
6. guarda la prueba y ajusta el estado según la respuesta.

### 3. Revisión del estado del sello

El backend ejecuta rechecks programados mediante `StampRecheckScheduler`.

Cada ciclo:

- busca sellos `PENDING` o `ANCHORING` cuyo `nextCheckAt` ya ha vencido,
- invoca `/upgrade` en el stamper,
- actualiza `ots_proof`, `txid`, `status`, `last_error` y `sealed_at`,
- aplica backoff progresivo para no martillear el servicio.

### 4. Consulta de historial y detalle

- `GET /api/files/history` → historial del usuario actual
- `GET /api/files/{fileHashId}` → detalle de un archivo concreto

### 5. Descarga de artefactos

- `GET /api/files/{fileHashId}/ots`
- `GET /api/files/{fileHashId}/certificate`

Ambos endpoints comprueban que el archivo pertenece al usuario autenticado.

## 📡 Endpoints principales del backend

### Autenticación

- `POST /api/auth/register`
- `POST /api/auth/login`

### Usuario

- `GET /api/users/me`
- `PUT /api/users/me/password`

### Archivos y sellos

- `POST /api/files/upload`
- `GET /api/files/history`
- `GET /api/files/{fileHashId}`
- `GET /api/files/{fileHashId}/ots`
- `GET /api/files/{fileHashId}/certificate`

### Recheck y callback

- `POST /api/stamps/recheck`
- `POST /api/stamps/callback`

## 🧾 Generación de certificados PDF

El servicio `CertificatePdfService` genera un certificado descargable con:

- nombre del archivo,
- SHA-256 del archivo,
- SHA-256 del proof `.ots`,
- estado del sellado,
- fechas relevantes,
- `txid` si existe,
- metadatos mínimos para presentar la evidencia.

Es una pieza importante porque convierte un dato técnico en una salida entendible para usuario final o para una futura presentación profesional del producto.

## ⚙️ Configuración relevante del backend

Variables y propiedades destacables:

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:filehashdb}
spring.datasource.username=${DB_USER:filehashuser}
spring.datasource.password=${DB_PASSWORD:change_me}
security.jwt.secret=${JWT_SECRET}
stamper.base-url=${STAMPER_BASE_URL:http://localhost:8000}
stamper.callback.token=${STAMPER_CALLBACK_TOKEN:change_me}
stamps.recheck.fixed-delay-ms=${STAMPS_RECHECK_FIXED_DELAY_MS:60000}
```

## 🧪 Testing del backend

El backend incluye:

- tests unitarios de JWT y servicios,
- tests de integración para autenticación,
- tests de subida de archivo,
- tests con **Testcontainers** usando PostgreSQL real para validar comportamiento más cercano a producción.

Archivos destacados de test:

- `src/test/java/com/bitsealer/integration/AuthIntegrationTest.java`
- `src/test/java/com/bitsealer/integration/UploadIntegrationTest.java`
- `src/test/java/com/bitsealer/integration/UserControllerIntegrationTest.java`
- `src/test/java/com/bitsealer/security/jwt/JwtUtilsTest.java`
- `src/test/java/com/bitsealer/service/FileHashServiceTest.java`

## ✅ Fortalezas del backend en v1

- estructura limpia y razonable para seguir creciendo,
- JWT correctamente separado en utilidades y filtro,
- sellado desacoplado en microservicio externo,
- historial y detalle por usuario,
- generación de pruebas descargables,
- recheck robusto con backoff persistido en base de datos,
- base sólida de testing.

---

# [🎨 Frontend — React](https://github.com/BitSealer/bitsealer-frontend)

## 📌 Rol del frontend dentro del sistema

El frontend es la capa de experiencia de usuario de BitSealer. Permite:

- navegar por la landing pública,
- registrarse e iniciar sesión,
- acceder a un dashboard privado,
- subir archivos para sellarlos,
- consultar el historial,
- abrir el detalle de cada sello,
- descargar pruebas y certificados,
- gestionar la contraseña del usuario.

## 🧱 Stack del frontend

- **React 19**
- **Vite 7**
- **React Router DOM 7**
- **Axios**
- **Tailwind CSS 4**
- **Chart.js + react-chartjs-2**
- **date-fns**
- **lucide-react**

## 🧭 Estructura funcional

### Carpetas principales

- `src/api` → llamadas HTTP al backend
- `src/components` → componentes reutilizables y visuales
- `src/context` → estado global de autenticación y datos
- `src/layout` → layout del dashboard privado
- `src/pages` → pantallas principales
- `src/routes` y `src/routing` → definición y protección de rutas
- `src/assets` → imágenes y recursos visuales

## 🔐 Autenticación en frontend

La autenticación se gestiona con `AuthContext`.

### Comportamiento principal

- al iniciar la app, comprueba si existe `bitsealer_token` en `localStorage`,
- si existe, llama a `GET /users/me` para validar sesión,
- en login y registro guarda token y datos del usuario,
- en error `401`, el interceptor Axios limpia sesión y redirige a `/login`.

### Almacenamiento local

Se usan estas claves:

- `bitsealer_token`
- `bitsealer_user`
- `bitsealer_auth`

## 🗺️ Rutas del frontend

### Públicas

- `/` → landing principal
- `/login` → inicio de sesión
- `/register` → registro

### Privadas

- `/dashboard`
- `/upload`
- `/history`
- `/history/:fileHashId`
- `/settings`

Las rutas privadas están protegidas por `ProtectedRoute`.

## 🖥️ Pantallas principales

### Home
Landing pública con:

- propuesta de valor,
- explicación de qué es el sellado en Bitcoin,
- diseño orientado a producto,
- recursos visuales e iconografía moderna.

### Dashboard
Muestra una visión rápida del uso de la aplicación:

- tendencia de sellados por periodo,
- total de archivos,
- archivos pendientes,
- tabla de últimos sellos,
- integración visual con datos de historial.

Además consulta la tarifa recomendada de Bitcoin desde `mempool.space` para mostrar contexto de red al usuario.

### Upload
Pantalla de subida con:

- drag & drop,
- cálculo local previo del SHA-256 en navegador,
- feedback visual de carga,
- redirección al historial tras éxito.

Este detalle de calcular el hash localmente da una experiencia más transparente: el usuario ve lo que está sellando antes de enviarlo.

### History
Lista el historial de archivos del usuario autenticado.

### FileDetails
Muestra el detalle de un archivo y sus evidencias asociadas.

### Settings
Permite cambiar la contraseña del usuario autenticado.

## 🔌 Integración con la API

El cliente Axios base se configura con:

```js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';
```

Servicios principales:

- `src/api/auth.js`
- `src/api/files.js`
- `src/api/http.js`

Operaciones consumidas:

- login
- register
- perfil (`/users/me`)
- cambio de contraseña
- subida de archivo
- historial
- detalle
- descarga de `.ots`
- descarga de certificado PDF

## 🎨 Diseño y experiencia de usuario

BitSealer v1 ya presenta una línea visual bastante cuidada:

- interfaz moderna con panel privado,
- dashboard con cards y gráficas,
- landing comercial más orientada a producto que a simple demo académica,
- uso de Tailwind para mantener consistencia visual,
- assets gráficos y capturas integradas.

## ✅ Fortalezas del frontend en v1

- separación clara entre páginas, contexto y servicios,
- autenticación integrada y usable,
- dashboard convincente para demo y validación de producto,
- subida de archivos cómoda y entendible,
- detalle suficiente para descargar artefactos,
- base buena para seguir iterando UX y funcionalidades premium.

---

# [⛓️ Stamper — FastAPI + OpenTimestamps](https://github.com/BitSealer/bitsealer-stamper)

## 📌 Rol del stamper dentro del sistema

El stamper es el microservicio técnico encargado de hablar con OpenTimestamps.

Su objetivo es aislar la lógica específica de sellado fuera del backend principal para:

- mantener responsabilidades separadas,
- simplificar la evolución futura,
- desacoplar el dominio de usuarios/datos del dominio de sellado,
- permitir extender en el futuro la lógica blockchain sin contaminar el backend Java.

## 🧱 Stack del stamper

- **Python**
- **FastAPI 0.111.0**
- **Uvicorn 0.30.1**
- **OpenTimestamps Client 0.7.2**

## 📂 Estructura interna

- `app/main.py` → creación de la aplicación FastAPI
- `app/api/routes.py` → endpoints públicos
- `app/core/config.py` → configuración del servicio
- `app/core/logging.py` → logging
- `app/schemas/stamp.py` → modelos Pydantic
- `app/services/ots_service.py` → ejecución del CLI `ots`
- `app/utils/*` → utilidades de parsing, ficheros y normalización

## ⚙️ Funcionamiento técnico

### Startup

Al arrancar, el servicio ejecuta `require_ots()` para comprobar que el comando `ots` está disponible. Si no lo está, falla en startup con un error explícito.

### Calendarios OpenTimestamps

Los calendarios se configuran por entorno mediante `OTS_CALENDARS`.

Si no se define, usa por defecto:

- `https://alice.btc.calendar.opentimestamps.org`
- `https://bob.btc.calendar.opentimestamps.org`

## 📡 Endpoints principales del stamper

### `GET /health`
Comprueba que el microservicio está operativo.

### `POST /stamp`
Recibe:
- `stampId`
- `sha256`
- `originalFilename`
- `fileBase64`

Hace lo siguiente:
1. valida el SHA-256 recibido,
2. reconstruye temporalmente el archivo,
3. ejecuta `ots stamp`,
4. lee el `.ots` generado,
5. devuelve la prueba en Base64.

### `POST /upgrade`
Recibe una prueba `.ots` en Base64 y ejecuta `ots upgrade` para ver si ya existe una atestación más avanzada.

Devuelve:
- proof actualizado,
- estado derivado (`PENDING`, `ANCHORING`, `SEALED`),
- `txid` si es detectable.

### `POST /verify`
Valida que un `sha256` dado coincide con el hash embebido en un `.ots`.

Este endpoint está pensado con enfoque de privacidad:

- no necesita el archivo original,
- solo compara el hash calculado por cliente o backend con el hash interno del proof.

## 🔄 Lógica de estado del stamper

El microservicio considera tres escenarios principales:

- **PENDING** → aún no hay evidencia suficiente de anclaje,
- **ANCHORING** → ya hay `txid` o señales de progreso,
- **SEALED** → el proof ya contiene `BitcoinBlockHeaderAttestation`.

## 🧠 Diseño de responsabilidad

El microservicio hace una cosa y la hace bien:

- recibe datos,
- llama al cliente `ots`,
- interpreta la salida,
- devuelve una respuesta limpia al backend.

Eso evita meter lógica de OpenTimestamps y parsing de consola dentro del backend Java, que sería bastante menos elegante y bastante más feo de mantener. Y con “feo” me quedo corto.

## ✅ Fortalezas del stamper en v1

- responsabilidad muy bien acotada,
- API pequeña y fácil de entender,
- buena base para añadir verificación avanzada en el futuro,
- desacoplamiento correcto respecto al backend principal,
- preparado para evolucionar hacia más lógica blockchain sin romper el resto del sistema.

---

## 🔄 Flujo completo del sistema

```text
1. Usuario se registra / inicia sesión
2. Frontend guarda JWT
3. Usuario sube un archivo
4. Backend calcula SHA-256 y persiste file_hash + file_stamp
5. Backend llama al stamper (/stamp)
6. Stamper genera .ots con OpenTimestamps
7. Backend guarda ots_proof y estado inicial
8. Scheduler backend ejecuta rechecks periódicos (/upgrade)
9. Cuando el proof queda completado, estado = SEALED
10. Usuario consulta historial, detalle y descarga evidencias
```

---

## 🔐 Seguridad del sistema

### Medidas implementadas en v1

- autenticación JWT para toda la zona privada,
- hash de contraseñas con BCrypt,
- control de acceso por usuario propietario del recurso,
- callback protegido por token independiente,
- separación entre backend de negocio y microservicio técnico,
- no se usa el archivo como unidad de persistencia principal: se conserva la evidencia criptográfica y el proof.

### Aspectos a reforzar en futuras versiones

- rotación y refresco real de tokens,
- rate limiting,
- auditoría más detallada,
- hardening de contenedores,
- validación de tamaño/tipos más granular,
- observabilidad y métricas de producción.

---

## 🧪 Testing y validación

### Backend

Se han incluido tests unitarios e integración con foco en:

- autenticación,
- usuarios,
- JWT,
- subida de archivos,
- servicios principales.

### Frontend

La estructura está preparada de forma limpia, aunque en esta v1 el foco principal ha estado en funcionalidad y UX, no en un paquete de testing frontend aún completo.

### Stamper

En esta versión el valor principal está en la simplicidad del servicio y su integración estable con el backend; la siguiente evolución natural sería añadir tests automatizados del flujo `stamp / upgrade / verify` con dobles de ejecución o entornos controlados.

---

## 📈 Valor funcional de la v1

BitSealer v1 ya resuelve un caso real y entendible:

- demostrar que un archivo existía en un momento dado,
- asociar esa prueba a Bitcoin mediante OpenTimestamps,
- ofrecer un flujo usable desde navegador,
- entregar artefactos descargables que dan confianza al usuario.

---

## 🚀 Próximas líneas de evolución

- verificación pública más guiada desde interfaz,
- panel de métricas reales agregado por API,
- mejoras de observabilidad y logs técnicos,
- refresco de tokens y endurecimiento de seguridad,
- sistema de planes o límites de uso,
- despliegue cloud con reverse proxy y dominios propios,
- integración más avanzada con Bitcoin y trazabilidad de sellos.

---

## 🎯 Resumen del proyecto

### Lo que demuestra BitSealer v1

✅ Arquitectura modular real

✅ Frontend moderno y presentable

✅ Backend sólido con Spring Boot, JWT y PostgreSQL

✅ Microservicio desacoplado para OpenTimestamps

✅ Persistencia de hashes, pruebas y estados

✅ Descarga de `.ots` y certificado PDF

✅ Rechecks automáticos con backoff

✅ Base razonable para escalar a una versión más seria de producto

---

## 📎 Repositorios del sistema

- [BitSealer Backend](https://github.com/BitSealer/bitsealer-backend)
- [BitSealer Frontend](https://github.com/BitSealer/bitsealer-frontend)
- [BitSealer Stamper](https://github.com/BitSealer/bitsealer-stamper)
