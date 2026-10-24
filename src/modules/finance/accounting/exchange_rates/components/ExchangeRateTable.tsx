import { useState } from "react"
import { useUpdateExchangeRate } from "../hooks/useUpdateExchangeRate"
import type { ExchangeRate } from "../types/exchange-rates.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ExchangeRateTableProps {
  data: ExchangeRate[]
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
}

const formatAmount = (amount: number | null) => {
  if (amount === null) return '-'
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(amount)
}

export const ExchangeRateTable = ({ data, onRefresh, isSuperAdmin }: ExchangeRateTableProps) => {
  const { mutate: updateExchangeRate, isPending: isUpdating } = useUpdateExchangeRate()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<ExchangeRate>>({})

  const handleEdit = (rate: ExchangeRate) => {
    setEditingId(rate.id)
    setEditValues({
      amount_commercial: rate.amount_commercial,
      amount_sunat: rate.amount_sunat,
      amount_sbs: rate.amount_sbs
    })
  }

  const handleSave = (id: number) => {
    updateExchangeRate({ id, data: editValues }, {
      onSuccess: () => {
        setEditingId(null)
        setEditValues({})
        onRefresh()
      }
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleChange = (field: keyof ExchangeRate, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    setEditValues(prev => ({ ...prev, [field]: isNaN(numValue as number) ? null : numValue }))
  }

  return (
    <div className="exchange-rate-table-container">
      <table className="exchange-rate-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Tasa Comercial</th>
            <th>Tasa SUNAT</th>
            <th>Tasa SBS</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rate) => (
            <tr key={rate.id}>
              <td className="exchange-rate-table__id">{rate.id}</td>
              <td className="exchange-rate-table__date">
                {formatDate(rate.created_at)}
              </td>
              <td className="exchange-rate-table__commercial">
                {editingId === rate.id ? (
                  <input
                    type="number"
                    step="0.0001"
                    value={editValues.amount_commercial ?? ''}
                    onChange={(e) => handleChange('amount_commercial', e.target.value)}
                    className="exchange-rate-table__input"
                  />
                ) : (
                  <span className="exchange-rate-table__value">
                    {formatAmount(rate.amount_commercial)}
                  </span>
                )}
              </td>
              <td className="exchange-rate-table__sunat">
                {editingId === rate.id ? (
                  <input
                    type="number"
                    step="0.0001"
                    value={editValues.amount_sunat ?? ''}
                    onChange={(e) => handleChange('amount_sunat', e.target.value)}
                    className="exchange-rate-table__input"
                  />
                ) : (
                  <span className="exchange-rate-table__value">
                    {formatAmount(rate.amount_sunat)}
                  </span>
                )}
              </td>
              <td className="exchange-rate-table__sbs">
                {editingId === rate.id ? (
                  <input
                    type="number"
                    step="0.0001"
                    value={editValues.amount_sbs ?? ''}
                    onChange={(e) => handleChange('amount_sbs', e.target.value)}
                    className="exchange-rate-table__input"
                  />
                ) : (
                  <span className="exchange-rate-table__value">
                    {formatAmount(rate.amount_sbs)}
                  </span>
                )}
              </td>
              {
                isSuperAdmin && (
                  <td className="store-registers-table__company">
                    {rate?.company?.name || '-'}
                  </td>
                )
              }
              <td className="exchange-rate-table__actions">
                {editingId === rate.id ? (
                  <>
                    <button
                      className="exchange-rate-table__action-btn exchange-rate-table__action-btn--save"
                      onClick={() => handleSave(rate.id)}
                      disabled={isUpdating}
                      title="Guardar"
                    >
                      <MuiSvgIcon size={18}>lucide:check</MuiSvgIcon>
                    </button>
                    <button
                      className="exchange-rate-table__action-btn exchange-rate-table__action-btn--cancel"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      title="Cancelar"
                    >
                      <MuiSvgIcon size={18}>lucide:x</MuiSvgIcon>
                    </button>
                  </>
                ) : (
                  <button
                    className="exchange-rate-table__action-btn exchange-rate-table__action-btn--edit"
                    onClick={() => handleEdit(rate)}
                    title="Editar tasa de cambio"
                  >
                    <MuiSvgIcon size={18}>
                      heroicons-outline:pencil-square
                    </MuiSvgIcon>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}