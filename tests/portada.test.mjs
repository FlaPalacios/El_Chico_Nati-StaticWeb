// Formato, búsqueda y selección de productos de la portada y la ficha.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { soles } from '../src/lib/formato.js';
import { normalizar, textoBuscable, coincide } from '../src/lib/buscar.js';
import { constelacion, trio, relacionados } from '../src/lib/seleccion.js';
import { leerTabla } from '../scripts/lib/csv.mjs';
import { procesarCatalogo } from '../scripts/lib/catalogo.mjs';

// Mismos productos que verá la web
const { columnas, filas } = leerTabla(await readFile(new URL('../data/catalogo-inicial.tsv', import.meta.url), 'utf8'));
const { productos } = procesarCatalogo(columnas, filas);
const buscarCodigo = (c) => productos.find((p) => p.codigo === c);

test('soles: dos decimales y espacio irrompible', () => {
  assert.equal(soles(46), `S/${String.fromCharCode(160)}46.00`);
  assert.equal(soles(8.5), `S/${String.fromCharCode(160)}8.50`);
});

test('búsqueda sin tildes ni mayúsculas, por palabras', () => {
  assert.equal(normalizar('  Café   y CACAO '), 'cafe y cacao');
  const texto = textoBuscable(buscarCodigo('ECN-011')); // Galleta Café Latte
  assert.ok(coincide(texto, 'cafe'));
  assert.ok(coincide(texto, 'latte galleta'));
  assert.ok(!coincide(texto, 'miel'));
  assert.ok(coincide(texto, ''));
});

test('búsqueda por marca: "henna" encuentra los 5 de Henna Colors', () => {
  assert.equal(productos.filter((p) => coincide(textoBuscable(p), 'henna')).length, 5);
});

test('constelación: centro = primer destacado; 6 alrededor, sin repetir', () => {
  const { centro, anillo } = constelacion(productos);
  assert.equal(centro.codigo, 'ECN-001');
  assert.equal(anillo.length, 6);
  assert.equal(anillo[0].codigo, 'ECN-005'); // el otro destacado va primero
  assert.equal(new Set(anillo.map((p) => p.codigo)).size, 6);
  assert.ok(!anillo.includes(centro));
});

test('constelación sin destacados usa el primero con foto', () => {
  const sin = productos.map((p) => ({ ...p, destacado: false }));
  assert.equal(constelacion(sin).centro.codigo, sin[0].codigo);
});

test('trío: respeta los códigos visibles y completa si falta alguno', () => {
  assert.deepEqual(trio(['ECN-018', 'ECN-020', 'ECN-023'], productos).map((p) => p.codigo), ['ECN-018', 'ECN-020', 'ECN-023']);
  const r = trio(['ECN-018', 'ECN-999', 'ECN-023'], productos);
  assert.equal(r.length, 3);
  assert.deepEqual(r.slice(0, 2).map((p) => p.codigo), ['ECN-018', 'ECN-023']);
});

test('relacionados: nunca el mismo, primero su subcategoría, máximo 8', () => {
  const tinte = buscarCodigo('ECN-006');
  const r = relacionados(tinte, productos);
  assert.equal(r.length, 8);
  assert.ok(!r.includes(tinte));
  assert.deepEqual(r.slice(0, 3).map((p) => p.subcategoriaSlug), ['cuidado-de-cabello', 'cuidado-de-cabello', 'cuidado-de-cabello']);
  assert.equal(r[3].categoriaSlug, 'cuidado-personal'); // luego su categoría (aceite de almendras)
});

test('carrito: lee solo datos válidos y une repetidos', async () => {
  const { leerCarrito } = await import('../src/lib/carrito.js');
  assert.deepEqual(leerCarrito('no es json'), []);
  assert.deepEqual(leerCarrito('{"a":1}'), []);
  assert.deepEqual(
    leerCarrito('[{"codigo":"ECN-001","cantidad":2},{"codigo":"ECN-001","cantidad":"3"},{"codigo":"<x>","cantidad":1},{"codigo":"ECN-002","cantidad":0},{"codigo":"ECN-003","cantidad":500}]'),
    [{ codigo: 'ECN-001', cantidad: 5 }, { codigo: 'ECN-003', cantidad: 99 }],
  );
});

