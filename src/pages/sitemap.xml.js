// /sitemap.xml: se genera en cada compilación con los productos del catálogo vigente.
import productos from '../data/productos.json';
import { direccionesDelSitio, sitemapXml } from '../lib/sitemap.js';

export function GET({ site }) {
  return new Response(sitemapXml(direccionesDelSitio(site, productos)), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
