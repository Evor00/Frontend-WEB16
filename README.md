# HelpDesk Tecsup (Frontend)

Frontend del **Sistema de Mesa de Ayuda (Help Desk)**, construido con Next.js (App Router) y Tailwind CSS. Proyecto académico para la Evaluación Final del curso *Desarrollo de Aplicaciones Web Avanzado* (Tecsup).

## Stack

- Next.js 16 (App Router)
- React 19 + Tailwind CSS 4
- Autenticación vía cookie httpOnly contra la API del backend
- Metadata API, `sitemap.js` y `robots.js` para SEO

## Configuración local

```bash
npm install
cp .env.local.example .env.local   # apunta a tu backend local o desplegado
npm run dev                         # http://localhost:3000
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend (ej. `http://localhost:4000` o la URL de Render) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del frontend (para metadata, sitemap y robots) |

## Estructura

- `app/` — rutas de la aplicación (App Router)
- `app/dashboard/` — panel privado según el rol (cliente, soporte, administrador)
- `components/` — componentes reutilizables (Navbar, badges, ProtectedRoute)
- `context/AuthContext.js` — estado de sesión del usuario
- `lib/api.js` — cliente fetch hacia el backend

## Despliegue en Vercel

Ver la guía de despliegue en el documento de entrega del proyecto.
