import { useState } from "react"
import { useDeleteCompany } from "../hooks/useDeleteCompany"
import { useUpdateCompany } from "../hooks/useUpdateCompany"
import type { Company } from "../types/companies.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface CompanyCardProps {
  company: Company
  onEdit: (company: Company) => void
  onRefresh: () => void
}

export const CompanyCard = ({ company, onEdit, onRefresh }: CompanyCardProps) => {
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany()
  const { mutate: updateCompany } = useUpdateCompany()
  const [isDeletingLocal, setIsDeletingLocal] = useState(false)

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta empresa?")) {
      setIsDeletingLocal(true)
      deleteCompany(company.id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setIsDeletingLocal(false)
        }
      })
    }
  }

  const handleToggleStatus = () => {
    updateCompany({
      id: company.id,
      data: { ...company, status: !company.status }
    }, {
      onSuccess: () => onRefresh()
    })
  }

  return (
    <div className="company-card">
      <div className="company-card__header">
        <div className="company-card__logo">
          {company.logo ? (
            <img src={company.logo} alt={company.name} />
          ) : (
            <MuiSvgIcon size={32}>heroicons-outline:building-office</MuiSvgIcon>
          )}
        </div>
        <div className="company-card__status">
          <span className={`company-card__status-badge ${company.status ? 'company-card__status-badge--active' : 'company-card__status-badge--inactive'}`}>
            {company.status ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      <div className="company-card__body">
        <h3 className="company-card__name">{company.name}</h3>
        <div className="company-card__ruc">RUC: {company.ruc}</div>
        
        {company.email && (
          <div className="company-card__contact">
            <MuiSvgIcon size={16}>lucide:mail</MuiSvgIcon>
            <span>{company.email}</span>
          </div>
        )}
        
        <div className="company-card__contact">
          <MuiSvgIcon size={16}>lucide:phone</MuiSvgIcon>
          <span>{company.phone}</span>
        </div>

        {company.address && (
          <div className="company-card__address">
            <MuiSvgIcon size={16}>lucide:map-pin</MuiSvgIcon>
            <span>{company.address}</span>
          </div>
        )}

        <div className="company-card__einvoice">
          <MuiSvgIcon size={16}>lucide:file-text</MuiSvgIcon>
          <span>Facturación Electrónica:</span>
          <span className={`company-card__einvoice-status ${company.einvoice_username ? 'company-card__einvoice-status--configured' : 'company-card__einvoice-status--pending'}`}>
            {company.einvoice_username ? 'Configurado' : 'No configurado'}
          </span>
        </div>
      </div>

      <div className="company-card__footer">
        <button 
          className="company-card__btn company-card__btn--edit"
          onClick={() => onEdit(company)}
        >
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
          Editar
        </button>
        <button 
          className={`company-card__btn company-card__btn--${company.status ? 'disable' : 'enable'}`}
          onClick={handleToggleStatus}
        >
          <MuiSvgIcon size={18}>
            {company.status ? 'lucide:eye-off' : 'lucide:eye'}
          </MuiSvgIcon>
          {company.status ? 'Desactivar' : 'Activar'}
        </button>
        <button 
          className="company-card__btn company-card__btn--delete"
          onClick={handleDelete}
          disabled={isDeletingLocal}
        >
          {isDeletingLocal ? (
            <span className="company-card__spinner"></span>
          ) : (
            <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
          )}
          Eliminar
        </button>
      </div>
    </div>
  )
}