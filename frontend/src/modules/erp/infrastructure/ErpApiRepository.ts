import { api } from "@/shared/lib/axios";
import type {
  CreateErpCategoriaInput,
  CreateErpProveedorInput,
  ErpCategoria,
  ErpProveedor,
} from "../domain/CatalogoErp";
import type { InsumoErp, InsumoErpInput } from "../domain/InsumoErp";
import type { ParametrosErp, UpdateParametrosErp } from "../domain/ParametrosErp";
import type {
  CotizacionCalculoResponse,
  CotizacionErp,
  CotizacionItemEditable,
  CotizacionItemResultado,
  CreateCotizacionDto,
  EstadoCotizacion,
  InsumoRol,
  TrabajoErp,
  TrabajoInput,
  TrabajoResultado,
} from "../domain/CotizacionErp";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface RawInsumoLinea {
  insumo_id: number;
  rol: InsumoRol;
  cantidad_usada: number;
}

interface RawItem {
  descripcion_producto: string;
  cliente_trae_prenda?: boolean;
  cantidad: number;
  minutos_produccion: number;
  costo_fijo: number;
  costo_unitario: number;
  precio_unitario: number;
  subtotal: number;
  costo_prenda: number;
  costo_tinta: number;
  costo_papel: number;
  costo_cinta: number;
  costo_empaque: number;
  costo_minuto: number;
  depreciacion: number;
  insumos?: RawInsumoLinea[];
}

interface RawTrabajo {
  requiere_diseno: boolean;
  diseno_por_valor?: boolean;
  valor_diseno?: number;
  minutos_diseno: number;
  margen_esperado: number;
  descuento_porcentaje?: number;
  costo_diseno: number;
  precio_diseno: number;
  diseno_en_items?: boolean;
  items: RawItem[];
}

interface RawCalculo {
  total_costo: number;
  total_precio: number;
  trabajos: RawTrabajo[];
}

interface RawCotizacion {
  id: number;
  cliente_nombre: string;
  cliente_contacto: string;
  fecha: string;
  total_costo: number;
  total_precio: number;
  estado: EstadoCotizacion;
  trabajos?: RawTrabajo[];
}

function unwrap<T>(body: ApiEnvelope<T> | T): T {
  if (
    body &&
    typeof body === "object" &&
    "success" in body &&
    "data" in body
  ) {
    return body.data;
  }
  return body;
}

