export const CashRegisterSkeleton = () => {
  return (
    <div className="cash-register-skeleton">
      <div className="cash-register-skeleton__header">
        <div className="cash-register-skeleton__line cash-register-skeleton__line--title"></div>
        <div className="cash-register-skeleton__line cash-register-skeleton__line--subtitle"></div>
      </div>
      
      <div className="cash-register-skeleton__stats">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="cash-register-skeleton__stat-card">
            <div className="cash-register-skeleton__stat-icon"></div>
            <div className="cash-register-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="cash-register-skeleton__filters">
        <div className="cash-register-skeleton__filter"></div>
        <div className="cash-register-skeleton__filter"></div>
        <div className="cash-register-skeleton__filter"></div>
        <div className="cash-register-skeleton__filter"></div>
        <div className="cash-register-skeleton__filter"></div>
      </div>

      <div className="cash-register-skeleton__table">
        <div className="cash-register-skeleton__table-header">
          <div className="cash-register-skeleton__table-header-cell"></div>
          <div className="cash-register-skeleton__table-header-cell"></div>
          <div className="cash-register-skeleton__table-header-cell"></div>
          <div className="cash-register-skeleton__table-header-cell"></div>
          <div className="cash-register-skeleton__table-header-cell"></div>
          <div className="cash-register-skeleton__table-header-cell"></div>
          <div className="cash-register-skeleton__table-header-cell"></div>
          <div className="cash-register-skeleton__table-header-cell"></div>
          <div className="cash-register-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="cash-register-skeleton__table-row">
            <div className="cash-register-skeleton__table-cell"></div>
            <div className="cash-register-skeleton__table-cell"></div>
            <div className="cash-register-skeleton__table-cell"></div>
            <div className="cash-register-skeleton__table-cell"></div>
            <div className="cash-register-skeleton__table-cell"></div>
            <div className="cash-register-skeleton__table-cell"></div>
            <div className="cash-register-skeleton__table-cell"></div>
            <div className="cash-register-skeleton__table-cell"></div>
            <div className="cash-register-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}