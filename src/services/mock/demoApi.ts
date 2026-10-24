import type { AxiosAdapter, AxiosResponse } from "axios";
import {
  demoSeedDatabase,
  demoSettings,
  mockCompanies,
  mockPermissions,
  mockPlanFeatures,
  mockPlanLimits,
  mockPlans,
  mockLimits,
  mockFeatures,
  mockCurrencies,
  mockExchangeRates,
  mockSales,
  mockAppointments,
  mockProducts,
  mockUsers,
  mockPatients,
} from "./demoSeed";

const DB_KEY = "optica-demo-database-v3";
const now = () => new Date().toISOString();

const dashboardStats = {
  totalPatients: 128,
  todayAppointments: 7,
  monthlySales: 12480.5,
  pendingOrders: 6,
  weeklyAppointments: 24,
  monthlyPatients: 31,
  totalRevenue: 48720.9,
  activeSubscriptions: 1,
  lowStockProducts: 8,
  pendingInvoices: 3,
};

const seeds: Record<string, unknown> = demoSeedDatabase;

type DemoDB = Record<string, unknown[]>;
const getDB = (): DemoDB => {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as DemoDB;
    } catch {
      /* reset */
    }
  }
  const db = structuredClone(seeds) as DemoDB;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
};
const saveDB = (db: DemoDB) => localStorage.setItem(DB_KEY, JSON.stringify(db));
const pathOf = (url = "") => {
  const path = url.split("?")[0].replace(/\/$/, "");
  return path.startsWith("/") ? path : `/${path}`;
};
const collectionPath = (path: string) => {
  const parts = path.split("/").filter(Boolean);
  if (parts.length > 1 && /^\d+$/.test(parts.at(-1) ?? ""))
    return `/${parts.slice(0, -1).join("/")}`;
  return path;
};
const dashboard = (path: string): unknown | undefined => {
  const salesTotal = mockSales.reduce(
    (sum: number, x: any) => sum + Number(x.total || 0),
    0,
  );
  if (path === "/dashboard/stats")
    return {
      totalPatients: mockPatients.length,
      todayAppointments: mockAppointments.filter(
        (x: any) => x.date === new Date().toISOString().slice(0, 10),
      ).length,
      monthlySales: salesTotal,
      pendingOrders: 6,
      weeklyAppointments: 24,
      monthlyPatients: mockPatients.length,
      totalRevenue: salesTotal,
      activeSubscriptions: 14,
      lowStockProducts: mockProducts.filter((x: any) => x.stock <= x.min_stock)
        .length,
      pendingInvoices: 3,
    };
  if (path === "/dashboard/activities")
    return [
      {
        id: "1",
        type: "patient",
        title: "Nuevo paciente registrado",
        description: `${mockPatients[0].first_name} ${mockPatients[0].last_name} · ${mockPatients[0].document_number}`,
        time: "Hace 5 min",
        status: "Completado",
      },
      {
        id: "2",
        type: "appointment",
        title: "Nueva cita agendada",
        description: `Cita con ${mockPatients[1].first_name} ${mockPatients[1].last_name} a las 10:00`,
        time: "Hace 18 min",
        status: "Confirmado",
      },
      {
        id: "3",
        type: "sale",
        title: "Nueva venta registrada",
        description: `Venta S/ ${mockSales[0].total}`,
        time: "Hace 35 min",
        status: "Completado",
      },
    ];
  if (path === "/dashboard/charts/appointments")
    return {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: [{ label: "Citas", data: [7, 5, 8, 6, 9, 4, 3] }],
    };
  if (path === "/dashboard/charts/sales")
    return {
      labels: ["Abr", "May", "Jun", "Jul", "Ago", "Sep"],
      datasets: [
        {
          label: "Ventas",
          data: [2850, 4120, 5480, 7650, 8920, Math.round(salesTotal)],
        },
      ],
    };
  if (path === "/dashboard/top-products")
    return mockProducts
      .slice(0, 5)
      .map((p: any, i) => ({
        id: p.id,
        name: p.name,
        sales: 12 - i,
        revenue: Number(p.price) * (12 - i),
      }));
  return undefined;
};

