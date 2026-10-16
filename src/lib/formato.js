// Formatos de la tienda.

const ESPACIO_FIJO = String.fromCharCode(160); // "S/" nunca queda solo al final de una línea

/** 46 → "S/ 46.00" (con espacio irrompible). */
export function soles(monto) {
  return `S/${ESPACIO_FIJO}${Number(monto).toFixed(2)}`;
}
