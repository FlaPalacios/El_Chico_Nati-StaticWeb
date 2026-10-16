// Lógica del catálogo de la portada (pura, probada en tests/portada.test.mjs).
// El script del componente solo lee el DOM y aplica lo que estas funciones deciden.
import { coincide } from './buscar.js';

export const ORDENES = ['', 'precio-asc', 'precio-desc', 'nombre'];

/**
 * Estado del catálogo a partir de la URL, descartando lo que no existe.
 * opciones: { categorias: string[], subcategorias: { [sub]: cat }, marcas: string[] }
 * - cat inválida → todas; sub inválida → ninguna; sub sin cat → se deduce su categoría;
 * - sub de otra categoría → se descarta; marca u orden desconocidos → se descartan.
 */
export function estadoDesdeUrl(params, opciones) {
  const leer = (k) => (params.get(k) ?? '').trim();
  let cat = opciones.categorias.includes(leer('cat')) ? leer('cat') : '';
  let sub = leer('sub');
  // Solo claves propias: "constructor" o "__proto__" no son subcategorías
  const catDeSub = Object.hasOwn(opciones.subcategorias, sub) ? opciones.subcategorias[sub] : undefined;
  if (!catDeSub) sub = '';
  else if (!cat) cat = catDeSub;
  else if (catDeSub !== cat) sub = '';
  return {
    q: leer('q').slice(0, 80),
    cat,
    sub,
    marca: opciones.marcas.includes(leer('marca')) ? leer('marca') : '',
    orden: ORDENES.includes(leer('orden')) ? leer('orden') : '',
  };
}

/** ¿El producto pasa los filtros? item: { cat, sub, marca, texto } */
export function pasaFiltros(item, estado) {
  return (!estado.cat || item.cat === estado.cat)
    && (!estado.sub || item.sub === estado.sub)
    && (!estado.marca || item.marca === estado.marca)
    && coincide(item.texto, estado.q);
}

/** Comparador para ordenar. item: { pos, precio, nombre, destacado }. Siempre estable con la posición de la hoja. */
export function comparador(orden) {
  return (a, b) => {
    if (orden === 'precio-asc') return a.precio - b.precio || a.pos - b.pos;
    if (orden === 'precio-desc') return b.precio - a.precio || a.pos - b.pos;
    if (orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es') || a.pos - b.pos;
    return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || a.pos - b.pos;
  };
}
