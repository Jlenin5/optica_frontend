import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ModulePagination,
  useModulePagination,
} from "@/components/ui/module/ModulePagination";
import { AppModal } from "@/components/ui/modal";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import { useStock, useStockMovements, useStockStats } from "../hooks/useStock";
import { StockFilters } from "../components/StockFilters";
import { StockTable } from "../components/StockTable";
import { StockMovementTable } from "../components/StockMovementTable";
import { StockMovementForm } from "../components/StockMovementForm";
import { StockTransferForm } from "../components/StockTransferForm";
import type { StockItem } from "../types/stock.types";
import "@styles/stock.scss";
export const StockPage = () => {
  const [tab, setTab] = useState<"stock" | "movements">("stock"),
    [search, setSearch] = useState(""),
    [low, setLow] = useState(false),
    [modal, setModal] = useState<"movement" | "transfer" | null>(null),
    [selected, setSelected] = useState<StockItem | null>(null);
  const q = useDebounce(search, 350);
  const stock = useStock({
    search: q || undefined,
    low_stock: low || undefined,
  });
  const movements = useStockMovements({ search: q || undefined });
  const stats = useStockStats();
  const items = stock.data?.pages.flatMap((p) => p.results) || [];
  const total = stock.data?.pages[0]?.count || 0;
  const pager = useModulePagination({
    data: items,
    total,
    fetchNextPage: stock.fetchNextPage,
    hasNextPage: stock.hasNextPage,
    isFetchingNextPage: stock.isFetchingNextPage,
  });
  const moveItems = movements.data?.pages.flatMap((p) => p.results) || [];
  return (
    <div className="stock-page">
      <header className="stock-page__header">
        <div>
          <h1>Stock</h1>
          <p>
            Controla existencias, movimientos y transferencias entre almacenes y
            tiendas.
          </p>
        </div>
        <div className="stock-page__actions">
          <button
            onClick={() => {
              setSelected(null);
              setModal("transfer");
            }}
          >
            <MuiSvgIcon size={17}>lucide:arrow-right-left</MuiSvgIcon>Transferir
          </button>
          <button
            className="primary"
            onClick={() => {
              setSelected(null);
              setModal("movement");
            }}
          >
            <MuiSvgIcon size={17}>lucide:plus</MuiSvgIcon>Movimiento
          </button>
        </div>
      </header>
      <section className="stock-stats">
        <article>
          <MuiSvgIcon size={20}>lucide:package</MuiSvgIcon>
          <span>
            Productos<strong>{stats.data?.total_products ?? "-"}</strong>
          </span>
        </article>
        <article>
          <MuiSvgIcon size={20}>lucide:boxes</MuiSvgIcon>
          <span>
            Unidades<strong>{stats.data?.total_units ?? "-"}</strong>
          </span>
        </article>
        <article>
          <MuiSvgIcon size={20}>lucide:triangle-alert</MuiSvgIcon>
          <span>
            Stock bajo<strong>{stats.data?.low_stock ?? "-"}</strong>
          </span>
        </article>
        <article>
          <MuiSvgIcon size={20}>lucide:circle-x</MuiSvgIcon>
          <span>
            Sin stock<strong>{stats.data?.out_of_stock ?? "-"}</strong>
          </span>
        </article>
      </section>
      <div className="stock-tabs">
        <button
          className={tab === "stock" ? "active" : ""}
          onClick={() => setTab("stock")}
        >
          Existencias
        </button>
        <button
          className={tab === "movements" ? "active" : ""}
          onClick={() => setTab("movements")}
        >
          Movimientos
        </button>
      </div>
      <StockFilters
        search={search}
        onSearchChange={setSearch}
        low={low}
        onLowChange={setLow}
        onClear={() => {
          setSearch("");
          setLow(false);
        }}
        total={tab === "stock" ? total : movements.data?.pages[0]?.count || 0}
      />
      {tab === "stock" ? (
        <>
          <StockTable
            data={pager.visibleData}
            onMovement={(x) => {
              setSelected(x);
              setModal("movement");
            }}
          />
          <ModulePagination
            page={pager.page}
            pageCount={pager.pageCount}
            pageSize={pager.pageSize}
            total={total}
            setPage={pager.setPage}
            setPageSize={pager.setPageSize}
            isLoading={stock.isFetchingNextPage}
          />
        </>
      ) : (
        <StockMovementTable data={moveItems} />
      )}{" "}
      {modal === "movement" && (
        <AppModal
          title={
            selected
              ? `Movimiento: ${selected.product_name}`
              : "Registrar movimiento"
          }
          onClose={() => setModal(null)}
          size="md"
        >
          <StockMovementForm item={selected} onDone={() => setModal(null)} />
        </AppModal>
      )}
      {modal === "transfer" && (
        <AppModal
          title="Transferir stock"
          onClose={() => setModal(null)}
          size="md"
        >
          <StockTransferForm onDone={() => setModal(null)} />
        </AppModal>
      )}
    </div>
  );
};