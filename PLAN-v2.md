# Plan v2: web estática de El Chico Naturista

Fecha: 15 de octubre de 2026
Reemplaza a `-recursos/PLAN-web-estatica-ECN.md` (v1), que queda solo como referencia.
Repositorio: https://github.com/FlaPalacios/El_Chico_Nati-StaticWeb (público).
Repositorio anterior (con backend, solo referencia): https://github.com/FlaPalacios/ElCHichoNaturista, clonado en `referencia/` (ignorado por git).
Dominio: elchiconaturista.com (ya comprado; se vincula en la Fase 7). Hasta entonces el sitio corre en local.

---

## 0. Cómo usar este plan

1. Claude Code lee `CLAUDE.md`, que apunta a este archivo. Las reglas permanentes viven en `CLAUDE.md`; el detalle, aquí.
2. Se trabaja **una fase a la vez** (sección 10). Cada tarea tiene una verificación concreta.
3. Cada fase se cierra con la skill `/cerrar-fase N`: build, pruebas, revisión de los agentes que indica la matriz (sección 9), tu visto bueno y commit `ECN-v0.N <descripción corta>`.
4. Una fase no empieza si tiene una pregunta bloqueante abierta (sección 13).
5. El repositorio es **público**: todo lo que se sube se puede leer. `-recursos/` (Excel Master, TSV originales, plan v1) nunca se sube.

---

## 1. Qué se construye y qué problema resuelve

El servidor con backend y base de datos ya no se puede pagar. Se construye una web estática (sin backend, sin base de datos, sin costo de servidor) que:

- Muestra el catálogo de El Chico Naturista con un diseño boutique cuidado, con movimiento donde aporta.
- Deja que el cliente arme un carrito y genera un mensaje de WhatsApp con el pedido.
- Toma el catálogo de una pestaña del Excel Master (Google Sheets) que mantiene el equipo.
- Usa las fotos que ya están en Cloudinary.

Usuarios: el cliente (compra como invitado) y el equipo (Fernando y colaboradores), que edita productos y precios solo en Google Sheets. No hay panel de administración ni cuentas.

---

## 2. Decisiones ya tomadas (no cambian)

| Tema | Decisión |
|---|---|
| Arquitectura | Web estática. Sin backend, sin base de datos. Supabase queda descartado |
| Compra | Carrito en el navegador. Al confirmar se abre WhatsApp con el pedido escrito. Sin pago en línea, sin cuentas |
| Entrega | Todo pedido es delivery |
| Catálogo | Pestaña "Catálogo web" dentro del Excel Master (Google Sheets), separada de los costos |
| Stock | No se publica ni se muestra. Nunca aparece "agotado" ni se bloquea una compra. Si algo no hay, se pide al proveedor. El stock se controla solo en la hoja |
| Fotos | Cloudinary. Las URLs ya están en el TSV. No se usa la API. Fotos nuevas: subir a mano y pegar el link en la hoja |
| Categorías | Se mantienen: 3 categorías (Abarrotes, Frescos, Cuidado personal), 8 subcategorías y 7 marcas |
| Precios | Los de la hoja. Los 4 tintes están a S/ 46 |
| Visibilidad | Se muestra un producto si `activo = si` y tiene precio mayor que 0. El equipo controla esto desde la hoja |
| Diseño | Estilo boutique (sección 7). Se conservan salvia y jade como colores de marca. Se usa la skill de diseño |
| Actualización | Empezar manual (Fase 7) y pasar a automática al editar la hoja (Fase 8) |
| Registro de pedidos | En Google Sheets. Registro y aviso por correo con Apps Script en la Fase 9 (pendiente de visto bueno) |

### 2.1 Decisiones nuevas de esta versión (se pueden revertir)

| Tema | Decisión v2 | Por qué |
|---|---|---|
| Precedencia de datos | El Master manda sobre el TSV y las descripciones (sección 3) | Pedido explícito; el Master es el registro operativo |
| Hosting | Cloudflare Pages (plan gratuito). Local hasta la Fase 7 | Decidido por Fernando el 15-oct-2026: Vercel gratis no permite uso comercial, y el dominio ya está comprado en Cloudflare, así que DNS y hosting quedan en la misma cuenta |
| Dirección visual | D: portada de C (sello), láminas de B (herbario) redondeadas y sin códigos a 5 columnas, ficha con la información de A y el producto en lámina contenida, carrusel de recomendados, pie como el sitio anterior, contenido a 1360 px máximo con paneles redondeados, cabecera blanca fija con buscador al centro. Zilla Slab + Hind. Detalle y tokens en `docs/direccion-visual.md` | Elegida por Fernando el 15-oct-2026 (Fase 2) |
| Correo de contacto | `contacto@elchiconaturista.com` | Decidido por Fernando el 15-oct-2026 (reemplaza al `.pe` del sitio anterior) |
| Actualización desde la hoja | Un flujo de GitHub Actions baja el CSV publicado cada hora y, solo si cambió, hace commit de `data/catalogo-inicial.tsv`. El hosting compila con cada push | Sirve con cualquier hosting, no gasta compilaciones si no hay cambios y deja historial de cada cambio de datos |
| Datos en el repo | Solo un TSV limpio con columnas públicas (`data/catalogo-inicial.tsv`), generado por script | El TSV original trae la columna `stock`; subirlo a un repo público rompería la regla de stock |
| Productos visibles hoy | 23 (no 26) | Ver sección 4 |
| Envío | S/ 10 a la provincia de Lima (43 distritos) y al Callao (7 distritos); S/ 15 al resto del Perú; gratis desde S/ 120. Se puede cambiar después en `envio.json` | Confirmado por Fernando el 15-oct-2026; es la misma regla del sistema anterior |
| Portada | Composición colectiva con las fotos reales de los productos. No se usa `img-paginaprincipal.png` | Confirmado por Fernando; es temporal y se mejorará |
| Versionado | Fase N = `ECN-v0.N`. Plan y estructura = `ECN-v0.0`. Lanzamiento = `ECN-v1.0` | Pedido explícito; numeración de fases ajustada para que coincida |
| Interactividad | Alpine.js en su build CSP (`@alpinejs/csp`) | Permite una política CSP estricta sin `unsafe-eval` desde el inicio |
| Transiciones entre páginas | View Transitions nativas entre documentos (CSS), sin router en JS | Da la transición foto de tarjeta → ficha sin reinicializar Alpine; en navegadores sin soporte simplemente no anima |
| Pruebas | `node --test` (incluido en Node 22) para la lógica pura | Sin dependencias extra; cubre validación, envío, mensaje y número de pedido |

