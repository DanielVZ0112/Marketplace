import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { IconButton, Tooltip } from "@mui/material";

interface AyudaCampoProps {
  texto: string;
  etiqueta: string;
  compacto?: boolean;
}

export function AyudaCampo({ texto, etiqueta, compacto = false }: AyudaCampoProps) {
  return (
    <Tooltip
      title={texto}
      arrow
      enterTouchDelay={0}
      slotProps={{ tooltip: { sx: { maxWidth: 280, fontSize: 13 } } }}
    >
      <IconButton
        size="small"
        aria-label={`Ayuda: ${etiqueta}`}
        sx={{ color: "text.secondary", mt: compacto ? 0 : 1 }}
      >
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
