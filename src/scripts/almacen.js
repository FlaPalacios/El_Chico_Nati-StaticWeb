// Lo que comparten todos los scripts del navegador: carrito guardado, catálogo vigente y aviso.
// Cada cambio del carrito avisa con el evento "ecn:carrito" (también si cambió en otra pestaña).
import { CLAVE, leerCarrito } from '../lib/carrito.js';

export const CLAVE_PEDIDOS = 'ecn.pedidos.v1'; // último pedido: productos y montos, sin datos personales
export const CLAVE_CLIENTE = 'ecn.cliente.v1'; // solo si el cliente marca "Recordar mis datos"

export const reducido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const avisarCambio = () => document.dispatchEvent(new CustomEvent('ecn:carrito'));

// Si el navegador no deja guardar (modo privado estricto), el carrito vive en memoria mientras dure la página
let enMemoria = [];
let sinGuardar = false; // true si la última escritura falló: manda lo que está en memoria

export function leer() {
  if (sinGuardar) return enMemoria;
  try { return leerCarrito(localStorage.getItem(CLAVE)); } catch { return enMemoria; }
}

export function guardar(items) {
  enMemoria = items;
  try { localStorage.setItem(CLAVE, JSON.stringify(items)); sinGuardar = false; } catch { sinGuardar = true; }
  avisarCambio();
}

/** JSON guardado (o null si no hay, está roto o el navegador no deja leer). */
export function leerJson(clave) {
  try { return JSON.parse(localStorage.getItem(clave) ?? 'null'); } catch { return null; }
}
export function guardarJson(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* sin almacenamiento: no pasa nada */ }
}
export function borrar(clave) {
  try { localStorage.removeItem(clave); } catch { /* idem */ }
}

/** Catálogo vigente que el layout deja en el HTML: { [codigo]: { nombre, presentacion, precio, slug, foto } } */
let catalogoLeido = null;
export function catalogo() {
  if (!catalogoLeido) {
    try { catalogoLeido = JSON.parse(document.querySelector('[data-catalogo-carrito]')?.getAttribute('data-catalogo-carrito') ?? '{}'); }
    catch { catalogoLeido = {}; }
  }
  return catalogoLeido;
}

let temporizador;
export function avisar(texto) {
  const aviso = document.querySelector('[data-aviso]');
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.classList.add('visible');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => aviso.classList.remove('visible'), 2600);
}

// Otra pestaña cambió el carrito
window.addEventListener('storage', (ev) => { if (ev.key === CLAVE) avisarCambio(); });
