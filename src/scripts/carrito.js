// Vista del carrito (panel lateral y /carrito): pinta las líneas desde la plantilla,
// cambia cantidades, quita, recupera el último pedido y abre/cierra el panel.
import { resolver, fijarCantidad, quitar, leerCarrito, agregar, MAX_CANTIDAD } from '../lib/carrito.js';
import { soles } from '../lib/formato.js';
import { leer, guardar, leerJson, catalogo, avisar, reducido, CLAVE_PEDIDOS } from './almacen.js';

/** Carrito cruzado con el catálogo vigente. Lo que ya no existe se quita y se avisa una vez. */
export function carritoVigente() {
  const cat = catalogo();
  const items = leer();
  const r = resolver(items, cat);
  // Con el catálogo vacío (no cargó) no se borra nada
  if (r.quitados.length && Object.keys(cat).length) {
    guardar(items.filter((i) => !r.quitados.includes(i.codigo)));
    const n = r.quitados.length;
    avisar(n === 1 ? 'Quitamos 1 producto que ya no está en el catálogo' : `Quitamos ${n} productos que ya no están en el catálogo`);
  }
  return r;
}

/** Productos del último pedido enviado (para "Recuperar mi carrito"). */
export function ultimoPedido() {
  const p = leerJson(CLAVE_PEDIDOS);
  return p && Array.isArray(p.items) ? leerCarrito(JSON.stringify(p.items)) : [];
}

export function recuperar() {
  let items = leer();
  for (const i of ultimoPedido()) items = agregar(items, i.codigo, i.cantidad);
  guardar(items);
}

const vistas = [...document.querySelectorAll('[data-vista-carrito]')];

function pintarVista(raiz, r, nuevos) {
  const lista = raiz.querySelector('[data-vc-lineas]');
  const plantilla = raiz.querySelector('[data-vc-plantilla]');
  if (!lista || !(plantilla instanceof HTMLTemplateElement)) return;

  // Recordar qué control tenía el foco para devolverlo tras repintar
  const activo = document.activeElement;
  const lineaActiva = activo instanceof Element && lista.contains(activo) ? activo.closest('[data-codigo]') : null;
  const clave = lineaActiva ? ['data-l-paso', 'data-l-quitar', 'data-l-nombre'].find((a) => activo.hasAttribute(a)) : null;
  const valorClave = clave ? activo.getAttribute(clave) : null;

  raiz.querySelector('[data-vc-vacio]').hidden = r.lineas.length > 0;
  raiz.querySelector('[data-vc-lleno]').hidden = r.lineas.length === 0;
  const boton = raiz.querySelector('[data-recuperar]');
  if (boton) boton.hidden = r.lineas.length > 0 || ultimoPedido().length === 0;

  lista.replaceChildren(...r.lineas.map((l) => {
    const li = plantilla.content.firstElementChild.cloneNode(true);
    li.dataset.codigo = l.codigo;
    if (nuevos.has(l.codigo)) li.classList.add('entra');
    li.querySelectorAll('[data-l-enlace]').forEach((a) => { a.href = `/producto/${l.slug}/`; });
    const img = li.querySelector('[data-l-img]');
    if (l.foto) img.src = l.foto; else img.hidden = true; // sin foto: queda el recuadro blanco
    li.querySelector('[data-l-nombre]').textContent = l.nombre;
    li.querySelector('[data-l-presentacion]').textContent = l.cantidad > 1 ? `${l.presentacion}, ${soles(l.unitario / 100)} c/u` : l.presentacion;
    li.querySelector('[data-l-cantidad]').textContent = String(l.cantidad);
    li.querySelector('[data-l-total]').textContent = soles(l.total / 100);
    li.querySelector('[data-l-grupo]').setAttribute('aria-label', `Cantidad de ${l.nombre}`);
    const [menos, mas] = li.querySelectorAll('[data-l-paso]');
    menos.setAttribute('aria-label', `Quitar uno de ${l.nombre}`);
    mas.setAttribute('aria-label', `Agregar uno de ${l.nombre}`);
    if (l.cantidad <= 1) menos.setAttribute('aria-disabled', 'true');
    if (l.cantidad >= MAX_CANTIDAD) mas.setAttribute('aria-disabled', 'true');
    li.querySelector('[data-l-quitar]').setAttribute('aria-label', `Quitar ${l.nombre} del carrito`);
    return li;
  }));

  if (lineaActiva && clave) {
    const sel = `[data-codigo="${CSS.escape(lineaActiva.dataset.codigo)}"] [${clave}${valorClave ? `="${CSS.escape(valorClave)}"` : ''}]`;
    lista.querySelector(sel)?.focus();
  }

  raiz.querySelector('[data-vc-subtotal]').textContent = soles(r.subtotal / 100);
  const desde = Math.round(Number(raiz.getAttribute('data-gratis-desde')) * 100);
  const falta = Math.max(0, desde - r.subtotal);
  raiz.querySelector('[data-vc-gratis]').textContent = falta > 0
    ? `Te faltan ${soles(falta / 100)} para el envío gratis.`
    : 'Tu pedido ya tiene envío gratis.';
  raiz.querySelector('[data-vc-barra]').style.transform = `scaleX(${desde ? Math.min(1, r.subtotal / desde) : 1})`;
}

