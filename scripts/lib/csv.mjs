// Lector de CSV (RFC 4180): comillas, comillas dobles escapadas y saltos de
// línea dentro de una celda. Es el formato de "Publicar en la web" de Google Sheets.
import { leerTsv, FILA } from './tsv.mjs';

export function leerCsv(texto) {
  const filas = [];
  let fila = [];
  let celda = '';
  let entreComillas = false;
  const t = texto.replace(/^\uFEFF/, '');

  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (entreComillas) {
      if (c === '"' && t[i + 1] === '"') { celda += '"'; i++; }
      else if (c === '"') entreComillas = false;
      else celda += c;
    } else if (c === '"') entreComillas = true;
    else if (c === ',') { fila.push(celda); celda = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && t[i + 1] === '\n') i++;
      fila.push(celda); filas.push(fila); fila = []; celda = '';
    } else celda += c;
  }
  if (entreComillas) throw new Error('El CSV tiene comillas sin cerrar.');
  if (celda !== '' || fila.length) { fila.push(celda); filas.push(fila); }

  // Cada registro es una fila de la hoja: se guarda su número antes de quitar las vacías
  const utiles = filas
    .map((f, i) => ({ f, numero: i + 1 }))
    .filter(({ f }) => f.some((v) => v.trim() !== ''));
  if (!utiles.length) return { columnas: [], filas: [] };
  const columnas = utiles[0].f.map((c) => c.trim());
  return {
    columnas,
    filas: utiles.slice(1).map(({ f, numero }) => {
      const fila = Object.fromEntries(columnas.map((c, j) => [c, (f[j] ?? '').trim()]));
      Object.defineProperty(fila, FILA, { value: numero }); // no enumerable: no cambia comparaciones ni JSON
      return fila;
    }),
  };
}

/** TSV o CSV según el encabezado: si la primera línea tiene tabuladores, es TSV. */
export function leerTabla(texto) {
  const primera = texto.replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0];
  return primera.includes('\t') ? leerTsv(texto) : leerCsv(texto);
}