---

## 3. Fuentes de datos y precedencia

| Fuente | Qué aporta | Manda en |
|---|---|---|
| `El Chico Naturista – Control de operaciones (Master).xlsx` (Google Sheets) | Productos, precios, estado operativo, ventas, compras, inventario | Código, nombre, presentación, precio, si un producto está activo |
| `catalogo-ECN-productos.tsv` | Slugs, categorías, marcas, descripciones, beneficios, URLs de Cloudinary, destacado | Todo lo que el Master no tiene (contenido y fotos) |
| `descripciones-faltantes.tsv` | Borradores de descripción para 11 productos | Nada hasta que se verifiquen contra la etiqueta |

Reglas:

- Si el Master y el TSV dicen cosas distintas sobre lo mismo, gana el Master.
- La pestaña nueva "Catálogo web" lee nombre, presentación y precio del Master con fórmula, así hay una sola fuente de precio.
- Los archivos originales viven en `-recursos/` (ignorado por git). Al repo solo sube lo que genera `scripts/preparar-datos.mjs` (Fase 1).
- Nunca se copian al repo ni a un JSON: costo, proveedor, margen, stock, compras, ventas, clientes, contactos de proveedores.

---

## 4. Estado verificado de los datos (15 de octubre de 2026)

Cruce hecho entre el Master (10 pestañas), los dos TSV y las 30 fotos de Cloudinary.

### 4.1 Lo que cuadra

- 29 productos, mismos códigos en Master y TSV (ECN-001 a ECN-029).
- Nombre, presentación y precio coinciden en los 29. Los 4 tintes están a S/ 46.
- Las 30 URLs de Cloudinary responden. Todas son fotos de empaque sobre fondo blanco, cuadradas (1200 × 1200).
- 22 productos con 1 foto, 4 con 2 (ECN-001, 004, 005, 006) y 3 sin foto (ECN-027, 028, 029).
- 8 subcategorías y 7 marcas en los datos.

### 4.2 Lo que no cuadra y cómo se resuelve

| # | Hallazgo | Resolución v2 |
|---|---|---|
| D1 | El plan v1 decía "26 productos activos", pero 3 de ellos (ECN-014, 015, 016) no tienen precio y la validación pedía precio > 0 en activos: la compilación habría fallado | Visible = `activo = si` y precio > 0. Un activo sin precio genera **aviso** y se oculta, no rompe la compilación. En la pestaña se marcan `activo = no` hasta tener precio |
| D2 | ECN-022: el TSV lo da como publicado y el Master anota "Inactivo en la web". La caja de la foto dice "Castaño Claro" y "67% libre de químicos"; el borrador de descripción dice 68% | Fernando confirmó el 15-oct-2026: es "Tinte para Cabello Castaño Seminatural" y se publica. Visibles hoy: **23**. Pendiente: quitar la nota "Inactivo en la web" del Master y verificar el 67/68% contra la caja real (tarea S4) |
| D3 | Tarwi Foods solo tiene productos inactivos (ECN-027 a 029) | Las 7 marcas siguen en los datos; la web muestra las que tienen productos visibles (6 hoy). Igual con subcategorías |
| D4 | ECN-004 (Miel de Abeja): `imagen_1` es la vista posterior y `imagen_2` el frente. La tarjeta mostraría la etiqueta nutricional | En la pestaña, intercambiar: `imagen_1` siempre es el frente |
| D5 | ECN-015 (Maca Roja): la foto muestra marca Ecoandino, 200 g, "gelatinizada"; los datos dicen Algarrobos Orgánicos, 250 g | Verificar con el producto real antes de activarlo (sigue oculto, no tiene precio) |
| D6 | Categoría escrita "Cuidado Personal" en el TSV; el resto usa mayúscula solo al inicio ("Bebidas frescas") | En la pestaña se escribe "Cuidado personal" (slug sin cambio: `cuidado-personal`) |
| D7 | ECN-008 (Aceite de Almendras) está en "Cuidado corporal", pero su slug, descripción y beneficios son de uso capilar | Se deja como está (categorías fijas). Anotado para que el equipo decida en la hoja |
| D8 | ECN-023, 024, 025 y 026 ya están publicados sin ninguna descripción | Sus borradores existen en `descripciones-faltantes.tsv`; verificarlos contra la etiqueta y cargarlos (tarea S4) |
| D9 | 10 productos visibles no tienen `modo_uso` | La ficha oculta la sección si está vacía. No se inventa texto |
| D10 | Los beneficios de varios productos publicados hacen afirmaciones de salud fuertes (por ejemplo "Regula la presión arterial", "Acción antibacteriana", "Protección UV") | No se reescriben desde el código. Se anota como riesgo (sección 12) para revisión del equipo |
| D11 | `mas_vendido = no` en los 29 productos, así que el bloque "Más vendidos" nunca aparecería | Según Ventas del Master, los que más unidades vendieron son Galleta Cookie Dough, Aceite de Almendras y Leche de Almendras. Propuesta: marcarlos en la hoja (tarea S5). Si no se marcan, el bloque no aparece |
| D12 | Slugs que no calzan con el nombre (`kefir-de-leche-hiri`, `tinte-castano-claro-seminatural`, `aceite-almendras-cabello`) | Se mantienen: el slug es la URL y debe ser estable. No se cambia por estética |
| D13 | La pestaña Inicio del Master describe el flujo con backend (subir stock en la web, exportar CSV semanal, registrar venta manual en el panel) | Reescritura en tarea S2 |
| D14 | El plan v1 menciona una pestaña "Colección" en el Master | No existe. Se quita del plan |
| D15 | El plan v1 nombra estados `pendiente, pagado, enviado, completado, cancelado`; la fórmula de Ventas además cuenta `coordinado` como venta | Gana el Master: estados `pendiente, coordinado, pagado, enviado, completado, cancelado`. La web no usa estados (solo la Fase 9) |
| D16 | En las 14 ventas del Master la línea `ENVIO` está en S/ 0, y el plan v1 propone cobrar S/ 10 / 15 / gratis desde S/ 120 | Confirmado: S/ 10 Lima y Callao, S/ 15 resto del Perú, gratis desde S/ 120. Desde ahora, la línea `ENVIO` del Master lleva el monto cobrado |
| D17 | `logo-ECN.png` no tiene transparencia real: el fondo a cuadros está pintado en la imagen (RGB, sin canal alfa) | Fase 3: generar versión limpia con máscara circular (el logo es un círculo). Si existe el archivo original o vectorial, mejor |
| D18 | `img-paginaprincipal.png` es una imagen generada por IA que muestra productos que la tienda no vende (atomizadores, peines, goteros) | Confirmado: no se usa. La portada es una composición colectiva con las fotos reales de producto (Fase 2) |
| D19 | El plan v1 dependía de un repositorio anterior que no estaba en esta carpeta | Resuelto: clonado en `referencia/ElChicoNaturista-anterior/` (sección 5.4) |
| D20 | El correo del sistema anterior es `hola@elchiconaturista.pe`, pero el dominio comprado es `elchiconaturista.com` | Resuelto: `contacto@elchiconaturista.com`. Verificar que el buzón reciba correo antes de v1.0 |
| D21 | La zona de S/ 10 es la **provincia** de Lima. Lugares del departamento de Lima fuera de ella (por ejemplo Huaral, de donde ya hubo un cliente) pagan S/ 15 | Es la regla confirmada. Se anota para que no sorprenda al registrar pedidos |

