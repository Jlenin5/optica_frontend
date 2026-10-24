export const PaymentMethodSkeleton = () => {
  return (
    <div className="payment-method-skeleton">
      <div className="payment-method-skeleton__header">
        <div className="payment-method-skeleton__line payment-method-skeleton__line--title"></div>
        <div className="payment-method-skeleton__line payment-method-skeleton__line--subtitle"></div>
      </div>
      
      <div className="payment-method-skeleton__stats">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="payment-method-skeleton__stat-card">
            <div className="payment-method-skeleton__stat-icon"></div>
            <div className="payment-method-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="payment-method-skeleton__filters">
        <div className="payment-method-skeleton__filter"></div>
      </div>

      <div className="payment-method-skeleton__table">
        <div className="payment-method-skeleton__table-header">
          <div className="payment-method-skeleton__table-header-cell"></div>
          <div className="payment-method-skeleton__table-header-cell"></div>
          <div className="payment-method-skeleton__table-header-cell"></div>
          <div className="payment-method-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="payment-method-skeleton__table-row">
            <div className="payment-method-skeleton__table-cell"></div>
            <div className="payment-method-skeleton__table-cell"></div>
            <div className="payment-method-skeleton__table-cell"></div>
            <div className="payment-method-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}