export const ProductSkeleton = () => {
  return (
    <div className="product-skeleton">
      <div className="product-skeleton__header">
        <div className="product-skeleton__line product-skeleton__line--title"></div>
        <div className="product-skeleton__line product-skeleton__line--subtitle"></div>
      </div>
      
      <div className="product-skeleton__stats">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="product-skeleton__stat-card">
            <div className="product-skeleton__stat-icon"></div>
            <div className="product-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="product-skeleton__filters">
        <div className="product-skeleton__filter"></div>
        <div className="product-skeleton__filter"></div>
        <div className="product-skeleton__filter"></div>
        <div className="product-skeleton__filter"></div>
        <div className="product-skeleton__filter"></div>
      </div>

      <div className="product-skeleton__grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="product-skeleton__card">
            <div className="product-skeleton__card-image"></div>
            <div className="product-skeleton__card-content">
              <div className="product-skeleton__card-line"></div>
              <div className="product-skeleton__card-line"></div>
              <div className="product-skeleton__card-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}