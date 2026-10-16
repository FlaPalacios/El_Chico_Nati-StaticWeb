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
| P7 | Marcar `mas_vendido` (propuesta: Galleta Cookie Dough, Aceite de Almendras, Leche de Almendras) y más `destacado`: la portada elegida muestra 7 productos en el hero y hoy solo hay 2 destacados | Pestaña "Catálogo web" | v0.0, ampliado en v0.2 |
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
| T6 | Requisitos legales de venta en línea en Perú (libro de reclamaciones virtual, política de datos personales) | Antes de v1.0 |
| T7 | Para las pruebas en navegador, dejar Chrome abierto y sin minimizar | Siempre |
| T8 | Las fotos usan transformaciones de Cloudinary (`e_trim`, tamaños). El plan gratuito tiene un cupo mensual de transformaciones: revisar el consumo en el panel de Cloudinary después del lanzamiento | v1.0 y luego mensual |
| T10 | ~~Amulya en el historial~~: Fernando decidió dejar los commits como están (15-oct-2026). Ya no se usa ni se incluye en archivos nuevos | Cerrado |
| T11 | ~~Correo personal en los commits~~: desde el 15-oct-2026 este repo usa `200515874+FlaPalacios@users.noreply.github.com` (config local, no global). Los 3 commits anteriores (v0.0, v0.1 y el intermedio de v0.2) conservan el correo personal. Recomendado: en GitHub, Settings > Emails, activar "Keep my email addresses private" y "Block command line pushes that expose my email" | Cerrado (falta activar las 2 opciones en GitHub) |
| T14 | Redes del pie: hoy TikTok y LinkedIn (enlaces reales del sitio anterior). Si hay Instagram o Facebook, pasar los enlaces | Antes de v1.0 |
| T12 | En celular, el botón flotante de WhatsApp puede tapar el "+" de las láminas de la columna derecha mientras se desliza. En el prototipo se ocultó solo en la ficha (tapaba "Agregar al carrito" y ahí ya está "Consultar por WhatsApp"). Decidir la regla final en la Fase 4 | Fase 4 |
| T13 | Cloudflare Pages debe publicar solo `dist/`, nunca la raíz del repo (`prototipos/` no debe quedar en línea) | Fase 7 |
| T15 | `/guia` (guía de estilos para QA) existe en el sitio con `noindex` y sin enlaces. Decidir en la Fase 7 si se publica o se excluye del build | Fase 7 |
| T16 | El plan v1 tenía un cintillo de avisos arriba de la cabecera; la dirección elegida no lo usa (los avisos están en el hero y en la franja de servicio). Si se quiere, se agrega en la Fase 4 | Fase 4, decisión de Fernando |
| T17 | `public/img/logo-512.png` y `.webp` todavía no se usan: quedan para la imagen al compartir en redes (Open Graph) en la Fase 6 | Fase 6 |
| T9 | El logo limpio sale de un PNG con el fondo a cuadros pintado. Si existe el archivo original (vectorial o con transparencia real), reemplazarlo | Cuando aparezca |
