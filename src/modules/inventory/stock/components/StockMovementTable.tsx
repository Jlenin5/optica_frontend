import type { StockMovement } from "../types/stock.types";
const labels: Record<string, string> = {
  entry: "Entrada",
  exit: "Salida",
  adjustment: "Ajuste",
  transfer_in: "Transferencia entrada",
  transfer_out: "Transferencia salida",
  sale: "Venta",
  return: "Devolución",
};
export const StockMovementTable = ({ data }: { data: StockMovement[] }) => (
  <div className="stock-table-wrap">
    <table className="stock-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Producto</th>
          <th>Movimiento</th>
          <th>Cantidad</th>
          <th>Resultado</th>
          <th>Ubicación</th>
          <th>Referencia</th>
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <tr key={x.id}>
            <td>{new Date(x.created_at).toLocaleString("es-PE")}</td>
            <td>
              <strong>{x.product_name || `#${x.product_id}`}</strong>
            </td>
            <td>
              <span className={`movement-badge movement-${x.movement_type}`}>
                {labels[x.movement_type] || x.movement_type}
              </span>
            </td>
            <td>
              {["entry", "transfer_in", "return"].includes(x.movement_type)
                ? "+"
                : "-"}
              {x.quantity}
            </td>
            <td>{x.resulting_quantity ?? "-"}</td>
            <td>{x.warehouse_name || x.store_name || "-"}</td>
            <td>{x.reference || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);