### 4.3 Resultado esperado de la primera sincronización

| Categoría | Subcategoría | Productos visibles |
|---|---|---|
| Frescos | Bebidas frescas | 1 (ECN-001) |
| Frescos | Bebidas probióticas | 1 (ECN-005) |
| Abarrotes | Café y cacao | 2 (ECN-002, 025) |
| Abarrotes | Aceites vegetales | 1 (ECN-003) |
| Abarrotes | Mermeladas y mieles | 3 (ECN-004, 013, 017) |
| Abarrotes | Proteínas y suplementos | 10 (ECN-009 a 012, 018, 019, 020, 023, 024, 026) |
| Cuidado personal | Cuidado de cabello | 4 (ECN-006, 007, 021, 022) |
| Cuidado personal | Cuidado corporal | 1 (ECN-008) |
| **Total** | | **23** |

Marcas visibles: Green House (4), HIRI (1), Health Natural (7), Algarrobos Orgánicos (2), Fit Rex (4), Henna Colors (5).

Abarrotes concentra 16 de 23: por eso el catálogo da peso a subcategorías y marcas.

---

## 5. Contrato de datos

### 5.1 Pestaña "Catálogo web"

Una fila por producto. Solo columnas públicas. Encabezado verde: se escribe a mano. Gris: fórmula.

| Columna | Tipo | Origen | Regla |
|---|---|---|---|
| `codigo` | texto | escrito | `ECN-NNN`, único, nunca se reutiliza |
| `slug` | texto | escrito | minúsculas, números y guiones; único; estable una vez publicado |
| `activo` | `si` / `no` | escrito | |
| `nombre` | texto | fórmula desde Productos (col. B) | |
| `presentacion` | texto | fórmula desde Productos (col. C) | |
| `precio` | número | fórmula desde Productos (col. F "Precio en la web") | |
| `precio_antes` | número o vacío | escrito | Con valor y mayor que `precio` = oferta |
| `categoria`, `categoria_slug` | texto | escrito | Una de las 3 |
| `subcategoria`, `subcategoria_slug` | texto | escrito | Una de las 8, dentro de su categoría |
| `marca`, `marca_slug` | texto | escrito | Una de las 7 |
| `destacado`, `mas_vendido` | `si` / `no` | escrito | |
| `descripcion_corta` | texto | escrito | Máx. 140 caracteres (cabe en la tarjeta) |
| `descripcion_larga`, `modo_uso` | texto | escrito | Pueden ir vacíos |
| `beneficios` | texto | escrito | Separados por `|`, máx. 4 |
| `imagen_1` | URL | escrito | Frente del empaque. `https://res.cloudinary.com/deaq5dfwt/...` |
| `imagen_2` | URL o vacío | escrito | Otra vista |

Se eliminan del TSV original: `estado`, `en_oferta`, `descuento_pct` (se derivan o no se usan: el estilo boutique no muestra porcentajes), `num_imagenes`, `imagen_1_tipo`, `imagen_2_tipo` y **`stock`**.

### 5.2 Validación en `scripts/sync-catalogo.mjs`

**Error** (la compilación falla, queda publicada la versión anterior; el mensaje dice código, columna y valor):

- Falta una columna obligatoria o el encabezado cambió de nombre.
- `codigo` con formato inválido o repetido. `slug` inválido o repetido.
- `precio` o `precio_antes` no numérico.
- `categoria_slug`, `subcategoria_slug` o `marca_slug` que no calzan con su nombre o con el resto de filas.
- `imagen_1` o `imagen_2` con un dominio distinto de `res.cloudinary.com`.
- Aparece una columna prohibida (`stock`, `costo`, `proveedor`, `margen`).
- Ningún producto visible.

**Aviso** (compila igual, se muestra en consola y en el resumen del build):

- Activo sin precio o con precio 0 (se oculta).
- Visible sin `imagen_1` (usa la imagen de reemplazo).
- Visible sin `descripcion_corta`.
- `precio_antes` menor o igual que `precio` (se ignora).

Lectura robusta: acepta TSV o CSV, BOM al inicio, decimales con punto o coma, `S/` delante del precio, `si`/`sí`/`Sí`, espacios sobrantes.

### 5.3 Salidas (generadas, nunca se editan a mano)

No se versionan (están en `.gitignore`): `npm run dev` y `npm run build` corren el sync antes (`predev`, `prebuild`), así nunca hay dos fuentes de verdad.

- `src/data/productos.json`: solo productos visibles, con `beneficios` como lista y URLs de imagen limpias.
- `src/data/categorias.json`: árbol categoría → subcategorías visibles, con conteo.
- `src/data/marcas.json`: marcas visibles, con conteo.
- `src/data/sync-info.json`: fecha de sincronización, origen (TSV local o URL) y avisos.

### 5.4 Otros datos

Todo sale de `referencia/ElChicoNaturista-anterior/` (no se inventa ningún dato de contacto):

| Archivo nuevo | Origen en el repositorio anterior | Contenido |
|---|---|---|
| `src/data/tienda.js` | `src/data/tienda.js` y `backend/app/tienda.py` | Nombre, lema, WhatsApp, dirección, horario, TikTok, LinkedIn, métodos de pago (texto), avisos del cintillo. Correo: `contacto@elchiconaturista.com` (D20) |
| `src/data/envio.json` | `backend/app/ubigeo.py` (constantes de costo) y `backend/app/config.py` | Provincia de Lima (`1501`) y Callao (`07`): S/ 10. Resto: S/ 15. Gratis desde S/ 120 |
| `public/datos/ubigeo.json` (generado con `npm run ubigeo` desde `data/ubigeo-inei-2022.csv`) | `backend/app/datos/ubigeo.csv` (INEI 2022: 25 departamentos, 196 provincias, 1891 distritos) y la tabla de tildes de `backend/app/ubigeo.py` | Departamento, provincia, distrito con código (52 KB). Archivo aparte que solo pide `/checkout` |
| `public/fonts/` | `public/fonts/*.woff2` | Hind (licencia OFL, permite uso comercial) y Amulya (licencia ITF/Fontshare: revisar antes de publicar) |
| Referencia de lógica | `src/alpine.js`, `src/lib/cloudinary.js`, `src/pages/catalogo.astro`, `src/pages/checkout.astro` | Se leen como guía; no se copian tal cual porque llamaban a la API |

