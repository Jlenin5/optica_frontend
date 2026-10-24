import { useDebounce } from "@/hooks/useDebounce"
import { useMemo, useState } from "react"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import AutocompleteInput from "@/components/ui/AutocompleteInput"
import "@styles/modules/autocomplete-input.scss"
import { AppModal } from "@/components/ui/modal"
import { useServices } from "@/modules/commercial/services/hooks"
import type { Service } from "@/modules/commercial/services/types/services.types"
import type { CreateSaleDetailDTO } from "../../types/sales.types"
import { useAuthStore } from "@/app/store/auth.store"

interface SelectedServiceItem extends Partial<CreateSaleDetailDTO> {
  service?: Service
}

interface ModalSelectServiceProps {
  title?: string
  searchPlaceholder?: string
  emptyLabel?: string
  onClose: () => void
  onAdd: (item: CreateSaleDetailDTO, service: Service) => void
}

export default function ModalSelectService({
  title = "Agregar Servicio",
  searchPlaceholder = "Buscar servicio por nombre o código...",
  emptyLabel = "No se encontraron servicios registrados",
  onClose,
  onAdd
}: ModalSelectServiceProps) {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selected, setSelected] = useState<SelectedServiceItem>({
    quantity: 1,
    discount: 0,
    discount_method: true
  })
  const { currentCompanyId, isSuperAdmin } = useAuthStore()

  const { data: servicesData, isLoading } = useServices({
    search: debouncedSearch || undefined,
    status: true,
    ...(!isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}),
    limit: 50,
  })
  const services = servicesData?.results || []

  const quantity = selected.quantity || 1
  const price = selected.price ?? 0
  const discountMethod = selected.discount_method ?? true
  const discountValue = selected.discount || 0
  const subtotal = quantity * price
  const total = discountMethod
    ? subtotal * (1 - discountValue / 100)
    : Math.max(0, subtotal - discountValue)

  const canAdd = !!selected.service_id && price >= 0 && quantity > 0

  const handleAdd = () => {
    if (!canAdd || !selected.service) return
    onAdd({
      item_type: 'catalog',
      product_id: null,
      service_id: selected.service_id,
      quantity,
      price,
      discount_method: discountMethod,
      discount: discountValue,
      subtotal,
      total
    }, selected.service)
  }

  const selectedLabel = useMemo(() => selected.service?.name ?? null, [selected.service])

  return (
    <AppModal
      title={title}
      description="Elige un servicio del catálogo e indica cantidad y descuento."
      onClose={onClose}
      size="lg"
      footer={
        <div className="sale-form-modal__foot-inner">
          <div className="sale-form-modal__total-chip">
            <span>Total</span>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>
          <div className="sale-form-modal__acts">
            <button type="button" className="sale-form-modal__btn sale-form-modal__btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="sale-form-modal__btn sale-form-modal__btn--primary"
              onClick={handleAdd}
              disabled={!canAdd}
            >
              <MuiSvgIcon size={16}>lucide:plus</MuiSvgIcon>
              Agregar a la venta
            </button>
          </div>
        </div>
      }
    >
      <div className="sale-form-modal">
        <div className="sale-form-modal__field">
          <label>Servicio</label>
          <AutocompleteInput
            value={selected.service?.name || search}
            options={services}
            mode="input-register"
            placeholder={searchPlaceholder}
            noOptionsText={emptyLabel}
            loading={isLoading}
            getOptionValue={(service) => service.id}
            getOptionLabel={(service) => service.name}
            filterOption={(service, input) =>
              `${service.name} ${service.code || ""} ${service.description || ""}`.toLowerCase().includes(input)
            }
            onChange={(value) => {
              setSearch(value)
              if (selected.service && value !== selected.service.name) {
                setSelected(prev => ({ ...prev, service_id: undefined, service: undefined, price: 0 }))
              }
            }}
            onSelect={(service) => setSelected(prev => ({
              ...prev,
              service_id: service.id,
              service,
              price: Number(service.base_price) || 0
            }))}
            renderOption={(service) => (
              <div>
                <strong>{service.name}</strong>
                <small style={{ display: "block", opacity: 0.7 }}>
                  {service.code ? `Cód. ${service.code}` : "Sin código"} · S/ {Number(service.base_price).toFixed(2)}
                </small>
              </div>
            )}
          />
        </div>

        {selectedLabel && (
          <div className="sale-form-modal__selected-banner">
            <MuiSvgIcon size={16}>lucide:check-circle-2</MuiSvgIcon>
            Seleccionado: <strong>{selectedLabel}</strong>
          </div>
        )}

        <div className="sale-form-modal__grid">
          <div className="sale-form-modal__field">
            <label>Cantidad</label>
            <input
              type="number"
              step="1"
              min="1"
              value={quantity}
              onChange={(e) => setSelected(prev => ({
                ...prev,
                quantity: Math.max(1, parseFloat(e.target.value) || 1)
              }))}
            />
          </div>
          <div className="sale-form-modal__field">
            <label>Precio unitario</label>
            <div className="sale-form-modal__input-prefix">
              <span>S/</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setSelected(prev => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0
                }))}
              />
            </div>
          </div>
          <div className="sale-form-modal__field">
            <label>Descuento</label>
            <div className="sale-form-modal__discount">
              <input
                type="number"
                step="0.01"
                min="0"
                value={discountValue}
                onChange={(e) => setSelected(prev => ({
                  ...prev,
                  discount: parseFloat(e.target.value) || 0
                }))}
              />
              <select
                value={discountMethod ? "percentage" : "fixed"}
                onChange={(e) => setSelected(prev => ({
                  ...prev,
                  discount_method: e.target.value === "percentage"
                }))}
              >
                <option value="percentage">%</option>
                <option value="fixed">S/</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  )
}
