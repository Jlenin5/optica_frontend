import { useState } from "react"
import { useDeleteCompany } from "../hooks/useDeleteCompany"
import { useUpdateCompany } from "../hooks/useUpdateCompany"
import MuiSvgIcon from '@components/MuiSvgIcon'
import type { Company } from "../types/companies.types"

interface CompanyTableProps {
  data: Company[]
  onEdit: (company: Company) => void
  onRefresh: () => void
}

export const CompanyTable = ({ data = [], onEdit, onRefresh }: CompanyTableProps) => {
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany()
  const { mutate: updateCompany } = useUpdateCompany()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta empresa?")) {
      setDeletingId(id)
      deleteCompany(id, {
        onSuccess: () => {
          onRefresh()
          setDeletingId(null)
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleToggleStatus = (company: Company) => {
    updateCompany({
      id: company.id,
      data: { ...company, status: !company.status }
    }, {
      onSuccess: () => onRefresh()
    })
  }

  return (
    <div className="company-table-container">
      <table className="company-table">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>RUC</th>
            <th>Contacto</th>
            <th>Facturación Electrónica</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((company) => (
            <tr key={company.id}>
              <td className="company-table__company">
                <div className="company-table__company-info">
                  <div className="company-table__company-avatar">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} />
                    ) : (
                      <MuiSvgIcon size={24}>heroicons-outline:building-office</MuiSvgIcon>
                    )}
                  </div>
                  <div>
                    <div className="company-table__company-name">{company.name}</div>
                    {company.web_site && (
                      <a href={company.web_site} target="_blank" rel="noopener noreferrer" className="company-table__company-website">
                        {company.web_site}
                      </a>
                    )}
                  </div>
                </div>
              </td>
              <td className="company-table__ruc">{company.ruc}</td>
              <td>
                <div className="company-table__contact">
                  {company.email && <div className="company-table__email">{company.email}</div>}
                  <div className="company-table__phone">{company.phone}</div>
                </div>
              </td>
              <td>
                {company.einvoice_username ? (
                  <div className="company-table__einvoice-status company-table__einvoice-status--configured">
                    <MuiSvgIcon size={16}>lucide:check-circle</MuiSvgIcon>
                    <span>Configurado</span>
                  </div>
                ) : (
                  <div className="company-table__einvoice-status company-table__einvoice-status--pending">
                    <MuiSvgIcon size={16}>lucide:circle-alert</MuiSvgIcon>
                    <span>No configurado</span>
                  </div>
                )}
              </td>
              <td>
                <button 
                  className={`company-table__status ${company.status ? 'company-table__status--active' : 'company-table__status--inactive'}`}
                  onClick={() => handleToggleStatus(company)}
                >
                  <span className="company-table__status-dot"></span>
                  {company.status ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td className="company-table__actions">
                <button 
                  className="company-table__action-btn company-table__action-btn--edit"
                  onClick={() => onEdit(company)}
                  title="Editar"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button 
                  className="company-table__action-btn company-table__action-btn--delete"
                  onClick={() => handleDelete(company.id)}
                  disabled={isDeleting && deletingId === company.id}
                  title="Eliminar"
                >
                  {isDeleting && deletingId === company.id ? (
                    <span className="company-table__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>
                      lucide:trash-2
                    </MuiSvgIcon>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}