No se copia nada más de `backend/`, ni `.env.example`, ni las páginas de `admin/` y `cuenta`.

---

## 6. Arquitectura y carpetas

```
Google Sheets (Excel Master)
  pestaña "Catálogo web" --CSV publicado--> scripts/sync-catalogo.mjs --valida--> src/data/*.json
                                                                                     |
Astro (output: static) + Alpine.js (build CSP) <-------------------------------------+
  portada, catálogo, ficha, carrito, checkout
        +--> fotos: Cloudinary (URL con transformaciones)
        +--> pedido: localStorage + enlace wa.me
        +--> (Fase 9, opcional) Apps Script: fila en hoja de pedidos + correo
GitHub Actions: pruebas en cada push (Fase 7) y, cada hora, baja el CSV y hace commit si cambió (Fase 8)
Cloudflare Pages (Fase 7): compila con cada push a main y publica en elchiconaturista.com
```

Principios:

- La web nunca consulta la hoja en vivo. El catálogo se compila dentro del sitio.
- Si los datos vienen mal, la compilación falla y queda publicada la versión anterior.
- Ninguna clave secreta en el código ni en el repositorio. En un sitio estático todo es público.

Estructura objetivo (se crea por fases):

```
El_Chico_Nati-StaticWeb/
  CLAUDE.md                 reglas permanentes para Claude Code
  PLAN-v2.md                este plan
  .gitignore                excluye -recursos/, referencia/, node_modules/, dist/, .env*
  .claude/
    agents/                 revisor-codigo, qa-navegador, revisor-seguridad
    skills/                 cerrar-fase, diseno-ecn, datos-catalogo
  -recursos/                originales (Master, TSV, plan v1, imágenes). NUNCA se sube
  referencia/               clon del repositorio anterior. NUNCA se sube
  data/
    catalogo-inicial.tsv    TSV limpio (solo columnas públicas), generado
  docs/
    fases.md                bitácora: qué se cerró en cada versión
    direccion-visual.md     dirección elegida en la Fase 2
    guia-equipo.md          cómo editar la hoja y publicar (Fase 7 y 8)
  prototipos/               HTML estáticos de la Fase 2
  scripts/
    preparar-datos.mjs      -recursos/*.tsv -> data/catalogo-inicial.tsv
    sync-catalogo.mjs       data/ o CATALOGO_URL -> src/data/*.json
  tests/                    node --test
  public/                   fuentes .woff2, logo, favicon, imagen de reemplazo
  src/
    components/  layouts/  pages/  lib/  data/  styles/global.css
  .github/workflows/        pruebas.yml (Fase 7), actualizar-catalogo.yml (Fase 8)
```

---

## 7. Diseño

### 7.1 Qué significa "boutique" aquí

Una tienda pequeña y curada, como una tienda de barrio bien cuidada frente a un supermercado:

- Pocos elementos a la vez y mucho espacio.
- Fotos grandes, una idea por pantalla.
- Textos cortos, sin avalancha de etiquetas, banners ni porcentajes de descuento.
- Precios claros y visibles, que son un punto fuerte del negocio.
- Sensación de producto cuidado y de confianza.

### 7.2 Qué tomar de las referencias (florayfauna.pe y medic-organic.com)

La mecánica, no el aspecto: agregar al carrito desde la tarjeta con cantidad, un producto estrella con botón directo en la portada, franja corta de beneficios, categorías con imagen y botón flotante de WhatsApp. No copiar su densidad.

### 7.3 Restricciones de marca

- Colores: salvia `#2F5D50` y jade `#7A9B87` no se cambian. Fondo base `#F7F7F7`. Café `#211E1E` solo en detalles pequeños.
- Todos los colores como variables en `:root` de `src/styles/global.css`. Ningún color escrito a mano en componentes.
- Contraste medido: blanco sobre salvia ≈ 7.5:1 (sirve para botones); blanco sobre jade ≈ 3.1:1 (no sirve para texto normal). Jade solo para detalles y texto grande.
- Fuentes servidas desde el sitio en `.woff2`, sin Google Fonts. Hind y Amulya son el punto de partida; la Fase 2 puede proponer otra combinación. Confirmar licencia de uso web de cada fuente antes de incluirla.
- Las fotos de producto tienen fondo blanco y escalas muy distintas (botella alta, galleta ancha). Dos reglas: el contenedor de la foto es blanco (o se usa `mix-blend-mode: multiply` sobre un tono claro) para que no se vea un recuadro, y se normaliza el encuadre con transformaciones de Cloudinary (`e_trim` + `c_pad` con margen fijo) para que todos los productos se vean del mismo tamaño visual.
- Logo: círculo con montañas y hoja. Usar la versión limpia de la Fase 3.
- Portada: composición colectiva con las fotos reales de los productos (empaques recortados sobre fondo claro, con escala y ritmo cuidados), no una foto de ambiente ni una imagen generada. Es temporal: cuando haya fotos propias se reemplaza.
- Lo que ya se probó en el sitio anterior (según su `global.css`): estructura con reglas finas "como etiqueta impresa", sin sombras ni tarjetas flotantes, Hind en titulares y Amulya en texto. La Fase 2 parte de ahí y decide qué se queda.

### 7.4 Movimiento

El cliente quiere animaciones; la regla es que cada una tenga un motivo.

- **Un solo momento orquestado** en la portada al cargar (por ejemplo, la entrada del producto estrella). No animar cada sección al hacer scroll.
- **Transición foto → ficha**: la foto de la tarjeta se transforma en la foto de la ficha con View Transitions entre documentos. Es la firma de la tienda.
- **Movimiento que responde a una acción**: agregar al carrito (el contador confirma), abrir el panel del carrito, cambiar filtros (la grilla reacomoda), confirmar pedido.
- Todo con `prefers-reduced-motion`: sin movimiento, el sitio funciona y se entiende igual.
- Solo `transform` y `opacity`. Nada que mueva el layout ni retrase el contenido.

