// Pedido por WhatsApp: número, validación de datos y texto del mensaje (PLAN-v2.md, sección 8).
// Lógica pura: los montos llegan en céntimos.

/** Céntimos → "S/ 46.00" con espacio normal (es texto de un chat, no de la página). */
export const montoTexto = (cts) => `S/ ${(cts / 100).toFixed(2)}`;

/** Partes de la fecha en hora de Lima. */
function partesLima(fecha) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(fecha).map((p) => [p.type, p.value]));
}

/** Fecha del pedido en Lima: "AAAA-MM-DD". */
export function fechaPedido(fecha) {
  const f = partesLima(fecha);
  return `${f.year}-${f.month}-${f.day}`;
}

/** Número de pedido web ECN-AAMMDD-NNNN. `aleatorio` es un entero (en el navegador sale de crypto.getRandomValues). */
export function numeroPedido(fecha, aleatorio) {
  const f = partesLima(fecha);
  const nnnn = String(Math.abs(Math.trunc(aleatorio)) % 10000).padStart(4, '0');
  return `ECN-${f.year.slice(2)}${f.month}${f.day}-${nnnn}`;
}

/** Celular peruano: 9 dígitos que empiezan con 9; acepta +51, espacios, guiones y paréntesis. Devuelve "987 654 321" o null. */
export function normalizarTelefono(texto) {
  let d = String(texto ?? '').replace(/[\s\-().]/g, '');
  if (d.startsWith('+51')) d = d.slice(3);
  else if (d.startsWith('51') && d.length === 11) d = d.slice(2);
  if (!/^9\d{8}$/.test(d)) return null;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

/** Texto de una sola línea, sin espacios de más y con tope de largo. */
export const limpiar = (texto, max) => String(texto ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export const LARGOS = { nombre: 80, direccion: 140, referencia: 140, lugar: 120, nota: 300 };

/**
 * Valida los datos del cliente. Devuelve { datos, errores } con un mensaje por campo.
 * entrada: { nombre, telefono, direccion, referencia, ubigeo, lugar, nota }
 * `lugar` es "Distrito, Provincia, Departamento" (o lo que escribió si no cargó la lista).
 */
export function validarCliente(entrada) {
  const datos = {
    nombre: limpiar(entrada.nombre, LARGOS.nombre),
    telefono: normalizarTelefono(entrada.telefono),
    direccion: limpiar(entrada.direccion, LARGOS.direccion),
    referencia: limpiar(entrada.referencia, LARGOS.referencia),
    lugar: limpiar(entrada.lugar, LARGOS.lugar),
    ubigeo: /^\d{6}$/.test(String(entrada.ubigeo ?? '')) ? String(entrada.ubigeo) : '',
    nota: limpiar(entrada.nota, LARGOS.nota),
  };
  const errores = {};
  if (datos.nombre.length < 2) errores.nombre = 'Escribe tu nombre para saber a quién entregar.';
  if (!datos.telefono) errores.telefono = 'Escribe un celular de 9 dígitos que empiece con 9, por ejemplo 987 654 321.';
  if (datos.direccion.length < 5) errores.direccion = 'Escribe la dirección de entrega: calle, número y, si hay, interior.';
  if (!datos.lugar) errores.lugar = 'Elige tu distrito para calcular el envío.';
  return { datos, errores };
}

/**
 * Mensaje de WhatsApp con el formato exacto de la sección 8.
 * lineas: [{ cantidad, nombre, presentacion, total }]; subtotal y envio en céntimos
 * (envio null = por confirmar; 0 = gratis). cliente: datos ya validados.
 */
export function mensajePedido({ numero, lineas, subtotal, envio, cliente }) {
  const productos = lineas.map((l) =>
    `• ${l.cantidad} × ${l.nombre}${l.presentacion ? ` (${l.presentacion})` : ''} — ${montoTexto(l.total)}`);
  const envioTexto = envio === null ? 'por confirmar' : envio === 0 ? 'gratis' : montoTexto(envio);
  const totalTexto = envio === null ? `${montoTexto(subtotal)} más envío` : montoTexto(subtotal + envio);
  const datos = [
    `Nombre: ${cliente.nombre}`,
    `Teléfono: ${cliente.telefono}`,
    `Dirección: ${cliente.direccion}`,
    `Distrito: ${cliente.lugar}`,
  ];
  if (cliente.referencia) datos.push(`Referencia: ${cliente.referencia}`);
  if (cliente.nota) datos.push(`Nota: ${cliente.nota}`);
  return [
    `Hola El Chico Naturista, quiero confirmar mi pedido ${numero}.`,
    '',
    ...productos,
    '',
    `Subtotal: ${montoTexto(subtotal)}`,
    `Envío: ${envioTexto}`,
    `Total: ${totalTexto}`,
    '',
    ...datos,
  ].join('\n');
}
