// Lógica de la web que no depende del navegador: fotos, envío y tienda.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fotoCuadro, srcsetCuadro } from '../src/lib/cloudinary.js';
import { costoEnvio, faltaParaGratis } from '../src/lib/envio.js';
import { tienda, enlaceWhatsapp } from '../src/data/tienda.js';

const reglas = JSON.parse(await readFile(new URL('../src/data/envio.json', import.meta.url), 'utf8'));
const FOTO = 'https://res.cloudinary.com/deaq5dfwt/image/upload/v1789585822/ECN-001-1_ojvidj.webp';

test('fotoCuadro inserta recorte, margen y formato automático', () => {
  assert.equal(fotoCuadro(FOTO, 480),
    'https://res.cloudinary.com/deaq5dfwt/image/upload/e_trim/c_pad,w_480,h_480,b_white/f_auto,q_auto/v1789585822/ECN-001-1_ojvidj.webp');
});

test('fotoCuadro deja igual una URL que no es de Cloudinary', () => {
  assert.equal(fotoCuadro('https://ejemplo.com/a.jpg', 480), 'https://ejemplo.com/a.jpg');
});

test('srcsetCuadro arma un ancho por tamaño', () => {
  assert.match(srcsetCuadro(FOTO, [240, 480]), /w_240.* 240w, .*w_480.* 480w$/);
});

test('envío: Los Olivos (Lima) y Callao S/ 10', () => {
  assert.equal(costoEnvio('150117', 50, reglas), 10); // Los Olivos
  assert.equal(costoEnvio('070101', 50, reglas), 10); // Callao
});

test('envío: Huaral (departamento de Lima, otra provincia) y Arequipa S/ 15', () => {
  assert.equal(costoEnvio('150601', 50, reglas), 15); // Huaral
  assert.equal(costoEnvio('040101', 50, reglas), 15); // Arequipa
});

test('envío gratis desde S/ 120 exactos, no en S/ 119.99', () => {
  assert.equal(costoEnvio('040101', 119.99, reglas), 15);
  assert.equal(costoEnvio('040101', 120, reglas), 0);
});

test('envío: sin distrito todavía no hay costo', () => {
  assert.equal(costoEnvio('', 50, reglas), null);
  assert.equal(costoEnvio('15', 50, reglas), null);
});

test('cuánto falta para el envío gratis', () => {
  assert.equal(faltaParaGratis(97.5, reglas), 22.5);
  assert.equal(faltaParaGratis(130, reglas), 0);
});

test('tienda: datos de contacto completos y enlace de WhatsApp codificado', () => {
  assert.equal(tienda.whatsapp, '51946049689');
  assert.equal(tienda.correo, 'contacto@elchiconaturista.com');
  assert.equal(enlaceWhatsapp('Hola, ¿tienen kéfir?'), 'https://wa.me/51946049689?text=Hola%2C%20%C2%BFtienen%20k%C3%A9fir%3F');
});

test('ubigeo: 25 departamentos, 196 provincias, 1891 distritos; Lima 43 y Callao 7', async () => {
  const u = JSON.parse(await readFile(new URL('../public/datos/ubigeo.json', import.meta.url), 'utf8'));
  assert.equal(u.length, 25);
  assert.equal(u.reduce((n, d) => n + d.p.length, 0), 196);
  assert.equal(u.reduce((n, d) => n + d.p.reduce((m, p) => m + p.d.length, 0), 0), 1891);
  assert.equal(u.find((d) => d.c === '15').p.find((p) => p.c === '1501').d.length, 43);
  assert.equal(u.find((d) => d.c === '07').p[0].d.length, 7);
});

test('ubigeo: tildes conocidas y mayúscula inicial', async () => {
  const { bonito } = await import('../scripts/preparar-ubigeo.mjs');
  assert.equal(bonito('SAN MARTIN DE PORRES'), 'San Martín de Porres');
  assert.equal(bonito('LOS OLIVOS'), 'Los Olivos');
  assert.equal(bonito('VILLA EL SALVADOR'), 'Villa El Salvador'); // "El" es parte del nombre propio
});
