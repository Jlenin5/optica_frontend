import type { StockItem } from "../types/stock.types";
import MuiSvgIcon from "@/components/MuiSvgIcon";
const stockClass = (x: StockItem) =>
  x.quantity <= 0
    ? "is-out"
    : x.quantity <= Number(x.min_stock ?? 10)
      ? "is-low"
      : "is-ok";
export const StockTable = ({
  data,
  onMovement,
}: {
  data: StockItem[];
  onMovement: (x: StockItem) => void;
}) => (
  <div className="stock-table-wrap">
    <table className="stock-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Ubicación</th>
          <th>Disponible</th>
          <th>Reservado</th>
          <th>Mínimo</th>
          <th>Estado</th>
          <th>Actualizado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <tr
            key={`${x.location_type}-${x.location_id}-${x.product_id}-${x.id}`}
          >
            <td>
              <div className="stock-product">
                <span className="stock-product__icon">
                  <MuiSvgIcon size={18}>lucide:package</MuiSvgIcon>
                </span>
                <div>
                  <strong>{x.product_name}</strong>
                  <small>{x.product_sku || "Sin SKU"}</small>
                </div>
              </div>
            </td>
            <td>
              <span className="stock-location">
                <MuiSvgIcon size={15}>
                  {x.location_type === "warehouse"
                    ? "lucide:warehouse"
                    : "lucide:store"}
                </MuiSvgIcon>
                {x.warehouse_name || x.store_name || "Sin ubicación"}
              </span>
            </td>
            <td>
              <strong>{x.available_quantity ?? x.quantity}</strong>
            </td>
            <td>{x.reserved_quantity ?? 0}</td>
            <td>{x.min_stock ?? 10}</td>
            <td>
              <span className={`stock-status ${stockClass(x)}`}>
                {x.quantity <= 0
                  ? "Sin stock"
                  : x.quantity <= Number(x.min_stock ?? 10)
                    ? "Stock bajo"
                    : "Disponible"}
              </span>
            </td>
            <td>
              {x.updated_at
                ? new Date(x.updated_at).toLocaleDateString("es-PE")
                : "-"}
            </td>
            <td>
              <button
                className="stock-action"
                onClick={() => onMovement(x)}
                title="Registrar movimiento"
              >
                <MuiSvgIcon size={17}>lucide:arrow-right-left</MuiSvgIcon>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);