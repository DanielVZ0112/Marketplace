import type { ReactNode } from "react";
import { Box, Button, FormControlLabel, MenuItem, Switch, TextField, Typography } from "@mui/material";
import type { InsumoErp } from "../../domain/InsumoErp";
import { formatCop } from "../format";
import { AyudaCampo } from "./AyudaCampo";
import { CotizadorItemForm } from "./CotizadorItemForm";
import {
  AYUDA_DESCUENTO,
  AYUDA_MARGEN,
  AYUDA_MINUTOS_DISENO,
  AYUDA_MODO_DISENO,
  AYUDA_REQUIERE_DISENO,
  AYUDA_TRABAJO,
  AYUDA_VALOR_DISENO,
} from "./cotizador-ayuda";
import { cloneItemDraft, createItemDraft, type ItemDraft, type TrabajoDraft } from "./cotizador-draft";
import type { ResumenTrabajoVivo } from "./resumen-cotizacion";

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

interface CotizadorTrabajoFormProps {
  trabajo: TrabajoDraft;
  index: number;
  insumos: InsumoErp[];
  costoFijoMin: number;
  costoFijoMax: number;
  costoFijoDefault: number;
  canRemove: boolean;
  resumen: ResumenTrabajoVivo;
  onChange: (trabajo: TrabajoDraft) => void;
  onRemove: () => void;
}

export function CotizadorTrabajoForm({
  trabajo,
  index,
  insumos,
  costoFijoMin,
  costoFijoMax,
  costoFijoDefault,
  canRemove,
  resumen,
  onChange,
  onRemove,
}: CotizadorTrabajoFormProps) {
  const updateItem = (itemIndex: number, item: ItemDraft) => {
    onChange({
      ...trabajo,
      items: trabajo.items.map((entry, i) => (i === itemIndex ? item : entry)),
    });
  };

  return (
    <Box sx={{ display: "grid", gap: 2, p: 2, border: 1, borderColor: "primary.light", borderRadius: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="h5">Trabajo {index + 1}</Typography>
          <AyudaCampo texto={AYUDA_TRABAJO} etiqueta={`Trabajo ${index + 1}`} compacto />
        </Box>
        {canRemove && (
          <Button color="error" onClick={onRemove}>
            Quitar trabajo
          </Button>
        )}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
        <Campo texto={AYUDA_MARGEN} etiqueta="Margen esperado">
          <TextField
            label="Margen esperado %"
            type="number"
            value={trabajo.margen_esperado}
            onChange={(event) =>
              onChange({ ...trabajo, margen_esperado: Number(event.target.value) })
            }
            fullWidth
            slotProps={{ htmlInput: { min: 0, max: 99.99, step: "0.01" } }}
          />
        </Campo>
        <Campo texto={AYUDA_DESCUENTO} etiqueta="Descuento por mayor">
          <TextField
            label="Descuento por mayor %"
            type="number"
            value={trabajo.descuento_porcentaje}
            onChange={(event) =>
              onChange({ ...trabajo, descuento_porcentaje: Number(event.target.value) })
            }
            helperText="Sobre el precio, no sobre el costo"
            fullWidth
            slotProps={{ htmlInput: { min: 0, max: 100, step: "0.01" } }}
          />
        </Campo>
      </Box>

      <Box>
        <Typography variant="subtitle1">Diseño del trabajo</Typography>
        <Typography variant="caption" color="text.secondary">
          Se cobra una sola vez para todas las variantes. No entra al costo de cada prenda.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={trabajo.requiere_diseno}
              onChange={(event) =>
                onChange({
                  ...trabajo,
                  requiere_diseno: event.target.checked,
                  minutos_diseno: event.target.checked ? trabajo.minutos_diseno : 0,
                })
              }
            />
          }
          label="Requiere diseño"
        />
        <AyudaCampo texto={AYUDA_REQUIERE_DISENO} etiqueta="Requiere diseño" compacto />
      </Box>
      {trabajo.requiere_diseno && (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
          <Campo texto={AYUDA_MODO_DISENO} etiqueta="Cobro del diseño">
            <TextField
              select
              label="Cobro del diseño"
              value={trabajo.diseno_por_valor ? "valor" : "tiempo"}
              onChange={(event) =>
                onChange({ ...trabajo, diseno_por_valor: event.target.value === "valor" })
              }
              fullWidth
            >
              <MenuItem value="tiempo">Por tiempo</MenuItem>
              <MenuItem value="valor">Por valor</MenuItem>
            </TextField>
          </Campo>
          {trabajo.diseno_por_valor ? (
            <Campo texto={AYUDA_VALOR_DISENO} etiqueta="Valor del diseño">
              <TextField
                label="Valor del diseño"
                type="number"
                value={trabajo.valor_diseno}
                onChange={(event) =>
                  onChange({ ...trabajo, valor_diseno: Number(event.target.value) })
                }
                fullWidth
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
              />
            </Campo>
          ) : (
            <Campo texto={AYUDA_MINUTOS_DISENO} etiqueta="Minutos de diseño">
              <TextField
                label="Minutos de diseño"
                type="number"
                value={trabajo.minutos_diseno}
                onChange={(event) =>
                  onChange({ ...trabajo, minutos_diseno: Number(event.target.value) })
                }
                fullWidth
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
              />
            </Campo>
          )}
        </Box>
      )}
      <Typography variant="body2" color="text.secondary">
        Diseño, una vez: costo {formatCop(resumen.costoDiseno)}
        {resumen.precioDiseno === null
          ? " · revisa el margen o el descuento"
          : ` · precio de venta ${formatCop(resumen.precioDiseno)}`}
      </Typography>

      {trabajo.items.map((item, itemIndex) => (
        <CotizadorItemForm
          key={item.clave}
          item={item}
          index={itemIndex}
          insumos={insumos}
          costoFijoMin={costoFijoMin}
          costoFijoMax={costoFijoMax}
          canRemove={trabajo.items.length > 1}
          resumen={resumen.items[itemIndex]}
          onChange={(next) => updateItem(itemIndex, next)}
          onDuplicate={() =>
            onChange({
              ...trabajo,
              items: [
                ...trabajo.items.slice(0, itemIndex + 1),
                cloneItemDraft(item),
                ...trabajo.items.slice(itemIndex + 1),
              ],
            })
          }
          onRemove={() =>
            onChange({
              ...trabajo,
              items: trabajo.items.filter((_, current) => current !== itemIndex),
            })
          }
        />
      ))}
      <Button
        onClick={() =>
          onChange({
            ...trabajo,
            items: [
              ...trabajo.items,
              cloneItemDraft(trabajo.items[trabajo.items.length - 1] ?? createItemDraft(costoFijoDefault)),
            ],
          })
        }
      >
        Agregar ítem
      </Button>
    </Box>
  );
}
