// Comportamiento compartido de los prototipos (no es el código final).
// - Contador de carrito que persiste entre portada y ficha.
// - Selector de cantidad, botón "Agregar al carrito" y aviso "Agregado".
// - Marca <html class="listo"> para disparar la entrada de la portada una sola vez.
(function () {
  var CLAVE = 'proto.ecn.carrito';

  function leer() {
    try { return Number(localStorage.getItem(CLAVE)) || 0; } catch (e) { return 0; }
  }
  function guardar(n) {
    try { localStorage.setItem(CLAVE, String(n)); } catch (e) { /* sin almacenamiento */ }
  }

  function pintarContador(saltar) {
    document.querySelectorAll('[data-contador]').forEach(function (el) {
      var n = leer();
      el.textContent = n;
      el.hidden = n === 0;
      if (saltar) {
        el.classList.remove('salta');
        void el.offsetWidth; // reinicia la animación
        el.classList.add('salta');
      }
    });
  }

  var temporizador;
  function avisar(texto) {
    var aviso = document.querySelector('[data-aviso]');
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.classList.add('visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { aviso.classList.remove('visible'); }, 2400);
  }

  document.addEventListener('click', function (ev) {
    var menos = ev.target.closest('[data-menos]');
    var mas = ev.target.closest('[data-mas]');
    if (menos || mas) {
      var caja = (menos || mas).closest('[data-cantidad]');
      var salida = caja.querySelector('output');
      var n = Number(salida.textContent) + (mas ? 1 : -1);
      salida.textContent = Math.min(99, Math.max(1, n));
      return;
    }
    var agregar = ev.target.closest('[data-agregar]');
    if (agregar) {
      ev.preventDefault();
      var ambito = agregar.closest('[data-producto]') || document;
      var cant = ambito.querySelector('[data-cantidad] output');
      var n2 = cant ? Number(cant.textContent) : 1;
      guardar(leer() + n2);
      pintarContador(true);
      avisar('Agregado: ' + n2 + ' × ' + agregar.dataset.agregar);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    pintarContador(false);
    var marcar = function () { document.documentElement.classList.add('listo'); };
    requestAnimationFrame(function () { requestAnimationFrame(marcar); });
    // Respaldo: en pestañas ocultas el navegador pausa requestAnimationFrame y
    // la portada quedaría con los productos invisibles.
    setTimeout(marcar, 120);
  });
})();
