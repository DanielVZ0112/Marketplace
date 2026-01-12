import { Box, Button, Paper, Divider } from "@mui/material";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { SizeFilter } from "./SizeFilter";
import { ColorFilter } from "./ColorFilter";
import { SortSelector } from "./SortSelector";
import { useCatalogFilters } from "../../../../shared/stores/filters.store";
import type { Product } from "../../domain/Product";
import ClearIcon from "@mui/icons-material/Clear";

interface Props {
  products: Product[];
}

export function FiltersBar({ products }: Props) {
  const clearFilters = useCatalogFilters((s) => s.clearFilters);
  const hasActiveFilters = useCatalogFilters((s) =>
    s.search || s.categoryId || s.size || s.color || s.sortBy
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <SearchBar />
        </Box>

        <CategoryFilter />
        <SizeFilter products={products} />
        <ColorFilter products={products} />

        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
          >
            Limpiar
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SortSelector />
      </Box>
    </Paper>
  );
}
