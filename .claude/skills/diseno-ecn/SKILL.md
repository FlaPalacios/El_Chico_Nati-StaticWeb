---
name: diseno-ecn
description: Brief de marca y reglas visuales de El Chico Naturista (tienda boutique de productos naturales en Lima). Cargar SIEMPRE junto con frontend-design antes de diseñar, prototipar, maquetar, animar o revisar cualquier pantalla, componente, estilo o animación de esta web.
---

# Brief de diseño: El Chico Naturista

Úsalo junto a la skill `frontend-design`. Si `docs/direccion-visual.md` ya tiene una dirección elegida, esa dirección manda sobre las ideas nuevas: no se rediseña en cada fase.

## Sujeto, público y trabajo de la web

- **Qué es**: una tienda pequeña de Lima que vende 23 productos naturales de 6 marcas peruanas: leche de almendras y kéfir refrigerados, cacao, miel y algarrobina, galletas proteicas, suplementos en cápsulas, tintes de henna y aceite capilar.
- **Quién compra**: gente de Lima que ya cuida lo que come y compra desde el celular, muchas veces por recomendación. Pide por WhatsApp y recibe delivery.
- **Trabajo de la web**: que en pocos toques se vea qué hay, cuánto cuesta y se mande el pedido por WhatsApp con confianza.
- **Material real del que sale el diseño**: el logo (sello circular verde con montañas andinas y una hoja), los empaques (frascos de vidrio, cajas de henna, doypacks, botellas de leche), lo andino y amazónico del origen (algarrobo, maca, cacao, tarwi, camu camu), la escala chica y el trato directo de quien atiende.

## Restricciones fijas

- Salvia `#2F5D50` y jade `#7A9B87` no cambian. Fondo base `#F7F7F7`. Café `#211E1E` solo en detalles pequeños.
- Texto blanco solo sobre salvia (≈ 7.5:1). Sobre jade (≈ 3.1:1) solo texto grande o nada.
- Todos los colores como variables en `:root` de `src/styles/global.css`.
- Fuentes `.woff2` locales. Hind y Amulya son el punto de partida, no una obligación. Verificar licencia web.
- Sin stock, sin "agotado", sin porcentajes de descuento. Si hay `precio_antes`, se muestra tachado y nada más.

## Fotos de producto

- Todas son empaques sobre fondo blanco, cuadradas, con escalas muy distintas (una galleta es una franja horizontal; una botella es alta y delgada).
- El contenedor de la foto no puede mostrar un recuadro blanco sobre el fondo gris: contenedor blanco, o `mix-blend-mode: multiply` sobre un tono claro.
- Normalizar el encuadre con Cloudinary: `e_trim` y luego `c_pad` con margen fijo, para que todos se vean del mismo tamaño visual.
- La foto es protagonista: grande, con aire, nunca recortada sobre el producto.
- No usar `-recursos/img-paginaprincipal.png`: es una imagen generada y muestra productos que no se venden.
- Portada (decisión de Fernando): composición colectiva con las fotos reales de los productos. Tiene que verse armada por un diseñador (escala, ritmo, aire, sombras de contacto coherentes), no un collage ni una imagen generada. Es temporal hasta tener fotos propias.

## Movimiento

- Un solo momento orquestado en la portada. No animar cada sección al hacer scroll.
- Firma: transición de la foto de la tarjeta a la foto de la ficha con View Transitions entre documentos (`@view-transition { navigation: auto; }` y `view-transition-name` por producto).
- Movimiento que responde a acciones: agregar al carrito, abrir el panel, reacomodar la grilla al filtrar, confirmar el pedido.
- Solo `transform` y `opacity`. Duraciones y curvas como tokens. Todo con alternativa `prefers-reduced-motion`.

## Qué se evita

- Fondo crema + serif de alto contraste + acento terracota.
- Tarjetas idénticas con la misma sombra gris suave y un solo radio para todo; gradientes como decoración.
- Etiquetas en mayúsculas espaciadas sobre cada título; numeración 01/02/03 sin secuencia real; "→" en botones; metadatos separados con puntos medios.
- Resaltar una sola palabra del titular en otro color o en cursiva.
- Fade + slide-up en cada sección; hover animado en todas las tarjetas.
- Hojitas, gotas y ondas decorativas genéricas de "lo natural".
- Texto de relleno: "Descubre", "Bienestar en cada gota", "Lo mejor de la naturaleza". Los textos dicen qué es y qué hacer.

## Textos

- Español de Perú, tuteo cercano, frases cortas, mayúscula solo al inicio.
- Botones con la acción exacta y la misma palabra en todo el flujo: "Agregar al carrito" → aviso "Agregado"; "Enviar pedido por WhatsApp" → pantalla "Pedido listo para enviar".
- Errores que dicen qué pasó y cómo arreglarlo: "Elige tu distrito para calcular el envío".
- No se inventan datos de contacto, horarios, testimonios, cifras ni sellos.

## Proceso en cada fase con interfaz

1. Plan corto (tokens o componentes que se tocan) y revisión contra "Qué se evita".
2. Construir mobile primero (390 px), luego 1280 px.
3. Capturas en ambos anchos y autocrítica: quitar un accesorio antes de dar por terminado.
4. Anotar en `docs/direccion-visual.md` lo que se probó y se descartó, para no repetirlo.
