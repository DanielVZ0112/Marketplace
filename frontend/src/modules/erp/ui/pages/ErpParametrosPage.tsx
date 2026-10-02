import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useGetParametros, useUpdateParametros } from "../../application/useParametrosErp";
import { calcularManoObra } from "../../domain/mano-obra";
import type { ParametrosErp, UpdateParametrosErp } from "../../domain/ParametrosErp";
import { getApiErrorMessage } from "../../infrastructure/ErpApiRepository";
import { formatCop } from "../format";

function toForm(parametros: ParametrosErp): UpdateParametrosErp {
  return {
    costo_minuto: Number(parametros.costo_minuto),
    depreciacion_por_prenda: Number(parametros.depreciacion_por_prenda),
    costo_fijo_min: Number(parametros.costo_fijo_min),
    costo_fijo_max: Number(parametros.costo_fijo_max),
    costo_fijo_default: Number(parametros.costo_fijo_default),
    smlmv_base: Number(parametros.smlmv_base),
    auxilio_transporte: Number(parametros.auxilio_transporte),
    horas_mes: Number(parametros.horas_mes),
    porcentaje_prestaciones: Number(parametros.porcentaje_prestaciones),
    calculo_manual: Boolean(parametros.calculo_manual),
  };
}

function ParametrosForm({ initial }: { initial: ParametrosErp }) {
  const updateParametros = useUpdateParametros();
  const [form, setForm] = useState<UpdateParametrosErp>(() => toForm(initial));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const setNumber = (field: keyof UpdateParametrosErp, value: number) => {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const automatico = !form.calculo_manual;
  const resumen =
    form.horas_mes > 0
      ? calcularManoObra({
          smlmv_base: Number(form.smlmv_base),
          auxilio_transporte: Number(form.auxilio_transporte),
          horas_mes: Number(form.horas_mes),
          porcentaje_prestaciones: Number(form.porcentaje_prestaciones),
        })
      : null;
  const costoMinuto = automatico ? (resumen?.costo_minuto ?? 0) : Number(form.costo_minuto);

  const rangoInvalido =
    form.costo_fijo_min > form.costo_fijo_max ||
    form.costo_fijo_default < form.costo_fijo_min ||
    form.costo_fijo_default > form.costo_fijo_max;

  const save = () => {
    setError("");
    setSaved(false);
    if (!resumen) {
      setError("Las horas al mes deben ser mayores a 0.");
      return;
    }
    if (rangoInvalido) {
      setError("El costo fijo por defecto debe estar entre el mínimo y el máximo.");
      return;
    }
    updateParametros.mutate(
      { ...form, costo_minuto: costoMinuto },
      {
        onSuccess: () => setSaved(true),
        onError: (mutationError) => {
          setError(getApiErrorMessage(mutationError, "No se pudieron guardar los parámetros"));
        },
      },
    );
  };

  return (
    <Box sx={{ display: "grid", gap: 3, maxWidth: 720 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {saved && <Alert severity="success">Parámetros actualizados.</Alert>}
      <Paper sx={{ p: 3, display: "grid", gap: 2 }}>
        <Typography variant="h6">Calculadora de mano de obra</Typography>
        <TextField
          label="SMLMV"
          type="number"
          value={form.smlmv_base}
          onChange={(event) => setNumber("smlmv_base", Number(event.target.value))}
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
        <TextField
          label="Auxilio de transporte"
          type="number"
          value={form.auxilio_transporte}
          onChange={(event) => setNumber("auxilio_transporte", Number(event.target.value))}
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
        <TextField
          label="Horas al mes"
          type="number"
          value={form.horas_mes}
          onChange={(event) => setNumber("horas_mes", Number(event.target.value))}
          slotProps={{ htmlInput: { min: 0.01, step: "0.01" } }}
          error={form.horas_mes <= 0}
        />
        <TextField
          label="% prestaciones"
          type="number"
          value={form.porcentaje_prestaciones}
          onChange={(event) =>
            setNumber("porcentaje_prestaciones", Number(event.target.value))
          }
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={automatico}
              onChange={(event) => {
                setSaved(false);
                setForm((current) => ({
                  ...current,
                  calculo_manual: !event.target.checked,
                }));
              }}
            />
          }
          label="Usar costo por minuto calculado automáticamente"
        />
        {resumen && (
          <Typography color="text.secondary">
            Mensual {formatCop(resumen.costo_mensual)} · Día {formatCop(resumen.costo_dia)} ·
            Hora {formatCop(resumen.costo_hora)} · Minuto {formatCop(resumen.costo_minuto)}
          </Typography>
        )}
      </Paper>
      <Paper sx={{ p: 3, display: "grid", gap: 2 }}>
        <TextField
          label="Costo por minuto"
          type="number"
          value={costoMinuto}
          onChange={(event) => setNumber("costo_minuto", Number(event.target.value))}
          slotProps={{ htmlInput: { min: 0, step: "0.01", readOnly: automatico } }}
          helperText={
            automatico
              ? "Se guarda el minuto calculado con la fórmula de mano de obra."
              : "Valor manual. El cálculo en vivo no lo reemplaza."
          }
        />
        <TextField
          label="Depreciación por prenda"
          type="number"
          value={form.depreciacion_por_prenda}
          onChange={(event) =>
            setNumber("depreciacion_por_prenda", Number(event.target.value))
          }
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
        <TextField
          label="Costo fijo mínimo"
          type="number"
          value={form.costo_fijo_min}
          onChange={(event) => setNumber("costo_fijo_min", Number(event.target.value))}
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
        <TextField
          label="Costo fijo máximo"
          type="number"
          value={form.costo_fijo_max}
          onChange={(event) => setNumber("costo_fijo_max", Number(event.target.value))}
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
        <TextField
          label="Costo fijo por defecto"
          type="number"
          value={form.costo_fijo_default}
          onChange={(event) => setNumber("costo_fijo_default", Number(event.target.value))}
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          error={rangoInvalido}
          helperText={
            rangoInvalido
              ? "Debe estar entre el mínimo y el máximo."
              : "Se usa como valor inicial de cada ítem del cotizador."
          }
        />
        <Button variant="contained" onClick={save} disabled={updateParametros.isPending}>
          Guardar
        </Button>
      </Paper>
    </Box>
  );
}

export function ErpParametrosPage() {
  const parametrosQuery = useGetParametros();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Parámetros de costeo
      </Typography>
      {parametrosQuery.isLoading && <CircularProgress />}
      {parametrosQuery.isError && (
        <Alert severity="error">No se pudieron cargar los parámetros.</Alert>
      )}
      {parametrosQuery.data && <ParametrosForm initial={parametrosQuery.data} />}
    </>
  );
}
