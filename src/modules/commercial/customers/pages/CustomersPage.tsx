import { useMemo, useState } from "react";
import { Building2, Plus, Search, Users, UserCheck, X } from "lucide-react";
import { CustomerForm } from "../components/form";
import { CustomerTable } from "../components/table";
import type { Customer, CustomerDraft } from "../types/customer.types";
import "@/styles/customers.scss";

const empty: CustomerDraft = {
  customer_type: "PERSONA",
  full_name: "",
  document_type: "DNI",
  document_number: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  status: "ACTIVO",
};
const seed: Customer[] = [
  {
    id: "CLI-1001",
    customer_type: "PERSONA",
    full_name: "María García López",
    document_type: "DNI",
    document_number: "72845120",
    phone: "987 654 321",
    email: "maria@email.com",
    address: "San Isidro, Lima",
    notes: "Cliente + paciente",
    status: "ACTIVO",
  },
  {
    id: "CLI-1002",
    customer_type: "EMPRESA",
    full_name: "Óptica Visión Andina S.A.C.",
    document_type: "RUC",
    document_number: "20601234567",
    phone: "945 123 456",
    email: "ventas@visionandina.pe",
    address: "Miraflores, Lima",
    notes: "Cliente corporativo",
    status: "ACTIVO",
  },
  {
    id: "CLI-1003",
    customer_type: "PERSONA",
    full_name: "Carlos Rodríguez Pérez",
    document_type: "DNI",
    document_number: "70412855",
    phone: "",
    email: "",
    address: "",
    notes: "Datos por completar",
    status: "INACTIVO",
  },
];
const clone = <T,>(v: T): T =>
  typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
export const CustomersPage = () => {
  const [rows, setRows] = useState<Customer[]>(seed);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"TODOS" | Customer["status"]>("TODOS");
  const [type, setType] = useState<"TODOS" | Customer["customer_type"]>(
    "TODOS",
  );
  const [modal, setModal] = useState<"CREATE" | "EDIT" | "VIEW" | null>(null);
  const [draft, setDraft] = useState<CustomerDraft>(clone(empty));
  const [selected, setSelected] = useState<Customer | null>(null);
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const text =
          `${r.id} ${r.full_name} ${r.document_number} ${r.phone} ${r.email}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (status === "TODOS" || r.status === status) &&
          (type === "TODOS" || r.customer_type === type)
        );
      }),
    [rows, query, status, type],
  );
  const openCreate = () => {
    setSelected(null);
    setDraft(clone(empty));
    setModal("CREATE");
  };
  const openEdit = (r: Customer) => {
    setSelected(r);
    const { id, ...data } = r;
    setDraft(clone(data));
    setModal("EDIT");
  };
  const openView = (r: Customer) => {
    setSelected(r);
    const { id, ...data } = r;
    setDraft(clone(data));
    setModal("VIEW");
  };
  const save = () => {
    if (!draft.full_name.trim() || !draft.document_number.trim()) return;
    if (modal === "CREATE") {
      const id = `CLI-${String(Math.max(1000, ...rows.map((r) => Number(r.id.split("-")[1]) || 1000)) + 1)}`;
      setRows((p) => [{ id, ...clone(draft) }, ...p]);
    } else if (selected) {
      setRows((p) =>
        p.map((r) => (r.id === selected.id ? { ...r, ...clone(draft) } : r)),
      );
    }
    setModal(null);
  };
  const toggle = (r: Customer) =>
    setRows((p) =>
      p.map((x) =>
        x.id === r.id
          ? { ...x, status: x.status === "ACTIVO" ? "INACTIVO" : "ACTIVO" }
          : x,
      ),
    );
  const remove = (r: Customer) => {
    if (
      window.confirm(
        `¿Eliminar a ${r.full_name}? Esta acción solo afecta los datos mostrados en esta sesión.`,
      )
    )
      setRows((p) => p.filter((x) => x.id !== r.id));
  };
  return (
    <section className="customers-page">
      <header className="customers-page__header">
        <div>
          <div className="customers-page__eyebrow">
            <Users size={15} /> Gestión comercial
          </div>
          <h1>Clientes</h1>
          <p>
            Administra personas y empresas, sus datos de contacto y estado
            comercial desde un solo lugar.
          </p>
        </div>
        <button className="customers-primary" onClick={openCreate}>
          <Plus size={18} />
          Nuevo cliente
        </button>
      </header>
      <div className="customers-kpis">
        <div>
          <span>
            <Users size={17} />
            Total clientes
          </span>
          <strong>{rows.length}</strong>
          <small>Registros disponibles</small>
        </div>
        <div>
          <span>
            <UserCheck size={17} />
            Clientes activos
          </span>
          <strong>{rows.filter((r) => r.status === "ACTIVO").length}</strong>
          <small>Listos para operar</small>
        </div>
        <div>
          <span>
            <Building2 size={17} />
            Empresas
          </span>
          <strong>
            {rows.filter((r) => r.customer_type === "EMPRESA").length}
          </strong>
          <small>Clientes corporativos</small>
        </div>
      </div>
      <div className="customers-card">
        <div className="customers-toolbar">
          <div className="customers-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, documento, teléfono o correo..."
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="PERSONA">Personas</option>
            <option value="EMPRESA">Empresas</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
        </div>
        <div className="customers-card__meta">
          <span>
            {filtered.length} de {rows.length} clientes
          </span>
          <button
            onClick={() => {
              setQuery("");
              setStatus("TODOS");
              setType("TODOS");
            }}
          >
            Limpiar filtros
          </button>
        </div>
        <CustomerTable
          rows={filtered}
          onView={openView}
          onEdit={openEdit}
          onToggle={toggle}
          onDelete={remove}
        />
      </div>
      {modal && (
        <div className="customer-modal-backdrop">
          <div className="customer-modal" role="dialog" aria-modal="true">
            <header>
              <div>
                <span>
                  {modal === "VIEW"
                    ? "Ficha del cliente"
                    : modal === "EDIT"
                      ? "Editar cliente"
                      : "Nuevo cliente"}
                </span>
                <h2>
                  {modal === "VIEW"
                    ? draft.full_name
                    : modal === "EDIT"
                      ? "Actualiza la información"
                      : "Registra un nuevo cliente"}
                </h2>
                <p>
                  {modal === "VIEW"
                    ? "Consulta la información registrada del cliente."
                    : "Los campos con * son obligatorios."}
                </p>
              </div>
              <button onClick={() => setModal(null)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </header>
            <div
              className={
                modal === "VIEW"
                  ? "customer-modal__body customer-modal__body--readonly"
                  : "customer-modal__body"
              }
            >
              <CustomerForm
                value={draft}
                onChange={modal === "VIEW" ? () => {} : setDraft}
              />
            </div>
            <footer>
              <button
                className="customers-secondary"
                onClick={() => setModal(null)}
              >
                {modal === "VIEW" ? "Cerrar" : "Cancelar"}
              </button>
              {modal !== "VIEW" && (
                <button
                  className="customers-primary"
                  disabled={
                    !draft.full_name.trim() || !draft.document_number.trim()
                  }
                  onClick={save}
                >
                  {modal === "EDIT" ? "Guardar cambios" : "Registrar cliente"}
                </button>
              )}
            </footer>
          </div>
        </div>
      )}
    </section>
  );
};
