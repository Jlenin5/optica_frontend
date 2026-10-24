# 🏥 Optica ERP Frontend

Sistema frontend para gestión integral de ópticas.

---

## 🚀 Tecnologías

- React + Vite + TypeScript
- TanStack Query
- Zustand
- React Router DOM
- Tailwind CSS
- Axios

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 📦 Instalación

Clonar repositorio:

```bash
git clone <repo-url>
cd optica-frontend
## Modo Demo / Producción
El sistema incluye modo `demo` para presentaciones sin backend y modo `production` para consumir la API real. Consulte `docs/MODO_DEMO_PRODUCCION.md`.

## 🧭 Cobertura integral de operación

Esta versión incorpora una capa operativa alineada con el modelo de negocio integral de una óptica:

- Clientes y relación cliente/paciente.
- Cotizaciones y conversión a venta.
- Centro de procesos para visualizar el ciclo clínica → venta → laboratorio → entrega.
- Reparaciones y su flujo de diagnóstico/aprobación/reparación.
- Compras y transferencias de inventario.
- Control de calidad de laboratorio.
- Entregas y seguimiento de pedidos.
- Reportes y auditoría/trazabilidad.

La documentación funcional está en `docs/SISTEMA_INTEGRAL_OPTICAS.md` y la matriz de casos de uso en `docs/MATRIZ_CASOS_DE_USO.md`.

> Importante: las nuevas vistas operativas incluyen interacción de demostración en frontend. Para producción deben conectarse a los endpoints y DTOs reales del backend; el backend continúa siendo la autoridad para persistencia, reglas y permisos.


## Usuarios demo y permisos

En modo demo, cada usuario inicia sesión con su propio rol y permisos. Todos usan la contraseña `demo123`. Usa el `username` o `email` definido en `src/services/mock/demoSeed.ts` (por ejemplo `usuario1@opticademo.pe`, `usuario2@opticademo.pe`, etc.). El usuario 1 es SUPER_ADMIN; los demás conservan sus permisos por rol.


## Flujos comerciales y modo demostración

El frontend incluye un modo demo persistido en `localStorage`. Para usarlo sin backend, conserva `VITE_APP_MODE=demo` en `.env` (usa `.env.example` como plantilla; no distribuyas secretos del archivo `.env`).

La conversión demo de cotizaciones ahora crea registros relacionados de venta, entrega y, cuando alguna línea requiere fabricación, orden de laboratorio. Las acciones de conversión usan comandos de negocio independientes y no solo un cambio de estado.

**Integración con backend:** consulta [`docs/FRONTEND_BACKEND_GAPS.md`](docs/FRONTEND_BACKEND_GAPS.md). El backend adjunto todavía no expone rutas de cotizaciones/pedidos y mantiene comentadas las inclusiones de compras/proveedores; por eso esos flujos no pueden operar en modo API real hasta completar los endpoints descritos. El modo demo es para probar la experiencia de usuario, no para emitir comprobantes tributarios ni simular seguridad multiusuario.
