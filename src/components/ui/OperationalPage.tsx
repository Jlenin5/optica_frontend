import { useEffect, useMemo, useState, type ReactNode } from "react";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import "@/styles/components/_operational.scss";

type Status =
  | "Pendiente"
  | "En proceso"
  | "Observado"
  | "Listo"
  | "Completado"
  | "Cancelado";
export type OperationalRow = {
  id: string;
  primary: string;
  secondary?: string;
  status: Status;
  owner?: string;
  detail?: string;
};

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  createLabel: string;
  rows: OperationalRow[];
  columns?: { label: string; key: keyof OperationalRow }[];
  onCreate?: () => void;
  quickActions?: { label: string; icon: string; onClick?: () => void }[];
  /** Module-specific registration form. The shell is shared; the registration fields are not. */
  createForm?: (value: any, onChange: (value: any) => void) => ReactNode;
  initialDraft?: any;
  isDraftValid?: (value: any) => boolean;
  mapDraftToRow?: (value: any, nextId: string) => OperationalRow;
  modalSubtitle?: string;
}

const statusClass = (status: Status) =>
  status.toLowerCase().replaceAll(" ", "-");

export function OperationalPage({
  eyebrow,
  title,
  description,
  createLabel,
  rows: initialRows,
  columns = [],
  onCreate,
  quickActions = [],
  createForm,
  initialDraft,
  isDraftValid,
  mapDraftToRow,
  modalSubtitle = "Registro específico del módulo",
}: Props) {
  const [rows, setRows] = useState(initialRows);
  useEffect(() => setRows(initialRows), [initialRows]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"Todos" | Status>("Todos");
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState<any>(
    initialDraft ?? {
      primary: "",
      secondary: "",
      owner: "",
      detail: "",
      status: "Pendiente" as Status,
    },
  );
  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const text =
          `${row.id} ${row.primary} ${row.secondary ?? ""} ${row.owner ?? ""} ${row.detail ?? ""}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (status === "Todos" || row.status === status)
        );
      }),
    [rows, query, status],
  );
  const openCreate = () => {
    setDraft(
      typeof structuredClone === "function"
        ? structuredClone(
            initialDraft ?? {
              primary: "",
              secondary: "",
              owner: "",
              detail: "",
              status: "Pendiente",
            },
          )
        : (initialDraft ?? {
            primary: "",
            secondary: "",
            owner: "",
            detail: "",
            status: "Pendiente",
          }),
    );
    setCreateOpen(true);
    onCreate?.();
  };
  const save = () => {
    if (isDraftValid && !isDraftValid(draft)) return;
    const prefix =
      title
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z]/g, "")
        .slice(0, 3) || "REG";
    const nextId = `${prefix}-${String(rows.length + 1).padStart(4, "0")}`;
    const row = mapDraftToRow
      ? mapDraftToRow(draft, nextId)
      : ({ id: nextId, ...draft } as OperationalRow);
    setRows((prev) => [row, ...prev]);
    setCreateOpen(false);
  };

  return (
    <section className="operational-page">
      <header className="operational-page__header">
        <div>
          <div className="operational-page__eyebrow">
            <MuiSvgIcon size={15}>lucide:workflow</MuiSvgIcon>
            {eyebrow}
          </div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="operational-page__actions">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="operational-btn operational-btn--secondary"
              onClick={action.onClick}
            >
              <MuiSvgIcon size={17}>{action.icon}</MuiSvgIcon>
              {action.label}
            </button>
          ))}
          <button
            className="operational-btn operational-btn--primary"
            onClick={openCreate}
          >
            <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
            {createLabel}
          </button>
        </div>
      </header>
      <div className="operational-kpis">
        <div>
          <span>Total</span>
          <strong>{rows.length}</strong>
        </div>
        <div>
          <span>Pendientes</span>
          <strong>{rows.filter((r) => r.status === "Pendiente").length}</strong>
        </div>
        <div>
          <span>En proceso</span>
          <strong>
            {rows.filter((r) => r.status === "En proceso").length}
          </strong>
        </div>
        <div>
          <span>Listos</span>
          <strong>
            {
              rows.filter(
                (r) => r.status === "Listo" || r.status === "Completado",
              ).length
            }
          </strong>
        </div>
      </div>
      <div className="operational-toolbar">
        <div className="operational-search">
          <MuiSvgIcon size={17}>lucide:search</MuiSvgIcon>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código, nombre o responsable..."
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option>Todos</option>
          <option>Pendiente</option>
          <option>En proceso</option>
          <option>Observado</option>
          <option>Listo</option>
          <option>Completado</option>
          <option>Cancelado</option>
        </select>
        <span>{filtered.length} registros</span>
      </div>
      <div className="operational-table-wrap">
        <table className="operational-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Registro</th>
              {columns.map((c) => (
                <th key={String(c.key)}>{c.label}</th>
              ))}
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.id}</strong>
                </td>
                <td>
                  <strong>{row.primary}</strong>
                  {row.secondary && <small>{row.secondary}</small>}
                </td>
                {columns.map((c) => (
                  <td key={String(c.key)}>{String(row[c.key] ?? "—")}</td>
                ))}
                <td>
                  <span
                    className={`operational-status operational-status--${statusClass(row.status)}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td>
                  <button className="operational-icon" title="Ver detalle">
                    <MuiSvgIcon size={16}>lucide:arrow-up-right</MuiSvgIcon>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4 + columns.length}>
                  <div className="operational-empty">
                    <MuiSvgIcon size={34}>lucide:search-x</MuiSvgIcon>
                    <strong>No se encontraron registros</strong>
                    <span>
                      Ajusta los filtros o registra una nueva operación.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {createOpen && (
        <div className="operational-modal-backdrop" role="presentation">
          <div className="operational-modal" role="dialog" aria-modal="true">
            <header>
              <div>
                <strong>{createLabel}</strong>
                <span>{modalSubtitle}</span>
              </div>
              <button onClick={() => setCreateOpen(false)} aria-label="Cerrar">
                <MuiSvgIcon size={18}>lucide:x</MuiSvgIcon>
              </button>
            </header>
            <div className="operational-form">
              {createForm ? (
                createForm(draft, setDraft)
              ) : (
                <>
                  <label>
                    Registro
                    <input
                      autoFocus
                      value={draft.primary}
                      onChange={(e) =>
                        setDraft({ ...draft, primary: e.target.value })
                      }
                      placeholder="Nombre o referencia"
                    />
                  </label>
                  <label>
                    Referencia
                    <input
                      value={draft.secondary}
                      onChange={(e) =>
                        setDraft({ ...draft, secondary: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Responsable
                    <input
                      value={draft.owner}
                      onChange={(e) =>
                        setDraft({ ...draft, owner: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Detalle
                    <input
                      value={draft.detail}
                      onChange={(e) =>
                        setDraft({ ...draft, detail: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Estado
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        setDraft({ ...draft, status: e.target.value as Status })
                      }
                    >
                      <option>Pendiente</option>
                      <option>En proceso</option>
                      <option>Observado</option>
                      <option>Listo</option>
                      <option>Completado</option>
                      <option>Cancelado</option>
                    </select>
                  </label>
                </>
              )}
            </div>
            <footer>
              <button
                className="operational-btn operational-btn--secondary"
                onClick={() => setCreateOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="operational-btn operational-btn--primary"
                onClick={save}
                disabled={
                  isDraftValid ? !isDraftValid(draft) : !draft.primary?.trim()
                }
              >
                Guardar
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
