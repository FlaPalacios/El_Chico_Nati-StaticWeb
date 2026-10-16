// Costo de envío según el distrito (código de ubigeo INEI de 6 dígitos) y el subtotal.
// Reglas en src/data/envio.json: provincia de Lima (1501) y Callao (07) pagan la
// tarifa de su zona; el resto del Perú, tarifaResto; desde gratisDesde es gratis.
// Se trabaja en céntimos para no arrastrar errores de redondeo.

export function costoEnvio(ubigeo, subtotal, reglas) {
  const codigo = String(ubigeo ?? '');
  if (!/^\d{6}$/.test(codigo)) return null; // sin distrito elegido no hay costo todavía
  if (Math.round(subtotal * 100) >= Math.round(reglas.gratisDesde * 100)) return 0;
  const zona = reglas.zonas.find((z) =>
    z.provincias.includes(codigo.slice(0, 4)) || z.departamentos.includes(codigo.slice(0, 2)));
  return zona ? zona.tarifa : reglas.tarifaResto;
}

/** Cuánto falta para el envío gratis (0 si ya se alcanzó). */
export function faltaParaGratis(subtotal, reglas) {
  const falta = Math.round(reglas.gratisDesde * 100) - Math.round(subtotal * 100);
  return Math.max(0, falta) / 100;
}
