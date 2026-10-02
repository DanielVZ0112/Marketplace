import { InsumoRol } from '../../../common/enums/insumo-rol.enum';

export class CosteoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CosteoError';
  }
}

export interface InsumoCosteoInput {
  insumo_id: number;
  rol: InsumoRol;
  cantidad_usada: number;
  costo_unitario: number;
}

export interface ItemCosteoInput {
  descripcion_producto: string;
  cliente_trae_prenda: boolean;
  cantidad: number;
  minutos_produccion: number;
  costo_fijo: number;
  insumos: InsumoCosteoInput[];
}

export interface TrabajoCosteoInput {
  requiere_diseno: boolean;
  diseno_por_valor: boolean;
  valor_diseno: number;
  minutos_diseno: number;
  margen_esperado: number;
  descuento_porcentaje: number;
  items: ItemCosteoInput[];
}

export interface ParametrosCosteo {
  costo_minuto: number;
  depreciacion_por_prenda: number;
  costo_fijo_min: number;
  costo_fijo_max: number;
}

export interface InsumoCalculado {
  insumo_id: number;
  rol: InsumoRol;
  cantidad_usada: number;
  costo_unitario_snapshot: number;
  costo_linea: number;
}

export interface ItemCalculado {
  descripcion_producto: string;
  cliente_trae_prenda: boolean;
  cantidad: number;
  minutos_produccion: number;
  costo_minuto: number;
  depreciacion: number;
  costo_fijo: number;
  costo_prenda: number;
  costo_tinta: number;
  costo_papel: number;
  costo_cinta: number;
  costo_empaque: number;
  costo_unitario: number;
  precio_unitario: number;
  subtotal: number;
  insumos: InsumoCalculado[];
}

export interface TrabajoCalculado {
  requiere_diseno: boolean;
  diseno_por_valor: boolean;
  valor_diseno: number;
  minutos_diseno: number;
  margen_esperado: number;
  descuento_porcentaje: number;
  costo_minuto: number;
  costo_diseno: number;
  precio_diseno: number;
  items: ItemCalculado[];
}

export interface CotizacionCalculada {
  trabajos: TrabajoCalculado[];
  total_costo: number;
  total_precio: number;
}

const ROLES = new Set<string>(Object.values(InsumoRol));

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function sumRol(insumos: InsumoCalculado[], rol: InsumoRol): number {
  return roundMoney(
    insumos
      .filter((insumo) => insumo.rol === rol)
      .reduce((total, insumo) => total + insumo.costo_linea, 0),
  );
}

function precioDesdeCosto(
  costo: number,
  margen: number,
  descuento: number,
): number {
  const precioBase = roundMoney(costo / (1 - margen / 100));
  return roundMoney(precioBase * (1 - descuento / 100));
}

export function calcularCotizacion(
  trabajos: TrabajoCosteoInput[],
  params: ParametrosCosteo,
): CotizacionCalculada {
  if (trabajos.length === 0) {
    throw new CosteoError('La cotización debe incluir al menos un trabajo');
  }

  const calculados = trabajos.map((trabajo) =>
    calcularTrabajo(trabajo, params),
  );
  return {
    trabajos: calculados,
    total_costo: roundMoney(
      calculados.reduce(
        (total, trabajo) =>
          total +
          trabajo.costo_diseno +
          trabajo.items.reduce(
            (suma, item) => suma + item.costo_unitario * item.cantidad,
            0,
          ),
        0,
      ),
    ),
    total_precio: roundMoney(
      calculados.reduce(
        (total, trabajo) =>
          total +
          trabajo.precio_diseno +
          trabajo.items.reduce((suma, item) => suma + item.subtotal, 0),
        0,
      ),
    ),
  };
}

