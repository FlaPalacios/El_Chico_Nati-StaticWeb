// Lee el catálogo (CATALOGO_URL si existe; si no, data/catalogo-inicial.tsv),
// lo valida y escribe los JSON que usa la web en src/data/.
// Si hay errores no escribe nada y termina con código 1: queda publicada la versión anterior.
//
//   npm run sync

import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { leerTabla } from './lib/csv.mjs';
import { procesarCatalogo } from './lib/catalogo.mjs';

// En Windows, el antivirus o el servidor de desarrollo pueden tener el archivo abierto un instante (EPERM/EBUSY)
async function renombrarConReintento(desde, hacia, intentos = 8) {
  for (let i = 1; ; i++) {
    try { return await rename(desde, hacia); } catch (e) {
      if (i >= intentos || !['EPERM', 'EBUSY', 'EACCES'].includes(e.code)) throw e;
      await new Promise((r) => setTimeout(r, 150 * i));
    }
  }
}

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const salida = path.join(raiz, 'src', 'data');

async function leerOrigen() {
  const url = process.env.CATALOGO_URL;
  if (url) {
    // La URL nunca se imprime, ni siquiera dentro de un error: no hace falta que quede en los registros.
    let destino;
    try { destino = new URL(url); } catch { throw new Error('CATALOGO_URL no es una URL válida.'); }
    if (destino.protocol !== 'https:') throw new Error('CATALOGO_URL debe empezar con https://');
    let respuesta;
    try {
      respuesta = await fetch(destino, { signal: AbortSignal.timeout(20000) });
    } catch {
      throw new Error('No se pudo leer la hoja publicada (sin conexión o tardó más de 20 s).');
    }
    if (!respuesta.ok) throw new Error(`La hoja publicada respondió ${respuesta.status}. Revisa que siga publicada como CSV.`);
    const texto = await respuesta.text();
    if (texto.length > 2_000_000) throw new Error('La hoja publicada pesa más de 2 MB: no parece la pestaña "Catálogo web".');
    return { texto, origen: 'CATALOGO_URL (hoja publicada)' };
  }
  return { texto: await readFile(path.join(raiz, 'data', 'catalogo-inicial.tsv'), 'utf8'), origen: 'data/catalogo-inicial.tsv' };
}

async function main() {
  const { texto, origen } = await leerOrigen();
  const { columnas, filas } = leerTabla(texto);
  const { productos, categorias, marcas, errores, avisos } = procesarCatalogo(columnas, filas);

  for (const a of avisos) console.warn(`Aviso: ${a}`);
  if (errores.length) {
    console.error(`\nEl catálogo tiene ${errores.length} error(es). No se actualizó nada:\n`);
    for (const e of errores) console.error(`  - ${e}`);
    process.exit(1);
  }

  // Primero se escriben todos los temporales y luego se renombran: nunca queda un JSON a medias.
  await mkdir(salida, { recursive: true });
  const archivos = {
    'productos.json': productos,
    'categorias.json': categorias,
    'marcas.json': marcas,
    'sync-info.json': { fecha: new Date().toISOString(), origen, productos: productos.length, avisos },
  };
  for (const [nombre, datos] of Object.entries(archivos)) {
    await writeFile(path.join(salida, `${nombre}.tmp`), JSON.stringify(datos, null, 2) + '\n', 'utf8');
  }
  for (const nombre of Object.keys(archivos)) {
    await renombrarConReintento(path.join(salida, `${nombre}.tmp`), path.join(salida, nombre));
  }

  const subs = categorias.reduce((n, c) => n + c.subcategorias.length, 0);
  console.log(`Catálogo listo desde ${origen}: ${productos.length} productos, ${categorias.length} categorías, ${subs} subcategorías, ${marcas.length} marcas, ${avisos.length} aviso(s).`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