### 7.5 Qué se evita (se ve genérico o hecho con IA)

- Fondo crema con serif de alto contraste y acento terracota; tarjetas idénticas con la misma sombra gris y gradientes decorativos.
- Etiquetas en mayúsculas espaciadas encima de cada título, numeración 01/02/03 si no hay secuencia, flechas "→" en cada botón.
- Una palabra del titular en otro color o en cursiva.
- Entradas "fade + slide-up" en cada sección y efectos hover en todas las tarjetas.
- Imágenes de stock o generadas que muestren productos que no se venden.
- Textos de relleno ("Descubre la magia de lo natural"). El texto dice qué es y qué hacer.

### 7.6 Cómo se usa la skill de diseño

En las fases con interfaz (2, 4, 5, 6) se cargan juntas la skill `frontend-design` y la skill del proyecto `diseno-ecn`. En la Fase 2: primero plan de 3 direcciones (paleta con nombres y hex, tipografías y roles, layout con bocetos ASCII, principios), revisión contra este brief y la lista 7.5, y recién después prototipos. Se toman capturas para criticar el resultado antes de mostrarlo.

---

## 8. Páginas y reglas funcionales

| Ruta | Qué hace |
|---|---|
| `/` | Portada boutique: producto estrella (un `destacado`), beneficios breves, categorías, destacados, más vendidos y resto. Cada bloque aparece solo si tiene productos |
| `/catalogo` | Búsqueda, filtros por categoría, subcategoría, marca y precio, orden. Todo en el navegador. El estado del filtro va en la URL (`?cat=abarrotes&marca=fit-rex`) para compartir y volver atrás |
| `/producto/[slug]` | Galería, descripción, beneficios, modo de uso (si existe), cantidad, agregar al carrito, consultar por WhatsApp. Generadas en la compilación |
| Panel lateral y `/carrito` | Cantidades, quitar, "te faltan S/ X para envío gratis" |
| `/checkout` | Nombre, teléfono, dirección, referencia, departamento, provincia y distrito en cascada, nota. Envío calculado al elegir distrito |
| 404 | Con rutas alternativas y buscador |
| Global | Cintillo de avisos, buscador, contador de carrito, botón flotante de WhatsApp, aviso al agregar, aviso de suplementos en el pie |

Reglas que ya estaban:

- Un producto activo con precio se vende siempre. No existe el estado "agotado".
- Cerca del botón de confirmar: "Confirmaremos disponibilidad y tiempo de entrega por WhatsApp".
- Nunca perder una venta: si algo falla, igual se abre WhatsApp. Si el navegador bloquea la apertura, se muestra un botón visible "Abrir WhatsApp".
- Número de pedido web `ECN-AAMMDD-NNNN`; los manuales del Master usan `ECN-M-AAMMDD-NNNN`.
- Carrito en `localStorage` con clave `ecn.carrito.v2`, sincronizado entre pestañas. Último pedido en `ecn.pedidos.v1`.
- Fechas `AAAA-MM-DD`. Precios `S/ 46.00`.
- Aviso de suplementos en el pie: no son medicamentos y no reemplazan una alimentación variada.

Formato del mensaje de WhatsApp:

```
Hola El Chico Naturista, quiero confirmar mi pedido ECN-261015-4821.

• 2 × Leche de Almendras (1 L) — S/ 46.00

Subtotal: S/ 46.00
Envío: S/ 10.00
Total: S/ 56.00

Nombre: ...
Teléfono: ...
Dirección: ...
Distrito: Los Olivos, Lima, Lima
Referencia: ...
Nota: ...
```

Vacíos que v2 cierra:

| Tema | Regla |
|---|---|
| Qué guarda el carrito | Solo `codigo` y `cantidad`. Precio y nombre se leen siempre del catálogo actual. Si un producto ya no es visible, se quita y se avisa una vez |
| Cantidad | Entre 1 y 99 por producto |
| Teléfono | 9 dígitos que empiezan con 9; acepta `+51` y espacios |
| Fecha del número de pedido | Hora de Lima (`America/Lima`). Los 4 dígitos con `crypto.getRandomValues` |
| Cuándo se vacía el carrito | Al pulsar "Enviar pedido por WhatsApp" se guarda el pedido como último pedido, se vacía el carrito y se muestra una pantalla de confirmación con el código, el botón "Abrir WhatsApp" otra vez y "Recuperar mi carrito" |
| Datos personales | No se guardan salvo que el cliente marque "Recordar mis datos en este celular" (desmarcado por defecto). El último pedido guarda productos y total, no nombre ni dirección |
| Sin JavaScript | La ficha tiene un enlace "Pedir por WhatsApp" armado en la compilación, que funciona sin JS |
| Privacidad | Aviso corto en el checkout: para qué se usan los datos y que se envían por WhatsApp |
| Registro en el Master | El código web va en "Código de pedido" de "Importar pedidos"; el `N° pedido` (V-0NN) lo pone el equipo; el envío cobrado va como línea `ENVIO` con su precio real |

---

## 9. Agentes, skills y cierre de fase

### 9.1 Qué hay en `.claude/`

| Tipo | Nombre | Para qué |
|---|---|---|
| Agente | `revisor-codigo` | Errores, reglas de `CLAUDE.md`, colores fuera de tokens, lógica de precios y envío, pruebas |
| Agente | `qa-navegador` | Pruebas con clics reales en Chrome a 390 px y 1280 px, capturas, consola, desbordes, accesibilidad básica |
| Agente | `revisor-seguridad` | Secretos, datos privados del Master, XSS, CSP, enlaces externos, permisos de GitHub Actions, Apps Script |
| Skill | `cerrar-fase` | Lista de cierre: build, pruebas, agentes según la matriz, bitácora, visto bueno, commit y tag |
| Skill | `diseno-ecn` | Brief de marca del proyecto; se carga junto a `frontend-design` |
| Skill | `datos-catalogo` | Cómo actualizar datos, precedencia, columnas y errores de sincronización |

### 9.2 Matriz de revisión antes de cada commit

R = revisa y puede bloquear. — = no aplica.

