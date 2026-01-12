import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useGetCategories } from "../../application/useGetCategories";
import { useCatalogFilters } from "../../../../shared/stores/filters.store";

export function CategoryFilter() {
  const { data: categories } = useGetCategories();
  const categoryId = useCatalogFilters((s) => s.categoryId);
  const setCategoryId = useCatalogFilters((s) => s.setCategoryId);

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel>Categoría</InputLabel>
        <Select
          value={categoryId || ""}
          label="Categoría"
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {categories?.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
