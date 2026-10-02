import { useState, type ReactNode } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGetCategorias } from "../../application/useCatalogoErp";
import type { InsumoErp } from "../../domain/InsumoErp";
import type { InsumoRol } from "../../domain/CotizacionErp";
import { ROL_LABEL, formatCop } from "../format";
import type { ResumenItemVivo } from "./resumen-cotizacion";
import { AyudaCampo } from "./AyudaCampo";
import {
  AYUDA_CANTIDAD,
  AYUDA_CANTIDAD_USADA,
  AYUDA_CATEGORIA,
  AYUDA_CLIENTE_TRAE_PRENDA,
  AYUDA_COPIAR,
  AYUDA_DUPLICAR,
  AYUDA_COSTO_FIJO,
  AYUDA_DESCRIPCION,
  AYUDA_ITEM,
  AYUDA_MINUTOS_PRODUCCION,
  AYUDA_ROL,
} from "./cotizador-ayuda";
import type { ItemDraft } from "./cotizador-draft";

const ROLES: InsumoRol[] = ["prenda", "tinta", "papel", "cinta", "empaque"];

function Campo({
  children,
  texto,
  etiqueta,
}: {
  children: ReactNode;
  texto: string;
  etiqueta: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.25, minWidth: 0 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      <AyudaCampo texto={texto} etiqueta={etiqueta} />
    </Box>
  );
}

