export const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      <div className="dashboard-skeleton__banner"></div>
      <div className="dashboard-skeleton__stats">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="dashboard-skeleton__stat"></div>
        ))}
      </div>
      <div className="dashboard-skeleton__charts">
        <div className="dashboard-skeleton__chart"></div>
        <div className="dashboard-skeleton__chart"></div>
      </div>
      <div className="dashboard-skeleton__bottom">
        <div className="dashboard-skeleton__recent"></div>
        <div className="dashboard-skeleton__products"></div>
      </div>
    </div>
  )
}