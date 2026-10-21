// El Chico Naturista: ayuda para registrar pedidos en el Sheets de administración.
// Se pega en Extensiones > Apps Script del archivo "Tienda web (administración)".
//
// Al elegir un producto en la columna Producto de la pestaña Pedidos, completa solos:
//   - Código (columna J)
//   - Precio unitario (columna L) con el precio web de ese momento
//   - Cantidad (columna K) = 1 si estaba vacía
// Se guardan como valores, no como fórmulas: si mañana cambia el precio en Productos,
// los pedidos ya registrados no cambian. Para un descuento, se corrige el precio a mano.
//
// Es un "disparador simple" (onEdit): no pide permisos ni accede a nada fuera de este archivo.

const PEDIDOS = 'Pedidos';
const COL_PRODUCTO = 9;  // I
const COL_CODIGO = 10;   // J
const COL_CANTIDAD = 11; // K
const COL_PRECIO = 12;   // L

function onEdit(e) {
  const hoja = e.range.getSheet();
  if (hoja.getName() !== PEDIDOS) return;
  // Solo interesa si la edición tocó la columna Producto
  if (e.range.getColumn() > COL_PRODUCTO || e.range.getLastColumn() < COL_PRODUCTO) return;

  const filaIni = Math.max(2, e.range.getRow());
  const filaFin = e.range.getLastRow();
  if (filaFin < filaIni) return;
  const n = filaFin - filaIni + 1;
  const unaSola = n === 1;

  // Productos: A código, B nombre, D precio web
  const productos = e.source.getSheetByName('Productos').getRange('A2:D').getValues();
  const porNombre = new Map();
  for (const [codigo, nombre, , precio] of productos) {
    if (codigo && nombre) porNombre.set(String(nombre).trim(), { codigo, precio });
  }

  const nombres = hoja.getRange(filaIni, COL_PRODUCTO, n, 1).getValues();
  const datos = hoja.getRange(filaIni, COL_CODIGO, n, 3).getValues(); // J código, K cantidad, L precio

  for (let i = 0; i < n; i++) {
    const nombre = String(nombres[i][0]).trim();
    const fila = datos[i];
    if (!nombre) {
      // Se borró el producto: se limpia lo que el script había puesto
      if (unaSola) { fila[0] = ''; fila[2] = ''; }
      continue;
    }
    if (nombre === 'Envío') {
      fila[0] = 'ENVIO';
      if (fila[1] === '') fila[1] = 1;
      if (unaSola) fila[2] = '';
      continue; // el precio del envío se escribe a mano (10, 15 o 0)
    }
    const p = porNombre.get(nombre);
    if (!p) { fila[0] = ''; continue; }
    fila[0] = p.codigo;
    if (fila[1] === '') fila[1] = 1;
    // Una fila editada a mano: siempre el precio del día. Varias pegadas: solo si estaba vacío.
    if (unaSola || fila[2] === '') fila[2] = p.precio;
  }
  hoja.getRange(filaIni, COL_CODIGO, n, 3).setValues(datos);
}
