// Piezas compartidas de la dirección D: cabecera con buscador, lámina, recomendados, pie e íconos.
(function () {
  var E = window.ECN;

  // Íconos. WhatsApp y TikTok: Simple Icons 16.33.0 (CC0). LinkedIn: dibujo propio sencillo.
  // Todos usan currentColor: toman el color del texto donde estén.
  var I = E.iconos = {
    mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14l-1.4 10.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M4.5 2h15A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2zM6.2 9.8h2.6V18H6.2zM7.5 5.4a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3zM10.6 9.8h2.5v1.1c.5-.8 1.4-1.3 2.6-1.3 2.1 0 3.1 1.3 3.1 3.7V18h-2.6v-4.3c0-1.1-.4-1.8-1.4-1.8s-1.6.7-1.6 1.8V18h-2.6z"/></svg>'
  };

  var wa = function (msg) { return 'https://wa.me/' + E.tienda.whatsapp + '?text=' + encodeURIComponent(msg); };

  // Cabecera fija: marca a la izquierda, buscador al centro, carrito a la derecha.
  // En la portada el buscador filtra el catálogo; en otras páginas lleva a la portada con ?q=.
  E.cabecera = function () {
    return '<div class="contenedor cabecera">' +
      '<a class="marca" href="portada.html"><img src="../img/logo-192.webp" alt="" width="44" height="44"><span>El Chico Naturista</span></a>' +
      '<form class="buscador" role="search" action="portada.html" data-buscador>' +
        '<label class="oculto" for="q">Buscar productos</label>' +
        '<input id="q" name="q" type="search" placeholder="Buscar productos" autocomplete="off" enterkeyhint="search">' +
        '<button type="submit" aria-label="Buscar">' + I.lupa + '</button>' +
      '</form>' +
      '<nav class="acciones" aria-label="Principal">' +
        '<a class="solo-ancho" href="portada.html#catalogo">Catálogo</a>' +
        '<a class="carrito" href="#" aria-label="Carrito">' + I.bolsa + '<span class="contador" data-contador hidden>0</span></a>' +
      '</nav>' +
    '</div>';
  };

  // Lámina: toda la tarjeta lleva a la ficha; el botón "+" agrega uno sin salir.
  // El código ECN es interno: no se muestra.
  E.lamina = function (p, opciones) {
    var o = opciones || {};
    return '<article class="lamina" data-lamina' + (o.nombreTransicion ? ' style="view-transition-name:l-' + p.codigo + '"' : '') + '>' +
      '<a href="ficha.html?p=' + p.codigo + '" data-ficha="' + p.codigo + '">' +
        '<img src="' + E.foto(p.imagenes[0], o.tam || 420, 'cuadro') + '" alt="" loading="' + (o.diferida ? 'lazy' : 'eager') + '">' +
        '<div class="rotulo"><span class="presentacion">' + p.presentacion + '</span>' +
        '<h3>' + p.nombre + '</h3><span class="precio">' + E.soles(p.precio) + '</span></div>' +
      '</a>' +
      '<button class="mas" type="button" data-agregar="' + p.nombre + '" aria-label="Agregar ' + p.nombre + ' al carrito">' + I.mas + '</button>' +
    '</article>';
  };

  // Búsqueda sin tildes ni mayúsculas: "cafe" encuentra "Café"
  E.normalizar = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); };
  E.coincide = function (p, q) {
    if (!q) return true;
    var texto = E.normalizar([p.nombre, p.marca, p.categoria, p.subcategoria, p.presentacion].join(' '));
    return E.normalizar(q).split(/\s+/).every(function (pal) { return texto.indexOf(pal) !== -1; });
  };

  // Recomendados: misma subcategoría, luego misma categoría, luego destacados. Nunca el mismo producto.
  E.relacionados = function (p, max) {
    var peso = function (x) {
      return (x.subcategoria === p.subcategoria ? 0 : x.categoria === p.categoria ? 1 : x.destacado ? 2 : 3);
    };
    return E.productos.filter(function (x) { return x.codigo !== p.codigo; })
      .sort(function (a, b) { return peso(a) - peso(b); }).slice(0, max || 8);
  };

  // Pie: misma estructura que el sitio anterior (sin "Mis pedidos": ya no hay cuentas).
  E.pie = function () {
    var t = E.tienda;
    var cats = ['Frescos', 'Abarrotes', 'Cuidado personal'];
    return '<div class="contenedor pie__cuerpo">' +
      '<section class="pie__marca" aria-label="El Chico Naturista">' +
        '<img src="../img/logo-192.webp" alt="El Chico Naturista" width="76" height="76">' +
        '<p class="pie__lema">Productos naturales que se pueden rastrear hasta quien los cosecha. Sin promesas milagrosas.</p>' +
        '<div class="pie__redes">' +
          '<a href="' + t.tiktok + '" target="_blank" rel="noopener noreferrer">' + I.tiktok + '<span>TikTok</span></a>' +
          '<a href="' + t.linkedin + '" target="_blank" rel="noopener noreferrer">' + I.linkedin + '<span>LinkedIn</span></a>' +
        '</div>' +
      '</section>' +
      '<nav aria-labelledby="pie-cat"><h2 id="pie-cat">Catálogo</h2><ul>' +
        cats.map(function (c) { return '<li><a href="portada.html#catalogo">' + c + '</a></li>'; }).join('') +
        '<li><a href="portada.html#catalogo">Ver todo</a></li></ul></nav>' +
      '<nav aria-labelledby="pie-ped"><h2 id="pie-ped">Tu pedido</h2><ul>' +
        '<li><a href="#">Carrito</a></li><li><a href="#">Finalizar pedido</a></li>' +
        '<li><a href="' + wa('Hola, tengo una consulta sobre un pedido.') + '" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></li></ul></nav>' +
      '<section aria-labelledby="pie-don"><h2 id="pie-don">Dónde estamos</h2><ul class="pie__datos">' +
        '<li>' + t.direccion + '</li><li>' + t.horario + '</li>' +
        '<li><a href="' + wa('Hola, quiero hacer una consulta.') + '" target="_blank" rel="noopener noreferrer">' + t.whatsappVisible + '</a></li>' +
        '<li><a href="mailto:' + t.correo + '">' + t.correo + '</a></li></ul></section>' +
    '</div>' +
    '<div class="contenedor pie__legal">' +
      '<p>© ' + new Date().getFullYear() + ' El Chico Naturista. Lima, Perú.</p>' +
      '<p>Los suplementos no son medicamentos y no reemplazan una alimentación variada.</p>' +
    '</div>';
  };

  // Se pinta apenas carga el script (está al final del body), antes que comun.js.
  var cab = document.querySelector('[data-cabecera]');
  if (cab) {
    cab.innerHTML = E.cabecera();
    var q = new URLSearchParams(location.search).get('q');
    if (q) cab.querySelector('#q').value = q;
    // sombra suave solo cuando la página ya se desplazó: la cabecera se separa del contenido
    var marcar = function () { cab.classList.toggle('despegada', scrollY > 4); };
    addEventListener('scroll', marcar, { passive: true });
    marcar();
  }
  var pie = document.querySelector('[data-pie]');
  if (pie) pie.innerHTML = E.pie();
  var flotante = document.querySelector('.flotante');
  if (flotante) {
    flotante.href = wa('Hola El Chico Naturista, quiero hacer una consulta.');
    flotante.target = '_blank';
    flotante.rel = 'noopener noreferrer';
    flotante.setAttribute('aria-label', 'Escribir por WhatsApp');
    flotante.innerHTML = I.whatsapp;
  }
})();
