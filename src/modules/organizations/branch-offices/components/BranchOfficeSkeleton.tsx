export const BranchOfficeSkeleton = () => {
  return (
    <div className="branch-office-skeleton">
      <div className="branch-office-skeleton__header">
        <div className="branch-office-skeleton__line branch-office-skeleton__line--title"></div>
        <div className="branch-office-skeleton__line branch-office-skeleton__line--subtitle"></div>
      </div>
      
      <div className="branch-office-skeleton__stats">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="branch-office-skeleton__stat-card">
            <div className="branch-office-skeleton__stat-icon"></div>
            <div className="branch-office-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="branch-office-skeleton__filters">
        <div className="branch-office-skeleton__filter"></div>
        <div className="branch-office-skeleton__filter"></div>
      </div>

      <div className="branch-office-skeleton__table">
        <div className="branch-office-skeleton__table-header">
          <div className="branch-office-skeleton__table-header-cell"></div>
          <div className="branch-office-skeleton__table-header-cell"></div>
          <div className="branch-office-skeleton__table-header-cell"></div>
          <div className="branch-office-skeleton__table-header-cell"></div>
          <div className="branch-office-skeleton__table-header-cell"></div>
          <div className="branch-office-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="branch-office-skeleton__table-row">
            <div className="branch-office-skeleton__table-cell"></div>
            <div className="branch-office-skeleton__table-cell"></div>
            <div className="branch-office-skeleton__table-cell"></div>
            <div className="branch-office-skeleton__table-cell"></div>
            <div className="branch-office-skeleton__table-cell"></div>
            <div className="branch-office-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}