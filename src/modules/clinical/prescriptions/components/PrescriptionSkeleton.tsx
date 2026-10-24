export const PrescriptionSkeleton = () => {
  return (
    <div className="prescription-skeleton">
      <div className="prescription-skeleton__header">
        <div className="prescription-skeleton__line prescription-skeleton__line--title"></div>
        <div className="prescription-skeleton__line prescription-skeleton__line--subtitle"></div>
      </div>
      
      <div className="prescription-skeleton__content">
        <div className="prescription-skeleton__section">
          <div className="prescription-skeleton__section-title"></div>
          <div className="prescription-skeleton__row">
            <div className="prescription-skeleton__field"></div>
            <div className="prescription-skeleton__field"></div>
          </div>
        </div>
        
        <div className="prescription-skeleton__section">
          <div className="prescription-skeleton__section-title"></div>
          <div className="prescription-skeleton__row">
            <div className="prescription-skeleton__field"></div>
            <div className="prescription-skeleton__field"></div>
          </div>
        </div>
        
        <div className="prescription-skeleton__actions">
          <div className="prescription-skeleton__btn"></div>
          <div className="prescription-skeleton__btn"></div>
        </div>
      </div>
    </div>
  )
}