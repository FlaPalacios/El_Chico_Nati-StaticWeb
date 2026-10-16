// Carrito con catálogo vigente, número de pedido y mensaje de WhatsApp (Fase 5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { agregar, quitar, fijarCantidad, resolver, centimos } from '../src/lib/carrito.js';
import { numeroPedido, fechaPedido, normalizarTelefono, validarCliente, mensajePedido, montoTexto } from '../src/lib/pedido.js';
import { costoEnvio } from '../src/lib/envio.js';
import { lugarDe } from '../src/lib/ubigeo.js';

const reglas = JSON.parse(await readFile(new URL('../src/data/envio.json', import.meta.url), 'utf8'));
const arbol = JSON.parse(await readFile(new URL('../public/datos/ubigeo.json', import.meta.url), 'utf8'));
const catalogo = {
  'ECN-001': { nombre: 'Leche de Almendras', presentacion: '1 L', precio: 23, slug: 'leche-de-almendras', foto: '' },
  'ECN-002': { nombre: 'Miel', presentacion: '', precio: 19.9, slug: 'miel', foto: '' },
};

test('quitar y fijarCantidad devuelven listas nuevas con cantidad entre 1 y 99', () => {
  const items = agregar(agregar([], 'ECN-001', 2), 'ECN-002', 1);
  assert.deepEqual(quitar(items, 'ECN-001'), [{ codigo: 'ECN-002', cantidad: 1 }]);
  assert.equal(fijarCantidad(items, 'ECN-001', 150)[0].cantidad, 99);
  assert.equal(fijarCantidad(items, 'ECN-001', 0)[0].cantidad, 1);
  assert.equal(items[0].cantidad, 2);
});

test('resolver toma nombre y precio del catálogo vigente y separa lo que ya no existe', () => {
  const items = [{ codigo: 'ECN-001', cantidad: 2 }, { codigo: 'ECN-099', cantidad: 1 }];
  const r = resolver(items, catalogo);
  assert.deepEqual(r.quitados, ['ECN-099']);
  assert.equal(r.subtotal, 4600);
  // Precio cambiado en el JSON: el carrito ya guardado lo refleja
  const r2 = resolver(items, { ...catalogo, 'ECN-001': { ...catalogo['ECN-001'], precio: 25.5 } });
  assert.equal(r2.subtotal, 5100);
});

test('resolver ignora claves heredadas como "constructor"', () => {
  assert.deepEqual(resolver([{ codigo: 'constructor', cantidad: 1 }], catalogo).quitados, ['constructor']);
});

test('céntimos sin errores de coma flotante', () => {
  assert.equal(centimos(19.9) * 3, 5970);
  assert.equal(montoTexto(5970), 'S/ 59.70');
});

test('número de pedido con la fecha de Lima y 4 dígitos', () => {
  // 16-oct-2026 03:00 UTC = 15-oct-2026 22:00 en Lima
  const f = new Date(Date.UTC(2026, 9, 16, 3, 0));
  assert.equal(numeroPedido(f, 4821), 'ECN-261015-4821');
  assert.equal(numeroPedido(f, 65535), 'ECN-261015-5535');
  assert.equal(numeroPedido(f, 7), 'ECN-261015-0007');
  assert.equal(fechaPedido(f), '2026-10-15');
});

test('teléfono: 9 dígitos que empiezan con 9, acepta +51 y espacios', () => {
  assert.equal(normalizarTelefono('987654321'), '987 654 321');
  assert.equal(normalizarTelefono('+51 987 654 321'), '987 654 321');
  assert.equal(normalizarTelefono('51987654321'), '987 654 321');
  assert.equal(normalizarTelefono('987-654-321'), '987 654 321');
  assert.equal(normalizarTelefono('887654321'), null);
  assert.equal(normalizarTelefono('98765432'), null);
  assert.equal(normalizarTelefono('01 4567890'), null);
});

