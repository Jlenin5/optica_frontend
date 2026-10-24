import { ROLES } from "../auth/roles"
import type { NavItemType } from "../types/navItemType.types"

const navigationConfig: NavItemType[] = [
  {
    id: "home",
    label: "Inicio",
    icon: 'heroicons-outline:home',
    url: "/",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.SELLER, ROLES.OPTOMETRA]
  },
  {
    id: "patients",
    label: "Pacientes",
    icon: 'lucide:book-user',
    url: "/patients",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.OPTOMETRA]
  },
  {
    id: "appointments",
    label: "Citas",
    icon: 'lucide:calendar-check',
    url: "/appointments",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.OPTOMETRA],
    children: [
      {
        id: "appointments.calendar",
        label: "Calendario",
        icon: "lucide:calendar-days",
        url: "/appointments/calendar",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.OPTOMETRA, ROLES.SELLER]
      },
      {
        id: "appointments.schedule",
        label: "Agendar Cita",
        icon: "lucide:calendar-plus",
        url: "/appointments/new",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.OPTOMETRA]
      },
      {
        id: "appointments.consultations",
        label: "Consultas Clínicas",
        icon: "lucide:clipboard-list",
        url: "/consultations",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPTOMETRA, ROLES.RECEPTIONIST]
      }
    ]
  },
  {
    id: "customers",
    label: "Clientes", icon: "lucide:user-round-search", url: "/customers",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.RECEPTIONIST, ROLES.OPTOMETRA],
  },
  {
    id: "sales",
    label: "Ventas",
    icon: 'lucide:badge-dollar-sign',
    url: "/sales",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA],
  },
  {
    id: "commercial.quotes", label: "Cotizaciones", icon: "lucide:file-chart-column", url: "/sales/quotes",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA],
  },
  {
    id: "laboratory",
    label: "Laboratorio",
    icon: 'lucide:microscope',
    url: "/laboratory",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA],
    children: [
      { id: "laboratory.lens-types", label: "Tipos de Lunas", icon: "lucide:glasses", url: "/laboratory/lens-types", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA] },
      { id: "laboratory.lens-features", label: "Características", icon: "lucide:tags", url: "/laboratory/lens-features", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
      { id: "laboratory.laboratories", label: "Laboratorios", icon: "lucide:building-2", url: "/laboratory/laboratories", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
      { id: "laboratory.quality", label: "Control de Calidad", icon: "lucide:badge-check", url: "/laboratory/quality", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA] },
      { id: "laboratory.orders", label: "Órdenes de Laboratorio", icon: "lucide:clipboard-list", url: "/laboratory/orders", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA] }
    ]
  },
  {
    id: "services", label: "Servicios", icon: 'lucide:concierge-bell', url: "/commercial/services", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA]
  },
  {
    id: "inventory",
    label: "Inventario",
    icon: 'lucide:package',
    url: "/inventory",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA],
    children: [
      {
        id: "inventory.categories",
        label: "Categorías",
        icon: "lucide:folder-tree",
        url: "/inventory/categories",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA]
      },
      {
        id: "inventory.brands",
        label: "Marcas",
        icon: "lucide:badge",
        url: "/inventory/brands",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA]
      },
      {
        id: "inventory.products",
        label: "Productos",
        icon: "lucide:box",
        url: "/inventory/products",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA]
      },
      { id: "inventory.purchases", label: "Compras", icon: "lucide:shopping-cart", url: "/inventory/purchases", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER] },
      { id: "inventory.transfers", label: "Transferencias", icon: "lucide:arrow-left-right", url: "/inventory/transfers", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER] },
      {
        id: "inventory.stock",
        label: "Stock",
        icon: "lucide:warehouse",
        url: "/inventory/stock",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      }
    ]
  },
  {
    id: "operations", label: "Operaciones", icon: "lucide:wrench", url: "/operations",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.RECEPTIONIST, ROLES.OPTOMETRA],
    children: [
      { id: "operations.workflows", label: "Centro de Procesos", icon: "lucide:route", url: "/operations/workflows", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.RECEPTIONIST, ROLES.OPTOMETRA] },
      { id: "operations.repairs", label: "Reparaciones", icon: "lucide:wrench", url: "/operations/repairs", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.RECEPTIONIST] },
      { id: "operations.deliveries", label: "Entregas", icon: "lucide:package-check", url: "/operations/deliveries", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.RECEPTIONIST] },
    ]
  },
  {
    id: "reports", label: "Reportes y Control", icon: "lucide:chart-no-axes-combined", url: "/reports",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    children: [
      { id: "reports.dashboard", label: "Reportes", icon: "lucide:bar-chart-3", url: "/reports", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
      { id: "reports.audit", label: "Auditoría y Trazabilidad", icon: "lucide:history", url: "/reports/audit", auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
    ]
  },
  {
    id: "documents",
    label: "Documentos",
    icon: 'lucide:file-text',
    url: "/documents",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    children: [
      {
        id: "documents.type-of-documents",
        label: "Tipos de Documento",
        icon: "lucide:file-check",
        url: "/documents/type-of-documents",
        auth: [ROLES.SUPER_ADMIN]
      },
      {
        id: "documents.receipts",
        label: "Comprobantes",
        icon: "lucide:file-check",
        url: "/documents/receipts",
        auth: [ROLES.SUPER_ADMIN]
      }
    ]
  },
  {
    id: "finance",
    label: "Finanzas",
    icon: 'lucide:landmark',
    url: "/finance",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPTOMETRA],
    children: [
      {
        id: "finance.currencies",
        label: "Monedas",
        icon: "lucide:circle-dollar-sign",
        url: "/finance/currencies",
        auth: [ROLES.SUPER_ADMIN]
      },
      {
        id: "finance.days-of-credit",
        label: "Días de Crédito",
        icon: "lucide:calendar",
        url: "/finance/days-of-credit",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "finance.exchange-rates",
        label: "Tasas de Cambio",
        icon: "lucide:refresh-cw",
        url: "/finance/exchange-rates",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "finance.taxes",
        label: "Impuestos",
        icon: "lucide:receipt",
        url: "/finance/taxes",
        auth: [ROLES.SUPER_ADMIN]
      },
      {
        id: "finance.banks",
        label: "Bancos",
        icon: "lucide:building",
        url: "/finance/banks",
        auth: [ROLES.SUPER_ADMIN]
      },
      {
        id: "finance.bank-accounts",
        label: "Cuentas Bancarias",
        icon: "lucide:credit-card",
        url: "/finance/bank-accounts",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "finance.payment-methods",
        label: "Métodos de Pago",
        icon: "lucide:wallet",
        url: "/finance/payment-methods",
        auth: [ROLES.SUPER_ADMIN]
      },
      {
        id: "finance.payment-types",
        label: "Tipos de Pago",
        icon: "heroicons-outline:credit-card",
        url: "/finance/payment-types",
        auth: [ROLES.SUPER_ADMIN]
      },
      {
        id: "finance.cash-registers",
        label: "Cajas",
        icon: "lucide:wallet-cards",
        url: "/finance/cash-registers",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "cash-registers.open",
        label: "Abrir Caja",
        icon: "lucide:lock-open",
        url: "/cash-register/open",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA]
      },
      {
        id: "cash-registers.sessions",
        label: "Mis Sesiones",
        icon: "lucide:history",
        url: "/cash-register/sessions",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER, ROLES.OPTOMETRA]
      },
      {
        id: "finance.cash-movements",
        label: "Movimientos de Caja",
        icon: "lucide:arrow-left-right",
        url: "/finance/cash-movements",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPTOMETRA]
      }
    ]
  },
  {
    id: "organizations",
    label: "Organización",
    icon: 'heroicons-outline:building-office-2',
    url: "/organizations",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER],
    children: [
      {
        id: "organizations.companies",
        label: "Empresas",
        icon: "lucide:building-2",
        url: "/organizations/companies",
        auth: [ROLES.SUPER_ADMIN]
      },
      {
        id: "organizations.branch-offices",
        label: "Sucursales",
        icon: "lucide:map-pin",
        url: "/organizations/branch-offices",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER]
      },
      {
        id: "organizations.warehouses",
        label: "Almacenes",
        icon: "lucide:warehouse",
        url: "/organizations/warehouses",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER]
      },
      {
        id: "organizations.stores",
        label: "Tiendas",
        icon: "lucide:store",
        url: "/organizations/stores",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SELLER]
      }
    ]
  },
  {
    id: "billing",
    label: "Facturación",
    icon: 'lucide:credit-card',
    url: "/billing",
    auth: [ROLES.SUPER_ADMIN],
    children: [
      {
        id: "billing.plans",
        label: "Planes",
        icon: "lucide:crown",
        url: "/billing/plans",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "billing.subscriptions",
        label: "Suscripciones",
        icon: "lucide:calendar-check",
        url: "/billing/subscriptions",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "billing.limits",
        label: "Límites",
        icon: "lucide:gauge",
        url: "/billing/limits",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "billing.features",
        label: "Características",
        icon: "lucide:sparkles",
        url: "/billing/features",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      }
    ]
  },
  {
    id: "administration",
    label: "Administración",
    icon: 'lucide:settings',
    url: "/administration",
    auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    children: [
      {
        id: "administration.users",
        label: "Usuarios",
        icon: "lucide:users",
        url: "/administration/users",
        auth: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "administration.roles",
        label: "Roles",
        icon: "lucide:shield",
        url: "/administration/roles",
        auth: [ROLES.SUPER_ADMIN]
      },
      {
        id: "administration.statuses",
        label: "Estados Comerciales",
        icon: "lucide:layers",
        url: "/administration/statuses",
        auth: [ROLES.SUPER_ADMIN]
      }
    ]
  }
]

export default navigationConfig