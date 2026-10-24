import { useEffect, useMemo, useState } from "react";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import { useAuthStore } from "@/app/store/auth.store";
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies";
import { useSales } from "@/modules/commercial/sales/hooks/useSales";
import { usePatients } from "@/modules/clinical/patients/hooks/usePatients";
import { usePrescriptions } from "@/modules/clinical/prescriptions/hooks/usePrescriptions";
import { useLaboratories } from "@/modules/laboratory/laboratories/hooks";
import { useLensTypes } from "@/modules/laboratory/lens_types/hooks";
import { useStatuses } from "@/modules/statuses/hooks/useStatuses";
import type {
  LaboratoryOrder,
  LaboratoryOrderDTO,
  LaboratoryOrderDetailDTO,
  Eye,
} from "../types/laboratory-orders.types";

interface Props {
  initialData?: LaboratoryOrder | null;
  onSubmit: (data: LaboratoryOrderDTO) => void;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
}
type FormState = LaboratoryOrderDTO & { details: LaboratoryOrderDetailDTO[] };
const empty = (): FormState => ({
  sale_id: 0,
  patient_id: 0,
  laboratory_id: 0,
  prescription_id: null,
  order_status_id: 0,
  estimated_delivery_date: null,
  delivered_at: null,
  notes: "",
  status: true,
  details: [],
});