test('validarCliente marca cada campo obligatorio con un mensaje claro', () => {
  const { errores } = validarCliente({});
  assert.deepEqual(Object.keys(errores).sort(), ['direccion', 'lugar', 'nombre', 'telefono']);
  assert.equal(errores.lugar, 'Elige tu distrito para calcular el envío.');
  const ok = validarCliente({ nombre: ' Ana\nPérez ', telefono: '987654321', direccion: 'Av. Las Palmeras 123', lugar: 'Los Olivos, Lima, Lima' });
  assert.deepEqual(ok.errores, {});
  assert.equal(ok.datos.nombre, 'Ana Pérez'); // un salto de línea no rompe el formato del mensaje
});

test('lugarDe arma distrito, provincia y departamento', () => {
  assert.equal(lugarDe(arbol, '150117'), 'Los Olivos, Lima, Lima');
  assert.equal(lugarDe(arbol, '999999'), '');
});

test('mensaje con el texto exacto de la sección 8', () => {
  const r = resolver([{ codigo: 'ECN-001', cantidad: 2 }], catalogo);
  const texto = mensajePedido({
    numero: 'ECN-261015-4821', lineas: r.lineas, subtotal: r.subtotal,
    envio: centimos(costoEnvio('150117', r.subtotal / 100, reglas)),
    cliente: { nombre: 'Ana Pérez', telefono: '987 654 321', direccion: 'Av. Las Palmeras 123', lugar: 'Los Olivos, Lima, Lima', referencia: 'Frente al parque', nota: 'Tocar el timbre' },
  });
  assert.equal(texto, [
    'Hola El Chico Naturista, quiero confirmar mi pedido ECN-261015-4821.',
    '',
    '• 2 × Leche de Almendras (1 L) — S/ 46.00',
    '',
    'Subtotal: S/ 46.00',
    'Envío: S/ 10.00',
    'Total: S/ 56.00',
    '',
    'Nombre: Ana Pérez',
    'Teléfono: 987 654 321',
    'Dirección: Av. Las Palmeras 123',
    'Distrito: Los Olivos, Lima, Lima',
    'Referencia: Frente al parque',
    'Nota: Tocar el timbre',
  ].join('\n'));
});

test('total coincide con el carrito en los 4 escenarios de envío', () => {
  const casos = [
    ['150117', [{ codigo: 'ECN-001', cantidad: 2 }], 'Envío: S/ 10.00', 'Total: S/ 56.00'], // Los Olivos
    ['070101', [{ codigo: 'ECN-001', cantidad: 2 }], 'Envío: S/ 10.00', 'Total: S/ 56.00'], // Callao
    ['040101', [{ codigo: 'ECN-002', cantidad: 3 }], 'Envío: S/ 15.00', 'Total: S/ 74.70'], // Arequipa
    ['150601', [{ codigo: 'ECN-001', cantidad: 6 }], 'Envío: gratis', 'Total: S/ 138.00'], // Huaral, desde S/ 120
  ];
  for (const [ubigeo, items, envioEsperado, totalEsperado] of casos) {
    const r = resolver(items, catalogo);
    const envio = centimos(costoEnvio(ubigeo, r.subtotal / 100, reglas));
    const texto = mensajePedido({ numero: 'ECN-261015-0001', lineas: r.lineas, subtotal: r.subtotal, envio,
      cliente: { nombre: 'A B', telefono: '987 654 321', direccion: 'Calle 1', lugar: lugarDe(arbol, ubigeo) } });
    assert.ok(texto.includes(envioEsperado), `${ubigeo}: ${envioEsperado}`);
    assert.ok(texto.includes(totalEsperado), `${ubigeo}: ${totalEsperado}`);
    assert.ok(!texto.includes('Referencia:'), 'sin referencia no aparece la línea');
  }
});

test('envío por confirmar si la lista de distritos no cargó', () => {
  const r = resolver([{ codigo: 'ECN-001', cantidad: 1 }], catalogo);
  const texto = mensajePedido({ numero: 'X', lineas: r.lineas, subtotal: r.subtotal, envio: null,
    cliente: { nombre: 'A B', telefono: '987 654 321', direccion: 'Calle 1', lugar: 'Surco' } });
  assert.ok(texto.includes('Envío: por confirmar\nTotal: S/ 23.00 más envío'));
});
