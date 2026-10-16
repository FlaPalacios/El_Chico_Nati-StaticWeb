// data/ubigeo-inei-2022.csv (padrón INEI 2022) → public/datos/ubigeo.json
// El padrón viene en MAYÚSCULAS y sin tildes. Se pasa a mayúscula inicial y se ponen
// las tildes que se conocen con certeza (los 25 departamentos y los distritos de Lima
// y Callao), igual que el sistema anterior (backend/app/ubigeo.py). El resto queda
// como lo publica el INEI.
//
//   npm run ubigeo     (solo hace falta si cambia el padrón)

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { leerCsv } from './lib/csv.mjs';

const TILDES = {
  // Departamentos
  ANCASH: 'Áncash', APURIMAC: 'Apurímac', HUANUCO: 'Huánuco', JUNIN: 'Junín', 'SAN MARTIN': 'San Martín',
  // Distritos de Lima y Callao
  'JESUS MARIA': 'Jesús María', 'SAN MARTIN DE PORRES': 'San Martín de Porres', 'SANTA MARIA DEL MAR': 'Santa María del Mar',
  'VILLA MARIA DEL TRIUNFO': 'Villa María del Triunfo', RIMAC: 'Rímac', LURIN: 'Lurín', ANCON: 'Ancón', PUCUSANA: 'Pucusana',
  'SAN JUAN DE LURIGANCHO': 'San Juan de Lurigancho', 'SAN JUAN DE MIRAFLORES': 'San Juan de Miraflores',
  'CARMEN DE LA LEGUA REYNOSO': 'Carmen de la Legua Reynoso', 'MI PERU': 'Mi Perú',
};
const MINUSCULAS = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'en']);

export function bonito(nombre) {
  const n = nombre.trim();
  if (TILDES[n]) return TILDES[n];
  return n.split(/\s+/).map((p, i) => {
    const min = p.toLowerCase();
    return i && MINUSCULAS.has(min) ? min : min.charAt(0).toUpperCase() + min.slice(1);
  }).join(' ');
}

/** Árbol compacto: [{c, n, p: [{c, n, d: [[ubigeo, nombre], …]}]}] */
export function armarUbigeo(filas) {
  const deps = new Map();
  for (const f of filas) {
    if (!deps.has(f.cod_departamento)) deps.set(f.cod_departamento, { c: f.cod_departamento, n: bonito(f.departamento), p: new Map() });
    const dep = deps.get(f.cod_departamento);
    if (!dep.p.has(f.cod_provincia)) dep.p.set(f.cod_provincia, { c: f.cod_provincia, n: bonito(f.provincia), d: [] });
    dep.p.get(f.cod_provincia).d.push([f.ubigeo, bonito(f.distrito)]);
  }
  const porNombre = (a, b) => a.n.localeCompare(b.n, 'es');
  return [...deps.values()].sort(porNombre).map((dep) => ({
    c: dep.c, n: dep.n,
    p: [...dep.p.values()].sort(porNombre).map((pr) => ({ c: pr.c, n: pr.n, d: pr.d.sort((a, b) => a[1].localeCompare(b[1], 'es')) })),
  }));
}

async function main() {
  const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { filas } = leerCsv(await readFile(path.join(raiz, 'data', 'ubigeo-inei-2022.csv'), 'utf8'));
  const arbol = armarUbigeo(filas);
  await mkdir(path.join(raiz, 'public', 'datos'), { recursive: true });
  await writeFile(path.join(raiz, 'public', 'datos', 'ubigeo.json'), JSON.stringify(arbol));
  const provincias = arbol.reduce((n, d) => n + d.p.length, 0);
  const distritos = arbol.reduce((n, d) => n + d.p.reduce((m, p) => m + p.d.length, 0), 0);
  console.log(`public/datos/ubigeo.json: ${arbol.length} departamentos, ${provincias} provincias, ${distritos} distritos.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(`Error: ${e.message}`); process.exit(1); });
}
