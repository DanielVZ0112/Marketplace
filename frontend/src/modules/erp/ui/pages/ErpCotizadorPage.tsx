import { useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useGetInsumos } from "../../application/useInsumosErp";
import { useGetParametros } from "../../application/useParametrosErp";
import {
  useActualizarCotizacion,
  useCalcularCotizacion,
  useCrearCotizacion,
  useGetCotizacion,
} from "../../application/useCotizacionesErp";
import { getApiErrorMessage } from "../../infrastructure/ErpApiRepository";
import { AyudaCampo } from "../components/AyudaCampo";
import { CotizacionEstadoControl } from "../components/CotizacionEstadoControl";
import { CotizadorTrabajoForm } from "../components/CotizadorTrabajoForm";
import {
  AYUDA_CLIENTE,
  AYUDA_CONTACTO,
  AYUDA_COSTO_DIRECTO,
  AYUDA_COSTO_TOTAL,
  AYUDA_PDF,
  AYUDA_PRECIO_VENTA,
  AYUDA_SUBTOTAL,
} from "../components/cotizador-ayuda";
import {
  createTrabajoDraft,
  draftsFromCotizacion,
  toTrabajoInput,
  type TrabajoDraft,
} from "../components/cotizador-draft";
import { resumirCotizacion } from "../components/resumen-cotizacion";
import { comercialDesdeCalculo } from "../../domain/CotizacionComercial";
import {
  cotizacionEsEditable,
  type CotizacionErp,
} from "../../domain/CotizacionErp";
import { ESTADO_LABEL, formatCop, textoDesglose } from "../format";
import { descargarCotizacionPdf } from "../pdf/descargar-cotizacion-pdf";

