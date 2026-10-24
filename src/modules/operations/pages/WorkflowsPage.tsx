import { useState } from "react";
import { Link } from "react-router-dom";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import "@/styles/components/_operational.scss";

const flows = [
  {
    title: "Atención visual → venta",
    icon: "lucide:stethoscope",
    steps: [
      "Paciente",
      "Cita / atención",
      "Consulta",
      "Prescripción",
      "Cotización",
      "Venta",
    ],
    links: [
      ["Pacientes", "/patients"],
      ["Citas", "/appointments/calendar"],
      ["Consultas", "/consultations"],
      ["Ventas", "/sales"],
    ],
  },
  {
    title: "Venta → laboratorio → entrega",
    icon: "lucide:glasses",
    steps: [
      "Venta",
      "Orden",
      "Producción",
      "Control de calidad",
      "Listo",
      "Entrega",
    ],
    links: [
      ["Ventas", "/sales"],
      ["Órdenes", "/laboratory/orders"],
      ["Calidad", "/laboratory/quality"],
      ["Entregas", "/operations/deliveries"],
    ],
  },
  {
    title: "Reparación integral",
    icon: "lucide:wrench",
    steps: [
      "Recepción",
      "Diagnóstico",
      "Presupuesto",
      "Aprobación",
      "Reparación",
      "Entrega",
    ],
    links: [
      ["Reparaciones", "/operations/repairs"],
      ["Inventario", "/inventory/stock"],
      ["Entregas", "/operations/deliveries"],
    ],
  },
  {
    title: "Abastecimiento y stock",
    icon: "lucide:boxes",
    steps: [
      "Compra",
      "Recepción",
      "Almacén",
      "Transferencia",
      "Reserva",
      "Venta",
    ],
    links: [
      ["Compras", "/inventory/purchases"],
      ["Almacenes", "/organizations/warehouses"],
      ["Transferencias", "/inventory/transfers"],
      ["Productos", "/inventory/products"],
    ],
  },
];

export const WorkflowsPage = () => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    process: "",
    reference: "",
    responsible: "",
    priority: "Normal",
    notes: "",
  });
  const save = () => {
    if (!draft.process.trim() || !draft.reference.trim()) return;
    setOpen(false);
    setDraft({
      process: "",
      reference: "",
      responsible: "",
      priority: "Normal",
      notes: "",
    });
  };
  return (
    <section className="operational-page">
      <header className="operational-page__header">
        <div>
          <div className="operational-page__eyebrow">
            <MuiSvgIcon size={15}>lucide:route</MuiSvgIcon>Operación
          </div>
          <h1>Centro de procesos</h1>
          <p>
            Vista transversal de los flujos que conectan clínica, ventas,
            laboratorio, reparaciones, inventario y entregas.
          </p>
        </div>
        <div className="operational-page__actions">
          <button
            className="operational-btn operational-btn--primary"
            onClick={() => setOpen(true)}
          >
            <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>Nuevo proceso
          </button>
        </div>
      </header>
      <div className="workflow-grid">
        {flows.map((flow) => (
          <article className="workflow-card" key={flow.title}>
            <div className="workflow-card__title">
              <span>
                <MuiSvgIcon size={19}>{flow.icon}</MuiSvgIcon>
              </span>
              <h2>{flow.title}</h2>
            </div>
            <div className="workflow-steps">
              {flow.steps.map((step, i) => (
                <div className="workflow-step" key={step}>
                  <b>{i + 1}</b>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="workflow-links">
              {flow.links.map(([label, to]) => (
                <Link to={to} key={to}>
                  {label}
                  <MuiSvgIcon size={14}>lucide:arrow-right</MuiSvgIcon>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
      {open && (
        <div className="operational-modal-backdrop">
          <div className="operational-modal" role="dialog" aria-modal="true">
            <header>
              <div>
                <strong>Nuevo proceso</strong>
                <span>Centro de procesos y seguimiento transversal</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar">
                <MuiSvgIcon size={18}>lucide:x</MuiSvgIcon>
              </button>
            </header>
            <div className="operational-form">
              <label>
                Proceso
                <select
                  autoFocus
                  value={draft.process}
                  onChange={(e) =>
                    setDraft({ ...draft, process: e.target.value })
                  }
                >
                  <option value="">Seleccionar flujo</option>
                  {flows.map((f) => (
                    <option key={f.title}>{f.title}</option>
                  ))}
                </select>
              </label>
              <label>
                Referencia
                <input
                  value={draft.reference}
                  onChange={(e) =>
                    setDraft({ ...draft, reference: e.target.value })
                  }
                  placeholder="Venta, orden, reparación..."
                />
              </label>
              <label>
                Responsable
                <input
                  value={draft.responsible}
                  onChange={(e) =>
                    setDraft({ ...draft, responsible: e.target.value })
                  }
                />
              </label>
              <label>
                Prioridad
                <select
                  value={draft.priority}
                  onChange={(e) =>
                    setDraft({ ...draft, priority: e.target.value })
                  }
                >
                  <option>Normal</option>
                  <option>Alta</option>
                  <option>Urgente</option>
                </select>
              </label>
              <label>
                Notas
                <textarea
                  value={draft.notes}
                  onChange={(e) =>
                    setDraft({ ...draft, notes: e.target.value })
                  }
                />
              </label>
            </div>
            <footer>
              <button
                className="operational-btn operational-btn--secondary"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="operational-btn operational-btn--primary"
                onClick={save}
                disabled={!draft.process || !draft.reference.trim()}
              >
                Iniciar proceso
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
};