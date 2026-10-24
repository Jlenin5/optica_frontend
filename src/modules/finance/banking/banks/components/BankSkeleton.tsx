export const BankSkeleton = () => {
  return (
    <div className="bank-skeleton">
      <div className="bank-skeleton__header">
        <div className="bank-skeleton__line bank-skeleton__line--title"></div>
        <div className="bank-skeleton__line bank-skeleton__line--subtitle"></div>
      </div>
      
      <div className="bank-skeleton__stats">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bank-skeleton__stat-card">
            <div className="bank-skeleton__stat-icon"></div>
            <div className="bank-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="bank-skeleton__filters">
        <div className="bank-skeleton__filter"></div>
      </div>

      <div className="bank-skeleton__table">
        <div className="bank-skeleton__table-header">
          <div className="bank-skeleton__table-header-cell"></div>
          <div className="bank-skeleton__table-header-cell"></div>
          <div className="bank-skeleton__table-header-cell"></div>
          <div className="bank-skeleton__table-header-cell"></div>
          <div className="bank-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bank-skeleton__table-row">
            <div className="bank-skeleton__table-cell"></div>
            <div className="bank-skeleton__table-cell"></div>
            <div className="bank-skeleton__table-cell"></div>
            <div className="bank-skeleton__table-cell"></div>
            <div className="bank-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}