let anteriores = new Set(leer().map((i) => i.codigo));
function pintar() {
  if (!vistas.length) return;
  const r = carritoVigente();
  const actuales = new Set(r.lineas.map((l) => l.codigo));
  const nuevos = new Set([...actuales].filter((c) => !anteriores.has(c)));
  anteriores = actuales;
  vistas.forEach((v) => pintarVista(v, r, nuevos));
}

// Cantidades, quitar y recuperar (delegado: sirve para el panel y para /carrito)
document.addEventListener('click', (ev) => {
  const objetivo = ev.target instanceof Element ? ev.target : null;
  const vista = objetivo?.closest('[data-vista-carrito]');
  if (!objetivo || !vista) return;

  const paso = objetivo.closest('[data-l-paso]');
  const quitarBoton = objetivo.closest('[data-l-quitar]');
  const codigo = objetivo.closest('[data-codigo]')?.dataset.codigo;

  if (paso && codigo) {
    if (paso.getAttribute('aria-disabled') === 'true') return;
    const item = leer().find((i) => i.codigo === codigo);
    if (item) guardar(fijarCantidad(leer(), codigo, item.cantidad + Number(paso.getAttribute('data-l-paso'))));
  } else if (quitarBoton && codigo) {
    const lineas = [...vista.querySelectorAll('[data-codigo]')];
    const i = lineas.findIndex((li) => li.dataset.codigo === codigo);
    const siguiente = (lineas[i + 1] ?? lineas[i - 1])?.dataset.codigo;
    const nombre = objetivo.closest('[data-codigo]').querySelector('[data-l-nombre]')?.textContent ?? 'el producto';
    guardar(quitar(leer(), codigo));
    avisar(`Quitaste ${nombre} del carrito`);
    // El foco no se pierde: pasa al "Quitar" vecino o al enlace del catálogo si quedó vacío
    const destino = siguiente
      ? vista.querySelector(`[data-codigo="${CSS.escape(siguiente)}"] [data-l-quitar]`)
      : vista.querySelector('[data-vc-catalogo]');
    destino?.focus();
  } else if (objetivo.closest('[data-recuperar]')) {
    recuperar();
    avisar('Recuperamos tu último pedido en el carrito');
    vista.querySelector('[data-vc-lineas] [data-l-nombre]')?.focus();
  }
});

document.addEventListener('ecn:carrito', pintar);
window.addEventListener('pageshow', pintar);
pintar();

// Panel lateral: el botón del carrito lo abre (en /carrito y /checkout sigue siendo un enlace)
const panel = document.querySelector('[data-panel-carrito]');
const enPaginaCarrito = /^\/(carrito|checkout)\/?$/.test(location.pathname);
if (panel instanceof HTMLDialogElement && !enPaginaCarrito) {
  let disparador = null;
  let cerrando = 0;

  const abrir = (desde) => {
    disparador = desde;
    clearTimeout(cerrando);
    if (!panel.open) panel.showModal();
    panel.querySelector('h2')?.focus();
    requestAnimationFrame(() => panel.classList.add('abierto'));
  };
  const cerrar = () => {
    panel.classList.remove('abierto');
    const terminar = () => { if (panel.open) panel.close(); disparador?.focus(); };
    if (reducido()) terminar(); else cerrando = setTimeout(terminar, 380);
  };

  document.addEventListener('click', (ev) => {
    const enlace = ev.target instanceof Element ? ev.target.closest('[data-carrito-enlace]') : null;
    if (!enlace || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    ev.preventDefault();
    abrir(enlace);
  });
  panel.addEventListener('click', (ev) => {
    if (ev.target instanceof Element && ev.target.closest('[data-cerrar-panel]')) cerrar();
  });
  // Escape: cierre con la misma animación
  panel.addEventListener('cancel', (ev) => { ev.preventDefault(); cerrar(); });
}
