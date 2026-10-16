import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { procesarCatalogo, leerPrecio, leerSiNo } from '../scripts/lib/catalogo.mjs';
import { leerCsv, leerTabla } from '../scripts/lib/csv.mjs';
import { COLUMNAS_PUBLICAS } from '../scripts/lib/columnas.mjs';

const FOTO = 'https://res.cloudinary.com/deaq5dfwt/image/upload/v1/ECN-900-1.webp';
const base = (cambios = {}) => ({
  codigo: 'ECN-900', slug: 'prueba', activo: 'si', nombre: 'Prueba', presentacion: '1 L',
  precio: '20.00', precio_antes: '', categoria: 'Frescos', categoria_slug: 'frescos',
  subcategoria: 'Bebidas frescas', subcategoria_slug: 'bebidas-frescas', marca: 'Marca', marca_slug: 'marca',
  destacado: 'no', mas_vendido: 'no', descripcion_corta: 'Corta', descripcion_larga: '', modo_uso: '',
  beneficios: 'Uno | Dos', imagen_1: FOTO, imagen_2: '', ...cambios,
});
const procesar = (filas, columnas = COLUMNAS_PUBLICAS) => procesarCatalogo(columnas, filas);
const otro = (cambios = {}) => base({ codigo: 'ECN-901', slug: 'otro', ...cambios });

test('leerPrecio acepta punto, coma y S/; rechaza texto', () => {
  assert.equal(leerPrecio('46.00'), 46);
  assert.equal(leerPrecio('46,50'), 46.5);
  assert.equal(leerPrecio('S/ 46'), 46);
  assert.equal(leerPrecio(''), null);
  assert.ok(Number.isNaN(leerPrecio('cuarenta')));
});

test('leerSiNo acepta si, sí, Sí y no', () => {
  assert.equal(leerSiNo('Sí'), true);
  assert.equal(leerSiNo('si'), true);
  assert.equal(leerSiNo('NO'), false);
  assert.equal(leerSiNo(''), false);
  assert.equal(leerSiNo('tal vez'), undefined);
});

test('un producto válido sale con beneficios en lista', () => {
  const r = procesar([base()]);
  assert.deepEqual(r.errores, []);
  assert.equal(r.productos.length, 1);
  assert.deepEqual(r.productos[0].beneficios, ['Uno', 'Dos']);
  assert.equal(r.categorias[0].subcategorias[0].cantidad, 1);
});

test('el producto publicado no lleva columnas privadas', () => {
  const r = procesar([{ ...base() }]);
  const claves = Object.keys(r.productos[0]).join(' ');
  assert.doesNotMatch(claves, /stock|costo|proveedor|margen/);
});

test('error: falta una columna', () => {
  const r = procesar([base()], COLUMNAS_PUBLICAS.filter((c) => c !== 'precio'));
  assert.match(r.errores.join('\n'), /Falta la columna «precio»/);
});

test('error: columna prohibida (stock)', () => {
  const r = procesar([{ ...base(), stock: '7' }], [...COLUMNAS_PUBLICAS, 'Stock']);
  assert.match(r.errores.join('\n'), /«stock» parece un dato privado/);
});

test('error: código con formato inválido o repetido', () => {
  assert.match(procesar([base({ codigo: 'ECN-9' })]).errores.join('\n'), /Fila 2, columna codigo: «ECN-9»/);
  assert.match(procesar([base(), base({ slug: 'otro' })]).errores.join('\n'), /ECN-900 \(fila 3\), columna codigo: está repetido \(también en la fila 2\)/);
});

test('error: slug inválido o repetido', () => {
  assert.match(procesar([base({ slug: 'Con Espacios' })]).errores.join('\n'), /columna slug/);
  assert.match(procesar([base(), otro({ slug: 'prueba' })]).errores.join('\n'), /ECN-901 \(fila 3\), columna slug: «prueba» está repetido/);
});

test('error: precio no numérico, con código, columna y valor', () => {
  assert.match(procesar([base({ precio: 'cuarenta' })]).errores.join('\n'), /ECN-900 \(fila 2\), columna precio: «cuarenta» no es un número/);
});

test('error: activo con valor raro', () => {
  assert.match(procesar([base({ activo: 'quizás' })]).errores.join('\n'), /columna activo/);
});

test('error: un slug de categoría con dos nombres', () => {
  const r = procesar([base(), otro({ categoria: 'FRESCOS' })]);
  assert.match(r.errores.join('\n'), /slug «frescos» se usa con dos nombres/);
});

test('error: una subcategoría en dos categorías', () => {
  const r = procesar([base(), otro({ categoria: 'Abarrotes', categoria_slug: 'abarrotes' })]);
  assert.match(r.errores.join('\n'), /aparece en dos categorías/);
});

test('error: foto fuera de la cuenta de Cloudinary de la tienda', () => {
  const r = procesar([base({ imagen_1: 'https://ejemplo.com/foto.jpg' })]);
  assert.match(r.errores.join('\n'), /columna imagen_1/);
});

test('error: ningún producto visible', () => {
  assert.match(procesar([base({ activo: 'no' })]).errores.join('\n'), /No hay ningún producto visible/);
});

test('aviso: activo sin precio se oculta sin romper', () => {
  const r = procesar([base(), otro({ precio: '' })]);
  assert.deepEqual(r.errores, []);
  assert.equal(r.productos.length, 1);
  assert.match(r.avisos.join('\n'), /ECN-901 \(fila 3\): está activo pero no tiene precio/);
});

