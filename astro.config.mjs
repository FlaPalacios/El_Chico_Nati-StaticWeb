// Sitio 100 % estático: Astro compila todo a HTML en dist/ y no hay servidor.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://elchiconaturista.com',
  output: 'static',
  // Sin bloques de código en Markdown: el resaltado (Shiki) usa estilos en línea que la CSP no admite
  markdown: { syntaxHighlight: false },
  security: {
    // CSP en <meta> de cada página (PLAN-v2.md, tarea 6.5). Astro calcula el hash de cada
    // script y estilo en línea: no hace falta 'unsafe-inline' ni 'unsafe-eval' para scripts.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https://res.cloudinary.com",
        "font-src 'self'",
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      // Solo atributos style="" (variables de posición de los discos y el nombre de la
      // transición en la ficha): no ejecutan código. Los elementos <style> van por hash.
      styleDirective: { resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
