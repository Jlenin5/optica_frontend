interface PlanSkeletonProps {
  viewMode: 'grid' | 'list'
}

export const PlanSkeleton = ({ viewMode }: PlanSkeletonProps) => {
  if (viewMode === 'list') {
    return (
      <div className="plan-skeleton plan-skeleton--list">
        <div className="plan-skeleton__header">
          <div className="plan-skeleton__badges">
            <div className="plan-skeleton__badge"></div>
            <div className="plan-skeleton__badge"></div>
          </div>
          <div className="plan-skeleton__title"></div>
        </div>
        <div className="plan-skeleton__content">
          <div className="plan-skeleton__line"></div>
          <div className="plan-skeleton__line"></div>
        </div>
        <div className="plan-skeleton__footer">
          <div className="plan-skeleton__button"></div>
          <div className="plan-skeleton__button"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="plan-skeleton">
      <div className="plan-skeleton__header">
        <div className="plan-skeleton__badge"></div>
        <div className="plan-skeleton__icon"></div>
      </div>
      <div className="plan-skeleton__body">
        <div className="plan-skeleton__title"></div>
        <div className="plan-skeleton__price"></div>
        <div className="plan-skeleton__line"></div>
      </div>
      <div className="plan-skeleton__footer">
        <div className="plan-skeleton__button"></div>
        <div className="plan-skeleton__button"></div>
      </div>
    </div>
  )
}