export const BrandSkeleton = () => {
  return (
    <div className="brand-skeleton">
      <div className="brand-skeleton__header">
        <div className="brand-skeleton__line brand-skeleton__line--title"></div>
        <div className="brand-skeleton__line brand-skeleton__line--subtitle"></div>
      </div>
      
      <div className="brand-skeleton__stats">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="brand-skeleton__stat-card">
            <div className="brand-skeleton__stat-icon"></div>
            <div className="brand-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="brand-skeleton__filters">
        <div className="brand-skeleton__filter"></div>
        <div className="brand-skeleton__filter"></div>
        <div className="brand-skeleton__filter"></div>
        <div className="brand-skeleton__filter"></div>
      </div>

      <div className="brand-skeleton__grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="brand-skeleton__card">
            <div className="brand-skeleton__card-image"></div>
            <div className="brand-skeleton__card-content">
              <div className="brand-skeleton__card-line"></div>
              <div className="brand-skeleton__card-line"></div>
              <div className="brand-skeleton__card-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}