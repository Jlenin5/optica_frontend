export const ExchangeRateSkeleton = () => {
  return (
    <div className="exchange-rate-skeleton">
      <div className="exchange-rate-skeleton__header">
        <div className="exchange-rate-skeleton__line exchange-rate-skeleton__line--title"></div>
        <div className="exchange-rate-skeleton__line exchange-rate-skeleton__line--subtitle"></div>
      </div>
      
      <div className="exchange-rate-skeleton__stats">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="exchange-rate-skeleton__stat-card">
            <div className="exchange-rate-skeleton__stat-icon"></div>
            <div className="exchange-rate-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="exchange-rate-skeleton__filters">
        <div className="exchange-rate-skeleton__filter"></div>
        <div className="exchange-rate-skeleton__filter"></div>
      </div>

      <div className="exchange-rate-skeleton__table">
        <div className="exchange-rate-skeleton__table-header">
          <div className="exchange-rate-skeleton__table-header-cell"></div>
          <div className="exchange-rate-skeleton__table-header-cell"></div>
          <div className="exchange-rate-skeleton__table-header-cell"></div>
          <div className="exchange-rate-skeleton__table-header-cell"></div>
          <div className="exchange-rate-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="exchange-rate-skeleton__table-row">
            <div className="exchange-rate-skeleton__table-cell"></div>
            <div className="exchange-rate-skeleton__table-cell"></div>
            <div className="exchange-rate-skeleton__table-cell"></div>
            <div className="exchange-rate-skeleton__table-cell"></div>
            <div className="exchange-rate-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}