export const StoreSkeleton = () => {
  return (
    <div className="store-skeleton">
      <div className="store-skeleton__header">
        <div className="store-skeleton__line store-skeleton__line--title"></div>
        <div className="store-skeleton__line store-skeleton__line--subtitle"></div>
      </div>
      
      <div className="store-skeleton__stats">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="store-skeleton__stat-card">
            <div className="store-skeleton__stat-icon"></div>
            <div className="store-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="store-skeleton__filters">
        <div className="store-skeleton__filter"></div>
        <div className="store-skeleton__filter"></div>
      </div>

      <div className="store-skeleton__table">
        <div className="store-skeleton__table-header">
          <div className="store-skeleton__table-header-cell"></div>
          <div className="store-skeleton__table-header-cell"></div>
          <div className="store-skeleton__table-header-cell"></div>
          <div className="store-skeleton__table-header-cell"></div>
          <div className="store-skeleton__table-header-cell"></div>
          <div className="store-skeleton__table-header-cell"></div>
          <div className="store-skeleton__table-header-cell"></div>
          <div className="store-skeleton__table-header-cell"></div>
          <div className="store-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="store-skeleton__table-row">
            <div className="store-skeleton__table-cell"></div>
            <div className="store-skeleton__table-cell"></div>
            <div className="store-skeleton__table-cell"></div>
            <div className="store-skeleton__table-cell"></div>
            <div className="store-skeleton__table-cell"></div>
            <div className="store-skeleton__table-cell"></div>
            <div className="store-skeleton__table-cell"></div>
            <div className="store-skeleton__table-cell"></div>
            <div className="store-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}