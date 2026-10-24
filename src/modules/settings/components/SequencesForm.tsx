import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import {
  useSequences,
  useCreateSequence,
  useUpdateSequence,
  useDeleteSequence,
} from "../hooks/useSequences"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import type { Sequence } from "../types/settings.types"
import { useReceipts } from "@/modules/documents/receipts/hooks/useReceipts"
import { useAuthStore } from "@/app/store/auth.store"
import { useBranchOffices } from "@/modules/organizations/branch-offices/hooks/useBranchOffices"

const BRANCH_OPTIONS = [
  { id: 1, name: "Sucursal Principal" },
  // ... más sucursales
]

export const SequencesForm = () => {
  const { currentCompanyId } = useAuthStore()
  const { data: sequences, isLoading } = useSequences()
  const { data: receiptsData } = useReceipts({ status: true })
  const { data: branchOfficesData } = useBranchOffices({ status: true })
  const createMutation = useCreateSequence()
  const updateMutation = useUpdateSequence()
  const deleteMutation = useDeleteSequence()

  const receipts = receiptsData?.pages.flatMap(page => page.results) || []
  const branchOffices = branchOfficesData?.pages.flatMap(page => page.results) || []

  // Estado para controlar el formulario (edición o creación)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    company: currentCompanyId,
    receipt_id: "",
    serie: "",
    value: 0,
    padding: 8,
    branch_office: "",
  })

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      company: currentCompanyId,
      receipt_id: "",
      serie: "",
      value: 0,
      padding: 8,
      branch_office: "",
    })
  }

  const closeModal = () => {
    resetForm()
    setIsModalOpen(false)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      company: currentCompanyId,
      receipt_id: Number(formData.receipt_id),
      serie: formData.serie.trim().toUpperCase(),
      value: Number(formData.value),
      padding: Number(formData.padding),
      branch_office: formData.branch_office ? Number(formData.branch_office) : null,
    }

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        { onSuccess: closeModal }
      )
    } else {
      createMutation.mutate(payload, { onSuccess: closeModal })
    }
  }

  const handleEdit = (seq: Sequence) => {
    setEditingId(seq.id)
    setFormData({
      company: currentCompanyId,
      receipt_id: String(seq.receipt_id),
      serie: seq.serie,
      value: seq.value,
      padding: seq.padding,
      branch_office: seq.branch_office ? String(seq.branch_office) : "",
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm("¿Eliminar esta secuencia?")) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <div>Cargando secuencias...</div>

  return (
    <div className="settings-form">
      <div className="settings-form__section">
        <div className="settings-form__header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="settings-form__section-title" style={{ marginBottom: 0 }}>
            <MuiSvgIcon size={20}>lucide:layers</MuiSvgIcon>
            Secuencias de Comprobantes
          </h3>
          <button
            className="btn-primary"
            onClick={openCreateModal}
          >
            <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
            Agregar
          </button>
        </div>
        <p className="settings-form__description">
          Administra la numeración automática para cada tipo de comprobante y serie.
        </p>

        {/* Lista de secuencias existentes */}
        <div className="settings-form__table-wrapper">
          <table className="settings-form__table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Serie</th>
                <th>Último Número</th>
                <th>Padding</th>
                <th>Sucursal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sequences?.results?.map((seq: Sequence) => (
                <tr key={seq.id}>
                  <td>{seq?.receipt?.description || ''}</td>
                  <td>{seq.serie}</td>
                  <td>{seq.value}</td>
                  <td>{seq.padding}</td>
                  <td>
                    {seq.branch_office
                      ? BRANCH_OPTIONS.find((b) => b.id === seq.branch_office)
                          ?.name || seq.branch_office
                      : "Global"}
                  </td>
                  <td>
                    <button
                      className="settings-form__btn settings-form__btn--icon"
                      onClick={() => handleEdit(seq)}
                    >
                      <MuiSvgIcon size={18}>heroicons-outline:pencil-square</MuiSvgIcon>
                    </button>
                    <button
                      className="settings-form__btn settings-form__btn--icon settings-form__btn--danger"
                      onClick={() => handleDelete(seq.id)}
                    >
                      <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar/editar secuencia */}
      {isModalOpen && (
        <AppModal title={editingId ? "Editar Secuencia" : "Nueva Secuencia"} onClose={closeModal} size="lg">
            <form onSubmit={handleSubmit} className="branch-offices-modal__form">
              <div className="settings-form__grid">
                <div className="settings-form__field">
                  <label>Tipo de comprobante</label>
                  <select
                    name="receipt"
                    value={formData.receipt_id}
                    onChange={(e) =>
                      setFormData({ ...formData, receipt_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar</option>
                    {receipts.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="settings-form__field">
                  <label>Serie</label>
                  <input
                    type="text"
                    name="serie"
                    value={formData.serie}
                    onChange={(e) =>
                      setFormData({ ...formData, serie: e.target.value })
                    }
                    placeholder="Ej: F001"
                    required
                  />
                </div>

                <div className="settings-form__field">
                  <label>Último número usado</label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: Number(e.target.value) })
                    }
                    min={0}
                    required
                  />
                </div>

                <div className="settings-form__field">
                  <label>Padding (dígitos)</label>
                  <input
                    type="number"
                    name="padding"
                    value={formData.padding}
                    onChange={(e) =>
                      setFormData({ ...formData, padding: Number(e.target.value) })
                    }
                    min={1}
                    max={10}
                    required
                  />
                </div>

                <div className="settings-form__field settings-form__field--full">
                  <label>Sucursal (opcional)</label>
                  <select
                    name="branch_office"
                    value={formData.branch_office}
                    onChange={(e) =>
                      setFormData({ ...formData, branch_office: e.target.value })
                    }
                  >
                    <option value="">Global (sin sucursal)</option>
                    {branchOffices.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="branch-offices-modal__actions">
                <button type="button" onClick={closeModal}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          
        </AppModal>
      )}
    </div>
  )
}
