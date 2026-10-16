// Contrato de la pestaña "Catálogo web" (PLAN-v2.md, 5.1). Un solo lugar para
// las columnas, así preparar-datos y sync-catalogo nunca se desalinean.

export const COLUMNAS_PUBLICAS = [
  'codigo', 'slug', 'activo', 'nombre', 'presentacion', 'precio', 'precio_antes',
  'categoria', 'categoria_slug', 'subcategoria', 'subcategoria_slug', 'marca', 'marca_slug',
  'destacado', 'mas_vendido',
  'descripcion_corta', 'descripcion_larga', 'modo_uso', 'beneficios',
  'imagen_1', 'imagen_2',
];

// Si alguna aparece en la hoja publicada, el sync se detiene: son datos privados del Master.
export const COLUMNAS_PROHIBIDAS = [
  'stock', 'costo', 'costo de lista', 'costo real', 'proveedor', 'margen', 'ganancia',
  'compras', 'ventas', 'unidades vendidas', 'cliente', 'telefono', 'teléfono',
];

// Además se detiene si el nombre de una columna CONTIENE alguna de estas palabras
// ("Stock actual", "Costo unitario", "Proveedor principal"…).
export const PATRON_PROHIBIDO = /stock|costo|proveedor|margen|ganancia|compra|venta|cliente|tel[eé]fono|celular|\bdni\b|\bruc\b/i;

// Única cuenta de Cloudinary permitida para las fotos.
export const PREFIJO_FOTOS = 'https://res.cloudinary.com/deaq5dfwt/image/upload/';
