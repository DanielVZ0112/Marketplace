import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CotizacionComercial } from "../../domain/CotizacionComercial";
import { formatCop } from "../format";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 11, fontFamily: "Helvetica", color: "#1a1a1a" },
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  muted: { color: "#555", marginBottom: 2 },
  section: { marginTop: 16 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", paddingVertical: 6 },
  head: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#222", paddingBottom: 4, fontFamily: "Helvetica-Bold" },
  colQty: { width: "12%" },
  colDesc: { width: "46%" },
  colPrice: { width: "21%", textAlign: "right" },
  colSub: { width: "21%", textAlign: "right" },
  total: { marginTop: 12, fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "right" },
  note: { marginTop: 6 },
});

function sumarDias(fechaIso: string, dias: number): string {
  const [year, month, day] = fechaIso.slice(0, 10).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + dias);
  return date.toLocaleDateString("es-CO");
}

function fechaLegible(fechaIso: string): string {
  const [year, month, day] = fechaIso.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-CO");
}

export function CotizacionComercialDocument({ data }: { data: CotizacionComercial }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>D-E-J Creaciones</Text>
        <Text style={styles.muted}>Cotización comercial</Text>
        <Text style={styles.muted}>Fecha: {fechaLegible(data.fecha)}</Text>
        <Text style={styles.muted}>Válida hasta: {sumarDias(data.fecha, 7)}</Text>
        {data.numero ? <Text style={styles.muted}>Cotización #{data.numero}</Text> : null}

        <View style={styles.section}>
          <Text>Cliente: {data.cliente_nombre}</Text>
          {data.cliente_contacto ? <Text>Contacto: {data.cliente_contacto}</Text> : null}
        </View>

        <View style={styles.section}>
          <View style={styles.head}>
            <Text style={styles.colQty}>Cantidad</Text>
            <Text style={styles.colDesc}>Descripción</Text>
            <Text style={styles.colPrice}>Precio unitario</Text>
            <Text style={styles.colSub}>Subtotal</Text>
          </View>
          {data.lineas.map((linea, index) => (
            <View key={`${linea.descripcion}-${index}`} style={styles.row}>
              <Text style={styles.colQty}>{linea.cantidad}</Text>
              <Text style={styles.colDesc}>{linea.descripcion}</Text>
              <Text style={styles.colPrice}>{formatCop(linea.precio_unitario)}</Text>
              <Text style={styles.colSub}>{formatCop(linea.subtotal)}</Text>
            </View>
          ))}
          <Text style={styles.total}>Total a pagar {formatCop(data.total)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.note}>
            Formas de pago: Nequi, Bancolombia o transferencia. Los datos de la cuenta se
            confirman al aprobar el pedido.
          </Text>
          <Text style={styles.note}>
            Entrega: la fecha y el lugar se acuerdan después de la aprobación.
          </Text>
          <Text style={styles.note}>
            Condiciones: esta oferta vence a los 7 días. Cambios de diseño posteriores a la
            aprobación pueden modificar el valor.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
