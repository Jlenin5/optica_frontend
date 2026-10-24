export const PatientSkeleton = () => {
  return (
    <div className="patient-skeleton">
      <div className="patient-skeleton__header">
        <div className="patient-skeleton__line patient-skeleton__line--title"></div>
        <div className="patient-skeleton__line patient-skeleton__line--subtitle"></div>
      </div>
      
      <div className="patient-skeleton__stats">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="patient-skeleton__stat-card">
            <div className="patient-skeleton__stat-icon"></div>
            <div className="patient-skeleton__stat-line"></div>
          </div>
        ))}
      </div>

      <div className="patient-skeleton__filters">
        <div className="patient-skeleton__filter"></div>
        <div className="patient-skeleton__filter"></div>
        <div className="patient-skeleton__filter"></div>
        <div className="patient-skeleton__filter"></div>
      </div>

      <div className="patient-skeleton__table">
        <div className="patient-skeleton__table-header">
          <div className="patient-skeleton__table-header-cell"></div>
          <div className="patient-skeleton__table-header-cell"></div>
          <div className="patient-skeleton__table-header-cell"></div>
          <div className="patient-skeleton__table-header-cell"></div>
          <div className="patient-skeleton__table-header-cell"></div>
          <div className="patient-skeleton__table-header-cell"></div>
          <div className="patient-skeleton__table-header-cell"></div>
          <div className="patient-skeleton__table-header-cell"></div>
          <div className="patient-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="patient-skeleton__table-row">
            <div className="patient-skeleton__table-cell"></div>
            <div className="patient-skeleton__table-cell"></div>
            <div className="patient-skeleton__table-cell"></div>
            <div className="patient-skeleton__table-cell"></div>
            <div className="patient-skeleton__table-cell"></div>
            <div className="patient-skeleton__table-cell"></div>
            <div className="patient-skeleton__table-cell"></div>
            <div className="patient-skeleton__table-cell"></div>
            <div className="patient-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}