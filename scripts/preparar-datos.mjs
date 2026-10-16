// Genera data/catalogo-inicial.tsv a partir de los originales privados de
// -recursos/. El resultado solo lleva columnas públicas (PLAN-v2.md, 5.1):
// el stock y los campos derivados no salen de -recursos/.
//
//   npm run preparar-datos

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { leerTsv, escribirTsv } from './lib/tsv.mjs';
import { COLUMNAS_PUBLICAS, COLUMNAS_PROHIBIDAS } from './lib/columnas.mjs';

export { COLUMNAS_PUBLICAS, COLUMNAS_PROHIBIDAS };

const CAMPOS_DESCRIPCION = ['descripcion_corta', 'descripcion_larga', 'modo_uso', 'beneficios'];

/**
 * "Cuidado Personal" → "Cuidado personal", como el resto de nombres.
 * Solo baja palabras escritas como "Personal"; las siglas ("HIRI") quedan igual.
 */
const mayusculaInicial = (texto) =>
  texto
    .split(' ')
    .map((palabra, i) => {
      if (i === 0) return palabra.charAt(0).toUpperCase() + palabra.slice(1);
      return /^\p{Lu}\p{Ll}+$/u.test(palabra) ? palabra.toLowerCase() : palabra;
    })
    .join(' ');

/** "46,00", "S/ 46.00" o "46" → 46. Lo que no sea número da NaN. */
const numero = (texto) => Number(String(texto).replace(/^\s*S\/\s*/i, '').replace(',', '.'));

/**
 * Une el catálogo con los borradores de descripción y aplica las correcciones
 * de PLAN-v2.md 4.2. Devuelve las filas públicas, los códigos cuya
 * descripción vino del borrador (hay que verificarlos contra la etiqueta),
 * los que se desactivaron por no tener precio y los borradores sin producto.
 */
export function prepararCatalogo(catalogo, descripciones) {
  const borradores = new Map(descripciones.map((d) => [d.codigo, d]));
  const codigos = new Set(catalogo.map((f) => f.codigo));
  const huerfanos = [...borradores.keys()].filter((codigo) => !codigos.has(codigo));
  const pendientes = [];
  const desactivados = [];

  const filas = catalogo.map((original) => {
    const fila = { ...original };

    // Los borradores solo llenan celdas vacías; nunca pisan un texto existente.
    const borrador = borradores.get(fila.codigo);
    if (borrador) {
      let uso = false;
      for (const campo of CAMPOS_DESCRIPCION) {
        if (!fila[campo] && borrador[campo]) {
          fila[campo] = borrador[campo];
          uso = true;
        }
      }
      if (uso) pendientes.push(fila.codigo);
    }

    // D4: la primera foto siempre es el frente del empaque.
    if (fila.imagen_1_tipo !== 'frente' && fila.imagen_2_tipo === 'frente') {
      [fila.imagen_1, fila.imagen_2] = [fila.imagen_2, fila.imagen_1];
    }

    // D6: categorías y subcategorías con mayúscula solo al inicio.
    fila.categoria = mayusculaInicial(fila.categoria);
    fila.subcategoria = mayusculaInicial(fila.subcategoria);

    // D1: un producto sin precio no puede estar activo.
    if (!(numero(fila.precio) > 0)) {
      if (fila.activo === 'si') desactivados.push(fila.codigo);
      fila.activo = 'no';
    }

    return Object.fromEntries(COLUMNAS_PUBLICAS.map((c) => [c, fila[c] ?? '']));
  });

  return { filas, pendientes, desactivados, huerfanos };
}

async function main() {
  const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const recursos = path.join(raiz, '-recursos');
  const salida = path.join(raiz, 'data');

  const catalogo = leerTsv(await readFile(path.join(recursos, 'catalogo-ECN-productos.tsv'), 'utf8'));
  const descripciones = leerTsv(await readFile(path.join(recursos, 'descripciones-faltantes.tsv'), 'utf8'));

  const faltan = COLUMNAS_PUBLICAS.filter((c) => !catalogo.columnas.includes(c));
  if (faltan.length) throw new Error(`Al catálogo original le faltan columnas: ${faltan.join(', ')}.`);

  const { filas, pendientes, desactivados, huerfanos } = prepararCatalogo(catalogo.filas, descripciones.filas);
  if (desactivados.length) console.warn(`Aviso: sin precio, se marcan activo = no: ${desactivados.join(', ')}.`);
  if (huerfanos.length) console.warn(`Aviso: borradores sin producto en el catálogo: ${huerfanos.join(', ')}.`);

  await mkdir(salida, { recursive: true });
  await writeFile(path.join(salida, 'catalogo-inicial.tsv'), escribirTsv(COLUMNAS_PUBLICAS, filas), 'utf8');
  await writeFile(
    path.join(salida, 'descripciones-pendientes.txt'),
    '# Códigos cuya descripción viene de un borrador. Verificar contra la etiqueta (PLAN-v2.md, S4).\n' +
      pendientes.join('\n') + '\n',
    'utf8',
  );

  const visibles = filas.filter((f) => f.activo === 'si' && numero(f.precio) > 0).length;
  console.log(`data/catalogo-inicial.tsv: ${filas.length} productos, ${visibles} visibles.`);
  console.log(`data/descripciones-pendientes.txt: ${pendientes.length} códigos por verificar.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}
