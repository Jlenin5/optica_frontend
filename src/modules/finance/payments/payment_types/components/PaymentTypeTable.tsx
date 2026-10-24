import { useState } from "react"
import { useDeletePaymentType } from "../hooks/useDeletePaymentType"
import type { PaymentType } from "../types/payment-types.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PaymentTypeTableProps {
  data: PaymentType[]
  onEdit: (paymentType: PaymentType) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const PaymentTypeTable = ({
  data,
  onEdit,
  onRefresh
}: PaymentTypeTableProps) => {
  const { mutate: deletePaymentType, isPending: isDeleting } = useDeletePaymentType()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de pago?")) {
      setDeletingId(id)
      deletePaymentType(id, {
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
    <div className="payment-type-table-container">
      <table className="payment-type-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Financiamiento</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((type) => (
            <tr key={type.id}>
              <td className="payment-type-table__id">{type.id}</td>
              <td className="payment-type-table__description">
                <div className="payment-type-table__description-info">
                  <div className="payment-type-table__description-icon">
                    <MuiSvgIcon size={20}>lucide:tag</MuiSvgIcon>
                  </div>
                  <span className="payment-type-table__description-text">
                    {type.description}
                  </span>
                </div>
              </td>
              <td className="payment-type-table__financing">
                {type.has_financing ? (
                  <span className="payment-type-table__financing-badge payment-type-table__financing-badge--yes">
                    <MuiSvgIcon size={14}>lucide:circle-check</MuiSvgIcon>
                    Con financiamiento
                  </span>
                ) : (
                  <span className="payment-type-table__financing-badge payment-type-table__financing-badge--no">
                    <MuiSvgIcon size={14}>lucide:circle-x</MuiSvgIcon>
                    Sin financiamiento
                  </span>
                )}
              </td>
              <td className="payment-type-table__created-at">
                {formatDate(type.created_at)}
              </td>
              <td className="payment-type-table__actions">
                <button
                  className="payment-type-table__action-btn payment-type-table__action-btn--edit"
                  onClick={() => onEdit(type)}
                  title="Editar tipo de pago"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="payment-type-table__action-btn payment-type-table__action-btn--delete"
                  onClick={() => handleDelete(type.id)}
                  disabled={isDeleting && deletingId === type.id}
                  title="Eliminar tipo de pago"
                >
                  {isDeleting && deletingId === type.id ? (
                    <span className="payment-type-table__spinner"></span>
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