function calcularTrabajo(
  trabajo: TrabajoCosteoInput,
  params: ParametrosCosteo,
): TrabajoCalculado {
  if (trabajo.items.length === 0) {
    throw new CosteoError('Cada trabajo debe incluir al menos un ítem');
  }
  if (trabajo.margen_esperado < 0 || trabajo.margen_esperado > 99.99) {
    throw new CosteoError('El margen esperado debe estar entre 0 y 99.99');
  }
  if (trabajo.descuento_porcentaje < 0 || trabajo.descuento_porcentaje > 100) {
    throw new CosteoError('El descuento por mayor debe estar entre 0 y 100');
  }
  if (trabajo.minutos_diseno < 0) {
    throw new CosteoError('Los minutos de diseño no pueden ser negativos');
  }
  if (trabajo.valor_diseno < 0) {
    throw new CosteoError('El valor del diseño no puede ser negativo');
  }

  const costoDiseno = !trabajo.requiere_diseno
    ? 0
    : trabajo.diseno_por_valor
      ? roundMoney(trabajo.valor_diseno)
      : roundMoney(trabajo.minutos_diseno * params.costo_minuto);
  const precioDiseno = precioDesdeCosto(
    costoDiseno,
    trabajo.margen_esperado,
    trabajo.descuento_porcentaje,
  );

  return {
    requiere_diseno: trabajo.requiere_diseno,
    diseno_por_valor: trabajo.diseno_por_valor,
    valor_diseno: trabajo.diseno_por_valor
      ? roundMoney(trabajo.valor_diseno)
      : 0,
    minutos_diseno:
      trabajo.requiere_diseno && !trabajo.diseno_por_valor
        ? trabajo.minutos_diseno
        : 0,
    margen_esperado: trabajo.margen_esperado,
    descuento_porcentaje: trabajo.descuento_porcentaje,
    costo_minuto: params.costo_minuto,
    costo_diseno: costoDiseno,
    precio_diseno: precioDiseno,
    items: trabajo.items.map((item) =>
      calcularItem(
        item,
        params,
        trabajo.margen_esperado,
        trabajo.descuento_porcentaje,
      ),
    ),
  };
}

function calcularItem(
  item: ItemCosteoInput,
  params: ParametrosCosteo,
  margen: number,
  descuento: number,
): ItemCalculado {
  if (
    item.costo_fijo < params.costo_fijo_min ||
    item.costo_fijo > params.costo_fijo_max
  ) {
    throw new CosteoError(
      `El costo fijo debe estar entre ${params.costo_fijo_min} y ${params.costo_fijo_max}`,
    );
  }
  if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
    throw new CosteoError('La cantidad debe ser un entero mayor o igual a 1');
  }
  if (item.minutos_produccion < 0) {
    throw new CosteoError('Los minutos no pueden ser negativos');
  }

  const insumos = item.insumos.map((insumo) => {
    if (!ROLES.has(insumo.rol)) {
      throw new CosteoError(`Rol de insumo no válido: ${insumo.rol}`);
    }
    if (insumo.cantidad_usada < 0) {
      throw new CosteoError(
        'La cantidad usada de insumo no puede ser negativa',
      );
    }
    const cantidadUsada =
      insumo.rol === InsumoRol.PRENDA ? 1 : insumo.cantidad_usada;
    return {
      insumo_id: insumo.insumo_id,
      rol: insumo.rol,
      cantidad_usada: cantidadUsada,
      costo_unitario_snapshot: insumo.costo_unitario,
      costo_linea: roundMoney(cantidadUsada * insumo.costo_unitario),
    };
  });

  const costoPrenda = item.cliente_trae_prenda
    ? 0
    : sumRol(insumos, InsumoRol.PRENDA);
  const costoTinta = sumRol(insumos, InsumoRol.TINTA);
  const costoPapel = sumRol(insumos, InsumoRol.PAPEL);
  const costoCinta = sumRol(insumos, InsumoRol.CINTA);
  const costoEmpaque = sumRol(insumos, InsumoRol.EMPAQUE);
  const costoProduccion = roundMoney(
    item.minutos_produccion * params.costo_minuto,
  );
  const costoUnitario = roundMoney(
    costoPrenda +
      costoTinta +
      costoPapel +
      costoCinta +
      costoEmpaque +
      costoProduccion +
      params.depreciacion_por_prenda +
      item.costo_fijo,
  );
  const precioUnitario = precioDesdeCosto(costoUnitario, margen, descuento);

  return {
    descripcion_producto: item.descripcion_producto,
    cliente_trae_prenda: item.cliente_trae_prenda,
    cantidad: item.cantidad,
    minutos_produccion: item.minutos_produccion,
    costo_minuto: params.costo_minuto,
    depreciacion: params.depreciacion_por_prenda,
    costo_fijo: item.costo_fijo,
    costo_prenda: costoPrenda,
    costo_tinta: costoTinta,
    costo_papel: costoPapel,
    costo_cinta: costoCinta,
    costo_empaque: costoEmpaque,
    costo_unitario: costoUnitario,
    precio_unitario: precioUnitario,
    subtotal: roundMoney(precioUnitario * item.cantidad),
    insumos,
  };
}
