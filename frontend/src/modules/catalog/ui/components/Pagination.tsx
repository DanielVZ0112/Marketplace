import { Box, Pagination as MuiPagination, Typography } from "@mui/material";
import { useCatalogFilters } from "@/shared/stores/filters.store";

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function Pagination({ total, page, limit, totalPages }: PaginationProps) {
  const setPage = useCatalogFilters((s) => s.setPage);

  if (totalPages <= 1) return null;

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 4 }}>
      <Typography variant="body2" color="text.secondary">
        Mostrando {start}-{end} de {total} productos
      </Typography>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
