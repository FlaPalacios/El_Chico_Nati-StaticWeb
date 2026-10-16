// Validación y transformación del catálogo (PLAN-v2.md, 5.2 y 5.3).
// Función pura: recibe columnas y filas, devuelve productos, categorías, marcas,
// errores (rompen la compilación) y avisos (se informan, no rompen).
import { COLUMNAS_PUBLICAS, COLUMNAS_PROHIBIDAS, PATRON_PROHIBIDO, PREFIJO_FOTOS } from './columnas.mjs';
import { FILA } from './tsv.mjs';

const RE_CODIGO = /^ECN-\d{3}$/;
const RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CORTA = 140;
const MAX_BENEFICIOS = 4;

const normalizarColumna = (c) => c.trim().toLowerCase();

/** "46.00", "46,00", "S/ 46", "S/. 46" → 46. Vacío → null. Texto no numérico o con más de 2 decimales → NaN. */
export function leerPrecio(texto) {
  const t = String(texto ?? '').trim();
  if (!t) return null;
  const limpio = t.replace(/^S\/\.?\s*/i, '').replace(',', '.');
  return /^\d+(\.\d{1,2})?$/.test(limpio) ? Number(limpio) : NaN;
}

/** "Cuidado personal" → "cuidado-personal" (sin tildes, minúsculas, guiones). */
export function aSlug(nombre) {
  return String(nombre).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Foto válida: https, res.cloudinary.com, ruta (ya normalizada) dentro de la cuenta de la
 * tienda y solo caracteres seguros para src y srcset (sin comas, espacios ni comillas).
 */
export function fotoValida(texto) {
  let u;
  try { u = new URL(texto); } catch { return false; }
  const prefijo = new URL(PREFIJO_FOTOS);
  return u.protocol === 'https:'
    && u.hostname === prefijo.hostname
    && u.pathname.startsWith(prefijo.pathname)
    && !u.search && !u.hash
    && /^[A-Za-z0-9/_.\-]+$/.test(u.pathname)
    && u.href === texto; // nada que el navegador reescriba (por ejemplo "../")
}

/** si / sí / Sí / SI → true; no / vacío → false; otra cosa → undefined. */
export function leerSiNo(texto) {
  const t = String(texto ?? '').trim().toLowerCase();
  if (t === '' || t === 'no') return false;
  if (t === 'si' || t === 'sí') return true;
  return undefined;
}

export function procesarCatalogo(columnasCrudas, filasCrudas) {
  const errores = [];
  const avisos = [];
  const columnas = columnasCrudas.map(normalizarColumna);

  const esProhibida = (c) => COLUMNAS_PROHIBIDAS.includes(c) || PATRON_PROHIBIDO.test(c);
  for (const c of columnas) {
    if (esProhibida(c)) errores.push(`La columna «${c}» parece un dato privado del Master y no puede publicarse. Quítala de la pestaña "Catálogo web".`);
  }
  const repetidas = columnas.filter((c, i) => c && columnas.indexOf(c) !== i);
  for (const c of new Set(repetidas)) errores.push(`La columna «${c}» está repetida.`);
  for (const c of COLUMNAS_PUBLICAS) {
    if (!columnas.includes(c)) errores.push(`Falta la columna «${c}» (o cambió de nombre).`);
  }
  for (const c of columnas) {
    if (c && !COLUMNAS_PUBLICAS.includes(c) && !esProhibida(c)) avisos.push(`La columna «${c}» no se usa y se ignora.`);
  }
  if (errores.length) return { productos: [], categorias: [], marcas: [], errores, avisos };

  // Filas con las claves normalizadas; se saltan las filas totalmente vacías.
  // El número de fila viene del lector (FILA); si no está, se asume que no hubo filas vacías.
  const filas = filasCrudas
    .map((f, i) => ({
      numero: f[FILA] ?? i + 2,
      datos: Object.fromEntries(Object.entries(f).map(([k, v]) => [normalizarColumna(k), String(v ?? '').trim()])),
    }))
    .filter(({ datos }) => Object.values(datos).some((v) => v !== ''));

  const filaDeCodigo = new Map();
  const vistosSlug = new Set();
  const nombresDeSlug = { categoria: new Map(), subcategoria: new Map(), marca: new Map() };
  const categoriaDeSub = new Map();
  const productos = [];

  filas.forEach(({ numero, datos: f }) => {
    const id = RE_CODIGO.test(f.codigo) ? `${f.codigo} (fila ${numero})` : `Fila ${numero}`;
    const error = (col, msg) => errores.push(`${id}, columna ${col}: ${msg}`);
    const aviso = (msg) => avisos.push(`${id}: ${msg}`);

    if (!RE_CODIGO.test(f.codigo)) error('codigo', `«${f.codigo}» no tiene el formato ECN-000.`);
    else if (filaDeCodigo.has(f.codigo)) error('codigo', `está repetido (también en la fila ${filaDeCodigo.get(f.codigo)}).`);
    else filaDeCodigo.set(f.codigo, numero);

    if (!RE_SLUG.test(f.slug)) error('slug', `«${f.slug}» solo puede tener minúsculas, números y guiones.`);
    else if (vistosSlug.has(f.slug)) error('slug', `«${f.slug}» está repetido.`);
    vistosSlug.add(f.slug);

    const activo = leerSiNo(f.activo);
    if (activo === undefined) error('activo', `«${f.activo}» debe ser si o no.`);
    const destacado = leerSiNo(f.destacado);
    if (destacado === undefined) error('destacado', `«${f.destacado}» debe ser si o no.`);
    const masVendido = leerSiNo(f.mas_vendido);
    if (masVendido === undefined) error('mas_vendido', `«${f.mas_vendido}» debe ser si o no.`);

    const precio = leerPrecio(f.precio);
    if (Number.isNaN(precio)) error('precio', `«${f.precio}» no es un número.`);
    let precioAntes = leerPrecio(f.precio_antes);
    if (Number.isNaN(precioAntes)) error('precio_antes', `«${f.precio_antes}» no es un número.`);

    // Nombres y slugs de categoría, subcategoría y marca: uno a uno en toda la hoja
    for (const tipo of ['categoria', 'subcategoria', 'marca']) {
      const nombre = f[tipo];
      const slug = f[`${tipo}_slug`];
      if (!nombre) { error(tipo, 'está vacía.'); continue; }
      if (!RE_SLUG.test(slug)) { error(`${tipo}_slug`, `«${slug}» solo puede tener minúsculas, números y guiones.`); continue; }
      if (aSlug(nombre) !== slug) { error(`${tipo}_slug`, `«${slug}» no calza con «${nombre}» (debería ser «${aSlug(nombre)}»).`); continue; }
      const previo = nombresDeSlug[tipo].get(slug);
      if (previo && previo !== nombre) error(tipo, `el slug «${slug}» se usa con dos nombres: «${previo}» y «${nombre}».`);
      for (const [otroSlug, otroNombre] of nombresDeSlug[tipo]) {
        if (otroNombre === nombre && otroSlug !== slug) error(`${tipo}_slug`, `«${nombre}» tiene dos slugs: «${otroSlug}» y «${slug}».`);
      }
      nombresDeSlug[tipo].set(slug, nombre);
    }
    if (RE_SLUG.test(f.subcategoria_slug) && RE_SLUG.test(f.categoria_slug)) {
      const cat = categoriaDeSub.get(f.subcategoria_slug);
      if (cat && cat !== f.categoria_slug) error('subcategoria', `«${f.subcategoria}» aparece en dos categorías.`);
      categoriaDeSub.set(f.subcategoria_slug, f.categoria_slug);
    }

    // imagen_1 siempre es el frente (D4): una segunda foto sin primera es un error de carga
    if (f.imagen_2 && !f.imagen_1) error('imagen_1', 'está vacía pero imagen_2 tiene foto: pon el frente del empaque en imagen_1.');
    const imagenes = [];
    for (const col of ['imagen_1', 'imagen_2']) {
      if (!f[col]) continue;
      if (!fotoValida(f[col])) error(col, 'la foto debe ser un enlace directo de la cuenta de Cloudinary de la tienda (https://res.cloudinary.com/deaq5dfwt/image/upload/…), sin espacios ni comas.');
      else imagenes.push(f[col]);
    }

    const visible = activo === true && precio > 0;
    if (activo === true && !(precio > 0) && !Number.isNaN(precio)) aviso('está activo pero no tiene precio: no se publica.');
    if (!visible) return;

    if (precioAntes !== null && !Number.isNaN(precioAntes) && precioAntes <= precio) {
      aviso(`precio_antes (${precioAntes}) no es mayor que el precio (${precio}): se ignora.`);
      precioAntes = null;
    }
    if (!f.imagen_1) aviso('no tiene foto: se usa la imagen de reemplazo.');
    if (!f.descripcion_corta) aviso('no tiene descripción corta.');
    else if (f.descripcion_corta.length > MAX_CORTA) aviso(`la descripción corta tiene ${f.descripcion_corta.length} caracteres (máximo recomendado ${MAX_CORTA}).`);
    const beneficios = f.beneficios ? f.beneficios.split('|').map((b) => b.trim()).filter(Boolean) : [];
    if (beneficios.length > MAX_BENEFICIOS) aviso(`tiene ${beneficios.length} beneficios (máximo recomendado ${MAX_BENEFICIOS}).`);

    productos.push({
      codigo: f.codigo,
      slug: f.slug,
      nombre: f.nombre,
      presentacion: f.presentacion,
      precio,
      precioAntes: Number.isNaN(precioAntes) ? null : precioAntes,
      categoria: f.categoria, categoriaSlug: f.categoria_slug,
      subcategoria: f.subcategoria, subcategoriaSlug: f.subcategoria_slug,
      marca: f.marca, marcaSlug: f.marca_slug,
      destacado: destacado === true,
      masVendido: masVendido === true,
      descripcionCorta: f.descripcion_corta,
      descripcionLarga: f.descripcion_larga,
      modoUso: f.modo_uso,
      beneficios,
      imagenes,
    });
  });

  if (!errores.length && !productos.length) errores.push('No hay ningún producto visible (activo = si y precio mayor que 0).');

  // Árbol de categorías y lista de marcas: solo con productos visibles, en el orden de la hoja
  const categorias = [];
  for (const p of productos) {
    let cat = categorias.find((c) => c.slug === p.categoriaSlug);
    if (!cat) categorias.push(cat = { nombre: p.categoria, slug: p.categoriaSlug, cantidad: 0, subcategorias: [] });
    cat.cantidad++;
    let sub = cat.subcategorias.find((s) => s.slug === p.subcategoriaSlug);
    if (!sub) cat.subcategorias.push(sub = { nombre: p.subcategoria, slug: p.subcategoriaSlug, cantidad: 0 });
    sub.cantidad++;
  }
  const marcas = [];
  for (const p of productos) {
    let m = marcas.find((x) => x.slug === p.marcaSlug);
    if (!m) marcas.push(m = { nombre: p.marca, slug: p.marcaSlug, cantidad: 0 });
    m.cantidad++;
  }
  marcas.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  return { productos, categorias, marcas, errores, avisos };
}
