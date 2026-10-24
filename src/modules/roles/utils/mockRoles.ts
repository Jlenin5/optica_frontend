import type { Role } from "../types/roles.types"

export let mockRoles: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    description: "Acceso total al sistema. Gestiona usuarios, roles, permisos, configuración global y todas las funcionalidades del ERP. Control completo sobre empresas, sucursales y almacenes."
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrador general. Gestiona usuarios, roles y permisos dentro de su empresa. Acceso a módulos de inventario, ventas, compras y finanzas. No tiene acceso a configuración global del sistema."
  },
  {
    id: 3,
    name: "Vendedor",
    description: "Encargado de ventas y atención al cliente. Puede registrar ventas, crear cotizaciones, gestionar clientes y ver productos. Acceso limitado a módulos de comercial e inventario."
  },
  {
    id: 4,
    name: "Encargado",
    description: "Encargado de sucursal o tienda. Supervisa operaciones diarias, gestiona inventario, aprueba pedidos, revisa ventas y administra personal. Acceso a informes y métricas de la sucursal."
  },
  {
    id: 5,
    name: "Recepcionista",
    description: "Atención al cliente y gestión de citas. Registra clientes, agenda citas médicas, recibe pagos básicos y gestiona documentación clínica inicial."
  },
  {
    id: 6,
    name: "Optometrista",
    description: "Profesional de la salud visual. Realiza exámenes visuales, prescribe lentes y contactos, emite recetas médicas y registra diagnósticos en el sistema."
  },
  {
    id: 7,
    name: "Contador",
    description: "Gestiona finanzas y contabilidad. Acceso a módulos de contabilidad, reportes financieros, conciliaciones bancarias, facturación electrónica y declaraciones tributarias."
  },
  {
    id: 8,
    name: "Almacenero",
    description: "Control de inventario y almacén. Gestiona entradas y salidas de productos, realiza inventarios físicos, controla stock mínimo y genera órdenes de reposición."
  },
  {
    id: 9,
    name: "Comprador",
    description: "Gestiona compras y proveedores. Crea órdenes de compra, negocia con proveedores, controla recepción de mercadería y gestiona devoluciones."
  },
  {
    id: 10,
    name: "Cajero",
    description: "Manejo de caja y pagos. Registra pagos en efectivo, tarjeta y otros métodos. Emite comprobantes de pago y realiza arqueos de caja diarios."
  },
  {
    id: 11,
    name: "Auditor",
    description: "Auditoría del sistema. Acceso de solo lectura a todos los módulos para revisión de procesos, validación de transacciones y generación de reportes de auditoría."
  },
  {
    id: 12,
    name: "Soporte Técnico",
    description: "Soporte al sistema. Acceso limitado para resolver incidencias, revisar logs, gestionar tickets de soporte y asistir a usuarios con problemas técnicos."
  },
  {
    id: 13,
    name: "Gerente",
    description: "Gerente general o regional. Visión global del negocio con acceso a reportes ejecutivos, dashboards, análisis de ventas, métricas de rendimiento y planificación estratégica."
  },
  {
    id: 14,
    name: "Marketing",
    description: "Gestión de marketing y promociones. Administra campañas, crea cupones de descuento, gestiona redes sociales y analiza métricas de marketing."
  },
  {
    id: 15,
    name: "Recursos Humanos",
    description: "Gestión de personal. Administra empleados, controla asistencias, gestiona vacaciones, maneja nómina y mantiene expedientes del personal."
  }
]