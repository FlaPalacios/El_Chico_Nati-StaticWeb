# Dirección visual (Fase 2)

Estado: **elegida la dirección D** (15 de octubre de 2026). Prototipo en `prototipos/d-elegida/`. Las propuestas A, B y C quedan como historial.

## Punto de partida

- **Sujeto**: tienda pequeña de Lima con 23 productos naturales de 6 marcas peruanas, de S/ 8 a S/ 120. Pedido por WhatsApp, delivery.
- **Material real**: logo en sello circular (montañas, hoja, anillo con greca andina), fotos de empaque sobre fondo blanco con siluetas muy distintas (botellas de proporción 3:1, galletas de 0,4:1, frascos de 1,3:1), precios claros, origen andino y amazónico.
- **Fijo**: salvia `#2F5D50`, jade `#7A9B87`, niebla `#F7F7F7`, café `#211E1E` solo en detalles. Texto blanco solo sobre salvia.
- **Sitio anterior** (se probó): reglas finas "como etiqueta impresa", sin sombras, Hind + Amulya.
- **Medido en Cloudinary**: `e_trim` funciona en la cuenta; permite mostrar cada producto con su silueta real, sin el cuadro blanco.

---

## A. La repisa

Una sola repisa bien ordenada, como la de una tienda de barrio cuidada. Los productos están de pie, a su proporción real, apoyados en una línea salvia, con una etiqueta de precio colgando.

| Token | Hex | Uso |
|---|---|---|
| Niebla | `#F7F7F7` | Fondo |
| Monte | `#1C3A31` | Texto (salvia oscurecida, 12:1 sobre niebla) |
| Salvia | `#2F5D50` | Repisas, botones |
| Jade | `#7A9B87` | Marca de destacado, foco |
| Papel | `#FFFFFF` | Etiquetas de precio |
| Café | `#211E1E` | Hilo de la etiqueta |

Tipografía: Hind 700 para titulares (grande, interletra ajustada); Amulya 400 para texto; precios en Hind 600 con cifras tabulares.

```
390 px                               1280 px
+------------------------------+     +--------------------------------------------------+
| (logo) El Chico Naturista  🛒 |     | (logo) El Chico Naturista   Catálogo  Buscar   🛒 |
|                              |     |                                                  |
| Productos naturales          |     | Productos naturales      Pide por WhatsApp.      |
| del Perú.                    |     | del Perú.                Delivery en Lima        |
| Pide por WhatsApp.           |     |                          el mismo día.           |
|                              |     |                                                  |
|  ▮  ▯ ▮▮ ▯  ▮  ▬ ▬  ▯ ▮ →    |     |  ▮ ▯ ▮▮ ▯ ▮ ▬ ▬ ▯ ▮ ▮▮ ▯ ▮ ▬ ▯ ▮ ▮ ▯ (23)          |
| ═════════════════════════    |     | ════════════════════════════════════════════     |
|  ◇23  ◇25 ◇30 ...  (desliza) |     |  ◇ etiquetas de precio colgando                  |
|                              |     |                                                  |
| Frescos                      |     | Frescos            Abarrotes        Cuidado ...  |
|  ▮  ▮                        |     |  (una repisa por subcategoría)                   |
| ═══════                      |     |                                                  |
+------------------------------+     +--------------------------------------------------+
```

Alineación: todo a la izquierda; la repisa ocupa todo el ancho.
Principios:
1. Nada flota: todo producto apoya en una repisa.
2. La etiqueta de precio es el único adorno.
3. Las proporciones reales se respetan: una galleta es baja y ancha, una botella es alta.

Movimiento: al cargar la portada, los productos "se asientan" en la repisa de izquierda a derecha (una sola vez). Foto de la repisa → foto grande de la ficha con View Transitions.

---

## B. Herbario

Cada producto es una lámina, como en un herbario o la ficha de un museo: hoja blanca, el producto grande y centrado, y un bloque de datos al pie con el código real (`ECN-013`), presentación, marca y precio.

