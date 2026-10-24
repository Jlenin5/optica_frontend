export const ReceiptSkeleton = () => {
  return (
    <div className="receipt-skeleton">
      <div className="receipt-skeleton__header">
        <div className="receipt-skeleton__line receipt-skeleton__line--title"></div>
        <div className="receipt-skeleton__line receipt-skeleton__line--subtitle"></div>
      </div>
      
      {[...Array(5)].map((_, index) => (
        <div key={index} className="receipt-skeleton__row">
          <div className="receipt-skeleton__cell receipt-skeleton__cell--id"></div>
          <div className="receipt-skeleton__cell receipt-skeleton__cell--description"></div>
          <div className="receipt-skeleton__cell receipt-skeleton__cell--status"></div>
          <div className="receipt-skeleton__cell receipt-skeleton__cell--user"></div>
          <div className="receipt-skeleton__cell receipt-skeleton__cell--date"></div>
          <div className="receipt-skeleton__cell receipt-skeleton__cell--actions"></div>
        </div>
      ))}
    </div>
  )
}