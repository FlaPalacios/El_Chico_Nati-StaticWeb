# Dirección visual (Fase 2)

Estado: **3 propuestas en prototipo, falta que Fernando elija una**.

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

Pendiente.

## Notas de lo probado y descartado

- `e_make_transparent` de Cloudinary se descartó: la leche de almendras y el kéfir tienen envase blanco y quedarían con huecos.
- `img-paginaprincipal.png` descartada por decisión de Fernando (imagen generada, productos que no se venden).
