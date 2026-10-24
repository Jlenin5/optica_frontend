export const FeatureSkeleton = () => {
  return (
    <div className="feature-skeleton">
      <div className="feature-skeleton__header">
        <div className="feature-skeleton__line feature-skeleton__line--title"></div>
        <div className="feature-skeleton__line feature-skeleton__line--subtitle"></div>
      </div>
      
      {[...Array(5)].map((_, index) => (
        <div key={index} className="feature-skeleton__row">
          <div className="feature-skeleton__cell feature-skeleton__cell--code"></div>
          <div className="feature-skeleton__cell feature-skeleton__cell--name"></div>
          <div className="feature-skeleton__cell feature-skeleton__cell--description"></div>
          <div className="feature-skeleton__cell feature-skeleton__cell--actions"></div>
        </div>
      ))}
    </div>
  )
}