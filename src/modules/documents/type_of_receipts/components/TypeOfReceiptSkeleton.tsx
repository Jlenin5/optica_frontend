export const TypeOfReceiptSkeleton = () => {
  return (
    <div className="type-of-receipt-skeleton">
      <div className="type-of-receipt-skeleton__header">
        <div className="type-of-receipt-skeleton__line type-of-receipt-skeleton__line--title"></div>
        <div className="type-of-receipt-skeleton__line type-of-receipt-skeleton__line--subtitle"></div>
      </div>
      
      {[...Array(5)].map((_, index) => (
        <div key={index} className="type-of-receipt-skeleton__row">
          <div className="type-of-receipt-skeleton__cell type-of-receipt-skeleton__cell--id"></div>
          <div className="type-of-receipt-skeleton__cell type-of-receipt-skeleton__cell--info"></div>
          <div className="type-of-receipt-skeleton__cell type-of-receipt-skeleton__cell--receipt"></div>
          <div className="type-of-receipt-skeleton__cell type-of-receipt-skeleton__cell--company"></div>
          <div className="type-of-receipt-skeleton__cell type-of-receipt-skeleton__cell--status"></div>
          <div className="type-of-receipt-skeleton__cell type-of-receipt-skeleton__cell--user"></div>
          <div className="type-of-receipt-skeleton__cell type-of-receipt-skeleton__cell--date"></div>
          <div className="type-of-receipt-skeleton__cell type-of-receipt-skeleton__cell--actions"></div>
        </div>
      ))}
    </div>
  )
}