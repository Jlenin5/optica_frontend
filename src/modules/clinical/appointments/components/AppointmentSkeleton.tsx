export const AppointmentSkeleton = () => {
  return (
    <div className="appointment-skeleton">
      <div className="appointment-skeleton__header">
        <div className="appointment-skeleton__line appointment-skeleton__line--title"></div>
        <div className="appointment-skeleton__line appointment-skeleton__line--subtitle"></div>
      </div>
      
      <div className="appointment-skeleton__stats">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="appointment-skeleton__stat-card">
            <div className="appointment-skeleton__stat-icon"></div>
            <div className="appointment-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="appointment-skeleton__filters">
        <div className="appointment-skeleton__filter"></div>
        <div className="appointment-skeleton__filter"></div>
        <div className="appointment-skeleton__filter"></div>
        <div className="appointment-skeleton__filter"></div>
      </div>

      <div className="appointment-skeleton__table">
        <div className="appointment-skeleton__table-header">
          <div className="appointment-skeleton__table-header-cell"></div>
          <div className="appointment-skeleton__table-header-cell"></div>
          <div className="appointment-skeleton__table-header-cell"></div>
          <div className="appointment-skeleton__table-header-cell"></div>
          <div className="appointment-skeleton__table-header-cell"></div>
          <div className="appointment-skeleton__table-header-cell"></div>
          <div className="appointment-skeleton__table-header-cell"></div>
          <div className="appointment-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="appointment-skeleton__table-row">
            <div className="appointment-skeleton__table-cell"></div>
            <div className="appointment-skeleton__table-cell"></div>
            <div className="appointment-skeleton__table-cell"></div>
            <div className="appointment-skeleton__table-cell"></div>
            <div className="appointment-skeleton__table-cell"></div>
            <div className="appointment-skeleton__table-cell"></div>
            <div className="appointment-skeleton__table-cell"></div>
            <div className="appointment-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}