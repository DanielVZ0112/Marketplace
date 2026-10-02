import { useState } from "react";
import { Alert, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import { queryKeys } from "@/shared/lib/query-keys";
import { useGetCotizaciones } from "../../application/useCotizacionesErp";
import { comercialDesdeCotizacion } from "../../domain/CotizacionComercial";
import { cotizacionEsEditable } from "../../domain/CotizacionErp";
import { ErpApiRepository, getApiErrorMessage } from "../../infrastructure/ErpApiRepository";
import { ESTADO_LABEL, formatCop } from "../format";
import { descargarCotizacionPdf } from "../pdf/descargar-cotizacion-pdf";

export function ErpCotizacionesListPage() {
  const cotizacionesQuery = useGetCotizaciones();
  const queryClient = useQueryClient();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const descargar = async (id: number) => {
    setError("");
    setDownloadingId(id);
    try {
      const cotizacion = await queryClient.fetchQuery({
        queryKey: queryKeys.erp.cotizacion(id),
        queryFn: () => ErpApiRepository.getCotizacionById(id),
      });
      await descargarCotizacionPdf(comercialDesdeCotizacion(cotizacion));
    } catch (downloadError) {
      setError(getApiErrorMessage(downloadError, "No se pudo descargar el PDF"));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Histórico de cotizaciones
      </Typography>
      {cotizacionesQuery.isError && (
        <Alert severity="error">No se pudieron cargar las cotizaciones.</Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Costo</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(cotizacionesQuery.data ?? []).map((cotizacion) => (
              <TableRow key={cotizacion.id} hover>
                <TableCell>{cotizacion.fecha}</TableCell>
                <TableCell>{cotizacion.cliente_nombre}</TableCell>
                <TableCell>{ESTADO_LABEL[cotizacion.estado]}</TableCell>
                <TableCell align="right">{formatCop(cotizacion.total_costo)}</TableCell>
                <TableCell align="right">{formatCop(cotizacion.total_precio)}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/erp/cotizaciones/${cotizacion.id}`}
                  >
                    Ver
                  </Button>
                  {cotizacionEsEditable(cotizacion.estado) && (
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/erp/cotizador/${cotizacion.id}`}
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    size="small"
                    onClick={() => void descargar(cotizacion.id)}
                    disabled={downloadingId === cotizacion.id}
                  >
                    Descargar PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