function CotizadorFormulario({ cotizacion }: { cotizacion?: CotizacionErp }) {
  const navigate = useNavigate();
  const parametrosQuery = useGetParametros();
  const insumosQuery = useGetInsumos();
  const calcular = useCalcularCotizacion();
  const crear = useCrearCotizacion();
  const actualizar = useActualizarCotizacion();
  const [trabajos, setTrabajos] = useState<TrabajoDraft[]>(() =>
    cotizacion?.trabajos?.length ? draftsFromCotizacion(cotizacion.trabajos) : [],
  );
  const [clienteNombre, setClienteNombre] = useState(cotizacion?.cliente_nombre ?? "");
  const [clienteContacto, setClienteContacto] = useState(
    cotizacion?.cliente_contacto ?? "",
  );
  const [error, setError] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [pdfPending, setPdfPending] = useState(false);

  const costoFijoMin = Number(parametrosQuery.data?.costo_fijo_min ?? 500);
  const costoFijoMax = Number(parametrosQuery.data?.costo_fijo_max ?? 1500);
  const costoFijoDefault = Number(parametrosQuery.data?.costo_fijo_default ?? 1000);
  const visibleTrabajos =
    trabajos.length > 0
      ? trabajos
      : parametrosQuery.data
        ? [createTrabajoDraft(costoFijoDefault, "trabajo-inicial")]
        : [];
  const resumen = resumirCotizacion(
    visibleTrabajos,
    insumosQuery.data ?? [],
    Number(parametrosQuery.data?.costo_minuto ?? 0),
    Number(parametrosQuery.data?.depreciacion_por_prenda ?? 0),
  );

  const updateTrabajo = (index: number, trabajo: TrabajoDraft) => {
    setTrabajos(visibleTrabajos.map((entry, i) => (i === index ? trabajo : entry)));
  };

  const validate = (drafts: TrabajoDraft[]) => {
    for (const [trabajoIndex, trabajo] of drafts.entries()) {
      const etiqueta = `El trabajo ${trabajoIndex + 1}`;
      if (trabajo.margen_esperado < 0 || trabajo.margen_esperado > 99.99) {
        return `${etiqueta} necesita un margen entre 0 y 99.99.`;
      }
      if (trabajo.descuento_porcentaje < 0 || trabajo.descuento_porcentaje > 100) {
        return `${etiqueta} necesita un descuento por mayor entre 0 y 100.`;
      }
      if (trabajo.requiere_diseno && trabajo.diseno_por_valor && trabajo.valor_diseno < 0) {
        return `El valor del diseño del trabajo ${trabajoIndex + 1} no puede ser negativo.`;
      }
      if (trabajo.items.length === 0) {
        return `${etiqueta} necesita al menos un ítem.`;
      }
      for (const [itemIndex, item] of trabajo.items.entries()) {
        const itemEtiqueta = `El ítem ${itemIndex + 1} del trabajo ${trabajoIndex + 1}`;
        if (!item.descripcion_producto.trim()) {
          return `${itemEtiqueta} necesita una descripción.`;
        }
        if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
          return `Las piezas del ítem ${itemIndex + 1} del trabajo ${trabajoIndex + 1} deben ser un entero mayor a 0.`;
        }
        if (item.costo_fijo < costoFijoMin || item.costo_fijo > costoFijoMax) {
          return `El costo fijo del ítem ${itemIndex + 1} del trabajo ${trabajoIndex + 1} debe estar entre ${costoFijoMin} y ${costoFijoMax}.`;
        }
      }
    }
    return "";
  };

  const onCalcular = () => {
    const message = validate(visibleTrabajos);
    setError(message);
    if (message) {
      return;
    }
    calcular.mutate(visibleTrabajos.map(toTrabajoInput), {
      onError: (mutationError) => {
        setError(getApiErrorMessage(mutationError, "No se pudo calcular la cotización"));
      },
    });
  };

  const onGuardar = () => {
    const message = validate(visibleTrabajos);
    if (!clienteNombre.trim() || !clienteContacto.trim()) {
      setError("Indica el nombre y el contacto del cliente.");
      return;
    }
    setError(message);
    if (message) {
      return;
    }
    const payload = {
      cliente_nombre: clienteNombre.trim(),
      cliente_contacto: clienteContacto.trim(),
      trabajos: visibleTrabajos.map(toTrabajoInput),
    };
    const onError = (mutationError: unknown) => {
      setError(getApiErrorMessage(mutationError, "No se pudo guardar la cotización"));
    };
    if (cotizacion) {
      actualizar.mutate(
        { id: cotizacion.id, dto: payload },
        {
          onSuccess: (actualizada) => navigate(`/erp/cotizaciones/${actualizada.id}`),
          onError,
        },
      );
      return;
    }
    crear.mutate(payload, {
      onSuccess: (creada) => navigate(`/erp/cotizaciones/${creada.id}`),
      onError,
    });
  };

  const resultado = calcular.data;
  const vistaPreviaComercial = resultado
    ? comercialDesdeCalculo(clienteNombre.trim(), clienteContacto.trim(), resultado)
    : null;

  const onDescargarPdf = async () => {
    if (!vistaPreviaComercial || !clienteNombre.trim()) {
      return;
    }
    setPdfError("");
    setPdfPending(true);
    try {
      await descargarCotizacionPdf(vistaPreviaComercial);
    } catch {
      setPdfError("No se pudo generar el PDF.");
    } finally {
      setPdfPending(false);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {cotizacion ? `Editar cotización #${cotizacion.id}` : "Cotizador"}
      </Typography>
      <Paper
        elevation={4}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          p: 2,
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Costo total de fabricación
          </Typography>
          <Typography variant="h6">{formatCop(resumen.totalCosto)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total de venta
          </Typography>
          <Typography variant="h6">
            {resumen.totalPrecio === null ? "Revisa el margen" : formatCop(resumen.totalPrecio)}
          </Typography>
        </Box>
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
        {visibleTrabajos.map((trabajo, index) => (
          <CotizadorTrabajoForm
            key={trabajo.clave}
            trabajo={trabajo}
            index={index}
            insumos={insumosQuery.data ?? []}
            costoFijoMin={costoFijoMin}
            costoFijoMax={costoFijoMax}
            costoFijoDefault={costoFijoDefault}
            canRemove={visibleTrabajos.length > 1}
            resumen={resumen.trabajos[index]}
            onChange={(next) => updateTrabajo(index, next)}
            onRemove={() =>
              setTrabajos(visibleTrabajos.filter((_, trabajoIndex) => trabajoIndex !== index))
            }
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Button onClick={() => setTrabajos([...visibleTrabajos, createTrabajoDraft(costoFijoDefault)])}>
          Agregar trabajo
        </Button>
        <Button variant="contained" onClick={onCalcular} disabled={calcular.isPending || visibleTrabajos.length === 0}>
          Calcular precios
        </Button>
      </Box>

      {resultado && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultado
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Detalle</TableCell>
                <TableCell align="right">Piezas</TableCell>
                <TableCell align="right">
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                    Costo unitario
                    <AyudaCampo texto={AYUDA_COSTO_DIRECTO} etiqueta="Costo de fabricación unitario" compacto />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                    Precio unitario
                    <AyudaCampo texto={AYUDA_PRECIO_VENTA} etiqueta="Precio de venta unitario" compacto />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                    Costo total
                    <AyudaCampo texto={AYUDA_COSTO_TOTAL} etiqueta="Costo total de fabricación" compacto />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                    Total de venta
                    <AyudaCampo texto={AYUDA_SUBTOTAL} etiqueta="Total de venta" compacto />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultado.trabajos.flatMap((trabajo, trabajoIndex) => [
                ...(trabajo.precio_diseno > 0
                  ? [
                      <TableRow key={`diseno-${trabajoIndex}`}>
                        <TableCell>
                          {resultado.trabajos.length > 1 ? `Diseño ${trabajoIndex + 1}` : "Diseño"}
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
                        {textoDesglose(item.desglose)}
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
          <Typography sx={{ mt: 2 }}>
            Subtotal antes del descuento {formatCop(vistaPreviaComercial?.subtotal_antes_descuento ?? 0)}
          </Typography>
          {vistaPreviaComercial && vistaPreviaComercial.descuento > 0 && (
            <Typography color="success.main">
              Descuento aplicado {formatCop(vistaPreviaComercial.descuento)}
            </Typography>
          )}
          <Typography variant="subtitle1" fontWeight={700}>
            Total de venta {formatCop(resultado.total_precio)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Costo total de fabricación {formatCop(resultado.total_costo)} · Ganancia {formatCop(resultado.ganancia_total)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            El total de venta ya incluye el descuento aplicado.
          </Typography>
        </Paper>
      )}
      {pdfError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {pdfError}
        </Alert>
      )}

      <Paper sx={{ p: 2, display: "grid", gap: 2, maxWidth: 480 }}>
        <Typography variant="h6">
          {cotizacion ? "Guardar cambios" : "Guardar borrador"}
        </Typography>
        {cotizacion && (
          <CotizacionEstadoControl
            cotizacionId={cotizacion.id}
            estado={cotizacion.estado}
          />
        )}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.25 }}>
          <TextField
            label="Nombre del cliente"
            value={clienteNombre}
            onChange={(event) => setClienteNombre(event.target.value)}
            fullWidth
          />
          <AyudaCampo texto={AYUDA_CLIENTE} etiqueta="Nombre del cliente" />
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.25 }}>
          <TextField
            label="Contacto"
            value={clienteContacto}
            onChange={(event) => setClienteContacto(event.target.value)}
            fullWidth
          />
          <AyudaCampo texto={AYUDA_CONTACTO} etiqueta="Contacto" />
        </Box>
        <Button
          variant="contained"
          onClick={onGuardar}
          disabled={crear.isPending || actualizar.isPending}
        >
          {cotizacion ? "Guardar cambios" : "Guardar cotización (borrador)"}
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Button
            variant="outlined"
            onClick={() => void onDescargarPdf()}
            disabled={pdfPending || !resultado || !clienteNombre.trim()}
          >
            Descargar PDF
          </Button>
          <AyudaCampo texto={AYUDA_PDF} etiqueta="Descargar PDF" compacto />
        </Box>
      </Paper>
    </>
  );
}

export function ErpCotizadorPage() {
  const { id } = useParams();
  const cotizacionId = Number(id);
  const editing = Number.isInteger(cotizacionId) && cotizacionId > 0;
  const cotizacionQuery = useGetCotizacion(editing ? cotizacionId : 0);
  const cotizacion = editing ? cotizacionQuery.data : undefined;

  if (editing && cotizacionQuery.isLoading) {
    return <CircularProgress />;
  }
  if (editing && (cotizacionQuery.isError || !cotizacion)) {
    return <Alert severity="error">No se encontró la cotización.</Alert>;
  }
  if (cotizacion && !cotizacionEsEditable(cotizacion.estado)) {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Cotización #{cotizacion.id}
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Esta cotización está {ESTADO_LABEL[cotizacion.estado]} y no se puede modificar.
          Solo borrador y rechazada vuelven al cotizador.
        </Alert>
        <Paper sx={{ p: 2, display: "grid", gap: 2, maxWidth: 480, mb: 2 }}>
          <CotizacionEstadoControl
            cotizacionId={cotizacion.id}
            estado={cotizacion.estado}
          />
        </Paper>
        <Button component={RouterLink} to={`/erp/cotizaciones/${cotizacion.id}`}>
          Ver detalle
        </Button>
      </>
    );
  }
  if (cotizacion && !(cotizacion.trabajos ?? []).some((trabajo) => trabajo.itemsEdicion.length > 0)) {
    return <Alert severity="error">No se pudieron recuperar los ítems de la cotización.</Alert>;
  }

  return (
    <CotizadorFormulario key={cotizacion ? `edit-${cotizacion.id}` : "nueva"} cotizacion={cotizacion} />
  );
}
