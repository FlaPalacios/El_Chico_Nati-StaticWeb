# Guía del equipo: tienda web

Para quien actualiza productos, registra pedidos y compras de elchiconaturista.com. No hace falta saber programar.

Todo vive en un solo archivo de Google Sheets: **"El Chico Naturista – Tienda web (administración)"**. El Master anterior ya no se usa.

## El archivo en un vistazo

En todas las pestañas: **encabezado verde = se escribe**, **encabezado gris = se calcula solo** (si alguien intenta escribir encima, Sheets avisa). Casi todo se elige de listas desplegables.

| Pestaña | Para qué |
|---|---|
| **Resumen** | Ventas, ganancia, saldo en caja, alertas, más vendidos y tabla por mes. No se escribe nada |
| **Productos** | Una fila por producto con todo: lo que muestra la web, el costo y el stock calculado |
| **Pedidos** | Una fila por producto vendido. Lo que se vende baja el stock y suma a las ventas |
| **Compras y ajustes** | Compras a proveedores (suben el stock) y mermas o ajustes (cantidad negativa) |
| **Caja** | Gastos, aportes y retiros de dinero |
| **Proveedores** | Contactos, mínimos de compra y total comprado |
| **Listas** | Las opciones de las listas desplegables: categorías, marcas, estados. Se agregan aquí |
| **Web (publicada)** | Copia automática de lo público de Productos. Es lo único que lee la web. No se toca |

La web nunca muestra stock ni "agotado". Un producto con "En la web" = `si` y precio se puede pedir siempre; si no hay, se avisa por WhatsApp al confirmar.

## Productos: qué se escribe

| Columna | Qué poner | Cuidado |
|---|---|---|
| Producto, Presentación, Precio web | Nombre, tamaño y precio en soles | Sin precio, el producto no aparece en la web (no da error) |
| Precio antes | Precio anterior, solo si hay oferta | Tiene que ser mayor que el precio; se muestra tachado |
| En la web | `si` o `no` | Con `no` el producto y su página salen de la web en la siguiente actualización |
| Destacado / Más vendido | `si` o `no` | Los destacados salen primero y en la portada. El Resumen muestra los más vendidos para decidir |
| Categoría, Subcategoría, Marca | De la lista | Si falta una opción, se agrega en Listas (con su slug) |
| Descripción corta | Una frase, máximo 140 caracteres | Es lo que se ve en la tarjeta del producto |
| Descripción larga, Modo de uso | Texto libre | Pueden quedar vacíos: la sección no aparece |
| Beneficios | Hasta 4, separados con `\|` | Ejemplo: `Sin lactosa \| Sin azúcar añadida`. Nada de promesas de curación |
| Imagen 1, Imagen 2 | Enlace de Cloudinary | Imagen 1 es el frente del empaque. Ver "Fotos" |
| Costo de lista, Stock mínimo, Aviso de vencimiento | Números | Solo para administración; nunca salen a la web |

**No se cambian nunca una vez publicado:** el Código (`ECN-001`…) y el Slug (la dirección de la página, por ejemplo `leche-de-almendras`). Si se cambia el slug, los enlaces que ya compartieron dejan de funcionar.

## Producto nuevo

1. Agregar una fila en Productos con el siguiente código libre (los códigos no se reutilizan).
2. Llenar nombre, presentación, precio, "En la web" = `si`, categoría, subcategoría, marca, slug, descripción corta y al menos Imagen 1.
3. El stock sale de las compras: registrar la compra en "Compras y ajustes".

## Registrar un pedido de la web

El cliente envía su pedido por WhatsApp con un código como `ECN-261016-4103`. En **Pedidos**, una fila por cada producto del mensaje:

- N° pedido (`V-015`, el siguiente), Código web (el del mensaje), fechas, estado, cliente, teléfono y distrito.
- Código del producto (de la lista), cantidad y precio unitario cobrado. El nombre, total, costo y ganancia salen solos.
- Una fila más con código `ENVIO` y el envío cobrado como precio (10, 15 o 0 si fue gratis).
- El estado se va actualizando: pendiente → coordinado → pagado → enviado → completado (o cancelado). Desde "coordinado" cuenta como venta y baja el stock.

