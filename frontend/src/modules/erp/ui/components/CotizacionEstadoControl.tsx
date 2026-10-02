import { useState } from "react";
import { Alert, Button, MenuItem, TextField, Typography } from "@mui/material";
import { useUpdateEstadoCotizacion } from "../../application/useCotizacionesErp";
import {
  cotizacionEsEditable,
  type EstadoCotizacion,
} from "../../domain/CotizacionErp";
import { getApiErrorMessage } from "../../infrastructure/ErpApiRepository";
import { ESTADO_LABEL } from "../format";

const ESTADOS: EstadoCotizacion[] = ["borrador", "enviada", "aprobada", "rechazada"];

interface CotizacionEstadoControlProps {
  cotizacionId: number;
  estado: EstadoCotizacion;
}

export function CotizacionEstadoControl({
  cotizacionId,
  estado,
}: CotizacionEstadoControlProps) {
  const updateEstado = useUpdateEstadoCotizacion();
  const [seleccionado, setSeleccionado] = useState<EstadoCotizacion>(estado);
  const [guardado, setGuardado] = useState(false);

  const cambiar = () => {
    setGuardado(false);
    updateEstado.mutate(
      { id: cotizacionId, estado: seleccionado },
      { onSuccess: () => setGuardado(true) },
    );
  };

  return (
    <>
      <Typography variant="subtitle1">Estado: {ESTADO_LABEL[estado]}</Typography>
      <Typography variant="caption" color="text.secondary">
        {cotizacionEsEditable(estado)
          ? "Esta cotización se puede modificar."
          : "Enviada y aprobada no se pueden modificar. Pásala a borrador o rechazada para editarla."}
      </Typography>
      {guardado && <Alert severity="success">Estado actualizado.</Alert>}
      {updateEstado.isError && (
        <Alert severity="error">
          {getApiErrorMessage(updateEstado.error, "No se pudo cambiar el estado")}
        </Alert>
      )}
      <TextField
        select
        label="Nuevo estado"
        value={seleccionado}
        onChange={(event) => {
          setGuardado(false);
          setSeleccionado(event.target.value as EstadoCotizacion);
        }}
      >
        {ESTADOS.map((opcion) => (
          <MenuItem key={opcion} value={opcion}>
            {ESTADO_LABEL[opcion]}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        onClick={cambiar}
        disabled={updateEstado.isPending || seleccionado === estado}
      >
        Cambiar estado
      </Button>
    </>
  );
}
