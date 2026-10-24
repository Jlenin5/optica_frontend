export const CategorySkeleton = () => {
  return (
    <div className="category-skeleton">
      <div className="category-skeleton__header">
        <div className="category-skeleton__line category-skeleton__line--title"></div>
        <div className="category-skeleton__line category-skeleton__line--subtitle"></div>
      </div>
      
      <div className="category-skeleton__stats">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="category-skeleton__stat-card">
            <div className="category-skeleton__stat-icon"></div>
            <div className="category-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="category-skeleton__filters">
        <div className="category-skeleton__filter"></div>
        <div className="category-skeleton__filter"></div>
        <div className="category-skeleton__filter"></div>
        <div className="category-skeleton__filter"></div>
      </div>

      <div className="category-skeleton__grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="category-skeleton__card">
            <div className="category-skeleton__card-image"></div>
            <div className="category-skeleton__card-content">
              <div className="category-skeleton__card-line"></div>
              <div className="category-skeleton__card-line"></div>
              <div className="category-skeleton__card-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}