import React from "react";
import type { Sale } from "../types/sales.types";
import MuiSvgIcon from '@components/MuiSvgIcon';

interface SalesTableProps {
  data: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({ data, onEdit, onDelete, onView }) => {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(amount));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-PE');
  };

  return (
    <div className="sales-table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Subtotal</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sale) => (
            <tr key={sale?.id}>
              <td>{sale?.document_code || 'N/A'}</td>
              <td>{sale?.patient?.first_name || 'N/A'}</td>
              <td>{formatDate(sale?.issue_date)}</td>
              <td>{formatCurrency(sale?.subtotal)}</td>
              <td className="sales-table__total">{formatCurrency(sale?.total)}</td>
              <td>
                <span className={`sales-table__status sales-table__status--${sale?.sale_status?.name?.toLowerCase() || 'default'}`}>
                  {sale?.sale_status?.name || 'Desconocido'}
                </span>
              </td>
              <td className="sales-table__actions">
                <button onClick={() => onView(sale?.id)} className="sales-table__action-btn sales-table__action-btn--view" title="Ver">
                  <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
                </button>
                <button onClick={() => onEdit(sale)} className="sales-table__action-btn sales-table__action-btn--edit" title="Editar">
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button onClick={() => onDelete(sale?.id)} className="sales-table__action-btn sales-table__action-btn--delete" title="Eliminar">
                  <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};