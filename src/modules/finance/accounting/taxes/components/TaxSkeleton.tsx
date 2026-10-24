export const TaxSkeleton = () => {
  return (
    <div className="tax-skeleton">
      <div className="tax-skeleton__header">
        <div className="tax-skeleton__line tax-skeleton__line--title"></div>
        <div className="tax-skeleton__line tax-skeleton__line--subtitle"></div>
      </div>
      
      <div className="tax-skeleton__stats">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="tax-skeleton__stat-card">
            <div className="tax-skeleton__stat-icon"></div>
            <div className="tax-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="tax-skeleton__filters">
        <div className="tax-skeleton__filter"></div>
      </div>

      <div className="tax-skeleton__table">
        <div className="tax-skeleton__table-header">
          <div className="tax-skeleton__table-header-cell"></div>
          <div className="tax-skeleton__table-header-cell"></div>
          <div className="tax-skeleton__table-header-cell"></div>
          <div className="tax-skeleton__table-header-cell"></div>
          <div className="tax-skeleton__table-header-cell"></div>
          <div className="tax-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="tax-skeleton__table-row">
            <div className="tax-skeleton__table-cell"></div>
            <div className="tax-skeleton__table-cell"></div>
            <div className="tax-skeleton__table-cell"></div>
            <div className="tax-skeleton__table-cell"></div>
            <div className="tax-skeleton__table-cell"></div>
            <div className="tax-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}