| Fase | revisor-codigo | qa-navegador (390 / 1280) | revisor-seguridad |
|---|---|---|---|
| 1 Preparación | R: config, scripts, `preparar-datos` | R: página vacía carga sin errores | R: `.gitignore`, nada de `-recursos/` ni `stock` en lo que se sube |
| 2 Dirección visual | — | R: capturas de cada propuesta | R: sin fuentes ni scripts externos |
| 3 Base y datos | R: sync, validación, pruebas | R: layout base y página de tokens | R: JSON sin columnas prohibidas |
| 4 Catálogo y fichas | R | R | R: escape de textos de la hoja |
| 5 Carrito y checkout | R: cálculos y mensaje | R: pedido completo de punta a punta | R: entradas, `localStorage`, enlace wa.me |
| 6 Movimiento y pulido | R | R: reduced motion, Lighthouse | R: CSP final |
| 7 Publicación | R: workflow de pruebas, configuración del hosting | R: sitio publicado | R: permisos del workflow, `robots`, dominio, variables del hosting |
| 8 Actualización automática | R | R: cambio real en la hoja visible en la web | R: permisos `contents: write` acotados, CSV publicado solo de la pestaña |
| 9 Apps Script (opcional) | R | R: pedido llega a la hoja y al correo | R: inyección de fórmulas, spam, privacidad |

Regla: con un hallazgo bloqueante no hay commit. Se corrige y el agente que lo marcó revisa de nuevo.

### 9.3 Convención de commit

- Mensaje: `ECN-v0.N <descripción corta>`, por ejemplo `ECN-v0.4 catálogo, filtros y fichas de producto`.
- Correcciones dentro de una versión ya cerrada: `ECN-v0.N.1 <descripción>`.
- Commits automáticos del flujo de la Fase 8: `ECN-datos catálogo actualizado desde la hoja`.
- Tag git `ECN-v0.N` en el commit de cierre. Rama `main`.
- Se hace commit y push solo con tu visto bueno al cerrar la fase.

---

## 10. Fases

Cada tarea tiene ID, qué se hace y cómo se verifica. "Listo cuando" es la condición para correr `/cerrar-fase`.

### Versión 0.0: plan y estructura (este paso)

- `PLAN-v2.md`, `CLAUDE.md`, `.gitignore`, `.claude/agents/`, `.claude/skills/`, `docs/fases.md`.
- `git init`, rama `main`, remoto `origin` (tarea 1.1 adelantada). Repositorio anterior clonado en `referencia/` (tarea 1.7 adelantada).
- Commit: `ECN-v0.0 plan v2, CLAUDE.md, agentes y skills`.

### Fase 1 (v0.1). Preparación

| ID | Tarea | Verificación |
|---|---|---|
| 1.1 | `git init`, rama `main`, remoto `origin` (hecho en v0.0) | `git remote -v` muestra el repo |
| 1.2 | Revisar `.gitignore` antes de cada `git add` | `git status` no lista nada de `-recursos/` ni de `referencia/` |
| 1.3 | Crear Astro (`output: 'static'`), Alpine.js build CSP, TypeScript no estricto | `npm run dev` y `npm run build` sin errores |
| 1.4 | `scripts/preparar-datos.mjs`: une `-recursos/catalogo-ECN-productos.tsv` y `descripciones-faltantes.tsv` (solo celdas vacías) y escribe `data/catalogo-inicial.tsv` con las columnas de 5.1, aplicando D4, D6 y `activo = no` a ECN-014/015/016 (ECN-022 queda activo, D2) | El TSV de salida no tiene `stock`; tiene 29 filas; 23 visibles; ECN-004 tiene el frente en `imagen_1` |
| 1.5 | Marcar las descripciones que vienen del borrador con una lista en `data/descripciones-pendientes.txt` (códigos) | 11 códigos listados |
| 1.6 | Scripts npm: `dev`, `build`, `preview`, `test`, `preparar-datos` (`sync` se agrega en la Fase 3, junto con su script) | Todos corren |
| 1.7 | Repositorio anterior clonado en `referencia/ElChicoNaturista-anterior/` (hecho en v0.0). Copiar a `public/fonts/` los `.woff2` de Hind y Amulya | `git check-ignore referencia` lo confirma; fuentes presentes |

Listo cuando: build vacío funciona y el revisor de seguridad confirma que nada privado entra al repo.

### Fase 2 (v0.2). Dirección visual

| ID | Tarea | Verificación |
|---|---|---|
| 2.1 | Cargar `frontend-design` y `diseno-ecn`. Escribir 3 direcciones (paleta 4–6 hex con nombres, tipografías, layout ASCII, principios) | Documento en `docs/direccion-visual.md` |
| 2.2 | Revisar cada dirección contra 7.5 y cambiar lo que suene a plantilla, diciendo qué y por qué | Sección "Revisión" en el mismo documento |
| 2.3 | Prototipos HTML de portada y ficha por dirección en `prototipos/`, con 6 productos reales (fotos de Cloudinary, precios del TSV limpio). Mobile primero. La portada de cada dirección resuelve a su manera la composición colectiva de productos reales | Se abren sin servidor; ninguna usa imágenes generadas |
| 2.4 | Prototipar el momento de movimiento principal y la transición foto → ficha en la dirección favorita | Se ve en Chrome; con reduced motion no anima |
| 2.5 | Capturas a 390 y 1280 de cada propuesta (agente QA) y autocrítica | Capturas revisadas |
| 2.6 | Tú eliges una dirección | Elección anotada en `docs/direccion-visual.md` |

Listo cuando: hay una dirección elegida con tokens definidos (colores, tipografía, escala, espaciado, radios, sombras, curvas y duraciones de movimiento).

### Fase 3 (v0.3). Base técnica y datos

| ID | Tarea | Verificación |
|---|---|---|
| 3.1 | `global.css` con todos los tokens de la dirección elegida | `grep` de `#` hexadecimal fuera de `global.css` = 0 resultados en `src/` |
| 3.2 | Fuentes `.woff2` locales con `font-display: swap` y precarga de la principal | Sin peticiones a dominios de fuentes |
| 3.3 | Logo limpio (máscara circular, PNG/WebP con transparencia) y favicon | Se ve bien sobre fondo claro y oscuro |
| 3.4 | Imagen de reemplazo para productos sin foto, en la línea visual elegida | Componente `src/components/SinFoto.astro` (SVG con currentColor, toma los tokens) |
| 3.5 | `scripts/sync-catalogo.mjs` según 5.2 y 5.3 | `npm run sync` genera 23 productos, 3 categorías, 8 subcategorías, 6 marcas |
| 3.6 | Pruebas de sync: cada error de 5.2 tiene un caso que falla con mensaje legible | `npm test` en verde |
| 3.7 | `src/lib/cloudinary.js`: URL con `f_auto,q_auto`, ancho, `e_trim`, `c_pad`; `srcset` | Prueba unitaria de la URL |
| 3.8 | `tienda.js`, `envio.json`, `ubigeo.json` desde `referencia/` (sección 5.4) | Valores iguales al repositorio anterior; 1891 distritos; Los Olivos y Callao = S/ 10, Huaral = S/ 15 |
| 3.9 | Layout base: cabecera, pie con aviso de suplementos, cintillo | QA a 390 y 1280 |

