# Guía del equipo: tienda web

Para quien actualiza productos, registra pedidos y compras de elchiconaturista.com. No hace falta saber programar.

Todo vive en un solo archivo de Google Sheets: **"El Chico Naturista – Tienda web (administración)"**. El Master anterior ya no se usa.

## El archivo en un vistazo

En todas las pestañas: **encabezado verde = se escribe**, **encabezado gris = se calcula solo** (si alguien intenta escribir encima, Sheets avisa). Casi todo se elige de listas desplegables.

| Pestaña | Para qué |
|---|---|
| **Resumen** | Ventas, ganancia, saldo en caja, alertas, más vendidos y tabla por mes. No se escribe nada |
| **Productos** | Una fila por producto con todo: lo que muestra la web, el costo y el stock calculado. Ordenada por código |
| **Inventario** | Vista rápida del stock: código, producto, stock, mínimo, en camino, alerta, vencimiento y valor. No se escribe nada |
| **Pedidos** | Una fila por producto vendido. Lo que se vende baja el stock y suma a las ventas |
| **Compras y ajustes** | Compras a proveedores (suben el stock) y mermas o ajustes (cantidad negativa) |
| **Caja** | Gastos, aportes y retiros de dinero |
| **Flujo de caja** | Cuánto dinero hay, cuánto falta cobrar y pagar, entradas y salidas por mes y la lista de cada movimiento con el saldo después de cada uno. No se escribe nada |
| **Proveedores** | Contactos, mínimos de compra y total comprado |
| **Listas** | Las opciones de las listas desplegables: categorías, marcas, estados. Se agregan aquí |
| **Web (publicada)** | Copia automática de lo público de los productos con "En la web" = `si`. Es lo único que lee la web. No se toca |

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

**Orden en la web:** la tienda muestra los productos por subcategoría, en el orden en que están en Listas (columna Subcategoría), y dentro de cada una por código. Para cambiar el orden de la web se reordenan las subcategorías en Listas; el orden de las filas de Productos no importa.

## Producto nuevo

1. Agregar una fila en Productos con el siguiente código libre (los códigos no se reutilizan). Dejar "En la web" vacío o en `no` mientras se completa: así no llega a la web ni frena las actualizaciones.
2. Llenar nombre, presentación, precio, categoría, subcategoría, marca, slug, descripción corta y al menos Imagen 1.
3. Cuando esté completo, poner "En la web" = `si`. Desde ese momento la revisión automática exige que todo esté bien.
4. El stock sale de las compras: registrar la compra en "Compras y ajustes".

## Registrar un pedido

En **Pedidos**, una fila por cada producto del pedido:

1. N° pedido (`V-015`, el siguiente), Código web (el `ECN-AAMMDD-NNNN` del mensaje de WhatsApp; vacío si es manual), fechas, estado, cliente, teléfono y distrito.
2. En **Producto**, elegir el nombre de la lista. Se completan solos el **código**, el **precio del día** y la cantidad 1. Cambiar la cantidad si hace falta; si hubo descuento, corregir el precio.
3. Una fila más con el producto **Envío** y el envío cobrado como precio (10, 15 o 0 si fue gratis).
4. El estado se va actualizando: pendiente → coordinado → pagado → enviado → completado (o cancelado). Desde "coordinado" cuenta como venta y baja el stock.

El precio queda **fijo**: si mañana la galleta sube de S/ 8.00 a S/ 8.50, los pedidos ya registrados siguen en S/ 8.00. Por eso no es una fórmula.

Si al elegir el producto el código queda vacío, el script no está instalado (ver "Instalar el script de pedidos" al final) y el Resumen lo avisa en "Pedidos o compras sin código".

**Pedido manual** (por WhatsApp directo, en persona, en una feria): igual que uno de la web, pero el Código web se deja **vacío**. El N° pedido ya lo identifica. Los códigos `ECN-M-...` de octubre son pedidos manuales del sistema anterior y se quedan como están.

**Si me equivoqué al registrarlo:** se corrige la celda, o se borran sus filas completas (clic derecho en el número de fila, "Eliminar fila"). Se puede borrar cualquier fila de datos: las fórmulas están en el encabezado y no se pierden. El stock, las ventas y la caja se recalculan solos.

**Si el pedido existió pero el cliente se arrepintió:** no se borra; se cambia el estado a `cancelado`. Deja de contar como venta, el stock vuelve y queda el historial.

## Registrar una compra

En **Compras y ajustes**, una fila por producto: fecha de pago, tipo `Compra`, N° de compra, estado (`Pedido` mientras no llega, `Recibido` al llegar), código, cantidad y **total pagado** por esa línea. El costo unitario se calcula solo. Para productos que vencen, poner la fecha de vencimiento del lote: el Resumen avisa cuando falta poco.

Mermas (algo se dañó o venció) y ajustes de conteo van en la misma pestaña con tipo `Merma` o `Ajuste` y cantidad negativa (o positiva si sobró).

## Qué no hacer en el archivo

