export const WarehouseSkeleton = () => {
  return (
    <div className="warehouse-skeleton">
      <div className="warehouse-skeleton__header">
        <div className="warehouse-skeleton__line warehouse-skeleton__line--title"></div>
        <div className="warehouse-skeleton__line warehouse-skeleton__line--subtitle"></div>
      </div>
      
      <div className="warehouse-skeleton__stats">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="warehouse-skeleton__stat-card">
            <div className="warehouse-skeleton__stat-icon"></div>
            <div className="warehouse-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="warehouse-skeleton__filters">
        <div className="warehouse-skeleton__filter"></div>
        <div className="warehouse-skeleton__filter"></div>
        <div className="warehouse-skeleton__filter"></div>
      </div>

      <div className="warehouse-skeleton__table">
        <div className="warehouse-skeleton__table-header">
          <div className="warehouse-skeleton__table-header-cell"></div>
          <div className="warehouse-skeleton__table-header-cell"></div>
          <div className="warehouse-skeleton__table-header-cell"></div>
          <div className="warehouse-skeleton__table-header-cell"></div>
          <div className="warehouse-skeleton__table-header-cell"></div>
          <div className="warehouse-skeleton__table-header-cell"></div>
          <div className="warehouse-skeleton__table-header-cell"></div>
          <div className="warehouse-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="warehouse-skeleton__table-row">
            <div className="warehouse-skeleton__table-cell"></div>
            <div className="warehouse-skeleton__table-cell"></div>
            <div className="warehouse-skeleton__table-cell"></div>
            <div className="warehouse-skeleton__table-cell"></div>
            <div className="warehouse-skeleton__table-cell"></div>
            <div className="warehouse-skeleton__table-cell"></div>
            <div className="warehouse-skeleton__table-cell"></div>
            <div className="warehouse-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}