Listo cuando: `npm run sync && npm test && npm run build` en verde y los JSON no contienen columnas prohibidas.

### Fase 4 (v0.4). Catálogo y fichas

| ID | Tarea | Verificación |
|---|---|---|
| 4.1 | Tarjeta de producto: foto normalizada, nombre, presentación, precio, agregar con cantidad | Sin texto de stock; foto sin recuadro visible |
| 4.2 | Portada con bloques condicionales | Si se quitan los destacados del TSV de prueba, el bloque desaparece |
| 4.3 | `/catalogo`: búsqueda sin tildes (`cafe` encuentra "Café"), filtros, orden, estado en la URL | Pruebas con clics a 390 y 1280; atrás del navegador conserva filtros |
| 4.4 | `/producto/[slug]`: galería con 1 o 2 fotos, secciones vacías ocultas, enlace WhatsApp sin JS | ECN-013 (sin modo de uso) no muestra la sección |
| 4.5 | Transición foto → ficha con View Transitions | Funciona en Chrome; en otro navegador navega normal |
| 4.6 | 404 con buscador y categorías | Ruta inexistente muestra la 404 |
| 4.7 | Títulos y descripciones por página | Cada ficha tiene `<title>` y `description` propios |

Listo cuando: se recorre todo el catálogo en celular y escritorio sin errores en consola, sin desbordes y sin ninguna mención de stock.

### Fase 5 (v0.5). Carrito y checkout por WhatsApp

| ID | Tarea | Verificación |
|---|---|---|
| 5.1 | Store del carrito (Alpine) con las reglas de la sección 8 | Prueba: precio cambiado en el JSON se refleja en un carrito ya guardado |
| 5.2 | Sincronización entre pestañas | Agregar en una pestaña actualiza el contador en otra |
| 5.3 | Panel lateral y `/carrito` | Teclado: abre, recorre y cierra; el foco vuelve al botón |
| 5.4 | `/checkout`: formulario, validación, cascada de ubigeo cargada solo aquí | Errores claros junto a cada campo |
| 5.5 | Cálculo de envío por zona y envío gratis | Pruebas unitarias: Los Olivos (S/ 10), Callao (S/ 10), Huaral (S/ 15), Arequipa (S/ 15), subtotal S/ 119.99 (cobra) y S/ 120.00 (gratis) |
| 5.6 | Número de pedido y mensaje | Prueba unitaria del texto exacto de la sección 8 |
| 5.7 | Apertura de WhatsApp con respaldo y pantalla de confirmación | Con ventanas emergentes bloqueadas aparece "Abrir WhatsApp" |
| 5.8 | "Recordar mis datos" opcional y aviso de privacidad | Desmarcado: `localStorage` no guarda nombre ni dirección |

Listo cuando: un pedido de prueba completo abre WhatsApp con el mensaje correcto y el total coincide con el carrito en los 4 escenarios de envío.

### Fase 6 (v0.6). Movimiento, accesibilidad y rendimiento

| ID | Tarea | Verificación |
|---|---|---|
| 6.1 | Momento orquestado de la portada y movimientos de respuesta (sección 7.4) | Revisión con `diseno-ecn`: nada animado sin motivo |
| 6.2 | `prefers-reduced-motion` en todo | Con la preferencia activa no hay animaciones |
| 6.3 | Foco visible, contraste AA, textos alternativos, etiquetas de formulario | Revisión manual y Lighthouse Accesibilidad ≥ 95 |
| 6.4 | Rendimiento: imágenes al ancho justo, carga diferida, JS mínimo | Lighthouse móvil Rendimiento ≥ 90 en portada, catálogo y ficha |
| 6.5 | CSP en `<meta>` sin `unsafe-eval` ni `unsafe-inline` en scripts; `img-src` limitado a Cloudinary y el propio sitio | Consola sin violaciones de CSP |
| 6.6 | `robots.txt` con `Disallow: /` y `noindex` mientras no sea v1.0 | Archivo presente |

### Fase 7 (v0.7). Publicación manual

| ID | Tarea | Verificación |
|---|---|---|
| 7.1 | En Cloudflare, crear el proyecto de Pages y conectarlo al repo de GitHub. Lo haces tú desde el panel; no se pega ninguna clave en la conversación | El proyecto aparece en Cloudflare |
| 7.2 | Configurar en Pages: comando `npm run sync && npm run build`, carpeta `dist`, variable `NODE_VERSION = 22` | Push a `main` publica en `*.pages.dev` |
| 7.3 | Workflow `pruebas.yml`: `npm ci` y `npm test` en cada push, permisos `contents: read` | Un test roto se ve en rojo en GitHub |
| 7.4 | Vincular `elchiconaturista.com` como dominio personalizado (ya está en Cloudflare, así que el DNS se configura solo) con HTTPS; `www` redirige al dominio principal | El sitio abre en el dominio con candado |
| 7.5b | Encabezados de seguridad en `public/_headers` (CSP, `X-Content-Type-Options`, `Referrer-Policy`), que Cloudflare Pages aplica | Los encabezados aparecen en la respuesta |
| 7.5 | Flujo manual: editar la hoja, descargar la pestaña como TSV a `data/catalogo-inicial.tsv`, `npm run sync`, commit | Un cambio de precio de prueba se ve publicado |
| 7.6 | `docs/guia-equipo.md`, primera parte: cómo editar la pestaña y qué columnas no tocar | Revisada por ti |

Límite a tener en cuenta: el plan gratuito de Cloudflare Pages permite 500 compilaciones al mes. Por eso la Fase 8 solo hace commit (y por tanto compila) cuando la hoja cambió.

### Fase 8 (v0.8). Actualización automática desde la hoja

| ID | Tarea | Verificación |
|---|---|---|
| 8.1 | Publicar solo la pestaña "Catálogo web" como CSV (Archivo, Compartir, Publicar en la web) | La URL devuelve solo esas columnas |
| 8.2 | Guardar la URL como variable del repositorio `CATALOGO_URL` en GitHub | No aparece en el código |
| 8.3 | Workflow `actualizar-catalogo.yml`: cada hora y con botón manual (`workflow_dispatch`), baja el CSV, lo valida con el mismo `sync`, y si es válido y distinto de `data/catalogo-inicial.tsv` hace commit `ECN-datos catálogo actualizado desde la hoja`. Permisos: solo `contents: write` | Un cambio en la hoja se ve en la web en menos de 2 horas |
| 8.4 | Si el CSV no cambió, no hay commit (no gasta compilaciones del hosting). Si no es válido, el workflow falla, no hay commit y queda publicada la versión anterior | El log lo indica en ambos casos |
| 8.5 | `docs/guia-equipo.md`, segunda parte: cuánto tarda, cómo forzar la actualización, qué hacer si el workflow falla | Revisada por ti |

