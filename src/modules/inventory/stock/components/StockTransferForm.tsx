import { useState } from "react";
import { useProducts } from "@/modules/inventory/products/hooks/useProducts";
import { useWarehouses } from "@/modules/organizations/warehouses/hooks/useWarehouses";
import { useStores } from "@/modules/organizations/stores/hooks/useStores";
import { useCreateStockTransfer } from "../hooks/useStockMutations";
export const StockTransferForm = ({ onDone }: { onDone: () => void }) => {
  const [productId, setProductId] = useState(0),
    [quantity, setQuantity] = useState(1),
    [fromType, setFromType] = useState<"warehouse" | "store">("warehouse"),
    [toType, setToType] = useState<"warehouse" | "store">("store"),
    [fromId, setFromId] = useState(0),
    [toId, setToId] = useState(0),
    [notes, setNotes] = useState("");
  const products =
    useProducts({ product_type: "product" }).data?.pages.flatMap(
      (p) => p.results,
    ) || [];
  const wh =
    useWarehouses({ status: true }).data?.pages.flatMap((p) => p.results) || [];
  const st =
    useStores({ status: true }).data?.pages.flatMap((p) => p.results) || [];
  const from = fromType === "warehouse" ? wh : st,
    to = toType === "warehouse" ? wh : st;
  const { mutate, isPending } = useCreateStockTransfer();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !productId ||
      !fromId ||
      !toId ||
      (fromType === toType && fromId === toId)
    )
      return;
    mutate(
      {
        product_id: productId,
        quantity,
        from_warehouse_id: fromType === "warehouse" ? fromId : null,
        from_store_id: fromType === "store" ? fromId : null,
        to_warehouse_id: toType === "warehouse" ? toId : null,
        to_store_id: toType === "store" ? toId : null,
        notes: notes || null,
      },
      { onSuccess: onDone },
    );
  };
  const select = (id: number, setI: any, list: any, label: string) => (
    <label>
      {label}
      <select value={id} onChange={(e) => setI(Number(e.target.value))}>
        <option value={0}>Seleccionar</option>
        {list.map((x: any) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <form id="stock-transfer-form" className="stock-form" onSubmit={submit}>
      <div className="stock-form__grid">
        <label>
          Producto
          <select
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
          >
            <option value={0}>Seleccionar</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cantidad
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
          />
        </label>
        <label>
          Origen tipo
          <select
            value={fromType}
            onChange={(e) => {
              setFromType(e.target.value as any);
              setFromId(0);
            }}
          >
            <option value="warehouse">Almacén</option>
            <option value="store">Tienda</option>
          </select>
        </label>
        {select(fromId, setFromId, from, "Origen")}
        <label>
          Destino tipo
          <select
            value={toType}
            onChange={(e) => {
              setToType(e.target.value as any);
              setToId(0);
            }}
          >
            <option value="warehouse">Almacén</option>
            <option value="store">Tienda</option>
          </select>
        </label>
        {select(toId, setToId, to, "Destino")}
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
        {isPending ? "Transfiriendo..." : "Realizar transferencia"}
      </button>
    </form>
  );
};