| Token | Hex | Uso |
|---|---|---|
| Niebla | `#F7F7F7` | Fondo general |
| Liquen | `#E4ECE7` | Campo detrás de las láminas (jade muy claro) |
| Papel | `#FFFFFF` | Láminas |
| Tinta | `#22312B` | Texto |
| Salvia | `#2F5D50` | Botones, enlaces |
| Jade | `#7A9B87` | Filete del bloque de datos |

Tipografía: Young Serif (un solo peso, serif cálida de bajo contraste) para nombres y titulares; Amulya para texto y datos, con cifras tabulares.

```
390 px                               1280 px
+------------------------------+     +--------------------------------------------------+
| (logo)            Catálogo 🛒 |     | (logo) El Chico Naturista          Catálogo  🛒  |
|                              |     | +----------------+ +---------+ +---------+       |
| +--------------------------+ |     | |                | |  lámina | |  lámina |       |
| |                          | |     | |   lámina       | +---------+ +---------+       |
| |     (Leche de            | |     | |   destacada    | +---------+ +---------+       |
| |      Almendras)          | |     | |                | |  lámina | |  lámina |       |
| |                          | |     | | ECN-001  1 L   | +---------+ +---------+       |
| | ECN-001 · Green House    | |     | | Leche de Alm.  |                               |
| | Leche de Almendras  S/23 | |     | +----------------+                               |
| +--------------------------+ |     |                                                  |
| [lámina] [lámina]            |     | Láminas por familia: Frescos, Abarrotes, ...     |
+------------------------------+     +--------------------------------------------------+
```

Alineación: rejilla asimétrica; texto de las láminas a la izquierda.
Principios:
1. Cada producto es una lámina; la lámina destacada es más grande.
2. El código ECN es un dato visible, no decoración.
3. Los filetes finos solo existen dentro del bloque de datos.

Movimiento: la lámina destacada aparece primero y las demás después, una sola vez. Al abrir la ficha, la lámina crece hasta ocupar la pantalla (View Transitions).

---

## C. Sello

El círculo del logo organiza todo. Campos amplios de salvia con texto blanco; cada producto sobre un disco blanco con anillo jade, como un sello. La greca andina del anillo del logo aparece una sola vez, como franja entre la portada y el catálogo.

| Token | Hex | Uso |
|---|---|---|
| Salvia | `#2F5D50` | Campos grandes (portada, pie) |
| Jade | `#7A9B87` | Anillo de los discos, greca |
| Papel | `#FFFFFF` | Discos, texto sobre salvia |
| Niebla | `#F7F7F7` | Fondo del catálogo |
| Monte | `#1C3A31` | Texto sobre niebla |
| Café | `#211E1E` | Detalles mínimos |

Tipografía: Zilla Slab 700 para titulares (eco de las letras "EL CHICO" del logo, que son de remate grueso); Hind 400/500 para texto.

```
390 px                               1280 px
+------------------------------+     +--------------------------------------------------+
|██████ campo salvia ██████████|     |███████████████ campo salvia ██████████████████████|
| (logo)                    🛒 |     | (logo)                                       🛒  |
| Productos naturales          |     | Productos naturales       (◯)  (◯)               |
| del Perú                     |     | del Perú               (◯)  ( ◉ )  (◯)            |
|        (◯) (◯)               |     | [Ver catálogo]            (◯)  (◯)               |
|     (◯)  ( ◉ )  (◯)          |     |                                                  |
|        (◯) (◯)               |     |                                                  |
|/\/\/\/\/ greca /\/\/\/\/\/\/\|     |/\/\/\/\/\/\/\/\/\/\/ greca /\/\/\/\/\/\/\/\/\/\/\|
| niebla: (◯) Nombre   S/ 23   |     | niebla: (◯) (◯) (◯) (◯) (◯) por categoría        |
+------------------------------+     +--------------------------------------------------+
```

