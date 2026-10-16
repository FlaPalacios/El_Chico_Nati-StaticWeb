// Sitio 100 % estático: Astro compila todo a HTML en dist/ y no hay servidor.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://elchiconaturista.com',
  output: 'static',
});