test('carrito: agregar suma y respeta 1 a 99', async () => {
  const { agregar, unidades } = await import('../src/lib/carrito.js');
  let c = agregar([], 'ECN-001', 2);
  c = agregar(c, 'ECN-001', 1);
  c = agregar(c, 'ECN-005');
  assert.deepEqual(c, [{ codigo: 'ECN-001', cantidad: 3 }, { codigo: 'ECN-005', cantidad: 1 }]);
  assert.equal(unidades(c), 4);
  assert.equal(agregar(c, 'ECN-005', 500).find((i) => i.codigo === 'ECN-005').cantidad, 99);
  assert.equal(agregar(c, 'malo', 1), c);
});

test('catálogo: el estado de la URL descarta lo que no existe', async () => {
  const { estadoDesdeUrl } = await import('../src/lib/catalogo.js');
  const opciones = {
    categorias: ['frescos', 'abarrotes'],
    subcategorias: { 'bebidas-frescas': 'frescos', 'cafe-y-cacao': 'abarrotes' },
    marcas: ['hiri', 'fit-rex'],
  };
  const e = (q) => estadoDesdeUrl(new URLSearchParams(q), opciones);
  assert.deepEqual(e('cat=abarrotes&sub=cafe-y-cacao&marca=fit-rex&orden=precio-asc&q=miel'),
    { q: 'miel', cat: 'abarrotes', sub: 'cafe-y-cacao', marca: 'fit-rex', orden: 'precio-asc' });
  assert.equal(e('cat=xxx').cat, '');
  assert.deepEqual([e('sub=bebidas-frescas').cat, e('sub=bebidas-frescas').sub], ['frescos', 'bebidas-frescas']); // se deduce la categoría
  assert.equal(e('cat=abarrotes&sub=bebidas-frescas').sub, ''); // sub de otra categoría
  assert.equal(e('sub=no-existe').sub, '');
  assert.equal(e('marca=retirada').marca, '');
  assert.equal(e('orden=xyz').orden, '');
  for (const raro of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
    assert.deepEqual([e(`sub=${raro}`).cat, e(`sub=${raro}`).sub], ['', ''], raro); // propiedades heredadas no cuentan
  }
});

test('catálogo: filtros combinados y orden estable', async () => {
  const { pasaFiltros, comparador } = await import('../src/lib/catalogo.js');
  const item = { cat: 'abarrotes', sub: 'cafe-y-cacao', marca: 'green-house', texto: 'nibs de cacao green house' };
  const base = { q: '', cat: '', sub: '', marca: '', orden: '' };
  assert.ok(pasaFiltros(item, base));
  assert.ok(pasaFiltros(item, { ...base, cat: 'abarrotes', q: 'cacao' }));
  assert.ok(!pasaFiltros(item, { ...base, marca: 'hiri' }));
  const lista = [
    { pos: 0, precio: 23, nombre: 'Leche', destacado: true },
    { pos: 1, precio: 8, nombre: 'Galleta', destacado: false },
    { pos: 2, precio: 8, nombre: 'Algarrobina', destacado: false },
    { pos: 3, precio: 120, nombre: 'NAD+', destacado: true },
  ];
  const orden = (o) => [...lista].sort(comparador(o)).map((x) => x.pos);
  assert.deepEqual(orden(''), [0, 3, 1, 2]);
  assert.deepEqual(orden('precio-asc'), [1, 2, 0, 3]);
  assert.deepEqual(orden('precio-desc'), [3, 0, 1, 2]);
  assert.deepEqual(orden('nombre'), [2, 1, 0, 3]);
});