export const LaboratoryOrderForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
  isSubmitting = false,
}: Props) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore();
  const [form, setForm] = useState<FormState>(empty());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [companyId, setCompanyId] = useState<number | undefined>();
  const [showOptional, setShowOptional] = useState(true);
  const [detailDraft, setDetailDraft] = useState<LaboratoryOrderDetailDTO>({
    lens_type_id: 0,
    eye: "OD",
    quantity: 1,
    unit_price: 0,
    notes: "",
  });

  const { data: companiesData, isLoading: companiesLoading } = useCompanies({
    status: true,
    limit: 100,
  });
  const companies = companiesData?.results ?? [];
  const effectiveCompanyId = isSuperAdmin
    ? companyId
    : (currentCompanyId ?? undefined);
  const { data: salesData, isLoading: salesLoading } = useSales({
    limit: 100,
    company_id: effectiveCompanyId,
  });
  const { data: patientsData, isLoading: patientsLoading } = usePatients({
    status: true,
    ...(effectiveCompanyId ? { company_id: effectiveCompanyId } : {}),
  });
  const { data: prescriptionsData, isLoading: prescriptionsLoading } =
    usePrescriptions({
      status: true,
      ...(form.patient_id ? { patient_id: form.patient_id } : {}),
    });
  const { data: laboratoriesData, isLoading: laboratoriesLoading } =
    useLaboratories(
      effectiveCompanyId
        ? { company_id: effectiveCompanyId, status: true }
        : { status: true },
    );
  const { data: lensTypesData, isLoading: lensTypesLoading } = useLensTypes({
    status: true,
    limit: 100,
  });
  const { data: statusesData, isLoading: statusesLoading } = useStatuses({
    status: true,
  });

  const sales = salesData?.pages.flatMap((page) => page.results) ?? [];
  const patients = patientsData?.pages.flatMap((page) => page.results) ?? [];
  const prescriptions =
    prescriptionsData?.pages.flatMap((page) => page.results) ?? [];
  const laboratories =
    laboratoriesData?.pages.flatMap((page) => page.results) ?? [];
  const lensTypes = Array.isArray(lensTypesData)
    ? lensTypesData
    : (lensTypesData?.results ?? []);
  const statuses = statusesData?.pages.flatMap((page) => page.results) ?? [];

  useEffect(() => {
    if (initialData) {
      setCompanyId(initialData.company_id);
      setForm({
        company_id: initialData.company_id,
        sale_id: initialData.sale_id,
        patient_id: initialData.patient_id,
        laboratory_id: initialData.laboratory_id,
        prescription_id: initialData.prescription_id,
        order_status_id: initialData.order_status_id,
        estimated_delivery_date: initialData.estimated_delivery_date,
        delivered_at: initialData.delivered_at
          ? initialData.delivered_at.slice(0, 16)
          : null,
        notes: initialData.notes ?? "",
        status: initialData.status,
        details:
          initialData.details?.map((d) => ({
            lens_type_id: d.lens_type_id,
            eye: d.eye,
            sale_detail_id: d.sale_detail_id,
            quantity: d.quantity,
            unit_price: Number(d.unit_price),
            notes: d.notes,
          })) ?? [],
      });
    } else {
      const company = isSuperAdmin
        ? undefined
        : (currentCompanyId ?? undefined);
      setCompanyId(company);
      setForm({ ...empty(), company_id: company });
    }
    setErrors({});
  }, [initialData, isSuperAdmin, currentCompanyId]);

  const selectedSale = useMemo(
    () => sales.find((s) => s.id === form.sale_id),
    [sales, form.sale_id],
  );
  const selectedLensType = useMemo(
    () => lensTypes.find((t) => t.id === detailDraft.lens_type_id),
    [lensTypes, detailDraft.lens_type_id],
  );

  useEffect(() => {
    if (!selectedSale) return;
    if (selectedSale.patient_id && selectedSale.patient_id !== form.patient_id)
      setForm((prev) => ({ ...prev, patient_id: selectedSale.patient_id }));
    if (
      isSuperAdmin &&
      selectedSale.company_id &&
      selectedSale.company_id !== companyId
    )
      setCompanyId(selectedSale.company_id);
  }, [selectedSale, form.patient_id, isSuperAdmin, companyId]);

  useEffect(() => {
    if (selectedLensType && detailDraft.unit_price === 0)
      setDetailDraft((prev) => ({
        ...prev,
        unit_price: Number(selectedLensType.base_price ?? 0),
      }));
  }, [selectedLensType, detailDraft.unit_price]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[String(key)])
      setErrors((prev) => ({ ...prev, [String(key)]: "" }));
  };
  const addDetail = () => {
    if (!detailDraft.lens_type_id)
      return setErrors((prev) => ({
        ...prev,
        details: "Seleccione el tipo de luna.",
      }));
    if (detailDraft.quantity < 1)
      return setErrors((prev) => ({
        ...prev,
        details: "La cantidad debe ser mayor a 0.",
      }));
    if (detailDraft.unit_price < 0)
      return setErrors((prev) => ({
        ...prev,
        details: "El precio no puede ser negativo.",
      }));
    if (form.details.some((d) => d.eye === detailDraft.eye))
      return setErrors((prev) => ({
        ...prev,
        details: `Ya existe un detalle para ${detailDraft.eye}.`,
      }));
    setForm((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        { ...detailDraft, notes: detailDraft.notes?.trim() || null },
      ],
    }));
    setDetailDraft({
      lens_type_id: 0,
      eye: form.details.some((d) => d.eye === "OD") ? "OI" : "OD",
      quantity: 1,
      unit_price: 0,
      notes: "",
    });
    setErrors((prev) => ({ ...prev, details: "" }));
  };
  const removeDetail = (eye: Eye) =>
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((d) => d.eye !== eye),
    }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (isSuperAdmin && !companyId) next.company_id = "Seleccione una empresa.";
    if (!form.sale_id) next.sale_id = "Seleccione una venta.";
    if (!form.patient_id) next.patient_id = "Seleccione un paciente.";
    if (!form.laboratory_id) next.laboratory_id = "Seleccione un laboratorio.";
    if (!form.order_status_id)
      next.order_status_id = "Seleccione el estado de la orden.";
    if (!form.details.length)
      next.details = "Agregue al menos una luna para la orden.";
    if (form.details.length > 2) next.details = "Solo puede registrar OD y OI.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate())
      onSubmit({
        ...form,
        ...(isSuperAdmin && companyId ? { company_id: companyId } : {}),
      });
  };
  const loadingOptions =
    companiesLoading ||
    salesLoading ||
    patientsLoading ||
    laboratoriesLoading ||
    lensTypesLoading ||
    statusesLoading ||
    prescriptionsLoading;

  return (
    <form className="optical-form optical-form--order" onSubmit={submit}>
      <div className="optical-form__intro">
        <div className="optical-form__intro-icon">
          <MuiSvgIcon size={20}>lucide:clipboard-list</MuiSvgIcon>
        </div>
        <div>
          <h4>Datos de la orden</h4>
          <p>
            Campos alineados con <code>LaboratoryOrder</code> y{" "}
            <code>LaboratoryOrderDetail</code>.
          </p>
        </div>
      </div>
      {isSuperAdmin ? (
        <div className="optical-form__field">
          <label>
            Empresa <span>*</span>
          </label>
          <select
            value={companyId ?? ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setCompanyId(value);
              setForm((prev) => ({
                ...prev,
                sale_id: 0,
                patient_id: 0,
                laboratory_id: 0,
                prescription_id: null,
              }));
            }}
            disabled={companiesLoading || isSubmitting}
          >
            <option value="">Seleccione una empresa</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.ruc}
              </option>
            ))}
          </select>
          {errors.company_id && (
            <span className="optical-form__error">{errors.company_id}</span>
          )}
        </div>
      ) : (
        <div className="optical-form__context">
          <MuiSvgIcon size={17}>lucide:building-2</MuiSvgIcon>
          <span>
            Empresa:{" "}
            <strong>
              {companies.find((c) => c.id === currentCompanyId)?.name ??
                "Empresa del usuario"}
            </strong>
          </span>
          <small>
            Se determina automáticamente por el usuario autenticado.
          </small>
        </div>
      )}
      <div className="optical-form__section-title">
        <MuiSvgIcon size={16}>lucide:link</MuiSvgIcon> Relaciones de la orden
      </div>
      <div className="optical-form__grid optical-form__grid--2">
        <div className="optical-form__field">
          <label>
            Venta <span>*</span>
          </label>
          <select
            value={form.sale_id || ""}
            onChange={(e) => update("sale_id", Number(e.target.value))}
            disabled={loadingOptions || (isSuperAdmin && !companyId)}
            className={errors.sale_id ? "is-error" : ""}
          >
            <option value="">Seleccione una venta</option>
            {sales.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} —{" "}
                {s.document_code || `${s.series ?? ""}-${s.number ?? ""}`} — S/{" "}
                {Number(s.total).toFixed(2)}
              </option>
            ))}
          </select>
          {errors.sale_id && (
            <span className="optical-form__error">{errors.sale_id}</span>
          )}
        </div>
        <div className="optical-form__field">
          <label>
            Paciente <span>*</span>
          </label>
          <select
            value={form.patient_id || ""}
            onChange={(e) => update("patient_id", Number(e.target.value))}
            disabled={loadingOptions || (isSuperAdmin && !companyId)}
            className={errors.patient_id ? "is-error" : ""}
          >
            <option value="">Seleccione un paciente</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name} — {p.document_number}
              </option>
            ))}
          </select>
          {errors.patient_id && (
            <span className="optical-form__error">{errors.patient_id}</span>
          )}
        </div>
        <div className="optical-form__field">
          <label>
            Laboratorio <span>*</span>
          </label>
          <select
            value={form.laboratory_id || ""}
            onChange={(e) => update("laboratory_id", Number(e.target.value))}
            disabled={loadingOptions || (isSuperAdmin && !companyId)}
            className={errors.laboratory_id ? "is-error" : ""}
          >
            <option value="">Seleccione un laboratorio</option>
            {laboratories.map((l) => (
              <option key={l.id} value={l.id}>
                {l.trade_name || l.name}
              </option>
            ))}
          </select>
          {errors.laboratory_id && (
            <span className="optical-form__error">{errors.laboratory_id}</span>
          )}
        </div>
        <div className="optical-form__field">
          <label>
            Receta <small>(opcional)</small>
          </label>
          <select
            value={form.prescription_id ?? ""}
            onChange={(e) =>
              update(
                "prescription_id",
                e.target.value ? Number(e.target.value) : null,
              )
            }
            disabled={loadingOptions || !form.patient_id}
          >
            <option value="">Sin receta</option>
            {prescriptions.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} — {p.prescription_date} — {p.source_type}
              </option>
            ))}
          </select>
        </div>
        <div className="optical-form__field">
          <label>
            Estado de la orden <span>*</span>
          </label>
          <select
            value={form.order_status_id || ""}
            onChange={(e) => update("order_status_id", Number(e.target.value))}
            disabled={loadingOptions}
            className={errors.order_status_id ? "is-error" : ""}
          >
            <option value="">Seleccione un estado</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.order_status_id && (
            <span className="optical-form__error">
              {errors.order_status_id}
            </span>
          )}
        </div>
      </div>
      <div className="optical-form__section-title">
        <MuiSvgIcon size={16}>lucide:eye</MuiSvgIcon> Detalles de lunas
      </div>
      <div className="order-detail-builder">
        <div className="optical-form__grid optical-form__grid--4">
          <div className="optical-form__field">
            <label>Ojo</label>
            <select
              value={detailDraft.eye}
              onChange={(e) =>
                setDetailDraft((prev) => ({
                  ...prev,
                  eye: e.target.value as Eye,
                }))
              }
            >
              <option value="OD">OD — Derecho</option>
              <option value="OI">OI — Izquierdo</option>
            </select>
          </div>
          <div className="optical-form__field">
            <label>Tipo de luna</label>
            <select
              value={detailDraft.lens_type_id || ""}
              onChange={(e) =>
                setDetailDraft((prev) => ({
                  ...prev,
                  lens_type_id: Number(e.target.value),
                }))
              }
              disabled={loadingOptions}
            >
              <option value="">Seleccione</option>
              {lensTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code ? `${t.code} — ` : ""}
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="optical-form__field">
            <label>Cantidad</label>
            <input
              type="number"
              min="1"
              step="1"
              value={detailDraft.quantity}
              onChange={(e) =>
                setDetailDraft((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="optical-form__field">
            <label>Precio unitario</label>
            <div className="optical-form__money-input">
              <span>S/</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={detailDraft.unit_price}
                onChange={(e) =>
                  setDetailDraft((prev) => ({
                    ...prev,
                    unit_price: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="optical-form__field">
          <label>
            Observación del detalle <small>(opcional)</small>
          </label>
          <input
            value={detailDraft.notes ?? ""}
            maxLength={1000}
            placeholder="Indicaciones específicas para esta luna..."
            onChange={(e) =>
              setDetailDraft((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </div>
        <button type="button" className="order-add-detail" onClick={addDetail}>
          <MuiSvgIcon size={17}>lucide:plus</MuiSvgIcon>Agregar detalle
        </button>
        {errors.details && (
          <span className="optical-form__error">{errors.details}</span>
        )}
        <div className="order-details-list">
          {form.details.map((d) => {
            const lens = lensTypes.find((t) => t.id === d.lens_type_id);
            return (
              <div className="order-detail-card" key={d.eye}>
                <div className="order-detail-card__eye">{d.eye}</div>
                <div className="order-detail-card__main">
                  <strong>{lens?.name || `Tipo #${d.lens_type_id}`}</strong>
                  <span>
                    {d.quantity} × S/ {Number(d.unit_price).toFixed(2)}
                  </span>
                  {d.notes && <small>{d.notes}</small>}
                </div>
                <button
                  type="button"
                  onClick={() => removeDetail(d.eye)}
                  title="Quitar"
                >
                  <MuiSvgIcon size={16}>lucide:trash-2</MuiSvgIcon>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="optical-form__optional-toggle"
        onClick={() => setShowOptional((v) => !v)}
      >
        <span>
          <MuiSvgIcon size={16}>lucide:calendar-clock</MuiSvgIcon>Entrega y
          observaciones
        </span>
        <MuiSvgIcon size={16}>
          {showOptional ? "lucide:chevron-up" : "lucide:chevron-down"}
        </MuiSvgIcon>
      </button>
      {showOptional && (
        <div className="optical-form__optional">
          <div className="optical-form__grid optical-form__grid--2">
            <div className="optical-form__field">
              <label>Fecha estimada de entrega</label>
              <input
                type="date"
                value={form.estimated_delivery_date ?? ""}
                onChange={(e) =>
                  update("estimated_delivery_date", e.target.value || null)
                }
              />
            </div>
            <div className="optical-form__field">
              <label>Fecha/hora de entrega real</label>
              <input
                type="datetime-local"
                value={form.delivered_at ?? ""}
                onChange={(e) => update("delivered_at", e.target.value || null)}
              />
            </div>
          </div>
          <div className="optical-form__field">
            <label>Notas</label>
            <textarea
              rows={4}
              maxLength={5000}
              value={form.notes ?? ""}
              placeholder="Indicaciones generales de fabricación, envío o recepción..."
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>
          <label className="optical-form__switch">
            <input
              type="checkbox"
              checked={form.status !== false}
              onChange={(e) => update("status", e.target.checked)}
            />
            <span className="optical-form__switch-track" />
            <span>
              <strong>Registro activo</strong>
              <small>Estado lógico del registro heredado de BaseModel.</small>
            </span>
          </label>
        </div>
      )}
    </form>
  );
};
