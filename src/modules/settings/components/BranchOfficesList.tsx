import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import { useCreateBranchOffice, useUpdateBranchOffice, useDeleteBranchOffice } from "../hooks/useUpdateSettings"
import type { BranchOfficeSettings } from "../types/settings.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface BranchOfficesListProps {
  branchOffices: BranchOfficeSettings[]
}

export const BranchOfficesList = ({ branchOffices }: BranchOfficesListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffice, setEditingOffice] = useState<BranchOfficeSettings | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    is_main: false
  })

  const { mutate: createOffice, isPending: isCreating } = useCreateBranchOffice()
  const { mutate: updateOffice, isPending: isUpdating } = useUpdateBranchOffice()
  const { mutate: deleteOffice, isPending: isDeleting } = useDeleteBranchOffice()

  const handleOpenModal = (office?: BranchOfficeSettings) => {
    if (office) {
      setEditingOffice(office)
      setFormData({
        name: office.name,
        address: office.address || '',
        phone: office.phone || '',
        is_main: office.is_main
      })
    } else {
      setEditingOffice(null)
      setFormData({
        name: '',
        address: '',
        phone: '',
        is_main: false
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingOffice(null)
    setFormData({
      name: '',
      address: '',
      phone: '',
      is_main: false
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingOffice) {
      updateOffice({ id: editingOffice.id, data: formData }, {
        onSuccess: () => handleCloseModal()
      })
    } else {
      createOffice(formData, {
        onSuccess: () => handleCloseModal()
      })
    }
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta sucursal?")) {
      deleteOffice(id)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const mainOffice = branchOffices.find(office => office.is_main)
  const otherOffices = branchOffices.filter(office => !office.is_main)

  return (
    <div className="branch-offices">
      <div className="branch-offices__header">
        <h3 className="branch-offices__title">
          <MuiSvgIcon size={20}>lucide:map-pin</MuiSvgIcon>
          Sucursales
        </h3>
        <button className="branch-offices__add-btn" onClick={() => handleOpenModal()}>
          <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
          Nueva Sucursal
        </button>
      </div>

      {/* Sucursal Principal */}
      {mainOffice && (
        <div className="branch-offices__card branch-offices__card--main">
          <div className="branch-offices__card-header">
            <div className="branch-offices__card-badge">
              <MuiSvgIcon size={16}>lucide:crown</MuiSvgIcon>
              Principal
            </div>
            <div className="branch-offices__card-actions">
              <button className="branch-offices__edit-btn" onClick={() => handleOpenModal(mainOffice)}>
                <MuiSvgIcon size={18}>lucide:edit</MuiSvgIcon>
              </button>
              <button className="branch-offices__delete-btn" onClick={() => handleDelete(mainOffice.id)} disabled={isDeleting}>
                <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
              </button>
            </div>
          </div>
          <div className="branch-offices__card-content">
            <h4 className="branch-offices__card-name">{mainOffice.name}</h4>
            {mainOffice.phone && (
              <p className="branch-offices__card-phone">
                <MuiSvgIcon size={14}>lucide:phone</MuiSvgIcon>
                {mainOffice.phone}
              </p>
            )}
            {mainOffice.address && (
              <p className="branch-offices__card-address">
                <MuiSvgIcon size={14}>lucide:map-pin</MuiSvgIcon>
                {mainOffice.address}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Otras Sucursales */}
      {otherOffices.length > 0 && (
        <div className="branch-offices__list">
          <h4 className="branch-offices__subtitle">Otras Sucursales</h4>
          {otherOffices.map(office => (
            <div key={office.id} className="branch-offices__card">
              <div className="branch-offices__card-header">
                <div className="branch-offices__card-actions">
                  <button className="branch-offices__edit-btn" onClick={() => handleOpenModal(office)}>
                    <MuiSvgIcon size={18}>
                      heroicons-outline:pencil-square
                    </MuiSvgIcon>
                  </button>
                  <button className="branch-offices__delete-btn" onClick={() => handleDelete(office.id)} disabled={isDeleting}>
                    <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                  </button>
                </div>
              </div>
              <div className="branch-offices__card-content">
                <h4 className="branch-offices__card-name">{office.name}</h4>
                {office.phone && (
                  <p className="branch-offices__card-phone">
                    <MuiSvgIcon size={14}>lucide:phone</MuiSvgIcon>
                    {office.phone}
                  </p>
                )}
                {office.address && (
                  <p className="branch-offices__card-address">
                    <MuiSvgIcon size={14}>lucide:map-pin</MuiSvgIcon>
                    {office.address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <AppModal title={editingOffice ? 'Editar Sucursal' : 'Nueva Sucursal'} onClose={handleCloseModal} size="md">
            <form onSubmit={handleSubmit} className="branch-offices-modal__form">
              <div className="branch-offices-modal__field">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="branch-offices-modal__field">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="branch-offices-modal__field">
                <label>Dirección</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <label className="branch-offices-modal__checkbox">
                <input
                  type="checkbox"
                  name="is_main"
                  checked={formData.is_main}
                  onChange={handleChange}
                  disabled={!!mainOffice && !editingOffice}
                />
                <span>Establecer como sucursal principal</span>
              </label>
              {!!mainOffice && !editingOffice && (
                <p className="branch-offices-modal__helper">
                  Ya existe una sucursal principal. Solo puede haber una.
                </p>
              )}
              <div className="branch-offices-modal__actions">
                <button type="button" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
        </AppModal>
      )}
    </div>
  )
}
