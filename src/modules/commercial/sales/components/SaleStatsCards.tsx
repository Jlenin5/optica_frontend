import React from "react";
import type { SaleStats } from "../types/sales.types";
import MuiSvgIcon from '@components/MuiSvgIcon';

interface SaleStatsCardsProps {
  stats: SaleStats;
}

export const SaleStatsCards: React.FC<SaleStatsCardsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  const cards = [
    {
      title: "Total Ventas",
      value: stats.total_sales,
      subtitle: "ventas registradas",
      icon: "lucide:shopping-cart",
      color: "#3b82f6",
    },
    {
      title: "Monto Total",
      value: formatCurrency(stats.total_amount),
      subtitle: "facturado",
      icon: "lucide:credit-card",
      color: "#10b981",
    },
    {
      title: "Ticket Promedio",
      value: formatCurrency(stats.average_ticket),
      subtitle: "por venta",
      icon: "lucide:calculator",
      color: "#f59e0b",
    },
    {
      title: "Ventas Hoy",
      value: stats.today_sales,
      subtitle: `por ${formatCurrency(stats.today_amount)}`,
      icon: "lucide:calendar",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="sale-stats">
      {cards.map((card, index) => (
        <div key={index} className="sale-stats__card">
          <div className="sale-stats__card-header">
            <div className="sale-stats__card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
          </div>
          <div className="sale-stats__card-body">
            <h3 className="sale-stats__card-title">{card.title}</h3>
            <p className="sale-stats__card-value">{card.value}</p>
            <p className="sale-stats__card-subtitle">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};