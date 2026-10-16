// Carrito: lógica pura, sin navegador. Guarda solo código y cantidad (PLAN-v2.md, sección 8):
// nombre y precio se leen siempre del catálogo vigente.

export const CLAVE = 'ecn.carrito.v2';
export const MAX_CANTIDAD = 99;
const RE_CODIGO = /^ECN-\d{3}$/;

/** Texto guardado → lista válida [{ codigo, cantidad }]. Cualquier cosa rara se descarta. */
export function leerCarrito(texto) {
  let datos;
  try { datos = JSON.parse(texto ?? '[]'); } catch { return []; }
  if (!Array.isArray(datos)) return [];
  const vistos = new Map();
  for (const item of datos) {
    if (!item || typeof item.codigo !== 'string' || !RE_CODIGO.test(item.codigo)) continue;
    const cantidad = Math.trunc(Number(item.cantidad));
    if (!(cantidad >= 1)) continue;
    vistos.set(item.codigo, Math.min(MAX_CANTIDAD, (vistos.get(item.codigo) ?? 0) + cantidad));
  }
  return [...vistos].map(([codigo, cantidad]) => ({ codigo, cantidad }));
}

/** Suma `cantidad` del producto (entre 1 y 99 por producto). Devuelve una lista nueva. */
export function agregar(items, codigo, cantidad = 1) {
  if (typeof codigo !== 'string' || !RE_CODIGO.test(codigo)) return items;
  const n = Math.max(1, Math.min(MAX_CANTIDAD, Math.trunc(Number(cantidad)) || 1));
  const existe = items.find((i) => i.codigo === codigo);
  if (!existe) return [...items, { codigo, cantidad: n }];
  return items.map((i) => (i.codigo === codigo ? { codigo, cantidad: Math.min(MAX_CANTIDAD, i.cantidad + n) } : i));
}

/** Total de unidades (para el contador de la cabecera). */
export const unidades = (items) => items.reduce((n, i) => n + i.cantidad, 0);
