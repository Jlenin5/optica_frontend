export const LimitSkeleton = () => {
  return (
    <div className="limit-skeleton">
      <div className="limit-skeleton__header">
        <div className="limit-skeleton__line limit-skeleton__line--title"></div>
        <div className="limit-skeleton__line limit-skeleton__line--subtitle"></div>
      </div>
      
      {[...Array(5)].map((_, index) => (
        <div key={index} className="limit-skeleton__row">
          <div className="limit-skeleton__cell limit-skeleton__cell--code"></div>
          <div className="limit-skeleton__cell limit-skeleton__cell--name"></div>
          <div className="limit-skeleton__cell limit-skeleton__cell--actions"></div>
        </div>
      ))}
    </div>
  )
}