Nota: GitHub desactiva los flujos programados de repos públicos tras 60 días sin actividad en el repo. La guía explica cómo reactivarlo con un clic.

### Fase 9 (v0.9, opcional, pendiente de visto bueno). Registro de pedidos con Apps Script

Un Google Apps Script publicado como aplicación web, bajo una cuenta del negocio. Al confirmar, la página le envía el pedido en segundo plano y el script:

1. Agrega filas a una hoja privada de pedidos web, separada del Master. Una pestaña con una fila por pedido y otra con una fila por producto, con las mismas columnas de "Importar pedidos" del Master (N° pedido, Fecha pedido, Fecha pago, Estado, Cliente, Código, Producto, Cantidad, Precio unitario, Código de pedido), para copiar y pegar al confirmar el pago.
2. Envía un correo al equipo con el resumen.

Reglas: WhatsApp se abre siempre aunque el script falle (el envío al script no se espera). Campo trampa contra spam y validación de largo. Neutralizar valores que empiecen con `=`, `+`, `-` o `@`. La URL del script no es secreta, pero no da acceso a nada más que agregar filas. Confirmar en la documentación de Google la cuota diaria de correos de la cuenta que se use.

### Versión 1.0. Lanzamiento

Dominio `elchiconaturista.com` activo, `robots.txt` abierto, `sitemap.xml`, quitar `noindex`, prueba final completa de los tres agentes sobre el sitio publicado. Commit `ECN-v1.0 lanzamiento`.

---

## 11. Tareas en Google Sheets (no son código)

| ID | Tarea | Antes de |
|---|---|---|
| S1 | Crear la pestaña "Catálogo web" con las columnas de 5.1; nombre, presentación y precio por fórmula desde Productos (por código) | Fase 8 (en la Fase 7 se puede trabajar con el TSV) |
| S2 | Reescribir la pestaña Inicio: el stock se controla aquí, los pedidos entran por WhatsApp y se registran a mano en "Importar pedidos". Quitar las líneas que mandan a "la web" a subir stock, exportar CSV o registrar ventas en el panel | Fase 7 |
| S3 | Definir quién edita "Catálogo web" y quién revisa antes de que se publique | Fase 8 |
| S4 | Verificar las 11 descripciones de `descripciones-faltantes.tsv` contra la etiqueta (especialmente ECN-022, 023, 024, 025, 026, que ya están o estarían visibles) | Fase 4 |
| S5 | Marcar `mas_vendido` (propuesta D11) y revisar `destacado` (hoy ECN-001 y ECN-005) | Fase 4 |
| S6 | Corregir en la pestaña D4 (fotos ECN-004) y D6 ("Cuidado personal"); quitar "Inactivo en la web" de ECN-022 en Productos (D2) | Fase 7 |
| S8 | Registrar el envío cobrado en la línea `ENVIO` de cada pedido (S/ 10, S/ 15 o S/ 0 si fue gratis) | Desde el primer pedido web |
| S7 | Revisar las afirmaciones de salud de los beneficios (D10) | v1.0 |

---

## 12. Riesgos

- **Productos sin stock que se venden igual.** Decisión del negocio. Se mitiga con el aviso de disponibilidad y avisando pronto al cliente si hay demora.
- **Costos expuestos por error.** Solo se publica la pestaña "Catálogo web". El validador rechaza columnas prohibidas. Si preocupa, mover el catálogo a un archivo aparte que lea el Master con `IMPORTRANGE`.
- **Repo público.** Cualquier archivo subido es visible. `-recursos/` está en `.gitignore` y el revisor de seguridad lo verifica en cada fase. Si algún día se sube algo privado por error, no basta con borrarlo: hay que reescribir el historial.
- **Afirmaciones de salud.** Varios beneficios publicados prometen efectos en la salud. Conviene revisarlos con el proveedor o un especialista. Se mantiene el aviso del pie.
- **Descripciones borrador.** Se verifican antes de publicar (S4).
- **Una foto por producto y fondo blanco.** Para un estilo boutique las fotos pesan mucho. La normalización de Cloudinary ayuda; más fotos cuando existan.
- **Manipulación de precios.** El total lo calcula el navegador. Se acepta porque el pago se confirma por WhatsApp.
- **Colisión de números de pedido.** Fecha más 4 dígitos al azar: improbable pero posible. Revisar al registrar.
- **Retraso de la hoja publicada.** Google puede tardar unos minutos en reflejar cambios en el CSV publicado.
- **Flujo programado desactivado** a los 60 días sin actividad (Fase 8).
- **Límite de compilaciones.** Cloudflare Pages gratis: 500 al mes. La Fase 8 solo compila cuando la hoja cambió; con uso normal queda muy por debajo.
- **Repositorio anterior.** Fernando lo hizo público temporalmente para esta revisión y lo vuelve a poner privado. La copia local en `referencia/` sigue sirviendo.
- **Navegadores sin View Transitions.** La navegación funciona igual, sin la animación.
- **Requisitos legales de venta en línea en Perú** (por ejemplo, libro de reclamaciones virtual y política de datos personales). Confirmar con quien lleve la parte legal o contable antes de v1.0.
- **Pruebas.** En el proyecto anterior se verificó mucho por API y poco con clics. Aquí el agente QA prueba en navegador desde la Fase 1.

---

## 13. Preguntas

### 13.1 Respondidas (15 de octubre de 2026)

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | ¿ECN-022 se publica y cómo se llama? | Se publica como "Tinte para Cabello Castaño Seminatural" |
| 2 | Tarifas de envío | S/ 10 Lima y Callao, S/ 15 provincias, gratis desde S/ 120. Se ajustará después |
| 3 | Repositorio anterior | https://github.com/FlaPalacios/ElCHichoNaturista |
| 4 | Dominio | elchiconaturista.com, ya comprado. Hosting probable: Vercel. Por ahora local |
| 5 | Portada | Composición colectiva con los productos reales, sin apariencia de IA. Temporal |

| 6 | Hosting | Cloudflare Pages (el dominio ya está en Cloudflare) |
| 7 | Correo | `contacto@elchiconaturista.com` |

### 13.2 Abiertas

Ninguna por ahora.
