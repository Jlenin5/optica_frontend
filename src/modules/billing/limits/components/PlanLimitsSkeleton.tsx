export const PlanLimitsSkeleton = () => {
  return (
    <div className="plan-limits-skeleton">
      {/* Header */}
      <div className="plan-limits-skeleton__header">
        <div className="plan-limits-skeleton__title"></div>
        <div className="plan-limits-skeleton__subtitle"></div>
      </div>

      {/* Stats Cards */}
      <div className="plan-limits-skeleton__stats">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="plan-limits-skeleton__stat-card">
            <div className="plan-limits-skeleton__stat-icon"></div>
            <div className="plan-limits-skeleton__stat-line"></div>
            <div className="plan-limits-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="plan-limits-skeleton__table">
        <div className="plan-limits-skeleton__table-header">
          <div className="plan-limits-skeleton__table-header-cell"></div>
          <div className="plan-limits-skeleton__table-header-cell"></div>
          <div className="plan-limits-skeleton__table-header-cell"></div>
          <div className="plan-limits-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="plan-limits-skeleton__table-row">
            <div className="plan-limits-skeleton__table-cell"></div>
            <div className="plan-limits-skeleton__table-cell"></div>
            <div className="plan-limits-skeleton__table-cell"></div>
            <div className="plan-limits-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}