import { test } from 'node:test';
import assert from 'node:assert/strict';
import { direccionesDelSitio, sitemapXml } from '../src/lib/sitemap.js';

test('portada y una ficha por producto, con / al final como los enlaces del sitio', () => {
  const d = direccionesDelSitio('https://elchiconaturista.com', [{ slug: 'miel-de-abeja' }, { slug: 'te-matcha' }]);
  assert.deepEqual(d, [
    'https://elchiconaturista.com/',
    'https://elchiconaturista.com/producto/miel-de-abeja/',
    'https://elchiconaturista.com/producto/te-matcha/',
  ]);
});

test('XML válido y con caracteres escapados', () => {
  const xml = sitemapXml(['https://ejemplo.com/?a=1&b=2']);
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  assert.match(xml, /<loc>https:\/\/ejemplo.com\/\?a=1&amp;b=2<\/loc>/);
});
