import { Box, Typography } from "@mui/material";
import { useGetInsumos } from "../../application/useInsumosErp";
import { useGetCotizaciones } from "../../application/useCotizacionesErp";
import { StatCard } from "../components/StatCard";

export function ErpDashboardPage() {
  const insumosQuery = useGetInsumos();
  const cotizacionesQuery = useGetCotizaciones();
  const insumos = insumosQuery.data ?? [];
  const cotizaciones = cotizacionesQuery.data ?? [];
  const bajoMinimo = insumos.filter(
    (insumo) => Number(insumo.stock_actual) < Number(insumo.stock_minimo),
  ).length;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
        <StatCard label="Insumos" value={insumosQuery.isLoading ? "…" : insumos.length} />
        <StatCard label="Bajo mínimo" value={insumosQuery.isLoading ? "…" : bajoMinimo} />
        <StatCard
          label="Cotizaciones"
          value={cotizacionesQuery.isLoading ? "…" : cotizaciones.length}
        />
      </Box>
    </>
  );
}
