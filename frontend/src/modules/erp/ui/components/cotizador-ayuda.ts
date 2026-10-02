import type { InsumoRol } from "../../domain/CotizacionErp";

export const AYUDA_TRABAJO =
  "Un trabajo es un arte. El diseño, el margen y el descuento por mayor se cobran una sola vez para todas sus variantes. Cada ítem es una prenda distinta, con su descripción, su tiempo de prensa y su materia prima.";

export const AYUDA_ITEM =
  "Una variante del trabajo: descripción, piezas, tiempo de prensa y materia prima. El diseño no se repite aquí. Duplicar copia esta variante para cambiar la camisa o el texto.";

export const AYUDA_DESCRIPCION =
  "Texto que verá el cliente en la cotización y en el PDF. Identifica el producto y no cambia el costo ni el precio.";

export const AYUDA_CLIENTE_TRAE_PRENDA =
  "Si está activo, la prenda no se cobra: su rubro queda en cero y el selector de prenda se oculta. El resto de insumos, la prensa y los cargos sí se suman.";

export const AYUDA_REQUIERE_DISENO =
  "Si está activo, el diseño se cobra una sola vez en este trabajo. Si está apagado, el arte vale cero y cada ítem solo suma prensa y materia prima.";

export const AYUDA_MODO_DISENO =
  "Por tiempo usa los minutos y la tarifa de Parámetros. Por valor escribe el monto del arte. En los dos casos se cobra una sola vez para todas las variantes del trabajo.";

export const AYUDA_VALOR_DISENO =
  "Monto del diseño de este trabajo, una sola vez. No se multiplica por las piezas ni se reparte entre las variantes. Si eliges este modo, los minutos no entran al costo.";

export const AYUDA_MINUTOS_DISENO =
  "Tiempo de arte de este trabajo, no de cada pieza. Costo = minutos × costo por minuto de Parámetros. Se suma una vez, aunque haya camisa de niño y de adulto. Solo cuenta en el modo por tiempo.";

export const AYUDA_MINUTOS_PRODUCCION =
  "Tiempo de prensa o armado de una pieza. Costo = minutos × costo por minuto de Parámetros. Ese valor se multiplica por las piezas.";

export const AYUDA_MARGEN =
  "Porcentaje de ganancia de este trabajo, sobre el diseño y sobre cada variante. El precio sale del costo dividido por (1 − margen / 100). El descuento por mayor se aplica después.";

export const AYUDA_DESCUENTO =
  "Descuento comercial de este trabajo, sobre el precio del diseño y de cada variante. Cero si no hay descuento por mayor. No cambia el costo de fabricación.";

export const AYUDA_CANTIDAD =
  "Piezas de esta variante. Multiplica la materia prima, la prensa, la depreciación y el costo fijo. El diseño del trabajo no se multiplica.";

export const AYUDA_COSTO_FIJO =
  "Cargo operativo de cada pieza, dentro del rango de Parámetros. Se suma al costo de una pieza y luego se multiplica por las piezas. La depreciación por prenda también se suma sola y no se edita aquí.";

export const AYUDA_CATEGORIA =
  "Solo reduce la lista de insumos de este rol. Elegir una categoría no cambia el costo ni el precio.";

export const AYUDA_CANTIDAD_USADA =
  "Cuánto de ese insumo usa una pieza. 1 es lo normal. La tinta es la impresión: su precio está en Insumos, y aquí pones cuántas lleva la pieza (2 si van frente y espalda). Más cinta se indica subiendo este número. No escribas el total del pedido: las piezas ya lo multiplican.";

export const AYUDA_COPIAR =
  "Copia el nombre del insumo para pegarlo en la descripción. No modifica el cálculo.";

export const AYUDA_DUPLICAR =
  "Crea otra variante con la misma descripción, piezas, prensa y materia prima. El diseño no se copia porque ya es del trabajo. Ahí se cambia la camisa y, si hace falta, el texto.";

export const AYUDA_ROL: Record<InsumoRol, string> = {
  prenda:
    "Una prenda por cada pieza terminada. El lote es 1 × las piezas × el costo de la prenda. No escribas aquí la cantidad del pedido: esa cifra está en Piezas.",
  tinta:
    "La impresión de una pieza. El valor de cada impresión es el costo unitario de esta tinta en Insumos. La cantidad es cuántas impresiones lleva la pieza.",
  papel:
    "Papel de sublimación de una pieza. Su costo es la cantidad por pieza × el costo unitario, y las piezas lo multiplican.",
  cinta:
    "Cinta térmica de una pieza. Sube la cantidad si el trabajo usa más cinta. Las piezas multiplican ese consumo.",
  empaque:
    "Empaque de una pieza. Su costo es la cantidad por pieza × el costo unitario, y las piezas lo multiplican.",
};

export const AYUDA_COSTO_DIRECTO =
  "Costo de fabricación de una pieza, sin el diseño: prensa, depreciación, costo fijo y materia de esa pieza. El diseño se cobra aparte, una vez por trabajo.";

export const AYUDA_COSTO_TOTAL =
  "Costo de fabricación de todas las piezas de esta variante: costo unitario × piezas. No incluye el diseño del trabajo.";

export const AYUDA_GANANCIA =
  "Ganancia en pesos del ítem: total de venta menos el costo total de fabricación. El descuento por mayor ya está descontado del precio.";

export const AYUDA_PRECIO_VENTA =
  "Precio de una pieza: costo de fabricación unitario / (1 − margen / 100), y después el descuento por mayor.";

export const AYUDA_SUBTOTAL =
  "Total de venta de este ítem: precio de venta unitario × piezas.";

export const AYUDA_CLIENTE =
  "Nombre que aparece en la cotización guardada y en el PDF. No cambia los precios.";

export const AYUDA_CONTACTO =
  "Teléfono u otro medio del cliente. Sale en el PDF y no entra al cálculo.";

export const AYUDA_PDF =
  "Descarga una cotización comercial con cantidades y precios de venta. No incluye insumos, minutos, margen ni costos.";
