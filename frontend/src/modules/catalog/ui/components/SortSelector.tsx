import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useCatalogFilters } from "@/shared/stores/filters.store";
import type { SortBy, SortOrder } from "../../domain/ProductFilters";

export function SortSelector() {
  const sortBy = useCatalogFilters((s) => s.sortBy);
  const order = useCatalogFilters((s) => s.order);
  const setSortBy = useCatalogFilters((s) => s.setSortBy);
  const setOrder = useCatalogFilters((s) => s.setOrder);

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "name", label: "Nombre" },
    { value: "price", label: "Precio" },
    { value: "created_at", label: "Fecha de creación" },
  ];

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          value={sortBy || ""}
          label="Ordenar por"
          onChange={(e) => setSortBy((e.target.value as SortBy) || null)}
        >
          <MenuItem value="">Por defecto</MenuItem>
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {sortBy && (
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Orden</InputLabel>
          <Select
            value={order}
            label="Orden"
            onChange={(e) => setOrder(e.target.value as SortOrder)}
          >
            <MenuItem value="asc">Ascendente</MenuItem>
            <MenuItem value="desc">Descendente</MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
