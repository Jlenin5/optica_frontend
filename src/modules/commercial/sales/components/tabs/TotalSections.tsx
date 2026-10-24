import MuiSvgIcon from "@/components/MuiSvgIcon"
import type { Dispatch, SetStateAction } from "react"

interface SaleTotals {
  subtotal: number
  discountValue: number
  total: number
  changeAmount: number
}

interface TotalSectionsProps {
  totals: SaleTotals
  discount: string
  setDiscount: Dispatch<SetStateAction<string>>
  discountType: "percentage" | "fixed"
  setDiscountType: Dispatch<SetStateAction<"percentage" | "fixed">>
  totalPaid: string
  setTotalPaid: Dispatch<SetStateAction<string>>
  handleBlur: (field: string) => void
  touched: Record<string, boolean>
  errors: Record<string, string>
}

export default function TotalSections({
  totals,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  totalPaid,
  setTotalPaid,
  handleBlur,
  touched,
  errors,
}: TotalSectionsProps) {
  return (
    <div className="sale-form__section sale-form__section--totals">
      <h2 className="sale-form__section-title">
        <MuiSvgIcon size={20}>lucide:calculator</MuiSvgIcon>
        Totales
      </h2>

      <div className="sale-form__totals">
        <div className="sale-form__total-row">
          <span>Subtotal</span>
          <strong>S/ {totals.subtotal.toFixed(2)}</strong>
        </div>

        <div className="sale-form__total-row sale-form__total-row--discount">
          <div className="sale-form__discount-controls">
            <span>Descuento</span>
            <div className="sale-form__discount-inputs">
              <input
                type="number"
                step="0.01"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                aria-label="Monto del descuento"
              />
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                aria-label="Tipo de descuento"
              >
                <option value="percentage">%</option>
                <option value="fixed">S/</option>
              </select>
            </div>
          </div>
          <strong>- S/ {totals.discountValue.toFixed(2)}</strong>
        </div>

        <div className="sale-form__total-row sale-form__total-row--grand">
          <span>Total</span>
          <strong>S/ {totals.total.toFixed(2)}</strong>
        </div>

        <div className="sale-form__total-row">
          <span>Monto pagado</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={totalPaid}
            onChange={(e) => setTotalPaid(e.target.value)}
            onBlur={() => handleBlur("total_paid")}
            className={touched.total_paid && errors.total_paid ? "error" : ""}
            aria-label="Monto pagado"
          />
        </div>

        <div className="sale-form__total-row">
          <span>Vuelto</span>
          <strong className="sale-form__change-amount">
            S/ {totals.changeAmount.toFixed(2)}
          </strong>
        </div>

        {touched.total_paid && errors.total_paid && (
          <div className="sale-form__error-message">{errors.total_paid}</div>
        )}
      </div>
    </div>
  )
}
