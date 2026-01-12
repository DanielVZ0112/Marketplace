import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useMemo } from "react";
import type { Product } from "../../domain/Product";
import { useCatalogFilters } from "../../../../shared/stores/filters.store";

interface Props {
  products: Product[];
}

export function SizeFilter({ products }: Props) {
  const size = useCatalogFilters((s) => s.size);
  const setSize = useCatalogFilters((s) => s.setSize);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((product) => {
      product.variants?.forEach((variant) => {
        if (variant.size) sizes.add(variant.size);
      });
    });
    return Array.from(sizes).sort();
  }, [products]);

  if (availableSizes.length === 0) return null;

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel>Talla</InputLabel>
        <Select
          value={size || ""}
          label="Talla"
          onChange={(e) => setSize(e.target.value || null)}
        >
          <MenuItem value="">Todas las tallas</MenuItem>
          {availableSizes.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
