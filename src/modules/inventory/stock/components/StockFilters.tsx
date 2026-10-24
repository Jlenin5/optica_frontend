import MuiSvgIcon from "@/components/MuiSvgIcon";
export const StockFilters = ({
  search,
  onSearchChange,
  low,
  onLowChange,
  onClear,
  total,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  low: boolean;
  onLowChange: (v: boolean) => void;
  onClear: () => void;
  total: number;
}) => (
  <div className="stock-filters">
    <div className="stock-filters__search">
      <MuiSvgIcon size={18}>lucide:search</MuiSvgIcon>
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar por producto o SKU..."
      />
      {search && (
        <button onClick={() => onSearchChange("")}>
          <MuiSvgIcon size={15}>lucide:x</MuiSvgIcon>
        </button>
      )}
    </div>
    <button
      className={low ? "filter-active" : ""}
      onClick={() => onLowChange(!low)}
    >
      <MuiSvgIcon size={16}>lucide:triangle-alert</MuiSvgIcon>Stock bajo
    </button>
    <button onClick={onClear}>
      <MuiSvgIcon size={16}>lucide:eraser</MuiSvgIcon>Limpiar
    </button>
    <span>{total} resultados</span>
  </div>
);