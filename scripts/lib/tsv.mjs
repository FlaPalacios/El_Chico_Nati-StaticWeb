// Lectura y escritura de TSV simples: una fila por línea, columnas separadas
// por tabulador, sin comillas. Es el formato que exporta Google Sheets.

// Número de fila en la hoja (1 = encabezado). Va como símbolo: no aparece en Object.entries
// ni en los JSON, pero sobrevive al quitar filas vacías y permite dar errores exactos.
export const FILA = Symbol('fila');

/** Texto TSV → lista de objetos { columna: valor }. Tolera BOM y CRLF. */
export function leerTsv(texto) {
  const lineas = texto
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((linea, i) => ({ linea, numero: i + 1 }))
    .filter(({ linea }) => linea.trim() !== '');
  if (lineas.length === 0) return { columnas: [], filas: [] };

  const columnas = lineas[0].linea.split('\t').map((c) => c.trim());
  const filas = lineas.slice(1).map(({ linea, numero }) => {
    const celdas = linea.split('\t');
    if (celdas.length > columnas.length) {
      throw new Error(`Fila ${numero}: tiene ${celdas.length} columnas y el encabezado ${columnas.length}.`);
    }
    const fila = Object.fromEntries(columnas.map((c, j) => [c, (celdas[j] ?? '').trim()]));
    Object.defineProperty(fila, FILA, { value: numero }); // no enumerable: no cambia comparaciones ni JSON
    return fila;
  });
  return { columnas, filas };
}

/** Lista de objetos → texto TSV con las columnas en el orden dado. */
export function escribirTsv(columnas, filas) {
  const lineas = [columnas.join('\t')];
  for (const fila of filas) {
    const celdas = columnas.map((c) => {
      const valor = String(fila[c] ?? '');
      if (/[\t\r\n]/.test(valor)) {
        throw new Error(`${fila.codigo ?? '?'}, columna ${c}: tiene tabuladores o saltos de línea.`);
      }
      return valor;
    });
    lineas.push(celdas.join('\t'));
  }
  return lineas.join('\n') + '\n';
}