- **No escribir en columnas grises** ni en Resumen, Inventario, Flujo de caja o "Web (publicada)": se calculan solas (Sheets avisa antes de dejarte).
- **No borrar ni editar la fila 1** de ninguna pestaña: ahí viven las fórmulas.
- **No reordenar "Compras y ajustes".** Sus filas van en orden de llegada: el cálculo de qué lote queda (y cuál vence) usa ese orden. Pedidos y Productos sí se pueden ordenar.
- **No cambiar el código ni el slug** de un producto ya publicado, ni repetir un nombre de producto.
- **No renombrar ni borrar pestañas.** "Web (publicada)" es la que lee la web.
- **Columnas nuevas, al final.** Se puede agregar una columna propia (por ejemplo, notas) después de la última; mejor no insertar columnas en medio.
- **Filtros: usar "Vistas de filtro"** (Datos → Vistas de filtro → Crear). Son personales: no cambian lo que ven los demás ni el orden real de las filas, y se cierran con la X. El filtro normal (el embudo de la barra) también funciona, pero lo ve todo el equipo y es fácil olvidarlo puesto.

## Fotos

- Se suben a la cuenta de Cloudinary de la tienda y se copia el enlace que da Cloudinary (empieza con `https://res.cloudinary.com/deaq5dfwt/image/upload/`). Otros enlaces (Drive, Instagram) no se aceptan.
- Mejor con fondo blanco y el producto centrado. La web recorta el blanco sobrante y las deja todas del mismo tamaño, sin tocar el original.

## Cómo se publica un cambio

Solo se edita la pestaña Productos. Lo demás es automático:

1. La pestaña "Web (publicada)" está publicada en la web como CSV. Google actualiza esa copia unos minutos después de cada cambio.
2. Cada 2 horas entre las 8 a. m. y las 10 p. m. (8:17, 10:17… 22:17), GitHub la descarga y la revisa con las mismas reglas que la web. GitHub a veces la corre con retraso o se salta alguna.
3. Si cambió y está todo bien, guarda la versión nueva y Cloudflare publica la web en 1 o 2 minutos.

Un cambio se ve en la web en la siguiente revisión, normalmente en **menos de 2 horas y media**. Si la hoja no cambió, no pasa nada (no se gasta ninguna publicación). Para algo urgente, "Run workflow" (abajo).

**Qué tiene que estar completo** en un producto con "En la web" = `si`. Si falta algo, la revisión se detiene y la web sigue como estaba:

| Obligatorio | Se publica igual si falta (solo avisa) |
|---|---|
| Código (`ECN-000`), nombre, slug (minúsculas y guiones, sin repetir) | Presentación, precio antes |
| Categoría, subcategoría y marca (de la lista) | Descripción corta, larga, modo de uso, beneficios |
| Precio, Destacado y Más vendido con valores válidos (número; `si`/`no`) | Imagen 1: sale la imagen de reemplazo con el logo |
| Imágenes, **si se ponen**: enlace de Cloudinary de la tienda | Precio vacío: el producto no sale (no es error) |

Una imagen con un enlace mal copiado (de Drive, con espacios, de otra cuenta) **sí detiene** la revisión; es mejor dejarla vacía hasta tener el enlace correcto.

### Publicar ya, sin esperar la hora

En GitHub: repositorio **El_Chico_Nati-StaticWeb**, pestaña **Actions**, **Actualizar catálogo**, botón **Run workflow**. Tarda unos 2 minutos más la publicación.

### Si algo falla

- GitHub manda un correo y en Actions la ejecución sale en rojo. **La web sigue mostrando la versión anterior**: nunca queda caída ni con datos a medias.
- Para ver qué pasó: abrir la ejecución en rojo, paso "Leer y validar la hoja". El mensaje dice el código, la columna y el valor, por ejemplo `ECN-031, columna precio: "cuarenta" no es un número`. (Los avisos de "Node.js 20 is deprecated" o "ubuntu-latest" que salen abajo son informativos de GitHub, no son la causa.)
- Se corrige en la hoja y se pulsa **Run workflow** (o se espera a la siguiente hora).
- Si dice "La hoja publicada respondió 404" o similar: la pestaña dejó de estar publicada. En la hoja, Archivo, Compartir, Publicar en la web, y volver a publicar **solo** "Web (publicada)" como CSV.

### Si GitHub pausa la revisión automática

GitHub apaga las tareas programadas de un repositorio si pasan 60 días sin ningún cambio en él. Si eso pasa, en Actions aparece un aviso amarillo sobre "Actualizar catálogo": se pulsa **Enable workflow** y vuelve a funcionar.

### Lo que no se publica nunca

Solo la pestaña "Web (publicada)" está publicada. Productos (con costos), Pedidos (con clientes), Compras, Caja, Proveedores y las demás pestañas no se pueden ver desde ese enlace. Si alguna vez se cambia la publicación, revisar que siga siendo **solo esa pestaña**, no "Documento completo".

## Instalar el script de pedidos (una sola vez)

1. En el archivo de Sheets: **Extensiones → Apps Script**.
2. Borrar lo que haya en el editor y pegar el contenido de `docs/apps-script-pedidos.js` (está en el repositorio).
3. Guardar (ícono del disquete) y cerrar la pestaña. No hay que ejecutar nada ni dar permisos: funciona solo al editar Pedidos.
