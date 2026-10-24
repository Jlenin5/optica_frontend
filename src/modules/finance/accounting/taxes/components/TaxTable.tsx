import { useState } from "react"
import { useDeleteTax } from "../hooks/useDeleteTax"
import type { Tax } from "../types/taxes.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TaxTableProps {
  data: Tax[]
  onEdit: (tax: Tax) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

const formatPercent = (percent: number) => {
  return `${percent}%`
}

export const TaxTable = ({ data, onEdit, onRefresh }: TaxTableProps) => {
  const { mutate: deleteTax, isPending: isDeleting } = useDeleteTax()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este impuesto?")) {
      setDeletingId(id)
      deleteTax(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  return (
    <div className="tax-table-container">
      <table className="tax-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Porcentaje</th>
            <th>Cuenta Contable</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tax) => (
            <tr key={tax.id}>
              <td className="tax-table__id">{tax.id}</td>
              <td className="tax-table__code">
                <code className="tax-table__code-badge">{tax.code}</code>
              </td>
              <td className="tax-table__description">
                <div className="tax-table__description-text" title={tax.description}>
                  {tax.description}
                </div>
              </td>
              <td className="tax-table__percent">
                <span className="tax-table__percent-badge">
                  {formatPercent(tax.percent)}
                </span>
              </td>
              <td className="tax-table__account">
                {tax.account || '-'}
              </td>
              <td className="tax-table__created-at">
                {formatDate(tax.created_at)}
              </td>
              <td className="tax-table__actions">
                <button
                  className="tax-table__action-btn tax-table__action-btn--edit"
                  onClick={() => onEdit(tax)}
                  title="Editar impuesto"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="tax-table__action-btn tax-table__action-btn--delete"
                  onClick={() => handleDelete(tax.id)}
                  disabled={isDeleting && deletingId === tax.id}
                  title="Eliminar impuesto"
                >
                  {isDeleting && deletingId === tax.id ? (
                    <span className="tax-table__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
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