<div align="center">

<img src="docs/logo.svg" width="96" alt="Logo Soportes TIC" />

# Soportes TIC

**Mesa de ayuda para reportar, asignar y resolver solicitudes de soporte técnico.**

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-0071e3?style=for-the-badge)](LICENSE)

[Demo](#) · [Reportar un error](https://github.com/TU_USUARIO/soportes-tic/issues) · [Solicitar una función](https://github.com/TU_USUARIO/soportes-tic/issues)

</div>

---

## Tabla de contenido

- [Vista previa](#-vista-previa)
- [Características](#-características)
- [Roles y permisos](#-roles-y-permisos)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Base de datos](#-base-de-datos)
- [Scripts](#-scripts)
- [Hoja de ruta](#-hoja-de-ruta)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## Vista previa

| Portada | Panel de administrador |
|---|---|
| ![Portada](docs/captura-portada.png) | ![Administrador](docs/captura-admin.png) |

| Panel de técnico | Panel de solicitante |
|---|---|
| ![Técnico](docs/captura-tecnico.png) | ![Solicitante](docs/captura-cliente.png) |

> Agrega tus capturas en la carpeta `docs/` con esos nombres.

---

## Características

- **Portada animada** con ilustraciones que aparecen al hacer scroll, pie de página con redes sociales, términos y política de privacidad.
- **Autenticación** con registro e inicio de sesión. La sesión se mantiene al recargar y se cierra sola tras **10 minutos de inactividad**.
- **Rutas protegidas**: cada rol solo entra a su panel.
- **Gestión de solicitudes**: crear, asignar, cambiar estado, registrar diagnóstico y marcar traslado al taller.
- **Historial completo** de cada solicitud, con fecha, hora y responsable de cada cambio.
- **Gráficas en tiempo real** para el administrador: estados, solicitudes por día, carga por técnico y prioridades.
- **Aviso de cookies** y preferencias configurables.
- **Diseño oscuro** y responsive en todas las vistas.

---

## Roles y permisos

| Rol | Puede | No puede |
|---|---|---|
| **Administrador** | Ver todo el sistema, registrar soportes, asignar técnicos, ver usuarios y gráficas | Gestionar diagnósticos como técnico |
| **Técnico** | Ver sus solicitudes asignadas, cambiar estado, escribir diagnóstico y registrar traslados | Ver solicitudes de otros técnicos |
| **Solicitante** | Crear solicitudes y consultar el estado e historial de las propias | Ver solicitudes de otros usuarios |

Los administradores y técnicos se crean desde la base de datos. El registro público asigna el rol de **Solicitante**.

---

## Tecnologías

- **Frontend:** React, Vite, CSS personalizado
- **Backend:** Supabase (PostgreSQL, API REST automática)
- **Gráficas e ilustraciones:** SVG nativo con animaciones CSS
- **Control de versiones:** Git con Conventional Commits

---

## Arquitectura

El proyecto está organizado en capas para separar responsabilidades:

```
src/
├── api/              # Conexión con Supabase
├── config/           # Constantes: roles, estados, prioridades, categorías
├── context/          # Estado global de autenticación y sesión
├── services/         # Lógica de acceso a datos (auth, soportes, admin, historial)
├── components/       # Vistas y componentes de presentación
│   ├── Landing.jsx           # Portada y estructura de autenticación
│   ├── Login.jsx / Register.jsx
│   ├── AdminDashboard.jsx
│   ├── TecnicoDashboard.jsx
│   ├── ClienteDashboard.jsx
│   ├── DashUI.jsx            # Gráficas y contadores
│   ├── Ilustraciones.jsx     # Ilustraciones SVG animadas
│   └── Legal.jsx             # Cookies, términos y privacidad
├── App.jsx           # Rutas y protección por rol
└── main.jsx
```

---

## Instalación

### Requisitos

- [Node.js](https://nodejs.org) 18 o superior
- Un proyecto en [Supabase](https://supabase.com)
- Git

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/TU_USUARIO/soportes-tic.git
cd soportes-tic

# 2. Instala las dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env
```

Edita `.env` con los datos de tu proyecto (**Project Settings > API** en Supabase):

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon
```

```bash
# 4. Ejecuta el proyecto
npm run dev
```

Abre `http://localhost:5173` en el navegador.

> **Importante:** nunca subas el archivo `.env` ni la clave `service_role` al repositorio.

---

## Base de datos

El sistema usa estas tablas en Supabase:

| Tabla | Contenido |
|---|---|
| `usuarios_sistema` | Usuarios con documento, nombres, correo, contraseña y rol |
| `roles_usuario` | Roles: Administrador, Tecnico, Solicitante |
| `solicitudes_soporte` | Tickets con categoría, prioridad, estado, técnico, equipo y diagnóstico |
| `estados_solicitud` | Estados del ticket (Abierto, En Revisión, Solucionado, Cerrado…) |
| `historial_solicitud` | Registro de cada cambio con comentario y responsable |
| `equipos_computo` | Equipos registrados por placa de inventario |

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión para producción en `dist/` |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run lint` | Revisa el código con ESLint |

---

## Hoja de ruta

- [x] Portada con animaciones y pie de página legal
- [x] Autenticación con sesión persistente y cierre por inactividad
- [x] Rutas protegidas por rol
- [x] Paneles de administrador, técnico y solicitante
- [ ] Subida de evidencia fotográfica en Supabase Storage
- [ ] Calificación del servicio por parte del solicitante
- [ ] Autenticación con Supabase Auth y contraseñas cifradas
- [ ] Notificaciones por correo al cambiar el estado

---

## Contribuir

1. Haz un fork del proyecto.
2. Crea una rama: `git switch -c feature/nombre-de-la-funcion`.
3. Escribe tus commits con [Conventional Commits](https://www.conventionalcommits.org): `feat(admin): agrega filtro por fecha`.
4. Abre un Pull Request hacia `develop`.

---

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

<div align="center">

Hecho con cafe y mucho café para la mesa de ayuda TIC.

</div>
