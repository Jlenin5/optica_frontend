export const PlanFeaturesSkeleton = () => {
  return (
    <div className="plan-features-skeleton">
      <div className="plan-features-skeleton__header">
        <div className="plan-features-skeleton__title"></div>
        <div className="plan-features-skeleton__subtitle"></div>
      </div>

      <div className="plan-features-skeleton__stats">
        <div className="plan-features-skeleton__stat-card">
          <div className="plan-features-skeleton__stat-icon"></div>
          <div className="plan-features-skeleton__stat-line"></div>
        </div>
      </div>

      <div className="plan-features-skeleton__table">
        <div className="plan-features-skeleton__table-header">
          <div className="plan-features-skeleton__table-header-cell"></div>
          <div className="plan-features-skeleton__table-header-cell"></div>
          <div className="plan-features-skeleton__table-header-cell"></div>
          <div className="plan-features-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="plan-features-skeleton__table-row">
            <div className="plan-features-skeleton__table-cell"></div>
            <div className="plan-features-skeleton__table-cell"></div>
            <div className="plan-features-skeleton__table-cell"></div>
            <div className="plan-features-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}