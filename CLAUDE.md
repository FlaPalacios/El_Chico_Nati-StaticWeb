# El Chico Naturista: web estática

Tienda boutique de productos naturales (Lima, Perú). Catálogo + carrito que termina en un pedido por WhatsApp. Sin backend.

Antes de cualquier tarea, lee `PLAN-v2.md` y trabaja solo en la fase activa (ver `docs/fases.md`).

## Reglas permanentes

- Todo el texto visible y los comentarios van en español de Perú.
- Web estática: sin backend, sin base de datos, sin llamadas a servicios con clave.
- Ninguna clave secreta en el código, en el repositorio ni en la conversación. Si hace falta una, se guarda como secreto o variable de GitHub y se pide a Fernando que la pegue él.
- El repositorio es público. `-recursos/` (Excel Master con costos, clientes y proveedores; TSV con stock) y `referencia/` (clon del repositorio anterior con backend) nunca se suben. Antes de cada `git add`, revisar `git status`.
- Datos de la tienda (WhatsApp, dirección, horario, redes, avisos), tarifas de envío, ubigeo y fuentes salen de `referencia/ElChicoNaturista-anterior/` según `PLAN-v2.md` sección 5.4. De ese repo no se copia nada del backend ni del panel.
- Publicado en `https://elchiconaturista.com` (Cloudflare Workers con archivos estáticos, `wrangler.jsonc`; `www` redirige al dominio principal). Cada push a `main` publica solo. Sigue con `noindex` hasta la v1.0. Correo: `contacto@elchiconaturista.com`.
- Precedencia de datos: el Excel Master manda sobre `catalogo-ECN-productos.tsv`, y este sobre `descripciones-faltantes.tsv`. No inventar datos: si falta uno, se deja vacío y se pregunta.
- Nunca mostrar stock ni "agotado". Un producto con `activo = si` y precio > 0 se puede comprar siempre.
- Prohibido en el repo y en `src/data/`: stock, costo, proveedor, margen, compras, ventas, nombres de clientes.
- Los datos salen de `data/` o de `CATALOGO_URL` mediante `scripts/sync-catalogo.mjs`. No editar a mano `src/data/productos.json`, `categorias.json`, `marcas.json` ni `sync-info.json`.
- Los colores viven solo como variables en `:root` de `src/styles/global.css`. Prohibido escribir colores a mano en componentes. Salvia `#2F5D50` y jade `#7A9B87` no se cambian. Texto blanco solo sobre salvia, nunca sobre jade.
- Fuentes e imágenes locales, salvo las fotos de productos en Cloudinary (URL con `f_auto,q_auto`).
- Precios en formato `S/ 46.00`. El total se calcula en el navegador.
- Si algo falla en el checkout, igual se debe abrir WhatsApp con el pedido.
- Todo texto que viene de la hoja o del cliente se inserta escapado: en Astro `{expr}`. Prohibido `set:html`, `x-html` e `innerHTML` con esos datos; lo que se arme en el navegador usa `<template>` + `textContent`.
- Fuentes: solo con licencia OFL u otra que permita redistribuir, con su archivo de licencia al lado.
- Interactividad con scripts de módulo pequeños y delegación de eventos (sin framework). Alpine se retiró en la Fase 6 porque no se usaba. Nada de `eval`, `new Function` ni manejadores en atributos (`onclick=`): la CSP los bloquea.
- Movimiento solo con `transform` y `opacity`, siempre con alternativa para `prefers-reduced-motion`.

## Diseño

- Para cualquier trabajo de interfaz, cargar las skills `frontend-design` y `diseno-ecn` (esta última es el brief de la marca).
- Nada genérico ni con apariencia de plantilla generada: ver la lista "Qué se evita" en `PLAN-v2.md` sección 7.5.
- Se avanza paso a paso: primero plan y revisión contra el brief, después código, después capturas y autocrítica.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local de desarrollo |
| `npm run preparar-datos` | `-recursos/*.tsv` → `data/catalogo-inicial.tsv` (solo columnas públicas) |
| `npm run sync` | `data/` o `CATALOGO_URL` → `src/data/*.json`, con validación |
| `npm test` | Pruebas con `node --test` |
| `npm run build` | Compila el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` en local para el agente QA |

(`sync` se agrega en la Fase 3; el resto existe desde la Fase 1. Entorno: Windows, Node ≥ 22.12, npm. Astro 7.3.5 fijado en versión exacta; la CSP la genera Astro (`security.csp` en `astro.config.mjs`).)

## Carpetas

```
.claude/agents/    revisor-codigo, qa-navegador, revisor-seguridad
.claude/skills/    cerrar-fase, diseno-ecn, datos-catalogo
-recursos/         originales privados (ignorado por git)
referencia/        clon del repositorio anterior (ignorado por git)
data/              TSV limpio que alimenta el sync
docs/              fases.md (bitácora), direccion-visual.md, guia-equipo.md
prototipos/        HTML de la Fase 2
scripts/           preparar-datos.mjs, sync-catalogo.mjs
tests/             pruebas node --test
public/            fuentes, logo, favicon, imagen de reemplazo
src/               components, layouts, pages, lib, data, styles
```

## Cierre de fase

- Al terminar una fase se usa la skill `/cerrar-fase N`. Ejecuta build y pruebas, lanza los agentes que indica la matriz de `PLAN-v2.md` sección 9.2 y consolida sus informes.
- Con un hallazgo bloqueante no hay commit.
- Commit y push solo con el visto bueno de Fernando. Mensaje: `ECN-v0.N <descripción corta>` (fase N = v0.N). Tag `ECN-v0.N`. Rama `main`.
- Antes de dar algo por terminado: `npm run build` sin errores y prueba en navegador a 390 px y 1280 px.
