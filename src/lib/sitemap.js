// Mapa del sitio para buscadores (sitemap.xml): portada y una ficha por producto visible.
// Carrito, checkout, 404 y /guia no van: llevan noindex.

const escaparXml = (texto) => String(texto)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** Direcciones completas, en el mismo formato que los enlaces del sitio (con / al final). */
export function direccionesDelSitio(sitio, productos) {
  const base = new URL('/', sitio).href;
  return [base, ...productos.map((p) => new URL(`/producto/${p.slug}/`, base).href)];
}

export function sitemapXml(direcciones) {
  const urls = direcciones.map((d) => `  <url><loc>${escaparXml(d)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
