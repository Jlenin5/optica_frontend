export const CurrencySkeleton = () => {
  return (
    <div className="currency-skeleton">
      <div className="currency-skeleton__header">
        <div className="currency-skeleton__line currency-skeleton__line--title"></div>
        <div className="currency-skeleton__line currency-skeleton__line--subtitle"></div>
      </div>
      
      <div className="currency-skeleton__stats">
        <div className="currency-skeleton__stat-card">
          <div className="currency-skeleton__stat-icon"></div>
          <div className="currency-skeleton__stat-line"></div>
        </div>
      </div>

      <div className="currency-skeleton__filters">
        <div className="currency-skeleton__filter"></div>
      </div>

      <div className="currency-skeleton__table">
        <div className="currency-skeleton__table-header">
          <div className="currency-skeleton__table-header-cell"></div>
          <div className="currency-skeleton__table-header-cell"></div>
          <div className="currency-skeleton__table-header-cell"></div>
          <div className="currency-skeleton__table-header-cell"></div>
          <div className="currency-skeleton__table-header-cell"></div>
          <div className="currency-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="currency-skeleton__table-row">
            <div className="currency-skeleton__table-cell"></div>
            <div className="currency-skeleton__table-cell"></div>
            <div className="currency-skeleton__table-cell"></div>
            <div className="currency-skeleton__table-cell"></div>
            <div className="currency-skeleton__table-cell"></div>
            <div className="currency-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}