Alineación: titulares a la izquierda; composición de discos centrada sobre su propio eje.
Principios:
1. La forma viene del logo, no de una tendencia.
2. Superficies de color amplias en lugar de muchas tarjetas.
3. Un solo patrón andino, una sola vez.

Movimiento: los discos aparecen desde el centro hacia afuera, una sola vez. Disco → foto de la ficha con View Transitions.

---

## Revisión contra el brief (tarea 2.2)

Se repasó cada dirección contra `PLAN-v2.md` 7.5 y se hizo la prueba de "¿llegaría aquí con cualquier otra tienda natural?".

| Dirección | Riesgo detectado | Cambio |
|---|---|---|
| A | Es fácil caer en una rejilla de tarjetas idénticas con sombra gris | No hay tarjetas: los productos están de pie sobre una repisa. La única sombra es la de contacto bajo el producto |
| A | Etiquetas de precio con forma de cartel decorativo genérico | La etiqueta es blanca, rectangular, con el hilo café como único detalle; el precio es el contenido |
| B | Una serif de titular sugiere el estilo "crema + serif + terracota" | Fondo frío (niebla y liquen), no crema; Young Serif es de bajo contraste, no una didona; acento salvia, sin terracota |
| B | Los filetes finos pueden volverse un periódico | Solo existen dentro del bloque de datos de cada lámina, donde separan información real |
| C | Círculos y una greca pueden caer en "artesanía decorativa" | El círculo sale del logo; la greca se usa una vez, como borde entre secciones, no como fondo ni en cada tarjeta |
| C | Mucho salvia puede oscurecer las fotos | Las fotos siempre van sobre discos blancos; el salvia nunca toca un producto |
| Todas | Titulares de relleno ("Descubre lo natural") | Solo se usan textos reales: el lema de la tienda, los avisos del cintillo, nombres y datos del catálogo |
| Todas | Animar cada sección al hacer scroll | Un solo momento en la portada y la transición tarjeta → ficha; el resto se mueve solo cuando el cliente actúa |

## Prototipos (tarea 2.3)

`prototipos/` con portada y ficha de cada dirección, datos reales de `prototipos/datos.js` (23 productos visibles; la ficha acepta `?p=ECN-0NN`). Para ver las transiciones entre páginas hay que abrirlos desde un servidor local, porque desde `file://` el navegador no las activa:

```
cd prototipos
python -m http.server 4500 --bind 127.0.0.1
```

y abrir http://127.0.0.1:4500/

Comprobado el 15-oct-2026: las 6 páginas sin desborde horizontal a 390 y 1280 px, sin errores de consola y sin imágenes rotas.

Lecciones para la construcción real (Fase 4):
- `mix-blend-mode: multiply` necesita un fondo explícito en el contenedor: `position: sticky` crea su propia capa y sin fondo la foto muestra su recuadro blanco.
- El contenido nunca debe depender de que corra una animación: en pestañas ocultas el navegador pausa `requestAnimationFrame` y las transiciones. Estado visible por defecto; la animación solo se agrega.
- Las funciones `sqrt()`, `cos()` y `sin()` de CSS sirven para dimensionar productos por área igual y para la composición circular sin JavaScript.

## Elección (tarea 2.6)

Fernando eligió una combinación, el 15 de octubre de 2026:

| Parte | Viene de | Detalle |
|---|---|---|
| Portada | C (sello) | Hero salvia con la constelación de discos (uno al centro, seis alrededor), precio en sello, greca andina como borde, botón "Ver catálogo" |
| Catálogo | C (filtros) + B (láminas) | Filtros rápidos por categoría bajo el título "Catálogo"; productos en láminas blancas sobre fondo liquen, con bordes redondeados (12 px) y un botón "+" discreto para agregar sin entrar |
| Ficha | C (sello) | Panel salvia con el disco del producto y el reverso como disco pequeño; datos, compra, beneficios en píldoras |
| Recomendados | Idea de A | Carrusel sutil "También te puede interesar" al final de la ficha: láminas pequeñas que se deslizan, flechas solo en escritorio, borde derecho desvanecido |
| Descartado | A como portada | "Parece una línea de tiempo con los productos" |

