export const MedicalRecordSkeleton = () => {
  return (
    <div className="medical-record-skeleton">
      <div className="medical-record-skeleton__header">
        <div className="skeleton skeleton--title"></div>
      </div>
      <div className="medical-record-skeleton__content">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="medical-record-skeleton__field">
            <div className="skeleton skeleton--label"></div>
            <div className="skeleton skeleton--input"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
