import { useState } from "react";
import { Alert, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useGetCotizacion } from "../../application/useCotizacionesErp";
import { comercialDesdeCotizacion } from "../../domain/CotizacionComercial";
import { cotizacionEsEditable } from "../../domain/CotizacionErp";
import { CotizacionEstadoControl } from "../components/CotizacionEstadoControl";
import { formatCop, textoDesglose } from "../format";
import { descargarCotizacionPdf } from "../pdf/descargar-cotizacion-pdf";

export function ErpCotizacionDetailPage() {
  const { id } = useParams();
  const cotizacionId = Number(id);
  const cotizacionQuery = useGetCotizacion(cotizacionId);
  const cotizacion = cotizacionQuery.data;
  const cotizacionComercial = cotizacion ? comercialDesdeCotizacion(cotizacion) : null;
  const [pdfError, setPdfError] = useState("");
  const [pdfPending, setPdfPending] = useState(false);

  const descargar = async () => {
    if (!cotizacion || !cotizacionComercial) {
      return;
    }
    setPdfError("");
    setPdfPending(true);
    try {
      await descargarCotizacionPdf(cotizacionComercial);
    } catch {
      setPdfError("No se pudo generar el PDF.");
    } finally {
      setPdfPending(false);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Cotización {Number.isFinite(cotizacionId) ? `#${cotizacionId}` : ""}
      </Typography>
      {cotizacionQuery.isError && (
        <Alert severity="error">No se encontró la cotización.</Alert>
      )}
      {pdfError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {pdfError}
        </Alert>
      )}
      {cotizacion && (
        <>
          <Paper sx={{ p: 2, mb: 2, display: "grid", gap: 1, maxWidth: 480 }}>
            <Typography>Cliente: {cotizacion.cliente_nombre}</Typography>
            <Typography>Contacto: {cotizacion.cliente_contacto}</Typography>
            <Typography>Fecha: {cotizacion.fecha}</Typography>
            <Typography>
              Subtotal antes del descuento {formatCop(cotizacionComercial?.subtotal_antes_descuento ?? 0)}
              {cotizacionComercial && cotizacionComercial.descuento > 0
                ? ` · Descuento aplicado ${formatCop(cotizacionComercial.descuento)}`
                : ""}
            </Typography>
            <Typography>
              Costo total de fabricación {formatCop(cotizacion.total_costo)} · Total de venta {formatCop(cotizacion.total_precio)} · Ganancia {formatCop(cotizacion.total_precio - cotizacion.total_costo)}
            </Typography>
            <Button variant="outlined" onClick={() => void descargar()} disabled={pdfPending}>
              Descargar PDF
            </Button>
            {cotizacionEsEditable(cotizacion.estado) && (
              <Button
                variant="contained"
                component={RouterLink}
                to={`/erp/cotizador/${cotizacion.id}`}
              >
                Editar cotización
              </Button>
            )}
            <CotizacionEstadoControl
              cotizacionId={cotizacion.id}
              estado={cotizacion.estado}
            />
          </Paper>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Detalle</TableCell>
                  <TableCell align="right">Piezas</TableCell>
                  <TableCell align="right">Costo unitario</TableCell>
                  <TableCell align="right">Precio unitario</TableCell>
                  <TableCell align="right">Costo total</TableCell>
                  <TableCell align="right">Total de venta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(cotizacion.trabajos ?? []).flatMap((trabajo, trabajoIndex) => [
                  ...(trabajo.diseno_en_items
                    ? [
                        <TableRow key={`nota-diseno-${trabajoIndex}`}>
                          <TableCell colSpan={6}>
                            <Typography variant="caption" color="text.secondary">
                              El diseño de este trabajo sigue dentro del precio de cada ítem. Al editarlo se cobra una sola vez, aparte de las prendas.
                            </Typography>
                          </TableCell>
                        </TableRow>,
                      ]
                    : trabajo.precio_diseno > 0
                      ? [
                          <TableRow key={`diseno-${trabajoIndex}`}>
                            <TableCell>
                              {(cotizacion.trabajos ?? []).length > 1
                                ? `Diseño ${trabajoIndex + 1}`
                                : "Diseño"}
                              <Typography variant="caption" display="block" color="text.secondary">
                                Se cobra una vez en este trabajo.
                              </Typography>
                            </TableCell>
                            <TableCell align="right">1</TableCell>
                            <TableCell align="right">{formatCop(trabajo.costo_diseno)}</TableCell>
                            <TableCell align="right">{formatCop(trabajo.precio_diseno)}</TableCell>
                            <TableCell align="right">{formatCop(trabajo.costo_diseno)}</TableCell>
                            <TableCell align="right">{formatCop(trabajo.precio_diseno)}</TableCell>
                          </TableRow>,
                        ]
                      : []),
                  ...trabajo.items.map((item, index) => (
                    <TableRow key={`${trabajoIndex}-${item.descripcion_producto}-${index}`}>
                      <TableCell>
                        {item.descripcion_producto}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {textoDesglose(item.desglose, !trabajo.diseno_en_items)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{item.cantidad}</TableCell>
                      <TableCell align="right">{formatCop(item.costo_directo_unitario)}</TableCell>
                      <TableCell align="right">{formatCop(item.precio_unitario_sugerido)}</TableCell>
                      <TableCell align="right">{formatCop(item.subtotal_costo)}</TableCell>
                      <TableCell align="right">{formatCop(item.subtotal_precio)}</TableCell>
                    </TableRow>
                  )),
                ])}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </>
  );
}