function money(value: number): number {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function mapItem(raw: RawItem): CotizacionItemResultado {
  const costoDirecto = money(raw.costo_unitario);
  const subtotalCosto = money(costoDirecto * Number(raw.cantidad));
  const subtotalPrecio = money(raw.subtotal);

  return {
    descripcion_producto: raw.descripcion_producto,
    cantidad: Number(raw.cantidad),
    costo_directo_unitario: costoDirecto,
    precio_unitario_sugerido: money(raw.precio_unitario),
    subtotal_costo: subtotalCosto,
    subtotal_precio: subtotalPrecio,
    ganancia_estimada: money(subtotalPrecio - subtotalCosto),
    desglose: {
      costo_prenda: money(raw.costo_prenda),
      costo_tinta: money(raw.costo_tinta),
      costo_papel: money(raw.costo_papel),
      costo_cinta: money(raw.costo_cinta),
      costo_empaque: money(raw.costo_empaque),
      costo_produccion: money(
        Number(raw.minutos_produccion) * Number(raw.costo_minuto),
      ),
      depreciacion: money(raw.depreciacion),
      costo_fijo: money(raw.costo_fijo),
    },
  };
}

function mapItemEditable(raw: RawItem): CotizacionItemEditable {
  return {
    descripcion_producto: raw.descripcion_producto,
    cliente_trae_prenda: Boolean(raw.cliente_trae_prenda),
    minutos_produccion: Number(raw.minutos_produccion),
    cantidad: Number(raw.cantidad),
    costo_fijo: Number(raw.costo_fijo),
    insumos: (raw.insumos ?? []).map((linea) => ({
      insumo_id: Number(linea.insumo_id),
      rol: linea.rol,
      cantidad_usada: Number(linea.cantidad_usada),
    })),
  };
}

function mapTrabajoResultado(raw: RawTrabajo): TrabajoResultado {
  return {
    margen_esperado: Number(raw.margen_esperado),
    costo_diseno: money(raw.costo_diseno),
    precio_diseno: money(raw.precio_diseno),
    items: raw.items.map(mapItem),
  };
}

function mapTrabajo(raw: RawTrabajo): TrabajoErp {
  return {
    requiere_diseno: Boolean(raw.requiere_diseno),
    diseno_por_valor: Boolean(raw.diseno_por_valor),
    valor_diseno: Number(raw.valor_diseno ?? 0),
    minutos_diseno: Number(raw.minutos_diseno),
    margen_esperado: Number(raw.margen_esperado),
    descuento_porcentaje: Number(raw.descuento_porcentaje ?? 0),
    costo_diseno: money(raw.costo_diseno),
    precio_diseno: money(raw.precio_diseno),
    diseno_en_items: Boolean(raw.diseno_en_items),
    items: raw.items.map(mapItem),
    itemsEdicion: raw.items.map(mapItemEditable),
  };
}

function mapCalculo(raw: RawCalculo): CotizacionCalculoResponse {
  return {
    total_costo: money(raw.total_costo),
    total_precio: money(raw.total_precio),
    ganancia_total: money(Number(raw.total_precio) - Number(raw.total_costo)),
    trabajos: raw.trabajos.map(mapTrabajoResultado),
  };
}

function mapCotizacion(raw: RawCotizacion): CotizacionErp {
  return {
    id: raw.id,
    cliente_nombre: raw.cliente_nombre,
    cliente_contacto: raw.cliente_contacto,
    fecha: String(raw.fecha).slice(0, 10),
    total_costo: money(raw.total_costo),
    total_precio: money(raw.total_precio),
    estado: raw.estado,
    trabajos: raw.trabajos?.map(mapTrabajo),
  };
}

export class ErpApiRepository {
  static async getParametros(): Promise<ParametrosErp> {
    const { data } = await api.get<ApiEnvelope<ParametrosErp>>("/erp/parametros");
    return unwrap(data);
  }

  static async updateParametros(payload: UpdateParametrosErp): Promise<ParametrosErp> {
    const { data } = await api.put<ApiEnvelope<ParametrosErp>>(
      "/erp/parametros",
      payload,
    );
    return unwrap(data);
  }

  static async getCategorias(): Promise<ErpCategoria[]> {
    const { data } = await api.get<ApiEnvelope<ErpCategoria[]>>("/erp/categorias");
    return unwrap(data);
  }

  static async createCategoria(payload: CreateErpCategoriaInput): Promise<ErpCategoria> {
    const { data } = await api.post<ApiEnvelope<ErpCategoria>>(
      "/erp/categorias",
      payload,
    );
    return unwrap(data);
  }

  static async getProveedores(): Promise<ErpProveedor[]> {
    const { data } = await api.get<ApiEnvelope<ErpProveedor[]>>("/erp/proveedores");
    return unwrap(data);
  }

  static async createProveedor(payload: CreateErpProveedorInput): Promise<ErpProveedor> {
    const { data } = await api.post<ApiEnvelope<ErpProveedor>>(
      "/erp/proveedores",
      payload,
    );
    return unwrap(data);
  }

  static async getInsumos(): Promise<InsumoErp[]> {
    const { data } = await api.get<ApiEnvelope<InsumoErp[]>>("/erp/insumos");
    return unwrap(data);
  }

  static async createInsumo(payload: InsumoErpInput): Promise<InsumoErp> {
    const { data } = await api.post<ApiEnvelope<InsumoErp>>("/erp/insumos", payload);
    return unwrap(data);
  }

  static async updateInsumo(
    id: number,
    payload: Partial<InsumoErpInput>,
  ): Promise<InsumoErp> {
    const { data } = await api.put<ApiEnvelope<InsumoErp>>(
      `/erp/insumos/${id}`,
      payload,
    );
    return unwrap(data);
  }

  static async calcularCotizacion(
    trabajos: TrabajoInput[],
  ): Promise<CotizacionCalculoResponse> {
    const { data } = await api.post<ApiEnvelope<RawCalculo>>(
      "/erp/cotizaciones/calcular",
      { trabajos },
    );
    return mapCalculo(unwrap(data));
  }

  static async crearCotizacion(dto: CreateCotizacionDto): Promise<CotizacionErp> {
    const { data } = await api.post<ApiEnvelope<RawCotizacion>>(
      "/erp/cotizaciones",
      dto,
    );
    return mapCotizacion(unwrap(data));
  }

  static async getCotizaciones(): Promise<CotizacionErp[]> {
    const { data } = await api.get<ApiEnvelope<RawCotizacion[]>>("/erp/cotizaciones");
    return unwrap(data).map(mapCotizacion);
  }

  static async getCotizacionById(id: number): Promise<CotizacionErp> {
    const { data } = await api.get<ApiEnvelope<RawCotizacion>>(
      `/erp/cotizaciones/${id}`,
    );
    return mapCotizacion(unwrap(data));
  }

  static async updateCotizacion(
    id: number,
    dto: CreateCotizacionDto,
  ): Promise<CotizacionErp> {
    const { data } = await api.put<ApiEnvelope<RawCotizacion>>(
      `/erp/cotizaciones/${id}`,
      dto,
    );
    return mapCotizacion(unwrap(data));
  }

  static async updateEstadoCotizacion(
    id: number,
    estado: EstadoCotizacion,
  ): Promise<CotizacionErp> {
    const { data } = await api.patch<ApiEnvelope<RawCotizacion>>(
      `/erp/cotizaciones/${id}/estado`,
      { estado },
    );
    return mapCotizacion(unwrap(data));
  }
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string") {
        return message;
      }
      if (Array.isArray(message)) {
        return message.join(", ");
      }
    }
  }
  return fallback;
}
