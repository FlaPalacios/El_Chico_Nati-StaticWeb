// Fotos de Cloudinary al tamaño justo, sin tocar el original.
// Las URLs guardadas en la hoja son las que da Cloudinary al subir:
//   https://res.cloudinary.com/<cuenta>/image/upload/v123/archivo.webp
// Insertando transformaciones después de "/upload/" se pide la misma foto ya
// recortada (e_trim quita el blanco sobrante), con margen blanco parejo y en el
// formato que mejor soporte el navegador (f_auto, q_auto).

const MARCA = '/image/upload/';

/** URL de un cuadrado de `lado` px con el producto centrado y margen blanco parejo. */
export function fotoCuadro(url, lado) {
  if (!url || !url.includes(MARCA)) return url;
  const t = `e_trim/c_pad,w_${lado},h_${lado},b_white/f_auto,q_auto`;
  return url.replace(MARCA, `${MARCA}${t}/`);
}

/** srcset para varios anchos de pantalla. */
export function srcsetCuadro(url, lados = [240, 360, 480, 720, 960]) {
  return lados.map((l) => `${fotoCuadro(url, l)} ${l}w`).join(', ');
}
