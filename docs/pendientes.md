# Pendientes y cosas a tener en cuenta

Lista viva: se actualiza en cada fase. Al terminar el proyecto se convierte en el documento final de entrega.

## Datos y contenido (los resuelve el equipo en la hoja)

| # | Qué | Dónde | Desde |
|---|---|---|---|
| P1 | ECN-022: la descripción dice "68% libre de químicos" y la caja de la foto dice 67%. Verificar con la caja real | Descripción ECN-022 | v0.1 |
| P2 | Verificar contra la etiqueta las 11 descripciones que vienen de borrador (lista en `data/descripciones-pendientes.txt`) | Pestaña "Catálogo web" | v0.1 |
| P3 | Quitar la nota "Inactivo en la web" de ECN-022 en la pestaña Productos del Master | Master | v0.0 |
| P4 | ECN-015 (Maca Roja): la foto muestra marca Ecoandino 200 g; los datos dicen Algarrobos Orgánicos 250 g. Aclarar antes de activarlo | Master y foto | v0.0 |
| P5 | ECN-008 (Aceite de Almendras) está en "Cuidado corporal" pero es de uso capilar | Pestaña "Catálogo web" | v0.0 |
| P6 | Afirmaciones de salud fuertes en beneficios ("Regula la presión arterial", "Acción antibacteriana", "Protección UV"...). Revisar con proveedor o especialista | Beneficios | v0.0 |
| P7 | Marcar `mas_vendido` (los más vendidos según el Master) y más `destacado`: la portada elegida muestra 7 productos en el hero y hoy solo hay 2 destacados | Pestaña "Catálogo web" | v0.0, ampliado en v0.2 |
| P8 | Reescribir la pestaña Inicio del Master (todavía describe el flujo con backend) | Master | v0.0 |
| P9 | Registrar el envío cobrado en la línea `ENVIO` de cada pedido | Master | v0.0 |

## Técnicos y de lanzamiento

