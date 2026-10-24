export const CashMovementSkeleton = () => {
  return (
    <div className="cash-movement-skeleton">
      <div className="cash-movement-skeleton__header">
        <div className="cash-movement-skeleton__line cash-movement-skeleton__line--title"></div>
        <div className="cash-movement-skeleton__line cash-movement-skeleton__line--subtitle"></div>
      </div>
      
      <div className="cash-movement-skeleton__stats">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="cash-movement-skeleton__stat-card">
            <div className="cash-movement-skeleton__stat-icon"></div>
            <div className="cash-movement-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="cash-movement-skeleton__filters">
        <div className="cash-movement-skeleton__filter"></div>
        <div className="cash-movement-skeleton__filter"></div>
        <div className="cash-movement-skeleton__filter"></div>
        <div className="cash-movement-skeleton__filter"></div>
        <div className="cash-movement-skeleton__filter"></div>
        <div className="cash-movement-skeleton__filter"></div>
      </div>

      <div className="cash-movement-skeleton__table">
        <div className="cash-movement-skeleton__table-header">
          <div className="cash-movement-skeleton__table-header-cell"></div>
          <div className="cash-movement-skeleton__table-header-cell"></div>
          <div className="cash-movement-skeleton__table-header-cell"></div>
          <div className="cash-movement-skeleton__table-header-cell"></div>
          <div className="cash-movement-skeleton__table-header-cell"></div>
          <div className="cash-movement-skeleton__table-header-cell"></div>
          <div className="cash-movement-skeleton__table-header-cell"></div>
          <div className="cash-movement-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="cash-movement-skeleton__table-row">
            <div className="cash-movement-skeleton__table-cell"></div>
            <div className="cash-movement-skeleton__table-cell"></div>
            <div className="cash-movement-skeleton__table-cell"></div>
            <div className="cash-movement-skeleton__table-cell"></div>
            <div className="cash-movement-skeleton__table-cell"></div>
            <div className="cash-movement-skeleton__table-cell"></div>
            <div className="cash-movement-skeleton__table-cell"></div>
            <div className="cash-movement-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}