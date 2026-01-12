import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useMemo } from "react";
import type { Product } from "../../domain/Product";
import { useCatalogFilters } from "../../../../shared/stores/filters.store";

interface Props {
  products: Product[];
}

export function ColorFilter({ products }: Props) {
  const color = useCatalogFilters((s) => s.color);
  const setColor = useCatalogFilters((s) => s.setColor);
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((product) => {
      product.variants?.forEach((variant) => {
        if (variant.color) colors.add(variant.color);
      });
    });
    return Array.from(colors).sort();
  }, [products]);

  if (availableColors.length === 0) return null;

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel>Color</InputLabel>
        <Select
          value={color || ""}
          label="Color"
          onChange={(e) => setColor(e.target.value || null)}
        >
          <MenuItem value="">Todos los colores</MenuItem>
          {availableColors.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