Decisión tomada al combinar: una sola familia tipográfica, la de C, también en las láminas (no la serif de B), para no mezclar tres tipografías.

### Ajustes pedidos por Fernando (segunda vuelta, 15-oct-2026)

| Pedido | Cómo quedó |
|---|---|
| Que el contenido no ocupe toda la pantalla, ~85 % de 1920 px, como florayfauna.pe | `.contenedor` con ancho máximo de 1632 px, centrado. Las franjas de color (hero, catálogo, pie) siguen de borde a borde; el contenido va dentro |
| Catálogo a 5 columnas (a 4 se ve muy grande) | 5 columnas desde 1240 px; 4 entre 1000 y 1239; 3 desde 700; 2 en celular |
| No mostrar códigos ECN (son internos) | Las láminas muestran presentación, nombre y precio. El código solo vive en enlaces y datos internos |
| Ficha: información como en A, producto como en B, sin que sea invasivo | Producto en una lámina blanca de máximo 420 px (300 px en celular) con miniaturas frente/reverso; información con el orden de A: marca, nombre, presentación, precio, descripción, compra, WhatsApp, Qué es, Beneficios (con puntos jade), Modo de uso. Zona de la ficha de máximo 1080 px |
| Pie como el del sitio anterior | Cuatro bloques: marca (logo en disco blanco, lema "Productos naturales que se pueden rastrear hasta quien los cosecha. Sin promesas milagrosas.", redes), Catálogo, Tu pedido, Dónde estamos; franja legal con © y aclaraciones de salud. "Mis pedidos" se quitó porque ya no hay cuentas. Redes: TikTok y LinkedIn, que son las que tienen enlace real en el sitio anterior |

### Tercera vuelta (15-oct-2026)

| Pedido | Cómo quedó |
|---|---|
| Cabecera que se marque y no parezca parte del hero | Cabecera blanca, fija arriba siempre (sticky), con filete inferior y sombra suave al desplazarse. El hero pasa a ser un panel salvia debajo |
| Más espacio lateral (en 1920 × 1200 aún se veía todo ocupado) | `--ancho-max` baja a 1360 px (~280 px de aire a cada lado en 1920). En escritorio el hero y el catálogo son paneles redondeados (20 px) dentro de ese ancho; en celular siguen de borde a borde |
| Buscador al centro de la cabecera | Formulario de búsqueda centrado. En la portada filtra mientras se escribe (sin tildes ni mayúsculas, por nombre, marca, categoría, subcategoría y presentación) y se combina con los filtros; en otras páginas lleva a la portada con `?q=`. Sin resultados: mensaje y botón "Ver todo el catálogo". En celular: logo, buscador y carrito en una sola fila |
| Botón de WhatsApp con su logo | Logo de WhatsApp en blanco sobre el círculo salvia (Simple Icons, CC0) |
| Redes del pie con logo en blanco | TikTok (Simple Icons, CC0) y LinkedIn (ícono propio: Simple Icons ya no lo incluye) en el color del texto |
| Quitar "Los productos naturales no reemplazan un tratamiento médico…" | Quitado. Queda solo el aviso de suplementos que exige el plan |

### Cuarta vuelta (16-oct-2026)

