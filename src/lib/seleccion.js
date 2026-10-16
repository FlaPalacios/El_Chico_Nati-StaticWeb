// Qué productos se muestran en la portada y en los recomendados.
// Reglas en docs/direccion-visual.md ("Para la construcción"). Todo sale de productos.json:
// si cambian los destacados en la hoja, la portada cambia sola.

const conFoto = (p) => p.imagenes.length > 0;

/**
 * Constelación del hero: 1 al centro y 6 alrededor.
 * Centro = primer destacado con foto. Anillo = resto de destacados, luego más vendidos,
 * luego un producto por subcategoría (en el orden de la hoja) hasta completar.
 */
export function constelacion(productos, alrededor = 6) {
  const candidatos = productos.filter(conFoto);
  const centro = candidatos.find((p) => p.destacado) ?? candidatos[0];
  if (!centro) return { centro: null, anillo: [] };
  const anillo = [];
  const agregar = (p) => { if (p && p !== centro && !anillo.includes(p) && anillo.length < alrededor) anillo.push(p); };
  candidatos.filter((p) => p.destacado).forEach(agregar);
  candidatos.filter((p) => p.masVendido).forEach(agregar);
  const vistas = new Set([centro, ...anillo].map((p) => p.subcategoriaSlug));
  for (const p of candidatos) {
    if (!vistas.has(p.subcategoriaSlug)) { agregar(p); vistas.add(p.subcategoriaSlug); }
  }
  candidatos.forEach(agregar); // si aún faltan, cualquiera
  return { centro, anillo };
}

/** Trío de un panel del carrusel: los códigos pedidos que sigan visibles, completando con otros. */
export function trio(codigos, productos, excluir = []) {
  const usables = productos.filter((p) => conFoto(p) && !excluir.includes(p.codigo));
  const elegidos = codigos.map((c) => usables.find((p) => p.codigo === c)).filter(Boolean);
  for (const p of usables) {
    if (elegidos.length >= 3) break;
    if (!elegidos.includes(p)) elegidos.push(p);
  }
  return elegidos.slice(0, 3);
}

/** Recomendados en la ficha: misma subcategoría, luego misma categoría, luego destacados. Nunca el mismo. */
export function relacionados(producto, productos, max = 8) {
  const peso = (x) => (x.subcategoriaSlug === producto.subcategoriaSlug ? 0
    : x.categoriaSlug === producto.categoriaSlug ? 1
      : x.destacado ? 2 : 3);
  return productos
    .filter((x) => x.codigo !== producto.codigo)
    .map((x, i) => ({ x, i }))
    .sort((a, b) => peso(a.x) - peso(b.x) || a.i - b.i) // estable: respeta el orden de la hoja
    .slice(0, max)
    .map(({ x }) => x);
}
