# Guía del equipo: catálogo de la web

Para quien actualiza productos, precios y fotos de elchiconaturista.com. No hace falta saber programar.

## Cómo funciona

La web no tiene panel ni base de datos. Todo lo que muestra sale de una sola pestaña de la hoja de Google, **"Catálogo web"**: una fila por producto. Cuando esa pestaña cambia, la web se vuelve a armar y en unos minutos se ve el cambio.

Los pedidos no pasan por la web: el cliente arma su carrito y lo envía por WhatsApp con un código como `ECN-261016-4103`. Ese código se copia en "Importar pedidos" del Master, en la columna "Código de pedido".

La web nunca muestra stock ni "agotado". Un producto activo con precio siempre se puede pedir; si no hay, se avisa por WhatsApp al confirmar.

## Qué se puede tocar en "Catálogo web"

| Columna | Qué poner | Cuidado |
|---|---|---|
| `activo` | `si` o `no` | Con `no` el producto y su página salen de la web en la siguiente actualización. Si alguien lo tenía en el carrito, se le quita con un aviso |
| `precio_antes` | Precio anterior, solo si hay oferta | Tiene que ser mayor que el precio; se muestra tachado |
| `destacado` | `si` o `no` | Los destacados salen primero y en la portada |
| `mas_vendido` | `si` o `no` | Según las ventas del Master |
| `descripcion_corta` | Una frase, máximo 140 caracteres | Es lo que se ve en la tarjeta del producto |
| `descripcion_larga`, `modo_uso` | Texto libre | Pueden quedar vacíos: la sección no aparece |
| `beneficios` | Hasta 4, separados con `\|` | Ejemplo: `Sin lactosa \| Sin azúcar añadida`. Nada de promesas de curación |
| `imagen_1`, `imagen_2` | Enlace de Cloudinary | `imagen_1` es el frente del empaque. Ver "Fotos" |

**Vienen solas (fórmula desde la pestaña Productos):** `nombre`, `presentacion` y `precio`. Para cambiar un precio, se cambia en Productos, columna "Precio en la web", no aquí.

**No se cambian nunca una vez publicado el producto:** `codigo` (`ECN-001`…) y `slug` (la dirección de la página, por ejemplo `leche-de-almendras`). Si se cambia el slug, los enlaces que ya compartieron dejan de funcionar.

**Categoría, subcategoría y marca:** se escriben igual que en las demás filas, con su `_slug` al lado (minúsculas, sin tildes, guiones en vez de espacios: `Cuidado personal` → `cuidado-personal`). Si no calzan, la web no se actualiza y avisa el error.

**Nunca en esta pestaña:** stock, costos, proveedor, margen, ventas ni datos de clientes. La pestaña es pública. Si alguna columna con esos nombres aparece, la web se niega a actualizarse.

## Producto nuevo

1. Darle el siguiente código libre en Productos (los códigos no se reutilizan).
2. Agregar su fila en "Catálogo web" con `activo` = `si`, categoría, marca, descripción corta y al menos `imagen_1`.
3. Revisar que tenga precio en Productos: sin precio no aparece (no da error, solo queda oculto).

## Fotos

- Se suben a la cuenta de Cloudinary de la tienda y se copia el enlace que da Cloudinary (empieza con `https://res.cloudinary.com/deaq5dfwt/image/upload/`). Otros enlaces (Drive, Instagram) no se aceptan.
- Mejor con fondo blanco y el producto centrado. La web recorta el blanco sobrante y las deja todas del mismo tamaño, sin tocar el original.

## Cómo se publica un cambio (por ahora)

Mientras no esté activa la actualización automática (Fase 8), el cambio lo publica Fernando:

1. Se edita la pestaña "Catálogo web".
2. Se descarga la pestaña como TSV (Archivo, Descargar, Valores separados por tabulaciones) y se reemplaza `data/catalogo-inicial.tsv` en el proyecto.
3. `npm run sync` revisa todo. Si hay un error, dice el código, la columna y el valor, por ejemplo: `ECN-031, columna precio: "cuarenta" no es un número`. Se corrige en la hoja y se repite.
4. Commit y push a GitHub. Cloudflare publica solo en 1 o 2 minutos.

Si algo falla, la web sigue mostrando la versión anterior: nunca queda caída ni con datos a medias.

Cuando esté la Fase 8, los pasos 2 a 4 los hará GitHub solo cada hora. Esa parte de la guía se agrega entonces.
