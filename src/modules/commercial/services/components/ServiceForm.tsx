import { useEffect, useMemo, useState } from "react";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies";
import { useAuthStore } from "@/app/store/auth.store";
import type { Service, ServiceDTO } from "../types/services.types";

interface Props {
  initialData?: Service | null;
  onSubmit: (data: ServiceDTO) => void;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
}
const emptyForm = (): ServiceDTO => ({
  code: "",
  name: "",
  description: "",
  base_price: 0,
  status: true,
});

export const ServiceForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
  isSubmitting = false,
}: Props) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore();
  const [form, setForm] = useState<ServiceDTO>(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOptional, setShowOptional] = useState(true);
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({
    status: true,
    limit: 100,
  });
  
  const companies = companiesData?.results ?? [];

  useEffect(() => {
    if (initialData)
      setForm({
        company_id: initialData.company_id,
        code: initialData.code,
        name: initialData.name,
        description: initialData.description ?? "",
        base_price: Number(initialData.base_price),
        status: initialData.status,
      });
    else
      setForm({
        ...emptyForm(),
        company_id: isSuperAdmin ? undefined : (currentCompanyId ?? undefined),
      });
    setErrors({});
  }, [initialData, currentCompanyId, isSuperAdmin]);

  const selectedCompanyName = useMemo(
    () =>
      companies.find(
        (c) => c.id === (form.company_id ?? initialData?.company_id),
      )?.name ?? "Empresa actual",
    [companies, form.company_id, initialData?.company_id],
  );
  const update = <K extends keyof ServiceDTO>(key: K, value: ServiceDTO[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[String(key)])
      setErrors((prev) => ({ ...prev, [String(key)]: "" }));
  };
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.code.trim()) next.code = "El código es requerido.";
    else if (form.code.length > 50) next.code = "Máximo 50 caracteres.";
    if (!form.name.trim()) next.name = "El nombre es requerido.";
    else if (form.name.length > 150) next.name = "Máximo 150 caracteres.";
    if (form.base_price < 0 || Number.isNaN(form.base_price))
      next.base_price = "Ingrese un precio válido.";
    if (isSuperAdmin && !form.company_id)
      next.company_id = "Seleccione una empresa.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description?.trim() || null,
      base_price: Number(form.base_price),
      status: form.status,
      ...(isSuperAdmin && form.company_id
        ? { company_id: form.company_id }
        : {}),
    });
  };

  return (
    <form className="optical-form" onSubmit={handleSubmit}>
      <div className="optical-form__intro">
        <div className="optical-form__intro-icon">
          <MuiSvgIcon size={20}>lucide:concierge-bell</MuiSvgIcon>
        </div>
        <div>
          <h4>Información del servicio</h4>
          <p>
            Complete los campos definidos por el modelo <code>Service</code>.
          </p>
        </div>
      </div>
      {isSuperAdmin ? (
        <div className="optical-form__field">
          <label htmlFor="service-company">
            Empresa <span>*</span>
          </label>
          <select
            id="service-company"
            value={form.company_id ?? ""}
            onChange={(e) =>
              update(
                "company_id",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            disabled={companiesLoading || isSubmitting}
            className={errors.company_id ? "is-error" : ""}
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
            Empresa: <strong>{selectedCompanyName}</strong>
          </span>
          <small>
            Se determina automáticamente por el usuario autenticado.
          </small>
        </div>
      )}
      <div className="optical-form__grid optical-form__grid--2">
        <div className="optical-form__field">
          <label htmlFor="service-code">
            Código <span>*</span>
          </label>
          <input
            id="service-code"
            value={form.code}
            maxLength={50}
            placeholder="Ej. SERV-001"
            onChange={(e) => update("code", e.target.value.toUpperCase())}
            className={errors.code ? "is-error" : ""}
          />
          {errors.code && (
            <span className="optical-form__error">{errors.code}</span>
          )}
        </div>
        <div className="optical-form__field">
          <label htmlFor="service-name">
            Nombre <span>*</span>
          </label>
          <input
            id="service-name"
            value={form.name}
            maxLength={150}
            placeholder="Ej. Medición de vista"
            onChange={(e) => update("name", e.target.value)}
            className={errors.name ? "is-error" : ""}
          />
          {errors.name && (
            <span className="optical-form__error">{errors.name}</span>
          )}
        </div>
      </div>
      <div className="optical-form__field">
        <label htmlFor="service-price">
          Precio base <span>*</span>
        </label>
        <div className="optical-form__money-input">
          <span>S/</span>
          <input
            id="service-price"
            type="number"
            min="0"
            step="0.01"
            value={form.base_price}
            onChange={(e) => update("base_price", Number(e.target.value))}
            className={errors.base_price ? "is-error" : ""}
          />
        </div>
        {errors.base_price && (
          <span className="optical-form__error">{errors.base_price}</span>
        )}
      </div>
      <button
        type="button"
        className="optical-form__optional-toggle"
        onClick={() => setShowOptional((v) => !v)}
      >
        <span>
          <MuiSvgIcon size={16}>lucide:sliders-horizontal</MuiSvgIcon>Campos
          opcionales
        </span>
        <MuiSvgIcon size={16}>
          {showOptional ? "lucide:chevron-up" : "lucide:chevron-down"}
        </MuiSvgIcon>
      </button>
      {showOptional && (
        <div className="optical-form__optional">
          <div className="optical-form__field">
            <label htmlFor="service-description">Descripción</label>
            <textarea
              id="service-description"
              rows={4}
              maxLength={5000}
              value={form.description ?? ""}
              placeholder="Detalle del servicio..."
              onChange={(e) => update("description", e.target.value)}
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
              <small>Disponible para utilizarse en las ventas.</small>
            </span>
          </label>
        </div>
      )}
    </form>
  );
};
