import { useState } from "react"
import { useDeleteCurrency } from "../hooks/useDeleteCurrency"
import type { Currency } from "../types/currencies.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CurrencyTableProps {
  data: Currency[]
  onEdit: (currency: Currency) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-PE');
}

export const CurrencyTable = ({ data, onEdit, onRefresh }: CurrencyTableProps) => {
  const { mutate: deleteCurrency, isPending: isDeleting } = useDeleteCurrency()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta moneda?")) {
      setDeletingId(id)
      deleteCurrency(id, {
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
    <div className="currency-table-container">
      <table className="currency-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Símbolo</th>
            <th>Moneda Local</th>
            <th>Descripción</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((currency) => (
            <tr key={currency.id}>
              <td className="currency-table__id">{currency.id}</td>
              <td className="currency-table__name">
                <div className="currency-table__name-info">
                  <span className="currency-table__name-text">{currency.name}</span>
                </div>
              </td>
              <td className="currency-table__code">
                <code className="currency-table__code-badge">{currency.code}</code>
              </td>
              <td className="currency-table__symbol">
                <span className="currency-table__symbol-value">{currency.symbol}</span>
              </td>
              <td className="payment-type-table__financing">
                {currency?.is_local ? (
                  <span className="payment-type-table__financing-badge payment-type-table__financing-badge--yes">
                    <MuiSvgIcon size={14}>lucide:circle-check</MuiSvgIcon>
                    Si
                  </span>
                ) : (
                  <span className="payment-type-table__financing-badge payment-type-table__financing-badge--no">
                    <MuiSvgIcon size={14}>lucide:circle-x</MuiSvgIcon>
                    No
                  </span>
                )}
              </td>
              <td className="currency-table__description">
                <div className="currency-table__description-text" title={currency?.description || ''}>
                  {currency?.description || '-'}
                </div>
              </td>
              <td className="currency-table__created-at">
                {formatDate(currency?.created_at || '')}
              </td>
              <td className="currency-table__actions">
                <button
                  className="currency-table__action-btn currency-table__action-btn--edit"
                  onClick={() => onEdit(currency)}
                  title="Editar moneda"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="currency-table__action-btn currency-table__action-btn--delete"
                  onClick={() => handleDelete(currency?.id)}
                  disabled={isDeleting && deletingId === currency?.id}
                  title="Eliminar moneda"
                >
                  {isDeleting && deletingId === currency?.id ? (
                    <span className="currency-table__spinner"></span>
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