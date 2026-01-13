import { Box, Paper, Button, Divider } from "@mui/material";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { SizeFilter } from "./SizeFilter";
import { ColorFilter } from "./ColorFilter";
import { SortSelector } from "./SortSelector";
import { useCatalogFilters } from "@/shared/stores/filters.store";
import type { Product } from "../../domain/Product";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./filters-sidebar.module.scss";

interface Props {
  products: Product[];
}

export function FiltersSidebar({ products }: Props) {
  const clearFilters = useCatalogFilters((s) => s.clearFilters);
  const hasActiveFilters = useCatalogFilters((s) =>
    s.search || s.categoryId || s.size || s.color || s.sortBy
  );

  return (
    <Box className={styles.filtersSidebar}>
      <Paper className={styles.filtersSidebar__container}>
        <Box className={styles.filtersSidebar__header}>
          <h3 className={styles.filtersSidebar__title}>Filtros</h3>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              className={styles.filtersSidebar__clearButton}
            >
              Limpiar
            </Button>
          )}
        </Box>

        <Box className={styles.filtersSidebar__section}>
          <label className={styles.filtersSidebar__label}>Búsqueda</label>
          <SearchBar />
        </Box>

        <Divider className={styles.filtersSidebar__divider} />

        <Box className={styles.filtersSidebar__section}>
          <label className={styles.filtersSidebar__label}>Categoría</label>
          <CategoryFilter />
        </Box>

        <Divider className={styles.filtersSidebar__divider} />

        <Box className={styles.filtersSidebar__section}>
          <label className={styles.filtersSidebar__label}>Talla</label>
          <SizeFilter products={products} />
        </Box>

        <Divider className={styles.filtersSidebar__divider} />

        <Box className={styles.filtersSidebar__section}>
          <label className={styles.filtersSidebar__label}>Color</label>
          <ColorFilter products={products} />
        </Box>

        <Divider className={styles.filtersSidebar__divider} />

        <Box className={styles.filtersSidebar__section}>
          <label className={styles.filtersSidebar__label}>Ordenar</label>
          <SortSelector />
        </Box>
      </Paper>
    </Box>
  );
}
