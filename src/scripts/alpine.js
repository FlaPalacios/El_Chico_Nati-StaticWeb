// Alpine en su build CSP: no usa eval, así la política de seguridad puede
// prohibirlo. La lógica va en Alpine.data(...) y Alpine.store(...), nunca en
// expresiones largas dentro de los atributos x-*.
import Alpine from '@alpinejs/csp';

window.Alpine = Alpine;
Alpine.start();
