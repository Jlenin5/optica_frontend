import { useParams, useNavigate } from "react-router-dom";
import { useSale } from "../hooks/useSale";
import { CashRegisterSkeleton } from "@/modules/finance/cash/cash_registers/components/CashRegisterSkeleton";
import MuiSvgIcon from '@components/MuiSvgIcon';
import "@styles/sales.scss";

export const SaleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sale, isLoading } = useSale(Number(id));

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(amount));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <CashRegisterSkeleton />;
  }

  if (!sale) {
    return (
      <div className="sale-detail-error">
        <div className="sale-detail-error__content">
          <h2>Venta no encontrada</h2>
          <button onClick={() => navigate('/sales')}>
            Volver a Ventas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sale-detail-page">
      <div className="sale-detail-page__header">
        <button 
          className="sale-detail-page__back-btn"
          onClick={() => navigate('/sales')}
        >
          <MuiSvgIcon size={20}>lucide:arrow-left</MuiSvgIcon>
          Volver
        </button>
        <h1 className="sale-detail-page__title">
          Venta {sale.document_code || 'Sin documento'}
        </h1>
        <span className={`sale-detail-page__status sale-detail-page__status--${sale.sale_status?.name?.toLowerCase() || 'default'}`}>
          {sale.sale_status?.name || 'Desconocido'}
        </span>
      </div>

      <div className="sale-detail-page__grid">
        <div className="sale-detail-page__card">
          <h3 className="sale-detail-page__card-title">
            <MuiSvgIcon size={20}>lucide:info</MuiSvgIcon>
            Información General
          </h3>
          <div className="sale-detail-page__info-row">
            <span className="sale-detail-page__info-label">Documento:</span>
            <span className="sale-detail-page__info-value">{sale.document_code || 'N/A'}</span>
          </div>
          <div className="sale-detail-page__info-row">
            <span className="sale-detail-page__info-label">Fecha:</span>
            <span className="sale-detail-page__info-value">{formatDate(sale.issue_date)}</span>
          </div>
          <div className="sale-detail-page__info-row">
            <span className="sale-detail-page__info-label">Cliente:</span>
            <span className="sale-detail-page__info-value">{sale.patient?.first_name || 'N/A'}</span>
          </div>
          <div className="sale-detail-page__info-row">
            <span className="sale-detail-page__info-label">Documento Cliente:</span>
            <span className="sale-detail-page__info-value">{sale.patient?.document_number || 'N/A'}</span>
          </div>
          {sale.appointment_id && (
            <div className="sale-detail-page__info-row">
              <span className="sale-detail-page__info-label">Cita de origen:</span>
              <button
                type="button"
                className="sale-detail-page__info-value"
                onClick={() => navigate(`/appointments/${sale.appointment_id}`)}
              >
                Cita #{sale.appointment_id}
              </button>
            </div>
          )}
        </div>

        <div className="sale-detail-page__card">
          <h3 className="sale-detail-page__card-title">
            <MuiSvgIcon size={20}>lucide:credit-card</MuiSvgIcon>
            Información de Pago
          </h3>
          <div className="sale-detail-page__info-row">
            <span className="sale-detail-page__info-label">Método de pago:</span>
            <span className="sale-detail-page__info-value">{sale.payment_method?.description || 'N/A'}</span>
          </div>
          <div className="sale-detail-page__info-row">
            <span className="sale-detail-page__info-label">Tipo de pago:</span>
            <span className="sale-detail-page__info-value">{sale.payment_type?.description || 'N/A'}</span>
          </div>
          <div className="sale-detail-page__info-row">
            <span className="sale-detail-page__info-label">Moneda:</span>
            <span className="sale-detail-page__info-value">{sale.currency?.name || 'N/A'}</span>
          </div>
          <div className="sale-detail-page__info-row">
            <span className="sale-detail-page__info-label">Tipo de cambio:</span>
            <span className="sale-detail-page__info-value">{sale.exchange_rate}</span>
          </div>
        </div>

        <div className="sale-detail-page__card sale-detail-page__card--totals">
          <h3 className="sale-detail-page__card-title">
            <MuiSvgIcon size={20}>lucide:calculator</MuiSvgIcon>
            Totales
          </h3>
          <div className="sale-detail-page__totals">
            <div className="sale-detail-page__total-row">
              <span>Subtotal:</span>
              <strong>{formatCurrency(sale.subtotal)}</strong>
            </div>
            {sale.discount && Number(sale.discount) > 0 && (
              <div className="sale-detail-page__total-row sale-detail-page__total-row--discount">
                <span>Descuento:</span>
                <strong>-{formatCurrency(sale.discount)}</strong>
              </div>
            )}
            <div className="sale-detail-page__total-row sale-detail-page__total-row--grand">
              <span>Total:</span>
              <strong>{formatCurrency(sale.total)}</strong>
            </div>
            <div className="sale-detail-page__total-row">
              <span>Total pagado:</span>
              <strong>{formatCurrency(sale.total_paid)}</strong>
            </div>
            <div className="sale-detail-page__total-row">
              <span>Vuelto:</span>
              <strong>{formatCurrency(sale.change_amount)}</strong>
            </div>
          </div>
        </div>
      </div>

      {sale.details && sale.details.length > 0 && (
        <div className="sale-detail-page__card">
          <h3 className="sale-detail-page__card-title">
            <MuiSvgIcon size={20}>lucide:package</MuiSvgIcon>
            Productos
          </h3>
          <div className="sale-detail-page__products">
            <table className="sale-detail-page__products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Descuento</th>
                  <th>Subtotal</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.details.map((detail) => (
                  <tr key={detail.id}>
                    <td>
                      <div className="sale-detail-page__product-cell">
                        <span>
                          {detail.item_type === 'custom'
                            ? detail.custom_name
                            : (detail.product_name || detail.product?.name)}
                        </span>
                        {detail.item_type === 'custom' && (
                          <span className="sale-detail-page__item-badge">
                            Personalizado
                          </span>
                        )}
                        {detail.item_type === 'custom' && detail.custom_description && (
                          <p className="sale-detail-page__product-specs">{detail.custom_description}</p>
                        )}
                      </div>
                    </td>
                    <td>{detail.quantity}</td>
                    <td>{formatCurrency(detail.price)}</td>
                    <td>{formatCurrency(detail.discount)}</td>
                    <td>{formatCurrency(detail.subtotal)}</td>
                    <td className="sale-detail-page__product-total">{formatCurrency(detail.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};