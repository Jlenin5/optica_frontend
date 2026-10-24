export const PaymentTypeSkeleton = () => {
  return (
    <div className="payment-type-skeleton">
      <div className="payment-type-skeleton__header">
        <div className="payment-type-skeleton__line payment-type-skeleton__line--title"></div>
        <div className="payment-type-skeleton__line payment-type-skeleton__line--subtitle"></div>
      </div>
      
      <div className="payment-type-skeleton__stats">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="payment-type-skeleton__stat-card">
            <div className="payment-type-skeleton__stat-icon"></div>
            <div className="payment-type-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="payment-type-skeleton__filters">
        <div className="payment-type-skeleton__filter"></div>
      </div>

      <div className="payment-type-skeleton__table">
        <div className="payment-type-skeleton__table-header">
          <div className="payment-type-skeleton__table-header-cell"></div>
          <div className="payment-type-skeleton__table-header-cell"></div>
          <div className="payment-type-skeleton__table-header-cell"></div>
          <div className="payment-type-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="payment-type-skeleton__table-row">
            <div className="payment-type-skeleton__table-cell"></div>
            <div className="payment-type-skeleton__table-cell"></div>
            <div className="payment-type-skeleton__table-cell"></div>
            <div className="payment-type-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}