| # | Qué | Cuándo |
|---|---|---|
| T1 | ~~Licencia web de Amulya~~: resuelto, la dirección elegida usa Zilla Slab y Hind (ambas OFL) | Cerrado en v0.2 |
| T2 | El test de `data/catalogo-inicial.tsv` fija 29 productos / 23 visibles: actualizarlo cuando cambie la hoja | Fases 7 y 8 |
| T3 | Quitar `noindex` y abrir `robots.txt` | v1.0 |
| T4 | Verificar que `contacto@elchiconaturista.com` recibe correo | Antes de v1.0 |
| T5 | Volver privado el repositorio anterior `ElCHichoNaturista` | Cuando Fernando pueda |
| T6 | Requisitos legales de venta en línea en Perú: **libro de reclamaciones virtual** (se define con Fernando) y política de datos personales | Antes de v1.0 |
| T7 | Para las pruebas en navegador, dejar Chrome abierto y sin minimizar | Siempre |
| T8 | Las fotos usan transformaciones de Cloudinary (`e_trim`, tamaños). El plan gratuito tiene un cupo mensual de transformaciones: revisar el consumo en el panel de Cloudinary después del lanzamiento | v1.0 y luego mensual |
| T10 | ~~Amulya en el historial~~: Fernando decidió dejar los commits como están (15-oct-2026). Ya no se usa ni se incluye en archivos nuevos | Cerrado |
| T11 | ~~Correo personal en los commits~~: desde el 15-oct-2026 este repo usa `200515874+FlaPalacios@users.noreply.github.com` (config local, no global). Los 3 commits anteriores (v0.0, v0.1 y el intermedio de v0.2) conservan el correo personal. Recomendado: en GitHub, Settings > Emails, activar "Keep my email addresses private" y "Block command line pushes that expose my email" | Cerrado (falta activar las 2 opciones en GitHub) |
| T14 | Redes del pie: hoy TikTok y LinkedIn (enlaces reales del sitio anterior). Si hay Instagram o Facebook, pasar los enlaces | Antes de v1.0 |
| T12 | ~~En celular, el botón flotante de WhatsApp puede tapar el "+" de las láminas de la columna derecha mientras se desliza. En el prototipo se ocultó solo en la ficha (tapaba "Agregar al carrito" y ahí ya está "Consultar por WhatsApp"). Decidir la regla final en la Fase 4~~ Resuelto: en celular el flotante se oculta en ficha, carrito y checkout (ahí ya hay un WhatsApp a mano); en la portada se mantiene. | Cerrado en v0.6 |
| T13 | ~~Cloudflare Pages debe publicar solo `dist/`, nunca la raíz del repo (`prototipos/` no debe quedar en línea)~~ Resuelto: `wrangler.jsonc` publica solo `dist/` | Cerrado en v0.7 |
| T15 | `/guia` (guía de estilos para QA) está publicada en elchiconaturista.com/guia con `noindex` y sin enlaces. No tiene datos privados. Decidir antes de v1.0 si se excluye del build | v1.0 |
| T18 | Los paneles 2 y 3 del carrusel no repiten productos que ya están en la constelación del panel 1: por eso el panel 2 muestra Té Matcha, Algarrobina y Miel con Propóleo en lugar de Nibs y Kéfir (que ya están en el panel 1). Se cambia en `src/data/portada.json` | Cuando Fernando quiera |
| T16 | El plan v1 tenía un cintillo de avisos arriba de la cabecera; la dirección elegida no lo usa (los avisos están en el hero y en la franja de servicio). Si se quiere, se agrega en la Fase 4 | Fase 4, decisión de Fernando |
| T17 | ~~`public/img/logo-512.png` y `.webp` todavía no se usan: quedan para la imagen al compartir en redes (Open Graph) en la Fase 6~~ Resuelto: Open Graph con el logo de 512 px en general y la foto del producto (JPG 1200 px) en cada ficha. | Cerrado en v0.6 |
| T19 | ~~Checkout en celular: el botón flotante de WhatsApp queda encima del lado derecho de los campos mientras se desliza (no tapa el botón de enviar). Ver junto con T12~~ Resuelto con la misma regla de T12. | Cerrado en v0.6 |
| T20 | ~~Revisión v0.5 (menores): `.ck-enlace` y `.vc-enlace` repiten el mismo estilo (unificar en `global.css`); los datos recordados se cargan con tope 160 en vez del `maxlength` de cada campo (no es riesgo: `validarCliente` recorta igual)~~ Resuelto: clase común `.enlace-accion` en `global.css` y tope del `maxlength` de cada campo. | Cerrado en v0.6 |
| T21 | Si el cliente pulsa enviar antes de que cargue la lista de distritos (51 KB), ve "Elige tu distrito" mientras los selectores dicen "Cargando…". Con red normal no pasa | Fase 6 |
| T22 | El registro del pedido en el Master es manual: el equipo copia el código `ECN-AAMMDD-NNNN` del chat a "Importar pedidos" (P9). La Fase 9 (Apps Script, opcional) lo automatizaría | Fase 9 |
| T23 | La CSP va en `<meta>` y no admite `frame-ancestors` (evitar que otra web meta la tienda en un iframe). En la Fase 7, agregar `public/_headers` de Cloudflare Pages con `Content-Security-Policy: frame-ancestors 'none'`, `X-Content-Type-Options: nosniff` y `Referrer-Policy: strict-origin-when-cross-origin` | Fase 7 |
| T24 | Alpine.js se retiró (no se usaba; ~70 KB menos por página). Si algún día hace falta un framework, la CSP actual no admite `unsafe-eval` | Informativo |
| T25 | El build en Cloudflare avisa `EBADENGINE`: `undici@8` (dependencia de `unifont`, que Astro usa para fuentes remotas; aquí no se usa) pide Node ≥ 22.19 y el build usa 22.15. No afecta. Al subir Node local y `NODE_VERSION` a 22.19+ desaparece | Cuando se actualice Node |
| T26 | Activar **Always Use HTTPS** en Cloudflare (SSL/TLS, Edge Certificates): hoy `http://elchiconaturista.com` responde sin redirigir. Chrome y la mayoría de navegadores pasan solos a https, pero otros enlaces o clientes no | Ahora (Fernando) |
| T27 | Probar el flujo manual de actualización (7.5) con un cambio real cuando exista la pestaña "Catálogo web" (S1) | Fase 8 |
| T28 | Botón para descargar el catálogo en PDF (archivo propio o enlace a un PDF en Drive). Decidir de dónde sale el PDF y dónde va el botón (portada, pie o ambos) | Después de v0.8, cuando Fernando lo pida |
| T29 | Antes de v1.0, en este orden: quitar `noindex` del layout, abrir `robots.txt` con la línea `Sitemap:`, generar `sitemap.xml` (lo hace Claude); verificar el dominio en Google Search Console y enviar el sitemap (lo hace Fernando, con guía) | v1.0 |
| T30 | Fase 9 opcional: registrar en el Sheets los pedidos enviados desde la web. Si se hace, que escriban en una pestaña aparte "Pedidos web (por revisar)" y no en Pedidos | Decisión de Fernando |
| T9 | El logo limpio sale de un PNG con el fondo a cuadros pintado. Si existe el archivo original (vectorial o con transparencia real), reemplazarlo | Cuando aparezca |