**Pedido manual** (por WhatsApp directo, en persona, en una feria): igual que uno de la web, pero el Código web se deja **vacío**. El N° pedido ya lo identifica. Los códigos `ECN-M-...` de octubre son pedidos manuales del sistema anterior y se quedan como están.

**Si me equivoqué al registrarlo:** se corrige la celda, o se borran sus filas completas (clic derecho en el número de fila, "Eliminar fila"). Se puede borrar cualquier fila de datos: las fórmulas están en el encabezado y no se pierden. El stock, las ventas y la caja se recalculan solos.

**Si el pedido existió pero el cliente se arrepintió:** no se borra; se cambia el estado a `cancelado`. Deja de contar como venta, el stock vuelve y queda el historial.

## Registrar una compra

En **Compras y ajustes**, una fila por producto: fecha de pago, tipo `Compra`, N° de compra, estado (`Pedido` mientras no llega, `Recibido` al llegar), código, cantidad y **total pagado** por esa línea. El costo unitario se calcula solo. Para productos que vencen, poner la fecha de vencimiento del lote: el Resumen avisa cuando falta poco.

Mermas (algo se dañó o venció) y ajustes de conteo van en la misma pestaña con tipo `Merma` o `Ajuste` y cantidad negativa (o positiva si sobró).

## Fotos

- Se suben a la cuenta de Cloudinary de la tienda y se copia el enlace que da Cloudinary (empieza con `https://res.cloudinary.com/deaq5dfwt/image/upload/`). Otros enlaces (Drive, Instagram) no se aceptan.
- Mejor con fondo blanco y el producto centrado. La web recorta el blanco sobrante y las deja todas del mismo tamaño, sin tocar el original.

## Cómo se publica un cambio

Solo se edita la pestaña Productos. Lo demás es automático:

1. La pestaña "Web (publicada)" está publicada en la web como CSV. Google actualiza esa copia unos minutos después de cada cambio.
2. Cada hora, al minuto 17, GitHub la descarga y la revisa con las mismas reglas que la web.
3. Si cambió y está todo bien, guarda la versión nueva y Cloudflare publica la web en 1 o 2 minutos.

En total, un cambio se ve en la web en **menos de una hora y media**. Si la hoja no cambió, no pasa nada (no se gasta ninguna publicación).

### Publicar ya, sin esperar la hora

En GitHub: repositorio **El_Chico_Nati-StaticWeb**, pestaña **Actions**, **Actualizar catálogo**, botón **Run workflow**. Tarda unos 2 minutos más la publicación.

### Si algo falla

- GitHub manda un correo y en Actions la ejecución sale en rojo. **La web sigue mostrando la versión anterior**: nunca queda caída ni con datos a medias.
- Para ver qué pasó: abrir la ejecución en rojo, paso "Leer y validar la hoja". El mensaje dice el código, la columna y el valor, por ejemplo `ECN-031, columna precio: "cuarenta" no es un número`.
- Se corrige en la hoja y se pulsa **Run workflow** (o se espera a la siguiente hora).
- Si dice "La hoja publicada respondió 404" o similar: la pestaña dejó de estar publicada. En la hoja, Archivo, Compartir, Publicar en la web, y volver a publicar **solo** "Web (publicada)" como CSV.

### Si GitHub pausa la revisión automática

GitHub apaga las tareas programadas de un repositorio si pasan 60 días sin ningún cambio en él. Si eso pasa, en Actions aparece un aviso amarillo sobre "Actualizar catálogo": se pulsa **Enable workflow** y vuelve a funcionar.

### Lo que no se publica nunca

Solo la pestaña "Web (publicada)" está publicada. Productos (con costos), Pedidos (con clientes), Compras, Caja, Proveedores y las demás pestañas no se pueden ver desde ese enlace. Si alguna vez se cambia la publicación, revisar que siga siendo **solo esa pestaña**, no "Documento completo".
