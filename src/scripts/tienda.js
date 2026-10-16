// Comportamiento común de todas las páginas (sin Alpine: funciones pequeñas con delegación de eventos).
// - Agregar: botones "Agregar al carrito" y "+", selector de cantidad, contador y aviso.
// - Transición foto → ficha: el nombre se pone solo en la foto que se tocó.
import { agregar, unidades, MAX_CANTIDAD } from '../lib/carrito.js';
import { leer, guardar, avisar, reducido } from './almacen.js';

function pintarContador(saltar = false) {
  const n = unidades(leer());
  document.querySelectorAll('[data-contador]').forEach((el) => {
    el.textContent = String(n);
    el.hidden = n === 0;
    if (saltar && !reducido()) {
      el.classList.remove('salta');
      void el.offsetWidth; // reinicia la animación
      el.classList.add('salta');
    }
  });
  document.querySelectorAll('[data-carrito-enlace]').forEach((a) => {
    a.setAttribute('aria-label', n ? `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}` : 'Carrito vacío');
  });
}

document.addEventListener('click', (ev) => {
  const objetivo = ev.target instanceof Element ? ev.target : null;
  if (!objetivo) return;

  // Selector de cantidad de la ficha (−/+)
  const paso = objetivo.closest('[data-paso]');
  if (paso) {
    const salida = paso.closest('[data-cantidad]')?.querySelector('output');
    if (salida) {
      const n = Number(salida.textContent) + Number(paso.getAttribute('data-paso'));
      salida.textContent = String(Math.min(MAX_CANTIDAD, Math.max(1, n)));
    }
    return;
  }

  // Agregar al carrito (botón de la ficha o "+" de la lámina)
  const boton = objetivo.closest('[data-agregar]');
  if (boton) {
    ev.preventDefault();
    const codigo = boton.getAttribute('data-agregar') ?? '';
    const ambito = boton.closest('[data-producto]');
    const salida = ambito?.querySelector('[data-cantidad] output');
    const cantidad = salida ? Number(salida.textContent) : 1;
    const antes = leer().find((i) => i.codigo === codigo)?.cantidad ?? 0;
    const despues = agregar(leer(), codigo, cantidad);
    const ahora = despues.find((i) => i.codigo === codigo)?.cantidad ?? 0;
    const nombre = boton.getAttribute('data-nombre') ?? 'producto';
    if (ahora === antes) { avisar(`Ya tienes ${MAX_CANTIDAD} de ${nombre}, el máximo por producto`); return; }
    guardar(despues);
    pintarContador(true);
    avisar(`Agregado: ${ahora - antes} × ${nombre}`);
    return;
  }

  // Transición foto → ficha: solo la foto tocada lleva el nombre
  const enlace = objetivo.closest('a[data-ficha]');
  if (enlace) {
    const foto = enlace.querySelector('img');
    if (foto) {
      // un solo nombre por página: si quedó otro puesto (Ctrl+clic, atrás), se limpia
      document.querySelectorAll('a[data-ficha] img').forEach((img) => { img.style.viewTransitionName = ''; });
      foto.style.viewTransitionName = `f-${enlace.getAttribute('data-ficha')}`;
    }
  }
});

// Al volver con "atrás", la página puede salir de la caché con el nombre puesto: se limpia
window.addEventListener('pageshow', () => {
  document.querySelectorAll('a[data-ficha] img').forEach((img) => { img.style.viewTransitionName = ''; });
  pintarContador();
});

// Cualquier cambio del carrito (panel, /carrito, checkout u otra pestaña)
document.addEventListener('ecn:carrito', () => pintarContador());

pintarContador();