test('aviso: sin foto, sin descripción y precio_antes no mayor', () => {
  const r = procesar([base({ imagen_1: '', descripcion_corta: '', precio_antes: '15' })]);
  const a = r.avisos.join('\n');
  assert.match(a, /no tiene foto/);
  assert.match(a, /no tiene descripción corta/);
  assert.match(a, /precio_antes \(15\) no es mayor/);
  assert.equal(r.productos[0].precioAntes, null);
});

test('oferta: precio_antes mayor se conserva', () => {
  assert.equal(procesar([base({ precio_antes: '25' })]).productos[0].precioAntes, 25);
});

test('categorías y marcas ocultan lo que no tiene productos visibles', () => {
  const r = procesar([base(), otro({ activo: 'no', marca: 'Oculta', marca_slug: 'oculta' })]);
  assert.deepEqual(r.marcas.map((m) => m.slug), ['marca']);
});

test('CSV de Google: comillas, comas y saltos de línea dentro de una celda', () => {
  const { columnas, filas } = leerCsv('codigo,nombre\r\nECN-001,"Leche, ""vegetal""\ny fresca"\r\n');
  assert.deepEqual(columnas, ['codigo', 'nombre']);
  assert.equal(filas[0].nombre, 'Leche, "vegetal"\ny fresca');
});

test('leerTabla distingue TSV de CSV', () => {
  assert.deepEqual(leerTabla('a\tb\n1\t2\n').filas, [{ a: '1', b: '2' }]);
  assert.deepEqual(leerTabla('a,b\n1,2\n').filas, [{ a: '1', b: '2' }]);
});

test('el catálogo real da 23 productos, 3 categorías, 8 subcategorías y 6 marcas', async () => {
  const { columnas, filas } = leerTabla(await readFile(new URL('../data/catalogo-inicial.tsv', import.meta.url), 'utf8'));
  const r = procesarCatalogo(columnas, filas);
  assert.deepEqual(r.errores, []);
  assert.equal(r.productos.length, 23);
  assert.equal(r.categorias.length, 3);
  assert.equal(r.categorias.reduce((n, c) => n + c.subcategorias.length, 0), 8);
  assert.equal(r.marcas.length, 6);
});

test('error: columna con nombre parecido a uno privado ("Stock actual", "Costo unitario")', () => {
  for (const col of ['Stock actual', 'Costo unitario', 'Proveedor principal', 'Teléfono']) {
    const r = procesar([base()], [...COLUMNAS_PUBLICAS, col]);
    assert.match(r.errores.join('\n'), /parece un dato privado/, col);
  }
});

test('error: columna repetida', () => {
  const r = procesar([base()], [...COLUMNAS_PUBLICAS, 'nombre']);
  assert.match(r.errores.join('\n'), /«nombre» está repetida/);
});

test('fotoValida: solo enlaces directos de la cuenta de la tienda', async () => {
  const { fotoValida } = await import('../scripts/lib/catalogo.mjs');
  assert.equal(fotoValida(FOTO), true);
  for (const mala of [
    'javascript:alert(1)',
    'http://res.cloudinary.com/deaq5dfwt/image/upload/v1/a.webp',
    'https://res.cloudinary.com/deaq5dfwt/image/upload/../../../otra/image/upload/a.webp',
    'https://res.cloudinary.com/otra/image/upload/v1/a.webp',
    'https://res.cloudinary.com/deaq5dfwt/image/upload/v1/a,b.webp',
    'https://res.cloudinary.com/deaq5dfwt/image/upload/v1/a.webp?x=1',
  ]) assert.equal(fotoValida(mala), false, mala);
});

test('el número de fila es el de la hoja aunque haya filas vacías en medio', () => {
  const cols = COLUMNAS_PUBLICAS.join(',');
  const fila = (o) => COLUMNAS_PUBLICAS.map((c) => o[c] ?? '').join(',');
  const csv = [cols, fila(base()), ','.repeat(COLUMNAS_PUBLICAS.length - 1), fila(otro({ codigo: 'ECN-9' }))].join('\r\n');
  const { columnas, filas } = leerCsv(csv);
  assert.match(procesarCatalogo(columnas, filas).errores.join('\n'), /^Fila 4, columna codigo: «ECN-9»/m);
});

test('precios: acepta S/. y rechaza más de 2 decimales o espacios internos', () => {
  assert.equal(leerPrecio('S/. 46.00'), 46);
  assert.ok(Number.isNaN(leerPrecio('46.999')));
  assert.ok(Number.isNaN(leerPrecio('4 6')));
  assert.match(procesar([base({ precio_antes: 'mucho' })]).errores.join('\n'), /columna precio_antes: «mucho»/);
});

test('error: slug que no calza con su nombre', () => {
  const r = procesar([base({ categoria: 'Abarrotes', categoria_slug: 'frescos' })]);
  assert.match(r.errores.join('\n'), /«frescos» no calza con «Abarrotes» \(debería ser «abarrotes»\)/);
});

test('error: segunda foto sin la primera, y segunda foto de otra cuenta', () => {
  assert.match(procesar([base({ imagen_1: '', imagen_2: FOTO })]).errores.join('\n'), /columna imagen_1: está vacía pero imagen_2/);
  assert.match(procesar([base({ imagen_2: 'https://res.cloudinary.com/otra/image/upload/a.webp' })]).errores.join('\n'), /columna imagen_2/);
});

test('CSV con comillas sin cerrar da un error claro', () => {
  assert.throws(() => leerCsv('codigo,nombre\nECN-001,"Leche'), /comillas sin cerrar/);
});
