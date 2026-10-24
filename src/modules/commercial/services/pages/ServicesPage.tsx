import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination } from '@/components/ui/module/ModulePagination'
import { AppModal } from '@/components/ui/modal'
import { useMemo, useState } from "react";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useAuthStore } from "@/app/store/auth.store";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "../hooks";
import type { Service, ServiceDTO } from "../types/services.types";
import { ServiceForm } from "../components/ServiceForm";
import "@/styles/laboratory.scss";
import { Button } from '@/components/ui/Button';

export const ServicesPage = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore();
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350);
  const [status, setStatus] = useState<boolean | undefined>(true);
  const [selected, setSelected] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const confirm = useConfirmDialog();
  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status,
      ...(!isSuperAdmin && currentCompanyId
        ? { company_id: currentCompanyId }
        : {}),
      limit: 100,
    }),
    [search, status, isSuperAdmin, currentCompanyId],
  );
  const { data, isLoading, refetch } = useServices(filters);
  const create = useCreateService();
  const update = useUpdateService();
  const remove = useDeleteService();
  const items = data?.results ?? [];
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const visibleItems = items.slice(page * pageSize, (page + 1) * pageSize);
  const closeModal = () => {
    if (!create.isPending && !update.isPending) {
      setModalOpen(false);
      setSelected(null);
    }
  };
  const submit = (payload: ServiceDTO) =>
    selected
      ? update.mutate(
          { id: selected.id, data: payload },
          { onSuccess: closeModal },
        )
      : create.mutate(payload, { onSuccess: closeModal });
  const askDelete = (service: Service) =>
    confirm.open({
      title: "Eliminar servicio",
      message: `¿Desea eliminar "${service.name}" (${service.code})? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      variant: "danger",
      onConfirm: () => remove.mutate(service.id),
    });

  return (
    <div className="lab-page">
      <div className="lab-page__header">
        <div>
          <div className="lab-page__eyebrow">
            <MuiSvgIcon size={15}>lucide:briefcase-business</MuiSvgIcon>
            Comercial
          </div>
          <h1>Servicios</h1>
          <p>Administre los servicios que pueden utilizarse en las ventas.</p>
        </div>
        <button
          className="add-button"
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
        >
          <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>Agregar servicio
        </button>
      </div>
      <div className="lab-page__toolbar lab-page__toolbar--filters">
        <div className="lab-page__search">
          <MuiSvgIcon size={17}>lucide:search</MuiSvgIcon>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Buscar por código, nombre o descripción..."
          />
        </div>
        <select
          value={status === undefined ? "all" : status ? "active" : "inactive"}
          onChange={(e) =>
            setStatus(
              e.target.value === "all"
                ? undefined
                : e.target.value === "active",
            )
          }
        >
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="all">Todos</option>
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
            Cargando servicios...
          </div>
        ) : items.length === 0 ? (
          <div className="lab-empty">
            <MuiSvgIcon size={36}>lucide:concierge-bell</MuiSvgIcon>
            <h3>No hay servicios</h3>
            <p>
              Agregue el primer servicio para comenzar a utilizarlo en ventas.
            </p>
            <button
              className="add-button"
              onClick={() => {
                setSelected(null);
                setModalOpen(true);
              }}
            >
              Agregar servicio
            </button>
          </div>
        ) : (
          <>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Servicio</th>
                {isSuperAdmin && <th>Empresa</th>}
                <th>Descripción</th>
                <th>Precio base</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((service) => (
                <tr key={service.id}>
                  <td>
                    <span className="lab-code">{service.code}</span>
                  </td>
                  <td>
                    <strong>{service.name}</strong>
                  </td>
                  {isSuperAdmin && (
                    <td>{service.company?.name || service.company_id}</td>
                  )}
                  <td className="lab-description">
                    {service.description || "—"}
                  </td>
                  <td>
                    <strong>S/ {Number(service.base_price).toFixed(2)}</strong>
                  </td>
                  <td>
                    <span
                      className={`lab-status ${service.status ? "lab-status--active" : "lab-status--inactive"}`}
                    >
                      {service.status ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="lab-actions">
                      <button
                        className="lab-icon-btn"
                        onClick={() => {
                          setSelected(service);
                          setModalOpen(true);
                        }}
                        title="Editar"
                      >
                        <MuiSvgIcon size={16}>lucide:pencil</MuiSvgIcon>
                      </button>
                      <button
                        className="lab-icon-btn danger"
                        onClick={() => askDelete(service)}
                        title="Eliminar"
                      >
                        <MuiSvgIcon size={16}>lucide:trash-2</MuiSvgIcon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ModulePagination
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            total={items.length}
            setPage={setPage}
            setPageSize={setPageSize}
          />
          </>
        )}
      </div>
      {modalOpen && (
        <AppModal
          title={selected ? "Editar servicio" : "Nuevo servicio"}
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
          <ServiceForm
            initialData={selected}
            onSubmit={submit}
            onCancel={closeModal}
            isEditing={!!selected}
            isSubmitting={create.isPending || update.isPending}
          />
        </AppModal>
      )}
      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={confirm.close}
        onConfirm={confirm.confirm}
        title={confirm.title}
        message={confirm.message}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        variant={confirm.variant}
        isLoading={remove.isPending}
      />
    </div>
  );
};
