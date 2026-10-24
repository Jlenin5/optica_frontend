export const DayOfCreditSkeleton = () => {
  return (
    <div className="day-of-credit-skeleton">
      <div className="day-of-credit-skeleton__header">
        <div className="day-of-credit-skeleton__line day-of-credit-skeleton__line--title"></div>
        <div className="day-of-credit-skeleton__line day-of-credit-skeleton__line--subtitle"></div>
      </div>
      
      <div className="day-of-credit-skeleton__stats">
        <div className="day-of-credit-skeleton__stat-card">
          <div className="day-of-credit-skeleton__stat-icon"></div>
          <div className="day-of-credit-skeleton__stat-line"></div>
        </div>
      </div>

      <div className="day-of-credit-skeleton__filters">
        <div className="day-of-credit-skeleton__filter"></div>
      </div>

      <div className="day-of-credit-skeleton__table">
        <div className="day-of-credit-skeleton__table-header">
          <div className="day-of-credit-skeleton__table-header-cell"></div>
          <div className="day-of-credit-skeleton__table-header-cell"></div>
          <div className="day-of-credit-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="day-of-credit-skeleton__table-row">
            <div className="day-of-credit-skeleton__table-cell"></div>
            <div className="day-of-credit-skeleton__table-cell"></div>
            <div className="day-of-credit-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}