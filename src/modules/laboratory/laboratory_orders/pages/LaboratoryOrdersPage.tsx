import { AppModal } from "@/components/ui/modal";
import { useMemo, useState } from "react";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import { useAuthStore } from "@/app/store/auth.store";
import {
  useCreateLaboratoryOrder,
  useLaboratoryOrder,
  useLaboratoryOrders,
  useUpdateLaboratoryOrder,
} from "../hooks";
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies";
import type {
  LaboratoryOrder,
  LaboratoryOrderDTO,
} from "../types/laboratory-orders.types";
import { LaboratoryOrderForm } from "../components/LaboratoryOrderForm";
import "@/styles/laboratory.scss";
import { Button } from "@/components/ui/Button";

export const LaboratoryOrdersPage = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [companyId, setCompanyId] = useState<number | undefined>();
  const [selected, setSelected] = useState<LaboratoryOrder | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const effectiveCompany = isSuperAdmin
    ? companyId
    : (currentCompanyId ?? undefined);
  const { data: companiesData } = useCompanies({ status: true, limit: 100 });
  const { data, isLoading, refetch } = useLaboratoryOrders({
    ...(effectiveCompany ? { company_id: effectiveCompany } : {}),
    ...(statusFilter ? { order_status_id: statusFilter } : {}),
    limit: 100,
  });
  const { data: detail, isLoading: detailLoading } = useLaboratoryOrder(viewId);
  const create = useCreateLaboratoryOrder();
  const update = useUpdateLaboratoryOrder();
  const items = useMemo(
    () =>
      (data?.results ?? []).filter((order) => {
        const term = search.toLowerCase();
        return (
          !term ||
          `${order.id} ${order.patient?.first_name ?? ""} ${order.patient?.last_name ?? ""} ${order.laboratory?.name ?? ""} ${order.sale_id}`
            .toLowerCase()
            .includes(term)
        );
      }),
    [data, search],
  );
  const companies = companiesData?.results ?? [];
  const closeModal = () => {
    if (!create.isPending && !update.isPending) {
      setModalOpen(false);
      setSelected(null);
    }
  };
  const submit = (payload: LaboratoryOrderDTO) =>
    selected
      ? update.mutate(
          { id: selected.id, data: payload },
          { onSuccess: closeModal },
        )
      : create.mutate(payload, { onSuccess: closeModal });

  return (
    <div className="lab-page">
      <div className="lab-page__header">
        <div>
          <div className="lab-page__eyebrow">
            <MuiSvgIcon size={15}>lucide:factory</MuiSvgIcon>Laboratorio
          </div>
          <h1>Órdenes de laboratorio</h1>
          <p>Gestione fabricación, seguimiento y recepción de las lunas.</p>
        </div>
        <button
          className="add-button"
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
        >
          <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>Nueva orden
        </button>
      </div>
      <div className="lab-page__toolbar lab-page__toolbar--filters">
        <div className="lab-page__search">
          <MuiSvgIcon size={17}>lucide:search</MuiSvgIcon>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por orden, paciente, laboratorio o venta..."
          />
        </div>
        {isSuperAdmin && (
          <select
            value={companyId ?? ""}
            onChange={(e) =>
              setCompanyId(e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">Todas las empresas</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={statusFilter ?? ""}
          onChange={(e) =>
            setStatusFilter(e.target.value ? Number(e.target.value) : undefined)
          }
        >
          <option value="">Todos los estados</option>
          {Array.from(
            new Map(
              items.map((o) => [o.order_status_id, o.order_status]),
            ).entries(),
          )
            .filter(([, s]) => s)
            .map(([id, s]) => (
              <option key={id} value={id}>
                {s?.name}
              </option>
            ))}
        </select>
        <span className="lab-count">{items.length} registros</span>
        <button
          className="lab-refresh"
          onClick={() => refetch()}
          title="Actualizar"
        >
          <MuiSvgIcon size={17}>lucide:refresh-cw</MuiSvgIcon>
        </button>
      </div>
      <div className="lab-table">
        {isLoading ? (
          <div className="lab-empty">
            <span className="lab-loading-spinner" />
            Cargando órdenes...
          </div>
        ) : items.length === 0 ? (
          <div className="lab-empty">
            <MuiSvgIcon size={36}>lucide:clipboard-list</MuiSvgIcon>
            <h3>No hay órdenes</h3>
            <p>Cree una orden de laboratorio asociada a una venta.</p>
            <button
              className="add-button"
              onClick={() => {
                setSelected(null);
                setModalOpen(true);
              }}
            >
              Crear orden
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Orden</th>
                <th>Fecha</th>
                <th>Paciente</th>
                {isSuperAdmin && <th>Empresa</th>}
                <th>Laboratorio</th>
                <th>Venta</th>
                <th>Estado</th>
                <th>Entrega estimada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id}>
                  <td>
                    <span className="lab-code">#{o.number || o.id}</span>
                  </td>
                  <td>{o.order_date}</td>
                  <td>
                    <strong>
                      {o.patient
                        ? `${o.patient.first_name} ${o.patient.last_name}`
                        : `Paciente #${o.patient_id}`}
                    </strong>
                  </td>
                  {isSuperAdmin && <td>{o.company?.name || o.company_id}</td>}
                  <td>
                    {o.laboratory?.trade_name ||
                      o.laboratory?.name ||
                      `#${o.laboratory_id}`}
                  </td>
                  <td>#{o.sale_id}</td>
                  <td>
                    <span className="lab-status lab-status--order">
                      {o.order_status?.name || `Estado #${o.order_status_id}`}
                    </span>
                  </td>
                  <td>{o.estimated_delivery_date || "—"}</td>
                  <td>
                    <div className="lab-actions">
                      <button
                        className="lab-icon-btn"
                        title="Ver detalle"
                        onClick={() => setViewId(o.id)}
                      >
                        <MuiSvgIcon size={16}>lucide:eye</MuiSvgIcon>
                      </button>
                      <button
                        className="lab-icon-btn"
                        title="Editar"
                        onClick={() => {
                          setSelected(o);
                          setModalOpen(true);
                        }}
                      >
                        <MuiSvgIcon size={16}>lucide:pencil</MuiSvgIcon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {
      viewId &&
      <AppModal
        title={`Orden #${detail?.number || detail?.id || viewId}`}
        onClose={() => setViewId(null)}
        size="lg">{
          detailLoading || !detail ?
          <div className="lab-empty">Cargando detalle...</div>
          : <div className="order-detail-view">
              <div className="order-detail-view__summary">
                <div>
                  <span>Paciente</span>
                  <strong>{detail.patient ? `${detail.patient.first_name} ${detail.patient.last_name}` : `#${detail.patient_id}`}</strong>
                </div>
                <div>
                  <span>Laboratorio</span>
                  <strong>{detail.laboratory?.trade_name || detail.laboratory?.name || `#${detail.laboratory_id}`}</strong>
                </div>
                <div>
                  <span>Venta</span>
                  <strong>#{detail.sale_id}</strong>
                </div>
                <div>
                  <span>Estado</span>
                  <strong>{detail.order_status?.name || `#${detail.order_status_id}`}</strong>
                </div>
              </div>
              <h4>Detalles de lunas</h4>
              {detail.details?.map(d => (
                <div className="order-detail-view__line" key={d.id}>
                  <div className="order-detail-card__eye">{d.eye}</div>
                  <div>
                    <strong>{d.lens_type?.name || `Tipo #${d.lens_type_id}`}</strong>
                    <span>{d.quantity} × S/ {Number(d.unit_price).toFixed(2)}</span>
                    {d.notes && <small>{d.notes}</small>}
                  </div>
                </div>
              ))}
              {detail.notes && (
                <div className="order-detail-view__notes">
                  <strong>Notas</strong>
                  <p>{detail.notes}</p>
                </div>
              )}
            </div>
        }
        </AppModal>
      }
      {modalOpen && (
        <AppModal
          title={
            selected
              ? `Editar orden #${selected.number || selected.id}`
              : "Nueva orden de laboratorio"
          }
          onClose={closeModal}
          size="lg"
          footer={
            <>
              <Button variant="secondary" type="button" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit" form="customer-form" isLoading={create.isPending || update.isPending}>
                Guardar
              </Button>
            </>
          }
        >
          <LaboratoryOrderForm
            initialData={selected}
            onSubmit={submit}
            onCancel={closeModal}
            isEditing={!!selected}
            isSubmitting={create.isPending || update.isPending}
          />
        </AppModal>
      )}
    </div>
  );
};
