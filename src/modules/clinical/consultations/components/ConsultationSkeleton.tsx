export const ConsultationSkeleton = () => {
  return (
    <div className="evaluation-skeleton">
      <div className="evaluation-skeleton__header">
        <div className="skeleton skeleton--title"></div>
        <div className="skeleton skeleton--text"></div>
      </div>
      <div className="evaluation-skeleton__content">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="evaluation-skeleton__field">
            <div className="skeleton skeleton--label"></div>
            <div className="skeleton skeleton--input"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
