// Árbol de ubigeo compacto de public/datos/ubigeo.json:
// [{ c: '15', n: 'Lima', p: [{ c: '1501', n: 'Lima', d: [['150117', 'Los Olivos'], ...] }] }]

/** Código de distrito → "Los Olivos, Lima, Lima" (distrito, provincia, departamento), o '' si no existe. */
export function lugarDe(arbol, ubigeo) {
  const codigo = String(ubigeo ?? '');
  const dep = arbol.find((x) => x.c === codigo.slice(0, 2));
  const prov = dep?.p.find((x) => x.c === codigo.slice(0, 4));
  const dist = prov?.d.find((x) => x[0] === codigo);
  return dist ? `${dist[1]}, ${prov.n}, ${dep.n}` : '';
}
