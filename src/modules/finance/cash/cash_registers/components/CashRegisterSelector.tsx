import MuiSvgIcon from '@components/MuiSvgIcon'
import type { CashRegister } from "../types/cash-registers.types"
import { useEffect, useRef, useState } from 'react'

interface CashRegisterSelectorProps {
  registers: CashRegister[]
  value: number | null
  onChange: (id: number) => void
  error?: string
}

export const CashRegisterSelector = ({ registers, value, onChange, error }: CashRegisterSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedRegister = registers.find(r => r.id === value)

  return (
    <div className="cash-register-selector" ref={wrapperRef}>
      <div 
        className={`cash-register-selector__trigger ${error ? 'cash-register-selector__trigger--error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedRegister ? (
          <div className="cash-register-selector__selected">
            <div className="cash-register-selector__selected-icon">
              <MuiSvgIcon size={20}>lucide:credit-card</MuiSvgIcon>
            </div>
            <div>
              <div className="cash-register-selector__selected-name">{selectedRegister.name}</div>
              <div className="cash-register-selector__selected-store">
                {selectedRegister.store?.name || 'Sin tienda'}
              </div>
            </div>
          </div>
        ) : (
          <span className="cash-register-selector__placeholder">Seleccionar caja</span>
        )}
        <MuiSvgIcon size={20} className={`cash-register-selector__chevron ${isOpen ? 'cash-register-selector__chevron--open' : ''}`}>
          lucide:chevron-down
        </MuiSvgIcon>
      </div>

      {isOpen && (
        <div className="cash-register-selector__dropdown">
          {registers.length === 0 ? (
            <div className="cash-register-selector__empty">
              <MuiSvgIcon size={24}>lucide:inbox</MuiSvgIcon>
              <p>No hay cajas disponibles</p>
            </div>
          ) : (
            registers.map(register => (
              <div
                key={register.id}
                className={`cash-register-selector__option ${value === register.id ? 'cash-register-selector__option--selected' : ''}`}
                onClick={() => {
                  onChange(register.id)
                  setIsOpen(false)
                }}
              >
                <div className="cash-register-selector__option-icon">
                  <MuiSvgIcon size={20}>lucide:credit-card</MuiSvgIcon>
                </div>
                <div>
                  <div className="cash-register-selector__option-name">{register.name}</div>
                  <div className="cash-register-selector__option-store">
                    {register.store?.name || 'Sin tienda'}
                  </div>
                </div>
                {value === register.id && (
                  <MuiSvgIcon size={16} className="cash-register-selector__option-check">
                    lucide:check
                  </MuiSvgIcon>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {error && <span className="cash-register-selector__error">{error}</span>}
    </div>
  )
}