| Pedido | Cómo quedó |
|---|---|
| Hero a todo el ancho, como la cabecera y el pie | El hero deja de ser panel redondeado: va de borde a borde, con el contenido dentro del contenedor. El catálogo sigue como panel |
| Dos paneles más que roten como carrusel | 3 paneles con contenido real: (1) "Productos naturales del Perú" con la constelación; (2) "Delivery el mismo día en Lima" con envío gratis desde S/ 120 y S/ 10 en Lima y Callao; (3) "Tu pedido, por WhatsApp" con Yape, Plin o transferencia y botón a WhatsApp. Los paneles 2 y 3 llevan un trío de discos con productos reales. Rotan cada 7 s con fundido; se pausan al pasar el mouse, al entrar con teclado y con el botón "Pausar"; puntos para elegir panel; sin rotación automática con `prefers-reduced-motion`; los paneles ocultos son `inert` |
| Ficha: que la foto no siga al desplazarse | La lámina del producto en la ficha es estática (se quitó `position: sticky`) |

Los títulos de las columnas del pie van en mayúsculas espaciadas porque así está en la referencia que eligió Fernando; en el resto del sitio no se usan.

### Tokens finales

| Token | Valor | Uso |
|---|---|---|
| `--salvia` | `#2F5D50` | Campos grandes (hero, panel de ficha, pie), botones, filtro activo |
| `--jade` | `#7A9B87` | Anillo de discos, borde de filtros y píldoras, greca, foco |
| `--niebla` | `#F7F7F7` | Fondo general |
| `--liquen` | `#E4ECE7` | Fondo del catálogo, detrás de las láminas |
| `--papel` | `#FFFFFF` | Láminas, discos, texto sobre salvia |
| `--monte` | `#1C3A31` | Texto sobre fondos claros, sello de precio |
| `--cafe` | `#211E1E` | Reservado para detalles mínimos |
| Derivados | `color-mix()` | `--papel-suave`, `--monte-suave`, `--filete`, `--salvia-hundido`, `--sombra`, `--sombra-suave` |
| `--losa` | Zilla Slab 500/700 (OFL) | Titulares, nombres de producto, precios |
| `--texto` | Hind 400/500/600 (OFL) | Texto, botones, datos |
| `--radio-lamina` / `--radio-foto` | 12 px / 8 px | Láminas y fotos dentro de ellas |
| `--ancho-max` | 1360 px | Ancho máximo del contenido (~280 px de aire a cada lado en 1920) |
| `--radio-panel` | 20 px | Paneles del hero y del catálogo en escritorio |
| `--alto-cabecera` | 68 px | Cabecera fija; también desplaza los anclas para que no queden debajo |
| `--margen` | 16 px celular / 40 px escritorio | Aire mínimo a los lados |
| `--curva` | `cubic-bezier(.2, .7, .2, 1)` | Transiciones |
| `--rebote` | `cubic-bezier(.3, 1.4, .5, 1)` | Entrada de los discos |
| `--rapido` / `--medio` | .2 s / .45 s | Duraciones |

Amulya y Young Serif ya no se usan: con esta elección desaparece el pendiente de licencia de Amulya (T1).

### Movimiento de la dirección elegida

- Momento orquestado: los discos del hero aparecen del centro hacia afuera, una vez.
- Respuesta a acciones: las láminas se reacomodan al filtrar; el contador del carrito salta al agregar; aviso "Agregado".
- Firma: la foto tocada (disco o lámina) se transforma en el disco de la ficha. El nombre de la transición se pone solo en la foto tocada, así un producto puede aparecer dos veces en la portada.
- Sin movimiento con `prefers-reduced-motion`.

### Para la construcción (Fases 3 y 4)

- La constelación necesita 7 productos y hoy solo hay 2 marcados como `destacado`. Regla propuesta: centro = primer destacado; anillo = resto de destacados, luego `mas_vendido`, luego uno por subcategoría hasta completar 6. Si se marcan más destacados en la hoja (tarea S5), la portada los usa solos.
- Recomendados: misma subcategoría, luego misma categoría, luego destacados; nunca el mismo producto; máximo 8.

## Notas de lo probado y descartado

- `e_make_transparent` de Cloudinary se descartó: la leche de almendras y el kéfir tienen envase blanco y quedarían con huecos.
- `img-paginaprincipal.png` descartada por decisión de Fernando (imagen generada, productos que no se venden).
