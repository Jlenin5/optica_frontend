export const StatusSkeleton = () => {
  return (
    <div className="user-skeleton">
      <div className="user-skeleton__header">
        <div className="user-skeleton__line user-skeleton__line--title"></div>
        <div className="user-skeleton__line user-skeleton__line--subtitle"></div>
      </div>
      
      <div className="user-skeleton__stats">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="user-skeleton__stat-card">
            <div className="user-skeleton__stat-icon"></div>
            <div className="user-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="user-skeleton__filters">
        <div className="user-skeleton__filter"></div>
        <div className="user-skeleton__filter"></div>
      </div>

      <div className="user-skeleton__table">
        <div className="user-skeleton__table-header">
          <div className="user-skeleton__table-header-cell"></div>
          <div className="user-skeleton__table-header-cell"></div>
          <div className="user-skeleton__table-header-cell"></div>
          <div className="user-skeleton__table-header-cell"></div>
          <div className="user-skeleton__table-header-cell"></div>
          <div className="user-skeleton__table-header-cell"></div>
          <div className="user-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="user-skeleton__table-row">
            <div className="user-skeleton__table-cell"></div>
            <div className="user-skeleton__table-cell"></div>
            <div className="user-skeleton__table-cell"></div>
            <div className="user-skeleton__table-cell"></div>
            <div className="user-skeleton__table-cell"></div>
            <div className="user-skeleton__table-cell"></div>
            <div className="user-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}