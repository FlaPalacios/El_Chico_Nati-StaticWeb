// Se carga antes de pintar el catálogo de la portada (script clásico, no módulo).
// Con JS los controles se reservan su lugar y, si la URL trae un filtro, la rejilla
// espera invisible a que se aplique: así nada salta al cargar.
document.documentElement.classList.add('con-js');
if (/[?&](q|cat|sub|marca)=/.test(location.search)) {
  document.documentElement.classList.add('filtro-pendiente');
  // Red de seguridad: si el script del catálogo no llega a correr, la rejilla se muestra igual
  setTimeout(() => document.documentElement.classList.remove('filtro-pendiente'), 2500);
}
