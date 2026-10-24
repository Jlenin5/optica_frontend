import { useDebounce } from "@/hooks/useDebounce"
import { useMemo, useState } from "react"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import AutocompleteInput from "@/components/ui/AutocompleteInput"
import "@styles/modules/autocomplete-input.scss"
import { AppModal } from "@/components/ui/modal"
import { useLaboratories } from "@/modules/laboratory/laboratories/hooks"
import {
  useLensTypes,
  useLensFeatures,
} from "@/modules/laboratory/lens_types/hooks"
import { usePatientPrescriptions } from "@/modules/clinical/prescriptions/hooks/usePatientPrescriptions"
import { createPrescription } from "@/modules/clinical/prescriptions/api/prescriptions.api"
import type { CreateSaleDetailDTO } from "../../types/sales.types"
import { unwrapResults } from "@/modules/laboratory/common"

export interface LensSaleDraft {
  detail: CreateSaleDetailDTO
  laboratory_id: number
  prescription_id: number
  eyes: ("OD" | "OI")[]
  lens_type_id: number
  laboratory_name: string
  lens_type_name: string
}

export default function LensSelectionModal({
  patientId,
  onClose,
  onAdd,
}: {
  patientId: number | null
  onClose: () => void
  onAdd: (draft: LensSaleDraft) => void
}) {
  const [lab, setLab] = useState<number>()
  const [lens, setLens] = useState<number>()
  const [prescription, setPrescription] = useState<number>()
  const [eyes, setEyes] = useState<("OD" | "OI")[]>(["OD", "OI"])
  const [lensSearch, setLensSearch] = useState("")
  const [selectedLabName, setSelectedLabName] = useState("")
  const [selectedLensName, setSelectedLensName] = useState("")
  const [selectedPrescriptionLabel, setSelectedPrescriptionLabel] = useState("")
  const debouncedSearch = useDebounce(lensSearch, 350)
  const [creatingRx, setCreatingRx] = useState(false)

  const labs = useLaboratories()
  const types = useLensTypes({ search: debouncedSearch })
  const features = useLensFeatures()
  const prescriptions = usePatientPrescriptions(patientId || 0)

  const laboratories = unwrapResults(
    labs.data?.pages?.flatMap((p: any) => p.results) ?? [],
  )
  const lensTypes = unwrapResults(types.data ?? [])
  const lensFeatures = unwrapResults(features.data ?? [])
  const selectedType = lensTypes.find((x: any) => x.id === lens)
  const selectedPrescription = prescriptions.data?.find(
    (x) => x.id === prescription,
  )
  const price = Number(selectedType?.base_price || 0)
  const valid =
    !!patientId && !!lab && !!lens && !!prescription && eyes.length > 0
  const total = price * eyes.length

  const grouped = useMemo(() => {
    const m = new Map<string, any[]>()
    lensFeatures.forEach((f: any) => {
      if (!m.has(f.type)) m.set(f.type, [])
      m.get(f.type)!.push(f)
    })
    return m
  }, [lensFeatures])

  const featureTypeLabels: Record<string, string> = {
    FOCUS: "Enfoque",
    MATERIAL: "Material",
    SERVICE: "Servicio",
    TREATMENT: "Tratamiento",
    INDEX: "Índice",
    FILTER: "Filtro",
    OTHER: "Otros",
  }

  const add = () => {
    if (!valid || !selectedType || !selectedPrescription) return
    const subtotal = total
    onAdd({
      detail: {
        item_type: "catalog",
        product_id: null,
        lens_type_id: lens,
        prescription_id: prescription,
        laboratory_id: lab,
        eyes,
        quantity: eyes.length,
        price,
        discount_method: true,
        discount: 0,
        subtotal,
        total: subtotal,
      },
      laboratory_id: lab!,
      prescription_id: prescription!,
      eyes,
      lens_type_id: lens!,
      laboratory_name: laboratories.find((x: any) => x.id === lab)?.name || "",
      lens_type_name: selectedType.name,
    })
  }

  const handleCreateExternalRx = async () => {
    if (!patientId || creatingRx) return
    try {
      setCreatingRx(true)
      const p = await createPrescription({
        patient_id: patientId,
        source_type: "EXTERNAL",
        prescription_date: new Date().toISOString().slice(0, 10),
        status: true,
      })
      setPrescription(p.id)
      prescriptions.refetch()
    } finally {
      setCreatingRx(false)
    }
  }

  return (
    <AppModal
      title="Seleccionar lunas"
      description="Configura laboratorio, tipo de luna, receta y ojos a fabricar."
      onClose={onClose}
      size="lg"
      footer={
        <div className="sale-form-modal__foot-inner">
          <div className="sale-form-modal__total-chip sale-form-modal__total-chip--lens">
            <span>
              {eyes.length} ojo{eyes.length !== 1 ? "s" : ""} · S/ {price.toFixed(2)} c/u
            </span>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>
          <div className="sale-form-modal__acts">
            <button type="button" className="sale-form-modal__btn sale-form-modal__btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="sale-form-modal__btn sale-form-modal__btn--primary"
              disabled={!valid}
              onClick={add}
            >
              <MuiSvgIcon size={16}>lucide:plus</MuiSvgIcon>
              Agregar a la venta
            </button>
          </div>
        </div>
      }
    >
      <div className="sale-form-modal sale-form-modal--lens">
        {!patientId && (
          <div className="sale-form-modal__error">
            <MuiSvgIcon size={16}>lucide:alert-circle</MuiSvgIcon>
            Seleccione un paciente antes de agregar lunas.
          </div>
        )}

        <div className="sale-form-modal__section-title">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          Laboratorio y tipo de luna
        </div>

        <div className="sale-form-modal__grid sale-form-modal__grid--2">
          <div className="sale-form-modal__field">
            <label>Laboratorio</label>
            <AutocompleteInput
              value={selectedLabName}
              options={laboratories}
              mode="input-register"
              placeholder="Buscar o seleccionar laboratorio..."
              noOptionsText="No se encontraron laboratorios"
              getOptionValue={(laboratory: any) => laboratory.id}
              getOptionLabel={(laboratory: any) => laboratory.name}
              filterOption={(laboratory: any, input) =>
                `${laboratory.name} ${laboratory.trade_name || ""} ${laboratory.tax_id || ""}`.toLowerCase().includes(input)
              }
              onChange={(value) => {
                setSelectedLabName(value)
                if (!value) setLab(undefined)
              }}
              onSelect={(laboratory: any) => {
                setLab(laboratory.id)
                setSelectedLabName(laboratory.name)
              }}
              renderOption={(laboratory: any) => (
                <div>
                  <strong>{laboratory.name}</strong>
                  {laboratory.trade_name && (
                    <small style={{ display: "block", opacity: 0.7 }}>{laboratory.trade_name}</small>
                  )}
                </div>
              )}
            />
          </div>

          <div className="sale-form-modal__field">
            <label>Tipo de luna</label>
            <AutocompleteInput
              value={selectedLensName || lensSearch}
              options={lensTypes}
              mode="input-register"
              placeholder="Buscar por nombre o código..."
              noOptionsText="No hay tipos de luna registrados"
              loading={types.isLoading}
              getOptionValue={(lensType: any) => lensType.id}
              getOptionLabel={(lensType: any) => lensType.name}
              filterOption={(lensType: any, input) =>
                `${lensType.name} ${lensType.code || ""} ${lensType.description || ""}`.toLowerCase().includes(input)
              }
              onChange={(value) => {
                setLensSearch(value)
                setSelectedLensName(value)
                if (lens && selectedType && value !== selectedType.name) setLens(undefined)
              }}
              onSelect={(lensType: any) => {
                setLens(lensType.id)
                setSelectedLensName(lensType.name)
                setLensSearch(lensType.name)
              }}
              renderOption={(lensType: any) => (
                <div>
                  <strong>{lensType.name}</strong>
                  <small style={{ display: "block", opacity: 0.7 }}>
                    {lensType.code ? `Cód. ${lensType.code}` : "Sin código"} · S/ {Number(lensType.base_price).toFixed(2)}
                  </small>
                </div>
              )}
            />
          </div>
        </div>

        {selectedType && grouped.size > 0 && (
          <div className="sale-form-modal__features">
            <div className="sale-form-modal__section-title">
              <MuiSvgIcon size={16}>lucide:layers</MuiSvgIcon>
              Características incluidas
            </div>
            <div className="sale-form-modal__feature-grid">
              {Array.from(grouped.entries()).map(([type, feats]) => {
                const included = feats.filter((f: any) =>
                  selectedType.features?.some((sf: any) => sf.id === f.id),
                )
                if (!included.length) return null
                return (
                  <div key={type} className="sale-form-modal__feature-group">
                    <span className="sale-form-modal__feature-type">
                      {featureTypeLabels[type] || type}
                    </span>
                    <span className="sale-form-modal__feature-names">
                      {included.map((f: any) => f.name).join(", ")}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="sale-form-modal__section-title">
          <MuiSvgIcon size={16}>lucide:file-text</MuiSvgIcon>
          Receta y ojos
        </div>

        <div className="sale-form-modal__grid sale-form-modal__grid--2">
          <div className="sale-form-modal__field">
            <label>Receta del paciente</label>
            <AutocompleteInput
              value={selectedPrescriptionLabel}
              options={prescriptions.data || []}
              mode="input-register"
              placeholder="Buscar o seleccionar receta..."
              noOptionsText="No hay recetas para este paciente"
              disabled={!patientId}
              getOptionValue={(item) => item.id}
              getOptionLabel={(item) => `#${item.id} — ${item.prescription_date} — ${item.source_type === "EXTERNAL" ? "Externa" : "Interna"}`}
              filterOption={(item, input) =>
                `#${item.id} ${item.prescription_date} ${item.source_type === "EXTERNAL" ? "externa" : "interna"}`.toLowerCase().includes(input)
              }
              onChange={(value) => {
                setSelectedPrescriptionLabel(value)
                if (!value) setPrescription(undefined)
              }}
              onSelect={(item) => {
                setPrescription(item.id)
                setSelectedPrescriptionLabel(`#${item.id} — ${item.prescription_date} — ${item.source_type === "EXTERNAL" ? "Externa" : "Interna"}`)
              }}
            />
            {patientId &&
              (!prescriptions.data || prescriptions.data.length === 0) && (
                <button
                  type="button"
                  className="sale-form-modal__link-btn"
                  onClick={handleCreateExternalRx}
                  disabled={creatingRx}
                >
                  <MuiSvgIcon size={14}>lucide:plus</MuiSvgIcon>
                  {creatingRx ? "Creando..." : "Crear receta externa"}
                </button>
              )}
          </div>

          <div className="sale-form-modal__field">
            <label>Ojos a fabricar</label>
            <div className="sale-form-modal__eye-options">
              {(["OD", "OI"] as const).map((eye) => {
                const active = eyes.includes(eye)
                return (
                  <button
                    type="button"
                    key={eye}
                    className={`sale-form-modal__eye-chip ${active ? "is-active" : ""}`}
                    onClick={() =>
                      setEyes(
                        active
                          ? eyes.filter((x) => x !== eye)
                          : [...eyes, eye],
                      )
                    }
                  >
                    <MuiSvgIcon size={14}>
                      {active ? "lucide:check" : "lucide:circle"}
                    </MuiSvgIcon>
                    {eye === "OD" ? "Ojo derecho (OD)" : "Ojo izquierdo (OI)"}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  )
}
