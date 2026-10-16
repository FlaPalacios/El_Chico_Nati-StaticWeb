// Lectura y escritura de TSV simples: una fila por línea, columnas separadas
// por tabulador, sin comillas. Es el formato que exporta Google Sheets.

/** Texto TSV → lista de objetos { columna: valor }. Tolera BOM y CRLF. */
export function leerTsv(texto) {
  const lineas = texto
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((linea) => linea.trim() !== '');
  if (lineas.length === 0) return { columnas: [], filas: [] };

  const columnas = lineas[0].split('\t').map((c) => c.trim());
  const filas = lineas.slice(1).map((linea, i) => {
    const celdas = linea.split('\t');
    if (celdas.length > columnas.length) {
      throw new Error(`Fila ${i + 2}: tiene ${celdas.length} columnas y el encabezado ${columnas.length}.`);
    }
    return Object.fromEntries(columnas.map((c, j) => [c, (celdas[j] ?? '').trim()]));
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