interface CotizadorItemFormProps {
  item: ItemDraft;
  index: number;
  insumos: InsumoErp[];
  costoFijoMin: number;
  costoFijoMax: number;
  canRemove: boolean;
  resumen: ResumenItemVivo;
  onChange: (item: ItemDraft) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

export function CotizadorItemForm({
  item,
  index,
  insumos,
  costoFijoMin,
  costoFijoMax,
  canRemove,
  resumen,
  onChange,
  onDuplicate,
  onRemove,
}: CotizadorItemFormProps) {
  const categoriasQuery = useGetCategorias();
  const [filtroCategoria, setFiltroCategoria] = useState<
    Partial<Record<InsumoRol, number | "">>
  >({});
  const [copiado, setCopiado] = useState<InsumoRol | null>(null);

  const updateInsumo = (rol: InsumoRol, patch: Partial<ItemDraft["insumos"][InsumoRol]>) => {
    onChange({
      ...item,
      insumos: {
        ...item.insumos,
        [rol]: { ...item.insumos[rol], ...patch },
      },
    });
  };

  const rolesVisibles = ROLES.filter(
    (rol) => !(rol === "prenda" && item.cliente_trae_prenda),
  );

  const copiarNombre = async (rol: InsumoRol, nombre: string) => {
    try {
      await navigator.clipboard.writeText(nombre);
    } catch {
      const area = document.createElement("textarea");
      area.value = nombre;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const copied = document.execCommand("copy");
      area.remove();
      if (!copied) {
        return;
      }
    }
    setCopiado(rol);
  };

  return (
    <Box sx={{ display: "grid", gap: 2, p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="h6">Ítem {index + 1}</Typography>
          <AyudaCampo texto={AYUDA_ITEM} etiqueta={`Ítem ${index + 1}`} compacto />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button onClick={onDuplicate}>Duplicar</Button>
          <AyudaCampo texto={AYUDA_DUPLICAR} etiqueta="Duplicar ítem" compacto />
          {canRemove && (
            <Button color="error" onClick={onRemove}>
              Quitar
            </Button>
          )}
        </Box>
      </Box>
      <Campo texto={AYUDA_DESCRIPCION} etiqueta="Descripción">
        <TextField
          label="Descripción"
          value={item.descripcion_producto}
          onChange={(event) =>
            onChange({ ...item, descripcion_producto: event.target.value })
          }
          required
          fullWidth
        />
      </Campo>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
        <Campo texto={AYUDA_CANTIDAD} etiqueta="Piezas">
          <TextField
            label="Piezas"
            type="number"
            value={item.cantidad}
            onChange={(event) => onChange({ ...item, cantidad: Number(event.target.value) })}
            fullWidth
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
        </Campo>
      </Box>
      <Box>
        <Typography variant="subtitle1">Producción por pieza</Typography>
        <Typography variant="caption" color="text.secondary">
          Prensa, depreciación y costo fijo se multiplican por las piezas.
        </Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
        <Campo texto={AYUDA_MINUTOS_PRODUCCION} etiqueta="Minutos de producción">
          <TextField
            label="Minutos de producción"
            type="number"
            value={item.minutos_produccion}
            onChange={(event) =>
              onChange({ ...item, minutos_produccion: Number(event.target.value) })
            }
            fullWidth
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          />
        </Campo>
        <Campo texto={AYUDA_COSTO_FIJO} etiqueta="Costo fijo">
          <TextField
            label="Costo fijo"
            type="number"
            value={item.costo_fijo}
            onChange={(event) => onChange({ ...item, costo_fijo: Number(event.target.value) })}
            helperText={`Entre ${costoFijoMin} y ${costoFijoMax}`}
            fullWidth
            slotProps={{ htmlInput: { min: costoFijoMin, max: costoFijoMax, step: "0.01" } }}
          />
        </Campo>
      </Box>
      <Box>
        <Typography variant="subtitle1">Materia prima por pieza</Typography>
        <Typography variant="caption" color="text.secondary">
          La cantidad es el consumo de una pieza. La tinta es la impresión y su precio está en Insumos.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={item.cliente_trae_prenda}
              onChange={(event) =>
                onChange({ ...item, cliente_trae_prenda: event.target.checked })
              }
            />
          }
          label="El cliente trae la prenda"
        />
        <AyudaCampo
          texto={AYUDA_CLIENTE_TRAE_PRENDA}
          etiqueta="El cliente trae la prenda"
          compacto
        />
      </Box>
      {rolesVisibles.map((rol) => {
        const filtro = filtroCategoria[rol] ?? "";
        const opciones = insumos.filter(
          (insumo) => filtro === "" || insumo.categoria_id === filtro,
        );
        const seleccionado =
          insumos.find((insumo) => insumo.id === item.insumos[rol].insumo_id) ?? null;
        return (
          <Box
            key={rol}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(180px, 220px) minmax(200px, 1fr) auto minmax(180px, 220px)",
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Campo texto={AYUDA_CATEGORIA} etiqueta={`Categoría de ${ROL_LABEL[rol]}`}>
            <TextField
              select
              label="Categoría"
              fullWidth
              value={filtro}
              onChange={(event) => {
                const next = event.target.value === "" ? "" : Number(event.target.value);
                setFiltroCategoria((current) => ({ ...current, [rol]: next }));
                if (
                  seleccionado &&
                  next !== "" &&
                  seleccionado.categoria_id !== next
                ) {
                  updateInsumo(rol, { insumo_id: "" });
                }
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {(categoriasQuery.data ?? []).map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </TextField>
            </Campo>
            <Campo texto={AYUDA_ROL[rol]} etiqueta={ROL_LABEL[rol]}>
            <Autocomplete
              fullWidth
              options={opciones}
              value={seleccionado && opciones.some((insumo) => insumo.id === seleccionado.id) ? seleccionado : null}
              onChange={(_event, value) =>
                updateInsumo(rol, { insumo_id: value ? value.id : "" })
              }
              getOptionLabel={(option) => option.nombre}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label={ROL_LABEL[rol]} placeholder="Buscar insumo" />
              )}
            />
            </Campo>
            <Tooltip title={AYUDA_COPIAR} arrow>
              <span>
                <IconButton
                  aria-label={`Copiar nombre de ${ROL_LABEL[rol]}`}
                  disabled={!seleccionado}
                  onClick={() => {
                    if (seleccionado) {
                      void copiarNombre(rol, seleccionado.nombre);
                    }
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            {rol === "prenda" ? (
              <Typography variant="body2" color="text.secondary">
                {seleccionado
                  ? `1 por pieza × ${item.cantidad || 0} piezas = ${formatCop(Number(seleccionado.costo_unitario) * (item.cantidad || 0))}`
                  : "1 por pieza. Elige la prenda para ver el lote."}
              </Typography>
            ) : (
            <Campo texto={AYUDA_CANTIDAD_USADA} etiqueta={`Por pieza de ${ROL_LABEL[rol]}`}>
            <TextField
              label="Por pieza"
              type="number"
              fullWidth
              value={item.insumos[rol].cantidad_usada}
              disabled={item.insumos[rol].insumo_id === ""}
              onChange={(event) =>
                updateInsumo(rol, { cantidad_usada: Number(event.target.value) })
              }
              helperText={copiado === rol ? "Nombre copiado" : "1 es lo normal"}
              slotProps={{ htmlInput: { min: 0, step: "0.0001" } }}
            />
            </Campo>
            )}
          </Box>
        );
      })}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          p: 1.5,
          borderRadius: 1,
          bgcolor: "action.hover",
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Costo de fabricación unitario
          </Typography>
          <Typography variant="subtitle1">{formatCop(resumen.costoUnitario)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Precio de venta unitario
          </Typography>
          <Typography variant="subtitle1">
            {resumen.precioUnitario === null ? "Revisa el margen del trabajo" : formatCop(resumen.precioUnitario)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Costo total de fabricación
          </Typography>
          <Typography variant="subtitle1">{formatCop(resumen.subtotalCosto)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total de venta
          </Typography>
          <Typography variant="subtitle1">
            {resumen.subtotalPrecio === null ? "Revisa el margen del trabajo" : formatCop(resumen.subtotalPrecio)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
          Costo por pieza, sin diseño: {formatCop(resumen.costoPorPieza)}
        </Typography>
      </Box>
    </Box>
  );
}
