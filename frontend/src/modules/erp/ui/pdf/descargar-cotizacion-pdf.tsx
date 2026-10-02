import { pdf } from "@react-pdf/renderer";
import type { CotizacionComercial } from "../../domain/CotizacionComercial";
import { CotizacionComercialDocument } from "./CotizacionComercialDocument";

function nombreArchivo(data: CotizacionComercial): string {
  const cliente = data.cliente_nombre.trim().replace(/\s+/g, "-").toLowerCase();
  const numero = data.numero ? `-${data.numero}` : "";
  return `cotizacion${numero}-${cliente || "cliente"}.pdf`;
}

export async function descargarCotizacionPdf(data: CotizacionComercial): Promise<void> {
  const blob = await pdf(<CotizacionComercialDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo(data);
  link.click();
  URL.revokeObjectURL(url);
}
