interface SubscriptionSkeletonProps {
  viewMode: 'grid' | 'list'
}

export const SubscriptionSkeleton = ({ viewMode }: SubscriptionSkeletonProps) => {
  if (viewMode === 'list') {
    return (
      <div className="subscription-skeleton subscription-skeleton--list">
        <div className="subscription-skeleton__header">
          <div className="subscription-skeleton__company">
            <div className="subscription-skeleton__avatar"></div>
            <div className="subscription-skeleton__info">
              <div className="subscription-skeleton__line"></div>
              <div className="subscription-skeleton__line"></div>
            </div>
          </div>
          <div className="subscription-skeleton__plan">
            <div className="subscription-skeleton__line"></div>
            <div className="subscription-skeleton__line"></div>
          </div>
        </div>
        <div className="subscription-skeleton__body">
          <div className="subscription-skeleton__dates">
            <div className="subscription-skeleton__line"></div>
            <div className="subscription-skeleton__line"></div>
          </div>
        </div>
        <div className="subscription-skeleton__footer">
          <div className="subscription-skeleton__badge"></div>
          <div className="subscription-skeleton__button"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="subscription-skeleton">
      <div className="subscription-skeleton__header">
        <div className="subscription-skeleton__company">
          <div className="subscription-skeleton__avatar"></div>
          <div className="subscription-skeleton__info">
            <div className="subscription-skeleton__line"></div>
            <div className="subscription-skeleton__line"></div>
          </div>
        </div>
        <div className="subscription-skeleton__badge"></div>
      </div>
      <div className="subscription-skeleton__plan">
        <div className="subscription-skeleton__line"></div>
        <div className="subscription-skeleton__line"></div>
      </div>
      <div className="subscription-skeleton__dates">
        <div className="subscription-skeleton__line"></div>
        <div className="subscription-skeleton__line"></div>
      </div>
      <div className="subscription-skeleton__footer">
        <div className="subscription-skeleton__button"></div>
      </div>
    </div>
  )
}