export const demoAdapter: AxiosAdapter = async (
  config,
): Promise<AxiosResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const path = pathOf(config.url);
  const method = (config.method || "get").toLowerCase();
  const response = (data: unknown, status = 200): AxiosResponse => ({
    data,
    status,
    statusText: "OK",
    headers: {},
    config,
  });

  const getDemoUserFromToken = () => {
    const auth = String(config.headers?.Authorization || "");
    const match = auth.match(/demo-access-token-(\d+)/);
    return mockUsers.find((u: any) => u.id === Number(match?.[1])) ?? null;
  };

  if (path === "/sign-in" && method === "post") {
    const body = typeof config.data === "string" ? JSON.parse(config.data) : (config.data || {});
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const user = mockUsers.find((u: any) =>
      String(u.username).toLowerCase() === username ||
      String(u.email).toLowerCase() === username
    );

    // Todas las cuentas demo usan la contraseña "demo123".
    if (!user || password !== "demo123" || !user.status) {
      return response({ message: "Credenciales incorrectas" }, 401);
    }

    const permissions = user.is_superuser ? ["*"] : (user.permissions || []);
    return response({
      access_token: `demo-access-token-${user.id}`,
      refresh_token: `demo-refresh-token-${user.id}`,
      features: ["*"],
      limits: {},
      permissions,
      permission_codes: permissions,
      roles: user.roles,
      user: { ...user, permissions, permission_codes: permissions },
    });
  }


  // Acciones transaccionales de cotizaciones en modo demostración.
  // Se persisten juntas en la base demo para poder recorrer el flujo completo.
  const quoteActionMatch = path.match(/^\/quotes\/(\d+)\/(convert-sale|convert-order)$/);
  if (quoteActionMatch && method === "post") {
    const quoteId = Number(quoteActionMatch[1]);
    const action = quoteActionMatch[2];
    const db = getDB();
    const quotes = (db["/quotes"] || []) as any[];
    const quoteIndex = quotes.findIndex((item) => Number(item.id) === quoteId);
    if (quoteIndex < 0) return response({ detail: "Cotización no encontrada." }, 404);

    const quote = quotes[quoteIndex];
    if (action === "convert-sale" && quote.sale_id) {
      const existingSale = ((db["/sales"] || []) as any[]).find((item) => Number(item.id) === Number(quote.sale_id));
      return response({ quote, sale: existingSale, already_processed: true });
    }
    if (action === "convert-order" && quote.order_id) {
      const existingOrder = ((db["/orders"] || []) as any[]).find((item) => Number(item.id) === Number(quote.order_id));
      return response({ quote, order: existingOrder, already_processed: true });
    }
    if (!["Aceptada", "Pedido"].includes(String(quote.status))) {
      return response({ detail: "Solo se pueden convertir cotizaciones aceptadas o con pedido iniciado." }, 409);
    }
    const stamp = now();
    const nextId = (key: string) => Math.max(0, ...((db[key] || []) as any[]).map((x) => Number(x.id) || 0)) + 1;
    const quoteItems = Array.isArray(quote.items) ? quote.items : [];
    const labItems = quoteItems.filter((item: any) => item.requires_lab || item.product_type === "lens");
    if (action === "convert-order" && labItems.length === 0) {
      return response({ detail: "La cotización no contiene lentes ni artículos que requieran laboratorio." }, 422);
    }
    if (action === "convert-sale") {
      const saleId = nextId("/sales");
      const sale = {
        id: saleId,
        code: `V-${String(saleId).padStart(6, "0")}`,
        document_code: `B001-${String(100000 + saleId).slice(-6)}`,
        quote_id: quote.id,
        quote_code: quote.code,
        order_id: quote.order_id ?? null,
        company_id: quote.company_id,
        patient_id: quote.patient_id ?? null,
        customer_name: quote.customer_name || quote.patient_name || "Cliente",
        currency: quote.currency || "PEN",
        subtotal: Number(quote.subtotal || quote.total || 0),
        discount: Number(quote.discount || 0),
        tax_amount: Number(quote.tax_amount || 0),
        total: Number(quote.total || 0),
        total_paid: 0,
        balance_due: Number(quote.total || 0),
        payment_status: "Pendiente",
        sale_status: "Confirmada",
        status: true,
        items: quoteItems,
        created_at: stamp,
        updated_at: stamp,
      };
      (db["/sales"] ||= []).push(sale);
      const requiresLab = labItems.length > 0;
      let laboratoryOrder: any = quote.laboratory_order_id
        ? ((db["/laboratory-orders"] || []) as any[]).find((item) => Number(item.id) === Number(quote.laboratory_order_id))
        : undefined;
      if (requiresLab && !laboratoryOrder && !quote.order_id) {
        const orderId = nextId("/laboratory-orders");
        laboratoryOrder = {
          id: orderId,
          code: `LAB-${String(orderId).padStart(6, "0")}`,
          company_id: quote.company_id,
          sale_id: saleId,
          quote_id: quote.id,
          customer_name: sale.customer_name,
          patient_id: sale.patient_id,
          status: "Pendiente de revisión técnica",
          items: labItems,
          notes: "Orden demo generada desde conversión de cotización.",
          created_at: stamp,
          updated_at: stamp,
        };
        (db["/laboratory-orders"] ||= []).push(laboratoryOrder);
      }
      const deliveryId = nextId("/deliveries");
      const delivery = {
        id: deliveryId,
        code: `ENT-${String(deliveryId).padStart(6, "0")}`,
        company_id: quote.company_id,
        sale_id: saleId,
        sale_reference: sale.document_code,
        customer_name: sale.customer_name,
        status: requiresLab ? "Pendiente de producción" : "Pendiente de preparación",
        delivery_method: "Recojo en tienda",
        balance_due: sale.balance_due,
        notes: "Entrega creada desde venta demo.",
        created_at: stamp,
        updated_at: stamp,
      };
      (db["/deliveries"] ||= []).push(delivery);
      quote.sale_id = saleId;
      quote.delivery_id = deliveryId;
      quote.laboratory_order_id = laboratoryOrder?.id ?? null;
      quote.status = "Convertida";
      quote.converted_at = stamp;
      quote.updated_at = stamp;
      saveDB(db);
      return response({ quote, sale, laboratory_order: laboratoryOrder, delivery, already_processed: false }, 201);
    }

    const orderId = nextId("/orders");
    const order = {
      id: orderId,
      code: `PED-${String(orderId).padStart(6, "0")}`,
      company_id: quote.company_id,
      quote_id: quote.id,
      customer_name: quote.customer_name || quote.patient_name || "Cliente",
      patient_id: quote.patient_id ?? null,
      status: "Pendiente de revisión técnica",
      items: labItems,
      notes: "Pedido demo generado desde cotización.",
      created_at: stamp,
      updated_at: stamp,
    };
    (db["/orders"] ||= []).push(order);
    quote.order_id = orderId;
    quote.status = "Pedido";
    quote.converted_at = stamp;
    quote.updated_at = stamp;
    saveDB(db);
    return response({ quote, order, already_processed: false }, 201);
  }

  const dash = dashboard(path);
  if (dash !== undefined) return response(dash);

  if (path.startsWith("/companies/validate-ruc/") && method === "get") {
    const ruc = path.split("/").at(-1) || "";
    const company = mockCompanies.find((item) => item.ruc === ruc);
    return response({
      valid: Boolean(company),
      companyName: company?.name,
    });
  }

  // Endpoints que devuelven estructuras específicas en el backend real.
  if (method === "get" && path === "/settings/company")
    return response(demoSettings.company);
  if (method === "get" && path === "/settings/notifications")
    return response(demoSettings.notifications);
  if (method === "get" && path === "/settings/security")
    return response(demoSettings.security);
  if (method === "get" && path === "/settings/invoice")
    return response(demoSettings.invoice);
  if (method === "get" && path === "/settings/system")
    return response(demoSettings.system);
  if (method === "get" && path === "/settings/branch-offices")
    return response(demoSeedDatabase["/branch-offices"]);
  if (method === "get" && path === "/permissions/me") {
    const user = getDemoUserFromToken();
    const permissions = user?.is_superuser ? ["*"] : (user?.permissions || []);
    return response({
      roles: user?.roles || [],
      permissions,
      permission_codes: permissions,
      is_superuser: !!user?.is_superuser,
    });
  }
  if (method === "get" && path === "/profile") return response(getDemoUserFromToken() || mockUsers[0]);
  if (method === "get" && path === "/auth/profile") {
    const user = getDemoUserFromToken() || mockUsers[0];
    return response({
      user,
      plan: mockPlans[0],
      features: mockFeatures.map((x: any) => x.code),
      limits: Object.fromEntries(mockLimits.map((x: any) => [x.code, 999])),
    });
  }
  if (method === "post" && path === "/auth/refresh")
    return response({
      access_token: "demo-access-token",
      refresh_token: "demo-refresh-token",
    });
  if (path === "/plans/stats" && method === "get") {
    const a = mockPlans;
    return response({
      total_plans: a.length,
      active_plans: a.filter((x: any) => x.status).length,
      inactive_plans: a.filter((x: any) => !x.status).length,
      public_plans: a.filter((x: any) => x.is_public).length,
      private_plans: a.filter((x: any) => !x.is_public).length,
    });
  }
  if (path === "/subscriptions/stats" && method === "get")
    return response({
      total: demoSeedDatabase["/subscriptions"].length,
      active: 10,
      trial: 4,
      past_due: 3,
      canceled: 3,
      expiring_soon: 4,
    });
  if (path === "/type-of-receipts/stats" && method === "get")
    return response({ total: 16, active: 16, inactive: 0, last_30_days: 16 });
  if (path === "/statuses/stats" && method === "get")
    return response({ total: 16, active: 15, inactive: 1, defaults: 1 });
  if (path === "/patients/stats" && method === "get")
    return response({
      total: mockPatients.length,
      active: mockPatients.filter((x: any) => x.status).length,
      inactive: 1,
      by_document_type: [
        {
          document_type_id: 1,
          document_type_description: "DNI",
          count: mockPatients.length,
        },
      ],
    });
  if (path === "/users/stats" && method === "get")
    return response({
      total: mockUsers.length,
      active: mockUsers.filter((x: any) => x.status).length,
      inactive: 1,
      admins: 2,
      staff: mockUsers.length - 2,
      by_role: mockUsers.reduce((a: any[], u: any) => {
        const x = a.find((v) => v.role_id === u.role_id);
        if (x) x.count++;
        else
          a.push({
            role_id: u.role_id,
            role_name: u.role?.name || "Rol",
            count: 1,
          });
        return a;
      }, []),
    });
  if (path === "/sales/stats" && method === "get")
    return response({
      total_sales: mockSales.length,
      total_amount: mockSales.reduce(
        (s: number, x: any) => s + Number(x.total),
        0,
      ),
      average_ticket:
        mockSales.reduce((s: number, x: any) => s + Number(x.total), 0) /
        mockSales.length,
    });
  if (path === "/stock/stats" && method === "get")
    return response({
      total_products: mockProducts.length,
      total_units: demoSeedDatabase["/stock"].reduce(
        (s: number, x: any) => s + x.quantity,
        0,
      ),
      low_stock: mockProducts.filter((x: any) => x.stock <= x.min_stock).length,
      out_of_stock: 0,
    });
  if (path === "/cash-registers/stats" && method === "get")
    return response({ total: 20, active: 20, inactive: 0, open_sessions: 15 });
  if (path === "/cash-movements/stats" && method === "get")
    return response({ total: 24, income: 12, expense: 12, balance: 3200 });

  // Relaciones y endpoints derivados para que las pantallas demo sean navegables.
  if (
    method === "get" &&
    path.match(/^\/plans\/\d+\/(limits|features)(\/details)?$/)
  ) {
    const m = path.match(/^\/plans\/(\d+)\/(limits|features)/)!;
    const planId = Number(m[1]);
    const kind = m[2];
    return response(
      kind === "limits"
        ? demoSeedDatabase["/plan-limits"].filter(
            (x: any) => x.plan_id === planId,
          )
        : demoSeedDatabase["/plan-features"].filter(
            (x: any) => x.plan_id === planId,
          ),
    );
  }
  if (
    method === "get" &&
    path.match(/^\/plans\/\d+\/available-(limits|features)$/)
  ) {
    const m = path.match(/^\/plans\/(\d+)\/available-(limits|features)$/)!;
    const planId = Number(m[1]);
    const kind = m[2];
    const used = new Set(
      (kind === "limits"
        ? demoSeedDatabase["/plan-limits"]
        : demoSeedDatabase["/plan-features"]
      )
        .filter((x: any) => x.plan_id === planId)
        .map((x: any) => (kind === "limits" ? x.limit_id : x.feature_id)),
    );
    return response(
      (kind === "limits" ? mockLimits : mockFeatures).filter(
        (x: any) => !used.has(x.id),
      ),
    );
  }
  if (method === "get" && path.match(/^\/limits\/\d+\/plans$/)) {
    const id = Number(path.split("/")[2]);
    return response(mockPlanLimits.filter((x: any) => x.limit_id === id));
  }
  if (method === "get" && path.match(/^\/features\/\d+\/plans$/)) {
    const id = Number(path.split("/")[2]);
    return response(mockPlanFeatures.filter((x: any) => x.feature_id === id));
  }
  if (method === "get" && path.match(/^\/roles\/\d+\/permissions$/)) {
    const id = Number(path.split("/")[2]);
    const role: any = mockRoles.find((x: any) => x.id === id);
    return response(
      mockPermissions
        .filter((p: any) => id === 1 || p.id % Math.max(1, id - 1) === 0)
        .slice(0, id === 1 ? mockPermissions.length : 24),
    );
  }
  if (method === "get" && path.match(/^\/patients\/\d+\/prescriptions$/)) {
    const id = Number(path.split("/")[2]);
    return response(
      demoSeedDatabase["/prescriptions"].filter(
        (x: any) => x.patient_id === id,
      ),
    );
  }
  if (method === "get" && path.match(/^\/consultations\/\d+\/prescription$/)) {
    const id = Number(path.split("/")[2]);
    return response(
      demoSeedDatabase["/prescriptions"].find(
        (x: any) => x.consultation_id === id,
      ) || null,
    );
  }
  if (method === "get" && path === "/appointments/calendar")
    return response(
      demoSeedDatabase["/appointments"].map((x: any) => ({
        id: x.id,
        title: x.patient
          ? `${x.patient.first_name} ${x.patient.last_name}`
          : "Paciente demo",
        start: `${x.date}T${x.time}:00`,
        end: `${x.date}T${x.time}:30`,
        patientName: x.patient
          ? `${x.patient.first_name} ${x.patient.last_name}`
          : "Paciente demo",
        patientId: x.patient_id,
        optometristName: x.optometrist?.name || "Optometrista",
        notes: x.notes || "",
        status: x.status,
      })),
    );
  if (method === "get" && path.match(/^\/stock\/product\/\d+$/)) {
    const id = Number(path.split("/")[3]);
    return response(
      demoSeedDatabase["/stock"].filter((x: any) => x.product_id === id),
    );
  }
  if (method === "get" && path.match(/^\/stock\/movements$/))
    return response({
      results: demoSeedDatabase["/stock/movements"],
      count: demoSeedDatabase["/stock/movements"].length,
      limit: 100,
      has_more: false,
      next_offset: demoSeedDatabase["/stock/movements"].length,
      next_after_id: 24,
    });
  if (method === "get" && path.match(/^\/cash-movements\/by-register\/\d+$/)) {
    const id = Number(path.split("/")[3]);
    return response(
      demoSeedDatabase["/cash-movements"].filter(
        (x: any) => x.cash_register_id === id,
      ),
    );
  }
  if (method === "get" && path.match(/^\/cash-registers\/\d+\/(summary)$/))
    return response({
      total_sales: 12,
      total_income: 4500,
      total_expense: 750,
      balance: 3750,
    });
  if (
    method === "get" &&
    path.match(/^\/cash-register-sessions\/\d+\/summary$/)
  )
    return response({
      opening_balance: 500,
      sales: 3200,
      income: 450,
      expenses: 180,
      closing_balance: 3970,
    });

  // Cambios de estado/visibilidad y acciones de suscripción.
  if (
    method === "patch" &&
    path.match(
      /^\/(companies|users|patients|products|brands|categories|stores|warehouses|branch-offices|plans|statuses|receipts|type-of-receipts|payment-methods|payment-types|banks|bank-accounts|laboratories)\/\d+\/(status|visibility)$/,
    )
  ) {
    const parts = path.split("/").filter(Boolean);
    const collectionName = `/${parts[0]}`;
    const id = Number(parts[1]);
    const action = parts[2];
    const collectionItems = (getDB()[collectionName] || []) as any[];
    const index = collectionItems.findIndex((x) => Number(x.id) === id);
    if (index >= 0) {
      const payload: any =
        typeof config.data === "string"
          ? JSON.parse(config.data || "{}")
          : config.data || {};
      collectionItems[index] = {
        ...collectionItems[index],
        ...(action === "visibility"
          ? { is_public: Boolean(payload.is_public) }
          : { status: Boolean(payload.status) }),
        updated_at: now(),
      };
      saveDB(getDB());
      return response(collectionItems[index]);
    }
    return response({ detail: "Registro no encontrado" }, 404);
  }
  if (
    method === "post" &&
    path.match(/^\/subscriptions\/\d+\/(activate|cancel|renew)$/)
  ) {
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[1]);
    const action = parts[2];
    const db = getDB();
    const items = db["/subscriptions"] || [];
    const index = items.findIndex((x: any) => Number(x.id) === id);
    if (index >= 0) {
      const item: any = items[index];
      item.status = action === "cancel" ? "canceled" : "active";
      if (action === "renew")
        item.end_date = new Date(Date.now() + 365 * 86400000)
          .toISOString()
          .slice(0, 10);
      item.updated_at = now();
      saveDB(db);
      return response(item);
    }
  }
  if (method === "patch" && path.startsWith("/settings/")) {
    const section = path
      .split("/")
      .filter(Boolean)[1] as keyof typeof demoSettings;
    const payload: any =
      typeof config.data === "string"
        ? JSON.parse(config.data || "{}")
        : config.data || {};
    if ((demoSettings as any)[section]) {
      (demoSettings as any)[section] = {
        ...(demoSettings as any)[section],
        ...payload,
      };
      return response((demoSettings as any)[section]);
    }
  }
  if (method === "post" && path === "/settings/company/logo")
    return response({ logo: "" });

  const db = getDB();
  const collection = collectionPath(path);
  const items = db[collection] ?? [];
  if (!db[collection]) db[collection] = items;

  // Las colecciones demo usan el mismo contrato paginado del backend.
  if (method === "get" && (path === collection || path.includes("?"))) {
    const rawParams = config.params as
      | Record<string, unknown>
      | URLSearchParams
      | undefined;
    const params = new URLSearchParams(config.url?.split("?")[1] ?? "");
    if (rawParams instanceof URLSearchParams)
      rawParams.forEach((value, key) => params.set(key, value));
    else if (rawParams)
      Object.entries(rawParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "")
          params.set(key, String(value));
      });
    const limit = Math.max(
      1,
      Number(params.get("limit") || params.get("page_size") || 20),
    );
    const offset = Math.max(0, Number(params.get("offset") || 0));
    const page = Math.max(1, Number(params.get("page") || 1));
    const effectiveOffset =
      params.has("page") && !params.has("offset") ? (page - 1) * limit : offset;
    const search = (params.get("search") || "").trim().toLowerCase();
    const statusParam = params.get("status");
    const filtered = items.filter((item: any) => {
      const haystack = Object.values(item || {})
        .filter((v) => ["string", "number"].includes(typeof v))
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesStatus =
        statusParam === null ||
        statusParam === "" ||
        (statusParam === "true" && item.status === true) ||
        (statusParam === "false" && item.status === false);
      return matchesSearch && matchesStatus;
    });
    const results = filtered.slice(effectiveOffset, effectiveOffset + limit);
    const nextOffset = effectiveOffset + results.length;
    return response({
      results,
      count: filtered.length,
      limit,
      has_more: nextOffset < filtered.length,
      next_offset: nextOffset,
      next_after_id: results.length ? Number((results.at(-1) as any).id) : null,
    });
  }

  if (method === "get") {
    const last = path.split("/").filter(Boolean).at(-1);
    if (last && /^\d+$/.test(last))
      return response(
        items.find((item) => (item as { id?: number }).id === Number(last)) ??
          null,
      );
    // formato compatible con la mayoría de hooks: lista simple y datos genéricos vacíos
    return response(items);
  }
  // Operaciones específicas del módulo de empresas en modo demo.
  if (
    path.startsWith("/companies/") &&
    path.endsWith("/status") &&
    method === "patch"
  ) {
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[1]);
    const index = items.findIndex(
      (x) => Number((x as { id?: number }).id) === id,
    );
    if (index >= 0) {
      const payload =
        typeof config.data === "string"
          ? JSON.parse(config.data || "{}")
          : (config.data ?? {});
      items[index] = {
        ...(items[index] as object),
        status: Boolean((payload as { status?: boolean }).status),
        updated_at: now(),
      };
      saveDB(db);
      return response(items[index]);
    }
    return response({ detail: "Empresa no encontrada" }, 404);
  }

  if (
    path.startsWith("/companies/") &&
    path.endsWith("/logo") &&
    method === "post"
  ) {
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[1]);
    const index = items.findIndex(
      (x) => Number((x as { id?: number }).id) === id,
    );
    if (index >= 0) {
      // El modo demo no persiste binarios; usamos un placeholder local.
      const logo = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="16" fill="#e5e7eb"/><text x="48" y="56" text-anchor="middle" font-family="Arial" font-size="34" fill="#374151">Ó</text></svg>`,
      )}`;
      items[index] = { ...(items[index] as object), logo, updated_at: now() };
      saveDB(db);
      return response({ logo });
    }
    return response({ detail: "Empresa no encontrada" }, 404);
  }

  const payload =
    typeof config.data === "string"
      ? JSON.parse(config.data || "{}")
      : (config.data ?? {});
  if (method === "post") {
    const item = {
      id:
        Math.max(
          0,
          ...items.map((x) => Number((x as { id?: number }).id) || 0),
        ) + 1,
      ...payload,
      created_at: payload.created_at ?? now(),
    };
    items.push(item);
    saveDB(db);
    return response(item, 201);
  }
  const id = Number(path.split("/").filter(Boolean).at(-1));
  const index = items.findIndex(
    (x) => Number((x as { id?: number }).id) === id,
  );
  if ((method === "put" || method === "patch") && index >= 0) {
    items[index] = {
      ...(items[index] as object),
      ...payload,
      updated_at: now(),
    };
    saveDB(db);
    return response(items[index]);
  }
  if (method === "delete" && index >= 0) {
    items.splice(index, 1);
    saveDB(db);
    return response({ success: true });
  }
  return response(method === "delete" ? { success: true } : items);
};

export const resetDemoDatabase = () => localStorage.removeItem(DB_KEY);
