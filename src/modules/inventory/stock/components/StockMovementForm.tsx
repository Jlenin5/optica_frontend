import { useEffect, useState } from "react";
import { useProducts } from "@/modules/inventory/products/hooks/useProducts";
import { useWarehouses } from "@/modules/organizations/warehouses/hooks/useWarehouses";
import { useStores } from "@/modules/organizations/stores/hooks/useStores";
import type { StockItem } from "../types/stock.types";
import { useCreateStockMovement } from "../hooks/useStockMutations";
export const StockMovementForm = ({
  item,
  onDone,
}: {
  item?: StockItem | null;
  onDone: () => void;
}) => {
  const [productId, setProductId] = useState(item?.product_id || 0),
    [type, setType] = useState<"entry" | "exit" | "adjustment" | "return">(
      "entry",
    ),
    [quantity, setQuantity] = useState(1),
    [location, setLocation] = useState<"warehouse" | "store">(
      item?.location_type || "warehouse",
    ),
    [locationId, setLocationId] = useState(item?.location_id || 0),
    [reference, setReference] = useState(""),
    [notes, setNotes] = useState("");
  const products =
    useProducts({ product_type: "product" }).data?.pages.flatMap(
      (p) => p.results,
    ) || [];
  const warehouses =
    useWarehouses({ status: true }).data?.pages.flatMap((p) => p.results) || [];
  const stores =
    useStores({ status: true }).data?.pages.flatMap((p) => p.results) || [];
  const { mutate, isPending } = useCreateStockMovement();
  useEffect(() => {
    if (item) {
      setProductId(item.product_id);
      setLocation(item.location_type);
      setLocationId(item.location_id);
    }
  }, [item]);
  const locations = location === "warehouse" ? warehouses : stores;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !locationId || quantity <= 0) return;
    mutate(
      {
        product_id: productId,
        movement_type: type,
        quantity,
        warehouse_id: location === "warehouse" ? locationId : null,
        store_id: location === "store" ? locationId : null,
        reference: reference || null,
        notes: notes || null,
      },
      { onSuccess: onDone },
    );
  };
  return (
    <form id="stock-movement-form" className="stock-form" onSubmit={submit}>
      <div className="stock-form__grid">
        <label>
          Producto
          <select
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
            disabled={!!item}
          >
            <option value={0}>Seleccionar producto</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="entry">Entrada</option>
            <option value="exit">Salida</option>
            <option value="adjustment">Ajuste</option>
            <option value="return">Devolución</option>
          </select>
        </label>
        <label>
          Cantidad
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
          />
        </label>
        <label>
          Ubicación
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value as any);
              setLocationId(0);
            }}
            disabled={!!item}
          >
            <option value="warehouse">Almacén</option>
            <option value="store">Tienda</option>
          </select>
        </label>
        <label>
          Destino
          <select
            value={locationId}
            onChange={(e) => setLocationId(Number(e.target.value))}
            disabled={!!item}
          >
            <option value={0}>Seleccionar</option>
            {locations.map((x: any) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Referencia
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="OC, factura, nota..."
          />
        </label>
      </div>
      <label>
        Observación
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </label>
      <button className="stock-submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Registrar movimiento"}
      </button>
    </form>
  );
};