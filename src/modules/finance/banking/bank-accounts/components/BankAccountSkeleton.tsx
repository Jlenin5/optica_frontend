export const BankAccountSkeleton = () => {
  return (
    <div className="bank-account-skeleton">
      <div className="bank-account-skeleton__header">
        <div className="bank-account-skeleton__line bank-account-skeleton__line--title"></div>
        <div className="bank-account-skeleton__line bank-account-skeleton__line--subtitle"></div>
      </div>
      
      <div className="bank-account-skeleton__stats">
        <div className="bank-account-skeleton__stat-card">
          <div className="bank-account-skeleton__stat-icon"></div>
          <div className="bank-account-skeleton__stat-line"></div>
        </div>
      </div>

      <div className="bank-account-skeleton__filters">
        <div className="bank-account-skeleton__filter"></div>
        <div className="bank-account-skeleton__filter"></div>
        <div className="bank-account-skeleton__filter"></div>
      </div>

      <div className="bank-account-skeleton__table">
        <div className="bank-account-skeleton__table-header">
          <div className="bank-account-skeleton__table-header-cell"></div>
          <div className="bank-account-skeleton__table-header-cell"></div>
          <div className="bank-account-skeleton__table-header-cell"></div>
          <div className="bank-account-skeleton__table-header-cell"></div>
          <div className="bank-account-skeleton__table-header-cell"></div>
          <div className="bank-account-skeleton__table-header-cell"></div>
          <div className="bank-account-skeleton__table-header-cell"></div>
        </div>
        
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bank-account-skeleton__table-row">
            <div className="bank-account-skeleton__table-cell"></div>
            <div className="bank-account-skeleton__table-cell"></div>
            <div className="bank-account-skeleton__table-cell"></div>
            <div className="bank-account-skeleton__table-cell"></div>
            <div className="bank-account-skeleton__table-cell"></div>
            <div className="bank-account-skeleton__table-cell"></div>
            <div className="bank-account-skeleton__table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}