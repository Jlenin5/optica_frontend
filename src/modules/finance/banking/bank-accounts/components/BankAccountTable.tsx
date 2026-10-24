import { useState } from "react"
import { useDeleteBankAccount } from "../hooks/useDeleteBankAccount"
import type { BankAccount } from "../types/bank-accounts.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface BankAccountTableProps {
  data: BankAccount[]
  onEdit: (bankAccount: BankAccount) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const BankAccountTable = ({
  data,
  onEdit,
  onRefresh,
  isSuperAdmin
}: BankAccountTableProps) => {
  const { mutate: deleteBankAccount, isPending: isDeleting } = useDeleteBankAccount()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cuenta bancaria?")) {
      setDeletingId(id)
      deleteBankAccount(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const formatAccountNumber = (number: string | null) => {
    if (!number) return '-'
    if (number.length > 4) {
      return `****${number.slice(-4)}`
    }
    return number
  }

  return (
    <div className="bank-account-table-container">
      <table className="bank-account-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Banco</th>
            <th>Moneda</th>
            <th>Número de Cuenta</th>
            <th>CCI</th>
            <th>Descripción</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((account) => (
            <tr key={account.id}>
              <td className="bank-account-table__id">{account.id}</td>
              <td className="bank-account-table__bank">
                <div className="bank-account-table__bank-info">
                  <div className="bank-account-table__bank-icon">
                    <MuiSvgIcon size={20}>lucide:building</MuiSvgIcon>
                  </div>
                  <span className="bank-account-table__bank-name">
                    {account.bank?.name || '-'}
                  </span>
                </div>
              </td>
              <td className="bank-account-table__currency">
                <span className="bank-account-table__currency-badge">
                  {account.currency?.code || '-'}
                </span>
              </td>
              <td className="bank-account-table__account-number">
                <span className="bank-account-table__account-value" title={account.account_number || ''}>
                  {formatAccountNumber(account.account_number)}
                </span>
              </td>
              <td className="bank-account-table__cci">
                <span className="bank-account-table__cci-value" title={account.cci_number || ''}>
                  {account.cci_number ? `${account.cci_number.slice(0, 4)}...${account.cci_number.slice(-4)}` : '-'}
                </span>
              </td>
              <td className="bank-account-table__description">
                <div className="bank-account-table__description-text" title={account.description || ''}>
                  {account.description || '-'}
                </div>
              </td>
              {
                isSuperAdmin && (
                  <td className="store-registers-table__company">
                    {account?.company?.name || '-'}
                  </td>
                )
              }
              <td className="bank-account-table__created-at">
                {formatDate(account.created_at)}
              </td>
              <td className="bank-account-table__actions">
                <button
                  className="bank-account-table__action-btn bank-account-table__action-btn--edit"
                  onClick={() => onEdit(account)}
                  title="Editar cuenta bancaria"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="bank-account-table__action-btn bank-account-table__action-btn--delete"
                  onClick={() => handleDelete(account.id)}
                  disabled={isDeleting && deletingId === account.id}
                  title="Eliminar cuenta bancaria"
                >
                  {isDeleting && deletingId === account.id ? (
                    <span className="bank-account-table__spinner"></span>
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