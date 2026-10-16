import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { leerTsv, escribirTsv } from '../scripts/lib/tsv.mjs';
import { prepararCatalogo, COLUMNAS_PUBLICAS, COLUMNAS_PROHIBIDAS } from '../scripts/preparar-datos.mjs';

const base = {
  codigo: 'ECN-900', slug: 'prueba', activo: 'si', nombre: 'Prueba', presentacion: '1 L',
  precio: '20.00', precio_antes: '', categoria: 'Frescos', categoria_slug: 'frescos',
  subcategoria: 'Bebidas frescas', subcategoria_slug: 'bebidas-frescas', marca: 'Marca', marca_slug: 'marca',
  destacado: 'no', mas_vendido: 'no', descripcion_corta: '', descripcion_larga: '', modo_uso: '', beneficios: '',
  imagen_1: 'https://res.cloudinary.com/x/1.webp', imagen_1_tipo: 'frente', imagen_2: '', imagen_2_tipo: '',
  stock: '7', estado: 'publicado', en_oferta: 'no', descuento_pct: '', num_imagenes: '1',
};

test('leerTsv quita el BOM y tolera CRLF', () => {
  const { columnas, filas } = leerTsv('\uFEFFcodigo\tnombre\r\nECN-001\tLeche\r\n');
  assert.deepEqual(columnas, ['codigo', 'nombre']);
  assert.deepEqual(filas, [{ codigo: 'ECN-001', nombre: 'Leche' }]);
});

test('escribirTsv rechaza tabuladores dentro de un valor', () => {
  assert.throws(() => escribirTsv(['codigo', 'nombre'], [{ codigo: 'ECN-1', nombre: 'a\tb' }]), /ECN-1, columna nombre/);
});

test('solo salen columnas públicas: nada de stock', () => {
  const { filas } = prepararCatalogo([base], []);
  assert.deepEqual(Object.keys(filas[0]), COLUMNAS_PUBLICAS);
  for (const prohibida of COLUMNAS_PROHIBIDAS) assert.ok(!(prohibida in filas[0]));
});

test('el borrador llena solo celdas vacías y queda como pendiente', () => {
  const fila = { ...base, descripcion_corta: 'Texto real' };
  const borrador = { codigo: 'ECN-900', descripcion_corta: 'Borrador', descripcion_larga: 'Larga', modo_uso: '', beneficios: 'A | B' };
  const { filas, pendientes } = prepararCatalogo([fila], [borrador]);
  assert.equal(filas[0].descripcion_corta, 'Texto real');
  assert.equal(filas[0].descripcion_larga, 'Larga');
  assert.equal(filas[0].beneficios, 'A | B');
  assert.deepEqual(pendientes, ['ECN-900']);
});

test('si la foto 1 es la posterior y la 2 el frente, se intercambian', () => {
  const fila = { ...base, imagen_1: 'atras.webp', imagen_1_tipo: 'posterior', imagen_2: 'frente.webp', imagen_2_tipo: 'frente' };
  const { filas } = prepararCatalogo([fila], []);
  assert.equal(filas[0].imagen_1, 'frente.webp');
  assert.equal(filas[0].imagen_2, 'atras.webp');
});

test('categoría con mayúscula solo al inicio', () => {
  const { filas } = prepararCatalogo([{ ...base, categoria: 'Cuidado Personal' }], []);
  assert.equal(filas[0].categoria, 'Cuidado personal');
});

test('sin precio no puede quedar activo; queda en la lista de desactivados', () => {
  const { filas, desactivados } = prepararCatalogo([{ ...base, precio: '0.00' }, { ...base, codigo: 'ECN-901', precio: '' }], []);
  assert.deepEqual(filas.map((f) => f.activo), ['no', 'no']);
  assert.deepEqual(desactivados, ['ECN-900', 'ECN-901']);
});

test('precio con coma decimal o con "S/" sigue activo', () => {
  const { filas } = prepararCatalogo([{ ...base, precio: '46,00' }, { ...base, codigo: 'ECN-901', precio: 'S/ 46.00' }], []);
  assert.deepEqual(filas.map((f) => f.activo), ['si', 'si']);
});

test('la mayúscula inicial respeta siglas', () => {
  const { filas } = prepararCatalogo([{ ...base, subcategoria: 'Bebidas Con HIRI' }], []);
  assert.equal(filas[0].subcategoria, 'Bebidas con HIRI');
});

test('un borrador sin producto en el catálogo se informa', () => {
  const { huerfanos } = prepararCatalogo([base], [{ codigo: 'ECN-999', descripcion_corta: 'x' }]);
  assert.deepEqual(huerfanos, ['ECN-999']);
});

// Revisa el archivo que sí se sube al repositorio. Fija el estado acordado el
// 15-oct-2026: cuando la hoja cambie (Fases 7 y 8) hay que actualizar estos números.
test('data/catalogo-inicial.tsv cumple el estado acordado en PLAN-v2.md', async () => {
  const { columnas, filas } = leerTsv(await readFile(new URL('../data/catalogo-inicial.tsv', import.meta.url), 'utf8'));
  assert.deepEqual(columnas, COLUMNAS_PUBLICAS);
  assert.equal(filas.length, 29);

  const visibles = filas.filter((f) => f.activo === 'si' && Number(f.precio) > 0);
  assert.equal(visibles.length, 23);
  assert.ok(visibles.some((f) => f.codigo === 'ECN-022'), 'ECN-022 se publica');

  const miel = filas.find((f) => f.codigo === 'ECN-004');
  assert.match(miel.imagen_1, /ECN-004-1_/, 'ECN-004 muestra el frente primero');

  assert.ok(filas.every((f) => f.categoria !== 'Cuidado Personal'));
  for (const f of visibles) assert.ok(f.descripcion_corta, `${f.codigo} tiene descripción corta`);
});
