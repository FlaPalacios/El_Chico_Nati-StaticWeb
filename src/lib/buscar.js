// Búsqueda del catálogo sin tildes ni mayúsculas: "cafe" encuentra "Café".
// Se usa al compilar (texto de búsqueda de cada lámina) y en el navegador (lo que escribe el cliente).

/** "Café y Cacao " → "cafe y cacao" */
export function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Texto en el que se busca: nombre, marca, categoría, subcategoría y presentación. */
export function textoBuscable(p) {
  return normalizar([p.nombre, p.marca, p.categoria, p.subcategoria, p.presentacion].join(' '));
}

/** Coincide si cada palabra de la búsqueda aparece en el texto. */
export function coincide(texto, busqueda) {
  const q = normalizar(busqueda);
  if (!q) return true;
  return q.split(' ').every((palabra) => texto.includes(palabra));
}
