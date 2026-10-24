import { useState } from "react"
import { useDeletePaymentMethod } from "../hooks/useDeletePaymentMethod"
import type { PaymentMethod } from "../types/payment-methods.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PaymentMethodTableProps {
  data: PaymentMethod[]
  onEdit: (paymentMethod: PaymentMethod) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const PaymentMethodTable = ({
  data,
  onEdit,
  onRefresh
}: PaymentMethodTableProps) => {
  const { mutate: deletePaymentMethod, isPending: isDeleting } = useDeletePaymentMethod()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este método de pago?")) {
      setDeletingId(id)
      deletePaymentMethod(id, {
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
    <div className="payment-method-table-container">
      <table className="payment-method-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Código</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((method) => (
            <tr key={method.id}>
              <td className="payment-method-table__id">{method.id}</td>
              <td className="payment-method-table__description">
                <div className="payment-method-table__description-info">
                  <div className="payment-method-table__description-icon">
                    <MuiSvgIcon size={20}>lucide:wallet</MuiSvgIcon>
                  </div>
                  <span className="payment-method-table__description-text">
                    {method.description || '-'}
                  </span>
                </div>
              </td>
              <td className="payment-method-table__code">
                {method.code ? (
                  <code className="payment-method-table__code-badge">{method.code}</code>
                ) : (
                  <span className="payment-method-table__code-empty">-</span>
                )}
              </td>
              <td className="payment-method-table__created-at">
                {formatDate(method.created_at)}
              </td>
              <td className="payment-method-table__actions">
                <button
                  className="payment-method-table__action-btn payment-method-table__action-btn--edit"
                  onClick={() => onEdit(method)}
                  title="Editar método de pago"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="payment-method-table__action-btn payment-method-table__action-btn--delete"
                  onClick={() => handleDelete(method.id)}
                  disabled={isDeleting && deletingId === method.id}
                  title="Eliminar método de pago"
                >
                  {isDeleting && deletingId === method.id ? (
                    <span className="payment-method-table__spinner"></span>
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